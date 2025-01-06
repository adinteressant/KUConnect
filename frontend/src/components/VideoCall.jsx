import ReactWebcam from "react-webcam";


export default function VideoCall(){

  const videoConstraints = {
    facingMode: "user",
    disablePictureInPicture:true,
  };

  return (
    <div className="w-auto h-auto bg-gray-300 m-0"> 
    <ReactWebcam height={600} width={600} className="h-auto w-auto" videoConstraints={videoConstraints}/>
    </div>
  )
}
