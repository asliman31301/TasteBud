/* eslint-disable */
import { register } from 'register-service-worker'

register('/service-worker.js', {
    registrationOptions: { scope: './' },
    ready(registration) {
        console.log('Service worker is active.')
    },
    registered(registration) {
        console.log('Service worker has been registered.')
        setInterval(() => {
            registration.update();
        }, 5000); //1000 * 60 * 60); // e.g. hourly checks
    },
    cached(registration) {
        console.log('Content has been cached for offline use.')
    },
    updatefound(registration) {
        console.log('New content is downloading.')
    },
    updated(registration) {
        console.log('New content is available; please refresh.')
        document.dispatchEvent(
            new CustomEvent('swUpdated', { detail: registration })
        )
    },
    offline() {
        console.log('No internet connection found. App is running in offline mode.')
        document.dispatchEvent(
            new CustomEvent('swOffline')
        )
    },
    online() {
        document.dispatchEvent(
            new CustomEvent('swOnline')
        )
    },
    error(error) {
        console.error('Error during service worker registration:', error)
    }
})