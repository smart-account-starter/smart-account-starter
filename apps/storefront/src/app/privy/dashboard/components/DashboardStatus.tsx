import React, { useState } from "react";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import SignMessage from "./SignMessage";
import SendTransaction from "./SendTransaction";

async function verifyToken() {
  const url = "/api/verify";
  const accessToken = await getAccessToken();
  const result = await fetch(url, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined),
    },
  });

  return await result.json();
}

export default function DashboardStatus() {
  const [verifyResult, setVerifyResult] = useState();
  const {
    user,
    logout,
    linkEmail,
    linkWallet,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    unlinkWallet,
    linkGoogle,
    unlinkGoogle,
    linkTwitter,
    unlinkTwitter,
    linkDiscord,
    unlinkDiscord,
  } = usePrivy();

  const numAccounts = user?.linkedAccounts.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;

  const googleSubject = user?.google?.subject || null;
  const twitterSubject = user?.twitter?.subject || null;
  const discordSubject = user?.discord?.subject || null;

  const [showSignMessage, setShowSignMessage] = useState(false);
  const [showSendTransaction, setShowSendTransaction] = useState(false);

  return (
    <>
      <div className="flex flex-row mb-5">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block"
          onClick={() => {
            setShowSignMessage(true);
          }}
        >
          Sign Message
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block"
          onClick={() => {
            setShowSendTransaction(true);
          }}
        >
          Send Transaction
        </button>
      </div>

      <div className="flex flex-row justify-between">
        <button
          className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {showSignMessage && (
        <SignMessage onClose={() => setShowSignMessage(false)} />
      )}
      {showSendTransaction && (
        <SendTransaction onClose={() => setShowSendTransaction(false)} />
      )}
      <div className="mt-12 flex gap-4 flex-wrap">
        {/* Google button */}
        {googleSubject ? (
          <button
            className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
            disabled={!canRemoveAccount}
            onClick={() => {
              unlinkGoogle(googleSubject);
            }}
          >
            Unlink Google
          </button>
        ) : (
          <button
            className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
            onClick={() => {
              linkGoogle();
            }}
          >
            Link Google
          </button>
        )}

        {/* Twitter button */}
        {twitterSubject ? (
          <button
            className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
            disabled={!canRemoveAccount}
            onClick={() => {
              unlinkTwitter(twitterSubject);
            }}
          >
            Unlink Twitter
          </button>
        ) : (
          <button
            className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
            onClick={() => {
              linkTwitter();
            }}
          >
            Link Twitter
          </button>
        )}

        {/* Discord button */}
        {discordSubject ? (
          <button
            className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
            disabled={!canRemoveAccount}
            onClick={() => {
              unlinkDiscord(discordSubject);
            }}
          >
            Unlink Discord
          </button>
        ) : (
          <button
            className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
            onClick={() => {
              linkDiscord();
            }}
          >
            Link Discord
          </button>
        )}

        {/* Email button */}
        {email ? (
          <button
            className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
            disabled={!canRemoveAccount}
            onClick={() => {
              unlinkEmail(email.address);
            }}
          >
            Unlink email
          </button>
        ) : (
          <button
            className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
            onClick={linkEmail}
          >
            Connect email
          </button>
        )}

        {/* Wallet button */}
        {wallet ? (
          <button
            className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
            disabled={!canRemoveAccount}
            onClick={() => {
              unlinkWallet(wallet.address);
            }}
          >
            Unlink wallet
          </button>
        ) : (
          <button
            className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
            onClick={linkWallet}
          >
            Connect wallet
          </button>
        )}

        {/* Phone button */}
        {phone ? (
          <button
            className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
            disabled={!canRemoveAccount}
            onClick={() => {
              unlinkPhone(phone.number);
            }}
          >
            Unlink phone
          </button>
        ) : (
          <button
            className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
            onClick={linkPhone}
          >
            Connect phone
          </button>
        )}

        <button
          className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
          onClick={() => verifyToken().then(setVerifyResult)}
        >
          Verify token on server
        </button>

        {Boolean(verifyResult) && (
          <details className="w-full">
            <summary className="mt-6 font-bold uppercase text-sm text-gray-600">
              Server verify result
            </summary>
            <pre className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2">
              {JSON.stringify(verifyResult, null, 2)}
            </pre>
          </details>
        )}
      </div>


      <p className="mt-6 font-bold uppercase text-sm text-gray-600">
        User object
      </p>
      <pre className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2">
        {JSON.stringify(user, null, 2)}
      </pre>
    </>
  );
}