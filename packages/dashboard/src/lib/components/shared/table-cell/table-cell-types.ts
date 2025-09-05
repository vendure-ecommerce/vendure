import { CellContext } from '@tanstack/table-core';

/**
 * @description
 * This type is used to define re-usable components that can render a table cell in a
 * DataTable.
 *
 * @example
 * ```ts
 * type CustomerCellData = {
 *     customer: {
 *         id: string;
 *         firstName: string;
 *         lastName: string;
 *     } | null;
 * };
 *
 * export const CustomerCell: DataTableCellComponent<CustomerCellData> = ({ row }) => {
 *     const value = row.original.customer;
 *     if (!value) {
 *         return null;
 *     }
 *     return (
 *         <Button asChild variant="ghost">
 *             <Link to={`/customers/${value.id}`}>
 *                 {value.firstName} {value.lastName}
 *             </Link>
 *         </Button>
 *     );
 * };
 * ```
 */
export type DataTableCellComponent<T> = <Data extends T>(context: CellContext<Data, any>) => any;
