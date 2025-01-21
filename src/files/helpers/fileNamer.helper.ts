// Esta funcion la usamos para renombrar el nombre de archivo
import { v4 as uuid} from 'uuid';

export const fileNamer = (( req: Express.Request, file:Express.Multer.File, callback: Function)=> {
    // callback es lo que retorna si se hacepta el archivo o no. en tru o false

    if (!file) return callback(new Error('File is empty'), false)       // Rechazamos el archivo 
    
    const fileExtension = file.mimetype.split('/')[1]
    const fileName = `${uuid()}.${fileExtension}`;

    callback(null,fileName)

})