import createApi from '~/services/api/index.js'
import { cachedToken } from '@/plugins/authentication.client'

const apiPromisesCache = new Map()

const addTrailingAndLeadingSlashToUrl = (url) => {
  if (/^(?!https?:).*/.test(url) && !url.startsWith('/')) url = '/' + url
  if (!url.endsWith('/')) url = url + '/'
  return url
}

const setDefaultConfigs = (config) => {
  config.instance = config.instance || 'default'
  config.params = config.params || null

  for (const property in config.params) {
    if (config.params[property] === null) delete config.params[property]
  }
  return config
}

export const apiCaller = (apiCallerInstances) => ({
  get(url, config = {}) {
    config = setDefaultConfigs(config)
    config.method = 'GET'
    const apiCallerInstance = apiCallerInstances[config.instance]

    if (config.instance === 'default') {
      url = addTrailingAndLeadingSlashToUrl(url)
    }

    const key = url + (config.params ? JSON.stringify(config.params) : '')

    if (apiPromisesCache.has(key)) {
      return apiPromisesCache.get(key)
    }

    const promise = apiCallerInstance(url, config)
    apiPromisesCache.set(key, promise)

    promise.finally(() => {
      apiPromisesCache.delete(key)
    })

    return promise
  },
  post(url, config = {}) {
    config = setDefaultConfigs(config)
    config.method = 'POST'
    const apiCallerInstance = apiCallerInstances[config.instance]

    if (config.instance === 'default') {
      url = addTrailingAndLeadingSlashToUrl(url)
    }

    const requestBody = config.data
    delete config.data
    return apiCallerInstance(url, { body: requestBody, ...config })
  },
  put(url, config = {}) {
    config = setDefaultConfigs(config)
    config.method = 'PUT'
    const apiCallerInstance = apiCallerInstances[config.instance]

    if (config.instance === 'default') {
      url = addTrailingAndLeadingSlashToUrl(url)
    }

    const requestBody = config.data
    delete config.data
    return apiCallerInstance(url, { body: requestBody, ...config })
  },
  patch(url, config = {}) {
    config = setDefaultConfigs(config)
    config.method = 'PATCH'
    const apiCallerInstance = apiCallerInstances[config.instance]

    if (config.instance === 'default') {
      url = addTrailingAndLeadingSlashToUrl(url)
    }

    const requestBody = config.data
    delete config.data
    return apiCallerInstance(url, { body: requestBody, ...config })
  },
  delete(url, config = {}) {
    config = setDefaultConfigs(config)
    config.method = 'DELETE'
    const apiCallerInstance = apiCallerInstances[config.instance]

    if (config.instance === 'default') {
      url = addTrailingAndLeadingSlashToUrl(url)
    }

    const requestBody = config.data
    delete config.data
    return apiCallerInstance(url, { body: requestBody, ...config })
  },
})

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  const onResponse = ({ response }) => {
    if (response?.ok) {
      response._data = {
        data: response._data,
      }
    }
  }

  const onResponseError = ({ response }) => {
    if (response?._data) {
      response.data = response._data
      delete response._data
    }
  }

  const defaultInstance = $fetch.create({
    baseURL: runtimeConfig.public.BACKEND_BASE_URL,
    onRequest(request) {
      const token = cachedToken.value
      if (token) {
        request.options.headers.set('Authorization', token)
      }
    },
    onResponse,
    onResponseError,
  })

  const cmsInstance = $fetch.create({
    baseURL: runtimeConfig.public.CMS_BASE_URL,
    onRequest({ options }) {
      if (!import.meta.client) {
        options.headers = {
          ...options.headers,
          'Strapi-Response-Format': 'v4',
        }
      }
    },
    onResponse,
    onResponseError,
  })

  const apiInstances = {
    default: defaultInstance,
    cms: cmsInstance,
  }

  nuxtApp.provide('api', createApi(apiCaller(apiInstances), apiInstances))
})
