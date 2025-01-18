import ReactWebcam from "react-webcam";
import { useTheme } from "./context/themeContext";
import React, {useEffect} from 'react';


export default function VideoCall(){
  const {theme, toggleTheme} = useTheme();
useEffect(() => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [theme]);
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
