import dotenv from 'dotenv';
dotenv.config();



import express from 'express'
import expressLayouts from "express-ejs-layouts";
import path from 'path';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.mjs';
import mongoose from 'mongoose';


mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection;

db.on('error', error => console.error(error));
db.once('open', () => console.log("connected to mongoose"));

const app = express();
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'))

app.listen(process.env.PORT || 3000)
app.use('/', indexRouter);