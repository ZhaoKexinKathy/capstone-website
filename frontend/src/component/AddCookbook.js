import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import styled from "styled-components";

const Title = styled.div`
  font-size: 24px;
  color: #18204a;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
`;

const Box = styled.div`
  width: 193px;
  height: 163px;
  background: white;
  border-radius: 16px;
  float: left;
  margin: 20px 18px;
  padding: 14px;
  box-sizing: border-box;
`;

const Img = styled.img`
  height: 113px;
  width: 167px;
  border-radius: 14px;
`;

const Span = styled.div`
  color: #18204a;
  font-size: 19px;
  font-weight: bold;
  position: relative;
  top: -5px;
`;

const Line = styled.div`
  width: 432px;
  height: 2px;
  margin: 30px auto 30px;
  background: #18204a;
`;

const AddCookbook = (props) => {
  const { open, list, close, create, confirm, createTitle } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [ids, setIds] = useState([]);

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={open} onClose={close}>
        <DialogContent
          style={{
            background: "#EDF0EB",
            width: "480px",
            height: "720px",
            paddingTop: "40px",
            position: "relative",
          }}
        >
          <CloseIcon
            style={{
              position: "absolute",
              top: "20px",
              right: "30px",
              cursor: "pointer",
            }}
            onClick={close}
          ></CloseIcon>
          <Title>Choose a Cookbook</Title>
          {/* style={{ overflow: "auto", height: "400px" }} */}
          <div>
            {list.map((e, i) => (
              <div
                key={i}
                onClick={() => {
                  if (ids.findIndex((item) => item === e.id) > -1) {
                    setIds(ids.filter((item) => item !== e.id));
                  } else {
                    setIds([...ids, e.id]);
                  }
                }}
              >
                <Box
                  style={{
                    boxShadow: ids.findIndex((item) => item === e.id) > -1 ? "0 0 20px rgba(0,0,0,.2)" : "",
                    border: ids.findIndex((item) => item === e.id) > -1 ? "1px solid #18204a" : "1px solid #FFF",
                  }}
                >
                  <Img src={e.img}></Img>
                  <Span>{e.name}</Span>
                </Box>
              </div>
            ))}
          </div>
          <Button
            style={{
              width: "432px",
              height: "58px",
              background: "#18204A",
              borderRadius: "16px",
              margin: "40px auto 0",
              fontWeight: "bold",
              display: "block",
              fontSize: "25px",
              textTransform: "unset",
            }}
            variant="contained"
            onClick={create}
          >
            {createTitle}
          </Button>
          <Line></Line>
          <Button
            style={{
              width: "337px",
              height: "62px",
              background: "#F8D750",
              borderRadius: "16px",
              margin: "0 auto",
              display: "block",
              fontSize: "30px",
              fontWeight: "900",
              fontFamily: '"Poppins", cursive',
              color: "#18204A",
              textTransform: "unset",
            }}
            onClick={() => confirm(ids)}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AddCookbook;
