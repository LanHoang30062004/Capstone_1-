import instance from "~/api/intance"

export const getTopic = async (query) => {
  const response = await instance.get('/topic', {
    params: query
  })

  return response.data.data
}

export const getDetailTopic = async (id) => {
  const response = await instance.get(`/topic/${id}`)

  return response.data.data
}
