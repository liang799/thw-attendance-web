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
  return +secureLocalStorage.getItem("userId");
}

export function setUserId(userId: number) {
  secureLocalStorage.setItem("userId", userId);
}
