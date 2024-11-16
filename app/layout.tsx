import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ohtommysirishpub.com'),
  title: {
    default: "Oh Tommy's Irish Pub & Grill - Lake of the Ozarks",
    template: "%s | Oh Tommy's Irish Pub"
  },
  description: "Experience authentic Irish hospitality at Oh Tommy's Pub & Grill, the Lake of the Ozarks' finest pub & grill. Join us for great food, fine drinks, live music, and unforgettable memories.",
  applicationName: "Oh Tommy's Irish Pub",
  keywords: [
    "Oh Tommy's Irish Pub",
    "Oh Tommy's Pub & Grill",
    "Irish pub Lake of the Ozarks",
    "Lake of the Ozarks restaurant",
    "Lake of the Ozarks bar",
    "live music Lake Ozarks",
    "pub and grill Missouri",
    "Irish pub Missouri",
    "sports bar Lake of the Ozarks",
    "karaoke Lake Ozarks",
    "cornhole tournaments",
    "Roach MO restaurant",
    "Lake of the Ozarks dining",
    "Irish food Missouri",
    "pub food Lake Ozarks",
    "Chiefs games Lake of the Ozarks",
    "best bar Lake of the Ozarks",
    "live entertainment Lake Ozarks",
    "Irish pub near me",
    "Lake of the Ozarks nightlife"
  ],
  authors: [{ name: "Oh Tommy's Pub & Grill" }],
  creator: "Oh Tommy's Pub & Grill",
  publisher: "Oh Tommy's Pub & Grill",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.ohtommysirishpub.com',
    siteName: "Oh Tommy's Pub & Grill",
    title: "Oh Tommy's Pub & Grill - Lake of the Ozarks",
    description: "Experience authentic Irish hospitality at Oh Tommy's Pub & Grill, the Lake of the Ozarks' finest pub & grill. Join us for great food, fine drinks, live music, and unforgettable memories.",
    images: [
      {
        url: '/images/ohtommys-logo.png',
        width: 1200,
        height: 630,
        alt: "Oh Tommy's Pub & Grill"
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Oh Tommy's Pub & Grill - Lake of the Ozarks",
    description: "Experience authentic Irish hospitality at Oh Tommy's Pub & Grill, the Lake of the Ozarks' finest pub & grill. Join us for great food, fine drinks, live music, and unforgettable memories.",
    images: ['/images/ohtommys-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'add-your-google-site-verification-here',
  },
  alternates: {
    canonical: 'https://www.ohtommysirishpub.com',
  },
  category: 'restaurant',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/android-chrome-192x192.png', sizes: '192x192' },
      { url: '/android-chrome-512x512.png', sizes: '512x512' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#E4A853'
      }
    ],
  },
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
