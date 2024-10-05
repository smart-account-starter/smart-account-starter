import React, { Suspense } from "react"
import Link from "next/link"
import {
  cardData,
  propWalletData,
  demoData,
  accountAbstractionProviders,
} from "./content/cardData"
const AccountDeployer = React.lazy(() => import("./components/AccountDeployer"))

const CardItem = ({ card }: { card: any }) => {
  return (
    <div className="bg-slate-100 dark:bg-[#1E2735] rounded-[20px] relative p-6 pt-12 lg:p-12 ml-6 h-full">
      <h4 className="text-2xl font-bold mb-4">{card.title}</h4>
      <p className="opacity-70 mb-4">{card.description}</p>
      <Link
        href={card.link}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block"
      >
        {card.linkText}
      </Link>
    </div>
  )
}

export default function Home(): JSX.Element {
  const renderCards = (cards: typeof cardData): JSX.Element => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <CardItem key={index} card={card} />
      ))}
    </div>
  )

  return (
    <div className="container mx-auto">
      <div className="p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <AccountDeployer />
        </Suspense>{" "}
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
  )
}
