import express from 'express'
import dotenv from 'dotenv'
import imageRoutes from './routes/imageRoutes'
import errorHandler from './middleware/errorHandler'

dotenv.config()



const app = express()
app.use(express.json())

app.use('/api', imageRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

export default app