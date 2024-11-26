import mongoose from "mongoose";
import path from 'path'
const coverImageBasePath = 'uploads/bookCovers'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Author name is required']
    },
    description: {
        type: String,
        required: true,
    },
    publishDate: {
        type: Date,
        required: true,
    },
    pageCount: {
        type: Number,
        required: true,
    },
    createdAtDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    coverImageName: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author',
    }
}, { timestamps: true });

bookSchema.virtual('coverimagePath').get(function () {
    if (this.coverImageName != null) {
        return `/public/uploads/bookCovers/${this.coverImageName}`
        // return path.join(__dirname, '/', coverImageBasePath, this.coverImageName);
    }

})

bookSchema.statics.coverImageBasePath = coverImageBasePath;

export default mongoose.model('Book', bookSchema);
