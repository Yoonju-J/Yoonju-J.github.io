import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateLinkRequest, type UpdateLinkRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useLinks() {
  return useQuery({
    queryKey: [api.links.list.path],
    queryFn: async () => {
      const res = await fetch(api.links.list.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch links");
      return api.links.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateLinkRequest) => {
      const res = await fetch(api.links.create.path, {
        method: api.links.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create link");
      return api.links.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.links.list.path] });
      // Don't toast on simple add, UI feedback is enough usually, but let's be safe
      toast({ title: "Link added" });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not create link", variant: "destructive" });
    },
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & UpdateLinkRequest) => {
      const url = buildUrl(api.links.update.path, { id });
      const res = await fetch(url, {
        method: api.links.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update link");
      return api.links.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.links.list.path] });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not update link", variant: "destructive" });
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.links.delete.path, { id });
      const res = await fetch(url, {
        method: api.links.delete.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete link");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.links.list.path] });
      toast({ title: "Link deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not delete link", variant: "destructive" });
    },
  });
}

export function useReorderLinks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const res = await fetch(api.links.reorder.path, {
        method: api.links.reorder.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to reorder links");
      return api.links.reorder.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.links.list.path] });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not reorder links", variant: "destructive" });
    },
  });
}
