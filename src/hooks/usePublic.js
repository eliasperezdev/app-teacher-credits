import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicService } from '../api/public';

export function usePublicGroups(slug) {
  return useQuery({
    queryKey: ['publicGroups', slug],
    queryFn: () => publicService.getPublicGroups(slug),
    enabled: !!slug,
  });
}

export function useGeneratePublicLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publicService.generatePublicLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicLink'] });
    },
  });
}

export function useRevokePublicLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publicService.revokePublicLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicLink'] });
    },
  });
}
