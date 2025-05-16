import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateOAuthUser(profile: any): Promise<any> {
    const { id, emails, name, photos } = profile;
    const email = emails[0].value;

    // Check if user exists
    let user = await this.usersService.findOneByEmail(email);

    if (!user) {
      // Create new user if doesn't exist
      user = await this.usersService.createUser({
        email,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
        googleId: id,
      });
    } else if (!user.googleId) {
      // Update user with Google ID if they exist but don't have a Google ID
      user = await this.usersService.updateUser(user.id, { googleId: id });
    }

    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
      },
    };
  }
}
