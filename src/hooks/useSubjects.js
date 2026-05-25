import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '../api/subjects';
import { subjectKeys } from '../api/subjectKeys';

export function useSubjects() {
  return useQuery({
    queryKey: subjectKeys.lists(),
    queryFn: subjectService.getAll,
  });
}

export function useSubject(id) {
  return useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: () => subjectService.getById(id),
    enabled: !!id,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subjectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) => subjectService.update(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subjectKeys.detail(variables.id) });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subjectService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}
