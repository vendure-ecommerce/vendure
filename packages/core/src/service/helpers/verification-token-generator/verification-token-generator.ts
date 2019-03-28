import { Injectable } from '@nestjs/common';
import ms from 'ms';

import { generatePublicId } from '../../../common/generate-public-id';
import { ConfigService } from '../../../config/config.service';

/**
 * This class is responsible for generating and verifying the tokens issued when new accounts are registered
 * or when a password reset is requested.
 */
@Injectable()
export class VerificationTokenGenerator {
    constructor(private configService: ConfigService) {}

    /**
     * Generates a verification token which encodes the time of generation and concatenates it with a
     * random id.
     */
    generateVerificationToken() {
        const now = new Date();
        const base64Now = Buffer.from(now.toJSON()).toString('base64');
        const id = generatePublicId();
        return `${base64Now}_${id}`;
    }

    /**
     * Checks the age of the verification token to see if it falls within the token duration
     * as specified in the VendureConfig.
     */
    verifyVerificationToken(token: string): boolean {
        const duration = ms(this.configService.authOptions.verificationTokenDuration as string);
        const [generatedOn] = token.split('_');
        const dateString = Buffer.from(generatedOn, 'base64').toString();
        const date = new Date(dateString);
        const elapsed = +new Date() - +date;
        return elapsed < duration;
    }
}
