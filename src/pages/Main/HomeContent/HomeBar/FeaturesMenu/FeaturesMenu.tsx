import { Button, Divider } from '@mui/material'
import Box from '@mui/material/Box'
import {
  FeatureIcon1,
  FeatureIcon2,
  FeatureIcon3,
  FeatureIcon4,
  FeatureIcon5
} from '~/assets/HomeMenuIcon'
import MenuItem from '../MenuItem/MenuItem'
import Grid from '@mui/material/Grid'

export default function FeaturesMenu() {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'transparent',
        display: 'flex'
      }}
    >
      <Box sx={{ width: '60%', ml: '13%', mr: '40px', pr: '32px', pt: '32px', pb: '76px' }}>
        <Box sx={{ fontWeight: 500, pb: 2 }}>Explore the features that help your team succeed</Box>
        <Divider></Divider>
        <Grid container spacing={2} sx={{ pt: 3 }}>
          <Grid item xs={12} sm={4}>
            <MenuItem
              icon={FeatureIcon1}
              title="Views"
              desc="View your team’s projects from every angle."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              icon={FeatureIcon2}
              title="Automation"
              desc="Automate tasks and workflows with Butler automation."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              icon={FeatureIcon3}
              title="Power-Ups"
              desc="Power up your teams by linking their favorite tools with Trello plugins."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              icon={FeatureIcon4}
              title="Templates"
              desc="Give your team a blueprint for success with easy-to-use templates from industry leaders and the Trello community."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MenuItem
              icon={FeatureIcon5}
              title="Integrations"
              desc="Find the apps your team is already using or discover new ways to get work done in Trello."
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
        <Box sx={{ fontWeight: 500, pb: 1 }}>Meet Trello</Box>
        <Divider></Divider>
        <Box sx={{ fontSize: 12, pt: 1.5, pb: 2 }}>
          Trello makes it easy for your team to get work done. No matter the project, workflow, or
          type of team, Trello can help keep things organized. It’s simple – sign-up, create a
          board, and you’re off! Productivity awaits.
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
          Check out Trello
        </Button>
      </Box>
    </Box>
  )
}
