import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import styled from "styled-components";

import { commonApi } from "../API/AuthRequests";
import FeedBanner from "../asset/feed_banner.png";
import ScrumLegendBar from "../component/AppBar";
import FoodCard from "../component/FoodCard";
import Footer from "../component/Footer";
import Title from "../component/Title";
import { RECIPE, RECIPE_RECOMMENDATION } from "../config";

const Img = styled.img`
  display: block;
  margin: 50px auto;
  width: 960px;
  border-radius: 14px;
`;

const MoreRecommendation = () => {
  const { rid } = useParams();
  const [baseRecipeName, setBaseRecipeName] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const navigate = useNavigate();

  const fetchData = () => {
    // Load recipe data - to get the recipe name
    commonApi(RECIPE.DATA_URL(rid)).then((res) => {
      setBaseRecipeName(res.name);
    });
    // Load recommendations for the recipe
    commonApi(RECIPE_RECOMMENDATION.DATA_URL(rid)).then((res) => {
      setRecipes(res);
      setIsDataLoaded(true);
    });
  };

  const ImgClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  // Initial fetch data
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ScrumLegendBar isSignedIn={true} curPage="Homepage" />
      <Container>
        <Img src={FeedBanner} />
        <Title>{baseRecipeName} -- More Recommendations</Title>
        {/* Recipes section */}
        {isDataLoaded ? (
          <>
            {recipes?.length ? (
              <Grid container spacing={2}>
                {recipes?.map((item) => {
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
            ) : (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "24px", fontSize: "24px" }}>
                No related recipes!
              </div>
            )}
          </>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress sx={{ color: "#18204a" }} />
            <Box sx={{ fontSize: "24px", pl: 4 }}>Loading recommended recipes...</Box>
          </Box>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "24px",
          }}
        >
          <Button
            variant="contained"
            style={{ background: "#1a2047", fontWeight: "bold", borderRadius: "14px" }}
            onClick={() => {
              navigate(-1);
            }}
          >
            Return To Recipe
          </Button>
        </div>
      </Container>
      <Footer />
    </>
  );
};
export default MoreRecommendation;
