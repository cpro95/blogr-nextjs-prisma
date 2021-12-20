import { useRef, useState, useEffect } from "react";
import { getSession, useSession, signOut } from "next-auth/client";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

function UserProfile() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>(null);
  const [session] = useSession();

  const nameRef = useRef<HTMLInputElement>(null);
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.replace("/login");
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  function submitHandler(event: React.SyntheticEvent) {
    event.preventDefault();

    const enteredName = nameRef.current?.value;
    const enteredOldPassword = oldPasswordRef.current?.value;
    const enteredNewPassword = newPasswordRef.current?.value;

    // optional: Add validation

    changeProfileHandler({
      newName: enteredName,
      oldPassword: enteredOldPassword,
      newPassword: enteredNewPassword,
    });
  }

  interface changeProfileProps {
    newName: string;
    oldPassword: string;
    newPassword: string;
  }

  async function changeProfileHandler(profileData: changeProfileProps) {
    const response = await fetch("/api/auth/change-profile", {
      method: "PATCH",
      body: JSON.stringify(profileData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.error) {
      setStatus(`Error Occured : ${data.message}`);
    } else {
      setStatus(null);
      signOut();
      router.replace("/login");
    }

    console.log(data);
  }

  return (
    <Layout>
      <h1>Your Profile</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="string"
            id="name"
            placeholder={session?.user?.name}
            ref={nameRef}
          />
        </div>
        <div>
          <label htmlFor="old-password">Old Password</label>
          <input type="password" id="old-password" ref={oldPasswordRef} />
        </div>
        <div>
          <label htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" ref={newPasswordRef} />
        </div>
        <div>
          <button>Change Profile</button>
        </div>
        <h1>{status}</h1>
      </form>
    </Layout>
  );
}

export default UserProfile;
