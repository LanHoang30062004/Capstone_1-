import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import instance from '~/api/intance'

const initialState = {
  topics: null,
}

export const fetchTopic = createAsyncThunk(
  'topic/fetchTopic',
  async (query) => {
    const response = await instance.get('/topic', {
      params: query
    })

    return response.data
  },
)

export const fetchTopicAdd = createAsyncThunk(
  'topic/fetchTopicAdd',
  async (data) => {
    const response = await instance.post('/topic', data)

    console.log(response)

    return response.data
  },
)

export const fetchTopicEdit = createAsyncThunk(
  'topic/fetchTopicEdit',
  async (data) => {
    const response = await instance.put(`/topic/${data.topicId}`, data)

    return response.data.data
  },
)

export const fetchTopicDelete = createAsyncThunk(
  'topic/fetchTopicDelete',
  async (id) => {
    await instance.delete(`/topic/${id}`)

    return id
  },
)

export const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchTopic.fulfilled, (state, action) => {
      state.topics = action.payload.data
    })

    builder.addCase(fetchTopicAdd.fulfilled, (state, action) => {
      state.topics.items.push(action.payload.data)
    })

    builder.addCase(fetchTopicEdit.fulfilled, (state, action) => {
      const updatedWord = action.payload
      const index = state.topics.items.findIndex(word => word.wordId === updatedWord.wordId);

      state.topics.items[index] = updatedWord
    })

    builder.addCase(fetchTopicDelete.fulfilled, (state, action) => {
      const wordId = action.payload
      state.topics.items = state.topics.items.filter(word => word.wordId !== wordId)
    })
  },
})

// Action creators are generated for each case reducer function
// eslint-disable-next-line no-empty-pattern
export const { } = topicSlice.actions

export default topicSlice.reducer