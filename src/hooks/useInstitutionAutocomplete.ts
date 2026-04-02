import { useState, useEffect, useCallback } from 'react';
import { getAllInstitutions, getCoursesForInstitution } from '@/constants/institutions';

interface UseInstitutionAutocompleteReturn {
  institutionOptions: string[];
  courseOptions: string[];
  handleInstitutionChange: (institution: string) => void;
  handleCourseChange: (course: string) => void;
  institution: string;
  course: string;
}

export function useInstitutionAutocomplete(
  initialInstitution: string = '',
  initialCourse: string = ''
): UseInstitutionAutocompleteReturn {
  const [institution, setInstitution] = useState(initialInstitution);
  const [course, setCourse] = useState(initialCourse);
  const [courseOptions, setCourseOptions] = useState<string[]>([]);

  const institutionOptions = getAllInstitutions();

  const handleInstitutionChange = useCallback((newInstitution: string) => {
    setInstitution(newInstitution);
    setCourse(''); // Reset course when institution changes
    const courses = getCoursesForInstitution(newInstitution);
    setCourseOptions(courses);
  }, []);

  const handleCourseChange = useCallback((newCourse: string) => {
    setCourse(newCourse);
  }, []);

  // Effect to load courses if initial institution is provided
  useEffect(() => {
    if (initialInstitution) {
      const courses = getCoursesForInstitution(initialInstitution);
      setCourseOptions(courses);
    }
  }, [initialInstitution]);

  return {
    institutionOptions,
    courseOptions,
    handleInstitutionChange,
    handleCourseChange,
    institution,
    course,
  };
}