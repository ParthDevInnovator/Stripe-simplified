import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://suitable-mole-57.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
} satisfies AuthConfig;


