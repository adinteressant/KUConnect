// src/serviceWorkerRegistration.js
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY')
      });

      return subscription;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }
  throw new Error('Push notifications not supported');
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
