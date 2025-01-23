import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, setDoc, getDoc, doc, onSnapshot } from "firebase/firestore"

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
) => {
  const callCollection = collection(firestore, "calls")
  const callDoc = await addDoc(callCollection, {}) // Firestore generates ID

  const offerCandidates = collection(callDoc, "offerCandidates")
  const answerCandidates = collection(callDoc, "answerCandidates")

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

  onSnapshot(callDoc, (snapshot) => {
    const data = snapshot.data()
    if (!peerConnection.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer)
      peerConnection.setRemoteDescription(answerDescription)
    }
  })

  onSnapshot(answerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data())
        peerConnection.addIceCandidate(candidate)
      }
    })
  })

  return callDoc.id // Return the call ID for future use
}

async function answerOffer(callId, remoteStreamRef, localStream) {
  
  const callCollection = collection(firestore, "calls");
  const callDocRef = doc(callCollection, callId);
  const offerCandidates = collection(callDocRef, "offerCandidates");
  const answerCandidates = collection(callDocRef, "answerCandidates");

  const peerConnection = new RTCPeerConnection(servers);

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

  const callSnapshot = await getDoc(callDocRef);
  const callData = callSnapshot.data();

  if (!callData?.sdp) {
    throw new Error("No offer found in Firestore.");
  }

  const offerDescription = new RTCSessionDescription(callData);
  await peerConnection.setRemoteDescription(offerDescription);

  const answerDescription = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answerDescription);

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

  return peerConnection;
}

export { createOffer, answerOffer }

