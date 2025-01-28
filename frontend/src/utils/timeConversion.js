export function getHours(stringTime){
  const time = new Date(stringTime)

  const offsetMinutes = 5 * 60 + 45
  const nepaliTime = new Date(time.getTime() + offsetMinutes * 60 * 1000)

  return nepaliTime.getUTCHours().toString().length<2?`0${nepaliTime.getUTCHours()}`:nepaliTime.getUTCHours()
}

export function getMinutes(stringTime){
  const time = new Date(stringTime)

  const offsetMinutes = 5 * 60 + 45
  const nepaliTime = new Date(time.getTime() + offsetMinutes * 60 * 1000)

  return nepaliTime.getUTCMinutes().toString().length<2?`0${nepaliTime.getUTCMinutes()}`:nepaliTime.getUTCMinutes()
}

export function getMonth(stringTime){
  const time = new Date(stringTime)

  const offsetMinutes = 5 * 60 + 45
  const nepaliTime = new Date(time.getTime() + offsetMinutes * 60 * 1000)

  const month = nepaliTime.getUTCMonth() + 1
  let monthString
  switch(month){
    case 1:
      monthString = 'JAN'
      break
    case 2:
      monthString = 'FEB'
      break
    case 3:
      monthString = 'MAR'
      break
    case 4:
      monthString = 'APR'
      break
    case 5:
      monthString = 'MAY'
      break
    case 6:
      monthString = 'JUN'
      break
    case 7:
      monthString = 'JUL'
      break
    case 8:
      monthString = 'AUG'
      break
    case 9:
      monthString = 'SEP'
      break
    case 10:
      monthString = 'OCT'
      break
    case 11:
      monthString = 'NOV'
      break
    case 12:
      monthString = 'DEC'
      break
    default:
      monthString = ''
      break
  }
  return monthString
  
}

export function getDate(stringTime){
  const time = new Date(stringTime)

  const offsetMinutes = 5 * 60 + 45
  const nepaliTime = new Date(time.getTime() + offsetMinutes * 60 * 1000)

  const date = nepaliTime.getUTCDate()
  const dd = date.toString().length < 2 ? `0${date}` : date
  return dd
}