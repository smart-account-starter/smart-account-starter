import React from "react";
import Modal from "../Modal";
import { tokens } from "../../utils/utils";
import Tooltip from "@mui/material/Tooltip";
import ChainSelect from "../ChainSelect";

interface TokenSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (token: string, chainId: number) => void;
  selectedChainId: number;
}

const TokenSelectModal: React.FC<TokenSelectModalProps> = ({
  open,
  onClose,
  onSelect,
  selectedChainId,
}) => {
  const [currentChainId, setCurrentChainId] = React.useState(selectedChainId);

  return (
    <Modal open={open} handleClose={onClose} showPoweredBy={false}>
      <h2 className="text-xl font-semibold mb-4">Select a token and chain</h2>
      <ChainSelect
        selectedChainId={currentChainId}
        onChainSelect={setCurrentChainId}
        className="w-full mb-4"
        excludeBase={true}
      />
      <div className="grid grid-cols-2 gap-4">
        {tokens
          .filter((token) => token.symbol !== "USDC")
          .map((token) => {
            const isWLDDisabled =
              token.symbol === "WLD" && currentChainId !== 10;

            if (isWLDDisabled) return null;

            return (
              <Tooltip key={token.symbol} title="" arrow>
                <div>
                  <button
                    className="flex items-center justify-start p-3 rounded-xl transition-colors w-full bg-gray-100 hover:bg-gray-200"
                    onClick={() => {
                      onSelect(token.symbol, currentChainId);
                      onClose();
                    }}
                  >
                    <img
                      src={token.logo}
                      alt={token.symbol}
                      className="w-8 h-8 mr-3 rounded-full"
                    />
                    <span className="font-medium">{token.symbol}</span>
                  </button>
                </div>
              </Tooltip>
            );
          })}
      </div>
    </Modal>
  );
};

export default TokenSelectModal;
