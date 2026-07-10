/* Gist service worker — 淨做 Web Push（唔 cache 嘢，版本更新交返俾 UpdateToast） */

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

self.addEventListener('push', (e) => {
  let data = {}
  try { data = e.data ? e.data.json() : {} } catch { /* 非 JSON payload 就用預設 */ }
  const title = data.title || 'Gist'
  e.waitUntil(self.registration.showNotification(title, {
    body: data.body || '',
    icon: '/gist-web/icons/icon-192.png',
    badge: '/gist-web/icons/icon-192.png',
    data: { url: data.url || '/gist-web/' },
  }))
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const url = (e.notification.data && e.notification.data.url) || '/gist-web/'
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if ('focus' in w) { w.navigate(url); return w.focus() }
      }
      return self.clients.openWindow(url)
    }),
  )
})
