import { Module } from "@nestjs/common";
import { ArticleService } from "@app/article/article.service";
import { ArticleController } from "@app/article/article.controller";
import { ArticleEntity } from "@app/article/article.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";
import { FollowEntity } from "@app/profile/follow.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity]),
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
