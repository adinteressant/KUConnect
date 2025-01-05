import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema({
    userId: {type: String, ref: 'PublicInfo', required: true},
})

const replySchema = new mongoose.Schema({
    userId: {type: String, ref: 'PublicInfo', required: true},
    content: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    likes: {type: [likeSchema], default: []},
    replies: {type: [this], default: []},
    likesCount: {type: Number, default: 0}
})

const commentSchema = new mongoose.Schema({
    postId: {type: mongoose.Schema.Types.ObjectId, ref:'Post', required: true},
    userId: {type: String, ref: 'PublicInfo', required: true},
    content: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    likes: {type: [likeSchema], default: []},
    replies: {type: [replySchema], default: []},
    likesCount: {type: Number, default: 0},
    repliesCount: {type: Number, default: 0}
})

export default mongoose.model('Comment', commentSchema)