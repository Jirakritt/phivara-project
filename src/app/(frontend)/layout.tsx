import React from 'react'

// Root layout for the public site. Loads the same fonts + base stylesheets
// every page needs (site-shell.css covers header/footer/mobile menu, which
// every page renders via SiteHeader/SiteFooter). Page-specific stylesheets
// (e.g. journal-card.css, vip-modal.css) are declared by each page.
export const metadata = {
  title: 'PHIVARA | The Art of Beaugevity',
  description: 'Hospital-grade aesthetic & longevity destination.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,500;1,600&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Prompt:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/main_gpt.css" />
        <link rel="stylesheet" href="/css/site-shell.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
