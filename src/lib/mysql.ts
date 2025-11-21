import mysql, { Pool, PoolOptions, PoolConnection } from 'mysql2/promise';

// MySQL connection pool configuration
const poolConfig: PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Asdas!23',
  database: process.env.DB_NAME || 'iremworld',
  port: parseInt(process.env.DB_PORT || '3306'),
  
  // Memory optimization settings
  waitForConnections: true,
  connectionLimit: 5, // Reduced from 10 to 5 for memory savings
  queueLimit: 0,
  connectTimeout: 60000,
  
  // Connection pool optimization
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  
  // Character set and timezone
  charset: 'utf8mb4',
  timezone: '+00:00',
  
  // Memory and performance settings
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: true,
  debug: false,
  
  // SSL settings for production
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } as mysql.SslOptions
    : undefined
};

// Create MySQL connection pool
const pool: Pool = mysql.createPool(poolConfig);

// Connection event handling
pool.on('acquire', (connection: PoolConnection) => {
  console.log('🔗 MySQL connection acquired:', connection.threadId);
});

pool.on('enqueue', () => {
  console.log('⏳ Waiting for available connection slot');
});

// Error handling - using try-catch instead of event listener
const originalQuery = pool.query.bind(pool);
pool.query = async (...args: any[]) => {
  try {
    return await originalQuery(...args);
  } catch (error: any) {
    console.error('❌ MySQL query error:', error);
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('🔄 Attempting to reconnect to MySQL...');
    }
    throw error;
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    console.log('🔄 Closing MySQL connection pool...');
    await pool.end();
    console.log('✅ MySQL connection pool closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during MySQL shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export default pool;
