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