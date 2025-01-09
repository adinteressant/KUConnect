//import pkg from 'wrtc';
//const {RTCPeerConnection , RTCSessionDescription } = pkg;

export default function handleWebRTC(io){
//  const peers = {}
//
//  io.on('connection',(socket)=>{
//
//    console.log("Connection Request from Client!",socket.id);
//
//    socket.on('offer',async(id,description)=>{ // if an offer is made from a client
//      const peer = new RTCPeerConnection(); //creates a new peer and adds to peers
//      peers[id] = peer;
//      await peer.setRemoteDescription(new RTCSessionDescription(description)); // sets the other party's data as remoteDescription
//      const answer = await peer.createAnswer();
//
//      await peer.setLocalDescription(answer); //creates an answer and sends the answer to the localDescription
//      socket.emit('answer',id,peer.localDescription); 
//    });
//
//  socket.on('answer', async (id,description)=>{
//    const peer = peers[id];
//    await peer.setRemoteDescription(new RTCSessionDescription(description));
//    })
//
//  socket.on('candidate', async (id,candidate)=>{
//    const peer = peers[id];
//    await peer.setRemoteDescription(new RTCIceCandidate(candidate));
//    })
//
//  socket.on('disconnect',async (id)=>{
//    delete peers[id];
//    console.log('User Disconnected!');
//  })
//
//  })
//}
}
