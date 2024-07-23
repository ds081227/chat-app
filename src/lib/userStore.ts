import { create } from "zustand";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { db } from "./firebase";

interface UserStore {
  currentUser: DocumentData | null;
  isLoading: boolean;
  fetchUserInfo: (uid: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid: string) => {
    if (!uid) return set({ currentUser: null, isLoading: false });
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
        console.log("Document data:", docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        set({ currentUser: null, isLoading: false });
      }
    } catch (error) {
      console.log(error);
      return set({ currentUser: null, isLoading: false });
    }
  },
}));
