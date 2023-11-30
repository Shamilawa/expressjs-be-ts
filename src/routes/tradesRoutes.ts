import express from 'express'
import { createTrade, deleteTradeById, findTradeById, findTrades, updateTradeById } from '../controllers/tradeController'

const router = express.Router()

router.get('/all', findTrades)
router.get('/:tradeId', findTradeById)
router.post('/add', createTrade)
router.put('/:tradeId', updateTradeById)
router.delete('/:tradeId', deleteTradeById)

export default router
