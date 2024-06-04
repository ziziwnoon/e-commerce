import { ParseFilePipe, UploadedFiles } from "@nestjs/common";

export function UploadOptionalFile(){
    return UploadedFiles(new ParseFilePipe({
        fileIsRequired : false ,
        validators : []
        }))
}