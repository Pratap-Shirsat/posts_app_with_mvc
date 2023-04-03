import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  Render,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.provider';
import * as bcrypt from 'bcrypt';
import { SkipAuth } from 'src/Auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  Redirect,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common/pipes';
import { HelperService } from 'src/Helper/helper.provider';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly helpers: HelperService,
  ) {}

  @Render('partials/userProfile')
  @Get('/')
  async findUser(@Request() req) {
    const result = await this.userService.getUserById(req.user.userId);
    const { password, salt, ...user } = result;
    return user;
  }

  @SkipAuth()
  @Post('/')
  @Redirect('/')
  async registerUser(@Body() user: User) {
    const salt = await bcrypt.genSalt();
    user.salt = salt;
    user.password = await bcrypt.hash(user.password, salt);
    const result = await this.userService.createUser(user);
    return result;
  }

  @Patch('/')
  async updateUserProfile(@Body() user: User, @Request() req) {
    const result = await this.userService.updateUserDetails(
      req.user.userId,
      user,
    );
    return result;
  }

  @Post('/reset-password')
  async resetPassword(@Request() req, @Body('password') newPassword: string) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(newPassword, salt);
    const result = await this.userService.updateUserPassword(
      req.user.userId,
      hashPassword,
      salt,
    );
    return result;
  }

  @Post('/upload-avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: process.env.AVATAR_UPLOAD_PATH,
        filename(req, file, callback) {
          const uniqueSufix = randomUUID();
          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSufix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadUserProfileAvatar(
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
    avatarImage: Express.Multer.File,
    @Request() req,
  ) {
    const user = await this.userService.getUserById(req.user.userId);
    const result = await this.userService.updateProfileImageDetails(
      user.userId,
      avatarImage.filename,
    );

    if (result.affected !== 0) {
      this.helpers.deleteUploadedImage(
        `${process.env.AVATAR_UPLOAD_PATH}/${user.profileImage}`,
      );

      return {
        message: 'Successfully uploaded the new avatar!',
      };
    }
    return {
      message:
        'There was some issue while uploading your profile image. Please try again after some time',
    };
  }

  @Get('/avatar')
  async getUserAvatar(@Request() req, @Res() res) {
    const user = await this.userService.getUserById(req.user.userId);
    if (user.profileImage !== null)
      res.sendFile(user.profileImage, { root: process.env.AVATAR_UPLOAD_PATH });
    else res.sendFile('default-avatar.jpg', { root: 'src/../public/default' });
  }
}
