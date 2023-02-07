import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { requestIsLogin } from "../API/AuthRequests";
import {
  requestAddIngredient,
  requestDeleteShopping,
  requestDeleteShoppingIngredient,
  requestGetAggShopping,
  requestGetShopping,
  requestUpdateShoppingRecipe,
} from "../API/ShoppingRequests";
import pageHeaderImg from "../asset/shoppingHeaderImage.jpg";
import ScrumLegendBar from "../component/AppBar";
import AutoSnackbar from "../component/AutoSnackbar";
import DividerLine from "../component/DividerLine";
import RecipeCard from "../component/FoodCardSecond";
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
  width: 100%;
`;

const ItemTitle = styled.span`
  font-weight: 600;
  font-size: 24px;
  text-transform: capitalize;
`;

const ItemText = styled.span`
  font-size: 24px;
`;

const RoundedTextField = styled(TextField)({
  "& .MuiOutlinedInput-notchedOutline": {
    border: "0px",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 40,
    backgroundColor: "#f5f5f5",
  },
  "& .MuiFilledInput-root": {
    borderRadius: 40,
  },
});

const SaveButton = styled(Button)({
  textTransform: "none",
  borderRadius: "16px",
  backgroundColor: "#F8D750",
  fontSize: "22px",
  color: "#18204a",
  "&:hover": {
    backgroundColor: "#fceba2",
  },
});

const DeleteButton = styled(Button)({
  textTransform: "none",
  borderRadius: "16px",
  backgroundColor: "#df573f",
  fontSize: "24px",
  color: "white",
  width: "100%",
  "&:hover": {
    backgroundColor: "#991e08",
  },
});

// Single shopping list ingredient
function ShoppingListItem(props) {
  const name = props.name || "Unknown ingredient";
  const quantity = parseFloat(props.quantity.toFixed(2)) || "As appropriate";
  const unit = props.unit || "";
  return (
    <>
      <Stack direction="row" alignItems="center" sx={{ flexWrap: "wrap" }}>
        <ItemTitle>
          {props.handleDelete ? (
            <IconButton size="small" onClick={props.handleDelete} sx={{ ml: 3 }}>
              <RemoveCircleOutlineIcon sx={{ color: "#df573f" }} />
            </IconButton>
          ) : (
            <ArrowRightIcon sx={{ color: "#df573f" }} />
          )}
          {name}
        </ItemTitle>
        <Box sx={{ flexGrow: 1 }} />
        <ItemText>
          {quantity} {unit}
        </ItemText>
      </Stack>
    </>
  );
}

// Single recipe (with ingredients) in shopping list
function ShoppingListSet(props) {
  const recipe = props.recipe || {};
  const recipeIndex = props.recipeIndex;
  const ingredients = props.ingredients || [];

  const [servingsValue, setServingsValue] = React.useState(recipe.servings);
  // State for "apply" servings button
  const [buttonDisabled, setButtonDisabled] = React.useState(false);

  return (
    <>
      <Stack sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center">
          {recipe.name && (
            <IconButton
              onClick={() => {
                props.handleRecipeDelete(recipe.rid);
              }}
            >
              <IndeterminateCheckBoxIcon sx={{ color: "#df573f", fontSize: "30px" }} />
            </IconButton>
          )}
          <SectionTitle>{recipe.name || "Other items"}</SectionTitle>
          {recipe.name && (
            <TextField
              id={`recipe_servings_${props.recipeIndex}`}
              label="Servings"
              variant="standard"
              value={servingsValue}
              inputProps={{
                style: {
                  fontSize: "16px",
                  fontWeight: "bold",
                  width: "6em",
                },
                max: 9999,
                min: 1,
              }}
              onChange={(e) => {
                if (e.target.value.length < 4) {
                  // limit serving size to 999
                  if (!isNaN(e.target.value) && !isNaN(parseFloat(e.target.value))) {
                    // check if valid number
                    setServingsValue(Number(e.target.value));
                    setButtonDisabled(false);
                  } else if (e.target.value === "") {
                    setServingsValue("");
                  }
                }
              }}
            />
          )}

          {recipe.name && (
            <button
              disabled={buttonDisabled}
              onClick={() => {
                props.handleServingChange(servingsValue, recipe.rid);
                setButtonDisabled(true);
              }}
            >
              Apply
            </button>
          )}
        </Stack>
        {/* Ingredients section */}
        {ingredients.map((ingredientItem, i) => {
          return (
            <ShoppingListItem
              name={ingredientItem.ingredient}
              quantity={ingredientItem.quantity}
              unit={ingredientItem.units}
              id={i}
              key={`shopitem_${recipeIndex}_${i}`}
              handleDelete={() => {
                props.handleDelete(recipeIndex, i);
              }}
            />
          );
        })}
      </Stack>
    </>
  );
}

// Input component for adding extra shopping ingredient
function NewShoppingItem(props) {
  return (
    <Grid container justifyContent="center" spacing={1} sx={{ pb: 2 }}>
      <Grid item xs={6}>
        <RoundedTextField
          fullWidth
          hiddenLabel
          variant="outlined"
          id={`ingredient_${props.id}`}
          placeholder="Ingredient"
          name={`extra[${props.id}][ingredient]`}
          sx={{ "& legend": { display: "none" }, "& fieldset": { top: 0 } }}
        />
      </Grid>
      <Grid item xs={3}>
        <RoundedTextField
          fullWidth
          variant="outlined"
          id={`quantity_${props.id}`}
          placeholder="Qty"
          name={`extra[${props.id}][quantity]`}
          inputProps={{
            max: 9999,
            min: 1,
          }}
          type="number"
          sx={{
            background: "inherit",
            borderRadius: 3,
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <Autocomplete
          key={props.resetKey}
          id={`units_${props.id}`}
          freeSolo
          options={["tbsp", "tsp", "cup", "g", "Kg", "mL", "L"]}
          renderInput={(params) => (
            <RoundedTextField
              {...params}
              fullWidth
              variant="outlined"
              id={`units_${props.id}`}
              placeholder="Unit"
              name={`extra[${props.id}][units]`}
              sx={{
                background: "inherit",
                borderRadius: 3,
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

const ShoppingListPage = () => {
  // Shopping list is aggregation of item and recipe
  const [shoppingList, setShoppingList] = useState([]);
  // aggShoppingList is the aggregated version
  const [aggShoppingList, setAggShoppingList] = useState([]);
  // Toggle between aggregated or not
  const [isAggShop, setIssAggShop] = useState(false);

  const [newItemCount, setNewItemCount] = useState(1);

  // This is used to set the key value of the unit AutoComplete
  // using the behavior that once the key value changes, the component is rerendered therefore cleared
  const [resetKey, setResetKey] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, text: "" });

  const navigate = useNavigate();

  function loadShoppingList() {
    requestGetShopping()
      .then((responseObj) => {
        setShoppingList(responseObj);
      })
      .catch((error) => {
        console.error("Failed to load user data", error);
      });

    requestGetAggShopping()
      .then((responseObj) => {
        setAggShoppingList(responseObj);
      })
      .catch((error) => {
        console.error("Failed to load user data", error);
      });
  }

  // Save extra ingredients to shopping list
  // extract form data, filter out empty ingredients, validate data, send request to backend
  const handleSubmit = (event) => {
    event.preventDefault();
    const userProfileFD = new FormData(event.currentTarget);
    const formDataList = [];

    // Extract value from form
    userProfileFD.forEach((value, key) => {
      let i, field_name;
      [i, field_name] = key.match(/[^[\]]+(?=\])/g);
      while (formDataList.length <= i) {
        formDataList.push({});
      }

      formDataList[i][field_name] = value;
    });

    // Reset input fields
    event.currentTarget.reset();
    setResetKey(!resetKey);
    setNewItemCount(1);

    // Filter out invalid inputs
    const ingredientList = formDataList.filter((obj) => obj.ingredient && /^\d+$/.test(obj.quantity));

    // Show snackbar when there are invalid inputs that are filtered out
    if (ingredientList.length !== formDataList.length) {
      setSnackbar({
        open: true,
        severity: "info",
        text: `${formDataList.length - ingredientList.length} empty item(s) were filtered out.`,
      });
    }
    ingredientList.forEach((obj) => (obj.ingredient = obj.ingredient.toLowerCase()));

    // Send request to backend
    const postBody = { ingredients: ingredientList };
    requestAddIngredient(JSON.stringify(postBody))
      .then(() => {
        loadShoppingList();
      })
      .catch((error) => {
        console.error("Add ingredient fail", error);
        alert(error);
      });
  };

  // Remove single recipe from shopping list
  function handleRecipeDelete(recipeId) {
    const formDataObj = { rid: recipeId, servings: 0 };
    requestUpdateShoppingRecipe(JSON.stringify(formDataObj))
      .then(() => {
        loadShoppingList();
      })
      .catch((error) => {
        console.error("Shopping list update fail", error);
        alert(error);
      });
  }

  function handleServingChange(servings, rid) {
    const formDataObj = { rid: rid, servings: servings };
    requestUpdateShoppingRecipe(JSON.stringify(formDataObj))
      .then(() => {
        loadShoppingList();
      })
      .catch((error) => {
        console.error("Shopping list update fail", error);
        alert(error);
      });
  }

  // Remove entire shopping list
  function handleShoppingListDelete() {
    requestDeleteShopping()
      .then(() => {
        loadShoppingList();
      })
      .catch((error) => {
        console.error("Shopping list delete fail", error);
        alert(error);
      });
  }

  // Remove single ingredient from shopping list
  function handleDelete(recipeIndex, itemIndex) {
    const ingredientItem = shoppingList[recipeIndex].ingredients[itemIndex];
    const formDataObj = {
      rid: ingredientItem.rid,
      id: [ingredientItem.id],
    };
    requestDeleteShoppingIngredient(JSON.stringify(formDataObj))
      .then(() => {
        loadShoppingList();
      })
      .catch((error) => {
        console.error("Shopping list delete ingredient fail", error);
        alert(error);
      });
  }

  // Add additional input field for extra ingredients
  function handleAddEmpty() {
    setNewItemCount(newItemCount + 1);
  }

  // Get and set shopping list data
  useEffect(() => {
    // Check login status
    requestIsLogin()
      .then((responseObj) => {
        if (!responseObj.user_is_logged_in) {
          navigate("/error");
        }
      })
      .catch((error) => {
        console.error("Failed to get login status", error);
        navigate("/error");
      });
    // get and set shopping list
    loadShoppingList();
  }, []);

  return (
    <>
      <ScrumLegendBar />
      <Container>
        <Stack alignItems="center" sx={{ width: "100%", mt: 3 }}>
          <HeaderImg alt="Shopping list image" src={pageHeaderImg} />
          <PageTitle>My Shopping List</PageTitle>
          <Grid container spacing={4}>
            {/* Selected recipe cards section */}
            <Grid item xs={8}>
              <Title>Selected recipes</Title>
              <Stack spacing={2} sx={{ width: "100%" }}>
                {shoppingList.map((shoppingItem, i) => {
                  const recipeItem = shoppingItem.recipe;
                  if (Object.keys(recipeItem).length)
                    return (
                      <RecipeCard
                        img={recipeItem.image}
                        mealType={recipeItem.meal_type}
                        title={recipeItem.name}
                        subTitle={shoppingItem.ingredients
                          .slice(0, 5)
                          .map((obj) => obj.ingredient)
                          .join(", ")}
                        name={recipeItem.uploaded_by}
                        time={recipeItem.time}
                        likes={recipeItem.total_rating}
                        onImgClick={() => {
                          navigate(`/recipe/${recipeItem.rid}`);
                        }}
                        key={i}
                      />
                    );
                })}
                {!shoppingList.length && "Nothing selected"}
              </Stack>
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
                {!shoppingList.length ? (
                  "Ready to buy something?"
                ) : (
                  <>
                    <Stack direction="row" alignItems="center">
                      {isAggShop ? (
                        <>
                          <SectionTitle>Items Combined</SectionTitle>
                          <IconButton
                            onClick={() => {
                              setIssAggShop(false);
                            }}
                            sx={{ ml: 3 }}
                          >
                            <CloseFullscreenIcon sx={{ color: "#18204a" }} />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <SectionTitle>Shopping List Items</SectionTitle>
                          <IconButton
                            onClick={() => {
                              setIssAggShop(true);
                            }}
                            sx={{ ml: 3 }}
                          >
                            <OpenInFullIcon sx={{ color: "#18204a" }} />
                          </IconButton>
                        </>
                      )}
                    </Stack>
                    <DividerLine />
                  </>
                )}

                <Stack spacing={2 * !isAggShop}>
                  {isAggShop ? (
                    <>
                      {aggShoppingList.map((ingredientItem, i) => {
                        return (
                          <ShoppingListItem
                            name={ingredientItem.name}
                            quantity={ingredientItem.quantity}
                            unit={ingredientItem.units}
                            id={i}
                            key={`shopitem_agg_${i}`}
                            // handleDelete={}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {shoppingList.map((shoppingItem, i) => {
                        return (
                          <ShoppingListSet
                            recipe={shoppingItem.recipe}
                            ingredients={shoppingItem.ingredients}
                            recipeIndex={i}
                            handleServingChange={handleServingChange}
                            handleRecipeDelete={handleRecipeDelete}
                            handleDelete={handleDelete}
                            key={`shopset_${i}`}
                          />
                        );
                      })}
                    </>
                  )}
                </Stack>
                <DividerLine />
                <SectionTitle>Extra Items to Include</SectionTitle>
                <DividerLine />
                <Stack
                  component="form"
                  onSubmit={handleSubmit}
                  alignItems="center"
                  spacing={0}
                  sx={{ flexGrow: 1, pt: 2 }}
                >
                  {Array(newItemCount)
                    .fill(1)
                    .map((v, i) => {
                      return <NewShoppingItem id={i} key={i} resetKey={resetKey} />;
                    })}

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: "100%", mb: 5 }}
                  >
                    <Button onClick={handleAddEmpty}>
                      <AddBoxIcon sx={{ fontSize: "40px", color: "#18204a" }} />
                    </Button>
                    <SaveButton type="submit" sx={{ px: 2, py: 0 }}>
                      Save extra items
                    </SaveButton>
                  </Stack>
                  {/* <Box sx={{ flexGrow: 1 }} /> */}
                  <DividerLine />
                  {!!shoppingList.length && (
                    <DeleteButton onClick={handleShoppingListDelete} sx={{ m: 3, mb: 0 }}>
                      Remove all
                    </DeleteButton>
                  )}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
      <Footer />
      <AutoSnackbar state={snackbar} setter={setSnackbar} />
    </>
  );
};
export default ShoppingListPage;
