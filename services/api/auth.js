export default (apiCaller) => ({
  signIn(config) {
    return apiCaller.post('/auth/login', config)
  },
  signUp(config) {
    return apiCaller.post('/auth/signup', config)
  },
})
