//Middleware
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// const __dirname = path.dirname(fileURLToPath(import.meta.url))

const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  limits: { fieldSize: 20 *1024*1024 }
}).array('images',10)


//Middleware to validate post content
export const validatePost = (req, res, next) => {
  const content = req.body.content
  const images = req.files.map(file => file.path)

  // Check if content is empty or exceeds the max length
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Post content cannot be empty.' })
  }

  if (content.length > 500) {
    return res.status(400).json({ message: 'Post content exceeds the maximum length of 500 characters.' })
  }

  if(images.length > 10)
  {
    return res.status(400).json({ message: 'A post cannot have more than 10 images.' })
  }

  next()
}

//Middleware to validate post deletion
export const validatePostDeletion = (req, res, next) => {
  const userId = req.params.userId
  const { post } = req.body
  
  if(userId !== post.userId)
  {
    return res.status(400).json({ message: 'Post cannot be deleted by another user' })
  }

  next()
}

//Middleware to validate user for edit
export const validateUser = (req, res, next) => {
  const post = JSON.parse(req.body.post)
  const userInfo = JSON.parse(req.body.userInfo)
  
  if(userInfo.user_id !== post.userId)
  {
    return res.status(400).json({ message: 'Post cannot be edited by another user' })
  }

  next()
}
