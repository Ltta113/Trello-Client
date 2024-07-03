import instance from '~/axiosConfig'
import { IBoard } from './type'

export const fetchBoardDetailsAPI = async (boardId: string) : Promise<IBoard> => {
  const response = await instance.get<IBoard>(`/v1/boards/${boardId}`)

  return response.data
}
