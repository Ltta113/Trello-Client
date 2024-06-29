import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { IBoard } from '~/apis/type'
import { mapOrder } from '~/utils/sort'

interface BoardBarProps {
  board: IBoard
}

function BoardContent({ board }: BoardBarProps) {
  const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}
    >
      <ListColumns columns={orderedColumns} />
    </Box>
  )
}

export default BoardContent
