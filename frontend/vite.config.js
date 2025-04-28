// trade-analyze-frontend/vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  // .env dosyasını yükle
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    plugins: [react()],
    define: {
      // tüm kodda import.meta.env.VITE_API_URL kullanılabilir
      'process.env': env
    }
  })
}
