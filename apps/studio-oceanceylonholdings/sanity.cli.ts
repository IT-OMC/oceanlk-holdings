import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'mpoj5gw7',
    dataset: 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  typegen: {
    path: '../frontend/src/**/*.{ts,tsx,js,jsx}',
    schema: 'schema.json',
    generates: '../frontend/src/sanity/types.ts',
    overloadClientMethods: true,
  },
})
