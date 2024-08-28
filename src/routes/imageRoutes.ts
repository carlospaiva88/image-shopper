// Endpoints 

import { Router } from 'express'
import multer from 'multer'
import { processImage, confirmMeasurement } from '../controllers/imageController'
import { listMeasurements } from '../db/db'

const router = Router()

// configuração do multer para processar imagens
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/upload', upload.single('image'), processImage)
router.patch('/confirm', confirmMeasurement)
router.get('/customer_code/list', listMeasurements)

export default router