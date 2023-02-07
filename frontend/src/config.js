const BACKEND_PORT = 3001;

export const BACKEND_URL = `http://localhost:${BACKEND_PORT}/app`;
// export const BACKEND_URL = 'https://stoplight.io/mocks/scrumlegends/scrumlegends/97546259'
export const AUTH = {
  SIGNUP_URL: `${BACKEND_URL}/user/signup/`,
  LOGIN_URL: `${BACKEND_URL}/user/login/`,
  LOGOUT_URL: `${BACKEND_URL}/user/logout/`,
  ISLOGIN_URL: `${BACKEND_URL}/user/isloggedin/`,
};

export const USER = {
  DATA_URL: (userid) => {
    return userid === undefined ? `${BACKEND_URL}/user/data/` : `${BACKEND_URL}/user/data?id=${userid}`;
  },
};

export const RECIPE = {
  DATA_URL: (recipeid) => {
    return recipeid === undefined ? `${BACKEND_URL}/recipe/data/` : `${BACKEND_URL}/recipe/data?id=${recipeid}`;
  },
  LIKE: `${BACKEND_URL}/recipe/like/`,
  TRENDING: `${BACKEND_URL}/recipe/trending`,
  FEED: `${BACKEND_URL}/recipe/feed`,
  RECOMM: `${BACKEND_URL}/recipe/recommendation/`,
  MEALPLAN: `${BACKEND_URL}/recipe/mealplan/`,
};

export const COMMENT = `${BACKEND_URL}/comment/list/`;

export const COOKBOOK = {
  DATA_URL: (cookbookid) => {
    return cookbookid === undefined ? `${BACKEND_URL}/cookbook/data/` : `${BACKEND_URL}/cookbook/data?id=${cookbookid}`;
  },
  SINGLE_URL: (cookbook_id) => `${BACKEND_URL}/cookbook/single/?cid=${cookbook_id}`,
};

export const SEARCH = {
  BASIC: `${BACKEND_URL}/recipe/search/`,
  ADVANCE: `${BACKEND_URL}/recipe/advanced_search/`,
};

export const SUBSCRIBE = {
  DATA_URL: (userid) => {
    return userid === undefined ? `${BACKEND_URL}/subscribe/list/` : `${BACKEND_URL}/subscribe/list?id=${userid}`;
  },
  SUB: `${BACKEND_URL}/subscribe/list/`,
  UNSUB: `${BACKEND_URL}/subscribe/list/`,
};

export const SHOPPING = {
  RECIPE: `${BACKEND_URL}/shoppinglist/recipes/`,
  INGREDIENT: `${BACKEND_URL}/shoppinglist/ingredients/`,
};

export const RECIPE_LIST = {
  DATA_URL: (listTypes, searchQuery) => {
    return searchQuery === undefined
      ? `${BACKEND_URL}/recipe/list?list_types=${listTypes}`
      : `${BACKEND_URL}/recipe/list?list_types=${listTypes}&search_query=${searchQuery}`;
  },
};

export const USER_LOG_IN = {
  DATA_URL: `${BACKEND_URL}/user/isloggedin`,
};

export const RECIPE_LIKE = {
  DATA_URL: (rid, opinion) => {
    return `${BACKEND_URL}/recipe/like?rid=${rid}&opinion=${opinion}`;
  },
};

export const CREATE_COOKBOOK = {
  DATA_URL: `${BACKEND_URL}/cookbook/data/`,
};

export const RECIPE_RECOMMENDATION = {
  DATA_URL: (rid) => `${BACKEND_URL}/recipe/recommendation/?rid=${rid}`,
};
