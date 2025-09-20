import instance from "~/api/intance"

export const getWords = async (query) => {
  const response = await instance.get('/word', {
    params: query
  })

  return response.data
}
