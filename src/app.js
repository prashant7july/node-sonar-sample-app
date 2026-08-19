const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Node Sonar Sample App is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Intentionally simple function to give Sonar something to analyze
function add(a, b) {
  return a + b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

app.get('/add/:a/:b', (req, res) => {
  const a = Number(req.params.a);
  const b = Number(req.params.b);
  res.json({ result: add(a, b) });
});

module.exports = { app, add, divide };
