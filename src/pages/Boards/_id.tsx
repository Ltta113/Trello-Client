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
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

function Board() {
  const { boardId } = useParams<{ boardId: string }>() // Lấy boardId từ useParams
  const board = useSelector((state: RootState) => state.board.board)
  const error = useSelector((state: RootState) => state.board.error)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (boardId) {
      // Kiểm tra nếu boardId có tồn tại
      const promise = dispatch(fetchBoardDetails(boardId))
      return () => {
        promise.abort() // Huỷ bỏ request khi component unmount
      }
    }
  }, [dispatch, boardId])

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error.statusCode} - ${error.message}`)
    }
  }, [error])

  if (!board) {
    return (
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          height: '100vh'
        }}
      >
        <AppBar />
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
      </Container>
    )
  }

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh'
      }}
    >
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  )
}

export default Board
