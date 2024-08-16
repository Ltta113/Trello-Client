import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import InforItem from './InfoItem/InforItem'

export default function EditInfo() {

  return (
    <Box>
      <Box sx={{ fontSize: 16, fontWeight: '500', pb: 1, pt: 2 }}>Giới thiệu về bản thân</Box>
      <Paper
        elevation={1}
        sx={{
          display: 'flex-1',
          justifyContent: 'start',
          position: 'relative',
          p: '20px 16px'
        }}
      >
        <InforItem title="Họ" type='firstname' />
        <InforItem title="Tên" type='lastname' />
      </Paper>
    </Box>
  )
}
