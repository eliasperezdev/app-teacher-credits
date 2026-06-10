import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicService } from '../api/public';

export function usePublicGroups(slug) {
  return useQuery({
    queryKey: ['publicGroups', slug],
    queryFn: () => publicService.getPublicGroups(slug),
    enabled: !!slug,
  });
}

export function usePublicLink(commissionId) {
  return useQuery({
    queryKey: ['publicLink', commissionId],
    queryFn: () => publicService.getPublicLink(commissionId),
    enabled: !!commissionId,
  });
}

export function useGeneratePublicLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publicService.generatePublicLink,
    onSuccess: (_data, commissionId) => {
      queryClient.invalidateQueries({ queryKey: ['publicLink', commissionId] });
    },
  });
}

export function useRevokePublicLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publicService.revokePublicLink,
    onSuccess: (_data, commissionId) => {
      queryClient.invalidateQueries({ queryKey: ['publicLink', commissionId] });
    },
  });
}
