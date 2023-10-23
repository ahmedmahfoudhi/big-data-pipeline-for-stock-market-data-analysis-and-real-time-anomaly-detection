import StockAnalysisModel from "../models/stock_analysis.js"

export const getMetricById = async (req,res) => {
    const {id} = req.params
    const record = await StockAnalysisModel.find({id: id}).sort({created_at: 1}).limit(1)
    if(!record || !record.length) return res.status(404).json({error: `Metric with id ${id} does not exist`})
    console.log(record[0]);
    res.status(200).json(record[0])
}