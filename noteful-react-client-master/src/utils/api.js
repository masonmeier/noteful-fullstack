import config from '../config'

export function createApiUrl (path) {
  return `${config.API_ENDPOINT}${path}?${config.POSTGRES_KEY}`
}
