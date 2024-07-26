import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import { RootState } from '~/redux/store'
import { useSelector } from 'react-redux'
import AttachmentItem from './AttachmentItem/AttachmentItem'

function CardAttachment() {
//   const dispatch = useAppDispatch()

  const card = useSelector((state: RootState) => state.card.card)

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <AttachFileOutlinedIcon sx={{ p: 0.5, fontSize: 30, transform: 'rotate(45deg)' }} />
        <Typography variant="subtitle1" sx={{ mb: 0, fontWeight: 'bold' }}>
          Các tập tin đính kèm
        </Typography>
      </Box>
      <Box
        sx={{
          ml: 3.5,
          p: 0.5,
          width: '90%',
          borderRadius: 1,
          '&& .ProseMirror': {
            height: '200px',
            overflowY: 'auto'
          }
        }}
      >
        <Box>
          {card?.attachments && card.attachments.map(attachment => (
            <AttachmentItem key={attachment._id} attachment={attachment} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default CardAttachment
