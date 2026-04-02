import express from 'express';
import connectDB from './config/connectDB.js';
import authRoutes from './routes/authRoutes.js'


const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)

app.use('/', (req, res) => res.send("Hello from server"))

const PORT = 3000

app.listen(PORT , async () => {
    await connectDB()
    console.log(`app running on http://localhost:${PORT}`)
})