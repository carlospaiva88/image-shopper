import express from 'express'
import dotenv from 'dotenv'
import imageRoutes from './routes/imageRoutes'
import errorHandler from './middleware/errorHandler'
import { createTable } from './db/db'

dotenv.config()

// Chame createTable ao iniciar o servidor
createTable().then(() => {
    console.log('Tabela criada com sucesso')
}).catch((err) => {
    console.error('Erro ao criar a tabela', err)
})

const app = express()
app.use(express.json())

app.use('/api', imageRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

export default app