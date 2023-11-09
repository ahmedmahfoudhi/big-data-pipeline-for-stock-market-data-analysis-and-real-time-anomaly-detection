import StockPredictionModel from "../models/stock_prediction.js";

export async function getAllPredictions(_, res){
    const result = await StockPredictionModel.find({}).sort({created_at: 1}) || [];
    res.status(200).json(result);
}