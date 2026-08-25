/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyBm14kz8jJzLR2QpDhlhVPuE8BWf9HJAwU',
  authDomain: 'zeno-73f28.firebaseapp.com',
  projectId: 'zeno-73f28',
})

const PASS_THROUGH_PATTERNS = [/_next\/static\//, /_next\/image\?/, /favicon\.ico$/, /service-worker\.js$/]

let authReady = new Promise(resolve => {
  const unsubscribe = firebase.auth().onAuthStateChanged(() => {
    resolve()
    unsubscribe()
  })
})

async function getFreshIdToken() {
  await authReady
  const user = firebase.auth().currentUser
  if (!user) return null
  try {
    return await user.getIdToken()
  } catch {
    return null
  }
}

self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
  const request = event.request
  const url = new URL(request.url)

  if (url.origin !== self.location.origin) return
  if (PASS_THROUGH_PATTERNS.some(pattern => pattern.test(url.pathname + url.search))) return

  event.respondWith(
    (async () => {
      const token = await getFreshIdToken()
      if (!token || request.headers.has('authorization')) return fetch(request)

      const headers = new Headers(request.headers)
      headers.set('Authorization', `Bearer ${token}`)

      return fetch(
        new Request(request, {
          headers,
          mode: request.mode === 'navigate' ? 'same-origin' : request.mode,
          credentials: request.mode === 'navigate' ? 'omit' : request.credentials,
          redirect: request.mode === 'navigate' ? 'manual' : request.redirect,
        }),
      )
    })(),
  )
})
