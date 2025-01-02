import { create } from 'zustand'

const useNewMessages = create((set)=>({
  newMessages:[],
  setNewMessages: (newMessages) => set({newMessages})
}))

export default useNewMessages