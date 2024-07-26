import { ICard, ICheckItem, ICheckList, IColumn } from '~/apis/type'

export const capitalizeFirstLetter = (val: string) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

export const generatePlaceholder = (column: IColumn): ICard => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    checkLists: [],
    labels: [],
    FE_PlaceholderCard: true
  }
}
export const generatePlaceholderCI = (checkList: ICheckList): ICheckItem => {
  return {
    _id: `${checkList._id}-placeholder-checklist`,
    checkListId: checkList._id,
    boardId: checkList.boardId,
    FE_PlaceholderCheckList: true,
    state: 'incomplete'
  }
}
