import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./user/userSlice"
import flashCardReducer from "./flashCard/flashCardSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    flashCard: flashCardReducer,
  },
})