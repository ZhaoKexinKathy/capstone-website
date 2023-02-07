import { SHOPPING } from "../config";

export function requestGetShopping() {
  const resultRequest = new Request(SHOPPING.RECIPE, {
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
      console.error("Failed to fetch shopping list", error);
      return null;
      // throw error;
    });
}

export function requestGetAggShopping() {
  const resultRequest = new Request(SHOPPING.INGREDIENT, {
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
      console.error("Failed to fetch aggregated shopping list", error);
      return null;
      // throw error;
    });
}

export function requestDeleteShopping() {
  const editRequest = new Request(SHOPPING.RECIPE, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: undefined,
  });

  return fetch(editRequest)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((errorJson) => {
          throw Error(`${response.status} ${response.statusText} [${errorJson.message}]`);
        });
      }
    })
    .then((responseObj) => {
      return responseObj;
    })
    .catch((error) => {
      console.error("Failed to delete shopping list", error);
      throw error;
    });
}

export function requestUpdateShoppingRecipe(dataJson) {
  const editRequest = new Request(SHOPPING.RECIPE, {
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
      console.error("Failed to update shopping list", error);
      throw error;
    });
}

export function requestAddIngredient(dataJson) {
  const editRequest = new Request(SHOPPING.INGREDIENT, {
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
      console.error("Failed to create shopping list", error);
      throw error;
    });
}

export function requestDeleteShoppingIngredient(dataJson) {
  const editRequest = new Request(SHOPPING.INGREDIENT, {
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
      console.error("Failed to delete shopping ingredient", error);
      throw error;
    });
}
