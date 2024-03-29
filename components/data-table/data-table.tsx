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
import { Button, Input } from '@/components/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

  return (
    <div>
      {(isTeacherCoursesPage || isPromoPage) && (
        <div className="flex items-center py-4 justify-between space-x-2">
          <Input
            placeholder={isTeacherCoursesPage ? 'Filter courses...' : 'Filter promotion codes...'}
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
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
