import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Sunucuyu tüm ağ üzerinden erişilebilir yapmak için
    port: 10000, // Opsiyonel, istediğiniz portu belirleyebilirsiniz
    allowedHosts: ['trade-analyze-front.onrender.com'], // Belirli hostlardan gelen talepleri kabul et
  },
});
