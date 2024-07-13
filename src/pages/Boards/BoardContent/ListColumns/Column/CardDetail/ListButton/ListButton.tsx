import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import DraftsIcon from '@mui/icons-material/Drafts'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { createNewCheckList } from '~/redux/cardSlice'
import { RootState, useAppDispatch } from '~/redux/store'
import { useSelector } from 'react-redux'
import CloseIcon from '@mui/icons-material/Close'

function ListButton() {
  const [createCheckList, setCreateCheckList] = useState<boolean>(false)
  const [titleCL, setTitleCL] = useState<string | null>('')
  const dispatch = useAppDispatch()
  const cardId = useSelector((state: RootState) => state.card.cardId)

  const handleCreateCheckList = () => {
    setCreateCheckList(false)
    dispatch(createNewCheckList({ cardId: cardId, title: titleCL }))
    setTitleCL('')
  }
  return (
    <List sx={{ width: '100%', m: 0 }}>
      <Box>
        <ListItemButton
          sx={{ position: 'relative' }}
          onClick={() => setCreateCheckList(!createCheckList)}
        >
          <ListItemIcon>
            <CheckBoxOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Việc cần làm" />
        </ListItemButton>
        {createCheckList && (
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: 'fixed',
              top: '24%',
              left: '61%',
              zIndex: 1500,
              minWidth: '300px',
              maxWidth: '300px',
              minHeight: '150px',
              maxHeight: '150px',
              padding: '4px 8px',
              borderRadius: 1,
              bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36'),
              boxShadow: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignContent: 'center',
                justifyContent: 'space-around'
              }}
            >
              <Box sx={{ width: '10%' }}></Box>
              <Typography sx={{ pt: 1 }}>Thêm công việc</Typography>
              <Box sx={{ width: '10%' }}>
                <IconButton
                  aria-label="close"
                  onClick={() => setCreateCheckList(!createCheckList)}
                  sx={{
                    color: (theme) => theme.palette.grey[500]
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <Box>
              <TextField
                id="outlined-search"
                label="Tiêu đề"
                type="text"
                size="small"
                variant="outlined"
                data-no-dnd="true"
                autoFocus
                sx={{
                  p: 1,
                  width: '100%'
                }}
                onChange={(e) => setTitleCL(e.target.value)}
              />
              <Button
                variant="contained"
                data-no-dnd="true"
                size="small"
                sx={{
                  width: '40%',
                  height: '35px',
                  m: 1
                }}
                onClick={handleCreateCheckList}
              >
                Thêm
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      <ListItemButton>
        <ListItemIcon>
          <DraftsIcon />
        </ListItemIcon>
        <ListItemText primary="Drafts" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Inbox" />
      </ListItemButton>
    </List>
  )
}

export default ListButton
