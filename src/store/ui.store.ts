import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

const THEME_KEY = 'snippet-manager:theme'

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY)
  const theme = stored === 'light' || stored === 'dark' ? stored : getSystemTheme()
  applyThemeClass(theme)
  return theme
}

interface UiState {
  theme: Theme
  sidebarCollapsed: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      // Computed synchronously during store creation (not via persist's storage
      // adapter, which hydrates asynchronously) so the `dark` class is applied
      // before first paint — avoids a flash of the wrong theme.
      theme: getInitialTheme(),
      sidebarCollapsed: false,
      setTheme: (theme) => {
        localStorage.setItem(THEME_KEY, theme)
        applyThemeClass(theme)
        set({ theme })
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        localStorage.setItem(THEME_KEY, next)
        applyThemeClass(next)
        set({ theme: next })
      },
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: 'snippet-manager:ui',
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    },
  ),
)
