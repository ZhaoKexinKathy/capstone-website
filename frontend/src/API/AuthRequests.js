import { AUTH } from "../config";

export function requestIsLogin() {
  return commonApi(AUTH.ISLOGIN_URL);
}

export function commonApi(url, method = "GET", data = undefined) {
  const resultRequest = new Request(url, {
    method,
    credentials: "include",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });

  return fetch(resultRequest)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((errorJson) => {
          throw Error(`${response.status} ${response.statusText} [${errorJson.error}]`);
        });
      }
    })
    .then((responseObj) => {
      return responseObj;
    })
    .catch((error) => {
      console.error("Failed to fetch data", error);
      return null;
      // throw error;
    });
}

export function requestLogout() {
  const resultRequest = new Request(AUTH.LOGOUT_URL, {
    method: "POST",
    mode: "cors", // no-cors
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: undefined,
  });
  return fetch(resultRequest)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((errorJson) => {
          throw Error(`${response.status} ${response.statusText} [${errorJson.error}]`);
        });
      }
    })
    .then((responseObj) => {
      return responseObj;
    })
    .catch((error) => {
      console.error("function logout failed", error);
      return null;
      // throw error;
    });
}
