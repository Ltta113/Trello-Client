/* eslint-disable @typescript-eslint/no-unused-vars */
export interface IBoard {
  _id: string
  title: string
  description: string
  type: 'public' | 'private'
  ownerIds: string[]
  memberIds?: string[]
  columnOrderIds?: string[]
  columns: IColumn[] | []
}
export interface ICard {
  _id: string
  boardId: string
  columnId: string
  title?: string
  description?: string | null
  cover?: string | null
  memberIds?: string[]
  comments?: IComment[] | []
  attachments?: string[]
  FE_PlaceholderCard?: boolean
  checkListOrderIds?: string[]
  checkLists: ICheckList[] | []
}

export interface IColumn {
  _id: string
  boardId: string
  title: string
  cardOrderIds: string[]
  cards: ICard[] | []
}

export interface ICheckList {
  _id: string
  cardId: string
  title: string
  listItemOrderIds: string[]
  checkItems: ICheckItem[]
}

export interface ICheckItem {
  _id: string
  checkListId: string
  title?: string
  state: string
  FE_PlaceholderCheckList?: boolean
}

export interface IComment {
  _id: string
  description: string
  createdAt: Date
  updatedAt: Date | null
}
