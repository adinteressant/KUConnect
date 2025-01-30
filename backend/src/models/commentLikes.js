import mongoose from "mongoose"

const commentLikeSchema = new mongoose.Schema({
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    userId : {
        type: [String],
        ref: 'PublicInfo',
        default: []
    }
})

export default mongoose.model('CommentLike', commentLikeSchema)