import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { 
  User, 
  AuthTokens, 
  LoginCredentials, 
  SignupCredentials,
  AuthResponse 
} from '@forma/shared-types';

// Mock user database - replace with real database
const users: Map<string, User & { password: string }> = new Map();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = Array.from(users.values()).find(
      u => u.email === credentials.email
    );
    
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    // Create user
    const user: User & { password: string } = {
      id: `user_${Date.now()}`,
      email: credentials.email,
      name: credentials.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: hashedPassword,
    };

    users.set(user.id, user);

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Find user by email
    const user = Array.from(users.values()).find(
      u => u.email === credentials.email
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    const user = users.get(userId);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private async generateTokens(userId: string, email: string): Promise<AuthTokens> {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
