import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ScrollToTop from "./component/ScrollTop";
import CookbookName from "./page/CookbookName";
import CreateRecipe from "./page/CreateRecipe";
import ErrorPage from "./page/ErrorPage";
import Homepage from "./page/Homepage";
import MealPlan from "./page/MealPlan";
import MealPlanResult from "./page/MealPlanResult";
import MoreRecommendation from "./page/MoreRecommendation";
import MyCookbooks from "./page/MyCookbooks";
import MyNewsFeed from "./page/MyNewsFeed";
import MyRecipes from "./page/MyRecipes";
import SearchingResult from "./page/SearchingResult";
import ShoppingList from "./page/ShoppingList";
import Subscriptions from "./page/Subscriptions";
import Trending from "./page/Trending";
import UserProfile from "./page/UserProfile";
import ViewRecipe from "./page/ViewRecipe";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate replace to="/homepage" />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/SearchingResult" element={<SearchingResult />} />
          <Route path="/profile/:userid/mycookbooks" element={<MyCookbooks />} />
          <Route path="/profile/:userid/recipes" element={<MyRecipes />} />
          <Route path="/cookbookname" element={<CookbookName />} />
          <Route path="/cookbookname/:id/:name" element={<CookbookName />} />
          <Route path="/mynewsfeed" element={<MyNewsFeed />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/mealplan" element={<MealPlan />} />
          <Route path="/mealplan/result" element={<MealPlanResult />} />
          <Route path="/recipe/:recipeid" element={<ViewRecipe />} />
          <Route path="/createrecipe" element={<CreateRecipe />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/:userid" element={<UserProfile />} />
          <Route path="/profile/:userid/subscriptions" element={<Subscriptions />} />
          <Route path="/shoppinglist" element={<ShoppingList />} />
          <Route path="/morerecommendation/:rid" element={<MoreRecommendation />} />
          <Route path="/error" element={<ErrorPage />} />
          {/* Guide all other paths to error page */}
          <Route path="*" element={<Navigate replace to="/error" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
