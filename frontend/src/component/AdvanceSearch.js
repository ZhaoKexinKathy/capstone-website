import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import styled from "styled-components";

import { requestTrendingRecipe } from "../API/DataRequests";
import searchImage from "../asset/searchImage.png";
import xmark from "../asset/x-solid.svg";
import { SEARCH } from "../config";

import { ButtonYellow, CloseIcon, PageMask } from "./CommonComponent";
import PopupCard from "./PopupCard";

const SearchInput = styled.input`
  padding-left: 15px;
  background-color: #ffffff;
  width: 90%;
  height: 37px;
  margin-right: 60px;
  border: none;
  border-radius: 16px;
  font-size: 22px;
`;

const SearchOption = styled.span`
  font-weight: bold;
  font-size: 19px;
`;

function AdvanceSearchInputField(props) {
  return (
    <>
      <Autocomplete
        multiple
        id={`${props.name}`}
        freeSolo
        onChange={(event, value) => props.handleFormChange(event, value, props.name)}
        options={props.options}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
              key={index}
              sx={{
                fontSize: "1em",
                fontFamily: "inherit",
                borderColor: "#18204a",
                textTransform: "capitalize",
              }}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            name={`advance[${props.name}]`}
            sx={{
              background: "#FFF",
              borderRadius: "16px",
            }}
          />
        )}
        sx={{
          "& .MuiOutlinedInput-root": {},
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #eee",
            borderRadius: "16px",
          },
          py: 0,
        }}
      />
      {/* </Grid> */}
    </>
  );
}

