import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {StudioLogo} from './components/StudioLogo'
import {theme} from './theme'
import {openOnSiteAction} from './actions/openOnSite'

export default defineConfig({
  name: 'default',
  title: 'Ocean Ceylon Holdings',

  projectId: 'mpoj5gw7',
  dataset: 'production',

  icon: StudioLogo,
  theme,

  plugins: [
    structureTool({
      structure,
    }),
    visionTool({
      defaultApiVersion: '2024-01-01',
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) =>
      context.schemaType === 'post' ? [...prev, openOnSiteAction] : prev,
  },
})
