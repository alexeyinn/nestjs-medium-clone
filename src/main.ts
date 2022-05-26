if (!process.env.IS_TS_NODE) {
  require("module-alias/register");
}

import { NestFactory } from "@nestjs/core";
import { AppModule } from "@app/app.module";
// 4-33
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
