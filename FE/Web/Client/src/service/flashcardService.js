import instance from "~/api/intance"

export const getFlashCard = async (query) => {
  const response = await instance.get('/flash-card', {
    params: query
  })

  return response.data.data
}

export const getDetailFlashCard = async (id) => {
  const response = await instance.get(`/flash-card/${id}`)

  return response.data.data
}
