import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import styled from "styled-components";

import SearchBanner from "../asset/search_banner.png";
import ScrumLegendBar from "../component/AppBar";
import FoodCard from "../component/FoodCard";
import Footer from "../component/Footer";
import SearchBar from "../component/SearchBar";
import Title from "../component/Title";

const BannerImg = styled.img`
  display: block;
  margin: 50px auto;
  height: 460px;
  width: 600px;
  border-radius: 14px;
`;

// Page to show search result of recipes
const SearchingResult = () => {
  const [recipes, setRecipes] = useState([]);

  const navigate = useNavigate();
  const ImgClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  // Get recipe search result from search
  useEffect(() => {
    setRecipes(window.recipeList);
  }, [window.recipeList]);
  return (
    <>
      <ScrumLegendBar curPage="HomePage" />
      <Container>
        <BannerImg src={SearchBanner} />
        <SearchBar />
        <>
          <Title>Search Results</Title>
          {!!recipes?.length && (
            <Grid container spacing={2}>
              {/* Recipes section */}
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
          )}
        </>
      </Container>
      <Footer />
    </>
  );
};
export default SearchingResult;
