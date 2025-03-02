import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, setDoc, getDoc, doc, updateDoc,onSnapshot, deleteField} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDEcunpMzfEC4vRfThBraiA2O7gNVJdR_o",
  authDomain: "kuconnect-1e8d2.firebaseapp.com",
  projectId: "kuconnect-1e8d2",
  storageBucket: "kuconnect-1e8d2.firebasestorage.app",
  messagingSenderId: "747734859833",
  appId: "1:747734859833:web:6b3ad5e7146b35ec7a0de8",
  measurementId: "G-PY2DVP9WS2",
}

const app = initializeApp(firebaseConfig)
const firestore = getFirestore()

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
}

const createOffer = async (
  remoteStreamRef,
  localStream,
  remoteStream,
  socket

) => {
  
  const callCollection = collection(firestore, "calls") //call collection
  const callDoc = await addDoc(callCollection, {}) //auto generated id

  const offerCandidates = collection(callDoc, "offerCandidates") // offer table 
  const answerCandidates = collection(callDoc, "answerCandidates") // answer table

  const peerConnection = new RTCPeerConnection(servers)

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(offerCandidates, event.candidate.toJSON())
    }
  }

  remoteStream = new MediaStream()

  if (remoteStreamRef?.current) {
    remoteStreamRef.current.srcObject = remoteStream
  }

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream)
  })

  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)

  const offerDB = {
    sdp: offer.sdp,
    type: offer.type,
  }
  await setDoc(callDoc, offerDB, { merge: true })

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track)
    })
  }


  // Handling when the callDoc has any data, ie, an offer
  onSnapshot(callDoc, (snapshot) => {
    const data = snapshot.data()
    if (!peerConnection.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer)
      peerConnection.setRemoteDescription(answerDescription)
    }
  })
  //Handling when there's an answer from the remote if there had been an offer prior
  onSnapshot(answerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data())
        peerConnection.addIceCandidate(candidate)
      }
    })
  })

  socket?.emit('call_incoming',call_id)
  return [callDoc.id,peerConnection] // Return the call ID for future use
}

async function answerOffer(callId, remoteStreamRef, localStream) {
  
  const peerConnection = new RTCPeerConnection(servers);
  const callCollection = collection(firestore, "calls");
  const callDocRef = doc(callCollection, callId);
  const offerCandidates = collection(callDocRef, "offerCandidates");
  const answerCandidates = collection(callDocRef, "answerCandidates");


  // Setup remote stream for answerer
  const remoteStream = new MediaStream();
  if (remoteStreamRef.current) {
    remoteStreamRef.current.srcObject = remoteStream;
  }

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(answerCandidates, event.candidate.toJSON());
    }
  };

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };
 
  const callSnapshot = await getDoc(callDocRef); // gets the value of the offer, with the callID associated with the snapshot
  const callData = callSnapshot.data(); // gets the value of the offer

  if (!callData?.sdp) {
    throw new Error("No offer found in Firestore.");
  }

  const offerDescription = new RTCSessionDescription(callData);
  await peerConnection.setRemoteDescription(offerDescription);
  //Remote descrition(Peer B) = offer (Peer A)

  const answerDescription = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answerDescription);
  //localDescription (Peer B) = answer(Peer B)

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await setDoc(callDocRef, { answer }, { merge: true });

  onSnapshot(offerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data());
        peerConnection.addIceCandidate(candidate);
      }
    });
  });
  //console.log(peerConnection);
  return peerConnection;
}

async function createEndCall(peer){

  const callCollection = collection(firestore, "calls") //call collection
  const callDoc = await addDoc(callCollection, {}) //auto generated id
  //const offerCandidates = collection(callDoc, "offerCandidates") // offer table 
  //const answerCandidates = collection(callDoc, "answerCandidates") // answer table
  
  // Remove all event listeners
  peer.ontrack = null;
  peer.onremovetrack = null;
  peer.onicecandidate = null;
  peer.oniceconnectionstatechange = null;
  peer.onsignalingstatechange = null;
  
  // Close the connection
  peer.close();
  
  // Empty the array
  peer = null

  updateDoc(callDoc,{offerCandidates:deleteField()}) 
  updateDoc(callDoc,{answerCandidates:deleteField()})
}


export { createOffer, answerOffer, createEndCall}

