import { mkdirSync } from "fs";
import { extname, join } from "path";
import { diskStorage } from "multer";
import { BadRequestException } from "@nestjs/common";
import { ValidationMessege } from "../enums/message.enum";
import { Request } from "express";
export type MulterFile = Express.Multer.File;
export type DestinationCallback = (error: Error, destination: string) => void
export type FileNameCallback = (error: Error, filename: string) => void

export function multerDestination(fieldname: string){
    return function (req: Request , file: Express.Multer.File, callback: DestinationCallback ) : void {
        let path = join("public" , "uploads" , fieldname)
        mkdirSync(path , {recursive : true})
        callback(null , path)
    }
}

export function multerFileName(req: Request , file: Express.Multer.File, callback: FileNameCallback ) : void {
    const ext = extname(file.originalname).toLowerCase()
    if(!imageFormatValidation(ext)){
        callback(new BadRequestException(ValidationMessege.InvalidImageFormat) , null)
    } else {
        const filename = `${Date.now()}${ext}`
        callback(null , filename)
    }
}

function imageFormatValidation(ext: string){
    return [".jpg" , ".png" , ".jpeg"].includes(ext)
}

export function multerStorage(folderName: string){
    return diskStorage({
        destination : multerDestination(folderName) ,
        filename : multerFileName ,
      })
}