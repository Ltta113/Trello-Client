import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import SvgIcon from '@mui/material/SvgIcon'
import { useAppDispatch } from '~/redux/store'
import { forgotPassword } from '~/redux/userSlice'
import TrelloLogo from '~/assets/trello.svg?react'
import AtlassianLogo from '~/assets/atlassian.svg?react'
import MailIcon from '~/assets/mail.svg?react'
import { grey } from '@mui/material/colors'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Ngăn chặn hành vi mặc định của form

    try {
      const resultAction = await dispatch(forgotPassword({ email: email }))
      if (forgotPassword.fulfilled.match(resultAction)) {
        setSuccess(true)
      } else {
        setError(resultAction.payload as string)
      }
    } catch (err) {
      setError('Có lỗi xảy ra')
    }
  }

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
            <Box sx={{ fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>Cannot log in?</Box>
            {!success && (
              <Box>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{
                    '& .MuiTextField-root': { m: 'none' }
                  }}
                >
                  {error && <Box sx={{ fontSize: 11, color: grey[700] }}>{error}</Box>}
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    size="small"
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    label="Email"
                    type="email"
                    id="email"
                  />
                  <Button type="submit" fullWidth variant="contained">
                    Send Recovery link
                  </Button>
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
                  <Link href="#" underline="hover" onClick={() => navigate('/login')}>
                    Return to log in
                  </Link>
                </Box>
              </Box>
            )}
            {success && (
              <Box>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 2 }}
                >
                  <SvgIcon component={MailIcon} inheritViewBox sx={{ fontSize: 100 }} />
                </Box>
                <Box sx={{ fontSize: 13, pt: 1 }}>We sent a recovery link to you at</Box>
                <Box sx={{ fontSize: 14, pt: 1, fontWeight: 'bold' }}>{email}</Box>
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
                  <Link
                    href="#"
                    underline="hover"
                    onClick={() => {
                      setEmail('')
                      setSuccess(false)
                      navigate('/login')
                    }}
                  >
                    Return to log in
                  </Link>
                  <Typography variant="body2" sx={{ my: 'auto', color: 'gray' }}>
                    •
                  </Typography>
                  <Link
                    href="#"
                    underline="hover"
                    onClick={() => {
                      setEmail('')
                      setSuccess(false)
                    }}
                  >
                    Resend recovery link
                  </Link>
                </Box>
              </Box>
            )}
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

export default ForgotPassword
