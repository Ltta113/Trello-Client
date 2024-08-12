import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useNavigate, useParams } from 'react-router-dom'
import AppBar from '~/components/AppBar/AppBar'

const FinalRegister = () => {
  const { status } = useParams()
  const navigate = useNavigate()

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
        {status === 'false' && (
          <Box>
            <Typography variant="h1" sx={{ color: 'red', fontSize: '4rem', mb: 2 }}>
              Xác thực tài khoản không thành công vui lòng đăng ký lại !
            </Typography>
            <Button
              variant="contained"
              sx={{
                color: (theme) => theme.palette.primary.contrastText,
                bgcolor: (theme) => theme.palette.primary.main,
                border: 'none',
                '&:hover': { border: 'none' }
              }}
              onClick={() => navigate('/signup')}
            >
              Tạo mới tài khoản
            </Button>
          </Box>
        )}
        {status === 'true' && (
          <Box>
            <Typography variant="h1" sx={{ color: 'green', fontSize: '4rem', mb: 2 }}>
              Xác thực tài khoản thành công tới đăng nhập !
            </Typography>
            <Button
              variant="contained"
              sx={{
                color: (theme) => theme.palette.primary.contrastText,
                bgcolor: (theme) => theme.palette.primary.main,
                border: 'none',
                '&:hover': { border: 'none' }
              }}
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </Button>
          </Box>
        )}
      </Container>
    </Container>
  )
}

export default FinalRegister
