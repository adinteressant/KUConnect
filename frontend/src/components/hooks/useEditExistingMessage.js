import { useState } from 'react'
import useConversation from '../../zustand/useConversation'

export const useEditExistingMessage = () => {
  const [loadingEdit,setLoadingEdit] = useState(false)
  const {setMessages,selectedConversation} = useConversation()
  const editExistingMessage = async (message='',id,callId='') => {
    setLoadingEdit(()=>true)
    try{
      const response = 
      await fetch(`/api/edit-message?receiverId=${selectedConversation.user_id}`,
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
