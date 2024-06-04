import { FileInterceptor } from "@nestjs/platform-express";
import { multerStorage } from "../utils/multer.util";

export function FileUpload(fieldName: string , folderName: string = 'images'){
    return class UploadUtility extends FileInterceptor(fieldName , {
        storage : multerStorage(folderName)
    }){}
}