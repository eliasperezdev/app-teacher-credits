import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { raffleService } from '../api/raffles';
import { raffleKeys } from '../api/raffleKeys';
import { sessionKeys } from '../api/sessionKeys';
import { groupKeys } from '../api/groupKeys';

export function useRaffles(sessionId) {
  return useQuery({
    queryKey: raffleKeys.lists(sessionId),
    queryFn: () => raffleService.getAll(sessionId),
    enabled: !!sessionId,
  });
}

export function useRafflePool(sessionId) {
  return useQuery({
    queryKey: raffleKeys.pool(sessionId),
    queryFn: () => raffleService.getPool(sessionId),
    enabled: !!sessionId,
  });
}

export function useCreateRaffle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: raffleService.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: raffleKeys.lists(variables.sessionId) });
      queryClient.invalidateQueries({ queryKey: raffleKeys.pool(variables.sessionId) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(variables.sessionId) });
    },
  });
}

export function useResolveRaffleResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: raffleService.resolveResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: raffleKeys.all });
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ queryKey: ['publicGroups'] });
    },
  });
}

export function useRerunRaffle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: raffleService.rerun,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: raffleKeys.lists(variables.sessionId) });
      queryClient.invalidateQueries({ queryKey: raffleKeys.pool(variables.sessionId) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(variables.sessionId) });
    },
  });
}

export function useCorrectRaffleResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: raffleService.correctResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: raffleKeys.all });
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ queryKey: ['publicGroups'] });
    },
  });
}
