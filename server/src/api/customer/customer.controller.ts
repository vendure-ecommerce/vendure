import { Controller, Get, Param } from '@nestjs/common';
import { PaginatedList } from '../../common/common-types';
import { Customer } from '../../entity/customer/customer.entity';
import { CustomerService } from '../../service/customer.service';

@Controller('customers')
export class CustomerController {
    constructor(private userService: CustomerService) {}

    @Get()
    findAll(): Promise<PaginatedList<Customer>> {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param() params): Promise<Customer | undefined> {
        return this.userService.findOne(params.id);
    }
}
