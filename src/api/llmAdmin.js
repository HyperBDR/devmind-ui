/**
 * LLM admin API (agentcore-metering: token-stats, llm-usage, llm-config).
 * Global config: list (GET), add (POST), get/put/delete by id (GET/PUT/DELETE llm-config/<pk>/).
 * Providers schema: GET llm-config/providers/. Test: POST llm-config/test/.
 */
import apiClient from './index'

function extractData(res) {
  const body = res?.data
  if (body && typeof body === 'object' && 'data' in body) return body.data
  return body ?? res
}

export const llmAdminApi = {
  getTokenStats(params = {}) {
    return apiClient.get('/v1/admin/token-stats/', { params }).then(extractData)
  },
  getLLMUsage(params = {}) {
    return apiClient.get('/v1/admin/llm-usage/', { params }).then(extractData)
  },

  /** GET global LLM config list (array). */
  getLLMConfig() {
    return apiClient.get('/v1/admin/llm-config/').then(extractData)
  },
  /** GET all LLM configs (global + user). Params: scope=all|global|user, user_id (optional). */
  getLLMConfigAll(params = {}) {
    return apiClient.get('/v1/admin/llm-config/all/', { params }).then(extractData)
  },
  /** POST add config. Body: { provider, config?, is_active?, order?, scope?, user_id? }. */
  postLLMConfig(body) {
    return apiClient.post('/v1/admin/llm-config/', body).then(extractData)
  },
  getLLMConfigDetail(configUuid) {
    return apiClient.get(`/v1/admin/llm-config/${encodeURIComponent(configUuid)}/`).then(extractData)
  },
  putLLMConfigDetail(configUuid, body) {
    return apiClient.put(`/v1/admin/llm-config/${encodeURIComponent(configUuid)}/`, body).then(extractData)
  },
  deleteLLMConfigDetail(configUuid) {
    return apiClient.delete(`/v1/admin/llm-config/${encodeURIComponent(configUuid)}/`)
  },

  /** GET provider schema for dynamic forms. Returns { providers: { [name]: { required, optional, editable_params, default_model, default_api_base } } }. */
  getLLMConfigProviders() {
    return apiClient.get('/v1/admin/llm-config/providers/').then(extractData)
  },
  /** GET provider list and per-provider models with capability tags. Returns { providers: [ { id, label, models: [ { id, label, capabilities, max_input_tokens, max_output_tokens } ] } ], capability_labels }. */
  getLLMConfigModels() {
    return apiClient.get('/v1/admin/llm-config/models/').then(extractData)
  },
  /** POST test config without saving. Body: { provider, config }. Returns { ok: boolean, detail?: string }. */
  postLLMConfigTest(body) {
    return apiClient.post('/v1/admin/llm-config/test/', body).then(extractData)
  },
  /**
   * POST run test call with a saved config. Body: { config_uuid, prompt, max_tokens? }.
   * Sync call; records to LLM usage. Returns { ok, content?, detail?, usage? }.
   */
  postLLMConfigTestCall(body) {
    return apiClient.post('/v1/admin/llm-config/test-call/', body).then(extractData)
  },

  getLLMConfigUsers(params = {}) {
    return apiClient.get('/v1/admin/llm-config/users/', { params }).then(extractData)
  },
  getLLMConfigUser(userId) {
    return apiClient.get(`/v1/admin/llm-config/users/${encodeURIComponent(userId)}/`).then(extractData)
  },
  putLLMConfigUser(userId, body) {
    return apiClient.put(`/v1/admin/llm-config/users/${encodeURIComponent(userId)}/`, body).then(extractData)
  },
  deleteLLMConfigUser(userId) {
    return apiClient.delete(`/v1/admin/llm-config/users/${encodeURIComponent(userId)}/`)
  },
  getUsers(params = {}) {
    return apiClient.get('/v1/admin/users/', { params }).then(extractData)
  }
}
