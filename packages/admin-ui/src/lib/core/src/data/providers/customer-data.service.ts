import {
    AddCustomersToGroup,
    AddNoteToCustomer,
    CreateAddressInput,
    CreateCustomer,
    CreateCustomerAddress,
    CreateCustomerGroup,
    CreateCustomerGroupInput,
    CreateCustomerInput,
    CustomerGroupListOptions,
    CustomerListOptions,
    DeleteCustomer,
    DeleteCustomerGroup,
    DeleteCustomerNote,
    GetCustomer,
    GetCustomerGroups,
    GetCustomerGroupWithCustomers,
    GetCustomerHistory,
    GetCustomerList,
    HistoryEntryListOptions,
    OrderListOptions,
    RemoveCustomersFromGroup,
    UpdateAddressInput,
    UpdateCustomer,
    UpdateCustomerAddress,
    UpdateCustomerGroup,
    UpdateCustomerGroupInput,
    UpdateCustomerInput,
    UpdateCustomerNote,
    UpdateCustomerNoteInput,
} from '../../common/generated-types';
import {
    ADD_CUSTOMERS_TO_GROUP,
    ADD_NOTE_TO_CUSTOMER,
    CREATE_CUSTOMER,
    CREATE_CUSTOMER_ADDRESS,
    CREATE_CUSTOMER_GROUP,
    DELETE_CUSTOMER,
    DELETE_CUSTOMER_GROUP,
    DELETE_CUSTOMER_NOTE,
    GET_CUSTOMER,
    GET_CUSTOMER_GROUP_WITH_CUSTOMERS,
    GET_CUSTOMER_GROUPS,
    GET_CUSTOMER_HISTORY,
    GET_CUSTOMER_LIST,
    REMOVE_CUSTOMERS_FROM_GROUP,
    UPDATE_CUSTOMER,
    UPDATE_CUSTOMER_ADDRESS,
    UPDATE_CUSTOMER_GROUP,
    UPDATE_CUSTOMER_NOTE,
} from '../definitions/customer-definitions';

import { BaseDataService } from './base-data.service';

export class CustomerDataService {
    constructor(private baseDataService: BaseDataService) {}

    getCustomerList(take: number = 10, skip: number = 0, filterTerm?: string) {
        const filter = filterTerm
            ? {
                  filter: {
                      emailAddress: {
                          contains: filterTerm,
                      },
                  },
              }
            : {};
        return this.baseDataService.query<GetCustomerList.Query, GetCustomerList.Variables>(
            GET_CUSTOMER_LIST,
            {
                options: {
                    take,
                    skip,
                    ...filter,
                },
            },
        );
    }

    getCustomer(id: string, orderListOptions?: OrderListOptions) {
        return this.baseDataService.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
            id,
            orderListOptions,
        });
    }

    createCustomer(input: CreateCustomerInput, password?: string) {
        return this.baseDataService.mutate<CreateCustomer.Mutation, CreateCustomer.Variables>(
            CREATE_CUSTOMER,
            {
                input,
                password,
            },
        );
    }

    updateCustomer(input: UpdateCustomerInput) {
        return this.baseDataService.mutate<UpdateCustomer.Mutation, UpdateCustomer.Variables>(
            UPDATE_CUSTOMER,
            {
                input,
            },
        );
    }

    deleteCustomer(id: string) {
        return this.baseDataService.mutate<DeleteCustomer.Mutation, DeleteCustomer.Variables>(
            DELETE_CUSTOMER,
            { id },
        );
    }

    createCustomerAddress(customerId: string, input: CreateAddressInput) {
        return this.baseDataService.mutate<CreateCustomerAddress.Mutation, CreateCustomerAddress.Variables>(
            CREATE_CUSTOMER_ADDRESS,
            {
                customerId,
                input,
            },
        );
    }

    updateCustomerAddress(input: UpdateAddressInput) {
        return this.baseDataService.mutate<UpdateCustomerAddress.Mutation, UpdateCustomerAddress.Variables>(
            UPDATE_CUSTOMER_ADDRESS,
            {
                input,
            },
        );
    }

    createCustomerGroup(input: CreateCustomerGroupInput) {
        return this.baseDataService.mutate<CreateCustomerGroup.Mutation, CreateCustomerGroup.Variables>(
            CREATE_CUSTOMER_GROUP,
            {
                input,
            },
        );
    }

    updateCustomerGroup(input: UpdateCustomerGroupInput) {
        return this.baseDataService.mutate<UpdateCustomerGroup.Mutation, UpdateCustomerGroup.Variables>(
            UPDATE_CUSTOMER_GROUP,
            {
                input,
            },
        );
    }

    deleteCustomerGroup(id: string) {
        return this.baseDataService.mutate<DeleteCustomerGroup.Mutation, DeleteCustomerGroup.Variables>(
            DELETE_CUSTOMER_GROUP,
            { id },
        );
    }

    getCustomerGroupList(options?: CustomerGroupListOptions) {
        return this.baseDataService.query<GetCustomerGroups.Query, GetCustomerGroups.Variables>(
            GET_CUSTOMER_GROUPS,
            {
                options,
            },
        );
    }

    getCustomerGroupWithCustomers(id: string, options: CustomerListOptions) {
        return this.baseDataService.query<
            GetCustomerGroupWithCustomers.Query,
            GetCustomerGroupWithCustomers.Variables
        >(GET_CUSTOMER_GROUP_WITH_CUSTOMERS, {
            id,
            options,
        });
    }

    addCustomersToGroup(groupId: string, customerIds: string[]) {
        return this.baseDataService.mutate<AddCustomersToGroup.Mutation, AddCustomersToGroup.Variables>(
            ADD_CUSTOMERS_TO_GROUP,
            {
                groupId,
                customerIds,
            },
        );
    }

    removeCustomersFromGroup(groupId: string, customerIds: string[]) {
        return this.baseDataService.mutate<
            RemoveCustomersFromGroup.Mutation,
            RemoveCustomersFromGroup.Variables
        >(REMOVE_CUSTOMERS_FROM_GROUP, {
            groupId,
            customerIds,
        });
    }

    getCustomerHistory(id: string, options?: HistoryEntryListOptions) {
        return this.baseDataService.query<GetCustomerHistory.Query, GetCustomerHistory.Variables>(
            GET_CUSTOMER_HISTORY,
            {
                id,
                options,
            },
        );
    }

    addNoteToCustomer(customerId: string, note: string) {
        return this.baseDataService.mutate<AddNoteToCustomer.Mutation, AddNoteToCustomer.Variables>(
            ADD_NOTE_TO_CUSTOMER,
            {
                input: {
                    note,
                    isPublic: false,
                    id: customerId,
                },
            },
        );
    }

    updateCustomerNote(input: UpdateCustomerNoteInput) {
        return this.baseDataService.mutate<UpdateCustomerNote.Mutation, UpdateCustomerNote.Variables>(
            UPDATE_CUSTOMER_NOTE,
            {
                input,
            },
        );
    }

    deleteCustomerNote(id: string) {
        return this.baseDataService.mutate<DeleteCustomerNote.Mutation, DeleteCustomerNote.Variables>(
            DELETE_CUSTOMER_NOTE,
            {
                id,
            },
        );
    }
}
