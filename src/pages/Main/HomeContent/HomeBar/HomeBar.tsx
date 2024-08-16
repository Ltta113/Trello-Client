import Box from '@mui/material/Box'
import AtlassianTrelloLogo from '~/assets/trello_atlanssian.svg?react'
import SvgIcon from '@mui/material/SvgIcon'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import FeaturesMenu from './FeaturesMenu/FeaturesMenu'
import SolutionsMenu from './SolutionsMenu/SolutionsMenu'
import PlansMenu from './PlansMenu/PlansMenu'
import RescourcesMenu from './ResourcesMenu/RescourcesMenu'

const MENU_ITEM_STYLES = {
  bgcolor: 'transparent',
  height: '60px',
  border: 'none',
  cursor: 'pointer',
  fontSize: 15,
  p: '20px 16px 16px 16px',
  '&:hover': {
    color: 'blue'
  }
}

function HomeBar() {
  const navigate = useNavigate()

  const [open, setOpen] = useState<number>(0)

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        height: '60px',
        display: 'flex',
        paddingX: '7%',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        boxShadow: 2,
        overflowX: 'auto',
        bgcolor: 'white',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <SvgIcon
            component={AtlassianTrelloLogo}
            inheritViewBox
            sx={{ fontSize: 110, width: '112px', height: '38px' }}
          />
          <Box sx={{ display: { xs: 'none', md: 'flex', p: 'none' } }}>
            <Box sx={MENU_ITEM_STYLES} onClick={() => (open === 1 ? setOpen(0) : setOpen(1))}>
              Tính năng
              <KeyboardArrowDownIcon fontSize="small" sx={{ pt: 1 }} />
            </Box>
            <Box sx={MENU_ITEM_STYLES} onClick={() => (open === 2 ? setOpen(0) : setOpen(2))}>
              Giải pháp
              <KeyboardArrowDownIcon fontSize="small" sx={{ pt: 1 }} />
            </Box>
            <Box sx={MENU_ITEM_STYLES} onClick={() => (open === 3 ? setOpen(0) : setOpen(3))}>
              Gói
              <KeyboardArrowDownIcon fontSize="small" sx={{ pt: 1 }} />
            </Box>
            <Box
              sx={{
                bgcolor: 'transparent',
                height: '60px',
                border: 'none',
                cursor: 'pointer',
                fontSize: 15,
                p: '24px 16px 16px 16px',
                '&:hover': {
                  color: 'blue'
                }
              }}
            >
              Biểu phí
            </Box>
            <Box sx={MENU_ITEM_STYLES} onClick={() => (open === 4 ? setOpen(0) : setOpen(4))}>
              Tài liệu
              <KeyboardArrowDownIcon fontSize="small" sx={{ pt: 1 }} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'transparent',
              height: '60px',
              border: 'none',
              cursor: 'pointer',
              fontSize: 18,
              p: '8px 24px 8px 24px'
            }}
            onClick={() => navigate('login')}
          >
            Đăng nhập
          </Box>
          <Box
            sx={{
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              bgcolor: (theme) => theme.palette.primary.main,
              height: '60px',
              border: 'none',
              cursor: 'pointer',
              fontSize: 18,
              p: '8px 24px 8px 24px',
              '&:hover': {
                filter: 'brightness(0.8)'
              }
            }}
            onClick={() => navigate('signup')}
          >
            Tải Trello miễn phí
          </Box>
        </Box>
      </Box>
      {open !== 0 && (
        <Box
          sx={{
            position: 'fixed',
            top: '60px',
            left: 0,
            width: '100%',
            zIndex: 20,
            boxShadow: (theme) => theme.shadows[4],
            borderRadius: '4px',
            height: 'auto',
            minHeight: '60px'
          }}
        >
          {open === 1 && <FeaturesMenu />}
          {open === 2 && <SolutionsMenu />}
          {open === 3 && <PlansMenu />}
          {open === 4 && <RescourcesMenu />}
        </Box>
      )}
    </Box>
  )
}

export default HomeBar
