import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Grid } from "@mui/material";
import Container from "@mui/material/Container";

import { requestIsLogin } from "../API/AuthRequests";
import recipeDefault from "../asset/recipeDefault.png";
import xmark from "../asset/x-solid.svg";
import ScrumLegendBar from "../component/AppBar";
import { ButtonYellow, CloseIcon } from "../component/CommonComponent";
import Footer from "../component/Footer";
import { InputText, InputTextArea } from "../component/InputText";
import { RECIPE } from "../config";
import { fileToDataUrl } from "../utils/helpers";

const RecipeInfoName = styled.div`
  font-size: 32px;
  font-weight: bold;
`;
const RecipeInfoNameWithBorder = styled(RecipeInfoName)`
  padding-top: 10px;
  border-bottom: 2px solid;
  border-top: 2px solid;
  padding-bottom: 10px;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const InputRecipeName = styled.input`
  padding-left: 15px;
  background-color: #ffffff;
  width: 800px;
  height: 60px;
  margin-right: 60px;
  border-radius: 16px;
  font-size: 48px;
  font-weight: bold;
  border: none;
`;

const ErrorMessage = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: red;
`;

const MainPhoto = styled.img`
  display: block;
  max-width: 100%;
  min-height: 30vh;
  max-height: 60vh;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
`;

// Input component for Cooking style and Cuisine
const CollectInfo = (props) => {
  const info = props.info;
  return (
    <>
      <Grid item xs={5}>
        <RecipeInfoName>{info}</RecipeInfoName>
      </Grid>
      <Grid item xs={7}>
        <InputText name={info}></InputText>
      </Grid>
    </>
  );
};

// Input component for Meal-type
const CollectMealType = () => {
  return (
    <>
      <Grid item xs={5}>
        <RecipeInfoName>Meal-type*</RecipeInfoName>
      </Grid>
      <Grid item xs={7}>
        <InputText name={"Meal-type"} list={"mealTypeList"} />
        {/* Dropdown list options */}
        <datalist id={"mealTypeList"}>
          <option value="Breakfast"></option>
          <option value="Lunch"></option>
          <option value="Dinner"></option>
          <option value="Dessert"></option>
          <option value="Snack"></option>
          <option value="Salad"></option>
          <option value="Drink"></option>
        </datalist>
      </Grid>
    </>
  );
};

// Input component for Preparation Time
const CollectTime = () => {
  return (
    <>
      <Grid item xs={5}>
        <RecipeInfoName>Preparation Time*</RecipeInfoName>
      </Grid>
      <Grid item xs={2}>
        <InputText name={"Preparation Time"} style={{ width: "150px" }} type={"number"} min={"0"}></InputText>
      </Grid>
      <Grid item xs={2}>
        <RecipeInfoName style={{ marginLeft: "40px", fontWeight: "normal" }}>Mins</RecipeInfoName>
      </Grid>
    </>
  );
};

// Input component for Tags
const CollectTags = (props) => {
  const range = props.range;
  return (
    <Grid item xs={6}>
      <InputText name={range + "tags"} />
    </Grid>
  );
};

// Input component for Ingredients
const CollectIngredients = (props) => {
  const rank = props.rank + "stIngredient";
  return (
    <Grid item xs={6}>
      <InputText name={rank + "Name"} style={{ width: "300px", marginRight: "10px" }}></InputText>
      <InputText name={rank + "Quantity"} style={{ width: "70px", marginRight: "10px" }} type={"number"} min={"1"} />
      <InputText name={rank + "Unit"} style={{ width: "50px" }} list="list" />
      <datalist id="list">
        <option value={"tbsp"} />
        <option value={"tsp"} />
        <option value={"cup"} />
        <option value={"g"} />
        <option value={"Kg"} />
        <option value={"mL"} />
        <option value={"L"} />
      </datalist>
    </Grid>
  );
};

