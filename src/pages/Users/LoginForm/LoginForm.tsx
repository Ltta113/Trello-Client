// src/components/LoginForm.tsx
import { FormEvent, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import SvgIcon from '@mui/material/SvgIcon'
import { RootState, useAppDispatch } from '~/redux/store'
import { loginUser } from '~/redux/userSlice'
import TrelloLogo from '~/assets/trello.svg?react'
import GoogleLogo from '~/assets/google.svg?react'
import MicrosoftLogo from '~/assets/microsoft.svg?react'
import AppleLogo from '~/assets/apple.svg?react'
import SlackLogo from '~/assets/slack.svg?react'
import AtlassianLogo from '~/assets/atlassian.svg?react'
import ButtonGroup from '@mui/material/ButtonGroup'
import { grey } from '@mui/material/colors'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Container from '@mui/material/Container'

const buttons = [
  <Button key="one">
    <SvgIcon component={GoogleLogo} inheritViewBox sx={{ fontSize: 30 }} />
    Google
  </Button>,
  <Button key="two">
    <SvgIcon component={MicrosoftLogo} inheritViewBox sx={{ fontSize: 30 }} />
    Microsoft
  </Button>,
  <Button key="three">
    <SvgIcon component={AppleLogo} inheritViewBox sx={{ fontSize: 30 }} />
    Apple
  </Button>,
  <Button key="four">
    <SvgIcon component={SlackLogo} inheritViewBox sx={{ fontSize: 30 }} />
    Slack
  </Button>
]

const LoginForm = () => {
  const dispatch = useAppDispatch()
  const { error, status } = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Add your login logic here
    const data = new FormData(e.currentTarget)
    dispatch(loginUser({ email: data.get('email'), password: data.get('password') }))
  }

  useEffect(() => {
    if (status === 'login') {
      toast.success('Login success')
      navigate('/')
    } else if (error?.statusCode !== undefined) {
      toast.error(`Error: ${error.statusCode} - ${error.message}`)
    }
  }, [error, navigate, status])

  return (
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
            <Box sx={{ fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>
              Log in to continue
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
                id="email"
                label="Enter your email"
                name="email"
                autoComplete="email"
                autoFocus
              />
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
              />
              <Button type="submit" fullWidth variant="contained">
                Sign In
              </Button>
            </Box>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                mt: 3
              }}
            >
              <Box sx={{ fontSize: 14, textAlign: 'center', color: 'grey' }}>Or continue with:</Box>
              <ButtonGroup
                orientation="vertical"
                aria-label="Vertical button group"
                fullWidth
                sx={{
                  gap: 2,
                  borderWidth: 1,
                  '.MuiButtonGroup-grouped': {
                    borderColor: grey[300],
                    color: 'black',
                    fontWeight: 'bold',
                    gap: 0.7
                  }
                }}
              >
                {buttons}
              </ButtonGroup>
            </Box>
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
              <Link href="#" underline="hover" onClick={() => navigate('/forgotPassword')}>
                Cannot log in?
              </Link>
              <Typography variant="body1" sx={{ my: 'auto', color: 'gray' }}>
                •
              </Typography>
              <Link href="#" underline="hover" onClick={() => navigate('/signup')}>
                Create an account
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
  )
}

export default LoginForm
