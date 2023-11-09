import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import StockPredictionModel from './models/stock_prediction.js'
import StockAnalysisModel from './models/stock_analysis.js'
import http from 'http'
import stockAnalysisRoutes from './routes/stockAnalysisRoutes.js'
import stockPredictionRoutes from './routes/stockPredictionsRoutes.js'
import cors from 'cors'
import { Server } from 'socket.io'
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

dotenv.config()
const port = process.env.PORT || 3001
app.use(cors())
app.use('/stock_analysis', stockAnalysisRoutes)
app.use('/stock_prediction', stockPredictionRoutes)
const connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log("Successfully connected to the Database")
    } catch (error) {
        throw error
    }
}

io.on("connection", (socket) => {
    console.log("New client connected")
    socket.on("disconnect", () => {
        console.log("Client disconnected")
    })
})

server.listen(port, async() => {
    console.log(`Server is listening on port ${port}`)
    await connect()
    
})

StockPredictionModel.watch().on('change', (data) => {
    
    if(data.operationType === "insert"){
        const document = data.fullDocument
        console.log(document)
        io.emit('prediction', document)
    }
    
})

StockAnalysisModel.watch().on('change', (data) => {
    if(data.operationType === "insert"){
        const document = data.fullDocument
        io.emit(document.id, document)
    }
})

