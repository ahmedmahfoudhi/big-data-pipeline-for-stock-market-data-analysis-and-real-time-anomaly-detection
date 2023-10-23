import mongoose from "mongoose"
const stockAnalysisSchema = new mongoose.Schema({
    id: String,
}, {collection: 'stock_analysis'})

const StockAnalysisModel = mongoose.model('stock_analysis', stockAnalysisSchema)
export default StockAnalysisModel