
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore,collection, getDocs} from "firebase/firestore/lite"
const firebaseConfig = {
  apiKey: "AIzaSyDEcunpMzfEC4vRfThBraiA2O7gNVJdR_o",
  authDomain: "kuconnect-1e8d2.firebaseapp.com",
  projectId: "kuconnect-1e8d2",
  storageBucket: "kuconnect-1e8d2.firebasestorage.app",
  messagingSenderId: "747734859833",
  appId: "1:747734859833:web:6b3ad5e7146b35ec7a0de8",
  measurementId: "G-PY2DVP9WS2"
};

const app = initializeApp(firebaseConfig);


const firestore = getFirestore()

let token = null;
let uid = String(Math.floor(Math.random()*10000))

let client;
let channel;

const servers = 
  {
    iceServers:[
      {
        urls: ['stun:stun1.l.google.com:19302','stun:stun2.l.google.com:19302']
      },
    ],
    iceCandidatePoolSize:10,
  }



let createOffer = async(remoteStreamRef,localStream,remoteStream)=>{
  
  const callCollection = collection(firestore,'calls');
  const callDoc = await getDocs(callCollection)
  const offerCandidates = collection(firestore,'offerCandidates');
  const answerCandidates = collection(firestore,'answerCandidates');
  let peerConnection = new RTCPeerConnection(servers);
 
  peerConnection.onicecandidate = (e)=>{
    e.candidate && offerCandidates.add(e.candidate.toJSON());
  }

  remoteStream = new MediaStream();

  remoteStreamRef.current.srcObject = remoteStream 

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track,localStream) 
  });

  let offer = await peerConnection.createOffer()

  await peerConnection.setLocalDescription(offer)
  
  const offerDB = {
    sdp:offer.sdp,
    type:offer.type,
  }
  await callDoc.set({ offer }); 

  console.log(peerConnection)

  peerConnection.ontrack = (event)=>{
    event.streams[0].getTracks().forEach((track)=>{
      remoteStream.addTrack(addTrack())
    })
  }
  callDoc.onSnapshot((snapshot)=>{ 
    const data = snapshot.data();
    if(!peerConnection.currentRemoteDescription && data?.answer){
      const answerDescription = new RTCSessionDescription(data.answer);
      peerConnection.setRemoteDescription(answerDescription);
    }
  })

  //when call is answered, the peer connection is added to the sigmadb
  answerCandidates.onSnapshot((snapshot)=>{
    snapshot.docChanges().forEach((change)=>{
      if(change =='added'){
        const candidate = new RTCIceCandidate(change.doc.data());
        peerConnection.addIceCandidate(candidate);
      }
    })
  })//listens to new added document
}



export {createOffer}
