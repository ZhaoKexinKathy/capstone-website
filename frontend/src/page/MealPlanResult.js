import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

import { requestIsLogin } from "../API/AuthRequests";
import { requestDeleteShopping, requestUpdateShoppingRecipe } from "../API/ShoppingRequests";
import defaultRecipeImg from "../asset/defaultRecipeImage.jpg";
import pageHeaderImg from "../asset/shoppingHeaderImage.jpg";
import ScrumLegendBar from "../component/AppBar";
import AutoSnackbar from "../component/AutoSnackbar";
import DividerLine from "../component/DividerLine";
import RecipeCardBase from "../component/FoodCardSecond";
import Footer from "../component/Footer";
import Title from "../component/Title";

const HeaderImg = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  // width: 90%;
  max-height: 50vh;
`;

const PageTitle = styled.div`
  font-weight: bold;
  font-size: 48px;
  width: 100%;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 28px;
  margin-top: 18px;
`;

const SectionSubTitle = styled.div`
  font-weight: 600;
  font-size: 24px;
  margin-top: 18px;
`;

const ItemTitle = styled.span`
  font-weight: bold;
  font-size: 24px;
  text-transform: capitalize;
`;

const ItemText = styled.span`
  font-size: 24px;
`;

const RefreshButton = styled(Button)({
  borderRadius: "12px",
  backgroundColor: "#18204a",
  padding: "12px 0",
  width: "80px",
  fontSize: "24px",
  color: "#FFF",
  float: "right",
  position: "relative",
  marginBottom: "-18px",
  bottom: "86px",
  left: "620px",
  "&:hover": {
    backgroundColor: "#3d4052",
  },
});

const SaveButton = styled(Button)({
  textTransform: "none",
  borderRadius: "16px",
  backgroundColor: "#F8D750",
  fontSize: "32px",
  // fontWeight: "bold",
  width: "100%",
  color: "#18204a",
  "&:hover": {
    backgroundColor: "#fceba2",
  },
});

// Recipe cards to show recipe info and image
function RecipeCard(props) {
  return (
    <>
      <RecipeCardBase {...props} />
      {props.onRefreshClick && (
        <RefreshButton onClick={props.onRefreshClick}>
          <RefreshIcon sx={{ fontSize: "1em" }} />
        </RefreshButton>
      )}
    </>
  );
}

// Single ingredient shopping item in shopping list
// props.name, props.quantity, props.unit
function ShoppingListItem(props) {
  const name = props.name || "Unknown ingredient";
  const quantity = parseFloat(props.quantity.toFixed(2)) || "As appropriate";
  const unit = props.unit || "";
  return (
    <>
      <Stack direction="row" alignItems="center" sx={{ flexWrap: "wrap" }}>
        <ArrowRightIcon sx={{ color: "#df573f" }} />
        <ItemTitle>{name}</ItemTitle>
        <Box sx={{ flexGrow: 1 }} />
        <ItemText>
          {quantity} {unit}
        </ItemText>
      </Stack>
    </>
  );
}

// Component of single recipe in shopping list
function ShoppingListSet(props) {
  const recipe = props.recipe || {};
  const ingredients = props.ingredients || [];
  const requestedServings = props.servings;
  return (
    <>
      <Stack sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center">
          <SectionTitle>{recipe.name || "Other items"}</SectionTitle>
          <Box sx={{ flexGrow: 1 }} />
          <SectionSubTitle style={{ textAlign: "right" }}> {requestedServings} servings</SectionSubTitle>
        </Stack>
        {ingredients.map((ingredientItem, i) => {
          return (
            <ShoppingListItem
              name={ingredientItem.ingredient}
              quantity={(ingredientItem.quantity / recipe.servings) * requestedServings}
              unit={ingredientItem.units}
              id={i}
              key={`shopitem_${recipe.id}_${i}`}
            />
          );
        })}
      </Stack>
    </>
  );
}

const MealPlanResultPage = () => {
  // Get data from mealplan page by location.state
  const { mealPlanRequest, mealPlanResponse } = useLocation().state || {
    mealPlanRequest: { meal_type: [] },
    mealPlanResponse: {},
  };

  const [mealTypeList] = [mealPlanRequest.meal_type];
  const [dayCount, peopleCount, mealCountPerDay] = [
    mealPlanRequest.number_of_days,
    mealPlanRequest.number_of_people,
    mealTypeList.length,
  ];

  // mealPlanList has dimension of [day][meal_type.length], and saves the recipe index of the corresponding meal_type, not rid!
  // Use setMealPlanListSafe for settings unless you know what you are doing
  const [mealPlanList, setMealPlanList] = useState(
    Array(dayCount)
      .fill(null)
      .map(() => Array(mealCountPerDay).fill(0))
  );

  // Object with format {rid:recipe_data}
  const [recipeLookup, setRecipeLookup] = useState([]);
  // servingList [{rid:recipe_id, servings:servings in this mealplan}]
  const [servingList, setServingList] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, text: "" });

  const navigate = useNavigate();

  // Modifies mealPlanList to have valid index each time setting mealPlanList
  function setMealPlanListSafe(newMealPlanList) {
    const newMealPlanListSafe = JSON.parse(JSON.stringify(newMealPlanList));
    newMealPlanListSafe.forEach((dailyList, day) => {
      newMealPlanListSafe[day] = dailyList.map((v, i) => {
        const suggestionLength = mealPlanResponse[mealTypeList[i]].length;
        return (v + suggestionLength) % suggestionLength;
      });
    });
    setMealPlanList(newMealPlanListSafe);
  }

  // Save mealplan to shopping list
  const handleSave = () => {
    if (!isLoggedIn) {
      setSnackbar({ open: true, severity: "info", text: "Please login first." });
      return;
    }
    // Delete old shopping list
    // Add all mealplan items to shopping list
    requestDeleteShopping()
      .then(() => {
        servingList.forEach((dataObj) => {
          requestUpdateShoppingRecipe(JSON.stringify(dataObj))
            .then(() => {
              setSnackbar({ open: true, severity: "success", text: "Meal plan saved to shopping list." });
            })
            .catch((error) => {
              console.error("Shopping list update fail", error);
              setSnackbar({
                open: true,
                severity: "error",
                text: "Shopping list update failed. Please contact developer team.",
              });
            });
        });
      })
      .catch((error) => {
        console.error("Shopping list delete fail", error);
        setSnackbar({
          open: true,
          severity: "error",
          text: "Shopping list delete failed. Please contact developer team.",
        });
      });
  };

  // Load next recipe when refresh button is clicked
  function handleRefresh(dayIndex, mealTypeIndex) {
    const newMealPlanList = JSON.parse(JSON.stringify(mealPlanList));
    newMealPlanList[dayIndex][mealTypeIndex] += 1;
    setMealPlanListSafe(newMealPlanList);
  }

  // Get and set mealplan data from /mealplan
  useEffect(() => {
    // Check if there is data
    if (!Object.keys(mealPlanResponse).length) {
      navigate("/mealplan");
    }

    // Initiate mealplan
    setMealPlanListSafe(
      Array(dayCount)
        .fill(null)
        .map((r, i) => Array(mealCountPerDay).fill(i))
    );

    // set recipe lookup
    const newRecipeLookup = {};
    Object.values(mealPlanResponse).forEach((recipes) => {
      recipes.forEach((recipeItem) => {
        newRecipeLookup[recipeItem.id] = recipeItem;
      });
    });
    setRecipeLookup(newRecipeLookup);

    // Check login status
    requestIsLogin()
      .then((responseObj) => {
        setIsLoggedIn(responseObj.user_is_logged_in);
      })
      .catch((error) => {
        console.error("Failed to get login status", error);
      });
  }, []);

  // Update servings info if mealPlanList changes, eg: refresh button
  useEffect(() => {
    const newRecipeList = mealPlanList.map((singleDayList) => {
      return singleDayList.map((recipeIndex, mealTypeIndex) => {
        const recipeItem = mealPlanResponse[mealTypeList[mealTypeIndex]][recipeIndex];
        return recipeItem;
      });
    });

    // Object with format {rid:servings}
    const servingObj = newRecipeList
      .flat()
      .filter((v) => v !== undefined)
      .reduce((acc, recipeItem) => {
        return (acc[recipeItem.id] = (acc[recipeItem.id] || 0) + peopleCount), acc;
      }, {});
    const newServingList = Object.entries(servingObj).map(([k, v]) => {
      return { rid: k, servings: v };
    });
    setServingList(newServingList);
  }, [mealPlanList]);

  return (
    <>
      <ScrumLegendBar />
      <Container>
        <Stack alignItems="center" sx={{ width: "100%", mt: 3 }}>
          <HeaderImg alt="Meal plan image" src={pageHeaderImg} />
          <PageTitle>My Meal Plan</PageTitle>
          <Grid container spacing={4}>
            <Grid item xs={8}>
              <Carousel cycleNavigation={false} animation="slide" autoPlay={false} duration={1000}>
                {/* Selected recipe cards section */}
                {/* list must have value before rendering to avoid incomplete rendering */}
                {mealPlanList.length &&
                  mealPlanList.map((singleDayList, dayIndex) => (
                    <Box sx={{ pb: 8 }} key={dayIndex}>
                      <Title>Day {dayIndex + 1}</Title>
                      <Stack spacing={0} sx={{ width: "100%" }}>
                        {singleDayList.map((recipeIndex, mealTypeIndex) => {
                          const recipeItem = mealPlanResponse[mealTypeList[mealTypeIndex]][recipeIndex];
                          if (recipeItem)
                            return (
                              <RecipeCard
                                img={recipeItem.image}
                                mealType={recipeItem.meal_type}
                                title={recipeItem.name}
                                subTitle={recipeItem.ingredients
                                  .slice(0, 5)
                                  .map((obj) => obj.ingredient)
                                  .join(", ")}
                                name={recipeItem.uploaded_by}
                                time={recipeItem.time}
                                likes={recipeItem.total_rating}
                                onImgClick={() => {
                                  if (recipeItem) navigate(`/recipe/${recipeItem.id}`);
                                }}
                                onRefreshClick={() => {
                                  handleRefresh(dayIndex, mealTypeIndex);
                                }}
                                key={mealTypeIndex}
                              />
                            );
                          else
                            return (
                              <RecipeCard
                                img={defaultRecipeImg}
                                mealType={mealTypeList[mealTypeIndex]}
                                title="No recommendations!"
                                subTitle="Modify the preferences and try again"
                                name="_______"
                                time="--"
                                onImgClick={undefined}
                                key={mealTypeIndex}
                              />
                            );
                        })}
                      </Stack>
                    </Box>
                  ))}
              </Carousel>
              {!mealPlanList.length && "Empty meal plan"}
            </Grid>

            {/* Shopping cart section */}
            <Grid item xs={4} sx={{ width: "100%" }}>
              <Stack
                sx={{
                  width: "100%",
                  background: "white",
                  borderRadius: 6,
                  minHeight: "80vh",
                  p: 3,
                }}
              >
                <SectionTitle style={{ textAlign: "center" }}>- Shopping Cart -</SectionTitle>
                <DividerLine />
                <Stack spacing={2}>
                  {!recipeLookup.length &&
                    servingList.map((servingItem, i) => {
                      const recipeItem = recipeLookup[servingItem.rid];
                      return (
                        <ShoppingListSet
                          recipe={recipeItem}
                          ingredients={recipeItem.ingredients}
                          servings={servingItem.servings}
                          key={`shopset_${i}`}
                        />
                      );
                    })}
                </Stack>
                <DividerLine />
                {!!mealPlanList.length && (
                  <SaveButton onClick={handleSave} sx={{ mt: 2, p: 2 }}>
                    Save to <br />
                    shopping list
                  </SaveButton>
                )}
              </Stack>

              {isLoggedIn && (
                <Link
                  component={RouterLink}
                  to={`/shoppinglist`}
                  sx={{
                    mt: 2,
                    mr: -5,
                    fontSize: "20px",
                    color: "#18204a",
                    float: "right",
                    textDecorationColor: "#18204a",
                  }}
                >
                  Go to shopping list ➞
                </Link>
              )}
            </Grid>
          </Grid>
        </Stack>
      </Container>
      <Footer />
      <AutoSnackbar state={snackbar} setter={setSnackbar} />
    </>
  );
};
export default MealPlanResultPage;
