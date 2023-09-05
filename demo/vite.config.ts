import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import Path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: Path.resolve(__dirname, "./node_modules/react")
    }
  }
})
