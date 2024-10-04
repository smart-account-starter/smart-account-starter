import React from "react";
import { Button } from "@repo/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@repo/ui/card"
import Link from 'next/link'
import { cardData, propWalletData, demoData, accountAbstractionProviders } from './content/cardData'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faExchangeAlt, faCode } from "@fortawesome/free-solid-svg-icons";
import { Header } from "@repo/ui/src/smart-account-starter/header";
import AccountDeployer from "./components/AccountDeployer";

const CardItem = ({ card }: { card: any }) => {
  return (
    <div className="bg-slate-100 dark:bg-[#1E2735] rounded-[20px] relative p-6 pt-12 lg:p-12 ml-6 h-full">
      <h4 className="text-2xl font-bold mb-4">{card.title}</h4>
      <p className="opacity-70 mb-4">{card.description}</p>
      <Link href={card.link} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block">
        {card.linkText}
      </Link>
    </div>
  );
};

export default function Home(): JSX.Element {
  const renderCards = (cards: typeof cardData): JSX.Element => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <CardItem key={index} card={card} />
      ))}
    </div>
  );

  return (
    <div className="container mx-auto">
      <div className="p-4">
        <AccountDeployer />
        {/* <h1 className="text-3xl font-bold mt-12 mb-6">WaaS (Wallet-as-a-Service)</h1>
        <p>When you set out to build a smart account or a smart wallet, it can be confusing with the array of options you have, partly because the terms are loosely defined. These services have collectively raised tens of millions of dollars in funding to build smart wallet solutions.</p> */}
        
        <div id="wallets" className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Wallet-as-a-Service (WaaS) Options</h2>
          {renderCards(cardData)}
        </div>

        <div id="accounts" className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Smart Accounts & Account Abstraction</h2>
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
  )
}
