export interface Trade {
    trade_id: number
    currency_pair: string
    entry_price: number | null
    exit_price: number | null
    entry_time: string | null
    exit_time: string | null
    position_size: number
    profit: number
    status: 'PROFIT' | 'LOSS' | null
    strategy: string | null
    stop_loss: number | null
    take_profit: number | null
    risk_reward_ratio: number | null
    comment: string | null
}
