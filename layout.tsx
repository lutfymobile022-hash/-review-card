import './globals.css'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Kelola Kartu Review', description: 'Aktivasi dan kelola kartu review digital.' }
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body>{children}</body></html>}
