import { useSelector } from 'react-redux'
import { useAppDispatch } from '~/redux/store'
import { RootState } from '~/redux/store'
import { closeCardDetail, fetchCardDetails } from '~/redux/cardSlice'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import VideoLabelOutlinedIcon from '@mui/icons-material/VideoLabelOutlined'
import { IColumn } from '~/apis/type'
import ListButton from './ListButton/ListButton'
import DetailCard from './DetailCard/DetailCard'
import CardContent from './CardContent/CardContent'

interface CardDetailDialogProps {
  open: boolean
  column: IColumn
}

const CardDetailDialog = ({ open, column }: CardDetailDialogProps) => {
  const dispatch = useAppDispatch()
  const selectedCard = useSelector((state: RootState) => state.card.card)
  const cardId = useSelector((state: RootState) => state.card.cardId)
  // const loading = useSelector((state: RootState) => state.card.loading) // State for loading status

  useEffect(() => {
    if (open) {
      const promise = dispatch(fetchCardDetails(cardId))
      return () => {
        promise.abort()
      }
    }
  }, [cardId, dispatch, open])

  const handleClose = () => {
    dispatch(closeCardDetail())
  }

  if (!open) return null // Return null if dialog is closed

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          left: '25%',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white'),
          boxShadow: 24,
          pb: 0,
          minWidth: '50%',
          maxWidth: '700px',
          minHeight: '90%',
          maxHeight: '90%',
          borderRadius: 2.5,
          display: 'flex-1',
          overflow: 'visible',
          overflowX: 'hidden',
          overflowY: 'scroll',
          gap: 10
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        {/* Render content based on loading state */}
        {
          <>
            <Box
              sx={{
                height: (theme) => theme.trello?.columnHeaderHeight || 'auto',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <VideoLabelOutlinedIcon />
              <Box sx={{ flex: 1, alignItems: 'center', gap: 1, pt: 3 }}>
                <Typography variant="h6">{selectedCard?.title}</Typography>
                <Typography>trong danh sách {column.title}</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                height: (theme) => theme.trello.columnHeaderHeight,
                p: 2,
                mt: 2,
                display: 'flex'
              }}
            >
              <Box sx={{ width: '75%' }}>
                <DetailCard />
                <CardContent />
              </Box>
              <Box sx={{ width: '25%', mb: 10 }}>
                <ListButton></ListButton>
              </Box>
            </Box>
          </>
        }
        <Box sx={{ minHeight: '100px' }}></Box>
      </Box>
    </Modal>
  )
}

export default CardDetailDialog
