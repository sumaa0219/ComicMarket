import HumbergerIcon from "@/components/humbergerIcon"
import "./globals.css"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "C102委託管理",
  description: "C102で委託を管理するためのページ",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <div className="drawer">
          <input id="page-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <div className="navbar bg-base-100 px-4 shadow-lg">
              <div className="flex-none mr-4">
                <label htmlFor="page-drawer" className="btn btn-square btn-ghost drawer-button">
                  <HumbergerIcon />
                </label>
              </div>
              <div className="flex-1">
                <Link href="/" className="text-xl">
                  {`${metadata.title}`}
                </Link>
              </div>
              <div className="flex-none">
                <button className="btn btn-square btn-ghost">
                  <HumbergerIcon />
                </button>
              </div>
            </div>
            <div className="p-4">
              {children}
            </div>
          </div>
          <div className="drawer-side mt-16">
            <label htmlFor="page-drawer" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
              <li>
                <Link href="/" className="link">
                  サークル一覧
                </Link>
              </li>
              <li>
                <Link href="/add" className="link">
                  サークル追加
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </body>
    </html>
  )
}
