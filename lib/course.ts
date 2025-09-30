import { getCourses } from '@/actions/courses/get-courses';

type Course = Awaited<ReturnType<typeof getCourses>>[0];

export const getGroupedCourseList = (courses: Course[]) =>
  courses.reduce<Record<string, Course[]>>((grouped, course) => {
    const categoryId = course.categoryId;

    if (categoryId) {
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }

      grouped[categoryId].push(course);
    }

    return grouped;
  }, {});
