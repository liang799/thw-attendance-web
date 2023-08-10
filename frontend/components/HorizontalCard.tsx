import { Card, Image, Stack, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

interface HorizontalCardProps {
  imageSrc: string;
  imageAlt: string;
  children: ReactNode; // This allows any valid React children
}

export default function HorizontalCard({ imageSrc, imageAlt, children }: HorizontalCardProps) {
  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      bg={useColorModeValue("white", "gray.700")}
      overflow="hidden"
      variant="outline"
    >
      <Image
        objectFit="cover"
        maxW={{ base: "100%", sm: "200px" }}
        src={imageSrc}
        alt={imageAlt}
      />

      <Stack>
        {children}
      </Stack>
    </Card>
  );

}
