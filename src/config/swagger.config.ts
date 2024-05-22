import { INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface"

export function swaggerInitConfig(app: INestApplication) : void {
    const document = new DocumentBuilder()
    .setTitle("Virgool")
    .setDescription("Backend of An e-commerce Website")
    .setVersion("V0.0.1")
    .addBearerAuth(SwaggerAuthConfig() , "Authorization")
    .build()

    const swaggerDocument = SwaggerModule.createDocument(app , document)

    SwaggerModule.setup("/swagger" , app , swaggerDocument)
}

function SwaggerAuthConfig(): SecuritySchemeObject{
    return {
        type: "http" ,
        bearerFormat: "JWT" ,
        in: "header",
        scheme: "bearer"
    }
}