// no seu arquivo vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ADICIONE (OU EDITE) ESTE BLOCO:
  resolve: {
    dedupe: [
      'react', 
      'react-dom'
    ]
  }
});