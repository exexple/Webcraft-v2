import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Auth Store - Client state for authentication
const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setAdmin: (admin) => set({ admin, isAuthenticated: !!admin }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        logout: () =>
          set({
            user: null,
            admin: null,
            isAuthenticated: false,
            error: null,
          }),
        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-store',
      }
    )
  )
);

// UI Store - UI state management
const useUiStore = create(
  devtools((set) => ({
    isMobileMenuOpen: false,
    isLoading: false,
    notification: null,
    modal: null,

    // Actions
    toggleMobileMenu: () =>
      set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    closeMobileMenu: () => set({ isMobileMenuOpen: false }),
    setLoading: (isLoading) => set({ isLoading }),
    showNotification: (notification) => set({ notification }),
    hideNotification: () => set({ notification: null }),
    openModal: (modal) => set({ modal }),
    closeModal: () => set({ modal: null }),
  }))
);

// Cache Store - Temporary cache for frequently accessed data
const useCacheStore = create(
  devtools(
    persist(
      (set, get) => ({
        cache: {},

        // Actions
        setCache: (key, value, ttl = 5 * 60 * 1000) => {
          set((state) => ({
            cache: {
              ...state.cache,
              [key]: {
                value,
                timestamp: Date.now(),
                ttl,
              },
            },
          }));
        },

        getCache: (key) => {
          const cached = get().cache[key];
          if (!cached) return null;

          const isExpired = Date.now() - cached.timestamp > cached.ttl;
          if (isExpired) {
            set((state) => {
              const newCache = { ...state.cache };
              delete newCache[key];
              return { cache: newCache };
            });
            return null;
          }

          return cached.value;
        },

        clearCache: (key) => {
          if (key) {
            set((state) => {
              const newCache = { ...state.cache };
              delete newCache[key];
              return { cache: newCache };
            });
          } else {
            set({ cache: {} });
          }
        },
      }),
      {
        name: 'cache-store',
      }
    )
  )
);

export { useAuthStore, useUiStore, useCacheStore };
