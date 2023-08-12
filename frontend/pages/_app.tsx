import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { AppProps } from "next/app";
import { DevSupport } from "@react-buddy/ide-toolbox-next";
import { ComponentPreviews, useInitial } from "@/components/dev";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <DevSupport ComponentPreviews={ComponentPreviews}
                    useInitialHook={useInitial}
        >
          <Component {...pageProps} />
        </DevSupport>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
