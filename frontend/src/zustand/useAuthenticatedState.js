import { create } from 'zustand'

const useAuthenticatedState = create((set)=>({
  isAuthenticated: localStorage.getItem('isAuthenticated') == 'true' || false,
  setIsAuthenticated:(state) => set({ isAuthenticated: state }),
}))

export default useAuthenticatedState