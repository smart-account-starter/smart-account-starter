import { polygon, optimism, arbitrum, base } from 'wagmi/chains';
import ArbitrumIcon from "../assets/networks/arbitrum.svg";
import OptimismIcon from "../assets/networks/optimism.svg";
import PolygonIcon from "../assets/networks/polygon.svg";
import BaseIcon from "../assets/networks/base.svg";
import wethLogo from "../assets/eth.svg";
import daiLogo from "../assets/dai.png";
import usdtLogo from "../assets/usdt.png";
import wbtcLogo from "../assets/wbtc.svg";
import usdcLogo from "../assets/usdc.png";
import wldLogo from "../assets/worldcoin.svg";
// import pepeLogo from "../assets/pepe.jpeg";


export function chainNameFromId(chainId: number): string {
  switch (chainId) {
    case polygon.id:
      return 'Polygon';
    case optimism.id:
      return 'Optimism';
    case arbitrum.id:
      return 'Arbitrum';
    case base.id:
      return 'Base';
    default:
      return 'Unknown Chain';
  }
}

export function getChainIcon(chainId: number) {
  switch (chainId) {
    case 42161:
      return ArbitrumIcon;
    case 137:
      return PolygonIcon;
    case 10:
      return OptimismIcon;
    case 8453:
      return BaseIcon;
    default:
      return '';
  }
};

interface Token {
  symbol: string;
  logo: {
    src: string;
    height: number;
    width: number;
    blurDataURL: string;
    blurWidth: number;
    blurHeight: number;
  };
}

export const tokens: Token[] = [
  { symbol: "WETH", logo: wethLogo },
  { symbol: "DAI", logo: daiLogo },
  { symbol: "USDT", logo: usdtLogo },
  { symbol: "WBTC", logo: wbtcLogo },
  { symbol: "USDC", logo: usdcLogo },
  // { symbol: "PEPE", logo: pepeLogo },
  { symbol: "WLD", logo: wldLogo },
];

export const chains = [
  { id: 42161, name: "Arbitrum" },
  { id: 137, name: "Polygon" },
  { id: 10, name: "Optimism" },
  { id: 8453, name: "Base" },
];