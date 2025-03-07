import * as core from '@actions/core'
import Axios, {AxiosInstance} from 'axios'
import {Client} from '@elastic/elasticsearch'

export async function sendRequestToGithub(client: AxiosInstance, path: string) {
  try {
    const response = await client.get(path)
    core.debug(response.data)
    return response.data
  } catch (e) {
    if (e.response) {
      // Check if the status is 404
      if (e.response.status === 404) {
        // Check for rate limiting headers
        if (e.response.headers['x-ratelimit-remaining'] === '0') {
          throw new Error('Rate limit exceeded')
        } else {
          throw new Error('Resource not found')
        }
      } else {
        throw new Error(`Error: ${e.response.status} - ${e.response.statusText}`)
      }
    } else {
      throw new Error(`Cannot send request to Github : ${e.message}`)
    }
  }
}

export interface ElasticMessageFormat {
  conclusion: string
  metadata: {}
  name: string
  details: {}
  id: number
  steps: string
  logs: string
  status: string
}

export async function sendMessagesToElastic(
  client: Client,
  messages: ElasticMessageFormat,
  elasticIndex: string
): Promise<void> {
  try {
    core.debug(`Push to elasticIndex`)
    await client.index({body: messages, index: elasticIndex})
    core.debug(`Successfully pushed to elasticIndex`)
  } catch (e) {
    core.error(`Failed to send to Elastic: ${e}`)
    throw new Error(`Cannot send request to Elastic : ${e}`)
  }
}

export async function createAxiosGithubInstance(token: string): AxiosInstance {
  return Axios.create({
    baseURL: 'https://api.github.com',
    timeout: 10000,
    headers: {Authorization: `token ${token}`}
  })
}

export function createElasticInstance(
  elasticHost: string,
  elasticApiKeyId: string,
  elasticApiKey: string,
  elasticUser: string,
  elasticPassword: string,
  elasticCloudId: string,
  elasticCloudUser: string,
  elasticCloudPassword: string
): Client {
  return !elasticCloudId
    ? new Client({
        node: elasticHost,
        apiKey: {
          id: elasticApiKeyId,
          api_key: elasticApiKey
        }
      })
    : new Client({
        node: elasticHost,
        cloud: {id: elasticCloudId},
        auth: {
          username: elasticCloudUser,
          password: elasticCloudPassword
        }
      })
}
