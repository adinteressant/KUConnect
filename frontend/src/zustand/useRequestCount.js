import { create } from 'zustand';

const useRequestCount = create((set) => ({
  incomingRequestsCount: 0,
  setIncomingRequestsCount: (count) => set({ incomingRequestsCount: count }),
}));

export default useRequestCount;
