import { Module } from "@nestjs/common";
import { AppController } from "@app/app.controller";
import { AppService } from "@app/app.service";
import { TagModule } from "@app/tag/tag.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "@app/user/user.module";
import { ArticleModule } from "@app/article/article.module";
import ormconfig from "@app/ormconfig";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TagModule,
    UserModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
