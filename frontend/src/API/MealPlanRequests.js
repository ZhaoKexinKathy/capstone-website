import { RECIPE } from "../config";

export function requestGetMealPlan(dataJson) {
  const resultRequest = new Request(RECIPE.MEALPLAN, {
    method: "POST",
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
          throw Error(`${response.status} ${response.statusText} [${errorJson.message}]`);
        });
      }
    })
    .then((responseObj) => {
      return responseObj;
    })
    .catch((error) => {
      console.error("Failed to get meal plan", error);
      throw error;
    });
}
