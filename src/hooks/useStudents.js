import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../api/students';
import { studentKeys } from '../api/studentKeys';

export function useStudents(commissionId) {
  return useQuery({
    queryKey: studentKeys.lists(commissionId),
    queryFn: () => studentService.getAll(commissionId),
    enabled: !!commissionId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useImportStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commissionId, file }) =>
      studentService.importStudents(commissionId, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists(variables.commissionId) });
    },
  });
}

export function useEnrollStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentService.enroll,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists(variables.commissionId) });
    },
  });
}

export function useUnenrollStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentService.unenroll,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists(variables.commissionId) });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}
