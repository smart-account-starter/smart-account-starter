"use client"
import * as React from "react"

export function Header(props: React.PropsWithChildren) {
  const scrollToSection = (sectionId: string) => (event: React.MouseEvent) => {
    event.preventDefault()

    const section = document.getElementById(sectionId)
    if (window.location.pathname !== "/") {
      window.location.href = `/`
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
      }
      return
    }
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div>
      <header
        className="light pt-12 pb-12 md:py-36 text-white"
        style={{
          backgroundImage: "linear-gradient(145deg, #9013fe 0%, #101a8e 100%)",
        }}
      >
        {props.children}
        <div className="container px-4 relative">
          <div className="grid grid-cols-12">
            <div className="col-span-12 text-center">
              <h2 className="text-3xl leading-tight md:text-[70px] md:leading-tight font-bold mb-6">
                <span className="block sm:inline">Welcome to the</span>
                <br className="hidden sm:block" />
                <span className="block sm:inline">Smart Account Starter</span>
              </h2>
              <p className="text-[22px] leading-normal opacity-80 px-12 md:px-44 lg:px-64">
                Your toolkit for integrating wallets and smart account
                solutions.
              </p>

              <div className="flex items-center justify-center mt-12">
                <button
                  onClick={scrollToSection("wallets")}
                  className="bg-white text-purple-800 font-bold py-3 px-6 rounded-full shadow m-2 hover:bg-purple-100 transition duration-300"
                >
                  Wallets
                </button>
                <button
                  onClick={scrollToSection("accounts")}
                  className="bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow m-2 hover:bg-purple-800 transition duration-300"
                >
                  Accounts
                </button>
              </div>
              <p className="mt-6 text-sm">
                * No registration required to explore options
              </p>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
