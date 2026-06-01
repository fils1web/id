import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { getOrCreateFingerprint } from "@/lib/fingerprint";

interface FollowerState {
  count: number;
  isFollowing: boolean;
  isLoading: boolean;
  error: string | null;
  fetchCount: () => Promise<void>;
  checkFollowStatus: () => Promise<void>;
  toggleFollow: () => Promise<void>;
}

export const useFollowerStore = create<FollowerState>((set, get) => ({
  count: 0,
  isFollowing: false,
  isLoading: false,
  error: null,

  fetchCount: async () => {
    try {
      const { count, error } = await supabase
        .from("followers")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      set({ count: count || 0 });
    } catch (err) {
      set({ error: "Failed to load follower count" });
      console.error(err);
    }
  },

  checkFollowStatus: async () => {
    try {
      const fingerprint = getOrCreateFingerprint();
      const { data, error } = await supabase
        .from("followers")
        .select("id")
        .eq("fingerprint", fingerprint)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      set({ isFollowing: !!data });
    } catch (err) {
      console.error(err);
    }
  },

  toggleFollow: async () => {
    const { isFollowing } = get();
    set({ isLoading: true, error: null });
    try {
      const fingerprint = getOrCreateFingerprint();
      if (isFollowing) {
        const { error } = await supabase
          .from("followers")
          .delete()
          .eq("fingerprint", fingerprint);
        if (error) throw error;
        set({ isFollowing: false, count: Math.max(0, get().count - 1) });
      } else {
        const { error } = await supabase
          .from("followers")
          .insert({ fingerprint });
        if (error) {
          if (error.code === "23505") {
            set({ isFollowing: true });
            return;
          }
          throw error;
        }
        set({ isFollowing: true, count: get().count + 1 });
      }
    } catch (err) {
      set({ error: "Failed to update follow status" });
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
