import type {UserRegisterFormValueType } from '@/types';
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware';

type UserStore = {
  stUser: Partial<UserRegisterFormValueType>&{
    accessToken:string
  };
  stFnUpdateUser: (stUser: Partial<UserRegisterFormValueType>) => void;
  stFnResetUserStore:()=>void
}

const useUserStore = create<UserStore>()(
  persist<UserStore>((set) => ({
    stUser: {
      email: "",
      firstName: "",
      lastName: "",
      accessToken:""
    },
    stFnUpdateUser: (user: Partial<UserRegisterFormValueType>) => set((state: UserStore) => ({ ...state, stUser: { ...state.stUser, ...user } })),
    stFnResetUserStore: () => set(() => ({
      stUser: {
        email: "",
        firstName: "",
        lastName: "",
        accessToken: ""
      }
    }))
  }),
    {
      name: 'user-storage-common-access', // unique name
      storage: createJSONStorage(() => localStorage), //
    },
  )
);


export default useUserStore;