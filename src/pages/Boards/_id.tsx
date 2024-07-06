import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect } from 'react'
import { RootState, useAppDispatch } from '~/redux/store'
import { useSelector } from 'react-redux'
import { fetchBoardDetails } from '~/redux/boardSlice'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

function Board() {
  const board = useSelector((state: RootState) => state.board.board)
  const dispatch = useAppDispatch()
  // const [board, setBoard] = useState<IBoard>()

  useEffect(() => {
    const boardId = '6684ee3f8a372b92867eb453'
    const promise = dispatch(fetchBoardDetails(boardId))
    return () => {
      promise.abort()
    }
  }, [dispatch])
  if (!board) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh'
        }}
      >
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  )
}

export default Board
