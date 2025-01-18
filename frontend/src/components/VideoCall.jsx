import ReactWebcam from "react-webcam";
import React from 'react';


export default function VideoCall(){
  const videoConstraints = {
    facingMode: "user",
    disablePictureInPicture:true,
  };

  return (
    <div className="w-auto h-auto m-0"> 
    <ReactWebcam height={600} width={600} className="h-auto w-auto" videoConstraints={videoConstraints}/>
    </div>
  )
}
