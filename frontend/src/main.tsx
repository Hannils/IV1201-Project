import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import { AuthProvider } from './util/auth'
import theme from './util/theme'

/**
 * The queryclient used wihtin the whole application.
 * @see https://tanstack.com/query/v4/docs/react/reference/useQuery
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      staleTime: 1000 * 60,
    },
  },
})

/**
 * Main renderer. Provides all the global contexts and renders {@link App}
 */
function init() {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </React.StrictMode>,
  )
}

init()
