import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { commonApi } from "../API/AuthRequests";
import ScrumLegendBar from "../component/AppBar";
import FoodCard from "../component/FoodCard";
import Footer from "../component/Footer";
import Title from "../component/Title";
import { RECIPE } from "../config";

// Page to show newsfeed, which is the recipes from subscribed users
const MyNewsFeed = () => {
  const [recipes, setRecipes] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const navigate = useNavigate();

  // Get feed recipe data
  const fetchData = () => {
    commonApi(RECIPE.FEED).then((res) => {
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
      <ScrumLegendBar curPage="MyNewsFeed" />
      <Container>
        <Title>News Feeds</Title>
        {isDataLoaded ? (
          <>
            {/* Recipes section */}
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
                        onLikesClick={() => {}}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "24px", fontSize: "24px" }}>
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
      </Container>
      <Footer />
    </>
  );
};
export default MyNewsFeed;
