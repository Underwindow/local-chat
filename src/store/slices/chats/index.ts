import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as Automerge from '@automerge/automerge'

export interface ChatRoom {
  title: string;
  id: string;
}

export interface ChatsDoc {
  chatRooms: ChatRoom[];
}

export interface AppState {
  chats: ChatsDoc
}

const initialState: AppState = {
  chats: Automerge.init<ChatsDoc>(),
}

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<ChatsDoc>) => {
      state.chats = action.payload
    },
  },
})

export const { setChats } = chatsSlice.actions