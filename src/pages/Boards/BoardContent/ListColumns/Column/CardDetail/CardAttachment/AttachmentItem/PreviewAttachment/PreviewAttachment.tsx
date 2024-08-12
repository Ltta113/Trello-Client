import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchAttachmentByCardIdAPI } from '~/redux/attachmentSlice'
import { RootState, useAppDispatch } from '~/redux/store'
import DialogContentText from '@mui/material/DialogContentText'
import Box from '@mui/material/Box'
import { timeAgo } from '~/utils/timeAgo'
import { Typography } from '@mui/material'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import AirplayIcon from '@mui/icons-material/Airplay'
import ClearIcon from '@mui/icons-material/Clear'
import { updateCardDetails, updateCardState } from '~/redux/boardSlice'
import { deleteAttachmentAPI, updateCoverState } from '~/redux/cardSlice'

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  attachmentId: string
}

export default function PreviewAttachment({ open, setOpen, attachmentId }: Props) {
  const cardId = useSelector((state: RootState) => state.card.cardId)
  const card = useSelector((state: RootState) => state.card.card)
  const attachments = useSelector((state: RootState) => state.attachment.attachments)
  const [deleteAttachment, setDeleteAttachment] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchAttachmentByCardIdAPI(cardId))
  }, [cardId, dispatch])

  const handleClose = () => {
    setOpen(false)
  }
  const handleOpenNew = () => {
    window.open(attachment?.url, '_blank')
  }

  const attachmentTime = (): string => {
    if (attachment?.createdAt) {
      return 'Đã thêm ' + timeAgo(new Date(attachment.createdAt))
    } else {
      return ''
    }
  }
  const handleDelete = () => {
    const updatedCover = {
      ...card?.cover,
      idAttachment: null,
      color: null,
      idCloudImage: null
    }
    dispatch(updateCoverState({ cover: updatedCover }))
    dispatch(deleteAttachmentAPI(attachment?._id))
    dispatch(
      updateCardState({
        cardId: card?._id,
        columnId: card?.columnId,
        deleteAttachmentId: attachment?._id
      })
    )
  }

  const handleSetAttachmentId = (attachmentId: string | null) => {
    if (card?._id) {
      const updatedCover = {
        ...card.cover,
        idAttachment: attachmentId,
        color: null,
        idCloudImage: null
      }
      dispatch(updateCardDetails({ cardId: card._id, dataUpdate: { cover: updatedCover } }))
      dispatch(
        updateCardState({
          cardId: card._id,
          columnId: card.columnId,
          dataUpdate: { cover: updatedCover }
        })
      )
      dispatch(updateCoverState({ cover: updatedCover }))
    }
  }

  const descriptionElementRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  const attachment = attachments.find((att) => att._id === attachmentId)

  return (
    <Fragment>
      <Box sx={{ height: 'auto', width: '100%', bgcolor: 'transparent' }}>
        {attachment && (
          <Dialog
            open={open}
            onClose={handleClose}
            scroll="body"
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            maxWidth="md"
            fullWidth
          >
            <DialogContent sx={{ p: 0, position: 'relative' }}>
              {attachment.mimeType.startsWith('image') && (
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              )}
              {!attachment.mimeType.startsWith('image') &&
                attachment.url.startsWith('https://firebasestorage.googleapis.com/') && (
                <DialogContentText
                  id="scroll-dialog-description"
                  ref={descriptionElementRef}
                  tabIndex={-1}
                >
                  <iframe
                    src={attachment.url}
                    title="File Preview"
                    style={{
                      width: '100%',
                      height: '600px',
                      border: 'none',
                      overflowX: 'hidden'
                    }}
                  />
                </DialogContentText>
              )}
              {!attachment.mimeType.startsWith('image') &&
                !attachment.url.startsWith('https://firebasestorage.googleapis.com/') && (
                <DialogContentText
                  id="scroll-dialog-description"
                  ref={descriptionElementRef}
                  tabIndex={-1}
                >
                    Tập đính kèm không có bản xem trước
                </DialogContentText>
              )}
              <Box
                sx={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  textAlign: 'center',
                  zIndex: 1300
                }}
              >
                <DialogTitle>{attachment.name}</DialogTitle>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {attachmentTime()}
                </Typography>
                {!deleteAttachment && (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      mb: 1,
                      justifyContent: 'center',
                      '& .MuiTypography-root': {
                        '&:hover': { textDecoration: 'underline', cursor: 'pointer' }
                      }
                    }}
                  >
                    <Typography variant="body2" onClick={handleOpenNew}>
                      <ArrowOutwardIcon sx={{ pt: 1.2 }} />
                      Mở trong tab mới
                    </Typography>
                    {card?.cover?.idAttachment === attachment._id && (
                      <Typography variant="body2" onClick={() => handleSetAttachmentId(null)}>
                        <AirplayIcon sx={{ pt: 1.2 }} />
                        Bỏ ảnh bìa
                      </Typography>
                    )}
                    {card?.cover?.idAttachment !== attachment._id &&
                      attachment.mimeType.startsWith('image') && (
                      <Typography
                        variant="body2"
                        onClick={() => handleSetAttachmentId(attachment._id)}
                      >
                        <AirplayIcon sx={{ pt: 1.2 }} />
                          Đặt làm ảnh bìa
                      </Typography>
                    )}
                    <Typography variant="body2" onClick={() => setDeleteAttachment(true)}>
                      <ClearIcon sx={{ pt: 1.2 }} />
                      Xóa
                    </Typography>
                  </Box>
                )}
                {deleteAttachment && (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      mb: 1,
                      justifyContent: 'center',
                      pt: 1.1
                    }}
                  >
                    <Typography variant="body2">
                      Bạn có thật sự muốn xóa không? Sẽ không có cách nào để hoàn tác.
                    </Typography>
                    <Typography
                      variant="body2"
                      onClick={handleDelete}
                      sx={{
                        '&:hover': { textDecoration: 'underline', cursor: 'pointer' }
                      }}
                    >
                      Xoá vĩnh viễn.
                    </Typography>
                    <Typography
                      variant="body2"
                      onClick={() => setDeleteAttachment(false)}
                      sx={{
                        '&:hover': { textDecoration: 'underline', cursor: 'pointer' }
                      }}
                    >
                      Đừng bận tâm.
                    </Typography>
                  </Box>
                )}
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </Fragment>
  )
}
