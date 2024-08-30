import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'



const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
    throw new Error('API Key não encontrada!')
}

// Criação do cliente axios para a Cloud Vision API
const visionClient = axios.create({
    baseURL: 'https://vision.googleapis.com/v1',
    headers: {
        'Content-Type': 'application/json'
    }
})
const generateUUID = () => uuidv4() // gerando uuid com

// Função para analisar a imagem
export const analyzeImage = async (ImageData: Buffer) => {
    try {
        const base64Image = ImageData.toString('base64')

        // Requisição para o endpoint de análise de imagem
        const response = await visionClient.post(`/images:annotate?key=${GEMINI_API_KEY}`, {
            requests: [{
                image: {
                    content: base64Image
                },
                features: [{
                    type: 'TEXT_DETECTION' // DETECTA TEXTO NA IMAGEM
                }]
            }]
        })

        // Analisando a resposta da API
        const textAnnotations = response.data.responses[0]?.textAnnotations
        let measure_value: number | null = null

        if (textAnnotations && textAnnotations.length > 0) {
            const description = textAnnotations[0].description.trim()
            
            // Tenta converter para inteiro, removendo caracteres não numéricos se necessário
            const parsedValue = parseInt(description.replace(/\D/g, ''), 10)

            // Verifica se a conversão resultou em um número inválido (NaN)
            if (!isNaN(parsedValue)) {
                measure_value = parsedValue // Valor convertido é um número válido
            }
        }

        // Retornando os resultados
        return {
            image_url: 'http://example.com/fake_image.jpg', // Este é apenas um exemplo
            measure_value: measure_value,
            measure_uuid: generateUUID()
        }
    } catch (error) {
        throw new Error(`Erro ao analisar a imagem: ${error}`)
    }
}