import { getCourses } from '@/actions/courses/get-courses';
import { CourseLevel } from '@/constants/courses';

type Course = Awaited<ReturnType<typeof getCourses>>[0];

export const getGroupedCourseList = (courses: Course[], specificFilter = false) =>
  courses.reduce<Record<string, Course[]>>((grouped, course) => {
    const categoryId =
      (specificFilter && course.isPremium ? CourseLevel.PREMIUM : course.categoryId) ?? '';

    if (!grouped[categoryId]) {
      grouped[categoryId] = [];
    }

    grouped[categoryId].push(course);

    return grouped;
  }, {});
