import * as React from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Avatar } from "@mui/material";

import { requestIsLogin, requestLogout } from "../API/AuthRequests";
import { requestUserData } from "../API/DataRequests";
import CreateImg from "../asset/create.png";
import SignoutImg from "../asset/signout.png";
import UserImg from "../asset/user.png";

import { SignIn, SignUp } from "./SignIn";

const MyBar = styled.div`
  font-family: "Poppins", cursive;
  font-weight: bold;
  color: #18204a;
  border-bottom: 2px solid #18204a;
`;

const MyHeader = styled.header`
  font-family: "Poppins", cursive;
  font-style: normal;
  display: inline;
  font-size: 32px;
  padding: 20px;
  a:link {
    text-decoration: none;
  }
  a:visited {
    text-decoration: none;
  }
  a:hover {
    text-decoration: none;
  }
  a:active {
    text-decoration: none;
  }
  a {
    color: #18204a;
  }
  @media (max-width: 820px) {
    display: none;
  }
`;
const CurHeader = styled(MyHeader)`
  padding-left: 18px;
  padding-right: 18px;
  border-top: 2px solid #18204a;
  border-left: 2px solid #18204a;
  border-right: 2px solid #18204a;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: 2px solid #edf0eb;
`;

const Profile = styled.header`
  position: absolute;
  right: 30px;
  top: 80px;
  display: inline;
  margin-bottom: 40px;
`;

const Menu = styled.div`
  position: absolute;
  padding: 24px 24px 14px 24px;
  right: 0;
  top: 90px;
  z-index: 100;
  background: #fff;
  border-radius: 14px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  margin-top: 10px;
  margin-bottom: 10px;
  white-space: nowrap;
  font-weight: 300;
  color: #000;
  cursor: pointer;
`;

const MenuIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 14px;
`;

const MyLogoHeader = styled.header`
  font-size: 37px;
  display: inline;
  font-weight: 900;
  font-style: italic;
  padding: 20px;
  a:link {
    text-decoration: none;
  }
  a:visited {
    text-decoration: none;
  }
  a:hover {
    text-decoration: none;
  }
  a:active {
    text-decoration: none;
  }
  a {
    color: #18204a;
  }
`;

const MyButton = styled.button`
  width: 150px;
  height: 60px;
  border-radius: 16px;
  background-color: #18204a;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  float: right;
  cursor: pointer;
