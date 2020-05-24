import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthCredential } from './dto/auth-credential.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async signUp(authCredential: AuthCredential): Promise<void> {
        const { username, password } = authCredential;
        
        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hasPassword(password, user.salt);

        // console.log('user.password: ', user.password);

        try {
            await user.save();
        } catch (error) {
            // console.log('error: ', error);

            if (error.code === '23505') {
                throw new ConflictException('User alreaady exists');
            } else {
                throw new InternalServerErrorException();
            }
        }

    }

    private async hasPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    async validateUserPassword(authCredentialDto: AuthCredential):Promise<string>{
        const {username, password} = authCredentialDto; 
        const user = await this.findOne({username});
        if(user && await user.validatePassword(password)){
            return user.username;
        }else{
            return null;
        }
        return null;
    }
}