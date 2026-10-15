import { Center, ChakraProvider, Spinner } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { AppProps } from "next/app";
import { wrapper } from "@/lib/store";
import { useEffect, useState } from 'react';

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  const [sessionReady, setSessionReady] = useState(false);
  // Resolve browser-only credentials and guest mode before mounting queries.
  useEffect(() => setSessionReady(true), []);
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        {sessionReady ? <Component {...pageProps} /> : (
          <Center minH="100vh"><Spinner label="Loading attendance tracker" color="teal.500" /></Center>
        )}
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default wrapper.withRedux(App);
