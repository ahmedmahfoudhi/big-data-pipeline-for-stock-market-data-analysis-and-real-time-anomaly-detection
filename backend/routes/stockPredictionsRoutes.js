import express from 'express'
import { getAllPredictions } from '../controllers/stockPredictionsController.js'

const router = express.Router()
router.get('', getAllPredictions)

export default router