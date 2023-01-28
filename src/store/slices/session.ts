import RoomDTO from '@/model/room';
import UserDTO from '@/model/user';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AppState {
  user: UserDTO | null,
  activeRoom: RoomDTO | null,
}

const initialState: AppState = {
  user: null,
  activeRoom: null
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
  },
})

// Action creators are generated for each case reducer function
export const { setUser, setActiveRoom } = sessionSlice.actions