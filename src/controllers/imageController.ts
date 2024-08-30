import { Storage } from '@google-cloud/storage'
import { Request, Response } from 'express'
import { pool, saveMeasurement, confirmMeasurement as confirmDBMeasurement } from '../db/db'
import { analyzeImage } from '../services/geminiService'
import { v4 as uuidv4 } from 'uuid'
import Joi from 'joi'

// Configuração do Google Cloud Storage
const bucketName: string = process.env.GCLOUD_STORAGE_BUCKET as string

if (!bucketName) {
    throw new Error('GCLOUD_STORAGE_BUCKET não definido!')
}

const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GCLOUD_KEY_FILE, // Caminho para o arquivo JSON com a chave de serviço
})

export const processImage = async (req: Request, res: Response) => {
    // Validação com Joi
    const schema = Joi.object({
        customer_code: Joi.string().required(),
        measure_datetime: Joi.date().iso().required(),
        measure_type: Joi.string().valid('WATER', 'GAS').required(),
    })

    const { error } = schema.validate(req.body)

    if (error) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: error.details[0].message,
        })
    }

    try {
        const { customer_code, measure_datetime, measure_type } = req.body
        const ImageData = req.file?.buffer

        if (!ImageData) {
            return res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: 'Imagem não fornecida',
            })
        }

        // Verificação de leituras duplicadas no mês atual
        const checkQuery = `
            SELECT * FROM measurements 
            WHERE customer_code = $1 
            AND measure_type = $2 
            AND date_trunc('month', measure_datetime) = date_trunc('month', $3::timestamp)
        `
        const existingMeasurements = await pool.query(checkQuery, [customer_code, measure_type, measure_datetime])
        if (existingMeasurements.rows.length > 0) {
            return res.status(409).json({
                error_code: 'DOUBLE_REPORT',
                error_description: 'Leitura do mês já realizada'
            })
        }

        const analysisResult = await analyzeImage(ImageData)

        // Validação do measure_value
        let measureValue = analysisResult.measure_value

        if (measureValue === null || isNaN(measureValue)) {
            return res.status(400).json({
                error_code: 'INVALID_MEASURE_VALUE',
                error_description: 'Valor medido é inválido ou não numérico',
            })
        }

        // Geração de um UUID único e verificação de duplicação
        let measure_uuid = analysisResult.measure_uuid

        const checkUUIDExists = async (uuid: string) => {
            const query = `SELECT 1 FROM measurements WHERE measure_uuid = $1`
            const result = await pool.query(query, [uuid])
            return result.rows.length > 0
        }

        while (await checkUUIDExists(measure_uuid)) {
            measure_uuid = uuidv4()
        }

        // Upload da imagem para o Google Cloud Storage
        const bucket = storage.bucket(bucketName)
        const blob = bucket.file(`${customer_code}/${measure_uuid}.jpg`)
        const blobStream = blob.createWriteStream()

        blobStream.on('error', (err) => {
            throw new Error(`Erro ao fazer upload da imagem: ${err.message}`)
        })

        blobStream.end(ImageData)

        // URL temporário para a imagem
        const image_url = `https://storage.googleapis.com/${bucketName}/${blob.name}`

        // Salvando os dados no db
        const measurementData = {
            customer_code,
            measure_datetime,
            measure_type,
            image_url,
            measure_value: measureValue,
            measure_uuid
        }

        await saveMeasurement(measurementData)

        res.status(200).json({
            image_url,
            measure_value: measureValue,
            measure_uuid
        })
    } catch (error) {
        res.status(500).json({
            error_code: 'INTERNAL_ERROR',
            error_description: `Erro ao processar a imagem: ${error}`
        })
    }
}
// Endpoint para confirmar a medição
export const confirmMeasurement = async (req: Request, res: Response) => {
    try {
        const { measure_uuid, confirmed_value } = req.body

        if (!measure_uuid || typeof confirmed_value !== 'number') {
            return res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: 'Dados fornecidos são inválidos',
            })
        }

        const result = await confirmDBMeasurement(measure_uuid, confirmed_value)

        if (!result) {
            return res.status(404).json({
                error_code: 'MEASURE_NOT_FOUND',
                error_description: 'Leitura não encontrada',
            })
        }

        res.status(200).json({ success: true })
    } catch (error) {
        res.status(500).json({
            error_code: 'INTERNAL_ERROR',
            error_description: `Erro ao confirmar a leitura: ${error}`,
        })
    }
}

