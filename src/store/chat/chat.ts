import { ChatsDoc } from '@/model/chats-doc';
import RoomDto from '@/model/room';
import User from '@/model/user';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as Automerge from '@automerge/automerge'
import ChatMessage from '@/model/chat-message';

export interface ChatState {
  bubbles: ChatMessage[],
}

// const initialState: ChatState = {
//   bubbles: null,
//   chats: Automerge.init<ChatsDoc>(),
// }

// export const sessionSlice = createSlice({
//   name: 'session',
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<User>) => {
//       state.user = action.payload
//     },
//     setActiveRoom: (state, action: PayloadAction<RoomDto>) => {
//       state.activeRoom = action.payload
//     },
//     setChats: (state, action: PayloadAction<ChatsDoc>) => {
//       state.chats = action.payload
//     },
//   },
// })

// // Action creators are generated for each case reducer function
// export const { setUser, setActiveRoom, setChats } = sessionSlice.actions