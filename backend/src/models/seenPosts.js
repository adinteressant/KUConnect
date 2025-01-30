import mongoose from 'mongoose'

const seenPostSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'PublicInfo',
        required: true
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post',
        default: []
    }
})

export default mongoose.model('SeenPost', seenPostSchema)