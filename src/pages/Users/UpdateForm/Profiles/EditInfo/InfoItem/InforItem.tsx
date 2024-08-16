import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import { useSelector } from 'react-redux'
import { IUser } from '~/apis/type'
import { RootState, useAppDispatch } from '~/redux/store'
import { updatedUserAPI } from '~/redux/userSlice'

type Props = {
  title: string
  type: keyof IUser
}

const MENU_STYLES_TITLE = {
  bgcolor: 'transparent',
  fontWeight: 400,
  fontSize: 14,
  color: 'black',
  width: '138px',
  height: '36px',
  padding: '8px 0px 0px 8px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'text',
  '&:hover': {
    bgcolor: 'rgba(255, 255, 255, 0.1)'
  }
}

export default function InforItem({ title, type }: Props) {
  const user = useSelector((state: RootState) => state.user.user)
  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [desc, setDesc] = useState<string>('')
  const textFieldRef = useRef<HTMLInputElement>(null)

  const handleDescChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDesc(event.target.value)
  }
  const handleSubmitItem = () => {
    dispatch(updatedUserAPI({ [type]: desc }))
    setIsEditing(false)
  }

  useEffect(() => {
    if (user && type && type in user) {
      setDesc((user[type as keyof IUser] as string) || '')
    } else {
      setDesc('')
    }
  }, [type, user])

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ fontSize: 12 }}>{title}</Box>
      {isEditing && (
        <Box sx={{ position: 'relative' }}>
          <TextField
            value={desc}
            onChange={handleDescChange}
            inputRef={textFieldRef}
            variant="outlined"
            size="small"
            autoFocus
            data-no-dnd="true"
            inputProps={{
              style: {
                fontWeight: 400,
                fontSize: 14,
                color: 'black',
                width: '138px',
                height: '36px',
                padding: '0px 0px 0px 8px'
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'blue'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'blue'
                }
              }
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '110%',
              left: '12%',
              right: 0,
              display: 'flex',
              gap: '8px'
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => {
                setDesc((user?.[type as keyof IUser] as string) || '')
                setIsEditing(false)
              }}
              sx={{
                boxShadow: 1,
                width: 36,
                height: 36,
                borderRadius: '4px',
                color: (theme) => theme.palette.grey[500],
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            <IconButton
              aria-label="check"
              onClick={handleSubmitItem}
              sx={{
                boxShadow: 1,
                width: 36,
                height: 36,
                borderRadius: '4px',
                color: (theme) => theme.palette.grey[500],
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px'
                }
              }}
            >
              <CheckIcon />
            </IconButton>
          </Box>
        </Box>
      )}
      {!isEditing && (
        <Box sx={MENU_STYLES_TITLE} onClick={() => setIsEditing(true)}>
          {(user?.[type as keyof IUser] as string) || ''}
        </Box>
      )}
    </Box>
  )
}
