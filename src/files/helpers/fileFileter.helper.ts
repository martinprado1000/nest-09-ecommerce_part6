// Esta funcion la usamos para validar el archivo que va a ser subido.
// Esta funcion la vamos a llamar cuando suba el archivo y lo hace el UseInterceptors y este recibe todos esto parametro que le pasamos a la funcion.
// Pero solamente retorno si lo hacepta o no.

export const fileFilter = (( req: Express.Request, file:Express.Multer.File, callback: Function)=> {
    // callback es lo que retorna si se hacepta el archivo o no. en tru o false

    if (!file) return callback(new Error('File is empty'), false)       // Rechazamos el archivo 
    
    const fileExtension = file.mimetype.split('/')[1]
    const validExtension = ['jpg','jpeg','png','gif']  
                    // el mimetype trae el tipo de atchivo
    if (validExtension.includes( fileExtension )){
        callback(null,true)  // Acepto el archivo
    }
    
    callback(null,false)      // De esta forma rechazamos el archivo

})