export const API_VERSION = 'v1'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-ag7er5qhga-ew.a.run.app'
export const API_URL = `${baseUrl}/${API_VERSION}`