import React, { useEffect, useState } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import { ICheckItem } from '~/apis/type'
import { useSortable } from '@dnd-kit/sortable'
import { HTMLAttributes } from 'react'
import { CSS } from '@dnd-kit/utilities'
import Box from '@mui/material/Box'
import { RootState, useAppDispatch } from '~/redux/store'
import { updateCheckItemAPI, updateCheckItemState, updateState } from '~/redux/cardSlice'
import { useSelector } from 'react-redux'
import { updateCheckItem } from '~/redux/checktemSlice'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

type CheckItemProps = {
  checkItem: ICheckItem
  progress: number
  setProgress: React.Dispatch<React.SetStateAction<number>>
} & HTMLAttributes<HTMLDivElement>

const CheckItem = ({ checkItem, progress, setProgress, ...props }: CheckItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: checkItem._id,
    data: { ...checkItem }
  })
  const [checked, setChecked] = useState<boolean>(checkItem.state === 'incomplete' ? false : true)
  const [editedTitle, setEditedTitle] = useState<string | undefined>(checkItem.title)
  const [update, setUpdate] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const checkItemState = useSelector((state: RootState) => state.checkItem)

  const handleToggle = () => {
    const newProgress = progress + (checked ? -1 : 1)
    setProgress(newProgress)
    dispatch(updateState({ checkItemId: checkItem._id }))
    const state = checked === true ? 'incomplete' : 'complete'
    setChecked(!checked)
    dispatch(updateCheckItemAPI({ checkItemId: checkItem._id, dataUpdate: { state: state } }))
    dispatch(
      updateCheckItemState({
        checkItemId: checkItem._id,
        checkListId: checkItem.checkListId,
        state: state
      })
    )
  }

  useEffect(() => {
    if (checkItem._id === checkItemState.checkItemIdUpdate) {
      setUpdate(checkItemState.openEdit)
    } else {
      setUpdate(false)
      setEditedTitle(checkItem.title)
    }
  }, [checkItemState, checkItem._id, checkItem.title])

  const handleClick = () => {
    dispatch(updateCheckItem({ checkItemId: checkItem._id }))
  }
  const handleEditTitle = () => {
    dispatch(updateCheckItemAPI({ checkItemId: checkItem._id, dataUpdate: { title: editedTitle } }))
    dispatch(
      updateCheckItemState({
        checkItemId: checkItem._id,
        checkListId: checkItem.checkListId,
        title: editedTitle
      })
    )
    dispatch(updateCheckItem({ checkItemId: checkItem._id }))
  }

  const dndKitCheckListStyles: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }

  return (
    <Box
      ref={setNodeRef}
      style={dndKitCheckListStyles}
      {...props}
      {...attributes}
      {...listeners}
      sx={{ padding: 0, margin: 0, position: 'relative' }}
    >
      {checkItem.FE_PlaceholderCheckList && <div></div>}
      {!checkItem.FE_PlaceholderCheckList && (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <ListItem
            key={checkItem._id}
            disablePadding
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Checkbox
              edge="start"
              onClick={handleToggle}
              size="small"
              checked={checked}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': checkItem._id }}
              sx={{ width: '10%' }}
            />
            {!update && (
              <ListItemButton
                role={undefined}
                onClick={handleClick}
                dense
                sx={{
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
                  width: '80%'
                }}
              >
                <ListItemText id={checkItem._id} primary={checkItem.title} />
              </ListItemButton>
            )}
            {update && (
              <Box
                sx={{
                  width: '100%',
                  mt: 1,
                  borderWidth: '2px',
                  bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36')
                }}
                data-no-dnd="true"
              >
                <TextField
                  id="outlined-search"
                  type="text"
                  size="medium"
                  variant="outlined"
                  placeholder="Thêm một mục"
                  value={editedTitle}
                  autoFocus
                  sx={{
                    p: 1,
                    alignContent: 'flex-start',
                    width: '100%',
                    '&.MuiOutlinedInput-root': {
                      '& fieldset': { borderWidth: '2px !important', borderColor: '#1565c0' },
                      '&:hover fieldset': { borderWidth: '2px !important', borderColor: '#1565c0' },
                      '&.Mui-focused fieldset': {
                        borderWidth: '2px !important',
                        borderColor: '#1565c0'
                      }
                    },
                    bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36')
                  }}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    m: 1,
                    width: '10%',
                    height: '35px'
                  }}
                  onClick={handleEditTitle}
                >
                  Lưu
                </Button>
                <IconButton
                  aria-label="close"
                  onClick={handleClick}
                  sx={{
                    color: (theme) => theme.palette.grey[500]
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
          </ListItem>
        </Box>
      )}
    </Box>
  )
}

export default CheckItem
