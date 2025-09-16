import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import postcss from "postcss/lib/postcss";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    postcss({
      plugins: [autoprefixer],
      config: "./postcss.config.cjs",
    }),
  ],
  build: {
    sourcemap: true,
  },
  define: {
    "process.env": {},
  },
  resolve: {
    alias: {
      src: "/src",
    },
  },
  server: {
    host: "0.0.0.0",         // Cho phép kết nối từ bên ngoài nếu cần
    port: 5173,              // Đảm bảo trùng port bạn đang chạy
    hmr: {
      clientPort: 5173,      // Đảm bảo client kết nối đúng port, nhất là khi qua proxy/Docker
    },
    proxy: {
      '/api': {
        target: 'https://localhost:7235',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
