import express from 'express'
import dotenv from 'dotenv'
import imageRoutes from './routes/imageRoutes'


dotenv.config()


const app = express()
app.use(express.json())

app.use('/api', imageRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

export default app