`;

const ProfilePhoto = (props) => {
  const username = props.username;
  const handleSignOut = props.signOut;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleOpenCreateRecipe = () => {
    navigate("/createrecipe");
  };

  const handleOpenProfile = () => {
    navigate("/profile");
  };

  const handleOpenShoppingList = () => {
    navigate("/shoppinglist");
  };

  return (
    <>
      <Avatar
        sx={{ width: 80, height: 80, overflow: "visible", bgcolor: "#18204a", fontSize: "32px", cursor: "pointer" }}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      ></Avatar>
      {open && (
        <Menu>
          <div
            style={{
              height: "50px",
              textAlign: "center",
              color: "#000",
              fontWeight: 500,
              marginBottom: "25px",
            }}
          >
            <div style={{ marginBottom: "14px" }}>Welcome!</div>
            <div style={{ marginBottom: "14px", textTransform: "capitalize" }}>{username}</div>
            <div
              style={{
                position: "absolute",
                top: "90px",
                left: "14px",
                width: "calc(100% - 28px)",
                height: "2px",
                background: "#000",
              }}
            />
          </div>
          <MenuItem onClick={handleOpenProfile} style={{ marginTop: "32px" }}>
            <MenuIcon src={UserImg} />
            My Profile
          </MenuItem>
          <MenuItem onClick={handleOpenCreateRecipe}>
            <MenuIcon src={CreateImg} />
            Create Recipe
          </MenuItem>
          <MenuItem onClick={handleOpenShoppingList}>
            {/* <MenuIcon src={ShoppingCartIcon} /> */}
            <ShoppingCartIcon sx={{ fontSize: "26px", ml: "-1px", mr: "13px", color: "#18204a" }} />
            Shopping List
          </MenuItem>
          <MenuItem onClick={handleSignOut}>
            <MenuIcon src={SignoutImg} />
            Log out
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

const ScrumLegendBar = (props) => {
  const { curPage } = props;
  const navigate = useNavigate();
  const containerStyle = {
    paddingTop: "50px",
    paddingBottom: "16px",
    marginLeft: "30px",
    marginRight: "30px",
  };
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [checkedStatus, setCheckedStatus] = React.useState(false);
  const [userName, setUserName] = React.useState(" ");
  const [signInPopUp, setSignInPopUp] = React.useState(false);
  const [signUpPopUp, setSignUpPopUp] = React.useState(false);

  const closeSignInPopUp = () => {
    setSignInPopUp(false);
  };

  const closeSignUpPopUp = () => {
    setSignUpPopUp(false);
  };

  const changeToSIgnUp = () => {
    setSignInPopUp(false);
    setSignUpPopUp(true);
  };

  const changeToSIgnIn = () => {
    setSignInPopUp(true);
    setSignUpPopUp(false);
  };

  const handleChangeSignInState = () => {
    setIsLoggedIn(true);
  };

  const handleSignOut = () => {
    requestLogout()
      .then(() => {
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.error("logout failed", error);
        // throw error;
      })
      .finally(() => navigate("/"));
  };

  // Initial loading
  useEffect(() => {
    // load profile data
    requestIsLogin()
      .then((responseObj) => {
        setIsLoggedIn(responseObj.user_is_logged_in);
        setCheckedStatus(true);
        // request general user info and recipes
        if (responseObj.user_is_logged_in) {
          requestUserData(responseObj.id)
            .then((responseObj) => {
              setUserName(responseObj.username);
            })
            .catch((error) => {
              // Stupid method to try again if the get data fails
              requestUserData(responseObj.id)
                .then((responseObj) => {
                  setUserName(responseObj.username);
                })
                .catch((error) => {
                  console.error("Failed to load user data", error);
                  setIsLoggedIn(false);
                });
              console.error("Failed to load user data", error);
            });
        }
      })
      .catch((error) => {
        console.error("Failed to get login status", error);
      });
  }, []);

  return (
    <MyBar>
      <div className="container" style={containerStyle}>
        <MyLogoHeader>
          <Link to="/homepage">
            SCRUM
            <br />
            LEGENDS
          </Link>
        </MyLogoHeader>
        {curPage === "Trending" ? (
          <CurHeader>Trending</CurHeader>
        ) : (
          <MyHeader>
            <Link to="/trending">Trending</Link>{" "}
          </MyHeader>
        )}
        {curPage === "MyNewsFeed" ? (
          <CurHeader>News Feed</CurHeader>
        ) : (
          <MyHeader>
            <Link to="/mynewsfeed">News Feed</Link>
          </MyHeader>
        )}
        {curPage === "MealPlan" ? (
          <CurHeader>Meal Plan</CurHeader>
        ) : (
          <MyHeader>
            <Link to="/mealplan">Meal Plan</Link>
          </MyHeader>
        )}

        {checkedStatus && (
          <>
            {isLoggedIn ? (
              <Profile>
                <ProfilePhoto signOut={handleSignOut} username={userName} />
              </Profile>
            ) : (
              <MyButton
                onClick={() => {
                  setSignInPopUp(true);
                }}
              >
                Sign in
              </MyButton>
            )}
            {signInPopUp ? (
              <SignIn
                handleChangeToSignInState={handleChangeSignInState}
                close={closeSignInPopUp}
                changeToSignUp={changeToSIgnUp}
              />
            ) : (
              <></>
            )}
          </>
        )}
        {signUpPopUp ? (
          <SignUp
            handleChangeToSignInState={handleChangeSignInState}
            close={closeSignUpPopUp}
            changeToSignUp={changeToSIgnIn}
          />
        ) : (
          <></>
        )}
      </div>
    </MyBar>
  );
};

export default ScrumLegendBar;
