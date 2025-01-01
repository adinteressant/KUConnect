import mongoose from 'mongoose'

const likeSchema = mongoose.Schema({
    postId: {type: mongoose.Schema.Types.ObjectId, ref:'Post', required: true},
    userId: {type: [String], ref: 'PublicInfo', default: []}
})

export default mongoose.model('Like', likeSchema)