import React, { useState, useEffect, useRef } from 'react';
import {createOffer }from '../utils/webRTC.js';
import { useSocketContext } from './context/socketContext.jsx';

export default function VideoCall() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  

  useEffect(() => {
    async function setup() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        }); // mediaSteam is the video object we obtain after granting perms
        setLocalStream(mediaStream); //sets the local stream state 
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    }
    
    setup();

    // Cleanup function
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  useEffect(() => {
    if (localStream && localVideoRef.current) { // if both localStream is incoming and video element is mounted
      localVideoRef.current.srcObject = localStream;

    createOffer(remoteVideoRef,localStream,remoteStream)
    }
  }, [localStream]); 

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {  
    remoteVideoRef.current.srcObject = localStream;
    createOffer(remoteVideoRef,localStream)
    }
  }, [remoteStream]); 
 
  return (
    <div className="p-12">
      <div className="grid grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div className="relative">
          <video
            ref={localVideoRef}
            className="bg-black w-full aspect-video rounded-lg shadow-lg"
            autoPlay
            playsInline
            muted
          />
        </div>
        <video
          ref={remoteVideoRef}
          className="bg-black w-full aspect-video rounded-lg shadow-lg"
          autoPlay
          playsInline
        />
      </div>
    </div>
  );
}
