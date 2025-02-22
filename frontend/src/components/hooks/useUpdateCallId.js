export const useUpdateCallId = async (callId,senderId,receiverId) => {
  await fetch(`/api/message/update-call-id`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      senderId, 
      receiverId,
      callId
    })
  })
  return
}

export const useGetUpdateCallId = async (senderId,receiverId) => {
  let response
  try{
    response = await fetch(`/api/message/get-call-id`,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
       senderId,
       receiverId
      })
    })
  }catch(e){
    console.log(e)
  }
  let data
  try{
    data = await response.json()
  }catch(e){
    console.log(e)
  }
  return data
}
