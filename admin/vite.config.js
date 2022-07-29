import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'
import vue from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), EnvironmentPlugin(['VUE_APP_GRAPHQL_HTTP']),],
  build: {
    outDir: '../public/admin',
    publicPath: '/admin',
  }
})
