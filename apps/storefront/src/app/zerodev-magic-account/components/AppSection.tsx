import { useState } from "react";
import aaveLogo from "../assets/aave-logo.png";
import uniswapLogo from "../assets/uniswap-logo.png";
import Swap from "./uniswap/Swap";
import AAVE from "./aave/AAVE";

const tabs = [
  { name: "AAVE", icon: aaveLogo.src, current: true },
  { name: "Uniswap", icon: uniswapLogo.src, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function AppSection() {
  const [currentTab, setCurrentTab] = useState("AAVE");

  return (
    <div className="flex-grow w-full">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          value={currentTab}
          onChange={(e) => setCurrentTab(e.target.value)}
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setCurrentTab(tab.name)}
                className={classNames(
                  tab.name === currentTab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium"
                )}
              >
                <img
                  src={tab.icon}
                  alt={`${tab.name} icon`}
                  className={classNames(
                    tab.name === currentTab
                      ? "text-indigo-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "-ml-0.5 mr-2 h-5 w-5"
                  )}
                />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="mt-4">
        {currentTab === "AAVE" && <AAVE />}
        {currentTab === "Uniswap" && <Swap />}
      </div>
    </div>
  );
}

export default AppSection;
