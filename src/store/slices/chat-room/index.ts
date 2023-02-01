import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as Automerge from '@automerge/automerge';
import User from '@/model/user';

export interface Reply {
  messageId: string;
  username: string;
  text: string;
}

export interface MessageContent {
  text: string;
  imageId: string | null;
  reply: Reply | null;
}

export interface ChatMessage {
  id: string;
  user: User;
  date: string;
  contents: MessageContent;
}

export interface ChatDoc {
  messages: ChatMessage[];
}

export interface ChatRoomState {
  chatDoc: ChatDoc;
  reply: Reply | null;
}

const initialState: ChatRoomState = {
  chatDoc: Automerge.init<ChatDoc>(),
  reply: null
};

export const chatRoomSlice = createSlice({
  name: 'chat-room',
  initialState,
  reducers: {
    setChatRoom: (state, action: PayloadAction<ChatDoc>) => {
      state.chatDoc = action.payload;
    },
    setReply: (state, action: PayloadAction<Reply | null>) => {
      state.reply = action.payload;
    },
  },
});

export const { setChatRoom, setReply } = chatRoomSlice.actions;
