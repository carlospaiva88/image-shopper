import axios from 'axios'
import { error } from 'console'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
    throw new Error('Api Key não encontrada!')
}

const geminiCliente = axios.create({
    baseURL: 'https://api.google.com/gemini',
    headers: {
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
    }
})

export const analyzeImage = async (ImageData: Buffer) => {
    try {
        const response = await geminiCliente.post('/analyze', { image: ImageData})
        return response.data
    } catch (error) {
        throw new Error(`Erro ao analisar a imagem: ${error}`)
    }
}