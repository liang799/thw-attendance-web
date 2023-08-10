import { Inter } from "next/font/google";
import { useQuery } from "react-query";
import { ReactQueryKey } from "@/utils/react-query-keys";
import { ApiClient } from "@/utils/axios";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const query = useQuery(ReactQueryKey.TEST, () => ApiClient.get("/"))
  return (
    <div>{JSON.stringify(query.data)}</div>
  );
}
