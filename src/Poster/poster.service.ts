import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Poster } from './poster.entity';

@Injectable()
export class PosterService {
  constructor(
    @InjectRepository(Poster) private readonly posterModel: Repository<Poster>,
  ) {}

  async fetchPosterById(postId: string): Promise<Poster> {
    return await this.posterModel.findOne({ where: { postId } });
  }

  async createPoster(poster: Poster): Promise<Poster> {
    return await this.posterModel.save(poster);
  }

  async updatePosterImageRef(
    postId: string,
    posterImageName: string,
    posterImageRef: string,
  ): Promise<any> {
    return await this.posterModel.update(
      { postId },
      {
        postImageLocation: posterImageRef,
        postImageOriginalName: posterImageName,
      },
    );
  }

  async likePoster(postId: string): Promise<any> {
    return await this.posterModel.increment({ postId }, 'likes', 1);
  }

  async unLikePoster(postId: string): Promise<any> {
    return await this.posterModel.decrement({ postId }, 'likes', 1);
  }

  async getAllPosters(): Promise<Poster[]> {
    return await this.posterModel.find();
  }

  async findPosterByName(postName: string): Promise<Poster[]> {
    return await this.posterModel.find({
      where: { postName: ILike(`%${postName}%`) },
    });
  }
}
