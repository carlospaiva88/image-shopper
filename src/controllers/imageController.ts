import {  Request, Response } from 'express'
import { saveMeasurement, confirmMeasurement as confirmDBMeasurement } from '../db/db'
import { analyzeImage } from '../services/geminiService'


// Endpoint para processar a imagem
export const processImage = async (req: Request, res: Response) => {
    try {
        const { customer_code, measure_datetime, measure_type } = req.body
        const ImageData = req.file?.buffer

        if (!ImageData || !customer_code || !measure_datetime || !measure_type) {
            return res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: 'Dados fornecidos são inválidos',
            })
        }

        const analysisResult = await analyzeImage(ImageData)
        

        // Preparando os dados para salvar no db
        
        const measurementData = {
            customer_code,
            measure_datetime,
            measure_type,
            image_url: analysisResult.image_url,
            measure_value: analysisResult.measure_value,
            measure_uuid: analysisResult.measure_uuid
        }

        // Salvando os dados no db
        await saveMeasurement(measurementData)
        
        res.status(200).json({
            image_url: analysisResult.image_url,
            measure_value: analysisResult.measure_value,
            measure_uuid: analysisResult.measure_uuidm
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

