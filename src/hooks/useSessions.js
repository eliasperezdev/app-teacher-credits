import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '../api/sessions';
import { sessionKeys } from '../api/sessionKeys';

export function useSessions(commissionId) {
  return useQuery({
    queryKey: sessionKeys.lists(commissionId),
    queryFn: () => sessionService.getAll(commissionId),
    enabled: !!commissionId,
  });
}

export function useSession(id) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => sessionService.getById(id),
    enabled: !!id,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionService.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists(variables.commissionId) });
    },
  });
}

export function useCloseSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionService.close,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(variables) });
    },
  });
}
