// src/components/ResetPassword.tsx
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import SvgIcon from '@mui/material/SvgIcon'
import { useAppDispatch } from '~/redux/store'
import { resetPassword } from '~/redux/userSlice'
import TrelloLogo from '~/assets/trello.svg?react'
import AtlassianLogo from '~/assets/atlassian.svg?react'
import { grey } from '@mui/material/colors'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useLocation, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'

const ResetPassword = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(useLocation().search)
  const token = queryParams.get('token')
  const [password, setPassword] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Ngăn chặn hành vi mặc định của form

    try {
      const resultAction = await dispatch(resetPassword({ password: password, token: token }))
      if (resetPassword.fulfilled.match(resultAction)) {
        setSuccess(true)
      } else {
        setError(resultAction.payload as string)
      }
    } catch (err) {
      setError('Có lỗi xảy ra')
    }
  }

  return (
    <Box>
      {token && (
        <Container sx={{ marginTop: '50px' }}>
          <Grid container justifyContent="center">
            <Grid item xs={10} sm={6} md={4}>
              <Paper elevation={3} sx={{ padding: '32px 40px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', pb: 3, pr: 1 }}>
                  <SvgIcon
                    component={TrelloLogo}
                    inheritViewBox
                    sx={{ color: 'blue', fontSize: 35, pt: 1 }}
                  />
                  <Box
                    component="span"
                    sx={{
                      fontSize: 30,
                      fontWeight: 'bold',
                      color: '#172b4d'
                    }}
                  >
                    Trello
                  </Box>
                </Box>
                {error && <Box sx={{ fontSize: 11, color: grey[700] }}>{error}</Box>}
                {success && (
                  <Box sx={{ fontSize: 11, color: grey[700] }}>
                    Đổi mật khẩu thành công tới{' '}
                    <Link href="#" underline="hover" onClick={() => navigate('/login')}>
                      Đăng nhập
                    </Link>
                  </Box>
                )}
                <Box sx={{ fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>
                  Choose a new password
                </Box>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{
                    '& .MuiTextField-root': { m: 'none' }
                  }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    size="small"
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button type="submit" fullWidth variant="contained">
                    Continue
                  </Button>
                </Box>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{
                    mt: 3
                  }}
                ></Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    mt: 3,
                    mb: 2,
                    fontSize: 13,
                    cursor: 'pointer',
                    color: 'blue'
                  }}
                >
                  <Link href="#" underline="hover">
                    Still having trouble logging in?
                  </Link>
                </Box>
                <Divider variant="middle" />
                <Box
                  sx={{
                    mt: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <SvgIcon
                    component={AtlassianLogo}
                    inheritViewBox
                    sx={{ fontSize: 150, width: '142.5px', height: '24px' }}
                  />
                  <Box sx={{ mt: 1, fontSize: 10 }}>
                    One account for Trello, Jira, Confluence and{' '}
                    <Link href="#" underline="hover">
                      more.
                    </Link>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 1,
                      mt: 1,
                      fontSize: 10,
                      cursor: 'pointer',
                      color: 'black'
                    }}
                  >
                    <Link href="#" underline="hover" sx={{ mt: 0.3, color: grey[800] }}>
                      Privacy Policy
                    </Link>
                    <Typography variant="body2" sx={{ my: 'auto', color: 'gray' }}>
                      •
                    </Typography>
                    <Link href="#" underline="hover" sx={{ mt: 0.3, color: grey[800] }}>
                      User Notice
                    </Link>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 1,
                      mt: 1,
                      fontSize: 10,
                      cursor: 'pointer',
                      color: 'black'
                    }}
                  >
                    <Box sx={{ fontSize: 10, color: grey[700] }}>
                      This site is protected by reCAPTCHA and the Google{' '}
                      <Link href="#" underline="hover">
                        Privacy Policy
                      </Link>{' '}
                      and{' '}
                      <Link href="#" underline="hover">
                        Terms of Service
                      </Link>{' '}
                      apply.
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}
      {!token && (
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
            <Box>
              <Typography variant="h1" sx={{ color: 'red', fontSize: '4rem', mb: 2 }}>
                Xác thực tài khoản không thành công vui lòng xác thực lại !
              </Typography>
              <Button
                variant="contained"
                sx={{
                  color: (theme) => theme.palette.primary.contrastText,
                  bgcolor: (theme) => theme.palette.primary.main,
                  border: 'none',
                  '&:hover': { border: 'none' }
                }}
                onClick={() => navigate('/forgotPassword')}
              >
                Xác thực
              </Button>
            </Box>
          </Container>
        </Container>
      )}
    </Box>
  )
}

export default ResetPassword
