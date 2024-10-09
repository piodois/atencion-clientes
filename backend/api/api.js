import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('atenciones.db');

app.get('/data', (req, res) => {
    db.all('SELECT * FROM your_table', [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

export default app;