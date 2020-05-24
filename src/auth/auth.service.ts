import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredential } from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {
    }
    async signUp(authCredential: AuthCredential): Promise<void> {
        return this.userRepository.signUp(authCredential);
    }

    async signIn(authCredential: AuthCredential): Promise<{accessToken: string}> {
        const username = await this.userRepository.validateUserPassword(authCredential);
        if (!username) {
            throw new UnauthorizedException('Invalid Credetial');
        }
        const payload: JwtPayload = { username };
        const accessToken = this.jwtService.sign(payload);

        return {accessToken};
    }
}
