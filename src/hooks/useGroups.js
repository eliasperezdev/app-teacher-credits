import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '../api/groups';
import { groupKeys } from '../api/groupKeys';
import { studentKeys } from '../api/studentKeys';

export function useGroups(commissionId) {
  return useQuery({
    queryKey: groupKeys.lists(commissionId),
    queryFn: () => groupService.getAll(commissionId),
    enabled: !!commissionId,
  });
}

export function useGroup(id) {
  return useQuery({
    queryKey: groupKeys.detail(id),
    queryFn: () => groupService.getById(id),
    enabled: !!id,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupService.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists(variables.commissionId) });
      queryClient.invalidateQueries({ queryKey: ['publicGroups'] });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['publicGroups'] });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ queryKey: ['publicGroups'] });
    },
  });
}

export function useAddGroupMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupService.addMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: ['publicGroups'] });
    },
  });
}

export function useRemoveGroupMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupService.removeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: ['publicGroups'] });
    },
  });
}
