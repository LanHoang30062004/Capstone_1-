import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import instance from '~/api/intance'

const initialState = {
  flashCards: null,
  flashCardDetail: null
}

export const fetchFlashCard = createAsyncThunk(
  'flash-card/fetchFlashCard',
  async (query) => {
    const response = await instance.get('/flash-card', {
      params: query
    })

    return response.data
  },
)

export const fetchFlashCardDetail = createAsyncThunk(
  'flash-card/fetchFlashCardDetail',
  async (id) => {
    const response = await instance.get(`/flash-card/${id}`)

    return response.data
  },
)

export const fetchFlashCardAdd = createAsyncThunk(
  'flash-card/fetchFlashCardAdd',
  async (data) => {
    const response = await instance.post('/flash-card', data)

    return response.data
  },
)

export const fetchFlashCardEdit = createAsyncThunk(
  'flash-card/fetchFlashCardEdit',
  async ({ id, data }) => {
    const response = await instance.put(`/flash-card/${id}`, data)

    console.log(response)

    return response.data
  },
)

export const fetchFlashCardDelete = createAsyncThunk(
  'flash-card/fetchFlashCardDelete',
  async (id) => {
    await instance.delete(`/flash-card/${id}`)

    return id
  },
)

export const wordSlice = createSlice({
  name: 'flash-card',
  initialState,
  reducers: {

  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchFlashCard.fulfilled, (state, action) => {
      state.flashCards = action.payload.data
    })

    builder.addCase(fetchFlashCardDetail.fulfilled, (state, action) => {
      state.flashCardDetail = action.payload.data
    })

    builder.addCase(fetchFlashCardAdd.fulfilled, (state, action) => {
      if (action.payload.status > 400)
        toast.error(action.payload.message)
      else {
        toast.success(action.payload.message)
        state.flashCards.items.push(action.payload.data)
      }
    })

    builder.addCase(fetchFlashCardEdit.fulfilled, (state, action) => {
      const updatedWord = action.payload
      const index = state.flashCards?.items?.findIndex(item => item.wordId === updatedWord.wordId);

      // state.flashCards.items[index] = updatedWord
    })

    builder.addCase(fetchFlashCardEdit.rejected, (state, action) => {
      console.log(action.payload)
    })

    builder.addCase(fetchFlashCardDelete.fulfilled, (state, action) => {
      const flashCardId = action.payload
      state.flashCards.items = state.words?.items?.filter(item => item.wordId !== flashCardId)
    })
  },
})

// Action creators are generated for each case reducer function
// eslint-disable-next-line no-empty-pattern
export const { } = wordSlice.actions

export default wordSlice.reducer