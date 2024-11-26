import express from 'express';
import Author from '../models/author.mjs';

const router = express.Router();



// All  Authors Route

router.get('/', async (req, res) => {
    let searchOptions = {};

    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try {
        const authors = await Author.find(searchOptions);
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        });
    }
    catch {
        res.redirect('/')
    }
})

// New Author
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

// Create New Author
router.post('/', async (req, res) => {
    // const author = new Author({
    //     name: req.body.name,
    // });

    // try {
    //     const newAuthor = await author.save()
    //     // res.redirect(`authors/${newAuthor.id}`);
    //     res.redirect('authors')
    try {
        const name = req.body.name?.trim();
        if (!name) {
            return res.status(400).send('Author name is required.');
        }

        const author = new Author({ name });
        await author.save();
        res.redirect('/authors')
    } catch (e) {
        console.error("Error creating author:", e);
        res.render('authors/new', {
            author: author,
            errorMessage: "Error creating Author"
        })
    }

})

export default router

