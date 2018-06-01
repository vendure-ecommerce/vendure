import * as jwt from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "./auth-types";
import { Role } from "./role";
import { PasswordService } from "./password.service";
import { Connection } from "typeorm";
import { InjectConnection } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user/user.entity";

export const JWT_SECRET = 'some_secret';

@Injectable()
export class AuthService {

    constructor(private passwordService: PasswordService,
                @InjectConnection() private connection: Connection) {}

    async createToken(identifier: string, password: string): Promise<string> {
        const user = await this.connection.getRepository(UserEntity)
            .findOne({
                where: {
                    identifier
                }
            });

        if (!user) {
            throw new UnauthorizedException();
        }

        const passwordMatches = await this.passwordService.check(password, user.passwordHash);

        if (!passwordMatches) {
            throw new UnauthorizedException();
        }
        const payload: JwtPayload = { identifier , roles: user.roles };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 });
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.connection.getRepository(UserEntity).findOne({
            where: {
                identifier: payload.identifier
            }
        });
    }
}
