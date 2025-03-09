import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

export const SocketContext = createContext()

export const useSocketContext = () => {
  return useContext(SocketContext)
}

export const SocketContextProvider = (({children})=>{
  const [socket,setSocket] = useState(null)
  const [onlineUsers,setOnlineUsers] = useState([])
  let authUserId=''
  if(localStorage.getItem('authUser') && localStorage.getItem('authUser')!='undefined'){
    authUserId = JSON.parse(localStorage.getItem('authUser'))
  } 
  useEffect(()=>{
    if(authUserId){
      // HARDCODED SOCKET SERVER
      const socket = io('https://HARDCODED_IP_HERE',{
        query:{
          userId:authUserId
         },
      })
      setSocket(socket)
      socket.on('getOnlineUsers',(users)=>{
        setOnlineUsers(users)
      })
      return ()=> socket.close() //cleanup the socket connection on unmount 
    }else{
      if(socket){
        socket.close()
        setSocket(null)
      }
    }
  },[authUserId])
  return (
    <SocketContext.Provider value={{socket,onlineUsers}}>
      {children}
    </SocketContext.Provider>
  )
})
