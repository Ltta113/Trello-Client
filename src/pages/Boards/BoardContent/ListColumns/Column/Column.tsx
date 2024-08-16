import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { HTMLAttributes, useEffect, useRef, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Box from '@mui/material/Box'
import ListCards from './ListCards/ListCards'
import { IColumn } from '~/apis/type'
import { mapOrder } from '~/utils/sort'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import { toast } from 'react-toastify'
import { RootState, useAppDispatch } from '~/redux/store'
import { useSelector } from 'react-redux'
import {
  createNewCard,
  deleteColumn,
  updateColumnDetails,
  updateColumnState
} from '~/redux/boardSlice'
import { useConfirm } from 'material-ui-confirm'
import { openCardDetail } from '~/redux/cardSlice'
import CardDetailDialog from './CardDetail/CardDetail'

type ColumProps = {
  column: IColumn
} & HTMLAttributes<HTMLDivElement>

function Column({ column, ...props }: ColumProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyles: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: transition || undefined,
    height: '100%',
    opacity: isDragging ? 0.5 : 1
  }
  const board = useSelector((state: RootState) => state.board.board)
  const dispatch = useAppDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedTitle, setEditedTitle] = useState<string | undefined>(column.title)

  const handleDoubleClick = () => {
    setIsEditing(true)
  }
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value)
  }
  const handleTitleBlur = () => {
    setIsEditing(false)
    // Bạn có thể thêm logic cập nhật tiêu đề ở đây, ví dụ:
    dispatch(updateColumnState({ columnId: column._id, title: editedTitle }))

    dispatch(
      updateColumnDetails({
        columnId: column._id,
        dataUpdate: { title: editedTitle }
      })
    )
  }

  const isCardDetailOpen = useSelector((state: RootState) => state.card.openDetail)

  const handleCardClick = (cardId: string) => {
    dispatch(openCardDetail(cardId))
  }

  const textFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && textFieldRef.current) {
      textFieldRef.current.select()
    }
  }, [isEditing])

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const buttonEvent = event as unknown as React.MouseEvent<HTMLButtonElement>
    setAnchorEl(buttonEvent.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

  const [openNewCardForm, setOpenNewCardForm] = useState<boolean>(false)
  const toggleNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState<string | null>('')

  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Please enter Card title', { position: 'bottom-right' })
      return
    }
    const newCardData = {
      title: newCardTitle,
      boardId: board?._id,
      columnId: column._id,
      description: '<p></p>'
    }
    toggleNewCardForm()
    setNewCardTitle('')
    dispatch(createNewCard(newCardData))
  }
  const configrmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    configrmDeleteColumn({
      title: 'Delete Column',
      description: 'This action wil permanently delete your Column and its Cards! Are you sure?',
      confirmationText: 'Confirm'
    })
      .then(() => {
        dispatch(deleteColumn(column._id))
      })
      .catch(() => {})
  }

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...props} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {isEditing ? (
            <TextField
              value={editedTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              inputRef={textFieldRef}
              variant="outlined"
              size="small"
              autoFocus
              data-no-dnd="true"
              sx={{
                p: 0,
                '&.MuiOutlinedInput-input': {
                  padding: '6px 8px',
                  fontSize: '1.25rem',
                  fontWeight: 'bold'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent'
                }
              }}
            />
          ) : (
            <Typography
              variant="h6"
              sx={{
                p: 1,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
              onClick={handleDoubleClick}
            >
              {column?.title}
            </Typography>
          )}
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem
                onClick={toggleNewCardForm}
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '& .add-card-icon': {
                      color: 'success.light'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <AddCardIcon className="add-card-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': {
                      color: 'warning.dark'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <DeleteForeverIcon className="delete-forever-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <ListCards cards={orderedCards} onCardClick={handleCardClick} />
        <CardDetailDialog open={isCardDetailOpen} column={column} />
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignContent: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button startIcon={<AddCardIcon />} onClick={toggleNewCardForm}>
                Add new card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TextField
                id="outlined-search"
                label="Enter card title"
                type="text"
                size="small"
                variant="outlined"
                data-no-dnd="true"
                autoFocus
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': {
                    color: (theme) => theme.palette.primary.main
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '&:hover fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '&.MuiOutlinedInput-input': { borderRadius: 1 }
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  data-no-dnd="true"
                  size="small"
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.success.main
                    }
                  }}
                  onClick={addNewCard}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                  onClick={toggleNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Column
