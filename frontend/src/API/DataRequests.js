import { COOKBOOK, RECIPE, USER } from "../config";

export function requestUserData(userid) {
  const resultRequest = new Request(USER.DATA_URL(userid), {
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

export function requestProfileEdit(dataJson) {
  const editRequest = new Request(USER.DATA_URL(), {
    method: "PUT",
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

export function requestUserCookbook(userid) {
  const resultRequest = new Request(COOKBOOK.DATA_URL(userid), {
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
      console.error("Failed to fetch user cookbook", error);
      return null;
      // throw error;
    });
}

export function requestTrendingRecipe() {
  const resultRequest = new Request(RECIPE.TRENDING, {
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

export function requestDeleteRecipe(dataJson) {
  console.debug("Deleting at", RECIPE.DATA_URL());
  const editRequest = new Request(RECIPE.DATA_URL(), {
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
      console.error("Failed to delete recipe", error);
      throw error;
    });
}

export function requestRemoveCookbookRecipe(dataJson) {
  const resultRequest = new Request(COOKBOOK.DATA_URL(), {
    method: "DELETE",
    mode: "cors",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: dataJson,
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
      console.error("Failed to remove recipe from cookbook", error);
      return null;
      // throw error;
    });
}
