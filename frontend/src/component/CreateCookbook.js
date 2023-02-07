import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import styled from "styled-components";

import { commonApi } from "../API/AuthRequests";
import UploadCookbook from "../asset/upload_cookbook.png";
import AutoSnackbar from "../component/AutoSnackbar";
import { CREATE_COOKBOOK } from "../config";

const Title = styled.div`
  font-size: 24px;
  color: #18204a;
  margin-top: 60px;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
`;

const Img = styled.img`
  display: block;
  height: 236px;
  width: 432px;
  border-radius: 14px;
  margin: 21px auto 39px;
`;

const InputWrap = styled.div`
  width: 432px;
  margin: 0 auto;
  .MuiInputBase-root {
    width: 432px;
    border-radius: 14px;
  }
`;

const IconWrap = styled.div`
  width: 40px;
  height: 40px;
  background: #fff;
  fontsize: 15px;
  position: absolute;
  top: 20px;
  right: 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const CreateCookbook = (props) => {
  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackbar, setSnackbar] = useState({ open: false, text: "" });

  const { open, close, fetchData, title, editObj, createTitle, id } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const create = () => {
    if (!name || !description) {
      // return enqueueSnackbar("cookbook name and description cannot be empty!");
      setSnackbar({ open: true, severity: "error", text: "Cookbook name and description cannot be empty!" });
      return undefined;
    }
    commonApi(
      CREATE_COOKBOOK.DATA_URL,
      createTitle === "Edit" ? "PUT" : "POST",
      createTitle === "Edit" ? { id, name, description } : { name, description }
    ).then(() => {
      if (!editObj) {
        setName("");
        setDescription("");
      } else {
        navigate();
        // navigate(`/cookbookname/${id}/${name}`);
      }
      close?.();
      fetchData?.();
      if (createTitle === "Edit") setSnackbar({ open: true, severity: "success", text: "Cookbook modified!" });
      else setSnackbar({ open: true, severity: "success", text: "Cookbook created!" });
    });
  };
  useEffect(() => {
    if (editObj) {
      setName(editObj.name);
      setDescription(editObj.description);
    }
  }, []);
  return (
    <>
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
            <IconWrap>
              <CloseIcon onClick={close}></CloseIcon>
            </IconWrap>
            <Title>{title}</Title>
            <Img src={UploadCookbook} />
            <InputWrap>
              <TextField
                style={{
                  margin: "0 auto 39px",
                  display: "block",
                  background: "#fff",
                  borderRadius: "14px",
                }}
                label="Set Cookbook Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                style={{
                  margin: "0 auto",
                  display: "block",
                  background: "#fff",
                  borderRadius: "14px",
                }}
                label="Set Cookbook Description"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </InputWrap>
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
          </DialogContent>
        </Dialog>
      </div>
      <AutoSnackbar state={snackbar} setter={setSnackbar} />
    </>
  );
};
export default CreateCookbook;
