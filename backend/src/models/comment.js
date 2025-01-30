import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: null
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    userId: {
        type: String,
        ref: 'PublicInfo',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    replies: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
})

export default mongoose.model('Comment', commentSchema)