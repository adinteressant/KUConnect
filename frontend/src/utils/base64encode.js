export default function base64encode(files){
    return Promise.all(files.map((file)=>{
      return new Promise(function(resolve,reject){
        const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = () => {
        reject(error)
      }
    })
    })) 
}
