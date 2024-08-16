import { Button, Divider } from '@mui/material'
import Box from '@mui/material/Box'
import {
  SolutionIcon1,
  SolutionIcon2,
  SolutionIcon3,
  SolutionIcon4,
  SolutionIcon5,
  SolutionIcon6
} from '~/assets/HomeMenuIcon'
import MenuItem from '../MenuItem/MenuItem'
import Grid from '@mui/material/Grid'

export default function SolutionsMenu() {
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
              icon={SolutionIcon1}
              title="Marketing teams"
              desc="Whether launching a new product, campaign, or creating content, Trello helps marketing teams succeed."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              icon={SolutionIcon2}
              title="Product management"
              desc="Use Trello’s management boards and roadmap features to simplify complex projects and processes."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              icon={SolutionIcon3}
              title="Engineering teams"
              desc="Ship more code, faster, and give your developers the freedom to be more agile with Trello."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              icon={SolutionIcon4}
              title="Design teams"
              desc="Empower your design teams by using Trello to streamline creative requests and promote more fluid cross-team collaboration."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              icon={SolutionIcon5}
              title="Startups"
              desc="From hitting revenue goals to managing workflows, small businesses thrive with Trello."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              icon={SolutionIcon6}
              title="Remote teams"
              desc="Keep your remote team connected and motivated, no matter where they’re located around the world."
            />
          </Grid>
        </Grid>
        <Button
          sx={{
            fontSize: 15,
            color: 'black',
            borderColor: 'black',
            p: '11px 16px 11px 16px'
          }}
          variant="text"
        >
          See all teams
        </Button>
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
        <Box sx={{ fontWeight: 500, pb: 1 }}>Our product in action</Box>
        <Divider></Divider>
        <Box sx={{ cursor: 'pointer' }}>
          <Box sx={{ fontSize: 15, pt: 3 }}>Use case: Task management</Box>
          <Box sx={{ fontSize: 12, pt: 1, pb: 2 }}>
            Track progress of tasks in one convenient place with a visual layout that adds ‘ta-da’
            to your to-do’s.
          </Box>
        </Box>
        <Box sx={{ cursor: 'pointer' }}>
          <Box sx={{ fontSize: 15, pt: 3 }}>Use case: Resource hub</Box>
          <Box sx={{ fontSize: 12, pt: 1, pb: 2 }}>
            Save hours when you give teams a well-designed hub to find information easily and
            quickly.
          </Box>
        </Box>
        <Box sx={{ cursor: 'pointer' }}>
          <Box sx={{ fontSize: 15, pt: 3 }}>Use case: Project management</Box>
          <Box sx={{ fontSize: 12, pt: 1, pb: 2 }}>
            Keep projects organized, deadlines on track, and teammates aligned with Trello.
          </Box>
        </Box>
        <Button
          sx={{
            fontSize: 15,
            color: 'black',
            borderColor: 'black',
            p: '11px 16px 11px 16px'
          }}
          variant="text"
        >
          See all use cases
        </Button>
      </Box>
    </Box>
  )
}
