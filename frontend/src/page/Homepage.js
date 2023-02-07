import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import styled from "styled-components";

import { requestIsLogin } from "../API/AuthRequests";
import ScrumLegendBar from "../component/AppBar";
import FoodCard from "../component/FoodCard";
import Footer from "../component/Footer";
import SearchBar from "../component/SearchBar";
import Title from "../component/Title";
import { RECIPE } from "../config";

const Slogan = styled.div`
  font-size: 72px;
  font-family: "Poppins", cursive;
  font-weight: 600;
  text-align: center;
  margin-top: 200px;
  margin-bottom: 200px;
  margin-left: auto;
  margin-right: auto;
`;

// Homepage that shows general info
const Homepage = () => {
  const [isLogIn, setIsLogIn] = React.useState(false);
  const [isTrendDataLoaded, setIsTrendDataLoaded] = React.useState(false);
  const [isFeedDataLoaded, setIsFeedDataLoaded] = React.useState(false);
  const [trendingRecipe, setTrendingRecipe] = React.useState([]);
  const [feedRecipe, setFeedRecipe] = React.useState([]);

  const navigate = useNavigate();

  const ImgClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  // Load recipes
  const handleFetchHomepageDate = async () => {
    // Load feed data first if logged in
    if (isLogIn === true) {
      const feedRequest = await fetch(RECIPE.FEED, {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      });

      if (feedRequest.status === 200) {
        const recipe = await feedRequest.json();
        setFeedRecipe(recipe);
        setIsFeedDataLoaded(true);
      }
    }

    // Then load trending data
    const trendingRequest = await fetch(RECIPE.TRENDING, {
      method: "GET",
      credentials: "include",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    });

    if (trendingRequest.status === 200) {
      const recipe = await trendingRequest.json();
      setTrendingRecipe(recipe);
      setIsTrendDataLoaded(true);
    }
  };

  // Initial loading
  useEffect(() => {
    // load profile data
    requestIsLogin()
      .then((responseObj) => {
        setIsLogIn(responseObj.user_is_logged_in);
      })
      .catch((error) => {
        console.error("Failed to get login status", error);
      });
  }, []);

  // Fetch data everytime login status is updated
  useEffect(() => {
    handleFetchHomepageDate();
  }, [isLogIn]);

  return (
    <>
      <ScrumLegendBar curPage="HomePage" />
      <Container>
        <Slogan>The quickest way to find the interesting recipes</Slogan>
        <SearchBar />
        {/* News feed section. Show news feed only when logged in. */}
        {isLogIn ? (
          <>
            <Title>News Feed</Title>
            {isFeedDataLoaded ? (
              <>
                {feedRecipe?.length ? (
                  <Grid container spacing={2} sx={{ maxHeight: "50vh", overflow: "auto" }}>
                    {feedRecipe?.map((item) => {
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
                    {"You haven't subscribed to anyone yet!"}
                  </div>
                )}
              </>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress sx={{ color: "#18204a" }} />
                <Box sx={{ fontSize: "24px", pl: 4 }}>Loading news feed...</Box>
              </Box>
            )}
          </>
        ) : (
          <></>
        )}
        {/* Trending recipes section */}
        <Title>Popular Right Now</Title>
        <Grid container spacing={2} justifyContent="space-equal">
          {isTrendDataLoaded ? (
            <>
              {trendingRecipe?.length ? (
                <Grid container spacing={2}>
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
            // Loading icon...
            <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
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

export default Homepage;
