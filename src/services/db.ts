import mysql from 'mysql2/promise'

// MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'trade_journal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

export const testDbConnection = async () => {
    let connection

    try {
        // Get a connection from the pool
        connection = await pool.getConnection()

        // Perform a simple query to check the connection
        const [rows] = await connection.query('SELECT 1')

        // If the query is successful, the connection is working
        console.log('Connected to the database!')
    } catch (error) {
        console.error('Error connecting to the database:', error)
    } finally {
        // Release the connection back to the pool
        if (connection) {
            connection.release()
        }
    }
}

export default pool
