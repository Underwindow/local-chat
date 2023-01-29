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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
