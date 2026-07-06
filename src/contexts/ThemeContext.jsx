import { createContext, useState, useLayoutEffect } from 'react'

export const ThemeContext = createContext()

const THEME_KEY = 'switch-theme'

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme
  localStorage.setItem(THEME_KEY, theme)
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY) || 'light'
    applyTheme(stored)
    return stored
  })

  useLayoutEffect(() => {
    applyTheme(theme)
    document.documentElement.classList.remove('theme-switching')
  }, [theme])

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-switching')
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
