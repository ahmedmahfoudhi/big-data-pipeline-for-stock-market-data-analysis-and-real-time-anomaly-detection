import mongoose from "mongoose"
const stockPredictionSchema = new mongoose.Schema({
    date: String,
    high: Number,
    open: Number,
    close: Number,
    adj_close: Number,
    volume: Number,
    is_anomaly: Boolean
})
const StockPredictionModel = mongoose.model('stock_prediction', stockPredictionSchema)
export default StockPredictionModel