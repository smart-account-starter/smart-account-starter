import { useState, useMemo } from "react";
import { useConnect } from "wagmi";
import GoogleIcon from "./GoogleIcon";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PasskeyLogin from "./PasskeyLogin";
import BrowserWalletIcon from "./BrowserWalletIcon";
import { Button, styled } from "@mui/material";

const StyledButton = styled(Button)({
  width: "100%",
  justifyContent: "flex-start",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  textTransform: "none",
  fontWeight: 500,
  fontSize: "16px",
  color: "#202124",
  backgroundColor: "#fff",
  "&:hover": {
    backgroundColor: "#f8f9fa",
  },
  marginBottom: "10px",
  "& .MuiButton-startIcon": {
    marginRight: "12px",
  },
});

function CustomButton({
  icon,
  text,
  onClick,
  disabled,
}:
{
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <StyledButton
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      startIcon={icon}
    >
      {text}
    </StyledButton>
  );
}

export default function LoginOptions() {
  const [showPasskeyLogin, setShowPasskeyLogin] = useState(false);
  const { connectors, connectAsync, isPending } = useConnect();
  const [loadingType, setLoadingType] = useState<
    "google" | "passkey" | "browser"
  >();

  const injectedConnector = useMemo(
    () => connectors.find((connector) => connector.name === "Injected"),
    [connectors]
  );

  const googleConnector = useMemo(
    () => connectors.find((connector) => connector.name === "Google"),
    [connectors]
  );

  const handleGoogleLogin = async () => {
    try {
      if (googleConnector) {
        setLoadingType("google");
        await connectAsync({ connector: googleConnector });
      } else {
        console.error("Google connector not found");
      }
    } catch (error) {
      console.error("Error connecting with Google:", error);
      setLoadingType(undefined);
    }
  };

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {!showPasskeyLogin && (
        <div className="w-full flex flex-col">
          <CustomButton
            icon={<FingerprintIcon />}
            text="Sign in with Passkey"
            onClick={() => {
              setShowPasskeyLogin(true);
            }}
            disabled={isPending}
          />
          <CustomButton
            icon={<GoogleIcon />}
            text={
              loadingType === "google" ? "Connecting..." : "Connect with Google"
            }
            onClick={handleGoogleLogin}
            disabled={isPending}
          />
          {injectedConnector && (
            <CustomButton
              icon={<BrowserWalletIcon />}
              text={
                loadingType === "browser"
                  ? "Connecting..."
                  : "Connect with Browser Wallet"
              }
              onClick={async () => {
                setLoadingType("browser");
                try {
                  await connectAsync({
                    connector: injectedConnector,
                  });
                } catch (error) {
                  console.error("Error connecting with Browser Wallet:", error);
                  setLoadingType(undefined);
                }
              }}
              disabled={isPending}
            />
          )}
        </div>
      )}
      {showPasskeyLogin && <PasskeyLogin />}
    </div>
  );
}
