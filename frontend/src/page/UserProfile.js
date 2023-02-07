import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import AddIcon from "@mui/icons-material/Add";
import { CardActionArea } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { requestIsLogin } from "../API/AuthRequests";
import { requestProfileEdit, requestUserCookbook, requestUserData } from "../API/DataRequests";
import { requestSubscribe, requestUnsubscribe } from "../API/SubscribeRequests";
import profileHouseImg from "../asset/profileHouse.jpg";
import profilePizzaImg from "../asset/profilePizza.jpg";
import profileSushiImg from "../asset/profileSushi.jpg";
import ScrumLegendBar from "../component/AppBar";
import AutoSnackbar from "../component/AutoSnackbar";
import CookbookCard from "../component/CookbookCard";
import CreateCookbook from "../component/CreateCookbook";
import DividerLine from "../component/DividerLine";
import RecipeCard from "../component/FoodCard";
import Footer from "../component/Footer";

const ProfileAvatar = styled(Avatar)`
  float: right;
  display: block;
  width: 40%;
  height: auto;
  z-index: 1;
`;
const ProfileDecImg = styled.img`
  position: relative;
  top: -10%;
  margin-bottom: -10%;
  display: block;
  width: 80%;
  height: auto;
`;

const ProfileDecImgRight = styled.img`
  float: right;
  display: block;
  width: 30%;
  height: auto;
`;

const SectionTitleText = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;
  font-weight: bold;
  font-size: 32px;
  width: 100%;
`;

const ProfileText = styled.div`
  font-weight: bold;
  font-size: 24px;
  overflow-wrap: break-word;
