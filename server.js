const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'todo_database', // replace with your MySQL
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes

// Get all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY created_at DESC', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { task_name } = req.body;
  const query = 'INSERT INTO tasks (task_name, status) VALUES (?, ?)';
  db.query(query, [task_name, 'incomplete'], (err, result) => {
    if (err) throw err;
    res.status(201).json({ id: result.insertId, task_name, status: 'incomplete' });
  });
});

// Mark task as completed
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE tasks SET status = ? WHERE id = ?';
  db.query(query, ['completed', id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Task marked as completed' });
  });
});

// Get all tasks
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks ORDER BY created_at DESC', (err, results) => {
      if (err) throw err;
      res.json(results);  // Send tasks as response
    });
  });
  
// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Task deleted' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
