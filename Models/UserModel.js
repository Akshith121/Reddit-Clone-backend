import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    id: String,
    username: {
        type: String,
        required: true
    },
    password: {
        type:String,
        required: true
    }
})

const User = mongoose.model('users', userSchema);

export default User;