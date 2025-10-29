// test_db_connection.js
const mysql = require('mysql2/promise');
const config = require('./db_config.js');

async function testDBConnection() {
  try {
    console.log('🔍 Testing database connection...');

    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port
    });

    console.log('✅ Successfully connected to the database!');

    // Optional: test a simple query
    const [rows] = await connection.execute('SELECT VERSION() AS version;');
    console.log('Database version:', rows[0].version);

    await connection.end();
    console.log('🔒 Connection closed.');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
}

testDBConnection();
