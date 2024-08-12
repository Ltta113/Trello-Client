import Box from '@mui/material/Box'
import AvatarGroup from '@mui/material/AvatarGroup'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { IBoard } from '~/apis/type'
import TextField from '@mui/material/TextField'
import { useRef, useState, MouseEvent, ChangeEvent } from 'react'
import { useAppDispatch } from '~/redux/store'
import { updateBoardDetails, updateBoardState } from '~/redux/boardSlice'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'

const MENU_STYLES_TITLE = {
  color: 'white',
  bgcolor: 'transparent',
  fontWeight: 'bold',
  fontSize: 20,
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  cursor: 'text',
  '&:hover': {
    bgcolor: 'rgba(255, 255, 255, 0.1)'
  }
}
const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  borderRadius: 1,
  fontSize: 35,
  p: 1,
  '&:hover': {
    bgcolor: 'rgba(255, 255, 255, 0.1)'
  }
}
interface BoardBarProps {
  board: IBoard | undefined
}

function BoardBar({ board }: BoardBarProps) {
  const dispatch = useAppDispatch()

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedTitle, setEditedTitle] = useState<string>(board?.title || '')
  const textFieldRef = useRef<HTMLInputElement>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
  }
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value)
  }
  const handleTitleBlur = () => {
    setIsEditing(false)
    dispatch(updateBoardState({ boardTitle: editedTitle }))

    if (board?._id) {
      dispatch(
        updateBoardDetails({
          boardId: board?._id,
          dataUpdate: { title: editedTitle }
        })
      )
    }
  }
  const handleChangeType = (type: string) => {
    dispatch(updateBoardState({ type: type }))

    if (board?._id) {
      dispatch(
        updateBoardDetails({
          boardId: board?._id,
          dataUpdate: { type: type }
        })
      )
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        paddingX: 2,
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        '&::-webkit-scrollbar-track': { m: 2 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          {isEditing ? (
            <Box>
              <TextField
                value={editedTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                inputRef={textFieldRef}
                variant="outlined"
                size="small"
                autoFocus
                data-no-dnd="true"
                inputProps={{
                  style: {
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: 'black',
                    width: `${editedTitle.length}ch`
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent'
                    }
                  }
                }}
              />
            </Box>
          ) : (
            <Box sx={MENU_STYLES_TITLE} onClick={handleDoubleClick}>
              {board?.title}
            </Box>
          )}
        </Tooltip>
        <Box sx={{ display: 'flex', gap: 0.3 }}>
          <Tooltip title="Đánh dấu bảng">
            <StarBorderIcon sx={MENU_STYLES} />
          </Tooltip>
          <Button
            sx={{
              p: 0,
              m: 0,
              minWidth: 'auto',
              borderRadius: '50%',
              '&:hover': {
                bgcolor: 'transparent'
              }
            }}
            id="basic-button-starred"
            aria-controls={open ? 'basic-menu-starred' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <Tooltip title="Khả năng xem">
              <PeopleAltOutlinedIcon sx={MENU_STYLES} />
            </Tooltip>
          </Button>
        </Box>
        <Menu
          id="basic-menu-starred"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button-starred'
          }}
          sx={{ height: 'auto', width: '384px' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: '0px 32px',
              fontSize: 14,
              height: 'auto',
              width: 'calc(384px - 47px)',
              color: (theme) =>
                theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.grey[600]
            }}
          >
            Khả năng xem
          </Box>
          <MenuItem>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}
              onClick={() => handleChangeType('private')}
            >
              <Box sx={{ display: 'flex', gap: 1, fontSize: 14, alignItems: 'center' }}>
                <LockOutlinedIcon sx={{ color: 'red', pb: 0.7, pl: 1 }} />
                <Box>Riêng tư</Box>
                {board?.type === 'private' && <CheckOutlinedIcon sx={{ fontSize: 12 }} />}
              </Box>
              <Box
                sx={{
                  display: 'block',
                  fontSize: 12,
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  lineHeight: 1.5,
                  whiteSpace: 'normal'
                }}
              >
                Chỉ thành viên bảng thông tin mới có quyền xem bảng thông tin này. Quản trị viên của
                Không gian làm việc có thể đóng bảng thông tin hoặc xóa thành viên.
              </Box>
            </Box>
          </MenuItem>
          <MenuItem>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, fontSize: 14, alignItems: 'center' }}>
                <PeopleAltOutlinedIcon sx={{ color: 'black', pb: 0.7, pl: 1 }} />
                <Box>Không gian làm việc</Box>
                {board?.type === 'workspace' && <CheckOutlinedIcon sx={{ fontSize: 12 }} />}
              </Box>
              <Box
                sx={{
                  display: 'block',
                  fontSize: 12,
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  lineHeight: 1.5,
                  whiteSpace: 'normal'
                }}
              >
                Tất cả thành viên của Không gian làm việc Trello Không gian làm việc có thể xem và
                sửa bảng thông tin này.
              </Box>
            </Box>
          </MenuItem>
          <MenuItem>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}
              onClick={() => handleChangeType('public')}
            >
              <Box sx={{ display: 'flex', gap: 1, fontSize: 14, alignItems: 'center' }}>
                <PublicOutlinedIcon sx={{ color: 'green', pb: 0.7, pl: 1 }} />
                <Box>Công khai</Box>
                {board?.type === 'public' && <CheckOutlinedIcon sx={{ fontSize: 12 }} />}
              </Box>
              <Box
                sx={{
                  display: 'block',
                  fontSize: 12,
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  lineHeight: 1.5,
                  whiteSpace: 'normal'
                }}
              >
                Bất kỳ ai trên mạng internet đều có thể xem bảng thông tin này. Chỉ thành viên bảng
                thông tin mới có quyền sửa.
              </Box>
            </Box>
          </MenuItem>
        </Menu>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={3}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title="trello">
            <Avatar
              alt="Trello"
              src="https://lh3.googleusercontent.com/a/ACg8ocJZV6LUuzWXWw0KICxhz3J19PlxTScBiMdfhbod9vINqQ=s96-c"
            />
          </Tooltip>
          <Tooltip title="trello">
            <Avatar
              alt="Trello"
              src="https://lh3.googleusercontent.com/a/ACg8ocJZV6LUuzWXWw0KICxhz3J19PlxTScBiMdfhbod9vINqQ=s96-c"
            />
          </Tooltip>
          <Tooltip title="trello">
            <Avatar
              alt="Trello"
              src="https://lh3.googleusercontent.com/a/ACg8ocJZV6LUuzWXWw0KICxhz3J19PlxTScBiMdfhbod9vINqQ=s96-c"
            />
          </Tooltip>
          <Tooltip title="trello">
            <Avatar
              alt="Trello"
              src="https://lh3.googleusercontent.com/a/ACg8ocJZV6LUuzWXWw0KICxhz3J19PlxTScBiMdfhbod9vINqQ=s96-c"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
