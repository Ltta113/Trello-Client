import { Button, Divider } from '@mui/material'
import Box from '@mui/material/Box'
import MenuItem from '../MenuItem/MenuItem'
import Grid from '@mui/material/Grid'

export default function RescourcesMenu() {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'transparent',
        display: 'flex'
      }}
    >
      <Box sx={{ width: '60%', ml: '13%', mr: '40px', pr: '32px', pt: '32px', pb: '76px' }}>
        <Box sx={{ fontWeight: 500, pb: 2 }}>Learn & connect</Box>
        <Divider></Divider>
        <Grid container spacing={2} sx={{ pt: 3 }}>
          <Grid item xs={12} sm={4}>
            <MenuItem
              title="Trello guide"
              desc="Our easy to follow workflow guide will take you from project set-up to Trello expert in no time.."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              title="Remote work guide"
              desc="The complete guide to setting up your team for remote work success."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              title="EWebinars"
              desc="Enjoy our free Trello webinars and become a productivity professional."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              title="Customer stories"
              desc="See how businesses have adopted Trello as a vital part of their workflow."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              title="Developers"
              desc="The sky's the limit in what you can deliver to Trello users in your Power-Up!"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              title="Help resources"
              desc="Need help? Articles and FAQs to get you unstuck."
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          width: '40%',
          bgcolor: '#f7f5ff',
          pt: '32px',
          pb: '76px',
          p: '20px',
          pr: '13%',
          mt: 0.3
        }}
      >
        <Box sx={{ fontWeight: 500, pb: 1 }}>Helping teams work better, together</Box>
        <Divider></Divider>
        <Box sx={{ fontSize: 12, pt: 1.5, pb: 2 }}>
          Discover Trello use cases, productivity tips, best practices for team collaboration, and
          expert remote work advice.
        </Box>
        <Button
          sx={{
            fontSize: 15,
            color: 'black',
            borderColor: 'black',
            p: '11px 16px 11px 16px'
          }}
          variant="outlined"
        >
          Check out the Trello blog
        </Button>
      </Box>
    </Box>
  )
}
