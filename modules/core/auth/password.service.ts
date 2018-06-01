import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

@Injectable()
export class PasswordService {

    hash(plaintext: string): Promise<string> {
        return bcrypt.hash(plaintext, SALT_ROUNDS);
    }

    check(plaintext: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plaintext, hash);
    }
}
