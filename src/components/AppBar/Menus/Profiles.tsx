import * as React from 'react'
import Menu from '@mui/material/Menu'
import Divider from '@mui/material/Divider'
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
import LaunchIcon from '@mui/icons-material/Launch'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'

export default function Profiles() {
  const dispatch = useAppDispatch()
  const { error, user } = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  React.useEffect(() => {
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
            <MenuItem sx={{ justifyContent: 'space-between', display: 'flex' }}>
              Quản lý tài khoản <LaunchIcon sx={{ pb: 1 }} />{' '}
            </MenuItem>
          </Box>
          <Divider />
          <Box>
            <Box sx={{ fontSize: 13, fontWeight: 'bold', pb: 1, pt: 2 }}>TRELLO</Box>
            <MenuItem>Hồ sơ và cài đặt</MenuItem>
            <MenuItem>Hoạt động</MenuItem>
            <MenuItem>Thẻ</MenuItem>
            <MenuItem>Cài đặt</MenuItem>
            <MenuItem sx={{ justifyContent: 'space-between', display: 'flex' }}>
              Chủ đề <KeyboardArrowDownIcon />{' '}
            </MenuItem>
          </Box>
          <Divider />
          <Box>
            <MenuItem>
              <PeopleAltOutlinedIcon sx={{ p: '3px' }} /> Tạo không gian làm việc
            </MenuItem>
          </Box>
          <Divider />
          <Divider />
          <Box>
            <MenuItem>Trợ giúp</MenuItem>
            <MenuItem>Phím tắt</MenuItem>
          </Box>
          <Divider />
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Box>
      </Menu>
    </Box>
  )
}
