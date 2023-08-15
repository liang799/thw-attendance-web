import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  useColorMode,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { ReactNode } from "react";
import { useRouter } from "next/router";
import { clearLocalStorage, getUserId } from "@/utils/AuthService";
import { ApiClient } from "@/utils/axios";
import { useQuery } from "react-query";

interface Props {
  children: ReactNode;
}

const NavLink = (props: Props) => {
  const { children } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700")
      }}
      href={"#"}>
      {children}
    </Box>
  );
};

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const { isLoading, data } = useQuery("repoData", () =>
    ApiClient.get(`/users/${getUserId()}`).then(res =>
      res.data
    ), {
    refetchOnWindowFocus: false
  }
  );
  const logout = () => {
    clearLocalStorage();
    router.push("/");
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.800")} px={5}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>THW</Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}>
                  <Avatar
                    size={"sm"}
                    src={"https://avatars.dicebear.com/api/male/username.svg"}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </Center>
                  <br />
                  <Center>
                    <Skeleton isLoaded={!isLoading}>
                      <p>{data && data.name ? data.name : "Unable to fetch user's name"}</p>
                    </Skeleton>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
