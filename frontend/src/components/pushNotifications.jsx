import React, { useState} from 'react';
import axios from 'axios';

const PushNotification = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const registerServiceWorker = async () => {
    //try {
    //  const registration = await navigator.serviceWorker.register('util/serviceWorker.js');
    //  console.log('Service Worker registered:', registration);
    //  return registration;
    //} catch (error) {
    //  console.error('Service Worker registration failed:', error);
    //  throw error;
    //}
  };

  const subscribeToPushNotifications = async () => {
    try {
      //const registration = await registerServiceWorker();
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission not granted for notifications');
      }

      const subscriptionOptions = {
        userVisibleOnly: true,
        applicationServerKey: 'BFhAC1c99i9-t5R4ppfL8Jdwsv1Dn7CUVtMr4UEil6Cyl7Jqg58jrx12FcI8t_GRefRJC7xKa6Hi5OtfnAeaM58'
        // You'll get this from the backend
      };

      const pushSubscription = await registration.pushManager.subscribe(subscriptionOptions);
      setSubscription(pushSubscription);
      
      // Send subscription to backend
      await axios.post('/api/push/subscribe', {
        subscription: pushSubscription
      });
      
      setIsSubscribed(true);
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Push Notifications</h2>
      <button
        onClick={subscribeToPushNotifications}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={isSubscribed}
      >
        {isSubscribed ? 'Already Subscribed' : 'Subscribe to Notifications'}
      </button>
    </div>
  );
};

export default PushNotification;
