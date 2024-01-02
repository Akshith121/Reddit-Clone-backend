import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    author: {type: String, required: true},
    title: {
        type: String,
        required: true
    },
    profile: String,
    image: String,
    category: String,
    postedAt: {type: Date, default: Date.now()}
})

const Post = mongoose.model('posts', postSchema);

export default Post;