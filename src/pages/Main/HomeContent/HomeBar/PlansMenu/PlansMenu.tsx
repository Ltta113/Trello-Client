import { Button, Divider } from '@mui/material'
import Box from '@mui/material/Box'
import { PlanIcon1, PlanIcon2, PlanIcon3, PlanIcon4 } from '~/assets/HomeMenuIcon'
import MenuItem from '../MenuItem/MenuItem'
import Grid from '@mui/material/Grid'

export default function PlansMenu() {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'transparent',
        display: 'flex'
      }}
    >
      <Box sx={{ width: '60%', ml: '13%', mr: '40px', pr: '32px', pt: '32px', pb: '76px' }}>
        <Box sx={{ fontWeight: 500, pb: 2 }}>
          Take a page out of these pre-built Trello playbooks designed for all teams
        </Box>
        <Divider></Divider>
        <Grid container spacing={2} sx={{ pt: 3 }}>
          <Grid item xs={12} sm={4}>
            <MenuItem
              icon={PlanIcon1}
              color="#79e2f2"
              title="Standard"
              desc="For teams that need to manage more work and scale collaboration."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              icon={PlanIcon2}
              color="#f99cdb"
              title="Premium"
              desc="Best for teams up to 100 that need to track multiple projects and visualize work in a variety of ways."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              icon={PlanIcon3}
              color="#4c9aff"
              title="Enterprise"
              desc="Everything your enterprise teams and admins need to manage projects."
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            bgcolor: '#fffdf5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: '24px'
          }}
        >
          <MenuItem
            icon={PlanIcon4}
            color="#ffc400"
            title="Free plan"
            desc="For individuals or small teams looking to keep work organized."
          />
          <Button
            sx={{
              fontSize: 15,
              color: 'black',
              borderColor: 'black',
              p: '11px 16px 11px 16px'
            }}
            variant="outlined"
          >
            Take a tour of Trello
          </Button>
        </Box>
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
        <Box sx={{ fontWeight: 500, pb: 1 }}>Compare plans & pricing</Box>
        <Divider></Divider>
        <Box sx={{ fontSize: 12, pt: 1.5, pb: 2 }}>
          Whether you’re a team of 2 or 2,000, Trello’s flexible pricing model means you only pay
          for what you need.
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
          View Trello pricing
        </Button>
      </Box>
    </Box>
  )
}
