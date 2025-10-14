import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import * as userService from "~/service/userService"

const initialState = {
  value: 0,
}

export const fetchUserRegister = createAsyncThunk(
  "user/fetchUserRegister",
  async (data) => {
    const response = await userService.register(data)

    console.log(data)

    if (response.data.status >= 400) {
      // bắn lỗi ra ngoài
      return isRejectedWithValue(response.data);
    }

    return response.data
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUserRegister.fulfilled, (state, action) => {
      if (action.payload.status > 400)
        toast.error(action.payload.message)
      else {
        toast.success(action.payload.message)
      }
    })

  },
})

// Action creators are generated for each case reducer function
export const { } = userSlice.actions

export default userSlice.reducer