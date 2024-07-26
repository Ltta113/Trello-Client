import Container from '@mui/material/Container'
// import HomeBar from './HomeBar/HomeBar'
// import HomeContent from './HomeContent/HomeContent'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '~/redux/store'
import _id from '../Users/_id'
import { useEffect } from 'react'
import { getCurrent } from '~/redux/userSlice'
import AppBar from '~/components/AppBar/AppBar'

function Main() {
  const user = useSelector((state: RootState) => state.user.user)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getCurrent())
  }, [dispatch])
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh'
      }}
    >
      {!user && <_id />}
      {user && <AppBar />}
    </Container>
  )
}

export default Main
