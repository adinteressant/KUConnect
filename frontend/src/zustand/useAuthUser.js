import { create } from 'zustand'

const useAuth = create((set)=>({
  authUserId:'',
  setAuthUserId: (authUserId) => set({authUserId})
}))

export default useAuth