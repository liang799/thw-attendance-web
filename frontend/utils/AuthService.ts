import secureLocalStorage from "react-secure-storage";

export function getAccessToken(): string {
  return `${secureLocalStorage.getItem("token")}`;
}

export function setAccessToken(token: string) {
  secureLocalStorage.setItem("token", token);
}

export function logout() {
  secureLocalStorage.clear();
}

export function getUserId(): number {
  const userIdString = secureLocalStorage.getItem("userId");
  if (!userIdString) throw new Error("Cannot get User Id")
  return +userIdString;
}

export function setUserId(userId: number) {
  secureLocalStorage.setItem("userId", userId);
}
