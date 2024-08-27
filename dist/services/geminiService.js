"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeImage = void 0;
const axios_1 = __importDefault(require("axios"));
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error('Api Key não encontrada!');
}
// criação do cliente axios
const geminiClient = axios_1.default.create({
    baseURL: 'https://api.google.com/gemini',
    headers: {
        'Content-Type': 'application/json'
    }
});
// função para analisar a imagem
const analyzeImage = (ImageData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Requisição para o endpoint de analise de imagem
        const response = yield geminiClient.post('/analyze', { image: ImageData }, {
            params: {
                key: GEMINI_API_KEY, // adicionando a API key nos parametros da URL
            },
        });
        return response.data;
    }
    catch (error) {
        throw new Error(`Erro ao analisar a imagem: ${error}`);
    }
});
exports.analyzeImage = analyzeImage;
