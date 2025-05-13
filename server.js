const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    return;
  }
  console.log('✅ MySQL connected...');
});


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/contact', (req, res) => {
  const { fullName, email, message } = req.body;
  console.log(' Received contact form:', fullName, email, message);

  const sql = 'INSERT INTO contacts (full_name, email, message) VALUES (?, ?, ?)';
  db.query(sql, [fullName, email, message], (err, result) => {
    if (err) {
      console.error(' Failed to insert into DB:', err);
      return res.status(500).json({ error: 'Failed to save your info to the database' });
    }
    res.status(200).json({ message: '✅ Message stored in database' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// console.log('DB_USER from .env:', process.env.DB_USER);
