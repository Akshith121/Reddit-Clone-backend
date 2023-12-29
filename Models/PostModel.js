import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    password: {
        type:String,
        required: true
    }
})

const Post = mongoose.model('posts', userSchema);

export default Post;