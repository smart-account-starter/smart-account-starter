import browserWalletIcon from '../../assets/browserWallet.svg';

interface BrowserWalletIconProps {
  width?: number;
  height?: number;
}

const BrowserWalletIcon: React.FC<BrowserWalletIconProps> = ({ width = 24, height = 24 }) => {
  return (
    <img 
      src={browserWalletIcon} 
      alt="Browser Wallet Icon" 
      width={width} 
      height={height}
    />
  );
};

export default BrowserWalletIcon;