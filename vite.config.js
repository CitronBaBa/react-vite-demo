import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from "vite-plugin-singlefile";

// vite single file builds the whole thing as a html
export default defineConfig({
  plugins: [react(), viteSingleFile()],
   build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
