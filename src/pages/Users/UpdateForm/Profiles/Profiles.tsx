import { useState, MouseEvent } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '~/redux/store'
import Link from '@mui/material/Link'
import DragDropFileUpload from '~/components/DragDropFileUpload/DragDropFileUpload'
import { toast } from 'react-toastify'
import { deleteAvatarAPI, uploadAvatarAPI } from '~/redux/userSlice'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import EditInfo from './EditInfo/EditInfo'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

export default function Profiles() {
  const user = useSelector((state: RootState) => state.user.user)
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openCam = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseCam = () => {
    setAnchorEl(null)
  }

  const handleFileUpload = async (file: File) => {
    toast.success(`Đã tải: ${file.name}`)
  }

  const handleSubmit = (file: File) => {
    if (file) {
      const formData = new FormData()
      formData.append('image', file)
      try {
        dispatch(uploadAvatarAPI(formData))
      } catch (error) {
        toast.error(`Error: ${error}`)
      }
    }
    handleClose()
  }

  const handleCancel = () => {
    handleClose()
  }
  const handleDeleteAvatar = () => {
    try {
      dispatch(deleteAvatarAPI())
    } catch (error) {
      toast.error(`Error: ${error}`)
    }
  }

  return (
    <Box>
      <Box sx={{ fontSize: 26, fontWeight: '500', pt: 4, pb: 4 }}>Hồ sơ và chế độ hiển thị</Box>
      <Box sx={{ fontSize: 14, pb: 2 }}>
        Quản lý thông tin cá nhân của bạn, đồng thời kiểm soát thông tin nào người khác xem được và
        ứng dụng nào có thể truy cập.
      </Box>
      <Box sx={{ fontSize: 14, pb: 1 }}>
        <Link href="#" underline="hover">
          Tìm hiểu thêm về hồ sơ và chế độ hiển thị của bạn
        </Link>{' '}
        hoặc{' '}
        <Link href="#" underline="hover">
          xem chính sách quyền riêng tư của chúng tôi.
        </Link>{' '}
      </Box>
      <Box>
        <Box sx={{ fontSize: 16, fontWeight: '500', pb: 1, pt: 2 }}>Ảnh hồ sơ và ảnh tiêu đề</Box>
        <Paper
          elevation={1}
          sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
        >
          <Avatar
            alt={`${user?.firstname} ${user?.lastname}`}
            src={user?.avatar?.url}
            sx={{
              width: 96,
              height: 96,
              transition: 'opacity 0.3s',
              '&:hover': {
                opacity: 0.6
              }
            }}
          />
          <Button
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              backgroundColor: 'white'
            }}
            onClick={handleClick}
          >
            <CameraAltIcon
              sx={{
                '&:hover': {
                  backgroundColor: 'lightgray'
                }
              }}
            />
          </Button>
        </Paper>
      </Box>
      <EditInfo />
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={openCam}
        onClose={handleCloseCam}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <MenuItem onClick={handleOpen}>Thay đổi hình đại diện</MenuItem>
        <MenuItem onClick={handleDeleteAvatar}>Xóa</MenuItem>
      </Menu>

      {/* Modal form import */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Chọn ảnh để tải lên
          </Typography>
          <DragDropFileUpload
            onFileUpload={handleFileUpload}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Box>
      </Modal>
    </Box>
  )
}
