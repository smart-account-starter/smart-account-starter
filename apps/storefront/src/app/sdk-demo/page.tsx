import DemoComponent from "./DemoComponent"

export default function ZeroDev() {
  return (
    <main className="min-h-screen bg-black">
      <h1>SDK Demo</h1>
      <div className="p-2 flex flex-col w-[40vw] mx-auto">
        {/* logged in */}
        <DemoComponent />

      </div>
    </main>
  )
}
