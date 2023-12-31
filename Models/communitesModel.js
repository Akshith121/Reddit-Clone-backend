import mongoose from "mongoose";

const communitySchema = mongoose.Schema({
    name: {type: String, required: true},
    profile: {type: String, required: true},
    members: Number
})

const Community = mongoose.model('communities', communitySchema);

export default Community;