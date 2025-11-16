export const useAuth = () => {
  const isAuthenticated = () => {
    if (process.client) {
      const auth = localStorage.getItem('auth')
      return auth === 'token'
    }
    return false
  }

  const login = (token) => {
    if (process.client) {
      localStorage.setItem('auth', token)
    }
  }

  const logout = () => {
    if (process.client) {
      localStorage.removeItem('auth')
    }
  }

  return {
    isAuthenticated,
    login,
    logout,
  }
}
