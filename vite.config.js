import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Known page routes (directory-index pages). Anything else that is an HTML
// navigation is treated as "not found" and served the styled 404 page — in
// dev and preview, matching how static hosts serve /404.html in production.
const KNOWN_ROUTES = new Set([
  '/', '/services/', '/portfolio/', '/project/', '/about/', '/contact/', '/admin/',
]);

function isKnownHtmlRequest(url) {
  const path = url.split('?')[0];
  if (KNOWN_ROUTES.has(path)) return true;
  // allow the same routes without a trailing slash, and any real file request
  if (KNOWN_ROUTES.has(path + '/')) return true;
  if (path.endsWith('/index.html') || path === '/404.html') return true;
  // requests for real assets (have a non-html extension) are not "pages"
  if (/\.[a-zA-Z0-9]+$/.test(path) && !path.endsWith('.html')) return true;
  return false;
}

function notFoundFallback() {
  const send404 = (html, res) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);
  };
  return {
    name: 'not-found-fallback',
    // DEV: run after Vite's own middlewares so only unmatched requests arrive.
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          const accept = req.headers.accept || '';
          if (req.method !== 'GET' || !accept.includes('text/html')) return next();
          if (isKnownHtmlRequest(req.url)) return next();
          try {
            let html = fs.readFileSync(resolve(__dirname, '404.html'), 'utf-8');
            html = await server.transformIndexHtml(req.url, html);
            send404(html, res);
          } catch (e) { next(e); }
        });
      };
    },
    // PREVIEW: serve the built dist/404.html for unmatched navigations.
    configurePreviewServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          const accept = req.headers.accept || '';
          if (req.method !== 'GET' || !accept.includes('text/html')) return next();
          if (isKnownHtmlRequest(req.url)) return next();
          try {
            const html = fs.readFileSync(resolve(__dirname, 'dist/404.html'), 'utf-8');
            send404(html, res);
          } catch (e) { next(e); }
        });
      };
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [notFoundFallback()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services/index.html'),
        portfolio: resolve(__dirname, 'portfolio/index.html'),
        project: resolve(__dirname, 'project/index.html'),
        about: resolve(__dirname, 'about/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
});
