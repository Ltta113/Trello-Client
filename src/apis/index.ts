import instance from '~/axiosConfig'
import { IBoard, ICard, IColumn } from './type'

export const fetchBoardDetailsAPI = async (boardId: string): Promise<IBoard> => {
  const response = await instance.get<IBoard>(`/v1/boards/${boardId}`)

  return response.data
}

export const createNewColumnAPI = async (newColumnData: IColumn): Promise<IColumn> => {
  const response = await instance.post<IColumn>('v1/columns', newColumnData)

  return response.data
}

export const createNewCardAPI = async (newCardData: ICard): Promise<ICard> => {
  const response = await instance.post<ICard>('v1/cards', newCardData)

  return response.data
}
