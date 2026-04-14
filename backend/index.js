const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// koneksi MySQL (Laragon)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_react'
});

// cek koneksi
db.connect((err) => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected");
  }
});

// REGISTER
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (username, password) VALUES (?,?)',
    [username, hash],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Register berhasil");
    }
  );
});

// LOGIN
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username=?',
    [username],
    async (err, result) => {
      if (result.length === 0) return res.send("User tidak ada");

      const match = await bcrypt.compare(password, result[0].password);
      if (!match) return res.send("Password salah");

      res.send("Login berhasil");
    }
  );
});

app.get('/user/:username', (req, res) => {
  const { username } = req.params;

  db.query(
    'SELECT username, deskripsi FROM users WHERE username=?',
    [username],
    (err, result) => {
      if (err) return res.send(err);
      res.send(result[0]);
    }
  );
});

app.put('/update-username', (req, res) => {
  const { oldUsername, newUsername } = req.body;

  db.query(
    'UPDATE users SET username=? WHERE username=?',
    [newUsername, oldUsername],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Username berhasil diupdate");
    }
  );
});

app.put('/update-deskripsi', (req, res) => {
  const { username, deskripsi } = req.body;

  db.query(
    'UPDATE users SET deskripsi=? WHERE username=?',
    [deskripsi, username],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Deskripsi berhasil disimpan");
    }
  );
});

app.put('/delete-deskripsi', (req, res) => {
  const { username } = req.body;

  db.query(
    'UPDATE users SET deskripsi=NULL WHERE username=?',
    [username],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Deskripsi dihapus");
    }
  );
});

app.listen(3001, () => {
  console.log("Server running di port 3001");
});