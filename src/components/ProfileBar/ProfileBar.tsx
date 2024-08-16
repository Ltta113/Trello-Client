import Box from '@mui/material/Box'
import ModeSelect from '../ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import TrelloLogo from '~/assets/trello.svg?react'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Tab from '@mui/material/Tab'

import { SyntheticEvent } from 'react'
import Tabs from '@mui/material/Tabs'
import ProfilesEdit from './ProfileEdit/ProfileEdit'

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}
type Props = {
  value: number
  // eslint-disable-next-line no-unused-vars
  handleChange: (event: SyntheticEvent, newValue: number) => void
}

function ProfileBar({ value, handleChange }: Props) {
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        paddingX: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'),
        '&::-webkit-scrollbar-track': { m: 2 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: 'white' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon component={TrelloLogo} inheritViewBox sx={{ color: 'white' }} />
          <Typography
            component="span"
            variant="body1"
            sx={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            Trello
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{
                color: 'white',
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white'
                },
                '& .MuiTab-root': {
                  color: 'white',
                  '&.Mui-selected': {
                    color: 'white'
                  }
                }
              }}
            >
              <Tab label="Hồ sơ và chế độ hiển thị" {...a11yProps(0)} />
              <Tab label="Email" {...a11yProps(1)} />
              <Tab label="Bảo mật" {...a11yProps(2)} />
            </Tabs>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <ModeSelect />
        <Tooltip title="Notification">
          <Badge color="warning" variant="dot" sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'white' }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>
        <ProfilesEdit />
      </Box>
    </Box>
  )
}

export default ProfileBar
