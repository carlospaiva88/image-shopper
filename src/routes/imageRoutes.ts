// Endpoints 

import { Router } from 'express'
import { getImageResults, processImage } from '../controllers/imageController'
import multer from 'multer'

const router = Router()

// configuração do multer para processar imagens
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/upload', upload.single('image'), processImage)
router.get('/results/:id', getImageResults)

export default router