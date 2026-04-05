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
  // Inicializamos com os valores passados, ou string vazia se forem nulos/undefined
  const [institution, setInstitution] = useState(initialInstitution);
  const [course, setCourse] = useState(initialCourse);
  const [courseOptions, setCourseOptions] = useState<string[]>([]);

  const institutionOptions = getAllInstitutions();

  // 1. Sincroniza o estado interno se as props iniciais mudarem (ex: data carregou depois)
  useEffect(() => {
    if (initialInstitution) {
      setInstitution(initialInstitution);
      const courses = getCoursesForInstitution(initialInstitution);
      setCourseOptions(courses);
    }
  }, [initialInstitution]);

  useEffect(() => {
    if (initialCourse) {
      setCourse(initialCourse);
    }
  }, [initialCourse]);

  // 2. Handler para mudança de instituição
  const handleInstitutionChange = useCallback((newInstitution: string) => {
    setInstitution(newInstitution);
    setCourse(''); // Limpa o curso ao trocar a faculdade
    
    // Busca os cursos disponíveis para a nova seleção
    const courses = getCoursesForInstitution(newInstitution);
    setCourseOptions(courses);
  }, []);

  // 3. Handler para mudança de curso
  const handleCourseChange = useCallback((newCourse: string) => {
    setCourse(newCourse);
  }, []);

  return {
    institutionOptions,
    courseOptions,
    handleInstitutionChange,
    handleCourseChange,
    institution,
    course,
  };
}