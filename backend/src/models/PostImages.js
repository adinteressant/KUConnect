import mongoose from 'mongoose'

const postImagesSchema = new mongoose.Schema({
    images: { type: [ String ], default: [] }
})

export default mongoose.model('PostImages', postImagesSchema)