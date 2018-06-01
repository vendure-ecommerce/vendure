import { Controller, Get, Param } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from "../../entity/customer/customer.interface";

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
