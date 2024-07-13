import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ICheckList } from '~/apis/type'
import CheckList from './CheckList/CheckList'
import Box from '@mui/material/Box'

interface CheckListsBarProps {
  checkLists: ICheckList[] | []
}

function ListCheckLists({ checkLists }: CheckListsBarProps) {
  return (
    <SortableContext
      items={checkLists ? checkLists.map((c) => c._id) : []}
      strategy={verticalListSortingStrategy}
    >
      <Box>
        {checkLists?.map((checkList) => <CheckList key={checkList._id} checkList={checkList} />)}
      </Box>
    </SortableContext>
  )
}

export default ListCheckLists
