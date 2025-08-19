const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Endpoint untuk mendapatkan semua tugas
router.get('/', (req, res) => {
    db.query('SELECT * FROM buku', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// Endpoint untuk mendapatkan tugas berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM buku WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Buku tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan tugas baru
router.post('/', (req, res) => {
    const { judul, penulis, tahun } = req.body;
    if (!judul || judul.trim() === '' || !penulis || penulis.trim() === '' || !tahun) {
        return res.status(400).send('Semua field harus diisi');
    }

    db.query('INSERT INTO buku (judul, penulis, tahun) VALUES (?, ?, ?)', [judul.trim(), penulis.trim(), tahun], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newBook = { id: results.insertId, judul: judul.trim(), penulis: penulis.trim(), tahun };
        res.status(201).json(newBook);
    });
});

// Endpoint untuk memperbarui tugas
router.put('/:id', (req, res) => {
    const { judul, penulis, tahun } = req.body;

    db.query('UPDATE buku SET judul = ?, penulis = ?, tahun = ? WHERE id = ?', [judul, penulis, tahun, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Buku tidak ditemukan');
        res.json({ id: req.params.id, judul, penulis, tahun });
    });
});

// Endpoint untuk menghapus tugas
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM buku WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Buku tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;