import bcrypt from 'bcrypt'

const saltRound = 10
export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRound)
  
  const hashedPassword = bcrypt.hashSync(password,salt)
  return hashedPassword
}

export const comparePassword = (plain,hashed) => {
  return bcrypt.compareSync(plain,hashed) //true or false
}