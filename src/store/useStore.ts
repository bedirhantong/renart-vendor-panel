import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

interface Store {
  id: string
  name: string
  description?: string
  logoUrl?: string
  email: string
  isActive: boolean
}

interface AuthState {
  user: User | null
  store: Store | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  setAuth: (user: User, store: Store, token: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  updateStore: (store: Partial<Store>) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        store: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,

        // Actions
        setAuth: (user, store, token) => {
          set(
            {
              user,
              store,
              token,
              isAuthenticated: true,
              isLoading: false,
            },
            false,
            'setAuth'
          )
          // Store token in localStorage for API calls
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token)
          }
        },

        clearAuth: () => {
          set(
            {
              user: null,
              store: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            },
            false,
            'clearAuth'
          )
          // Clear token from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
          }
        },

        setLoading: (loading) => {
          set({ isLoading: loading }, false, 'setLoading')
        },

        updateStore: (updates) => {
          const currentStore = get().store
          if (currentStore) {
            set(
              {
                store: { ...currentStore, ...updates },
              },
              false,
              'updateStore'
            )
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          store: state.store,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
)

// UI State Store
interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
}

interface UIActions {
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create<UIState & UIActions>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        sidebarOpen: true,
        theme: 'light',

        // Actions
        toggleSidebar: () => {
          set(
            (state) => ({ sidebarOpen: !state.sidebarOpen }),
            false,
            'toggleSidebar'
          )
        },

        setSidebarOpen: (open) => {
          set({ sidebarOpen: open }, false, 'setSidebarOpen')
        },

        setTheme: (theme) => {
          set({ theme }, false, 'setTheme')
        },
      }),
      {
        name: 'ui-storage',
      }
    )
  )
)
