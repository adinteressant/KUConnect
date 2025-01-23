import React, { useState, useEffect, useRef } from 'react';
import { createOffer, answerOffer } from '../utils/webRTC.js';

export default function VideoCall() {
  const [localStream, setLocalStream] = useState(null);
  const [callId, setCallId] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

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
    };
  }, []);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleCreateOffer = async () => {
    const generatedCallId = await createOffer(remoteVideoRef, localStream);
    setCallId(generatedCallId|| '');
  };

  const handleAnswerOffer = async () => {
    if (callId) {
      await answerOffer(callId, remoteVideoRef, localStream);
    }
  };

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
      
      <div className="mt-8 space-y-4 max-w-4xl mx-auto">
        <div className="flex gap-4">
          <button
            onClick={handleCreateOffer}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Start Call
          </button>
          
        <input
          type="text"
          value={callId || ''}
          onChange={(e) => setCallId((e.target.value.trim() || ''))}
          placeholder="Enter Call ID"
          className="flex-1 px-4 py-2 border rounded-lg"
        />
          
          <button
            onClick={handleAnswerOffer}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Join Call
          </button>
        </div>
        
        <div className="text-gray-600 text-sm">
          {callId && `Call ID: ${callId}`}
        </div>
      </div>
    </div>
  );
}
