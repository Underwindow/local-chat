import { ChatsDoc } from '@/model/doc';
import RoomDTO from '@/model/room';
import UserDTO from '@/model/user';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as Automerge from '@automerge/automerge'

export interface AppState {
  user: UserDTO | null,
  activeRoom: RoomDTO | null,
  chats: ChatsDoc
}

const initialState: AppState = {
  user: null,
  activeRoom: null,
  chats: Automerge.init<ChatsDoc>(),
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserDTO>) => {
      state.user = action.payload
    },
    setActiveRoom: (state, action: PayloadAction<RoomDTO>) => {
      state.activeRoom = action.payload
    },
    setChats: (state, action: PayloadAction<ChatsDoc>) => {
      state.chats = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser, setActiveRoom, setChats } = sessionSlice.actions