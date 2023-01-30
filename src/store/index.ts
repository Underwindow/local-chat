import { configureStore } from '@reduxjs/toolkit';
import { sessionSlice } from '@/store/slices/session';
import { chatsSlice } from '@/store/slices/chats';
import { chatRoomSlice } from '@/store/slices/chat-room';
import { usersSlice } from '@/store/slices/users';

export const store = configureStore({
  reducer: {
    sessionState: sessionSlice.reducer,
    chatsState: chatsSlice.reducer,
    chatRoomState: chatRoomSlice.reducer,
    usersState: usersSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
