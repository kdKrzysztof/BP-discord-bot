import mongoose from "mongoose";

const schema = mongoose.Schema

const usernameListSchema = new schema({
    bpUsername: {
        type: String,
        required: true
    },
    discordId: {
        type: String,
        required: true,
    },
    isBanned: {
        type: Boolean,
        required: false
    }
}, {timestamps: true})

const usernameList = mongoose.model('Users', usernameListSchema)

export default usernameList