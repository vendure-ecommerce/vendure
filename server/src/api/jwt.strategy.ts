import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '../config/config.service';
import { AuthService } from '../service/auth.service';

import { JwtPayload } from '../common/types/auth-types';

/**
 * Currently unused - see note at {@link AuthGuard}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService, private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.jwtSecret,
        });
    }

    async validate(payload: JwtPayload, done: (err: Error | null, user: any) => void) {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            return done(new UnauthorizedException(), false);
        }
        done(null, user);
    }
}
