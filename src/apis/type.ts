/* eslint-disable @typescript-eslint/no-unused-vars */
export interface IBoard {
  _id: string
  title: string
  description: string,
  slug: string,
  type: 'public' | 'private' | 'workspace'
  ownerIds: string[]
  memberIds?: string[]
  columnOrderIds?: string[]
  columns: IColumn[] | []
  labels: ILabel[] | []
}
export interface ICard {
  _id: string
  boardId: string
  columnId: string
  title?: string
  description?: string | null
  cover?: {
    idAttachment: string | null;
    color: string | null;
    idCloudImage: string | null;
    size: 'full' | 'half';
    brightness: 'light' | 'dark';
  } | null
  memberIds?: string[]
  comments?: IComment[] | []
  attachments?: IAttachment[] | []
  FE_PlaceholderCard?: boolean
  checkListOrderIds?: string[]
  checkLists: ICheckList[] | []
  labels: ILabel[] | []
}

export interface IAttachment {
  _id: string
  cardId: string
  userId: string
  name: string
  fileName: string
  mimeType: string
  url: string
  createdAt: Date
  updatedAt: Date | null
}


export interface ILabel {
  _id: string
  boardId: string
  listCard: string[]
  title: string
  color: string
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
  boardId: string
  title: string
  listItemOrderIds: string[]
  checkItems: ICheckItem[]
}

export interface ICheckItem {
  _id: string
  checkListId: string
  boardId: string
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

export interface IError {
  message: string,
  statusCode: number
}

export interface IUser {
  _id: string,
  firstname: string,
  lastname: string,
  email: string,
  isBlocked: boolean
}