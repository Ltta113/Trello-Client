import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '~/redux/store'
import { experimentalStyled as styled } from '@mui/material/styles'
import { createNewAttachment } from '~/redux/cardSlice'
import { updateCardState } from '~/redux/boardSlice'
import { useState } from 'react'
import { Divider } from '@mui/material'
import TextField from '@mui/material/TextField'

type AttachmentFormProps = {
  createAttachment: boolean
  // eslint-disable-next-line no-unused-vars
  setCreateAttachment: (value: React.SetStateAction<boolean>) => void
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

function Attachment({ createAttachment, setCreateAttachment }: AttachmentFormProps) {
  const card = useSelector((state: RootState) => state.card.card)

  const dispatch = useAppDispatch()

  const [name, setName] = useState<string>('')
  const [url, setUrl] = useState<string>('')

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && card) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('cardId', card._id)
      formData.append('name', name)
      try {
        const newAttachment = await dispatch(createNewAttachment(formData)).unwrap()
        dispatch(
          updateCardState({
            cardId: card._id,
            columnId: card.columnId,
            attachment: newAttachment
          })
        )
      } catch (error) {
        toast.error(`Error: ${error}`)
      }
      setCreateAttachment(!createAttachment)
      setName('')
      setUrl('')
    }
  }
  const handleGetUrl = async () => {
    if (url) {
      const attachment = {
        cardId: card?._id,
        name: name,
        url: url
      }
      try {
        const newAttachment = await dispatch(createNewAttachment(attachment)).unwrap()
        dispatch(
          updateCardState({
            cardId: card?._id,
            columnId: card?.columnId,
            attachment: newAttachment
          })
        )
      } catch (error) {
        toast.error(`Error: ${error}`)
      }
      setCreateAttachment(!createAttachment)
      setName('')
      setUrl('')
    }
  }
  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{
        position: 'fixed',
        top: '10%',
        left: '61%',
        zIndex: 1500,
        minWidth: '300px',
        maxWidth: '300px',
        minHeight: '200px',
        maxHeight: 'auto',
        padding: '4px 8px',
        borderRadius: 1,
        bgcolor: (theme) => (theme.palette.mode === 'light' ? 'white' : '#2b2e36'),
        boxShadow: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ width: '10%' }}></Box>
          <Typography sx={{ pt: 1 }}>Đính kèm</Typography>
          <Box sx={{ mr: 1 }}>
            <IconButton
              aria-label="close"
              onClick={() => {
                setCreateAttachment(!createAttachment)
                setName('')
                setUrl('')
              }}
              sx={{
                color: (theme) => theme.palette.grey[500]
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Box>
          <Box
            sx={{
              fontSize: 13,
              alignItems: 'start',
              pl: 1,
              fontWeight: 'bold',
              color: (theme) => theme.palette.grey[700]
            }}
          >
            Đính kèm tệp từ máy tính của bạn
          </Box>
          <Button
            variant="contained"
            data-no-dnd="true"
            size="small"
            component="label"
            role={undefined}
            sx={{
              width: '95%',
              height: '35px',
              m: 1,
              color: (theme) => (theme.palette.mode === 'light' ? 'black' : 'white'),
              bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36'),
              '&:hover': {
                bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36')
              }
            }}
          >
            Tải tệp lên
            <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
          </Button>
        </Box>
        <Divider sx={{ pt: 1 }}></Divider>
        <Box sx={{ m: '4px 0px 6px 0px' }}>
          <Box
            sx={{
              fontSize: 13,
              alignItems: 'start',
              pl: 1,
              fontWeight: 'bold',
              color: (theme) => theme.palette.grey[700]
            }}
          >
            Tìm kiếm hoặc dán liên kết
          </Box>
          <Box>
            <TextField
              id="outlined-search"
              type="text"
              size="small"
              variant="outlined"
              data-no-dnd="true"
              placeholder="Dán một liên kết"
              value={url}
              autoFocus
              sx={{
                p: 1,
                width: '100%'
              }}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Box>
        </Box>
        <Box sx={{ m: '4px 0px 6px 0px' }}>
          <Box
            sx={{
              fontSize: 13,
              alignItems: 'start',
              pl: 1,
              fontWeight: 'bold',
              color: (theme) => theme.palette.grey[700]
            }}
          >
            Văn bản hiển thị (không bắt buộc)
          </Box>
          <Box>
            <TextField
              id="outlined-search"
              type="text"
              size="small"
              variant="outlined"
              data-no-dnd="true"
              placeholder="Văn bản cần hiển thị"
              value={name}
              autoFocus
              sx={{
                p: 1,
                width: '100%'
              }}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 2, ml: 0.5, mb: 2, pr: 1, alignItems: 'flex-end', justifyContent: 'right' }}>
            <Button
              onClick={() => {
                setCreateAttachment(!createAttachment)
                setName('')
                setUrl('')
              }}
              sx={{ '&:hover': { bgcolor: (theme) => theme.palette.grey[200] } }}
              variant="text"
            >
              Hủy
            </Button>
            <Button onClick={handleGetUrl} variant="contained">
              Chèn
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Attachment
