import instance from '~/axiosConfig'
import { IBoard, ILabel } from './type'

export const fetchListBoardOwnerAPI = async (): Promise<IBoard[]> => {
  const response = await instance.get<IBoard[]>('/v1/boards/')

  return response.data
}
export const fetchListBoardMemberAPI = async (): Promise<IBoard[]> => {
  const response = await instance.get<IBoard[]>('/v1/boards/mem')

  return response.data
}
export const fetchLabelsAPI = async (boardId: string): Promise<ILabel[]> => {
  // Gửi yêu cầu GET với boardId là query parameter
  const response = await instance.get<ILabel[]>(`/v1/labels/all/${boardId}`)
  return response.data
}
