import CircleSelector from "@/components/circleSelector";
import Layout from "@/components/layout";
import { getAllCircles } from "@/lib/db";
import { NextPageContext } from "next";
import { useState } from "react";

interface circleSelectProps {
  circles: CircleWithID[]
}

CircleSelect.getInitialProps = async (ctx: NextPageContext): Promise<circleSelectProps> => {
  const circles = await getAllCircles()
  return {
    circles
  }
}

export default function CircleSelect(props: circleSelectProps) {
  const [c, setC] = useState<CircleWithID|null>(null)
  return (
    <Layout>
      <CircleSelector circles={props.circles} />
    </Layout>
  )
}