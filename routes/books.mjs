import express from 'express';
import Book from '../models/book.mjs';
import Author from '../models/author.mjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadPath = path.join(__dirname, '..', 'public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const router = express.Router();

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        // console.log(file.mimetype);
        if (imageMimeTypes.includes(file.mimetype)) {
            callback(null, true); // Accept file
        } else {
            callback(new Error('Invalid file type'), false); // Reject file with error
        }
    }
})

// All  Book Route

router.get('/', async (req, res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }

    if (req.query.publisBefore != null && req.query.publishBefore != '') {
        query = query.lte('publishDate', req.query.publisBefore)
    }

    if (req.query.publishAfter != null && req.query.publishAfter != '') {
        query = query.gte('publishDate', req.query.publishAfter)
    }
    try {
        const books = await query.exec();
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/');
    }
})

// New Book Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file ? req.file.filename : null;


    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })

    console.log("book to be saved", book);


    try {

        const newBook = await book.save();
        // res.redirect(`books/${newBook.id}`);   
        res.redirect('books');
    } catch (e) {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName);
        }
        renderNewPage(res, book, true);
    }
});

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.err(err);
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find();

        const params = {
            authors,
            book,
        }

        console.log('Book author', book.author)
        if (hasError) params.errorMessage = 'Error Creating Book';
        res.render('books/new', params)
    }
    catch (error) {
        console.error('Error rendering new book page:', error);
        res.redirect('/books')
    }
}

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message === 'Invalid file type') {
        return res.status(400).send(err.message);
    }
    res.status(500).send('Server error');
})
export default router;

