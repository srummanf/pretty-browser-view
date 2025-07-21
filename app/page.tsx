"use client"

import React from "react"

import { useState, useRef, useCallback } from "react"
import { Upload, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import html2canvas from "html2canvas"

const backgrounds = [
  { id: 1, src: "/backgrounds/background-1.jpg", name: "Tropical Sunset" },
  { id: 2, src: "/backgrounds/background-2.jpg", name: "Ocean View" },
  { id: 3, src: "/backgrounds/background-3.png", name: "Mountain Peak" },
  { id: 4, src: "/backgrounds/background-4.png", name: "Forest Path" },
  { id: 5, src: "/backgrounds/background-5.png", name: "City Lights" },
  { id: 6, src: "/backgrounds/background-6.png", name: "Desert Dunes" },
]

export default function MacBrowserComposer() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [urlText, setUrlText] = useState("http://localhost:3000")
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0])
  const [isGenerating, setIsGenerating] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile()
            if (file) {
              handleImageUpload(file)
            }
          }
        }
      }
    },
    [handleImageUpload],
  )

  const handleSaveComposite = async () => {
    if (!previewRef.current) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      })

      const link = document.createElement("a")
      link.download = "browser-composite.png"
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error("Error generating composite:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Add paste event listener
  React.useEffect(() => {
    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [handlePaste])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-[100rem] mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mac Browser Composer</h1>
          <p className="text-gray-600">Create beautiful browser mockups with custom backgrounds</p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
              <div className="space-y-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600"
                  variant="outline"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-5 w-5 mb-2" />
                    <p>Click to upload or paste image (Ctrl+V)</p>
                  </div>
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                {uploadedImage && (
                  <div className="mt-4">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* URL Bar */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">URL Bar Text</h2>
              <Input
                value={urlText}
                onChange={(e) => setUrlText(e.target.value)}
                placeholder="Enter URL text..."
                className="w-full"
              />
            </div>

            {/* Background Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Select Background</h2>
              <div className="grid grid-cols-2 gap-3">
                {backgrounds.map((bg) => (
                  <div
                    key={bg.id}
                    onClick={() => setSelectedBackground(bg)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedBackground.id === bg.id
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={bg.src || "/placeholder.svg"} alt={bg.name} className="w-full h-20 object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                      {bg.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveComposite}
              disabled={!uploadedImage || isGenerating}
              className="w-full h-12 text-lg"
            >
              <Download className="mr-2 h-7 w-7" />
              {isGenerating ? "Generating..." : "Save Composite"}
            </Button>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div
              ref={previewRef}
              className="relative w-full aspect-[4/3] rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${selectedBackground.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Mac Browser Window */}
              <div className="absolute inset-4 bg-gray-900 rounded-md shadow-2xl overflow-hidden flex flex-col">
                {/* Browser Header */}
                <div className="bg-gray-800 px-4 py-3 flex items-center space-x-3">
                  {/* Traffic Lights */}
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>

                  {/* URL Bar */}
                  <div className="flex-1 bg-gray-700 rounded-md px-3 py-1 text-sm text-gray-300 flex items-center min-w-0">
                    <div className="w-4 h-4 bg-gray-600 rounded mr-2 flex-shrink-0"></div>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ minWidth: "200px" }}>
                      {urlText}
                    </span>
                  </div>
                </div>

                {/* Browser Content */}
                <div className="bg-gray-900 flex-1 relative overflow-hidden">
                  {uploadedImage ? (
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Browser content"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-full h-full bg-white flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                        <p>Upload an image to see preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
