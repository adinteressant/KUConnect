import { create } from 'zustand'

const useReply = create((set)=>({
  reply:false,
  replyOf:{},
  setReply: (reply) => set({reply}),
  setReplyOf:(replyOf)=>{set({replyOf})}
}))

export default useReply