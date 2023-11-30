import { Request, Response } from 'express'
import pool from '../services/db'
import { isArray, isEmpty } from 'lodash'
import { Trade } from '../models/tradesModel'

export const findTrades = async (req: Request, res: Response): Promise<void> => {
    try {
        const [trades] = await pool.execute('SELECT * FROM trade_log')
        res.status(200).json(trades)
    } catch (error) {
        console.log('Error executing SQL', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const findTradeById = async (req: Request, res: Response): Promise<void> => {
    const tradeId = req.params.tradeId

    try {
        const [trade] = await pool.execute(`SELECT * FROM trade_log WHERE trade_id = ?`, [tradeId])

        if (isArray(trade) && !isEmpty(trade)) {
            res.status(200).json(trade[0])
        } else {
            res.status(404).json({ error: 'Trade not found' })
        }
    } catch (error) {
        console.log('Error executing SQL', error)
        res.status(500).json({ error: ' Internal server error' })
    }
}

export const createTrade = async (req: Request, res: Response) => {
    const trade: Trade = req.body

    try {
        // Use placeholders in the SQL query to prevent SQL injection
        const addedTrade = await pool.execute(
            'INSERT INTO trade_log (currency_pair, entry_price, exit_price, entry_time, exit_time, position_size, profit, status, strategy, stop_loss, take_profit, risk_reward_ratio, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                trade.currency_pair,
                trade.entry_price,
                trade.exit_price,
                trade.entry_time,
                trade.exit_time,
                trade.position_size,
                trade.profit,
                trade.status,
                trade.strategy,
                trade.stop_loss,
                trade.take_profit,
                trade.risk_reward_ratio,
                trade.comment,
            ],
        )

        // If the insertion is successful, you can send a success response
        res.status(201).json({ message: 'Trade created successfully', addedTrade })
    } catch (error) {
        console.error('Error executing SQL:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const updateTradeById = async (req: Request<{ tradeId: number }>, res: Response): Promise<void> => {
    const tradeId = req.params.tradeId
    const updatedTrade: Trade = req.body

    try {
        const [updateResult] = await pool.execute(
            'UPDATE trade_log SET currency_pair = ?, entry_price = ?, exit_price = ?, entry_time = ?, exit_time = ?, position_size = ?, profit = ?, status = ?, strategy = ?, stop_loss = ?, take_profit = ?, risk_reward_ratio = ?, comment = ? WHERE trade_id = ?',
            [
                updatedTrade.currency_pair,
                updatedTrade.entry_price,
                updatedTrade.exit_price,
                updatedTrade.entry_time,
                updatedTrade.exit_time,
                updatedTrade.position_size,
                updatedTrade.profit,
                updatedTrade.status,
                updatedTrade.strategy,
                updatedTrade.stop_loss,
                updatedTrade.take_profit,
                updatedTrade.risk_reward_ratio,
                updatedTrade.comment,
                tradeId,
            ],
        )

        if ('affectedRows' in updateResult) {
            // If the update was successful, retrieve the updated record
            const [selectResult] = await pool.execute('SELECT * FROM trade_log WHERE trade_id = ?', [tradeId])

            if (isArray(selectResult) && !isEmpty(selectResult)) {
                res.status(200).json({ message: 'Trade updated successfully', trade: selectResult[0] })
            } else {
                res.status(500).json({ error: 'Failed to retrieve updated record' })
            }
        } else {
            res.status(404).json({ error: 'Trade not found' })
        }
    } catch (error) {
        console.error('Error executing SQL:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const deleteTradeById = async (req: Request<{ tradeId: number }>, res: Response): Promise<void> => {
    const tradeId = req.params.tradeId

    try {
        // Retrieve the trade before deletion
        const [selectResultBefore] = await pool.execute('SELECT * FROM trade_log WHERE trade_id = ?', [tradeId])

        // Delete the trade
        const [deleteResult] = await pool.execute('DELETE FROM trade_log WHERE trade_id = ?', [tradeId])

        if ('affectedRows' in deleteResult && deleteResult.affectedRows > 0) {
            // If the deletion was successful, return the record before deletion
            if (isArray(selectResultBefore) && !isEmpty(selectResultBefore)) {
                res.status(200).json({ message: 'Trade deleted successfully', trade: selectResultBefore[0] })
            } else {
                res.status(500).json({ error: 'Failed to retrieve deleted record' })
            }
        } else {
            res.status(404).json({ error: 'Trade not found' })
        }
    } catch (error) {
        console.error('Error executing SQL:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
