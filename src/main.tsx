import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.tsx'
import { CssBaseline } from '@mui/material'
import theme from '~/theme.ts'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from 'react-redux'
import { store } from './redux/store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        <App />
        <ToastContainer position="bottom-left" theme="colored" />
      </CssVarsProvider>
    </Provider>
  </React.StrictMode>
)
