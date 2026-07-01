// Service Worker — 展会离线扫码缓存
const CACHE = 'expo-scanner-v1';
const ASSETS = [
  '/index.html',
  '/html5-qrcode.min.js',
  '/manifest.json'
];

// 安装：立即缓存所有核心资源
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 拦截请求：缓存优先，缓存未命中才走网络
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
