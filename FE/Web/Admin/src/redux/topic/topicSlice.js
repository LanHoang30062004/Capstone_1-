import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import instance from '~/api/intance'

const initialState = {
  topics: null,
  topicDetail: null
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

export const fetchTopicDetail = createAsyncThunk(
  'topic/fetchTopicDetail',
  async (id) => {
    const response = await instance.get(`/topic/${id}`)

    return response.data
  },
)

export const fetchTopicAdd = createAsyncThunk(
  'topic/fetchTopicAdd',
  async (data) => {
    const response = await instance.post('/topic', data)

    if (response.data.status > 400) toast.error(response.data.message)

    else toast.success(response.data.message)

    return response.data
  },
)

export const fetchTopicEdit = createAsyncThunk(
  'topic/fetchTopicEdit',
  async (data) => {
    const response = await instance.put(`/topic/${data.id}`, data)

    if (response.data.status > 400) return toast.error(response.data.message)

    toast.success(response.data.message)

    return response.data.data
  },
)

export const fetchTopicDelete = createAsyncThunk(
  'topic/fetchTopicDelete',
  async (id) => {
    const response = await instance.delete(`/topic/${id}`)

    if (response.data.status > 400) return toast.error(response.data.message)

    toast.success(response.data.message)

    return id
  },
)

export const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    deleteTopic: (state, action) => {
      state.topics = state.topics?.filter((item) => item.id !== action.payload)
    }
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchTopic.fulfilled, (state, action) => {
      state.topics = action.payload.data
    })

    builder.addCase(fetchTopicDetail.fulfilled, (state, action) => {
      state.topicDetail = action.payload.data
    })

    builder.addCase(fetchTopicAdd.fulfilled, (state, action) => {
      state.topics.items.push(action.payload.data)
    })

    builder.addCase(fetchTopicDelete.fulfilled, (state, action) => {
      const topicId = action.payload
      state.topics = state.topics.filter(topic => topic.id !== topicId)
    })
  },
})

// Action creators are generated for each case reducer function
// eslint-disable-next-line no-empty-pattern
export const { deleteTopic } = topicSlice.actions

export default topicSlice.reducer