import dynamic from 'next/dynamic'

const ClientSideMagicDemo = dynamic(() => import('./components/ClientSideMagicDemo'), { ssr: false })

export default function MagicDemoPage() {
  return (
    <main className="min-h-screen bg-black">
      <h1>Chain-Abstracted Magic Account</h1>
      <ClientSideMagicDemo />
    </main>
  )
}