'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { getStripePromo } from '@/actions/stripe/get-stripe-promo';
import { MarkAllButton } from '@/app/(settings)/(routes)/settings/notifications/_components/MarkAllButton';
import { Button, Input } from '@/components/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getNotificationActionName } from '@/lib/notifications';

import { PromoModal } from '../modals/promo-modal';

type StripePromo = Awaited<ReturnType<typeof getStripePromo>>;
type Coupon = StripePromo['coupons'][number];
type Customer = StripePromo['customers'][number];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  coupons?: Coupon[];
  customers?: Customer[];
  data: TData[];
  initialPageSize?: number;
  isNotificationPage?: boolean;
  isPromoPage?: boolean;
  isTeacherCoursesPage?: boolean;
  noLabel?: string;
}

export function DataTable<TData, TValue>({
  columns,
  coupons = [],
  customers = [],
  data,
  initialPageSize = 10,
  isNotificationPage = false,
  isPromoPage = false,
  isTeacherCoursesPage = false,
  noLabel,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    state: {
      columnFilters,
      sorting,
    },
  });

  const filterPlaceholder = (() => {
    if (isTeacherCoursesPage) {
      return 'Filter courses...';
    }

    if (isPromoPage) {
      return 'Filter promotion codes...';
    }

    if (isNotificationPage) {
      return 'Filter notifications...';
    }

    return '';
  })();

  return (
    <div>
      {(isTeacherCoursesPage || isPromoPage || isNotificationPage) && (
        <div className="flex items-center py-4 justify-between space-x-2">
          <div className="flex gap-x-2 w-full">
            <Input
              placeholder={filterPlaceholder}
              value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
          </div>
          {isTeacherCoursesPage && (
            <Link href="/teacher/create">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Course
              </Button>
            </Link>
          )}
          {isPromoPage && (
            <PromoModal coupons={coupons} customers={customers}>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add promotion code
              </Button>
            </PromoModal>
          )}
          {isNotificationPage && (
            <>
              {(() => {
                const filteredRows = table.getFilteredSelectedRowModel().rows;
                const amountOfSelectedRows = filteredRows.length;

                const { action, ids } = getNotificationActionName(
                  filteredRows.map((row) => row.original) as unknown as any,
                );

                return (
                  amountOfSelectedRows > 0 && (
                    <MarkAllButton
                      action={action}
                      amount={amountOfSelectedRows}
                      ids={ids}
                      reset={table.resetRowSelection}
                    />
                  )
                );
              })()}
            </>
          )}
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <>
                {noLabel && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {noLabel}
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
