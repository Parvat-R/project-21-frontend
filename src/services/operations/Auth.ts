import { apiConnector } from "../apiConnector";
import { endpoints } from "../api";
import jwt from "jsonwebtoken";

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

      const data = response.data;
      console.log("SIGNIN API RESPONSE............", data);

      if (data?.data?.token) {
        // Store token in localStorage
        console.log(
          "Storing token in localStorage............",
          data.data.token,
        );
        const decoded = jwt.verify(
          data.data.token,
          process.env.NEXT_PUBLIC_JWT_SECRET!,
        );
        console.log(decoded);
        console.log("tokenData", JSON.stringify(decoded));
        localStorage.setItem("token", data.data.token);
      }

      return data;
    } catch (error) {
      console.log("SIGNIN API ERROR............", error);
      throw error;
    }
  };
}
