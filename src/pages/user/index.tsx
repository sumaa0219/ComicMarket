import Layout from "@/components/layout";
import { getAllUsers } from "@/lib/db";
import { UserdataWithID } from "@/lib/types";
import { NextPageContext } from "next";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { For } from "million/react";

User.getInitialProps = async (ctx: NextPageContext): Promise<UserProps> => {
  return {
    users: await getAllUsers(),
  }
}

interface UserProps {
  users: UserdataWithID[];
}
export default function User(props: UserProps) {
  return (<Layout>
    <Head>
      <title>ユーザー一覧</title>
    </Head>
    <div className="text-2xl">
      ユーザー一覧
    </div>
    <div className="overflow-x-auto">
      <table className="table w-96">
        <thead>
          <tr>
            <th></th>
            <th>ユーザー名</th>
          </tr>
        </thead>
        <tbody>
          {
            props.users.length === 0
              ? <tr>
                <td>
                  データなし
                </td>
              </tr>
              : props.users.map((user, i) => (
                <tr key={i}>
                  <td className="avatar w-16 mr-0 rounded-full">
                    {user.photoURL &&
                      <Image
                        src={user.photoURL}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    }
                  </td>
                  <td className="ml-0">
                    <Link href={`/user/${user.id}`}>
                      {user.name}
                    </Link>
                  </td>
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  </Layout>)
}
