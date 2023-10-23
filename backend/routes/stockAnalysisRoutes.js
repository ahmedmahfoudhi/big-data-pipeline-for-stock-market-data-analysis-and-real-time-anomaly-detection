import express from 'express'
import { getMetricById } from '../controllers/stockAnalysisController.js'

const router = express.Router()


router.get('/:id', getMetricById)

export default router