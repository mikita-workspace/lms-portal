'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Course } from '@prisma/client';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ReactTags } from 'react-tag-autocomplete';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Button } from '@/components/ui/button';
import { COUNTRY_CODES } from '@/constants/locale';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

type CountriesFormProps = {
  courseId: string;
  initialData: Course;
};

export const CountriesForm = ({ courseId, initialData }: CountriesFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      await fetcher.patch(`/api/courses/${courseId}`, { body: values });

      toast.success('Course updated');

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const [selected, setSelected] = useState([]);

  const onAdd = useCallback(
    (newTag) => {
      setSelected([...selected, newTag]);
    },
    [selected],
  );

  const onDelete = useCallback(
    (tagIndex) => {
      setSelected(selected.filter((_, i) => i !== tagIndex));
    },
    [selected],
  );

  return (
    <div className="mt-6 border  bg-neutral-100 dark:bg-neutral-900 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">Countries</div>
      <div className="mt-4">
        <ReactTags
          placeholderText="Select countries"
          labelText=""
          onAdd={onAdd}
          noOptionsText="No matching countries"
          classNames={{
            root: 'react-tags text-primary bg-background border rounded-md',
            rootIsActive: 'is-active',
            rootIsDisabled: 'is-disabled',
            rootIsInvalid: 'is-invalid',
            label: 'react-tags__label',
            tagList: 'react-tags__list',
            tagListItem: 'react-tags__list-item',
            tag: 'react-tags__tag bg-accent',
            tagName: 'react-tags__tag-name',
            comboBox: 'react-tags__combobox',
            listBox:
              'react-tags__listbox bg-popover text-popover-foreground rounded-md border shadow-md',
            option: 'react-tags__listbox-option hover:bg-accent',
            optionIsActive: 'is-active bg-accent',
            highlight: 'react-tags__listbox-option-highlight bg-accent',
            input: 'react-tags__combobox-input placeholder:text-muted-foreground',
          }}
          onDelete={onDelete}
          selected={selected}
          suggestions={Object.values(COUNTRY_CODES).map((name, index) => ({
            value: index,
            label: name,
          }))}
        />
      </div>

      {/* <ReactTags
        labelText="Select countries"
        selected={selected}
        suggestions={Object.values(COUNTRY_CODES).map((name, index) => ({
          value: index,
          label: name,
        }))}
        onAdd={onAdd}
        onDelete={onDelete}
        noOptionsText="No matching countries"
      /> */}
      {/* {!isEditing && (
        <p className={cn('text-sm mt-2', !initialData.categoryId && 'text-neutral-500 italic')}>
          {selectedOption?.label || 'No category'}
        </p>
      )} */}
      {/* {isEditing && (
        <Form {...form}>
          <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="shadow-none">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.label} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} isLoading={isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )} */}
    </div>
  );
};