`;

const SubscriptionButton = styled(Button)({
  textTransform: "none",
  borderRadius: "16px",
  backgroundColor: "#F8D750",
  padding: "0 24px",
  fontSize: "24px",
  fontFamily: "Gloria Hallelujah, cursive !important",
  border: "2px solid #F8D750",
  color: "#18204a",
  "&:hover": {
    backgroundColor: "#fceba2",
  },
});

const SubButton = styled(Button)({
  textTransform: "none",
  borderRadius: "16px",
  backgroundColor: "#F8D750",
  padding: "0 24px",
  fontSize: "24px",
  // fontFamily: "Gloria Hallelujah, cursive !important",
  border: "2px solid #F8D750",
  color: "#18204a",
  "&:hover": {
    backgroundColor: "#fceba2",
  },
});

const UnSubButton = styled(Button)({
  textTransform: "none",
  borderRadius: "16px",
  backgroundColor: "inherit",
  padding: "0 24px",
  fontSize: "24px",
  // fontFamily: "Gloria Hallelujah, cursive !important",
  border: "2px solid #F8D750",
  color: "#ebce2f",
  "&:hover": {
    backgroundColor: "#fceba2",
  },
});

const EditButton = styled(Button)({
  textTransform: "none",
  borderRadius: "16px",
  padding: "0 24px",
  fontSize: "20px",
  color: "#18204a",
  border: 0,
  "&:hover": {
    border: 0,
  },
});

// Section title for My Cookbooks, My Recipes, Shopping List, Meal Plan
// props.name, props.to, props.onClickAdd
function SectionTitle(props) {
  const to = props.to || {};
  const onClickAdd = props.onClickAdd || undefined;
  const name = props.name || "Unknown Title";
  return (
    <>
      <DividerLine />
      <Stack direction="row" alignItems="center">
        <CardActionArea
          component={RouterLink}
          to={to}
          sx={{
            px: 1,
            borderRadius: 6,
            height: "100%",
          }}
        >
          <SectionTitleText style={{ textTransform: "capitalize" }}>{name}</SectionTitleText>
        </CardActionArea>
        {onClickAdd && (
          <IconButton onClick={onClickAdd}>
            <AddIcon sx={{ color: "#18204a" }} />
          </IconButton>
        )}
      </Stack>
      <DividerLine />
    </>
  );
}

// Component to show/edit user data (name, email)
// props.name, props.label, props.value, props.setter, props.allowEdit
function ProfileLine(props) {
  const [showEdit, setShowEdit] = useState(false);
  const allowEdit = props.allowEdit || false;

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleSave = () => {
    setShowEdit(false);
  };

  // send request to edit user data
  const handleSubmit = (event) => {
    event.preventDefault();
    const userProfileFD = new FormData(event.currentTarget);
    const formDataObj = {};
    userProfileFD.forEach((value, key) => {
      formDataObj[key] = value;
    });
    props.setter(formDataObj[`${props.name}`]);

    requestProfileEdit(JSON.stringify(formDataObj)).catch((error) => {
      console.error("Profile edit failed", error);
      alert(error);
    });
  };

  // Forced to use display:'none' instead of conditional rendering due to form contraints
  return (
    <>
      <Grid container component="form" onSubmit={handleSubmit} spacing={1} alignItems="center" wrap="nowrap">
        <Grid item xs={3} md={3}>
          {props.label}
        </Grid>
        <Grid item xs={7} md={7}>
          <TextField
            fullWidth
            variant="standard"
            id={props.name}
            // label={props.label}
            name={props.name}
            defaultValue={props.value}
            inputProps={{ style: { fontSize: "24px", fontWeight: "bold", padding: "0 0 2px 0" } }}
            sx={{
              background: "inherit",
              borderRadius: 3,
              display: showEdit ? "" : "none",
            }}
          />
          <ProfileText>{!showEdit && props.value}</ProfileText>
        </Grid>
        <Grid item xs={2} md={2}>
          <EditButton variant="outlined" onClick={handleEdit} sx={{ display: !showEdit && allowEdit ? "" : "none" }}>
            Edit
          </EditButton>
          <EditButton variant="outlined" type="submit" onClick={handleSave} sx={{ display: showEdit ? "" : "none" }}>
            Save
          </EditButton>
        </Grid>
      </Grid>
    </>
  );
}

const UserProfile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userId, setUserId] = useState(useParams().userid);
  const [isProfileOwner, setIsProfileOwner] = useState(false);

  const [userName, setUserName] = useState(undefined);
  const [userEmail, setUserEmail] = useState(undefined);

  const [recipeList, setRecipeList] = useState([]);
  const [cookbookList, setCookbookList] = useState([]);

  const [snackbar, setSnackbar] = useState({ open: false, text: "" });
  const [showCreateCookbook, setShowCreateCookbook] = useState(false);

  const navigate = useNavigate();

  // Subscribe to user and update state
  const handleSubscribe = (userId) => {
    if (isLoggedIn) {
      const formDataObj = {
        subscribed_to: userId,
      };
      requestSubscribe(JSON.stringify(formDataObj))
        .then(() => {
          setIsSubscribed(true);
        })
        .catch((error) => {
          console.error("subscribe failed", error);
        });
    } else {
      setSnackbar({ open: true, severity: "info", text: "Please login first" });
    }
  };

  // Unsubscribe and update state
  const handleUnsubscribe = (userId) => {
    const formDataObj = {
      unsubscribe: userId,
    };
    requestUnsubscribe(JSON.stringify(formDataObj))
      .then(() => {
        setIsSubscribed(false);
      })
      .catch((error) => {
        console.error("unsubscribe failed", error);
      });
  };

  // Initial loading
  useEffect(() => {
    // load profile data
    requestIsLogin()
      .then((responseObj) => {
        if (!responseObj.user_is_logged_in) {
          setIsLoggedIn(false);
          if (!userId) {
            navigate("/");
          }
          //
        } else {
          setIsLoggedIn(true);
          if (userId === undefined) {
            navigate(`/profile/${responseObj.user_id}`);
          }
        }

        // request general user info and recipes
        requestUserData(userId)
          .then((responseObj) => {
            setUserId(responseObj.id);
            setUserName(responseObj.username);
            setUserEmail(responseObj.email);
            setIsSubscribed(responseObj.subscribed);
            setRecipeList(responseObj.recipes);
            setIsProfileOwner(responseObj.curr_user);
          })
          .catch((error) => {
            console.error("Failed to load user data", error);
          });

        // request user cookbooks
        requestUserCookbook(userId)
          .then((responseObj) => {
            setCookbookList(responseObj);
          })
          .catch((error) => {
            console.error("Failed to load user cookbooks", error);
          });
      })
      .catch((error) => {
        console.error("Failed to get login status", error);
      });
  }, []);

  return (
    <>
      <ScrumLegendBar />
      <Container>
        {/* Adding slight mt to avoid margin collapse */}
        <Grid container rowSpacing={4} columnSpacing={1} alignItems="stretch" sx={{ mt: 2 }}>
          {/* Profile image part */}
          <Grid item xs={5} md={5}>
            <ProfileAvatar alt="Profile pic" src={profileSushiImg} />
            <ProfileDecImg alt="Profile dec" src={profileHouseImg} />
          </Grid>
          {/* Profile info part */}
          <Grid item xs={7} md={7}>
            <Stack sx={{ height: "100%" }} spacing={2} justifyContent="flex-end">
              <Box>
                <ProfileDecImgRight alt="Profile dec" src={profilePizzaImg} />
              </Box>
              {/* Wait for userEmail to set value before rendering textfield */}
              {userEmail && (
                <>
                  <ProfileLine
                    name="username"
                    label="Username"
                    value={userName}
                    setter={setUserName}
                    allowEdit={false}
                  />
                  <ProfileLine
                    name="email"
                    label="Email"
                    value={userEmail}
                    setter={setUserEmail}
                    allowEdit={isProfileOwner}
                  />
                </>
              )}
              <Box>
                {/* Subscription buttons */}
                {/* Wait for userEmail, meaning to wait for user data to load */}
                {userEmail && (
                  <>
                    {isProfileOwner ? (
                      <SubscriptionButton
                        component={RouterLink}
                        to={`/profile/${userId}/subscriptions`}
                        sx={{ width: "10em" }}
                      >
                        Subscriptions
                      </SubscriptionButton>
                    ) : (
                      <>
                        {isSubscribed ? (
                          <UnSubButton
                            onClick={() => {
                              handleUnsubscribe(userId);
                            }}
                            sx={{ width: "10em" }}
                          >
                            -Unsubscribe
                          </UnSubButton>
                        ) : (
                          <SubButton
                            onClick={() => {
                              handleSubscribe(userId);
                            }}
                            sx={{ width: "10em" }}
                          >
                            +Subscribe
                          </SubButton>
                        )}
                      </>
                    )}
                  </>
                )}
              </Box>
            </Stack>
          </Grid>

          {/* My cookbooks section */}
          <Grid item xs={12} md={12}>
            <SectionTitle
              name={isProfileOwner ? "My Cookbooks" : userName ? `${userName}'s Cookbooks` : `Cookbooks`}
              onClickAdd={
                isProfileOwner
                  ? () => {
                      setShowCreateCookbook(true);
                    }
                  : undefined
              }
              to={`/profile/${userId}/mycookbooks`}
            />
            <CreateCookbook
              title="Create New Cookbook"
              createTitle="Create"
              open={showCreateCookbook}
              close={() => setShowCreateCookbook(false)}
              fetchData={() => {
                requestUserCookbook(userId)
                  .then((responseObj) => {
                    setCookbookList(responseObj);
                  })
                  .catch((error) => {
                    console.error("Failed to load user cookbooks", error);
                  });
              }}
            />
            {/* The height is fixed to be slightly larger than the height of the cookbook card */}
            <Grid container spacing={2} sx={{ mt: 2, maxHeight: "500px", overflow: "auto" }}>
              {cookbookList?.map((cookbookItem, i) => {
                return (
                  <Grid item xs={4} key={i}>
                    <CookbookCard
                      id={cookbookItem.cookbook_id}
                      key={i}
                      img={cookbookItem.recipes[0]?.image}
                      name={cookbookItem.cookbook_name}
                      numRecipes={cookbookItem.recipes.length}
                    />
                  </Grid>
                );
              })}
            </Grid>
            {cookbookList.length ? (
              <Link
                component={RouterLink}
                to={`/profile/${userId}/mycookbooks`}
                sx={{ mt: 2, fontSize: "20px", color: "#18204a", float: "right", textDecorationColor: "#18204a" }}
              >
                View all Cookbooks
              </Link>
            ) : (
              "Haven't created any Cookbooks."
            )}
          </Grid>

          {/* My recipes section */}
          <Grid item xs={12} md={12}>
            <SectionTitle
              name={isProfileOwner ? "My Recipes" : userName ? `${userName}'s Recipes` : `Recipes`}
              onClickAdd={
                isProfileOwner
                  ? () => {
                      navigate("/createrecipe");
                    }
                  : undefined
              }
              to={`/profile/${userId}/recipes`}
            />
            <Grid container spacing={2} sx={{ mt: 2, maxHeight: "60vh", overflow: "auto" }}>
              {recipeList?.map((recipeItem, i) => {
                return (
                  <Grid item xs={4} key={i}>
                    <RecipeCard
                      id={`recipecard_${i}`}
                      key={i}
                      img={recipeItem.image}
                      title={recipeItem.name}
                      subTitle={recipeItem.cuisine}
                      name={recipeItem.uploaded_by}
                      time={recipeItem.time}
                      likes={recipeItem.total_rating}
                      onImgClick={() => {
                        navigate(`/recipe/${recipeItem.id}`);
                      }}
                      onLikesClick={() => {}}
                    />
                  </Grid>
                );
              })}
            </Grid>
            {recipeList.length ? (
              <Link
                component={RouterLink}
                to={`/profile/${userId}/recipes`}
                sx={{ mt: 2, fontSize: "20px", color: "#18204a", float: "right", textDecorationColor: "#18204a" }}
              >
                View all Recipes
              </Link>
            ) : (
              "Haven't uploaded any recipes."
            )}
          </Grid>

          {isProfileOwner && (
            <>
              {/* Shopping list section */}
              <Grid item xs={6} md={6} sx={{ textAlign: "center" }}>
                <SectionTitle name="My Shopping List" to={`/shoppinglist`} />
                {/* <RecipeCard img={defaultRecipeImg} title='Shopping List' /> */}
              </Grid>
              {/* padding */}
              {/* <Grid item xs /> */}
              {/* Meal plan section */}
              <Grid item xs={6} md={6} sx={{ textAlign: "center" }}>
                <SectionTitle name="Meal Planning" to={`/mealplan`} />
                {/* <RecipeCard img={defaultRecipeImg} title='Meal Plan' /> */}
              </Grid>
            </>
          )}
        </Grid>
      </Container>
      <Footer />
      <AutoSnackbar state={snackbar} setter={setSnackbar} />
    </>
  );
};
export default UserProfile;
