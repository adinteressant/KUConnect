
export default function getPictureController(req,res){
  
  const images = {
    1:"1.webp",
  }
  let image_index = req.params;
  console.log(req.params);
  console.log("endpoint hit!");
  res.sendFile(`${process.env.STATIC_FILE_DIRECTORY}${images[1]}`);

}
