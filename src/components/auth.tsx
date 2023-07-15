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
    {/* {state} */}
    {state === "logined"
      ?
      <div className="flex flex-row">
        <Link href="/dashboard" passHref>
          <button className="btn btn-square">
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
          </button>
        </Link>
        <button className="btn btn-square" onClick={() => logout()}>
          <FontAwesomeIcon icon={faRightFromBracket} className="text-2xl" />
        </button>
      </div>
      : state === "logouted" || state === "progress"
        ? <button className="btn btn-square" onClick={() => login()} disabled={state === "progress"}>
          <FontAwesomeIcon icon={faRightToBracket} className="text-2xl" />
        </button>
        : null
    }
  </Fragment>)
}