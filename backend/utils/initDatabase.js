const pool = require('../config/database');

const initDatabase = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS form_submissions (...)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS sub_headings (...)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS images (...)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS videos (...)`);
    console.log('Database tables initialized');
  } catch (err) {
    console.error('Database init failed:', err);
  }
};

module.exports = initDatabase;
