import React from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";

import { requestIsLogin } from "../API/AuthRequests";
import { commonApi } from "../API/AuthRequests";
import { requestUpdateShoppingRecipe } from "../API/ShoppingRequests";
import { requestSubscribe, requestUnsubscribe } from "../API/SubscribeRequests";
import bookBookmark from "../asset/book-bookmark-solid.svg";
import defaultRecipeImg from "../asset/defaultRecipeImage.jpg";
import heartRegular from "../asset/heart-regular.svg";
import heartSolid from "../asset/heart-solid.svg";
import recipePhoto from "../asset/recipePhoto.png";
import thumbsDownRegular from "../asset/thumbs-down-regular.svg";
import thumbsDownSolid from "../asset/thumbs-down-solid.svg";
import xmark from "../asset/x-solid.svg";
import AddCookbook from "../component/AddCookbook";
import ScrumLegendBar from "../component/AppBar";
import AutoSnackbar from "../component/AutoSnackbar";
import { ButtonYellow, ButtonYellowBorder } from "../component/CommonComponent";
import { CloseIcon } from "../component/CommonComponent";
import CreateCookbook from "../component/CreateCookbook";
import FoodCard from "../component/FoodCard";
import Footer from "../component/Footer";
import { InputText, InputTextArea } from "../component/InputText";
import ShareButtons from "../component/ShareButtons";
import { COMMENT, RECIPE } from "../config";
import { COOKBOOK } from "../config";

const RecipeName = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
  padding-bottom: 20px;
  font-weight: bold;
  font-size: 48px;
`;

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

const RecipeInfoContent = styled.span`
  font-size: 32px;
  font-weight: 500;
`;

const Icon = styled.img`
  display: inline;
  width: 30px;
  margin-right: 20px;
  vertical-align: sub;
  cursor: pointer;
`;

const TagsDisplay = styled.span`
  text-align: center;
  margin: 20px;
  padding-left: 40px;
  padding-right: 40px;
  background-color: #f8d750;
  height: 60px;
  font-family: "Gloria Hallelujah", cursive;
  font-size: 28px;
  border-radius: 16px;
`;

const StepTitle = styled.div`
  white-space: pre-wrap;
  font-size: 24px;
  // font-weight: bold;
`;

const AuthorInfo = styled(RecipeInfoName)`
  display: inline;
  a {
    color: #18204a;
  }
