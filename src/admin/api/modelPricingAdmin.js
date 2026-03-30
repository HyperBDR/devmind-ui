import apiClient from '@/api/index'

function extractData(res) {
  const body = res?.data
  if (body && typeof body === 'object' && 'data' in body) return body.data
  return body ?? res
}

export const modelPricingAdminApi = {
  listPrimarySourceConfigs() {
    return apiClient
      .get('/v1/ai-pricehub/admin/primary-source-config/')
      .then(extractData)
  },

  createPrimarySourceConfig(body) {
    return apiClient
      .post('/v1/ai-pricehub/admin/primary-source-config/', body)
      .then(extractData)
  },

  updatePrimarySourceConfig(configId, body) {
    return apiClient
      .patch(`/v1/ai-pricehub/admin/primary-source-config/${configId}/`, body)
      .then(extractData)
  },

  triggerPlatformSync(platformSlug) {
    return apiClient
      .post('/v1/ai-pricehub/sync/', { platform_slug: platformSlug })
      .then(extractData)
  }
}
