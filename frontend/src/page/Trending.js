import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";

import ScrumLegendBar from "../component/AppBar";
import FoodCard from "../component/FoodCard";
import Footer from "../component/Footer";
import Title from "../component/Title";
import { RECIPE } from "../config";

// Show trending recipe (popular right now)
const Trending = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [trendingRecipe, setTrendingRecipe] = React.useState();

  // Get trending recipes
  const handleFetchTrending = async () => {
    const trendingRequest = await fetch(RECIPE.TRENDING, {
      method: "GET",
      credentials: "include",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    });

    if (trendingRequest.status === 200) {
      const recipe = await trendingRequest.json();
      setTrendingRecipe(recipe);
      setIsDataLoaded(recipe);
    }
  };

  // Initial loading
  useEffect(() => {
    handleFetchTrending();
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <ScrumLegendBar curPage="Trending" />
      <Container>
        <Title>Popular Right Now</Title>
        <Grid container spacing={2} justifyContent="space-equal">
          {isDataLoaded ? (
            <>
              {trendingRecipe?.length ? (
                <Grid container spacing={2}>
                  {/* Recipes section */}
                  {trendingRecipe?.map((item) => {
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
                          onImgClick={() => {
                            navigate(`/recipe/${item.id}`);
                          }}
                          onLikesClick={() => {}}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    marginTop: "24px",
                    fontSize: "24px",
                  }}
                >
                  Currently nothing is trending on the website!
                </div>
              )}
            </>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <CircularProgress sx={{ color: "#18204a" }} />
              <Box sx={{ fontSize: "24px", pl: 4 }}>Loading trending recipes...</Box>
            </Box>
          )}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};
export default Trending;
