import React, { useState, useEffect, useRef} from 'react';
import { useSearchParams} from 'react-router-dom';
import { createOffer, answerOffer, createEndCall } from '../utils/webRTC.js';
import { useSocketContext } from './context/socketContext.jsx';
import { Video,Phone,PhoneOff } from 'lucide-react';
import { useLocation } from 'react-router-dom'
import { useUpdateCallId } from './hooks/useUpdateCallId.js'
import { useEditExistingMessage } from './hooks/useEditExistingMessage.js'
import useDeleteCallId from './hooks/useDeleteCallId.js';

export default function VideoCall() {
  const [localStream, setLocalStream] = useState(null);
  const [queries]= useSearchParams();
  const [callId, setCallId] = useState(queries.get('call_id'));
  const [peerConnection,setPeerConnection] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const isFirstRender = useRef(0);
  const socket = useSocketContext();
  const authUserId = JSON.parse(localStorage.getItem('authUser'))
  const {editExistingMessage} = useEditExistingMessage()

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const receivedCallId = queryParams.get('callId')
  const messageId = queryParams.get('messageId')
  
  useEffect(()=>{
    if(isFirstRender.current == 0 && localStream != null){   
    async function generateCallIdOnLoad(){
      if((queries.get('start_call'))==='true'){
        await handleCreateOffer();
      }
    }
    generateCallIdOnLoad();
    }
    //return ()=>{
    //  isFirstRender.current=1
    //};
  },[localStream])

  useEffect(()=>{
    if(receivedCallId){
      setCallId(receivedCallId)
    }   
  },[])


  useEffect(()=>{

    if(isFirstRender.current == 0 && localStream != null){   
    async function joinCallOnId(){
      if((queries.get('call_id'))){
        //console.log(typeof(queries.get('call_id')))
        setCallId(queries.get('call_id'))
        await handleAnswerOffer();
      }
    }
    joinCallOnId();
    }
  },[localStream])


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
return () => { localStream?.getTracks().forEach(track => track.stop()); };
  }, []);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleCreateOffer = async () => {
    socket?.emit('call_incoming',callId,()=>{
      console.log("Call Being Ringed!")
    })
    const [generatedCallId,peerConnection] = await createOffer(remoteVideoRef, localStream,socket);
    setCallId(generatedCallId||'');
    useUpdateCallId(generatedCallId,authUserId,queries.get('userId'))
    setPeerConnection(peerConnection);
  };

  const handleAnswerOffer = async () => {
    if (callId) {
      let value = await answerOffer(callId, remoteVideoRef, localStream)
      console.log(value);
      setPeerConnection(value);
    }
  };
  
  const endCall = async ()=>{
    if(messageId){
      let receiverId = queryParams.get('receiverId')
      if(!receiverId){
        receiverId = queryParams.get('userId')
      }
      await Promise.all([editExistingMessage('',messageId,'expired',receiverId),useDeleteCallId(callId)])
    }
    console.log(peerConnection);
    await createEndCall(peerConnection);
  }

socket?.on('call_incoming',(arg,callback)=>{
  console.log(arg)
})

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto relative">
        {/* Main video container */}
        <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-xl">
          {/* Remote video (main view) */}
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
          
          {/* Local video (picture-in-picture) */}
          <div className="absolute top-4 right-4 w-1/4 aspect-video">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover rounded-lg border-2 border-white/20 shadow-lg"
              autoPlay
              playsInline
              muted
            />
          </div>
        </div>

        {/* Controls section */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-md">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            <button
              onClick={handleCreateOffer}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <Video className="w-5 h-5" />
              Start Call
            </button>

            <div className="flex-1">
              <input
                type="text"
                value={callId || ''}
                onChange={(e) => setCallId(e.target.value.trim())}
                placeholder="Enter call ID to join"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <button
              onClick={handleAnswerOffer}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              <Phone className="w-5 h-5" />
              Join Call
            </button>

            <button
              onClick={endCall}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
            >
              <PhoneOff className="w-5 h-5" />
              End Call
            </button>
          </div>

          {callId && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">
                Call ID: <span className="font-mono">{callId}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
