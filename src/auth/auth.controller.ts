import { Controller, Get, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This route will redirect to Google OAuth
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const loginResult = await this.authService.login(req.user);

    // Option 1: Return JSON response
    return res.status(HttpStatus.OK).json(loginResult);

    // Option 2: Redirect to frontend with token
    // return res.redirect(
    //   `http://localhost:4200/auth/success?token=${loginResult.access_token}`,
    // );
  }
}
