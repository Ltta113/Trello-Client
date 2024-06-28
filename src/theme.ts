import { cyan, deepOrange, orange, teal } from '@mui/material/colors'
import {
  Theme,
  experimental_extendTheme as extendTheme
} from '@mui/material/styles'

// A custom theme for this app
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange
      }
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange
      }
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          color: theme.palette.primary.main,
          fontSize: '0.875rem',
          textTransform: 'none'
        })
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          color: theme.palette.primary.main,
          fontSize: '0.875rem',
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.light
          },
          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main
            }
          },
          '& fieldset': {
            borderWidth: '1px !important'
          }
        })
      }
    }
  }
})

export default theme
