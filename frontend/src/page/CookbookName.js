import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import styled from "styled-components";

import { commonApi } from "../API/AuthRequests";
import { requestRemoveCookbookRecipe } from "../API/DataRequests";
import DeleteImg from "../asset/delete.png";
import Banner from "../asset/feed_banner.png";
import ScrumLegendBar from "../component/AppBar";
import AutoSnackbar from "../component/AutoSnackbar";
import CreateCookbook from "../component/CreateCookbook";
import FoodCard from "../component/FoodCard";
import Footer from "../component/Footer";
import ShareButtons from "../component/ShareButtons";
import Title from "../component/Title";
import { COOKBOOK } from "../config";

const Img = styled.img`
  display: block;
  margin: 50px auto;
  height: 460px;
  border-radius: 14px;
`;

const Edit = styled.span`
  margin-left: 24px;
  font-weight: 300;
  font-size: 24px;
  cursor: pointer;
`;

const Delete = styled.img`
  margin-left: 24px;
  width: 37px;
  height: 34px;
  cursor: pointer;
  vertical-align: sub;
`;

// This page is for viewing a single cookbook
const CookbookName = () => {
  // State for cookbook data
  const [cookbook, setCookbook] = useState({});
  // State to show popup for editing cookbooks
  const [showCreateCookbook, setShowCreateCookbook] = useState(false);
  // State for notification
  const [snackbar, setSnackbar] = useState({ open: false, text: "" });
  const { id } = useParams();

  const navigate = useNavigate();

  // Get single cookbook data
  const fetchData = () => {
    commonApi(COOKBOOK.SINGLE_URL(id))
      .then((res) => {
        setCookbook(res[0]);
      })
      .catch(() => {
        setCookbook(undefined);
      });
  };

  const ImgClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  // Delete recipe from cookbook
  function handleRecipeRemove(event, rid, recipeIndex) {
    // To avoid clicking on the card too
    event.stopPropagation();
    event.preventDefault();

    // remove from recipe array to avoid multiple remove
    const newCookbook = JSON.parse(JSON.stringify(cookbook));
    newCookbook.recipes.splice(recipeIndex, 1);
    setCookbook(newCookbook);

    // request remove from cookbook
    requestRemoveCookbookRecipe(JSON.stringify({ id: id, rid: [rid] }))
      .then(() => {
        setSnackbar({ open: true, severity: "success", text: "Recipe removed from cookbook!" });
        // This will refresh everytime which is not desired but serves as a temporary solution
        fetchData();
      })
      .catch((error) => {
        console.error("Delete recipe failed", error);
        setSnackbar({
          open: true,
          severity: "error",
          text: "Failed to remove recipe from cookbook. Please contact developer team.",
        });
      });
  }

  // Initial fetch data
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ScrumLegendBar curPage="HomePage" />
      <Container>
        <Img src={Banner} />
        <Title>
          <Grid container justifyContent="space-between">
            {/* Cookbook name, edit btn, delete btn, and description */}
            <Grid item>
              <div style={{ marginBottom: "14px" }}>
                {cookbook?.cookbook_name}
                {cookbook?.curr_user && (
                  <>
                    <Edit
                      onClick={() => {
                        setShowCreateCookbook(true);
                      }}
                    >
                      Edit
                    </Edit>
                    <Delete
                      src={DeleteImg}
                      onClick={() => {
                        commonApi(COOKBOOK.DATA_URL(), "DELETE", { id }).then(() => {
                          navigate(-1);
                        });
                      }}
                    ></Delete>
                  </>
                )}
              </div>
              <div style={{ fontSize: "22px", fontWeight: 500 }}>{cookbook?.cookbook_des}</div>
            </Grid>

            {/* Social media sharing buttons */}
            {cookbook && (
              <Grid item>
                <Box sx={{ mt: 0.5 }}>
                  <ShareButtons
                    type="cookbook"
                    subject="Check out this awesome cookbook on FaceCookBook"
                    body="Here is the cookbook"
                    size={38}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </Title>

        {/* Popup for creating editing the cookbook data */}
        {cookbook?.cookbook_name && (
          <CreateCookbook
            id={id}
            title="Edit A Cookbook"
            createTitle="Edit"
            editObj={{ name: cookbook?.cookbook_name, description: cookbook?.cookbook_des }}
            open={showCreateCookbook}
            close={() => setShowCreateCookbook(false)}
            fetchData={fetchData}
          />
        )}

        {/* Recipes section */}
        {cookbook?.recipes?.length ? (
          <Grid container spacing={2}>
            {cookbook?.recipes?.map((item, recipeIndex) => {
              // Allow deleting operations if owner of cookbook
              if (cookbook?.curr_user)
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
                        handleRecipeRemove(event, item.id, recipeIndex);
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
        ) : (
          // Handle empty cookbook edge cases
          <>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "24px", fontSize: "24px" }}>
              {cookbook ? (
                <> {"You haven't added any recipes to the cookbook yet!"} </>
              ) : (
                <> {"This cookbook doesn't exist!"} </>
              )}
            </div>
          </>
        )}
      </Container>
      <Footer />
      <AutoSnackbar state={snackbar} setter={setSnackbar} />
    </>
  );
};
export default CookbookName;
