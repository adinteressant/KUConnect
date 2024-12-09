import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "kuconnect2002@gmail.com",
    pass: "rtmydajroygnhbfk",
  },
})

export default async function sendMail(to,otp) {
  
  try{
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"KUConnect" <kuconnect2002@gmail.com>', //sender
      to,  //receiver
      subject:'Welcome to KUConnect', 
      text:'Below is the verification OTP',
      html:`<h2>${otp}</h2>`
    })
    console.log("Message sent: %s", info.messageId)
  }
  catch(e){
    console.log(e)
  }
  
}
