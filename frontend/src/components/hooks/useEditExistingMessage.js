import { useState } from 'react'
import useConversation from '../../zustand/useConversation'

export const useEditExistingMessage = () => {
  const [loadingEdit,setLoadingEdit] = useState(false)
  const {setMessages,selectedConversation} = useConversation()
  const editExistingMessage = async (message='',id,callId='',receiverId='') => {
    setLoadingEdit(()=>true)
    try{
    const receiver_id = receiverId || selectedConversation.user_id 
      const response = 
      await fetch(`/api/edit-message?receiverId=${receiver_id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({message,id,callId})
        })
      const data = await response.json()
      setMessages(data.messages)
    }catch(e){
      console.log('error editing message ',e)
    }finally{
      setLoadingEdit(()=>false)
    }
  }

  return {loadingEdit,editExistingMessage}
}
