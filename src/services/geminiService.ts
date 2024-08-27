import axios from 'axios'
import dayjs from 'dayjs'
import {  Request, Response } from 'express'


const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const DATABASE = new Map<string, any>() // simula banco de dados

if (!GEMINI_API_KEY) {
    throw new Error('Api Key não encontrada!')
}

// criação do cliente axios
const geminiClient = axios.create({
    baseURL: 'https://api.google.com/gemini',
    headers: {
        'Content-Type': 'application/json'
    }
})


// função para analisar a imagem
export const analyzeImage = async (ImageData: Buffer) => {
    try {
        // Requisição para o endpoint de analise de imagem
        const response = await geminiClient.post('/analyze',
            { image: ImageData},
            {
                params: {
                    key:GEMINI_API_KEY, // adicionando a API key nos parametros da URL
                },
            }
        )
        
        return response.data
    } catch (error) {
        throw new Error(`Erro ao analisar a imagem: ${error}`)
    }
}

export const processImage = async (req: Request, res: Response) => {
    try {
        const {customer_code, measure_datetime, measure_type} = req.body
        const ImageData = req.file?.buffer

        if (!ImageData || !customer_code || !measure_datetime || !measure_type) {
            return res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: 'Dados fornecidos são inválidos',
            })
        }

        const currentMonth = dayjs().format('DD-MM-YYYY')
        const key = `${customer_code}-${measure_type}- ${currentMonth}`

        if (DATABASE.has(key)) {
            return res.status(409).json({
                error_code: 'DOUBLE_REPORT',
                error_description: 'Leitura do mês já realizada.'
            })
        }

        const analysisResult = await analyzeImage(ImageData)

        //simulando armazenamento de dados
        DATABASE.set(key, {
            image_url: analysisResult.image_url,
            measure_value: analysisResult.measure_value,
            measure_uuid: analysisResult.measure_uuid,
        })

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