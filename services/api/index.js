import auth from '@/services/api/auth.js'
export default (apiCaller, apiInstances) => ({
  auth: auth(apiCaller),
  instances: apiInstances,
})