`;

// Viewing single recipe with detailed info
export const ViewRecipe = () => {
  const recipeid = useParams().recipeid;

  const [rating, setRating] = React.useState(0);
  const [likeSolid, setLikeSolid] = React.useState(0);
  const [dislikeSolid, setdislikeSolid] = React.useState(0);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState(undefined);
  const [isSubscriped, setIsSubscriped] = React.useState(0);

  const [recipeName, setRecipeName] = React.useState("");
  const [info, setInfo] = React.useState([]);
  const [ingredients, setIngredients] = React.useState([]);
  const [calIngredients, setCalIngredients] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [nutritionInfo, setNutritionInfo] = React.useState([]);
  const [author, setAuthor] = React.useState("");
  const [authorid, setAuthorid] = React.useState();
  const [steps, setSteps] = React.useState();
  const [plating, setPlating] = React.useState();
  const [servingsNum, setServingsNum] = React.useState("3");
  const [userServing, setUserServing] = React.useState("6");
  const [image, setImage] = React.useState(recipePhoto);
  const [recommended, setRecommended] = React.useState([]);
  const [comments, setComments] = React.useState([]);

  const [openCookbook, setOpenCookbook] = React.useState(false);
  const [showCreateCookbook, setShowCreateCookbook] = React.useState(false);
  const [cookbooks, setCookbooks] = React.useState([]);

  const [snackbar, setSnackbar] = React.useState({ open: false, text: "" });

  const navigate = useNavigate();

  const handleLoadData = async () => {
    // Load recipe main information
    const response = await fetch(RECIPE.DATA_URL(recipeid), {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      const recipe = await response.json();

      setInfo({
        "Cooking style": recipe.cooking_style,
        "Meal type": recipe.meal_type,
        Cuisine: recipe.cuisine,
        "Preparation time": recipe.time,
      });
      setRecipeName(recipe.name);
      setIngredients([...recipe.ingredients]);
      setCalIngredients([...recipe.ingredients]);

      setNutritionInfo({
        "Energy (cal)": recipe.calories,
        "Carbs (g)": recipe.carbs,
        "Fats (g)": recipe.fats,
        "Protein (g)": recipe.protein,
      });

      setTags(recipe.tags);
      setSteps(recipe.method);
      setPlating(recipe.plating);
      setServingsNum(recipe.servings);
      setUserServing(recipe.servings);
      setAuthor(recipe.uploaded_by);
      setImage(recipe.image);
      setRating(recipe.total_rating);
      setLikeSolid(recipe.user_rating);
      setIsSubscriped(recipe.is_subscribed);
      setAuthorid(recipe.uid);
    } else {
      const er = await response.json();
      console.error(er.error);
      navigate("/error");
    }

    // Load relative recommendations
    const recomm = await fetch(`${RECIPE.RECOMM}?rid=${recipeid}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (recomm.status === 200) {
      const recRecipe = await recomm.json();
      setRecommended(recRecipe);
    } else {
      const er = await recomm.json();
      console.error(er.error);
    }

    // Load comments
    const comm = await fetch(`${COMMENT}?rid=${recipeid}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (comm.status === 200) {
      const commList = await comm.json();
      setComments(commList);
    } else {
      const er = await comm.json();
      console.error(er.error);
    }
  };

  React.useEffect(() => {
    // Load recipe data
    handleLoadData();
    // Scroll to top of page
    window.scrollTo(0, 0);

    // Get current login status from backend
    requestIsLogin()
      .then((responseObj) => {
        setIsLoggedIn(responseObj.user_is_logged_in);
        setCurrentUserId(responseObj.user_id);
      })
      .catch((error) => {
        console.error("Failed to get login status", error);
      });
  }, []);

  //
  const DisplayInfo = (props) => {
    const info = props.info;
    return (
      <>
        <Grid item xs={5}>
          <RecipeInfoName>{info[0]}</RecipeInfoName>
        </Grid>
        <Grid item xs={7}>
          <RecipeInfoContent>{info[1]}</RecipeInfoContent>
        </Grid>
      </>
    );
  };

  const handleLikesCancelLikes = async () => {
    let earlyExit = false;
    await requestIsLogin().then((responseObj) => {
      if (!responseObj.user_is_logged_in) {
        setSnackbar({ open: true, severity: "warning", text: "You must be logged in to perform this action" });
        earlyExit = true;
      }
    });

    if (dislikeSolid) {
      setSnackbar({ open: true, severity: "warning", text: "Can't like and dislike at the same time" });
      earlyExit = true;
    }

    if (earlyExit) {
      return;
    }

    setLikeSolid(1 - likeSolid);
    const temp = likeSolid ? -1 : 1;
    setRating(rating + temp);

    // user likes the recipe
    if (likeSolid === 0) {
      const response = await fetch(RECIPE.LIKE, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rid: Number(recipeid),
          opinion: true,
        }),
      });
      if (response.status === 200) {
        // const recipe = await response.json();
      } else {
        const er = await response.json();
        console.error(er.error);
      }
    } else {
      // user cancel like the recipe
      const response = await fetch(RECIPE.LIKE, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rid: Number(recipeid),
          opinion: true,
        }),
      });
      if (response.status === 200) {
        // const recipe = await response.json();
      } else {
        const er = await response.json();
        console.error(er.error);
      }
    }
  };

  const handleDislikesCancelDislkes = async () => {
    let earlyExit = false;
    await requestIsLogin().then((responseObj) => {
      if (!responseObj.user_is_logged_in) {
        setSnackbar({ open: true, severity: "warning", text: "You must be logged in to perform this action" });
        earlyExit = true;
      }
    });

    if (likeSolid) {
      setSnackbar({ open: true, severity: "warning", text: "Can't like and dislike at the same time" });
      earlyExit = true;
    }

    if (earlyExit) {
      return;
    }

    setdislikeSolid(1 - dislikeSolid);
    const temp = dislikeSolid ? -1 : 1;
    setRating(rating - temp);

    // user likes the recipe
    if (dislikeSolid === 0) {
      const response = await fetch(RECIPE.LIKE, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rid: Number(recipeid),
          opinion: false,
        }),
      });
      if (response.status === 200) {
        // const recipe = await response.json();
      } else {
        const er = await response.json();
        console.error(er.error);
      }
    } else {
      // user cancel like the recipe
      const response = await fetch(RECIPE.LIKE, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rid: Number(recipeid),
        }),
      });
      if (response.status === 200) {
        // const recipe = await response.json();
      } else {
        const er = await response.json();
        console.error(er.error);
      }
    }
  };

  const loadCookbook = () => {
    commonApi(COOKBOOK.DATA_URL())
      .then((res) => {
        // This sets status to open cookbook page
        setCookbooks(res);
      })
      .catch((error) => {
        console.error("Failed to fetch cookbook data", error);
        setSnackbar({
          open: true,
          severity: "error",
          text: "Failed to fetch cookbook data. Please contact developer team.",
        });
      });
  };

  // Add to cookbook operations
  const handleAddToMyCookbook = () => {
    // Check if is logged in first
    if (isLoggedIn) {
      loadCookbook();
      setOpenCookbook(true);
    } else {
      setSnackbar({ open: true, severity: "warning", text: "You must be logged in to perform this action" });
    }
  };

  // Interactive buttons under main image
  const IconArea = () => {
    return (
      <Grid container spacing={8} justifyContent="space-between" alignItems="center" columns={3}>
        <Grid item xs={1}>
          <Icon onClick={handleLikesCancelLikes} src={likeSolid ? heartSolid : heartRegular} />
          <Icon onClick={handleDislikesCancelDislkes} src={dislikeSolid ? thumbsDownSolid : thumbsDownRegular} />
          <RecipeInfoContent style={{ cursor: "auto" }}>Total rating: {rating}</RecipeInfoContent>
        </Grid>
        <Grid item xs={1}>
          <div style={{ display: "inline" }} onClick={handleAddToMyCookbook}>
            <Icon src={bookBookmark} />
            <span style={{ cursor: "pointer" }}>
              <RecipeInfoContent style={{ textDecoration: "underline" }}>Add to cookbook</RecipeInfoContent>
            </span>
          </div>
        </Grid>
        <Grid item xs={1}>
          <ShareButtons
            type="recipe"
            subject="Check out this awesome recipe on FaceCookBook"
            body="Here is the recipe"
            size={38}
          />
        </Grid>
      </Grid>
    );
  };

  // Subscribe/unsubscribe
  const handleSubscripeUnsubscripe = async () => {
    let earlyExit = false;
    await requestIsLogin().then((responseObj) => {
      if (!responseObj.user_is_logged_in) {
        setSnackbar({ open: true, severity: "warning", text: "You must be logged in to perform this action" });
        earlyExit = true;
      }
    });

    if (earlyExit) {
      return;
    }

    if (isLoggedIn) {
      // check subscribe status in backend
      if (isSubscriped) {
        requestUnsubscribe(JSON.stringify({ unsubscribe: authorid }))
          .then(() => {})
          .catch((error) => {
            console.error("unsubscribe failed", error);
            setSnackbar({ open: true, severity: "error", text: "Unsubscribe failed. Please contact developer team." });
          });
      } else {
        requestSubscribe(JSON.stringify({ subscribed_to: authorid }))
          .then(() => {})
          .catch((error) => {
            console.error("subscribe failed", error);
            setSnackbar({ open: true, severity: "error", text: "Subscribe failed. Please contact developer team." });
          });
      }
      setIsSubscriped(1 - isSubscriped);
    } else {
      setSnackbar({ open: true, severity: "warning", text: "You must be logged in to perform this action" });
    }
  };

  // Single formatted tag component
  const TagsdisplayWithContent = (props) => {
    const content = props.content;
    return <TagsDisplay>#{content}</TagsDisplay>;
  };

  // Component to show author and subscrib button
  const AuthorArea = () => {
    return (
      <>
        <Grid item xs={4}>
          <RecipeInfoName style={{ marginTop: "20px" }}>
            Created by:
            <AuthorInfo style={{ marginLeft: "8px" }}>
              <RouterLink to={`/profile/${authorid}`}>{author}</RouterLink>
            </AuthorInfo>
          </RecipeInfoName>
          <br />
        </Grid>
        <Grid item xs={8} sx={{ alignSelf: "center" }}>
          {currentUserId === authorid ? (
            <TagsDisplay>#My recipe</TagsDisplay>
          ) : (
            <>
              {isSubscriped ? (
                <ButtonYellowBorder onClick={handleSubscripeUnsubscripe}>Unsubscribe</ButtonYellowBorder>
              ) : (
                <ButtonYellow onClick={handleSubscripeUnsubscripe}>+ Subscribe</ButtonYellow>
              )}
            </>
          )}
        </Grid>
        <Grid item xs={12}>
          <div style={{ borderBottom: "2px solid #18204A" }}></div>
        </Grid>
      </>
    );
  };

  // Single ingredient/nutrition item
  const IngreAndNutri = (props) => {
    const name = props.name;
    const content = props.content;
    return (
      <Grid item xs={6} key={name}>
        <div style={{ fontSize: "24px", fontWeight: "600" }}>
          {name}
          <span style={{ float: "right", fontWeight: "normal" }}>{content}</span>
        </div>
      </Grid>
    );
  };

  const handleChangeServes = (e) => {
    setUserServing(e.target.value);
    let tempIngre = JSON.parse(JSON.stringify(ingredients));
    let tempSer = e.target.value;
    if (tempSer !== "") {
      for (let i = 0; i < ingredients.length; i++) {
        tempIngre[i].quantity = (ingredients[i].quantity / servingsNum) * tempSer;
        if (!Number.isInteger(tempIngre[i].quantity)) {
          tempIngre[i].quantity = tempIngre[i].quantity.toFixed(2);
        }
      }
      setCalIngredients(tempIngre);
    }
  };

  const handleAddToShoppingList = () => {
    const formDataObj = { rid: recipeid, servings: userServing };
    if (isLoggedIn) {
      requestUpdateShoppingRecipe(JSON.stringify(formDataObj))
        .then(() => {
          setSnackbar({ open: true, severity: "success", text: "Added to shopping list." });
        })
        .catch((error) => {
          console.error("Shopping list update fail", error);
          setSnackbar({
            open: true,
            severity: "error",
            text: "Shopping list update fail. Please contact developer team.",
          });
        });
    } else {
      setSnackbar({ open: true, severity: "warning", text: "You must be logged in to perform this action" });
    }
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      const data = new FormData(e.currentTarget);
      // Quick reset to prevent button spam
      e.currentTarget.reset();
      const bodyData = {
        rid: recipeid,
        comment: data.get("userComment"),
      };

      if (!data.get("userComment").trim()) {
        setSnackbar({ open: true, severity: "warning", text: "Comment must not be empty" });
        return;
      }

      const response = await fetch(COMMENT, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      if (response.status === 201) {
        // Reload data to update comments
        handleLoadData();
      } else {
        const re = await response.json();
        console.error(re);
      }
    } else {
      setSnackbar({ open: true, severity: "warning", text: "You must be logged in to perform this action" });
    }
  };

  // Section to show all ingredients
  const Ingredients = () => {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <RecipeInfoNameWithBorder>
              Ingredients
              <span style={{ float: "right", fontSize: "24px" }}>
                servings
                <InputText
                  type="number"
                  min="1"
                  defaultValue={userServing}
                  style={{ width: "50px", height: "40px", marginLeft: "10px", marginRight: "20px" }}
                  onChange={(e) => handleChangeServes(e)}
                />
                <IconButton onClick={handleAddToShoppingList}>
                  <AddShoppingCartIcon sx={{ color: "#18204a", fontSize: "1.7em" }} />
                </IconButton>
              </span>
            </RecipeInfoNameWithBorder>
          </Grid>
        </Grid>
        <Grid container columnSpacing={40} rowSpacing={2}>
          {calIngredients.map((ingredient, i) => (
            <IngreAndNutri
              key={`${ingredient.ingredient}_${i}`}
              name={ingredient.ingredient}
              content={`${ingredient.quantity} ${ingredient.units}`}
            />
          ))}
        </Grid>
      </>
    );
  };

  // Section to show all nutrition info
  const NutritionInfo = (props) => {
    const nutritionInfo = props.info;
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <RecipeInfoNameWithBorder>
              Nutrition Information
              <span style={{ float: "right", fontSize: "24px", paddingTop: "6px" }}>per serving</span>
            </RecipeInfoNameWithBorder>
          </Grid>
        </Grid>
        <Grid container columnSpacing={40} rowSpacing={2}>
          {Object.entries(nutritionInfo).map((nutritionItem, i) => (
            <IngreAndNutri
              key={`${nutritionItem[0]}_${i}`}
              name={nutritionItem[0]}
              content={parseFloat(nutritionItem[1].toFixed(2)).toLocaleString()}
            />
          ))}
        </Grid>
      </>
    );
  };

  // Single comment component
  const SingleComment = (props) => {
    const { username, comment, uid } = props;
    return (
      <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "40px", marginBottom: "40px" }}>
        From <a href={"/profile/" + uid}>{username}</a>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "500",
            marginBottom: "20px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "5px 5px 5px 5px",
            whiteSpace: "pre-wrap",
          }}
        >
          {comment}
        </div>
      </div>
    );
  };

  return (
    <>
      <ScrumLegendBar isSignedIn={true} curPage="viewrecipe" />
      <CloseIcon
        src={xmark}
        onClick={() => {
          navigate(-1);
        }}
      />
      <Container>
        <img
          src={image}
          style={{
            display: "block",
            maxWidth: "100%",
            minHeight: "30vh",
            maxHeight: "60vh",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <IconArea />
        <RecipeName>{recipeName}</RecipeName>
        <Grid container spacing={3}>
          <AuthorArea />
          {/* Display recipe high level info */}
          {Object.entries(info).map((q) => (
            <DisplayInfo key={q[0]} info={q} />
          ))}
          <Grid item xs={5}>
            <RecipeInfoName>Tags</RecipeInfoName>
          </Grid>
          <Grid item xs={7}></Grid>
          {tags.map((tag) => (
            <TagsdisplayWithContent key={tag} content={tag} />
          ))}
        </Grid>

        <Ingredients ingredients={ingredients} />
        <NutritionInfo info={nutritionInfo} />

        <RecipeInfoNameWithBorder>Steps</RecipeInfoNameWithBorder>
        <StepTitle>{"     " + steps?.replaceAll(/[\n]+[ \t]*/g, "\n     ")}</StepTitle>

        <RecipeInfoNameWithBorder>Plating instruction</RecipeInfoNameWithBorder>
        {plating ? (
          <StepTitle>{"     " + plating?.replaceAll(/\n[ \t]*/g, "\n\n     ")}</StepTitle>
        ) : (
          <>There are no plating instructions for this recipe.</>
        )}

        <RecipeInfoNameWithBorder>Recommend for you</RecipeInfoNameWithBorder>
        {recommended === [] ? <div> There is no related recommanded recipe </div> : <></>}
        <Grid container spacing={3}>
          {recommended.length >= 1 ? (
            <Grid item xs={4}>
              <FoodCard
                img={recommended[0].image}
                title={recommended[0].name}
                subTitle={recommended[0].tags?.join(", ")}
                name={recommended[0].uploaded_by}
                time={recommended[0].time}
                collect={recommended[0].user_rating}
                likes={recommended[0].total_rating}
                onImgClick={() => {
                  navigate(`/recipe/${recommended[0].id}`);
                  window.scrollTo(0, 0);
                  window.location.reload();
                }}
                onLikesClick={() => {}}
              ></FoodCard>
            </Grid>
          ) : (
            <></>
          )}
          {recommended.length >= 2 ? (
            <Grid item xs={4}>
              <FoodCard
                img={recommended[1].image}
                title={recommended[1].name}
                subTitle={recommended[1].tags?.join(", ")}
                name={recommended[1].uploaded_by}
                time={recommended[1].time}
                collect={recommended[1].user_rating}
                likes={recommended[1].total_rating}
                onImgClick={() => {
                  navigate(`/recipe/${recommended[1].id}`);
                  window.scrollTo(0, 0);
                  window.location.reload();
                }}
                onLikesClick={() => {}}
              ></FoodCard>
            </Grid>
          ) : (
            <></>
          )}
          {recommended.length >= 3 ? (
            <Grid item xs={4}>
              <FoodCard
                img={recommended[2].image}
                title={recommended[2].name}
                subTitle={recommended[2].tags?.join(", ")}
                name={recommended[2].uploaded_by}
                time={recommended[2].time}
                collect={recommended[2].user_rating}
                likes={recommended[2].total_rating}
                onImgClick={() => {
                  navigate(`/recipe/${recommended[2].id}`);
                  window.scrollTo(0, 0);
                  window.location.reload();
                }}
                onLikesClick={() => {}}
              ></FoodCard>
            </Grid>
          ) : (
            <></>
          )}
          <Grid item xs={12}>
            {recommended.length > 3 ? (
              <Box sx={{ background: "#FFF" }}>
                <Link
                  component={RouterLink}
                  to={`/morerecommendation/${recipeid}`}
                  sx={{ fontSize: "20px", color: "#18204a", float: "right", textDecorationColor: "#18204a" }}
                >
                  View More...
                </Link>
              </Box>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>

        <div />
        <RecipeInfoNameWithBorder>Comments</RecipeInfoNameWithBorder>
        {comments.map((l, i) => (
          <SingleComment username={l.username} comment={l.comment} uid={l.uid} key={i} />
        ))}
        <div style={{ border: "1px solid #18204A", marginBottom: "50px" }}></div>
        <form onSubmit={handleSendComment}>
          <InputTextArea
            placeholder={"Leave your comments here"}
            name="userComment"
            required
            style={{ fontWeight: "normal" }}
          />
          <div style={{ textAlign: "right" }}>
            <ButtonYellow type="submit">Submit</ButtonYellow>
          </div>
        </form>
      </Container>

      {/* Section for Add to cookbook/Create new cookbook popup */}
      <CreateCookbook
        title="Create New Cookbook"
        createTitle="Create"
        open={showCreateCookbook}
        close={() => {
          setShowCreateCookbook(false);
          setOpenCookbook(true);
        }}
        fetchData={() => {
          loadCookbook();
          handleLoadData().then(() => {});
        }}
      />
      <AddCookbook
        open={openCookbook}
        list={cookbooks.map((cookbookItem) => {
          return {
            name: cookbookItem.cookbook_name,
            id: cookbookItem.cookbook_id,
            img: defaultRecipeImg,
          };
        })}
        close={() => setOpenCookbook(false)}
        create={() => {
          setShowCreateCookbook(true);
          setOpenCookbook(false);
        }}
        confirm={(ids) => {
          if (ids.length) {
            const promises = ids.map((item) => {
              return commonApi(COOKBOOK.DATA_URL(), "PUT", { id: item, rid: recipeid });
            });
            Promise.all(promises)
              .then(() => {
                setOpenCookbook(false);
                setSnackbar({ open: true, severity: "success", text: "Recipe saved to cookbook." });
                // handleLoadData()
                //   .then(() => { });
              })
              .catch(() => {
                setSnackbar({
                  open: true,
                  severity: "error",
                  text: "Failed to save recipe to cookbook. Please contact developer team.",
                });
              });
          } else {
            setSnackbar({ open: true, severity: "warning", text: "Select at least one cookbook." });
          }
        }}
        createTitle="Create New Cookbook"
      />
      <AutoSnackbar state={snackbar} setter={setSnackbar} />
      <Footer />
    </>
  );
};

export default ViewRecipe;
