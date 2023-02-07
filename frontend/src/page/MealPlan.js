import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { requestTrendingRecipe } from "../API/DataRequests";
import { requestGetMealPlan } from "../API/MealPlanRequests";
import pageHeaderImg from "../asset/shoppingHeaderImage.jpg";
import ScrumLegendBar from "../component/AppBar";
import AutoSnackbar from "../component/AutoSnackbar";
import DividerLine from "../component/DividerLine";
import Footer from "../component/Footer";

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
  font-weight: bold;
  font-size: 24px;
  text-transform: capitalize;
`;

const ItemText = styled.span`
  font-weight: bold;
  font-size: 24px;
`;

const GenerateButton = styled(Button)({
  textTransform: "none",
  borderRadius: "16px",
  backgroundColor: "#F8D750",
  fontSize: "32px",
  fontWeight: "bold",
  padding: "0 64px",
  color: "#18204a",
  margin: "10px auto",
  "&:hover": {
    backgroundColor: "#fceba2",
  },
});

// Input checkbox component for meal plan
// props.mealType, props.setMealType
function MealPlanCheckbox(props) {
  const isError = Object.values(props.mealType).every((v) => v === false);
  return (
    <Box sx={{ display: "flex" }}>
      <FormControl required error={isError} component="fieldset" sx={{ m: 3 }} variant="standard">
        <FormGroup row>
          {Object.entries(props.mealType).map(([k, v]) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={v}
                    onChange={props.handleMealTypeChange}
                    name={k}
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                  />
                }
                label={<ItemTitle>{k}</ItemTitle>}
                key={k}
              />
            );
          })}
        </FormGroup>
        {isError && <FormHelperText>Pick at least one</FormHelperText>}
      </FormControl>
    </Box>
  );
}

// Input component with multiple option and custom input
// Usage: <MealPlanInputField label='Ingredient' group='preference' name='ingredient' options={IngredientOptions} />
function MealPlanInputField(props) {
  return (
    <>
      <Grid item xs={3}>
        <ItemText>{props.label}:</ItemText>
      </Grid>
      <Grid item xs={9}>
        <Autocomplete
          multiple
          id={`${props.group}_${props.name}`}
          freeSolo
          onChange={(event, value) => props.handleFormChange(event, value, props.group, props.name)}
          options={props.options}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                key={`${option}_${index}`}
                {...getTagProps({ index })}
                sx={{
                  fontSize: "1.3em",
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
              name={`mealplan[${props.group}][${props.name}]`}
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
      </Grid>
    </>
  );
}

const MealPlanPage = () => {
  const [personCount, setPersonCount] = React.useState(1);
  const [dayCount, setDayCount] = React.useState(1);
  // state to disable save button to avoid spamming requests to backend
  const [saveClicked, setSaveClicked] = React.useState(false);

  // Checkbox state
  const [mealType, setMealType] = React.useState({
    Breakfast: false,
    Lunch: false,
    Dinner: false,
    Dessert: false,
  });

  // Input state
  const [formState, setFormState] = React.useState({
    preferences: {
      ingredients: {},
      cooking_style: {},
      cuisine: {},
      name: {},
      tags: {},
    },
    avoidances: {
      ingredients: {},
      cooking_style: {},
      cuisine: {},
      name: {},
      tags: {},
    },
  });

  const [snackbar, setSnackbar] = useState({ open: false, text: "" });

  // Initial values for options
  const [formOptions, setFormOptions] = useState({
    ingredients: [
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
    cooking_style: ["Fried", "Microwave"],
    cuisine: ["American", "British", "French", "Italian", "Croatian", "Japanese"],
    name: [],
    tags: ["High Protein", "Low Fat"],
  });

  const navigate = useNavigate();

  // Handle checkbox event
  const handleMealTypeChange = (event) => {
    setMealType({
      ...mealType,
      [event.target.name]: event.target.checked,
    });
  };

  // Extract input data, perform sanity check, and send request to backend
  const handleSubmit = (event) => {
    event.preventDefault();
    const submitForm = JSON.parse(JSON.stringify(formState));

    submitForm.meal_type = Object.entries(mealType)
      .filter(([, v]) => v)
      .map(([k]) => k);
    submitForm.number_of_people = Math.round(Number(personCount));
    submitForm.number_of_days = Math.round(Number(dayCount));

    // submit form sanity check
    if (!submitForm.meal_type.length) {
      setSnackbar({ open: true, severity: "error", text: "At least one meal type needs to be selected!" });
    } else if (!submitForm.number_of_people || submitForm.number_of_people <= 0) {
      setSnackbar({ open: true, severity: "error", text: "Needs to have valid number of people!" });
    } else if (!submitForm.number_of_days || submitForm.number_of_days <= 0) {
      setSnackbar({ open: true, severity: "error", text: "Needs to have valid number of days!" });
    } else {
      setSaveClicked(true);
      // Pass form to backend
      requestGetMealPlan(JSON.stringify(submitForm))
        .then((responseObj) => {
          // Get response of meal type
          // Set location state and navigate
          if (Object.values(responseObj).flat().length) {
            navigate("/mealplan/result", { state: { mealPlanRequest: submitForm, mealPlanResponse: responseObj } });
          } else {
            setSnackbar({ open: true, severity: "warning", text: "Empty meal plan! Maybe try less avoidances?" });
            setSaveClicked(false);
          }
        })
        .catch((error) => {
          console.error("Failed to get meal plan", error);
        });
    }
  };

  // Update form data onChange
  const handleFormChange = (event, value, group, name) => {
    event.preventDefault();
    const newFormState = formState;
    newFormState[group][name] = value;
    setFormState(newFormState);
  };

  // Get options for input dropdown from trending recipes
  useEffect(() => {
    requestTrendingRecipe()
      .then((responseObj) => {
        if (responseObj) {
          const newFormOptions = {
            ingredients: new Set(),
            cooking_style: new Set(),
            cuisine: new Set(),
            name: new Set(),
            tags: new Set(),
          };

          // Get options from first 20 recipes
          responseObj.slice(0, 20).map((recipeItem) => {
            recipeItem.ingredients.forEach((ingredientItem) =>
              newFormOptions.ingredients.add(ingredientItem.ingredient.toLowerCase())
            );
            newFormOptions.cooking_style.add(recipeItem.cooking_style.toLowerCase());
            newFormOptions.cuisine.add(recipeItem.cuisine.toLowerCase());
            recipeItem.tags.forEach((tag) => newFormOptions.tags.add(tag.toLowerCase()));
          });
          Object.keys(newFormOptions).forEach((k) => {
            newFormOptions[k] = Array.from(newFormOptions[k])
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .sort();
          });
          setFormOptions(newFormOptions);
        }
      })
      .catch((error) => {
        console.error("Failed to get trending recipes", error);
      });
  }, []);

  return (
    <>
      <ScrumLegendBar curPage="MealPlan" />
      <Container>
        <Stack alignItems="center" sx={{ width: "100%", mt: 3 }}>
          <HeaderImg alt="Meal plan image" src={pageHeaderImg} />
          <PageTitle>Meal Plan Requirements</PageTitle>
          <DividerLine />

          {/* First section, Mealplan checkbox */}
          <Stack direction="row" sx={{ width: "100%" }}>
            <Avatar sx={{ bgcolor: "inherit", color: "#18204a", border: 1, borderColor: "#AAA", mr: 3 }}>1</Avatar>
            <Box sx={{ width: "100%" }}>
              <SectionTitle>
                Make meal plan for
                <TextField
                  id="meal_plan_people"
                  type="number"
                  variant="standard"
                  defaultValue={personCount}
                  inputProps={{
                    style: {
                      fontSize: "1.5em",
                      fontWeight: "bold",
                      width: "3em",
                      textAlign: "center",
                    },
                    max: 99,
                    min: 1,
                  }}
                  onChange={(event) => {
                    setPersonCount(event.target.value);
                  }}
                />
                person and
                <TextField
                  id="meal_plan_days"
                  type="number"
                  variant="standard"
                  defaultValue={dayCount}
                  inputProps={{
                    style: {
                      fontSize: "1.5em",
                      fontWeight: "bold",
                      width: "3em",
                      textAlign: "center",
                    },
                    max: 7,
                    min: 1,
                  }}
                  onChange={(event) => {
                    setDayCount(event.target.value);
                  }}
                />
                days, including
              </SectionTitle>
              <MealPlanCheckbox
                mealType={mealType}
                setMealType={setMealType}
                handleMealTypeChange={handleMealTypeChange}
              />
            </Box>
          </Stack>
          <DividerLine />

          {/* Second and third section, preferences and avoidances */}
          <Stack component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <DividerLine />
            <Stack direction="row" sx={{ width: "100%", mb: 4 }}>
              <Avatar sx={{ bgcolor: "inherit", color: "#18204a", border: 1, borderColor: "#AAA", mr: 3 }}>2</Avatar>
              <Grid container alignItems="center" rowSpacing={2} sx={{ width: "100%" }}>
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <SectionTitle>Preference</SectionTitle>
                  Type and press enter for custom values.
                </Grid>

                <MealPlanInputField
                  label="Ingredients"
                  group="preferences"
                  name="ingredients"
                  options={formOptions.ingredients}
                  handleFormChange={handleFormChange}
                />
                <MealPlanInputField
                  label="Cooking style"
                  group="preferences"
                  name="cooking_style"
                  options={formOptions.cooking_style}
                  handleFormChange={handleFormChange}
                />
                <MealPlanInputField
                  label="Cuisines"
                  group="preferences"
                  name="cuisine"
                  options={formOptions.cuisine}
                  handleFormChange={handleFormChange}
                />
                <MealPlanInputField
                  label="Names"
                  group="preferences"
                  name="name"
                  options={formOptions.name}
                  handleFormChange={handleFormChange}
                />
                <MealPlanInputField
                  label="Tags"
                  group="preferences"
                  name="tags"
                  options={formOptions.tags}
                  handleFormChange={handleFormChange}
                />
              </Grid>
            </Stack>
            <DividerLine />

            <DividerLine />
            <Stack direction="row" sx={{ width: "100%", mb: 4 }}>
              <Avatar sx={{ bgcolor: "inherit", color: "#18204a", border: 1, borderColor: "#AAA", mr: 3 }}>3</Avatar>
              <Grid container alignItems="center" rowSpacing={2} sx={{ width: "100%" }}>
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <SectionTitle>Avoidance</SectionTitle>
                  Type and press enter for custom values.
                </Grid>

                <MealPlanInputField
                  label="Ingredients"
                  group="avoidances"
                  name="ingredients"
                  options={formOptions.ingredients}
                  handleFormChange={handleFormChange}
                />
                <MealPlanInputField
                  label="Cooking style"
                  group="avoidances"
                  name="cooking_style"
                  options={formOptions.cooking_style}
                  handleFormChange={handleFormChange}
                />
                <MealPlanInputField
                  label="Cuisines"
                  group="avoidances"
                  name="cuisine"
                  options={formOptions.cuisine}
                  handleFormChange={handleFormChange}
                />
                <MealPlanInputField
                  label="Names"
                  group="avoidances"
                  name="name"
                  options={formOptions.name}
                  handleFormChange={handleFormChange}
                />
                <MealPlanInputField
                  label="Tags"
                  group="avoidances"
                  name="tags"
                  options={formOptions.tags}
                  handleFormChange={handleFormChange}
                />
              </Grid>
            </Stack>
            <DividerLine />

            <GenerateButton type="submit" disabled={saveClicked}>
              Generate
            </GenerateButton>
          </Stack>
        </Stack>
      </Container>
      <Footer />
      <AutoSnackbar state={snackbar} setter={setSnackbar} />
    </>
  );
};
export default MealPlanPage;
