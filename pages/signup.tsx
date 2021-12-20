import React, { useState, useRef } from "react";
import { useSession, signIn } from "next-auth/client";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

async function createUser(
  name: string,
  email: string,
  password: string
): Promise<any> {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}

const Signup: React.FC = (props) => {
  const [status, setStatus] = useState<string>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);


  const [session] = useSession();
  const router = useRouter();

  async function submitHandler(event: React.SyntheticEvent) {
    event.preventDefault();

    const enteredName = nameInputRef.current?.value;
    const enteredEmail = emailInputRef.current?.value;
    const enteredPassword = passwordInputRef.current?.value;

    // optional: Add validation

    try {
      const result = await createUser(
        enteredName,
        enteredEmail,
        enteredPassword
      );
      console.log(result);
      setStatus(`Sign up Success: ${result.message}`);
      // window.location.href = "/";
      router.replace("/login");
    } catch (error) {
      console.log(error);
      setStatus(`Error Occured: ${error.message}`);
    }
  } // end of submitHandler function



  if (session) {
    router.replace("/");
    return (
      <Layout>
        <h1>Sign Up</h1>
        <div>You are already signed up.</div>
        <div>Now redirect to main page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Sign Up</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="name">Your Name</label>
          <input type="text" id="name" required ref={nameInputRef} />
        </div>
        <div>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div>
          <button>Create Account</button>
        </div>
        <h1>{status}</h1>
      </form>
    </Layout>
  );
};

export default Signup;
