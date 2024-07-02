import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSO_CALLBACK_ROUTER() {
  return <AuthenticateWithRedirectCallback />;
}
