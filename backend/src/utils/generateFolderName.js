import { v4 as uuidv4 } from 'uuid'

export default function generateFolderName(req, res, next)
{
    req.folderName = `${Date.now()}-${uuidv4()}`

    next()
}