export const CreateRecipe = () => {
  const infoName = ["Cooking style", "Cuisine"];
  // Recipe image to display on page. Defaults to recipeDefault image when not set
  const [mainImage, setMainImage] = React.useState("");
  // state to save error message from backend response
  const [errorMessage, setErrorMessage] = React.useState();
  // state to prevent spamming same recipes
  const [publishDisable, setPublishDisable] = React.useState(false);

  const navigate = useNavigate();

  const NameContainerStyle = {
    borderBottom: "2px solid",
    paddingBottom: "20px",
    paddingTop: "20px",
  };

  // Extract form data and send create recipe request to backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    setPublishDisable(true);
    const data = new FormData(event.currentTarget);

    let ingreList = [];
    for (let i = 1; i <= 10; i++) {
      const ingre = data.get(i.toString() + "stIngredientName");
      if (ingre === null || ingre === "") {
        continue;
      }
      const ingreInfo = {
        ingredient: data.get(i.toString() + "stIngredientName"),
        quantity: data.get(i.toString() + "stIngredientQuantity"),
        units: data.get(i.toString() + "stIngredientUnit"),
      };
      ingreList.push(ingreInfo);
    }
    let tagList = [];
    for (let i = 1; i <= 10; i++) {
      const tag = data.get(i.toString() + "tags");
      if (tag === null || tag === "") {
        continue;
      }
      tagList.push(tag);
    }

    // Send as FormData object as required from backend the API
    const requestData = new FormData();

    requestData.append("name", data.get("recipeName"));
    requestData.append("cuisine", data.get("Cuisine"));
    requestData.append("cooking_style", data.get("Cooking style"));
    requestData.append("meal_type", data.get("Meal-type"));
    requestData.append("time", data.get("Preparation Time"));
    requestData.append("method", data.get("steps"));
    requestData.append("plating", data.get("platingInst"));
    requestData.append("image", data.get("image"));
    requestData.append("ingredients", JSON.stringify(ingreList));
    requestData.append("servings", data.get("servings"));
    requestData.append("tags", JSON.stringify(tagList));

    const response = await fetch(RECIPE.DATA_URL(), {
      method: "POST",
      credentials: "include",
      body: requestData,
    });

    if (response.status === 201) {
      const recipe = await response.json();
      navigate(`/recipe/${recipe.id}`);
    } else {
      const re = await response.json();
      setPublishDisable(false);
      // Show error message from backend
      setErrorMessage(re.message);
    }
  };

  // Convert uploaded image to dataurl and show
  const handleAddMainImage = async (e) => {
    const file = e.target.files[0];
    const imageData = await fileToDataUrl(file);
    setMainImage(imageData);
  };

  // Check if logged in, if not then vanigate to error page
  useEffect(() => {
    requestIsLogin()
      .then((responseObj) => {
        if (!responseObj.user_is_logged_in) navigate("/error");
      })
      .catch((error) => {
        console.error("Failed to get login status", error);
        navigate("/error");
      });
  }, []);

  return (
    <>
      <ScrumLegendBar isSignedIn={true} curPage="createrecipe" />
      <CloseIcon
        src={xmark}
        onClick={() => {
          navigate(-1);
        }}
      />
      <Container>
        <form onSubmit={handleSubmit}>
          <label>
            <MainPhoto src={mainImage ? mainImage : recipeDefault} alt={"Click here to upload a picture"} />
            <input
              name="image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleAddMainImage(e)}
            />
            <div style={{ fontSize: "30px", fontWeight: "400", display: "block", width: "100%", textAlign: "center" }}>
              Upload a picture here*
            </div>
          </label>

          {/* Recipe name input section */}
          <div style={NameContainerStyle}>
            <InputRecipeName name="recipeName" placeholder="Recipe Name*" />
          </div>

          <Grid container spacing={2}>
            {/* Cooking style, Cuisine, Meal-type, Preparation time input section */}
            {infoName.map((item) => (
              <CollectInfo key={item} info={item} />
            ))}
            <CollectMealType />
            <CollectTime />

            {/* Tag input section */}
            <Grid item xs={12}>
              <RecipeInfoName>Tags (optional)</RecipeInfoName>
            </Grid>
            <CollectTags key={"1tag"} range={1} />
            <CollectTags key={"2tag"} range={2} />
            <CollectTags key={"3tag"} range={3} />
            <CollectTags key={"4tag"} range={4} />
            <CollectTags key={"5tag"} range={5} />
            <CollectTags key={"6tag"} range={6} />

            <Grid item xs={12}>
              <RecipeInfoNameWithBorder>
                Ingredients*
                <span style={{ float: "right", fontSize: "24px" }}>
                  servings*
                  <InputText
                    type="number"
                    min="1"
                    name={"servings"}
                    style={{ width: "50px", height: "40px", marginLeft: "10px", marginRight: "20px" }}
                  />
                </span>
              </RecipeInfoNameWithBorder>
            </Grid>

            {/* Ingredient input section */}
            <Grid item xs={6}>
              <div style={{ width: "320px", textAlign: "center", display: "inline-block" }}>Ingredients name</div>
              <div style={{ width: "100px", textAlign: "center", display: "inline-block" }}>quantity</div>
              <div style={{ width: "60px", textAlign: "center", display: "inline-block" }}>units</div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ width: "320px", textAlign: "center", display: "inline-block" }}>Ingredients name</div>
              <div style={{ width: "100px", textAlign: "center", display: "inline-block" }}>quantity</div>
              <div style={{ width: "60px", textAlign: "center", display: "inline-block" }}>units</div>
            </Grid>
            <CollectIngredients key={"1ingre"} rank={1} />
            <CollectIngredients key={"2ingre"} rank={2} />
            <CollectIngredients key={"3ingre"} rank={3} />
            <CollectIngredients key={"4ingre"} rank={4} />
            <CollectIngredients key={"5ingre"} rank={5} />
            <CollectIngredients key={"6ingre"} rank={6} />
            <CollectIngredients key={"7ingre"} rank={7} />
            <CollectIngredients key={"8ingre"} rank={8} />
            <CollectIngredients key={"9ingre"} rank={9} />
            <CollectIngredients key={"10ingre"} rank={10} />

            {/* Cooking steps input section */}
            <Grid item xs={12}>
              <RecipeInfoNameWithBorder>Steps*</RecipeInfoNameWithBorder>
            </Grid>
            <Grid item xs={12}>
              <InputTextArea name="steps" placeholder={"Detailed description"}></InputTextArea>
            </Grid>

            {/* Plating steps input section */}
            <Grid item xs={12}>
              <RecipeInfoNameWithBorder>Plating Instruction</RecipeInfoNameWithBorder>
            </Grid>
            <Grid item xs={12}>
              <InputTextArea
                name="platingInst"
                style={{ height: "150px" }}
                placeholder={"Plating description"}
              ></InputTextArea>
            </Grid>
          </Grid>

          {/* Error message display*/}
          <div style={{ fontSize: "30px", fontWeight: "400", display: "block", width: "100%" }}>
            Field with * is required
          </div>
          <ErrorMessage>{errorMessage}</ErrorMessage>

          <div style={{ textAlign: "center", width: "100%", marginTop: "30px" }}>
            <ButtonYellow type="submit" disabled={publishDisable}>
              Publish
            </ButtonYellow>
          </div>
        </form>
      </Container>
      <Footer />
    </>
  );
};

export default CreateRecipe;
