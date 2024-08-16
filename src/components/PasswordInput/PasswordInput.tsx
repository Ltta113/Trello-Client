import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState, ChangeEvent, MouseEvent } from 'react'

type Props = {
  title?: string
  password?: string
  setPassword?: React.Dispatch<React.SetStateAction<string>>
  error?: string | null
}

const PasswordInput = ({ title, password, setPassword, error }: Props) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => event.preventDefault()
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (setPassword) {
      setPassword(event.target.value)
    }
  }

  return (
    <Box
      sx={{
        width: '400px' // Đặt chiều rộng cho Box chứa TextField
      }}
    >
      <TextField
        type={showPassword ? 'text' : 'password'}
        label={title}
        variant="outlined"
        value={password}
        onChange={handleChange}
        error={!!error}
        helperText={error}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            padding: '0px 8px 0px 0px',
            '& .MuiInputBase-input': {
              textAlign: 'start',
              padding: '0px 0px 0px 10px',
              height: '36px',
              display: 'flex',
              alignItems: 'center'
            }
          }
        }}
        sx={{
          width: '100%',
          '& .MuiInputLabel-root': {
            top: '-6px'
          },
          '& .MuiOutlinedInput-root': {
            height: '36px'
          }
        }}
      />
    </Box>
  )
}

export default PasswordInput
