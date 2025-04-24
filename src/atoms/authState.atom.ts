import { atomWithStorage } from "jotai/utils";

type AuthStateType = {
  accessToken: string | null;
  refreshToken: string | null;
}

const defaultValue: AuthStateType = {
  accessToken: null,
  refreshToken: null,
}

// TODO: rename to authState
export const authState = atomWithStorage<AuthStateType>("TC_user", defaultValue);