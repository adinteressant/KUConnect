import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

export const SocketContext = createContext()

export const useSocketContext = () => {
  return useContext(SocketContext)
}

export const SocketContextProvider = (({children})=>{
  const [socket,setSocket] = useState(null)
  const [onlineUsers,setOnlineUsers] = useState([])
  const authUserId = JSON.parse(localStorage.getItem('authUser'))
  useEffect(()=>{
    if(authUserId){
      const socket = io('http://localhost:4000',{
        query:{
          userId:authUserId
        }
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