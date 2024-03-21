import fetch from 'node-fetch'
import { getIntrospectionQuery } from 'graphql'

// TODO: you can get a token by means of using settings --> api-tokens
const token = '';
const apiUrl = 'https://api.graphcdn.io/api'
const originUrl = 'https://trygql.formidable.dev/graphql/basic-pokedex'

// The app { config { input } } can be used to write the graphcdn.YAML file with help of libs like "@atomist/yaml-updater"
async function listOrganizations() {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'graphcdn-token': token,
    },
    body: JSON.stringify({
      query: /* GraphQL */ `
        query {
          user {
            organizations {
              id
              name
              slug
            }
          }
        }
      `,
    })
  })

  const result = await response.json()

  return result.data.user.organizations
}

async function pushAppConfig(orgId, schema) {
  const config = {
    name: 'node-write-test',
    originUrl,
    schema: originUrl,
    queryDepthLimit: 20,
    ignoreOriginCacheControl: true,
    enablePlayground: true,
    injectHeaders: true,
    headers: {
      'something-to-inject': '1',
    },
    keyFields: {
      types: {
        Pokemon: ['id', 'name']
      }
    },
    scopes: {
      AUTHENTICATED: 'header:Authorization',
    },
    rootTypeNames: { query: 'Query' },
    rules: [
      { description: 'Cache all queries', maxAge: 600, swr: 900, scope: 'AUTHENTICATED', types: ['Query'] },
    ],
    bypassCacheHeaders: [{ name: 'x-preview-token' }],
  }

  const result = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'graphcdn-token': token,
    },
    body: JSON.stringify({
      query: /* GraphQL */ `
        mutation (
          $input: Input!
          $appName: String!
          $schema: IntrospectionQuery
        ) {
          pushAppConfig(
            input: $input
            appName: $appName
            schema: $schema
            allowDeletion: true
          )
        }
      `,
      variables: {
        input: config,
        schema: schema,
        appName: config.name,
      }
    })
  })
}

async function createApp(orgId, schema) {
  const config = {
    name: 'node-write-test',
    originUrl,
    schema: originUrl,
    queryDepthLimit: 20,
    ignoreOriginCacheControl: true,
    enablePlayground: true,
    injectHeaders: true,
    headers: {
      'something-to-inject': '1',
    },
    keyFields: {
      types: {
        Pokemon: ['id', 'name']
      }
    },
    scopes: {
      AUTHENTICATED: 'header:Authorization',
    },
    rootTypeNames: { query: 'Query' },
    rules: [
      { description: 'Cache all queries', maxAge: 600, swr: 900, scope: 'AUTHENTICATED', types: ['Query'] },
    ],
    bypassCacheHeaders: [{ name: 'x-preview-token' }],
  }

  const result = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'graphcdn-token': token,
    },
    body: JSON.stringify({
      query: /* GraphQL */ `
        mutation (
          $input: Input!
          $schema: IntrospectionQuery
          $organizationId: String!
        ) {
          createAppCli(
            input: $input
            schema: $schema
            organizationId: $organizationId
          ) {
            id
            config {
              input
            }
          }
        }
      `,
      variables: {
        input: config,
        schema: schema,
        organizationId: orgId
      }
    })
  })

  return await result.json()
}

async function getServices(slug) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'graphcdn-token': token,
    },
    body: JSON.stringify({
      query: /* GraphQL */`
        query ($slug: String!) {
          organization(slug: $slug) {
            name
            apps {
              name
              updatedAt
              config {
                input
              }
            }
          }
        }
      `,
      variables: { slug }
    })
  })

  const result = await response.json()

  return result.data.organization.apps
}

async function main() {
  const introspectionQuery = getIntrospectionQuery()

  const introspectionResponse = await fetch(originUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: introspectionQuery,
    })
  })

  const { data: schema } = await introspectionResponse.json()

  const organizations = await listOrganizations();

  console.log(organizations)
  const result = await createApp(organizations[0].id, schema)
  console.log(result)
}

main()
