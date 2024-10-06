"use client";
import React, { useEffect, useRef } from "react";
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";

export default function Home() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!user && !signerStatus.isInitializing && loginButtonRef.current) {
      loginButtonRef.current.click();
    }
  }, [user, signerStatus.isInitializing]);

  return (
    <main className="flex flex-col items-center p-24 gap-4 justify-center text-center">
      {signerStatus.isInitializing ? (
        <>Loading...</>
      ) : user ? (
        <div className="flex flex-col gap-2 p-2">
          <p className="text-xl font-bold">Success!</p>
          Logged in as {user.email ?? "anon"}.
          <button className="btn btn-primary mt-6" onClick={() => logout()}>
            Log out
          </button>
        </div>
      ) : (
        <button
          ref={loginButtonRef}
          className="btn btn-primary"
          onClick={openAuthModal}
        >
          Login
        </button>
      )}
    </main>
  );
}
