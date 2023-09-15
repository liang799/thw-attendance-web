import { Card, Stack, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

interface HorizontalCardProps {
  children: ReactNode; // This allows any valid React children
}

export default function HorizontalCard({ children }: HorizontalCardProps) {
  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      bg={useColorModeValue("white", "gray.700")}
      overflow="hidden"
      variant="outline"
    >
      <Stack>
        {children}
      </Stack>
    </Card>
  );

}
