import Link from "next/link";
import { HTMLAttributes } from "react";
import HumbergerIcon from "./HumbergerIcon";
import Auth from "./auth";

interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** ページタイトル */
  title?: string;
}
interface MenuItem {
  /** メニュー名 */
  title: string;
  /** メニューのリンク先 */
  href: string;
}

export default function Layout(props: LayoutProps) {
  const menuItems: MenuItem[] = [
    {
      title: "サークル一覧",
      href: "/circle/list"
    },
    {
      title: "購入物一覧",
      href: "/item/list"
    },
    {
      title: "サークル追加",
      href: "/circle/add"
    },
    {
      title: "購入物追加",
      href: "/item/add"
    }
  ]
  return (
    <div className="drawer">
      <input id="page-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="navbar bg-base-100 px-4 shadow-lg sticky top-0">
          <div className="flex-none mr-4">
            <label htmlFor="page-drawer" className="btn btn-square btn-ghost drawer-button">
              <HumbergerIcon />
            </label>
          </div>
          <div className="flex-1">
            <Link href="/" className="text-xl">
              {props.title ?? "C102委託管理"}
            </Link>
          </div>
          <div className="flex-none">
            <Auth />
          </div>
        </div>
        <div className="p-4 block">
          {props.children}
        </div>
      </div>
      <div className="drawer-side mt-16">
        <label htmlFor="page-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
          {
            menuItems.map((item, index) => (
              <li key={`${index}-${item.title}`}>
                <Link href={item.href} className="link">
                  {item.title}
                </Link>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}
