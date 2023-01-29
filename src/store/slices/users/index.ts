import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as Automerge from '@automerge/automerge';
import User from '@/model/user';

export interface UsersDoc {
  users: User[];
}

export interface UsersState {
  sharedUsers: UsersDoc;
}

const initialState: UsersState = {
  sharedUsers: Automerge.init<UsersDoc>(),
};

export const usersSlice = createSlice({
  name: 'shared-users',
  initialState,
  reducers: {
    setSharedUsers: (state, action: PayloadAction<UsersDoc>) => {
      state.sharedUsers = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSharedUsers } = usersSlice.actions;
