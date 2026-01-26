import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 1. Register a new user
  async register(createUserDto: CreateUserDto) {
    // Hash the password before saving!
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = {
      ...createUserDto,
      password: hashedPassword,
    };

    return this.usersService.create(newUser);
  }

  // 2. Validate user (check if password matches)
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result; // Return user without password
    }
    return null;
  }

  // 3. Login (Generate JWT)
  async login(user: any) {
    // The brief says we need roles in the token [cite: 23]
    const payload = { email: user.email, sub: user.id, role: user.role }; 
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}