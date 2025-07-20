import { useAuth } from "@/hooks/auth";
import { auth } from "@/lib/firebase";
import { faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

export default function Auth() {
  const { state, user, login, logout } = useAuth(auth);
  return (<Fragment>
    {state === "logined"
      ?
      <div className="dropdown">
        <label tabIndex={0} className="btn btn-square">
          <div className="avatar">
            <div className="w-12 rounded-full">
              {(user && user.photoURL) &&
                <Image
                  alt={user.displayName ?? "User"}
                  src={user.photoURL}
                  width={200}
                  height={200}
                />}
            </div>
          </div>
        </label>
        <ul tabIndex={0} className="dropdown-content z-[1] w-52 menu p-2 shadow-xl bg-base-100 rounded-box right-0">
          <li>
            <Link href={`/user/${user?.uid}`}>
              マイページ
            </Link>
          </li>
          <li>
            <Link href={`/settings`}>
              設定
            </Link>
          </li>
          <li>
            <button onClick={() => logout()}>
              ログアウト
            </button>
          </li>
        </ul>
      </div>
      : state === "logouted" || state === "progress"
        ? <button className="btn btn-square" onClick={() => login()} disabled={state === "progress"}>
          <FontAwesomeIcon icon={faRightToBracket} className="text-2xl" />
        </button>
        : null
    }
  </Fragment>)
}
