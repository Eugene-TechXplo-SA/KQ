import type { PrincipalContext } from "./auth";

export type ApiEnv = {
  Variables: {
    auth: PrincipalContext;
  };
};
