import type {UserRegisterFormValueType, UserType } from '@/types';
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware';

type UserStore = {
  stUser: Partial<UserType>;
  stFnUpdateUser: (stUser: Partial<UserRegisterFormValueType>) => void;
  stFnResetUserStore:()=>void
}

const useUserStore = create<UserStore>()(
  persist<UserStore>((set) => ({
    stUser: {
      userId:null,
      email: "",
      firstName: "",
      lastName: "",
      isAdmin:false,
      accessToken: "",
      createdAt: "",
      updatedAt: "",
      groqApiKey:""
    },
    stFnUpdateUser: (user: Partial<UserRegisterFormValueType>) => set((state: UserStore) => ({ ...state, stUser: { ...state.stUser, ...user } })),
    stFnResetUserStore: () => set(() => ({
      stUser: {
        userId:null,
        email: "",
        firstName: "",
        lastName: "",
        isAdmin:false,
        accessToken: "",
        createdAt: "",
        updatedAt: "",
        groqApiKey:""
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