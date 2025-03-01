import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.SENDMAIL_PASSWORD}`,
  },
})

export default async function sendMail(to,otp) {
  
  try{
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"KUConnect" <${process.env.EMAIL}>`, //sender
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

export const sendMailPasswordChange = async (to,otp) => {
 try{
    const info = await transporter.sendMail({
      from: `"KUConnect" <${process.env.EMAIL}>`, //sender
      to,  //receiver
      subject:'Reset Your Password', 
      text:'',
      html: `Dear User,<br>
      We received a request to reset your password for your KUConnect account.<br>
      To proceed with resetting your password, please use the following One-Time Password (OTP):<br>
      <h4>${otp}</h4><br>
      If you did not request a password reset, please ignore this email.<br><br>
      Best regards,<br>
      KUConnect Team`   
    })
    console.log("Message sent: %s", info.messageId)
  }
  catch(e){
    console.log(e)
  }

}
