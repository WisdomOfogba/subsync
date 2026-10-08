import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  nextChargeDate: string;
  status: string;
}

interface SubSyncState {
  user: User | null;
  subscriptions: Subscription[];
  loading: boolean;
  setUser: (user: User | null) => void;
  setSubscriptions: (subs: Subscription[]) => void;
  addSubscription: (sub: Subscription) => void;
  updateSubscriptionStatus: (id: string, status: string) => void;
  deleteSubscription: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<SubSyncState>((set) => ({
  user: null,
  subscriptions: [],
  loading: true,
  setUser: (user) => set({ user }),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  addSubscription: (sub) => set((state) => ({ subscriptions: [sub, ...state.subscriptions] })),
  updateSubscriptionStatus: (id, status) => set((state) => ({
    subscriptions: state.subscriptions.map(sub => sub.id === id ? { ...sub, status } : sub)
  })),
  deleteSubscription: (id) => set((state) => ({
    subscriptions: state.subscriptions.filter(sub => sub.id !== id)
  })),
  setLoading: (loading) => set({ loading }),
}));
