import { SUBSCRIBE } from "../config";

export function requestSubscribeData(userid) {
  console.debug(`Fetching from ${SUBSCRIBE.DATA_URL(userid)}`);
  const resultRequest = new Request(SUBSCRIBE.DATA_URL(userid), {
    method: "GET",
    mode: "cors",
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
      console.error("Failed to fetch user data", error);
      return null;
      // throw error;
    });
}

export function requestSubscribe(dataJson) {
  const editRequest = new Request(SUBSCRIBE.SUB, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: dataJson,
  });

  return fetch(editRequest)
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
      console.error("Failed to edit profile", error);
      throw error;
    });
}

export function requestUnsubscribe(dataJson) {
  const editRequest = new Request(SUBSCRIBE.UNSUB, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: dataJson,
  });

  return fetch(editRequest)
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
      console.error("Failed to edit profile", error);
      throw error;
    });
}
