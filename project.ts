import {
  NearDatasourceKind,
  NearHandlerKind,
  NearProject,
} from '@subql/types-near'
import { PUBLIC_NEAR_RPC_ENDPOINTS } from './config'

import * as dotenv from 'dotenv'
import path from 'path'

// Load the appropriate .env file
const dotenvPath = path.resolve(__dirname, `.env`)
dotenv.config({ path: dotenvPath })

const project: NearProject = {
  specVersion: '1.0.0',
  name: 'sourcescan-subql',
  version: '0.0.1',
  runner: {
    node: {
      name: '@subql/node-near',
      version: '*',
    },
    query: {
      name: '@subql/query',
      version: '*',
    },
  },
  description: 'NEAR indexer for DeployContract actions',
  repository: 'https://github.com/SourceScan/sourcescan-subql',
  schema: {
    file: './schema.graphql',
  },
  network: {
    chainId: process.env.CHAIN_ID!,
    dictionary: 'https://api.subquery.network/sq/subquery/near-dictionary',
    endpoint: PUBLIC_NEAR_RPC_ENDPOINTS.concat(
      JSON.parse(process.env.PRIVATE_ENDPOINTS!)
    ),
    bypassBlocks: [81003306],
  },
  dataSources: [
    {
      kind: NearDatasourceKind.Runtime,
      startBlock: parseInt(process.env.START_BLOCK!),
      mapping: {
        file: './dist/index.js',
        handlers: [
          {
            handler: 'handleAction',
            kind: NearHandlerKind.Action,
            filter: {
              type: 'DeployContract',
            },
          },
        ],
      },
    },
  ],
}

export default project
