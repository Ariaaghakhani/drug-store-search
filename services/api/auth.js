export default (apiCaller) => ({
  signIn(config) {
    return apiCaller.post('/auth/login', config)
  },
  signUp(config) {
    return apiCaller.post('/auth/signup', config)
  },
  fetchUser(config) {
    return apiCaller.get('/user/', config)
  },
  logout(config) {
    return apiCaller.post('/auth/logout', config)
  },
})
