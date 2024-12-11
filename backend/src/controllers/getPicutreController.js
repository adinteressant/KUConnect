export default function getPictureController(req,res){
  
  const images = {
    '1':"1.webp",
    '2':"2.webp",
    '3':"3.webp",
    '4':"4.webp",
    '5':"5.webp",
  }
  const image_index = req.query.id;
  res.sendFile(`${process.env.STATIC_FILE_DIRECTORY}${images[image_index]}`);
}
