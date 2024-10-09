"use client"
import { DynamicEmbeddedWidget } from "@dynamic-labs/sdk-react-core"
import { useEffect } from "react"

function App() {
  useEffect(() => {
    // Automatically click the Dynamic Widget button on page load
    const dynamicButton = document.querySelector(
      ".dynamic-widget-button"
    ) as HTMLButtonElement
    if (dynamicButton) {
      dynamicButton.click()
    }
  }, [])

  return (
    <div className="w-1/2 mx-auto">
      <DynamicEmbeddedWidget style={{ minHeight: 500 }} />
    </div>
  )
}

export default App
