import express from 'express';
import Book from "../models/book.mjs"
const router = express.Router();

router.get('/', async (req, res) => {
    let books
    try {
        books = await Book.find().sort({ createAt: 'desc' }).limit(10).exec()
    } catch {
        books = []
    }
    res.render('index', { books: books });
})

export default router

