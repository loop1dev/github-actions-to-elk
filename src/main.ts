import * as core from '@actions/core'
import {
  ElasticMessageFormat,
  createAxiosGithubInstance,
  createElasticInstance,
  sendMessagesToElastic,
  sendRequestToGithub
} from './requests'
import {loadInput} from './tool'

function validateInput(input: string, inputName: string): void {
  if (!input) {
    throw new Error(`Missing required input: ${inputName}`)
  }
}

async function run(): Promise<void> {
  try {
    const githubToken: string = loadInput('githubToken')
    const githubOrg: string = loadInput('githubOrg')
    const githubRepository: string = loadInput('githubRepository')
    const githubRunId: string = loadInput('githubRunId')
    const elasticApiKeyId: string = loadInput('elasticApiKeyId')
    const elasticApiKey: string = loadInput('elasticApiKey')
    const elasticHost: string = loadInput('elasticHost')
    const elasticIndex: string = loadInput('elasticIndex')
    const elasticUser: string = loadInput('elasticUser')
    const elasticPassword: string = loadInput('elasticPassword')
    const elasticCloudId: string = loadInput('elasticCloudId')
    const elasticCloudUser: string = loadInput('elasticCloudUser')
    const elasticCloudPassword: string = loadInput('elasticCloudPassword')

    validateInput(githubToken, 'githubToken')
    validateInput(githubOrg, 'githubOrg')
    validateInput(githubRepository, 'githubRepository')
    validateInput(githubRunId, 'githubRunId')
    validateInput(elasticApiKeyId, 'elasticApiKeyId')
    validateInput(elasticApiKey, 'elasticApiKey')
    validateInput(elasticHost, 'elasticHost')

    core.info(`Initializing Github Connection Instance`)
    const githubInstance = await createAxiosGithubInstance(githubToken)
    core.info(`Initializing Elastic Instance`)
    const elasticInstance = createElasticInstance(
      elasticHost,
      elasticApiKeyId,
      elasticApiKey,
      elasticUser,
      elasticPassword,
      elasticCloudId,
      elasticCloudUser,
      elasticCloudPassword
    )

    const metadataUrl = `/repos/${githubOrg}/${githubRepository}/actions/runs/${githubRunId}`
    core.info(`Retrieving metadata from Github Pipeline ${githubRunId}`)
    const metadata = await sendRequestToGithub(githubInstance, metadataUrl)
    const jobsUrl = metadata.jobs_url
    core.info(`Retrieving jobs list from Github Pipeline ${githubRunId}`)
    const jobs = await sendRequestToGithub(githubInstance, jobsUrl)
    for (const job of jobs.jobs) {
      core.info(`Parsing Job... '${job.name}'`)
      if (/elastic/.test(job.name)) {
        core.info('Skipping this job')
        continue;
      }
      const achievedJob: ElasticMessageFormat = {
        id: job.id,
        name: job.name,
        metadata,
        status: job.status,
        conclusion: job.conclusion,
        steps: job.steps,
        details: job,
        logs: await sendRequestToGithub(
          githubInstance,
          `/repos/${githubOrg}/${githubRepository}/actions/jobs/${job.id}/logs`
        )
      }
      core.info(`Getting job '${achievedJob.name}'`)
      await sendMessagesToElastic(elasticInstance, achievedJob, elasticIndex)
    }
  } catch (e) {
    if (e instanceof Error) {
      core.setFailed(e.message)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-prom
run()
