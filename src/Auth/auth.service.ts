import { Injectable } from '@nestjs/common';
import { UserService } from 'src/User/user.provider';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(username: string, password: string) {
    const user = await this.userService.findUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { salt, password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      userId: user.userId,
      profileImage: user.profileImage,
      username: user.username,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
