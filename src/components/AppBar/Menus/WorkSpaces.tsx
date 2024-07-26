import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import { IBoard } from '~/apis/type' // Kiểm tra và thay đổi tên mặc định
import { useEffect } from 'react'
import { fetchListBoardMemberAPI, fetchListBoardOwnerAPI } from '~/apis' // Kiểm tra và thay đổi tên mặc định
import { Link } from 'react-router-dom'

export default function WorkSpaces() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [boardsOwner, setBoardsOwner] = React.useState<IBoard[]>([])
  const [boardsMember, setBoardsMember] = React.useState<IBoard[]>([])
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data1 = await fetchListBoardOwnerAPI()
        const data2 = await fetchListBoardMemberAPI()
        setBoardsOwner(data1)
        setBoardsMember(data2)
      } catch (error) {
        setBoardsOwner([])
        setBoardsMember([])
      }
    }

    fetchBoards()
  }, [])

  return (
    <Box>
      <Button
        sx={{ color: 'white' }}
        id="basic-button-workspaces"
        aria-controls={open ? 'basic-menu-workspaces' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Workspaces
      </Button>
      <Menu
        id="basic-menu-workspaces"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-workspaces',
          sx: { p: '0px 12px', '.MuiMenuItem-root': { p: '8px', borderRadius: 1 } }
        }}
      >
        <Box sx={{ m: '16px 8px 8px 8px', fontSize: 12 }}>Your Workspaces</Box>
        {boardsOwner.map((board) => (
          <MenuItem key={board._id} component={Link} to={`/b/${board._id}/${board.slug}`}>
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: (theme) => theme.palette.primary.light,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {board.title.charAt(0).toUpperCase()}
            </Box>
            <ListItemText sx={{ ml: '12px' }} primary={board.title} />
          </MenuItem>
        ))}
        <Box sx={{ m: '16px 8px 8px 8px', fontSize: 12 }}>Member Workspaces</Box>
        {boardsMember.map((board) => (
          <MenuItem key={board._id}>
            <ListItemIcon>
              <Box sx={{ width: 24, height: 24, bgcolor: 'primary.main', borderRadius: 4 }} />
            </ListItemIcon>
            <ListItemText primary={board.title} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
