const useDeleteCallId = async (callId) => {
  if(!callId){
    return
  }
  await fetch(`/api/message/delete-call-id`,{
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body:JSON.stringify({callId})
  })
  return
}

export default useDeleteCallId
