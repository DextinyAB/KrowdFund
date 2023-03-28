import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@perawallet/connect'],
  },
  build: {
    target: "es2020"
  },
  define: {
    // "process": {
    //   "env":{},
    //   "browser":true,
    // },
  },
});
