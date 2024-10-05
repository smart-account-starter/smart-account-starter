import { useState } from "react";
import Button from "@mui/material/Button";
import { usePasskey } from "@zerodev/magic-account";

export default function PasskeyLogin() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { connectRegister, connectLogin } = usePasskey();

  const handleLogin = async (type: "LOGIN" | "REGISTER") => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    try {
      if (type === "LOGIN") {
        await connectLogin("Smart Account Starter Magic Account");
      } else {
        await connectRegister("Smart Account Starter Magic Account");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* <TextField
        id="username"
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={isLoggingIn}
        size="small"
      /> */}
      <Button
        onClick={() => handleLogin("REGISTER")}
        disabled={isLoggingIn}
        variant="contained"
      >
        Create Wallet
      </Button>
      <Button onClick={() => handleLogin("LOGIN")} disabled={isLoggingIn}>
        I already have a wallet
      </Button>
    </div>
  );
}
