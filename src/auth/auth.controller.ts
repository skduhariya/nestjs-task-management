import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthCredential } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('signup')
    signUp(@Body(ValidationPipe) authCredential: AuthCredential): Promise<void> {
        return this.authService.signUp(authCredential);
    }

    @Post('signin')
    signIn(@Body(ValidationPipe) authCredential: AuthCredential): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredential);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User) {
        console.log('user: ', user);

    }
}
