import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import instance from '~/api/intance'

const initialState = {
  words: null,
}

export const fetchWord = createAsyncThunk(
  'word/fetchWord',
  async (query) => {
    const response = await instance.get('/word', {
      params: query
    })

    return response.data
  },
)

export const fetchWordAdd = createAsyncThunk(
  'word/fetchWordAdd',
  async (data) => {
    const response = await instance.post('/word', data)

    console.log(response)

    return response.data
  },
)

export const fetchWordEdit = createAsyncThunk(
  'word/fetchWordEdit',
  async (data) => {
    const response = await instance.put(`/word/${data.wordId}`, data)

    return response.data.data
  },
)

export const fetchWordDelete = createAsyncThunk(
  'word/fetchWordDelete',
  async (id) => {
    await instance.delete(`/word/${id}`)

    return id
  },
)

export const wordSlice = createSlice({
  name: 'word',
  initialState,
  reducers: {
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchWord.fulfilled, (state, action) => {
      state.words = action.payload.data
    })

    builder.addCase(fetchWordAdd.fulfilled, (state, action) => {
      state.words.items.push(action.payload.data)
    })

    builder.addCase(fetchWordEdit.fulfilled, (state, action) => {
      const updatedWord = action.payload
      const index = state.words.items.findIndex(word => word.wordId === updatedWord.wordId);

      state.words.items[index] = updatedWord
    })

    builder.addCase(fetchWordDelete.fulfilled, (state, action) => {
      const wordId = action.payload
      state.words.items = state.words.items.filter(word => word.wordId !== wordId)
    })
  },
})

// Action creators are generated for each case reducer function
// eslint-disable-next-line no-empty-pattern
export const { } = wordSlice.actions

export default wordSlice.reducer