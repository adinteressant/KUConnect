self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: './../public/images/light.svg',
    badge: './../public/images/light.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    clients.openWindow('/details');
  }
});
