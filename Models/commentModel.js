import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    author: {type: String, required: true},
    title: {
        type: String,
        required: true
    },
    body: String,
    postedAt: {type: Date, default: Date.now()}
})

const Comment = mongoose.model('comments', commentSchema);

export default Comment;