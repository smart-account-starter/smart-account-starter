import { Button } from "@mui/material";
import { useAuthModal } from "../../providers/AuthModalProvider";
import { useAccount, useDisconnect } from "wagmi";

export function ConnectButton() {
  const { openModal } = useAuthModal();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <Button
      onClick={isConnected ? () => disconnect() : openModal}
      variant="contained"
      sx={{ textTransform: 'none' }}
    >
      {isConnected ? "Disconnect" : "Connect"}
    </Button>
  );
}
