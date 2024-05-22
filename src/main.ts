import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerInitConfig } from './config/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as CookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  swaggerInitConfig(app);
  app.use(CookieParser(process.env.OTP_TOKEN_SECRET))
  const {PORT} = process.env;
  await app.listen(PORT , () => {
    console.log(`Server is running on http://localhost/${PORT}`);
  });
}
bootstrap();
