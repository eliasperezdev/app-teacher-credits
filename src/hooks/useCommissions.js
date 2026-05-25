import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commissionService } from '../api/commissions';
import { commissionKeys } from '../api/commissionKeys';

export function useCommissions(subjectId) {
  return useQuery({
    queryKey: commissionKeys.lists(subjectId),
    queryFn: () => commissionService.getAll(subjectId),
    enabled: !!subjectId,
  });
}

export function useCommission(id) {
  return useQuery({
    queryKey: commissionKeys.detail(id),
    queryFn: () => commissionService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commissionService.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.lists(variables.subjectId) });
    },
  });
}

export function useUpdateCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commissionService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.detail(variables.id) });
    },
  });
}

export function useDeleteCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commissionService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.all });
    },
  });
}
