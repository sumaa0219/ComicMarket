import Layout from "@/components/layout";

export default function NotFound() {
  return <Layout center>
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-4xl font-bold">404</div>
      <div className="text-2xl">Not Found</div>
    </div>
  </Layout>
}
