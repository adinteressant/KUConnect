import webpush from 'web-push'; 

const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  'mailto:happy.irhs@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);
console.log(vapidKeys.publicKey);
export  {webpush,vapidKeys};
