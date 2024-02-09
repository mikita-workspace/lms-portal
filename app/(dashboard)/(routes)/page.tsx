import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getCourses } from '@/actions/db/get-courses';
import { SearchInput } from '@/components/common/search-input';
import { db } from '@/lib/db';

import { Categories } from '../_components/category/categories';
import { CoursesList } from '../_components/courses/courses-list';

type SearchPageProps = {
  searchParams: { title: string; categoryId: string };
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const user = await getCurrentUser();

  const categories = await db.category.findMany({ orderBy: { name: 'asc' } });

  const courses = await getCourses({ ...searchParams, userId: user?.userId });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
