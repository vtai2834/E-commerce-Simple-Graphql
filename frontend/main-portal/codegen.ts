import { CodegenConfig } from '@graphql-codegen/cli';
const config: CodegenConfig = {
  schema: '', // the URL to your GraphQL API
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: ['src/services/**/*.ts'],
  ignoreNoDocuments: true,
  overwrite: true,
  generates: {
    './src/generated-types/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;
