import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import ContactRoute from './routes/contactRoute.js'

const clientSite: string = process.env.clientSite as string | 'https://localhost:5173';
const app = express()
const PORT = 4000;

app.use(cors({
    origin: clientSite
}))
app.use(express.json())
app.use('/api/v1', ContactRoute)
app.listen(PORT, () => {
    console.log(`Server is running on PORT=${PORT}`)
})