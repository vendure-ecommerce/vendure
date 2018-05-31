import {Connection} from 'typeorm';
import * as faker from 'faker/locale/en_GB';
import {User} from '../core/entities/User';
import {Address} from '../core/entities/Address';


export async function populate(connection: Connection) {

    for (let i = 0; i < 5; i ++) {
        const user = new User();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.emailAddress = faker.internet.email(user.firstName, user.lastName);
        user.phoneNumber = faker.phone.phoneNumber();



        const address = new Address();
        address.fullName = `${user.firstName} ${user.lastName}`;
        address.streetLine1 = faker.address.streetAddress();
        address.city = faker.address.city();
        address.province = faker.address.county();
        address.postalCode = faker.address.zipCode()
        address.country = faker.address.countryCode();

        await connection.manager.save(address)

        user.addresses = [address];
        await connection.manager.save(user);
    }
}
