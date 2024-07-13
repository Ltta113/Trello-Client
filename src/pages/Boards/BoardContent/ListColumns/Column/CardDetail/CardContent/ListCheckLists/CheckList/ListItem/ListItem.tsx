import List from '@mui/material/List'
import React from 'react'
import CheckItem from './CheckItem/CheckItem'
import { ICheckItem } from '~/apis/type'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface CheckItemsProps {
  checkItems: ICheckItem[]
  progress: number
  setProgress: React.Dispatch<React.SetStateAction<number>>
}

function ListItem({ checkItems, progress, setProgress }: CheckItemsProps) {
  return (
    <SortableContext items={checkItems?.map((c) => c._id)} strategy={verticalListSortingStrategy}>
      <List sx={{ width: '100%' }}>
        {checkItems?.map((checkItem) => (
          <CheckItem
            key={checkItem._id}
            checkItem={checkItem}
            progress={progress}
            setProgress={setProgress}
          />
        ))}
      </List>
    </SortableContext>
  )
}

export default ListItem
