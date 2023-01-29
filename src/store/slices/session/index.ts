import User from '@/model/user';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ChatRoom } from '@/store/slices/chats';

export interface AppState {
  user: User | null,
  activeRoom: ChatRoom | null,
}

const initialState: AppState = {
  user: null,
  activeRoom: null,
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    setActiveRoom: (state, action: PayloadAction<ChatRoom>) => {
      state.activeRoom = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser, setActiveRoom } = sessionSlice.actions