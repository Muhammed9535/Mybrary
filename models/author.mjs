import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Author name is required']
    }
});


const Author = mongoose.model('Author', authorSchema);
export default Author;