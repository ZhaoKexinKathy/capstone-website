import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";

import Android from "../asset/android.png";
import IOS from "../asset/ios.png";

const Wrap = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 336px;
  background: #b9c8b6;
  margin-top: 50px;
  padding: 60px 10%;
  position: relative;
  min-width: 1100px;
`;

const MyLogo = styled.header`
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

const SocialBox = styled.div`
  position: absolute;
  left: 35%;
  top: 50px;
  display: flex;
  flex-direction: column;
  a:visited {
    margin-top: 10px;
    text-decoration: none;
  }
  a:hover {
    margin-top: 10px;
    text-decoration: none;
  }
  a:active {
    margin-top: 10px;
    text-decoration: none;
  }
  a {
    margin-top: 10px;
    text-decoration: none;
    color: #18204a;
  }
`;

const SubscribeBox = styled.div`
  position: absolute;
  left: 46%;
  top: 70px;
  display: flex;
  flex-direction: column;
  .MuiInputBase-root {
    border-radius: 20px;
  }
`;

const AppWrap = styled.div`
  position: absolute;
  right: 10%;
  top: 70px;
  display: flex;
  flex-direction: column;
  > div {
    margin-bottom: 15px;
  }
`;

const Img = styled.img`
  width: 131px;
  margin-bottom: 20px;
`;

const AttributeText = styled.div`
  font-size: 12px;
  position: relative;
  left: 18px;
  a {
    color: inherit;
  }
  a:visited {
    color: inherit;
  }
`;

const Footer = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showHint = (e) => {
    enqueueSnackbar("Work in progress.Please contact ScrumLegends for details.");
    e.preventDefault();
  };
  return (
    <Wrap>
      <MyLogo>
        <Link to="/homepage">
          SCRUM
          <br />
          LEGENDS
        </Link>
      </MyLogo>
      <AttributeText>
        <a href="https://www.nutritionix.com/">Powered by Nutritionix</a>
      </AttributeText>
      <SocialBox>
        <h2>Social</h2>
        <Link onClick={showHint}>Facebook</Link>
        <Link onClick={showHint}>Instagram</Link>
        <Link onClick={showHint}>LinkedIn</Link>
      </SocialBox>
      <SubscribeBox>
        <div style={{ marginBottom: "10px" }} onClick={showHint}>
          Subscribe to our newsletter
        </div>
        <TextField
          style={{
            width: "335px",
            background: "#fff",
            borderRadius: "20px",
            outline: "none",
            border: "none",
          }}
          label="Email Address"
          variant="outlined"
          onFocus={showHint}
        />
        <Button
          style={{
            marginTop: "20px",
            width: "100px",
            borderRadius: "20px",
            background: "#171c3f",
          }}
          variant="contained"
          onClick={showHint}
        >
          Submit
        </Button>
      </SubscribeBox>
      <AppWrap>
        <div>Get the app!</div>
        <Img src={IOS} onClick={showHint} />
        <Img src={Android} onClick={showHint} />
      </AppWrap>
    </Wrap>
  );
};

export default Footer;
