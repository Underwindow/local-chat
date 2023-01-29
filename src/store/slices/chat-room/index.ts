import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as Automerge from '@automerge/automerge';
import User from '@/model/user';

export interface MessageContent {
  text: string;
  image: string | null;
  quote: ChatMessage | null;
}

export interface ChatMessage {
  id: string;
  user: User;
  date: string;
  contents: MessageContent;
}

export interface ChatRoomDoc {
  messages: ChatMessage[];
}

export interface ChatRoomState {
  chatRoom: ChatRoomDoc;
}

const initialState: ChatRoomState = {
  chatRoom: Automerge.init<ChatRoomDoc>(),
};

export const chatRoomSlice = createSlice({
  name: 'chat-room',
  initialState,
  reducers: {
    setChatRoom: (state, action: PayloadAction<ChatRoomDoc>) => {
      state.chatRoom = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setChatRoom } = chatRoomSlice.actions;
