import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useLocation, useNavigate } from 'react-router-dom'
import { IError } from '~/apis/type'
import AppBar from '~/components/AppBar/AppBar'

const ErrorPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { error: IError }

  if (!state || !state.error) {
    navigate('/')
  }

  const { error } = state

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh'
      }}
    >
      <AppBar />
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h1" sx={{ color: 'red', fontSize: '6rem', mb: 2 }}>
          {error.statusCode || '500'}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {error.message || 'Đã xảy ra lỗi.'}
        </Typography>
        <Button
          variant="contained"
          sx={{
            color: (theme) => theme.palette.primary.contrastText,
            bgcolor: (theme) => theme.palette.primary.main,
            border: 'none',
            '&:hover': { border: 'none' }
          }}
          onClick={() => navigate('/')}
        >
            Go home
        </Button>
      </Container>
    </Container>
  )
}

export default ErrorPage
