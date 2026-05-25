import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditService } from '../api/credits';
import { creditKeys } from '../api/creditKeys';
import { groupKeys } from '../api/groupKeys';
import { sessionKeys } from '../api/sessionKeys';

export function useCredits(groupId) {
  return useQuery({
    queryKey: creditKeys.lists(groupId),
    queryFn: () => creditService.getAll(groupId),
    enabled: !!groupId,
  });
}

export function useCreditSummary(commissionId) {
  return useQuery({
    queryKey: creditKeys.summaries(commissionId),
    queryFn: () => creditService.getSummary(commissionId),
    enabled: !!commissionId,
  });
}

export function useCreateCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: creditService.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: creditKeys.lists(variables.groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}

export function useReverseCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: creditService.reverse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}
