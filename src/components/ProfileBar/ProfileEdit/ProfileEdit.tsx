import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { RootState, useAppDispatch } from '~/redux/store'
import { logoutUser } from '~/redux/userSlice'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import { useEffect, useState, MouseEvent } from 'react'

export default function ProfilesEdit() {
  const dispatch = useAppDispatch()
  const { error, user } = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error.statusCode} - ${error.message}`)
    }
  }, [error])

  return (
    <Box>
      <Tooltip title="Tài khoản">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-button-profiles' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt={`${user?.firstname} ${user?.lastname}`}
            src={user?.avatar?.url}
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{
          color: 'white',
          '.MuiMenuItem-root': {
            fontSize: '14px',
            p: '8px 0px'
          }
        }}
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles'
        }}
      >
        <Box sx={{ width: '315px', height: 'auto', p: '12px' }}>
          <Box>
            <Box sx={{ fontSize: 13, fontWeight: 'bold', pb: 1 }}>TÀI KHOẢN</Box>
            <Box sx={{ display: 'flex', justifyContent: 'start', gap: 1 }}>
              <Avatar alt={`${user?.firstname} ${user?.lastname}`} src={user?.avatar?.url} />
              <Box>
                <Box>{`${user?.firstname} ${user?.lastname}`}</Box>
                <Box sx={{ fontSize: 13 }}>{user?.email}</Box>
              </Box>
            </Box>
            <MenuItem sx={{ p: 'none' }}>Chuyển đổi tài khoản</MenuItem>

            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Box>
        </Box>
      </Menu>
    </Box>
  )
}
