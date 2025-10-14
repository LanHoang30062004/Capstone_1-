import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { data } from 'react-router-dom'
import { toast } from 'react-toastify'
import instance from '~/api/intance'

const initialState = {
  accounts: null,
}

export const fetchAccount = createAsyncThunk(
  'user/fetchAccount',
  async (query) => {
    const response = await instance.get('/user', {
      params: query
    })

    return response.data
  },
)

export const fetchAccountAddAdmin = createAsyncThunk(
  'user/fetchAccountAddAdmin',
  async (data) => {
    const response = await instance.post('/user', data)

    console.log(response)

    return response.data
  },
)

export const fetchAccountEdit = createAsyncThunk(
  'user/fetchAccountEdit',
  async (data) => {
    const response = await instance.put(`/user`, data)

    return response.data
  },
)

export const fetchAccountDelete = createAsyncThunk(
  'user/fetchAccountDelete',
  async (id) => {
    await instance.delete(`/user/${id}`)

    return id
  },
)

export const accountSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      state.accounts = action.payload.data
    })

    builder.addCase(fetchAccountAddAdmin.fulfilled, (state, action) => {
      if (action.payload.status > 400) toast.error(action.payload.message);
      else {
        state.accounts.items.push(action.payload.data)
        toast.success("Thêm thành công!");
      }
    })

    builder.addCase(fetchAccountEdit.fulfilled, (state, action) => {
      if (action.payload.status > 400)
        toast.error(action.payload.message)
      else {
        toast.success(action.payload.message)
      }
    })

    builder.addCase(fetchAccountDelete.fulfilled, (state, action) => {
      const id = action.payload
      state.accounts.items = state.accounts.items.filter(word => word.id !== id)
    })
  },
})

// Action creators are generated for each case reducer function
// eslint-disable-next-line no-empty-pattern
export const { } = accountSlice.actions

export default accountSlice.reducer