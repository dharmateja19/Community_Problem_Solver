import express from 'express';
import dotenv from 'dotenv'

import connectDB from './config/connectDB.js';
import authRoutes from './routes/authRoutes.js'
import authMiddleware from './middleware/auth.js'
import problemRoutes from './routes/problemRoutes.js'
import solutionRoutes from './routes/solutionRoutes.js'
import voteRoutes from './routes/voteRoutes.js'

dotenv.config()

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/problems',authMiddleware, problemRoutes)
app.use('/api/solutions', authMiddleware, solutionRoutes)
app.use('/api/votes', authMiddleware, voteRoutes)

app.use('/', (req, res) => res.send("Hello from server"))


const PORT = process.env.PORT || 3000

app.listen(PORT , async () => {
    await connectDB()
    console.log(`app running on http://localhost:${PORT}`)
})