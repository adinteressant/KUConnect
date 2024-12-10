export default function generateOTP(){
  const random = Math.random()
  const OTP = Math.floor(random*9000) + 1000
  return OTP
}