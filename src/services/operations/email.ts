import { apiConnector } from "../apiConnector";
import { emailEndpoints } from "../api";

const { WelcomeUser } = emailEndpoints;

interface WelcomeUserParams {
  email: string;
  name: string;
}
export function welcomeUser({ email, name }: WelcomeUserParams) {
  return async () => {
    const response = await apiConnector(
      "POST",
      emailEndpoints.WelcomeUser,
      { email, name },
      { "Content-Type": "application/json" },
      null,
      true,
    );
    return response;
  };
}
