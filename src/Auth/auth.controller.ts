import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Render,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('user/login')
  @Render('userLogged')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const user = await this.authService.validate(username, password);
    if (user) {
      return await this.authService.login(user);
    }
    throw new UnauthorizedException();
  }
}
