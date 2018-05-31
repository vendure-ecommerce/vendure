import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/User';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param() params): Promise<User> {
        return this.userService.findOne(params.id);
    }
}
