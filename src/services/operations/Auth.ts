import { apiConnector } from "../apiConnector";
import { endpoints } from "../api";

const { SIGNUP_API, SIGNIN_API } = endpoints;

interface SignUpData {
  user: string;
  email: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

export function signUp({ user, email, password }: SignUpData) {
  console.log("SIGNUP DATA............", { user, email, password });
  console.log("Signup API URL............", SIGNUP_API);

  return async () => {
    try {
      const response = await apiConnector(
        "POST",
        SIGNUP_API,
        {
          name: user,
          email,
          password,
        },
        {
          "Content-Type": "application/json",
        },
        null,
        true,
      );

      console.log("SIGNUP API RESPONSE............", response);
      return response;
    } catch (error) {
      console.log("SIGNUP API ERROR............", error);
      throw error;
    }
  };
}

export function signIn({ email, password }: SignInData) {
  console.log("SIGNIN DATA............", { email, password });
  console.log("Signin API URL............", SIGNIN_API);

  return async () => {
    try {
      const response = await apiConnector(
        "POST",
        SIGNIN_API,
        {
          email,
          password,
        },
        {
          "Content-Type": "application/json",
        },
        null,
        true,
      );

      console.log("SIGNIN API RESPONSE............", response);
      return response;
    } catch (error) {
      console.log("SIGNIN API ERROR............", error);
      throw error;
    }
  };
}
