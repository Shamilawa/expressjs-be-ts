import express from 'express'
import tradeRoutes from './routes/tradesRoutes'
import { testDbConnection } from './services/db'

const app = express()
const PORT = 8081 //move this env file

app.use(express.json())

// routes
app.use('/api/trade', tradeRoutes)

// starting the server
app.listen(PORT, () => {
    console.log(`Server is start at port ${PORT}`)
    testDbConnection()
})
