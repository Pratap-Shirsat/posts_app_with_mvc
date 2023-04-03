import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipAuth } from './Auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SkipAuth()
  @Get()
  @Render('index')
  getHello(): object {
    return {
      message: this.appService.getHello(),
      title: 'Poster Application',
    };
  }
}
