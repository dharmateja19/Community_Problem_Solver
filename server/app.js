import express from 'express';

const app = express()

app.use(express.json())

app.use('/', (req, res) => res.send("Hello from server"))

const PORT = 3000

app.listen(PORT , () => {
    console.log(`app running on http://localhost:${PORT}`)
})