import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createOffer, answerOffer, createEndCall } from '../utils/webRTC.js';
import { useSocketContext } from './context/socketContext.jsx';
import { Video, Phone, PhoneOff, Mic, MicOff, Camera, CameraOff, Clock, Star } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useUpdateCallId } from './hooks/useUpdateCallId.js';
import { useEditExistingMessage } from './hooks/useEditExistingMessage.js';
import useDeleteCallId from './hooks/useDeleteCallId.js';
import {formatTime} from '../utils/timeConversion.js';

export default function VideoCall() {
  const [localStream, setLocalStream] = useState(null);
  const [queries] = useSearchParams();
  const [callId, setCallId] = useState(queries.get('call_id'));
  const [peerConnection, setPeerConnection] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const isFirstRender = useRef(0);
  
  const socket = useSocketContext();
  const authUserId = JSON.parse(localStorage.getItem('authUser'));
  const { editExistingMessage } = useEditExistingMessage();
  const [endCallScreen, setEndCallScreen] = useState(false);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const receivedCallId = queryParams.get('callId');
  const messageId = queryParams.get('messageId');
  
  // Start timer function
  const startTimer = () => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // Handle media toggle functions
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };
  
  useEffect(() => {
    if (isFirstRender.current == 0 && localStream != null) {
      async function generateCallIdOnLoad() {
        if ((queries.get('start_call')) === 'true') {
          await handleCreateOffer();
          startTimer();
        }
      }
      generateCallIdOnLoad();
    }
  }, [localStream]);
  
  useEffect(() => {
    if (receivedCallId) {
      setCallId(receivedCallId);
    }
  }, []);
  
  useEffect(() => {
    if (isFirstRender.current == 0 && localStream != null) {
      async function joinCallOnId() {
        if ((queries.get('call_id'))) {
          setCallId(queries.get('call_id'));
          await handleAnswerOffer();
          startTimer();
        }
      }
      joinCallOnId();
    }
  }, [localStream]);
  
  useEffect(() => {
    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };
    setupMedia();
    return () => { 
      localStream?.getTracks().forEach(track => track.stop());
      if (timerInterval) clearInterval(timerInterval);
    };
  }, []);
  
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);
  

  const handleCreateOffer = async () => {
    socket?.emit('call_incoming', callId, () => {
      console.log("Call Being Ringed!");
    });
    const [generatedCallId, peerConnection] = await createOffer(remoteVideoRef, localStream, socket);
    setCallId(generatedCallId || '');
    useUpdateCallId(generatedCallId, authUserId, queries.get('userId'));
    setPeerConnection(peerConnection);
  };
  
  const handleAnswerOffer = async () => {
    if (callId) {
      let value = await answerOffer(callId, remoteVideoRef, localStream);
      console.log(value);
      setPeerConnection(value);
    }
  };
  
  const endCall = async () => {
    if (timerInterval) clearInterval(timerInterval);
    
    if (messageId) {
      let receiverId = queryParams.get('receiverId');
      if (!receiverId) {
        receiverId = queryParams.get('userId');
      }
      await Promise.all([
        editExistingMessage('', messageId, 'expired', receiverId),
        useDeleteCallId(callId)
      ]);
    }
    
    await createEndCall(peerConnection);
    setEndCallScreen(true);
  };
  

  const handleSubmitFeedback = () => {
    // Here you would send the feedback to your backend
    window.location.href = '/'; // Navigate home after feedback
  };
  
  const handleCloseEndCallScreen = () => {
    // window.location.href = '/'; // Navigate home without feedback
    window.open('', '_self').close()
  };
  
  socket?.on('call_incoming', (arg, callback) => {
    console.log(arg);
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto relative">
        
        {/* Main video container */}
        <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
          {/* Remote video (main view) */}
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
          
          {/* Local video (picture-in-picture) */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-1/3 sm:w-1/4 aspect-video">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover rounded-lg border-2 border-white/20 shadow-lg"
              autoPlay
              playsInline
              muted
            />
          </div>
          
          {/* Call duration display */}
          {callDuration > 0 && (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/50 px-2 py-1 rounded-md flex items-center">
              <Clock className="w-4 h-4 text-white mr-1" />
              <span className="text-white text-xs sm:text-sm">
                {formatTime ? formatTime(callDuration) : `${Math.floor(callDuration / 60)}:${String(callDuration % 60).padStart(2, '0')}`}
              </span>
            </div>
          )}
        </div>
        
        {/* Controls section */}
        <div className="mt-3 sm:mt-6 bg-gray-800 rounded-xl p-3 sm:p-6 shadow-lg border border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Call controls */}
            <div className="flex gap-3 sm:gap-4 order-2 sm:order-1 w-full sm:w-auto justify-center sm:justify-start">
              <button
                onClick={handleAnswerOffer}
                className="flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-black rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Join</span>
              </button>
              
              <button
                onClick={endCall}
                className="flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">End</span>
              </button>
            </div>
            
            {/* Media controls */}
            <div className="flex gap-4 order-1 sm:order-2">
              <button
                onClick={toggleMute}
                className={`flex items-center justify-center p-2 sm:p-3 rounded-full transition-colors duration-200 ${
                  isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
              </button>
              
              <button
                onClick={toggleVideo}
                className={`flex items-center justify-center p-2 sm:p-3 rounded-full transition-colors duration-200 ${
                  isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isVideoOff ? <CameraOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
              </button>
            </div>
          </div>
          
          {/* Call ID information */}
          {callId && (
            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-700 rounded-lg border border-gray-600 text-center sm:text-left">
              <p className="text-gray-300 text-xs sm:text-sm font-medium truncate">
                Call ID: <span className="font-mono text-blue-400">{callId}</span>
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* End Call Screen Modal */}
      {endCallScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-4 sm:p-6 bg-white rounded-xl shadow-2xl animate-fadeIn dark:bg-slate-800">
            {/* Call ended header */}
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 bg-cyan-100 rounded-full">
                <PhoneOff className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-500" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Call Ended</h1>
              
              {callDuration > 0 && (
                <div className="mt-2 flex items-center text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                    {formatTime ? formatTime(callDuration) : `${Math.floor(callDuration / 60)}:${String(callDuration % 60).padStart(2, '0')}`}
                  </span>
                </div>
              )}
            </div>           
            {/* Action buttons */}
            <div className="flex space-x-4">
              <button 
                onClick={handleCloseEndCallScreen}
                className="text-gray-100 flex-1 px-4 py-2 sm:py-3 text-sm sm:text-base font-medium bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-all hover:shadow-md"
              >
               Close  
              </button>
            </div>
            
            <p className="mt-4 text-xs text-center text-gray-500">
              Call ended at {new Date().toLocaleTimeString()} • Thank you for using our service
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
