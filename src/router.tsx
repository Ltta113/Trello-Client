import { createBrowserRouter } from 'react-router-dom'
import Main from './pages/Main/Main'
import Board from './pages/Boards/_id'
import ErrorPage from './pages/ErrorPage/ErrorPage'
import LoginForm from './pages/Users/LoginForm/LoginForm'
import SignUpForm from './pages/Users/SignUpForm/SignUpForm'
import FinalRegister from './pages/Users/SignUpForm/FinalRegister/FinalRegister'
import ForgotPassword from './pages/Users/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/Users/ResetPassword/ResetPassword'
import UpdateForm from './pages/Users/UpdateForm/UpdateForm'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />
  },
  {
    path: 'login',
    element: <LoginForm />
  },
  {
    path: 'signup',
    element: <SignUpForm />
  },
  {
    path: '/b/:boardId/:slug',
    element: <Board />
  },
  {
    path: '/profile/:userId',
    element: <UpdateForm />
  },
  {
    path: '/finalRegister/:status',
    element: <FinalRegister />
  },
  {
    path: '/forgotPassword/',
    element: <ForgotPassword />
  },
  {
    path: '/resetPassword/:status',
    element: <ResetPassword />
  },
  {
    path: '/error',
    element: <ErrorPage />
  }
])

export default router
