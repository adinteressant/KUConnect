import mongoose from 'mongoose'

const saveSchema = new mongoose.Schema({
    postId: {type: mongoose.Schema.Types.ObjectId, ref:'Post', required: true},
    userId: {type:String, ref:'PublicInfo', required: true}
})

export default mongoose.model('Save', saveSchema)