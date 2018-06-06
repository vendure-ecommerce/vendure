import { Controller, Get, Param } from '@nestjs/common';
import { Customer } from '../../entity/customer/customer.interface';
import { CustomerService } from './customer.service';

@Controller('customers')
export class CustomerController {
    constructor(private userService: CustomerService) {}

    @Get()
    findAll(): Promise<Customer[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param() params): Promise<Customer> {
        return this.userService.findOne(params.id);
    }
}
