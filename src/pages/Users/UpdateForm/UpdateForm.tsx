import { Box } from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import ProfileBar from '~/components/ProfileBar/ProfileBar'
import { useAppDispatch } from '~/redux/store'
import { getCurrent } from '~/redux/userSlice'
import Profiles from './Profiles/Profiles'
import Security from './Security/Security'

export default function UpdateForm() {
  const dispatch = useAppDispatch()

  const [value, setValue] = useState(0)

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  useEffect(() => {
    dispatch(getCurrent())
  }, [dispatch])
  return (
    <Box>
      <ProfileBar value={value} handleChange={handleChange} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: '0px 20px 32px 20px'
        }}
      >
        <Box
          sx={{
            width: {
              xs: 'calc(100% - 20px)',
              sm: 'calc(100% - 40px)',
              md: 'calc(100% - 60px)',
              lg: 'calc(100% - 80px)',
              xl: '584px'
            },
            maxWidth: '584px',
            boxSizing: 'border-box'
          }}
        >
          {value === 0 && <Profiles />}
          {value === 1 && <Box>1</Box>}
          {value === 2 && <Security />}
        </Box>
      </Box>
    </Box>
  )
}
