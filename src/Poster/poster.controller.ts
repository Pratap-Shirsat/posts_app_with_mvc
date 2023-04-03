import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  Render,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HelperService } from 'src/Helper/helper.provider';
import { Poster } from './poster.entity';
import { PosterService } from './poster.service';

@Controller('poster')
export class PosterController {
  constructor(
    private readonly posterService: PosterService,
    private readonly helpers: HelperService,
  ) {}

  @Post('/')
  async createPoster(@Body() poster: Poster, @Req() req) {
    poster.createdByUser = req.user.userId;
    return await this.posterService.createPoster(poster);
  }

  @Post('/upload_poster/:postID')
  @UseInterceptors(
    FileInterceptor('posterImage', {
      storage: diskStorage({
        destination: process.env.POST_UPLOAD_PATH,
        filename(req, file, callback) {
          const uniqueSufix = randomUUID();
          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSufix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async UploadPosterImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: parseInt(process.env.MAX_FILE_SIZE),
          }),
          new FileTypeValidator({ fileType: 'image' }),
        ],
      }),
    )
    posterImage: Express.Multer.File,
    @Param('postID') postID: string,
  ) {
    const poster = await this.posterService.fetchPosterById(postID);
    if (poster?.postId && poster?.postImageLocation === null) {
      await this.posterService.updatePosterImageRef(
        poster.postId,
        posterImage.originalname,
        posterImage.filename,
      );
      return {
        message: 'Successfully uploaded the new poster image!',
      };
    }
    this.helpers.deleteUploadedImage(
      `${process.env.POST_UPLOAD_PATH}/${posterImage.filename}`,
    );

    return {
      message: 'Poster image already exists or poster doent exists at all!!!',
    };
  }

  @Get('/search/:postName')
  @Render('posterDashboard')
  async searchPosterByName(@Param('postName') postName: string) {
    const poster = await this.posterService.findPosterByName(postName);
    return { posts: poster };
  }

  @Get('/:postID/poster_image')
  async getPosterImage(@Param('postID') postID: string, @Res() res) {
    const poster = await this.posterService.fetchPosterById(postID);
    if (poster.postImageLocation !== null)
      res.sendFile(poster.postImageLocation, {
        root: process.env.POST_UPLOAD_PATH,
      });
    else res.sendFile('default_poster.jpg', { root: 'src/../public/default' });
  }

  @Get('/:postID')
  async getPosterById(@Param('postID') postID: string) {
    return await this.posterService.fetchPosterById(postID);
  }

  @Patch('/:postID/like')
  async likePoster(@Param('postID') postID: string) {
    return await this.posterService.likePoster(postID);
  }

  @Patch('/:postID/dislike')
  async dislikePoster(@Param('postID') postID: string) {
    return await this.posterService.unLikePoster(postID);
  }

  @Get('/')
  @Render('posterDashboard')
  async getAllposters() {
    const posts = await this.posterService.getAllPosters();
    return { posts };
  }
}
