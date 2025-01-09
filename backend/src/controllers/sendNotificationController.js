import Subscription from "../models/subscription";
import { webpush } from "../webPush.js";  
export default 
async function sendNotificationController(req,res){
  try{
    const subscriptions = await Subscription.find();
    const notification = {
      title: 'New Notification',
      body: req.message.body,
      icon: './../../public/1.webp',
    };

    const promises = subscriptions.map(subscription =>{
      return webpush.sendNotification(subscription,JSON.stringify(notification)).catch(
      error =>{
        if (error.statusCode == 410 ){
          return Subscription.deleteOne({_id:subscription.id})
        }
        console.log("Error sending notification!",error);
      }
    )}
    )
    await Promise.all(promises);
    console.log("Notification sent successfully!");
  }
  catch (error) {
      res.status(500).json({ error: 'Error sending notifications' });
    }
}
