import { UserEntity } from "@app/user/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArticleEntity } from "@app/article/article.entity";
import { CreateArticleDto } from "@app/article/dto/createArticle.dto";
import { ArticleResponseInterface } from "@app/article/types/articleResponse.interface";
import slugify from "slugify";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>
  ) {}

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.getSlug(createArticleDto.title);

    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    const article = this.articleRepository.findOne({ slug });
    return article;
  }

  private getSlug(slug: string): string {
    return (
      slugify(slug, { lower: true }) +
      "-" +
      ((Math.random() * Math.pow(36, 6)) | 0).toString()
    );
  }
}
