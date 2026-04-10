// server.js
const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch@2
const app = express();
const PORT = process.env.PORT || 3000;

// Servir le build du front
app.use(express.static('build'));

// Proxy pour l'API
app.use('/api', async (req, res) => {
  const url = `http://16.16.162.140:8000${req.url}`;
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' ? req.body : undefined,
    });
    const data = await response.text();
    res.send(data);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// Tout le reste sert le front
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
});

app.listen(PORT, () => console.log(`Front + proxy running on port ${PORT}`));