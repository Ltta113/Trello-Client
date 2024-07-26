import { createBrowserRouter } from 'react-router-dom'
import Main from './pages/Main/Main'
import Board from './pages/Boards/_id'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />
  },
  {
    path: '/b/:boardId/:slug',
    element: <Board />
  }
])

export default router
