import Box from '@mui/material/Box'
import { IAttachment } from '~/apis/type'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import { timeAgo } from '~/utils/timeAgo'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '~/redux/store'
import { updateCardDetails, updateCardState } from '~/redux/boardSlice'
import { deleteAttachmentAPI, updateCoverState } from '~/redux/cardSlice'
import RollerShadesClosedOutlinedIcon from '@mui/icons-material/RollerShadesClosedOutlined'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'
import { deleteAttachment } from '~/redux/attachmentSlice'

type ItemProps = {
  attachment: IAttachment
}

function AttachmentItem({ attachment }: ItemProps) {
  const card = useSelector((state: RootState) => state.card.card)
  const attachmentState = useSelector((state: RootState) => state.attachment)
  const [deleteForm, setDeleteForm] = useState<boolean>(false)

  useEffect(() => {
    if (attachment._id === attachmentState.attachmentIdDelete) {
      setDeleteForm(attachmentState.openDelete)
    } else setDeleteForm(false)
    // if (checkList._id === checkListState.checkListIdAdd) {
    //   setOpenAddForm(checkListState.openAddCheckItem)
    // } else setOpenAddForm(false)
    // if (checkList._id === checkListState.checkListIdUpate) {
    //   setUpdate(checkListState.openEdit)
    // } else {
    //   setUpdate(false)
    //   setEditedTitle(checkList.title)
    // }
  }, [attachment._id, attachmentState])

  const openDelete = () => {
    dispatch(deleteAttachment({ attachmentId: attachment._id }))
  }
  const finishDelete = () => {
    dispatch(
      updateCardState({
        cardId: card?._id,
        columnId: card?.columnId,
        deleteAttachmentId: attachment._id
      })
    )
    dispatch(deleteAttachmentAPI(attachment._id))
  }

  const dispatch = useAppDispatch()

  const handleSetAttachmentId = (attachmentId: string) => {
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

  const attachmentTime = (): string => {
    if (attachment?.updatedAt) {
      return 'Đã sửa ' + timeAgo(new Date(attachment.updatedAt))
    } else if (attachment?.createdAt) {
      return 'Đã thêm ' + timeAgo(new Date(attachment.createdAt))
    } else {
      return ''
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        p: 1,
        cursor: 'pointer',
        gap: 2,
        borderRadius: 1,
        '&:hover': {
          bgcolor: (theme) => (theme.palette.mode === 'light' ? theme.palette.grey[200] : '#2b2e36')
        },
        maxWidth: '100%'
      }}
    >
      {!attachment.mimeType.startsWith('image') && (
        <Box
          sx={{
            width: '112px',
            height: '80px',
            borderRadius: 1,
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[300] : '#2b2e36',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AttachFileOutlinedIcon sx={{ p: 0.5, fontSize: 40, transform: 'rotate(45deg)' }} />
        </Box>
      )}
      {attachment.mimeType.startsWith('image') && (
        <Box
          sx={{
            width: '112px',
            height: '80px'
          }}
        >
          <img
            srcSet={`${attachment.url}?w=164&h=164&fit=crop&auto=format`}
            src={`${attachment.url}?w=164&h=164&fit=crop&auto=format`}
            alt={attachment.name}
            loading="lazy"
            style={{
              borderRadius: '4px',
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              cursor: 'pointer'
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          display: 'flex-1',
          gap: 1,
          maxWidth: 'calc(100% - 130px)'
        }}
      >
        <Box sx={{ fontSize: 14, fontWeight: 'bold' }}>{attachment.name}</Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <Box sx={{ fontSize: 13, color: (theme) => theme.palette.grey[700] }}>
            {attachmentTime()}
          </Box>
          <Typography
            variant="body2"
            sx={{ my: 'auto', color: (theme) => theme.palette.grey[700], mt: 0.2 }}
          >
            •
          </Typography>
          <Box
            sx={{
              fontSize: 13,
              color: (theme) => theme.palette.grey[700],
              textDecoration: 'underline'
            }}
          >
            Tải xuống
          </Box>
          <Typography
            variant="body2"
            sx={{ my: 'auto', color: (theme) => theme.palette.grey[700], mt: 0.2 }}
          >
            •
          </Typography>
          <Box
            sx={{
              fontSize: 13,
              color: (theme) => theme.palette.grey[700],
              textDecoration: 'underline'
            }}
            onClick={openDelete}
          >
            Xóa
          </Box>
          {deleteForm && (
            <Box
              onClick={(e) => e.stopPropagation()}
              data-no-dnd="true"
              sx={{
                position: 'absolute',
                top: '30%',
                left: '40%',
                transform: 'translateX(55%)',
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
                <Typography sx={{ pt: 1, fontWeight: 'bold', textAlign: 'center' }}>
                  Bạn muốn xoá tập tin đính kèm?
                </Typography>
                <Box sx={{ width: '10%' }}>
                  <IconButton
                    aria-label="close"
                    onClick={openDelete}
                    sx={{
                      color: (theme) => theme.palette.grey[500]
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography sx={{ pl: 1.2 }} variant="body1">
                Tập tin đính kèm sẽ bị xoá vĩnh viễn và bạn sẽ không thể hoàn tác.
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: '#c0392b',
                  width: '95%',
                  height: '35px',
                  m: 1,
                  '&:hover': { bgcolor: '#e74c3c' }
                }}
                onClick={finishDelete}
              >
                Xóa
              </Button>
            </Box>
          )}
          <Typography
            variant="body2"
            sx={{ my: 'auto', color: (theme) => theme.palette.grey[700], mt: 0.2 }}
          >
            •
          </Typography>
          <Box
            sx={{
              fontSize: 13,
              color: (theme) => theme.palette.grey[700],
              textDecoration: 'underline'
            }}
          >
            Chỉnh sửa
          </Box>
        </Box>
        {attachment.mimeType.startsWith('image') &&
          card?.cover?.idAttachment !== attachment._id && (
          <Box
            sx={{
              display: 'flex',
              fontSize: 14,
              color: (theme) => theme.palette.grey[700],
              textDecoration: 'underline'
            }}
            onClick={() => handleSetAttachmentId(attachment._id)}
          >
            <RollerShadesClosedOutlinedIcon sx={{ fontSize: 15, mr: 1, mt: 0.3 }} />
            <Box sx={{ mb: 1 }}>Đặt làm ảnh bìa</Box>
          </Box>
        )}
        {attachment.mimeType.startsWith('image') &&
          card?.cover?.idAttachment === attachment._id && (
          <Box
            sx={{
              display: 'flex',
              fontSize: 14,
              color: (theme) => theme.palette.grey[700],
              textDecoration: 'underline'
            }}
            onClick={() => handleSetAttachmentId('')}
          >
            <RollerShadesClosedOutlinedIcon sx={{ fontSize: 15, mr: 1, mt: 0.3 }} />
            <Box sx={{ mb: 1 }}>Bỏ ảnh bìa</Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default AttachmentItem
