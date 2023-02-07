import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import styled from "styled-components";

import { commonApi } from "../API/AuthRequests";
import Banner from "../asset/banner.png";
import ScrumLegendBar from "../component/AppBar";
import CookbookCard from "../component/CookbookCard";
import Footer from "../component/Footer";
import Title from "../component/Title";
import { COOKBOOK } from "../config";

const BannerImg = styled.img`
  display: block;
  margin: 50px auto;
  height: 460px;
  width: 600px;
  border-radius: 14px;
`;

// Page to show list of cookbooks
const MyCookbooks = () => {
  const [cookbooks, setCookbooks] = useState([]);
  const userId = useParams().userid;

  // Get cookbooks data
  useEffect(() => {
    commonApi(COOKBOOK.DATA_URL(userId)).then((userRes) => {
      setCookbooks(userRes);
    });
  }, []);

  return (
    <>
      <ScrumLegendBar curPage="HomePage" />
      <Container>
        <BannerImg src={Banner} />
        <Title>My Cookbooks</Title>
        <Grid container spacing={2}>
          {/* Cookbooks section */}
          {cookbooks?.map((item) => {
            return (
              <Grid item xs={4} key={item.cookbook_id}>
                <CookbookCard
                  id={item.cookbook_id}
                  img={item.recipes[0]?.image}
                  name={item.cookbook_name}
                  numRecipes={item.recipes.length}
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};
export default MyCookbooks;
