'use client';

import Input from 'react-currency-input-field';

import { getCurrencySymbol } from '@/lib/format';

type CurrencyInputProps = {
  disabled?: boolean;
  id?: string;
  intlConfig: { locale: string; currency: string };
  name?: string;
  onValueChange: (value: string | undefined, name?: string | undefined) => void;
  placeholder?: string;
  value: string | number;
};

export const CurrencyInput = ({
  disabled = false,
  id,
  intlConfig,
  name,
  onValueChange,
  placeholder,
  value,
}: CurrencyInputProps) => {
  return (
    <Input
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled}
      id={id}
      intlConfig={intlConfig}
      name={name}
      onValueChange={onValueChange}
      placeholder={placeholder}
      prefix={`${getCurrencySymbol(intlConfig.locale, intlConfig.currency)} `}
      step={0.01}
      value={value}
    />
  );
};
