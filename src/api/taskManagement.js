/**
 * API for agentcore-task: task executions list, stats, retrieve, sync, config.
 * Base path: /v1/tasks/
 */
import api from './index'

export const taskManagementApi = {
  getExecutions(params = {}) {
    return api.get('/v1/tasks/executions/', { params })
  },

  getExecution(id) {
    return api.get(`/v1/tasks/executions/${id}/`)
  },

  syncExecution(id) {
    return api.post(`/v1/tasks/executions/${id}/sync/`)
  },

  getStats(params = {}) {
    return api.get('/v1/tasks/executions/stats/', { params })
  },

  getConfig() {
    return api.get('/v1/tasks/config/')
  },

  updateConfig(data) {
    return api.patch('/v1/tasks/config/', data)
  }
}
