export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated()) {
      // Store the intended destination
      const intendedRoute = to.fullPath

      // Redirect to login page with return URL
      return navigateTo({
        path: '/login',
        query: { redirect: intendedRoute },
      })
    }
  }
})
