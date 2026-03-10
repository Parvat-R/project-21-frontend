import { apiConnector } from "../apiConnector";
import { endpoints } from "../api";
import { saveSession } from "@/lib/auth";

const { SIGNUP_API, SIGNIN_API } = endpoints;

interface SignUpData {
  user: string;
  email: string;
  password: string;
  role?: "USER" | "ORGANISER";
}

interface SignInData {
  email: string;
  password: string;
}

export function signUp({ user, email, password, role = "USER" }: SignUpData) {
  return async () => {
    const response = await apiConnector(
      "POST",
      SIGNUP_API,
      { name: user, email, password, role },
      { "Content-Type": "application/json" },
      null,
      true,
    );
    return response;
  };
}

export function signIn({ email, password }: SignInData) {
  return async () => {
    const response = await apiConnector(
      "POST",
      SIGNIN_API,
      { email, password },
      { "Content-Type": "application/json" },
      null,
      true,
    );

    const data = response.data;

    if (data?.data?.token) {
      const user = saveSession(data.data.token);
      return { success: true, user };
    }

    return { success: false, user: null };
  };
}
