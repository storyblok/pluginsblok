import { FunctionComponent, useEffect } from 'react'
import { FieldPluginProvider } from './FieldPluginProvider'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { lightTheme } from '@storyblok/mui'
import Tag from './components/Tag'

const App: FunctionComponent = () => {
  useEffect(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = (isDark: boolean) =>
      document.documentElement.setAttribute(
        'theme',
        isDark ? 'dark' : 'default',
      )
    const handleChange = (event: MediaQueryListEvent) =>
      applyTheme(event.matches)

    applyTheme(darkQuery.matches)
    darkQuery.addEventListener('change', handleChange)
    return () => darkQuery.removeEventListener('change', handleChange)
  }, [])
  return (
    <FieldPluginProvider
      Loading={Loading}
      Error={Error}
    >
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Tag />
      </ThemeProvider>
    </FieldPluginProvider>
  )
}

const Loading: FunctionComponent = () => <p>Loading...</p>
const Error: FunctionComponent<{ error: Error }> = (props) => {
  console.error(props.error)
  return <p>An error occured, please see the console for more details.</p>
}
export default App
