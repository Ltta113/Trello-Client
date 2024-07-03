import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useState, useEffect } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'
import { IBoard } from '~/apis/type'

function Board() {
  const [board, setBoard] = useState<IBoard>()

  useEffect(() => {
    const boardId = '6684ee3f8a372b92867eb453'

    fetchBoardDetailsAPI(boardId).then((board: IBoard) => setBoard(board))
  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent board={board}/>
    </Container>
  )
}

export default Board
