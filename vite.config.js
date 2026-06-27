import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 🔑 When frontend requests start with /api, redirect them to the backend server URL
      "/api": {
        target: "http://localhost:5000", // 👈 Change this to match your Express server's port
        changeOrigin: true, // 👈 Crucial for bypassing CORS limitations
        secure: false, // 👈 Set to false if your backend does not use local HTTPS/SSL
        // Optional: rewrite url matching if your backend doesn't expect the "/api" route prefix
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});
