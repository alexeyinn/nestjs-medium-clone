import { UserEntity } from "@app/user/user.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, getRepository, Repository } from "typeorm";
import { ArticleEntity } from "@app/article/article.entity";
import { CreateArticleDto } from "@app/article/dto/createArticle.dto";
import { ArticleResponseInterface } from "@app/article/types/articleResponse.interface";
import slugify from "slugify";
import { ArticlesResponseInterface } from "@app/article/types/articlesResponse.interface";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findAll(
    currentUserId: number,
    query: any
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder("articles")
      .leftJoinAndSelect("articles.author", "author");

    queryBuilder.orderBy("articles.createdAt", "DESC");

    const articlesCount = await queryBuilder.getCount();

    if (query.tag) {
      queryBuilder.andWhere("articles.tagList LIKE :tag", {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        userName: query.author,
      });
      queryBuilder.andWhere("articles.authorId = :id", {
        id: author.id,
      });
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

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

  async addArticleToFavorites(
    slug: string,
    currentUserId: number
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ["favorites"],
    });
    const isNotFavorites =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id
      ) === -1;

    if (isNotFavorites) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    const article = this.articleRepository.findOne({ slug });
    return article;
  }

  async updateArticle(
    slug: string,
    updateArticleDto: CreateArticleDto,
    currentUserId: number
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException("Article does not exist!", HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException("Article does not exist!", HttpStatus.FORBIDDEN);
    }

    Object.assign(article, updateArticleDto);

    return await this.articleRepository.save(article);
  }

  async deleteArticle(
    slug: string,
    currentUserId: number
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException("Article does not exist!", HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException("Article does not exist!", HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete({ slug });
  }

  private getSlug(slug: string): string {
    return (
      slugify(slug, { lower: true }) +
      "-" +
      ((Math.random() * Math.pow(36, 6)) | 0).toString()
    );
  }
}
