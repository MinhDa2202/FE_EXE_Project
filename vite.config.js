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
        target: 'https://schand20250922153400.azurewebsites.net',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
