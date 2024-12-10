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
      subject:'Your OTP for Account Registration', 
      text:'',
      html:`Dear User,<br>
      Thank you for registering with KUConnect.<br>
      To complete your registration, please use the following One-Time Password (OTP):<br>
      <h4>${otp}</h4><br>
      This OTP is valid for 2 minutes. If you did not initiate this request, please disregard this email.<br><br>
      Best regards,<br>
      KUConnect Team`
    })
    console.log("Message sent: %s", info.messageId)
  }
  catch(e){
    console.log(e)
  }
  
}
