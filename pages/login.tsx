import React, { useState, useRef } from "react";
import { useSession, signIn } from "next-auth/client";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

const Login: React.FC = (props) => {
  const [status, setStatus] = useState<string>(null);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  async function submitHandler(event: React.SyntheticEvent) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current?.value;
    const enteredPassword = passwordInputRef.current?.value;

    // optional: Add validation

    const result = await signIn("credentials", {
      redirect: false,
      email: enteredEmail,
      password: enteredPassword,
    });

    if (!result.error) {
      // set some auth state
      setStatus(`Log in Success!`);
      router.replace("/");
    } else {
      setStatus(`Error Occured : ${result.error}`);
    }
  } // end of submitHandler function

  const [session] = useSession();
  const router = useRouter();

  if (session) {
    router.replace("/");
    return (
      <Layout>
        <h1>Log in</h1>
        <div>You are already logged in.</div>
        <div>Now redirect to main page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Log in</h1>
      <form onSubmit={submitHandler}>
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
          <button>Log in</button>
        </div>
        <h1>{status}</h1>
      </form>
    </Layout>
  );
};

export default Login;
