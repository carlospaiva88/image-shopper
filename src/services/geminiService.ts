import axios from 'axios'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

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

