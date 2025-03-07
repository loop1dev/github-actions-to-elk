import * as core from '@actions/core'
import Axios, {AxiosInstance} from 'axios'
import {Client} from '@elastic/elasticsearch'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function sendRequestToGithub(client: AxiosInstance, path: string) {
  try {
    const response = await client.get(path)
    core.debug(response.data)
    return response.data
  } catch (e) {
    throw new Error(`Cannot send request to Github : ${e}`)
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
    timeout: 3000,
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