const AdvanceSearch = (props) => {
  const navigate = useNavigate();

  const [formState, setFormState] = React.useState({
    Cuisine: [],
    "Cooking style": [],
    "Meal type": [],
    Tags: [],
    Ingredients: [],
  });

  const options = [
    "Cuisine",
    "Cooking style",
    "Meal type",
    "Tags",
    "Ingredients",
    "Time (m)",
    "Calories",
    "Protein (g)",
    "Carbs (g)",
    "Fats (g)",
  ];

  // Random initial values
  const [formOptions, setFormOptions] = React.useState({
    Ingredients: [
      "Apples",
      "Bananas",
      "Beef",
      "Chicken",
      "Egg",
      "Kiwi",
      "Parsnips",
      "Pork",
      "Salmon",
      "Tofu",
      "Tomatoes",
      "Wheat",
    ],
    "Cooking style": ["Fried", "Microwave"],
    Cuisine: ["American", "British", "French", "Italian", "Croatian", "Japanese"],
    "Meal type": ["Breakfast", "Lunch", "Dinner", "Dessert"],
    Tags: ["High Protein", "Low Fat"],
  });

  const close = props.close;

  const handleFormChange = (event, value, name) => {
    event.preventDefault();
    const newFormState = formState;
    newFormState[name] = value;
    setFormState(newFormState);
  };

  const handleAdvanceSearch = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const obj = {
      ingre: formState["Ingredients"].join(","),
      cookingStyle: formState["Cooking style"].join(","),
      mealType: formState["Meal type"].join(","),
      cuisine: formState["Cuisine"].join(","),
      tag: formState["Tags"].join(","),
      time_low: data.get("Time (m)_low"),
      time_high: data.get("Time (m)_high"),
      calories_low: data.get("Calories_low"),
      calories_high: data.get("Calories_high"),
      protein_low: data.get("Protein (g)_low"),
      protein_high: data.get("Protein (g)_high"),
      carbs_low: data.get("Carbs (g)_low"),
      carbs_high: data.get("Carbs (g)_high"),
      fats_low: data.get("Fats (g)_low"),
      fats_high: data.get("Fats (g)_high"),
    };
    // Todo: search query
    const response = await fetch(
      `${SEARCH.ADVANCE}?ingredient=${obj.ingre}&meal_type=${obj.mealType}&cooking_style=${obj.cookingStyle}&tag=${obj.tag}&cuisine=${obj.cuisine}&time_low=${obj.time_low}&time_high=${obj.time_high}&calories_low=${obj.calories_low}&calories_high=${obj.calories_high}&carbs_low=${obj.carbs_low}&carbs_high=${obj.carbs_high}&protein_low=${obj.protein_low}&protein_high=${obj.protein_high}&fats_low=${obj.fats_low}&fats_high=${obj.fats_high}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.status === 200) {
      const recipeList = await response.json();
      close();
      window.recipeList = recipeList;
      navigate("/SearchingResult");
    }
  };

  const SearchCompo = (props) => {
    const option = props.option;
    return (
      <>
        <Grid item xs={3}>
          <SearchOption>{option}: </SearchOption>
        </Grid>
        {["Time (m)", "Protein (g)", "Calories", "Carbs (g)", "Fats (g)"].includes(option) ? (
          <>
            <Grid item xs={3.73}>
              <SearchInput name={option + "_low"} type="number" placeholder="Minimum" min="0"></SearchInput>
            </Grid>
            <Grid item xs={1}>
              to
            </Grid>
            <Grid item xs={3.73}>
              <SearchInput name={option + "_high"} type="number" placeholder="Maximum"></SearchInput>
            </Grid>
          </>
        ) : (
          <Grid item xs={9}>
            {/* <SearchInput name={option} placeholder="Enter comma-separated values"></SearchInput> */}
            <AdvanceSearchInputField
              label={option}
              name={option}
              options={formOptions[option]}
              handleFormChange={handleFormChange}
            />
          </Grid>
        )}
      </>
    );
  };

  React.useEffect(() => {
    // Get options from trending recipes
    requestTrendingRecipe()
      .then((responseObj) => {
        if (responseObj) {
          const newFormOptions = {
            ingredients: new Set(),
            cooking_style: new Set(),
            cuisine: new Set(),
            meal_type: new Set(),
            tags: new Set(),
          };

          // Get options from first 20 recipes
          responseObj.slice(0, 20).map((recipeItem) => {
            recipeItem.ingredients.forEach((ingredientItem) =>
              newFormOptions.ingredients.add(ingredientItem.ingredient.toLowerCase())
            );
            newFormOptions.cooking_style.add(recipeItem.cooking_style.toLowerCase());
            newFormOptions.cuisine.add(recipeItem.cuisine.toLowerCase());
            newFormOptions.meal_type.add(recipeItem.meal_type.toLowerCase());
            recipeItem.tags.forEach((tag) => newFormOptions.tags.add(tag.toLowerCase()));
          });
          Object.keys(newFormOptions).forEach((k) => {
            newFormOptions[k] = Array.from(newFormOptions[k])
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .sort();
          });
          newFormOptions["Cuisine"] = newFormOptions.cuisine;
          newFormOptions["Cooking style"] = newFormOptions.cooking_style;
          newFormOptions["Meal type"] = newFormOptions.meal_type;
          newFormOptions["Tags"] = newFormOptions.tags;
          newFormOptions["Ingredients"] = newFormOptions.ingredients;
          setFormOptions(newFormOptions);
        }
      })
      .catch((error) => {
        console.error("Failed to get trending recipes", error);
      });
  }, []);

  return (
    <>
      <PageMask />
      <PopupCard style={{ width: "600px", height: "80vh", overflowX: "hidden", overflowY: "auto" }}>
        <CloseIcon src={xmark} onClick={close} />
        <img width={"65%"} src={searchImage} />
        <form onSubmit={handleAdvanceSearch}>
          <Grid container spacing={1.4} alignItems="center">
            {options.map((q) => (
              <SearchCompo key={q} option={q} />
            ))}
            <Grid item xs={12}>
              <ButtonYellow type="submit">Search</ButtonYellow>
            </Grid>
          </Grid>
        </form>
      </PopupCard>
    </>
  );
};

export default AdvanceSearch;
