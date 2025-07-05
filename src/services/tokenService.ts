import { BASE_URL } from "../utils/constants";
import { getRefreshToken, storeToken } from "../utils/tokenStorage";


const tryRefreshToken = async () :Promise<boolean> =>  {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const response = await fetch(BASE_URL + "user/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) return false;

  const data = await response.json();
  if (data?.access) {
    storeToken(data?.access);
    return true;
  }

  return false;
}

export default tryRefreshToken;
