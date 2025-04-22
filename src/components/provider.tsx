"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Navbar } from "./navbar";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {
        <div>
          <Navbar />
          {children}
        </div>
      }
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
