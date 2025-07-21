import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Pretty Browser View - Desktop Browser UI",
  description:
    "A draggable, resizable browser window simulation built with React. Supports localhost URLs, fullscreen toggle, and glass morphism UI within a desktop-style layout.",
  metadataBase: new URL("https://pretty-browser-view.vercel.app"),
  keywords: [
    "browser UI",
    "desktop simulation",
    "draggable window",
    "resizable window",
    "glass morphism",
    "react iframe viewer",
    "floating browser",
    "localhost preview",
    "tailwindcss",
    "modern UI"
  ],
  authors: [{ name: "Shaikh Rumman Fardeen", url: "https://github.com/srummanf" }],
  creator: "Shaikh Rumman Fardeen",
  publisher: "Shaikh Rumman Fardeen",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico"
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pretty-browser-view.vercel.app",
    siteName: "Desktop Browser UI",
    title: "Desktop Browser UI - Draggable and Resizable Browser Simulation",
    description:
      "An interactive browser window with support for live URL preview, localhost support, fullscreen toggle, and floating glass morphism UI.",
    images: [
      {
        url: "/metaimg.png",
        width: 1200,
        height: 630,
        alt: "Desktop Browser UI Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Desktop Browser UI - Resizable Draggable Web Preview",
    description:
      "Build immersive browser simulations using React and TailwindCSS. Supports draggable layout, full-screen mode, and localhost previews.",
    images: ["/metaimg.png"],
    creator: "@srummanf"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
