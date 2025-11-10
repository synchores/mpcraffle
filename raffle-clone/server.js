const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let participants = [];
let prizes = [];

// API to add a participant
app.post('/api/participants', (req, res) => {
    const { name, weight } = req.body;
    const newParticipant = { id: Date.now().toString(), name, weight };
    participants.push(newParticipant);
    res.status(201).json(newParticipant);
});

// API to get participants
app.get('/api/participants', (req, res) => {
    res.json(participants);
});

// API to delete a participant
app.delete('/api/participants/:id', (req, res) => {
    participants = participants.filter(p => p.id !== req.params.id);
    res.status(204).send();
});

// API to add a prize
app.post('/api/prizes', (req, res) => {
    const { name, weight } = req.body;
    const newPrize = { id: Date.now().toString(), name, weight };
    prizes.push(newPrize);
    res.status(201).json(newPrize);
});

// API to get prizes
app.get('/api/prizes', (req, res) => {
    res.json(prizes);
});

// API to delete a prize
app.delete('/api/prizes/:id', (req, res) => {
    prizes = prizes.filter(p => p.id !== req.params.id);
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});