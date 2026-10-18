import { Instrument_Sans } from 'next/font/google';
import { ThemeProvider } from "next-themes"
import { SettingsProvider } from '@/hooks/use-settings';
import { Toaster } from "@/components/ui/sonner"
import ScreenTooSmall from "@/components/visualizer/screen-too-small"
import "./globals.css"

const instrumentSans = Instrument_Sans({
    subsets: ['latin'],
    variable: '--font-instrument-sans',
});

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" suppressHydrationWarning className={instrumentSans.className}>
      <body>
        <ThemeProvider attribute="class" forcedTheme="dark">
          <div className="md:hidden flex flex-col h-screen w-screen background-gradient overflow-hidden overflow-y-auto relative">
            <ScreenTooSmall />
          </div>
          <div className="hidden md:flex flex-col h-screen w-screen bg-background overflow-hidden overflow-y-auto relative">
            <SettingsProvider>
              {children}
            </SettingsProvider>
          </div>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}