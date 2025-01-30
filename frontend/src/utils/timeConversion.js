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

export function getMonthAndDate(stringTime){
  const time = new Date(stringTime)

  const offsetMinutes = 5 * 60 + 45
  const nepaliTime = new Date(time.getTime() + offsetMinutes * 60 * 1000)

  const month = nepaliTime.getUTCMonth() + 1
  let mm
  switch(month){
    case 1:
      mm = 'JAN'
      break
    case 2:
      mm = 'FEB'
      break
    case 3:
      mm = 'MAR'
      break
    case 4:
      mm = 'APR'
      break
    case 5:
      mm = 'MAY'
      break
    case 6:
      mm = 'JUN'
      break
    case 7:
      mm = 'JUL'
      break
    case 8:
      mm = 'AUG'
      break
    case 9:
      mm = 'SEP'
      break
    case 10:
      mm = 'OCT'
      break
    case 11:
      mm = 'NOV'
      break
    case 12:
      mm = 'DEC'
      break
    default:
      mm = ''
      break
  }

  const date = nepaliTime.getUTCDate()
  const dd = date.toString().length < 2 ? `0${date}` : date

  const {MM,DD} = todaysDate()
  if(month==MM && dd==DD){
    return {mm:'TODAY',dd:''}
  }

  return {mm,dd}
  
}

function todaysDate(){
  const today = new Date()
  const MM = today.getMonth()+1
  const DD= today.getDate()
  
  return {MM,DD}
}