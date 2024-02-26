'use client';

import { Course } from '@prisma/client';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { ReactTags, Tag } from 'react-tag-autocomplete';

import { Button } from '@/components/ui/button';
import { COUNTRY_CODES } from '@/constants/locale';
import { fetcher } from '@/lib/fetcher';

type CountriesFormProps = {
  courseId: string;
  initialData: Course;
};

export const CountriesForm = ({ courseId, initialData }: CountriesFormProps) => {
  const initialCountries = initialData.countryCodes.reduce<Tag[]>((acc, code) => {
    const country = COUNTRY_CODES[code as keyof typeof COUNTRY_CODES];

    if (country) {
      acc.push({ label: country, value: country });
    }

    return acc;
  }, []);

  const [selectedCountries, setSelectedCountries] = useState(initialCountries);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleEdit = () => setIsEditing((prev) => !prev);

  const router = useRouter();

  const handleAdd = useCallback(
    (country: Tag) => {
      setSelectedCountries([...selectedCountries, country]);
    },
    [selectedCountries],
  );

  const handleAddAll = () => {
    setSelectedCountries(
      Object.values(COUNTRY_CODES).map((country) => ({ label: country, value: country })),
    );
  };

  const handleRemove = useCallback(
    (index: number) => {
      setSelectedCountries(selectedCountries.filter((_, i) => i !== index));
    },
    [selectedCountries],
  );

  const handleRemoveAll = () => {
    setSelectedCountries([]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await fetcher.patch(`/api/courses/${courseId}`, {
        body: {
          countryCodes: selectedCountries.map(({ label }) => {
            const code = Object.keys(COUNTRY_CODES).find(
              (key) => COUNTRY_CODES[key as keyof typeof COUNTRY_CODES] === label,
            );

            return code;
          }),
        },
      });

      toast.success('Course updated');
      handleToggleEdit();

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonProps = {
    classNames: {
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
      listBox: 'react-tags__listbox bg-popover text-popover-foreground rounded-md border shadow-md',
      option: 'react-tags__listbox-option hover:bg-accent',
      optionIsActive: 'is-active bg-accent',
      highlight: 'react-tags__listbox-option-highlight bg-accent',
      input: 'react-tags__combobox-input placeholder:text-muted-foreground',
    },
    labelText: '',
    onAdd: handleAdd,
    onDelete: handleRemove,
  };

  return (
    <div className="mt-6 border  bg-neutral-100 dark:bg-neutral-900 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Countries
        <div className="flex items-center gap-x-2">
          {isEditing && (
            <>
              <Button onClick={handleAddAll} variant="outline" size="sm">
                Add all
              </Button>
              <Button onClick={handleRemoveAll} variant="outline" size="sm">
                Remove all
              </Button>
            </>
          )}
          <Button onClick={handleToggleEdit} variant="outline" size="sm">
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="mt-4">
        {!isEditing && (
          <ReactTags
            {...commonProps}
            isDisabled
            placeholderText=""
            selected={selectedCountries}
            suggestions={[]}
          />
        )}
        {isEditing && (
          <>
            <ReactTags
              {...commonProps}
              isDisabled={isSubmitting}
              noOptionsText="No matching countries"
              placeholderText="Select countries"
              selected={selectedCountries}
              suggestions={Object.values(COUNTRY_CODES).map((name, index) => ({
                value: index,
                label: name,
              }))}
            />
            <div className="flex items-center gap-x-2 mt-4">
              <Button disabled={isSubmitting} isLoading={isSubmitting} onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
