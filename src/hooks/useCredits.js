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
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useCreateCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: creditService.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: creditKeys.lists(variables.groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
      queryClient.invalidateQueries({ queryKey: ['publicGroups'] });
    },
  });
}

export function useQuickCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: creditService.quickCredit,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: creditKeys.lists(variables.groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
      queryClient.invalidateQueries({ queryKey: ['publicGroups'] });
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
      queryClient.invalidateQueries({ queryKey: ['publicGroups'] });
    },
  });
}

export function useRedeemablePoints(memberId) {
  return useQuery({
    queryKey: creditKeys.redeemablePoints(memberId),
    queryFn: () => creditService.getRedeemablePoints(memberId),
    enabled: !!memberId,
  });
}

export function useRedemptions(memberId) {
  return useQuery({
    queryKey: creditKeys.redemptions(memberId),
    queryFn: () => creditService.getRedemptions(memberId),
    enabled: !!memberId,
  });
}

export function useCreateRedemption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: creditService.createRedemption,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: creditKeys.redeemablePoints(variables.memberId) });
      queryClient.invalidateQueries({ queryKey: creditKeys.redemptions(variables.memberId) });
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}
