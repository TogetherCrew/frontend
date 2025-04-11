import useAppStore from "@/store/useStore";

export const useAdmin = () => {
  const userPermissions = useAppStore(
    (state) => state.userRolePermissions || [],
  );

  const isAdmin = userPermissions.includes("admin");
  return { isAdmin };

};
