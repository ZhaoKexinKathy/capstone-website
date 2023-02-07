import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { CardActionArea } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { requestIsLogin } from "../API/AuthRequests";
import { requestSubscribeData, requestUnsubscribe } from "../API/SubscribeRequests";
import defaultUserProfileImg from "../asset/defaultUserProfileImage.jpg";
import pageHeaderImg from "../asset/followerHeaderImage.jpg";
import ScrumLegendBar from "../component/AppBar";
import DividerLine from "../component/DividerLine";
import Footer from "../component/Footer";

const HeaderImg = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  min-height: 30vh;
  max-height: 50vh;
`;

const SectionTitleText = styled.div`
  font-weight: bold;
  font-size: 32px;
  padding-top: 30px;
  padding-bottom: 30px;
  width: 100%;
`;

const UserText = styled.div`
  font-weight: bold;
  font-size: 28px;
`;

const UnSubButton = styled(Button)({
  textTransform: "none",
  borderRadius: "16px",
  backgroundColor: "inherit",
  padding: "0 24px",
  fontSize: "24px",
  border: "2px solid #F8D750",
  color: "#ebce2f",
  "&:hover": {
    backgroundColor: "#fceba2",
  },
});

// Request subscribe data from data and load them
function loadSubscribeData(setUserList) {
  // load subscriber data
  requestSubscribeData()
    .then((responseObj) => {
      setUserList(responseObj.subscribed);
    })
    .catch((error) => {
      console.error("Failed to load user data", error);
    });
}

// Unsubscribe and update state
const handleUnsubscribe = (userId, setUserList) => {
  const formDataObj = {
    unsubscribe: userId,
  };
  requestUnsubscribe(JSON.stringify(formDataObj))
    .then(() => {
      loadSubscribeData(setUserList);
    })
    .catch((error) => {
      console.error("unsubscribe failed", error);
    });
};

// Component for single user
// props.id, props.name,
function UserCard(props) {
  return (
    <Card
      elevation={0}
      sx={{
        m: 0,
        borderRadius: 6,
        background: "inherit",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={3}>
        <CardActionArea
          component={RouterLink}
          to={`/profile/${props.id}`}
          sx={{
            p: 2,
            borderRadius: 6,
            height: "100%",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Avatar alt="Profile pic" src={defaultUserProfileImg} sx={{ width: "50px", height: "50px", mr: 4 }} />
          <UserText>{props.name}</UserText>
        </CardActionArea>

        <UnSubButton
          onClick={() => {
            handleUnsubscribe(props.id, props.setter);
          }}
          sx={{ width: "10em" }}
        >
          -Unsubscribe
        </UnSubButton>
      </Stack>
    </Card>
  );
}

// Page to show users that the logged in user is subscribed to
const SubscriptionsPage = () => {
  const userId = useParams().userid;

  const [userList, setUserList] = useState([]);

  const navigate = useNavigate();

  // Initial loading
  useEffect(() => {
    // check login status
    requestIsLogin()
      .then((responseObj) => {
        if (!responseObj.user_is_logged_in || responseObj.user_id != userId) {
          navigate("/error");
        }
      })
      .catch((error) => {
        console.error("Failed to get login status", error);
      });

    // load subscribers
    loadSubscribeData(setUserList);
  }, []);

  return (
    <>
      <ScrumLegendBar />
      <Container>
        <Stack alignItems="center" sx={{ width: "100%" }}>
          <HeaderImg alt="Subscriber image" src={pageHeaderImg} />
          <DividerLine />
          <SectionTitleText>My Subscriptions</SectionTitleText>
          <DividerLine />
          <Stack sx={{ width: "100%" }}>
            {userList.map((userItem, i) => {
              return <UserCard id={userItem.id} key={i} name={userItem.name} setter={setUserList} />;
            })}
            {!userList.length && "No subscribers"}
          </Stack>
          <DividerLine />
        </Stack>
      </Container>
      <Footer />
    </>
  );
};
export default SubscriptionsPage;
