import React from "react";
import {
  cardData,
  propWalletData,
  demoData,
  accountAbstractionProviders,
} from "./content/cardData";
import CardItem from "./components/CardItem";


export default function Home(): JSX.Element {
  const renderCards = (cards: typeof cardData): JSX.Element => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {cards.map((card, index) => (
        <CardItem key={index} card={card} />
      ))}
    </div>
  );

  return (
    <div className="md:container mx-auto">
      <div className="p-4">
        <div id="wallets" className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Wallet-as-a-Service (WaaS) Options
          </h2>
          {renderCards(cardData)}
        </div>
        <div id="accounts" className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Smart Accounts & Account Abstraction
          </h2>
          {renderCards(accountAbstractionProviders)}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Demo Data</h2>
          {renderCards(demoData)}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Exchange Wallets</h2>
          {renderCards(propWalletData)}
        </div>
      </div>
    </div>
  );
}
