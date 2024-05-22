import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function TypeOrmConfig(): TypeOrmModuleOptions{
    const {DB_HOST , DB_NAME , DB_USERNAME , DB_PASSWORD ,DB_PORT } = process.env;

    return {
        type: "postgres" ,
        port : +DB_PORT ,
        host : DB_HOST ,
        username : DB_USERNAME ,
        password : DB_PASSWORD ,
        database : DB_NAME ,
        autoLoadEntities: false,
        synchronize: true ,
        entities : [
            "dist/**/**/**/*.entity{.ts,.js}",
            "dist/**/**/*.entity{.ts,.js}"
        ]
    }
}