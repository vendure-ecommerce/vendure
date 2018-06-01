import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "./login.dto";
import { AuthService } from "../../auth/auth.service";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const token = await this.authService.createToken(loginDto.username, loginDto.password);
        if (token) {
            return {
                token
            };
        }
    }
}
