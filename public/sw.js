// Service Worker para PWA - Fittar
const CACHE_NAME = 'fittar-v1.0.0'
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/onboarding',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
]

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto:', CACHE_NAME)
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .catch((error) => {
        console.error('Erro ao cachear recursos:', error)
      })
  )
  self.skipWaiting()
})

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Interceptar requisições (Cache First Strategy)
self.addEventListener('fetch', (event) => {
  // Apenas para requisições GET
  if (event.request.method !== 'GET') {
    return
  }

  // Estratégia Cache First para recursos estáticos
  if (event.request.url.includes('/static/') || 
      event.request.url.includes('/icon-') ||
      event.request.url.includes('/_next/static/')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
        })
    )
    return
  }

  // Estratégia Network First para páginas e API
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta é válida, cache ela
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone)
            })
        }
        return response
      })
      .catch(() => {
        // Se falhar, tenta buscar no cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response
            }
            // Fallback para página offline
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/')
            }
          })
      })
  )
})

// Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Sincronização em background executada')
    event.waitUntil(
      // Aqui você pode sincronizar dados offline
      Promise.resolve()
    )
  }
})

// Notificações push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do Fittar!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Abrir App',
        icon: '/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icon-96x96.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Fittar', options)
  )
})

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})