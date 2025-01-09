import Subscription from "../models/subscription";

export default async function webPushSubscriptionController(req,res){
  try{
    const subscription = new Subscription(req.body.subscription);
    await subscription.save();
    res.status(201).json({message:"Successfully subscribed to push notifications!"});
  }catch(error){
    res.status(500).json({error: 'Error saving subscription!'});
  }
}
