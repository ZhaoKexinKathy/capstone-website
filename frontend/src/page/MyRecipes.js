import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import styled from "styled-components";

import { commonApi, requestIsLogin } from "../API/AuthRequests";
import { requestDeleteRecipe } from "../API/DataRequests";
import Banner from "../asset/banner.png";
import ScrumLegendBar from "../component/AppBar";
import AutoSnackbar from "../component/AutoSnackbar";
import FoodCard from "../component/FoodCard";
import Footer from "../component/Footer";
import Title from "../component/Title";
import { USER } from "../config";

const Img = styled.img`
  display: block;
  margin: 50px auto;
  height: 460px;
  width: 600px;
  border-radius: 14px;
`;

// Page to show list of recipes from a single user
const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, text: "" });

  const navigate = useNavigate();
  const params = useParams();

  // Get user profile data
  const fetchData = () => {
    commonApi(USER.DATA_URL(params.userid)).then((userRes) => {
      setRecipes(userRes.recipes);
      setOwnerName(userRes.username);
    });
  };

  const ImgClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  function handleRecipeDelete(event, rid, recipeIndex) {
    // To avoid clicking on the card too
    event.stopPropagation();
    event.preventDefault();

    // remove from recipe array to avoid multiple remove
    const newRecipes = JSON.parse(JSON.stringify(recipes));
    newRecipes.splice(recipeIndex, 1);
    setRecipes(newRecipes);

    // request delete
    requestDeleteRecipe(JSON.stringify({ id: rid }))
      .then(() => {
        setSnackbar({ open: true, severity: "success", text: "Deleted recipe!" });
        // console.log(responseObj);
        // This will refresh everytime which is not desired but serves as a temporary solution
        fetchData();
      })
      .catch((error) => {
        console.error("Delete recipe failed", error);
        setSnackbar({
          open: true,
          severity: "error",
          text: "Failed to delete recipe. Please contact developer team.",
        });
      });
  }

  // Initial load data
  useEffect(() => {
    // Load recipe data
    fetchData();

    // load user data
    requestIsLogin()
      .then((responseObj) => {
        if (responseObj.user_is_logged_in && responseObj.user_id === Number(params.userid)) {
          setIsOwner(true);
        }
      })
      .catch((error) => {
        console.error("Failed to get login status", error);
      });
  }, []);

  return (
    <>
      <ScrumLegendBar curPage="HomePage" />
      <Container>
        <Img src={Banner} />
        {isOwner ? (
          <Title>My Recipes</Title>
        ) : (
          <Title style={{ textTransform: "capitalize" }}>{`${ownerName}'s Recipes`}</Title>
        )}

        <Grid container spacing={2}>
          {/* Recipes section, allow delete only when is recipe owner */}
          {recipes?.map((item, recipeIndex) => {
            if (isOwner)
              return (
                <Grid item xs={4} key={item.id}>
                  <FoodCard
                    img={item.image}
                    title={item.name}
                    subTitle={item.tags?.join(", ")}
                    name={item.uploaded_by}
                    time={item.time}
                    collect={item.user_rating}
                    likes={item.total_rating}
                    onImgClick={() => ImgClick(item.id)}
                    onDeleteClick={(event) => {
                      handleRecipeDelete(event, item.id, recipeIndex);
                    }}
                  />
                </Grid>
              );
            else
              return (
                <Grid item xs={4} key={item.id}>
                  <FoodCard
                    img={item.image}
                    title={item.name}
                    subTitle={item.tags?.join(", ")}
                    name={item.uploaded_by}
                    time={item.time}
                    collect={item.user_rating}
                    likes={item.total_rating}
                    onImgClick={() => ImgClick(item.id)}
                  />
                </Grid>
              );
          })}
        </Grid>
      </Container>
      <Footer />
      <AutoSnackbar state={snackbar} setter={setSnackbar} />
    </>
  );
};
export default MyRecipes;
