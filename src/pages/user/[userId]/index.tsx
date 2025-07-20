import TrashIcon from "@/components/TrashIcon";
import CircleFilterForm from "@/components/circleFilterForm";
import Layout from "@/components/layout";
import Priority from "@/components/priority";
import {
  getAllCircles,
  getAllItems,
  getUser,
  removeBuyer,
  updatePriority,
} from "@/lib/db";
import { CircleWithID, ItemWithID, UserdataWithID } from "@/lib/types";
import {
  circleToDatePlaceString,
  filterDeletedCircleItem,
  sortItemByDP,
  sortItemByPriority
} from "@/lib/utils";
import { NextPageContext } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserProps {
  circles: CircleWithID[];
  user: UserdataWithID;
  items: ItemWithID[];
}

User.getInitialProps = async (ctx: NextPageContext): Promise<UserProps> => {
  const { userId } = ctx.query as { userId: string };
  /**
   * このユーザーが購入した購入物のみを取得する
   */
  // const items: ItemWithID[] = (await getAllItems()).filter(item => item.users.find(u => u.uid === userId))
  const [
    allCircles,
    allItems,
    user
  ] = await Promise.all([
    getAllCircles(),
    getAllItems(),
    getUser(userId),
  ] as const);

  const itemsWitchUserBuy = allItems
    .filter((i) => filterDeletedCircleItem(i, allCircles))
    .filter((item) => item.users.find((u) => u.uid === user.id));

  return {
    circles: allCircles,
    user,
    items: itemsWitchUserBuy,
  };
};

export default function User(props: UserProps) {
  const [processing, setProcessing] = useState(false);
  const initialItems = props.items
    // .filter((i) => filterDeletedCircleItem(i, props.circles))
    // .filter((item) => item.users.find((u) => u.uid === props.user.id));

  const [sortKey, setSortKey] = useState<"DP" | "priority-u" | "priority-d">(
    "DP"
  );
  const sortedItems = sortItemByDP(initialItems, props.circles);
  const [items, setItems] = useState<ItemWithID[]>(sortedItems);
  const [sending, setSending] = useState(false);

  const [selectedItems, setSelectedItems] = useState<ItemWithID[]>([]);

  useEffect(() => {
    console.log("sortKey", sortKey);
    setItems((i) =>
      sortKey === "DP"
        ? sortItemByDP(i, props.circles)
        : sortItemByPriority(i, props.user.id, sortKey === "priority-u")
    );
  }, [props.circles, props.user.id, sortKey]);

  return (
    <Layout title="ユーザー詳細">
      <Head>
        <title>{`${props.user.name} | ユーザー詳細`}</title>
      </Head>
      <div className="flex flex-row">
        <div className="avatar">
          <div className="w-24 rounded-xl">
            <Image
              className="rounded-xl"
              src={props.user.photoURL!}
              alt={props.user.name}
              width={200}
              height={200}
            />
          </div>
        </div>

        <div className="flex flex-col min-h-full">
          <div className="text-2xl my-auto ml-4">{props.user.name}</div>
        </div>
      </div>

      <div className="mt-12 flex-col">
        <div className="">
          合計金額 :{" "}
          {items
            .map((item) => {
              const { price } = item;
              const count = item.users.find(
                (user) => user.uid === props.user.id
              )?.count;
              return Number(price) * Number(count ?? 0);
            })
            .reduce((a, b) => a + b, 0)
            .toLocaleString()}
          円
        </div>

        <div className="">
          絞り込み中合計{"("}{selectedItems.length}件{")"} : {selectedItems.map(item => item.price * (item.users.find(u => u.uid === props.user.id)?.count ?? 0)).reduce((a, b) => a + b, 0).toLocaleString()}円
        </div>
      </div>

      <div className="mt-12">購入物一覧 ({items.length}件)</div>

      <CircleFilterForm
        circles={props.circles}
        onChange={(_circle) => {
          const circleIDs = _circle.map((c) => c.id);
          const newItems = initialItems.filter((i) =>
            circleIDs.includes(i.circleId)
          );
          setItems(newItems);
        }}
      />

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>購入金額絞り込み</th>
              <th>サークル</th>
              <th
                className="btn btn-sm"
                onClick={() => {
                  setSortKey("DP");
                }}
              >
                場所
              </th>
              <th>購入物</th>
              <th
                className="btn btn-sm"
                onClick={() => {
                  setSortKey((prev) =>
                    prev === "priority-u" ? "priority-d" : "priority-u"
                  );
                }}
              >
                優先度
              </th>
              <th>個数</th>
              <th>単価</th>
              <th>小計</th>
              {/* <th>購入者ID</th> */}
              <th>削除</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td>データなし</td>
              </tr>
            ) : (
              items.map((item, i) =>
                item.users.map((user, j) =>
                  user.uid == props.user.id ? (
                    <tr key={`${i}-${j}`}>
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-lg"
                          aria-label="選択して金額絞り込み"
                          onChange={e => {
                            console.log(e.target.checked);
                            if (e.target.checked) {
                              setSelectedItems(prev => [...prev, item]);
                            } else {
                              setSelectedItems(prev => prev.filter(i => i.id !== item.id));
                            }
                          }}
                        />
                      </td>
                      <td>
                        <Link href={`/circle/${item.circleId}`}>
                          {((): string => {
                            const circle = props.circles.find(
                              (c) => c.id === item.circleId
                            );
                            if (circle) {
                              let circleName = circle.name;
                              if (circle.deleted) {
                                circleName += "(削除済み)";
                              }
                              return circleName;
                            } else {
                              return "サークルが見つかりません";
                            }
                          })()}
                        </Link>
                      </td>
                      <td>
                        {circleToDatePlaceString(
                          props.circles.find((c) => c.id === item.circleId)!
                        )}
                      </td>
                      <td>
                        <Link href={`/item/${item.id}`}>{item.name}</Link>
                      </td>
                      <td>
                        <Priority
                          priority={user.priority}
                          onChange={async (priority) => {
                            setSending(true);
                            await updatePriority(item.id, user.uid, priority);
                            setItems((prevItems) => {
                              prevItems[i].users[j].priority = priority;
                              return prevItems;
                            });
                            setSending(false);
                          }}
                          name={`item-${i}_user-${j}`}
                        />
                      </td>
                      <td>{user.count}</td>
                      <td>{Number(item.price).toLocaleString()}</td>
                      <td>
                        {(
                          Number(item.price) * Number(user.count)
                        ).toLocaleString()}
                      </td>
                      {/* <td>{user.uid}</td> */}
                      <td>
                        <button
                          title="Delete"
                          type="button"
                          className="btn btn-outline btn-sm btn-square btn-ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            setProcessing(true);
                            removeBuyer(item.id, user.uid).then(() => {
                              setProcessing(false);
                              setItems((prev) =>
                                prev.map((p) =>
                                  p.id === item.id
                                    ? {
                                        ...p,
                                        users: p.users.filter(
                                          (u) => u.uid !== user.uid
                                        ),
                                      }
                                    : p
                                )
                              );
                            });
                          }}
                          disabled={processing}
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ) : null
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
