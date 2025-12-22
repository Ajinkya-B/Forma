import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCredentials, SignupCredentials, AuthResponse } from '@forma/shared-types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() credentials: SignupCredentials): Promise<AuthResponse> {
    return this.authService.signup(credentials);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() credentials: LoginCredentials): Promise<AuthResponse> {
    return this.authService.login(credentials);
  }
}
