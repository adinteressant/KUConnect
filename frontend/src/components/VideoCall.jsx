import { document } from "postcss"

export default function VideoCall(){

  function videoPlayer() {
  const video = document.querySelector('#videoElement');
    if(navigator.mediaDevices.getUserMedia){
      navigator.mediaDevices.getUserMedia({video:true})
        .then((stream)=>{
          video.srcObj = stream;
        })
        .catch((error)=>{
          console.log("Something went wrong!");
        });
    }
  }
  videoPlayer();
  return (
    <video autoplay="true" id="userVideoElement" className="bg-gray-200 w-500 b-375">
    </video>
  )
}
