import FavoriteIcon from "@mui/icons-material/Favorite";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { pink } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";

const Container = styled.div`
  height: 96%;
  width: 340px;
  background: white;
  border-radius: 16px;
  padding: 8px 8px 8px;
  position: relative;
  boxsizing: border-box;
  cursor: pointer;
`;

const Img = styled.img`
  max-height: 300px;
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
`;

const Title = styled.div`
  font-size: 22px;
  color: #18204a;
  margin-top: 4px;
  margin-bottom: 3px;
  font-weight: bold;
`;

const SubTitle = styled.div`
  color: #717693;
  margin-bottom: 2px;
`;

const Name = styled.div`
  color: #ff8906;
  margin-bottom: 8px;
`;

const Min = styled.div`
  font-size: 14px;
  color: #18204a;
  position: absolute;
  bottom: 26px;
  right: 16px;
  font-weight: bold;
`;

const FoodCard = (props) => {
  const { img, title, subTitle, name, time, likes, onImgClick, onLikesClick, onDeleteClick, collect } = props;

  return (
    <Container onClick={onImgClick}>
      <Img src={img}></Img>
      <Title>
        {onDeleteClick && (
          <IconButton onClick={onDeleteClick}>
            <IndeterminateCheckBoxIcon sx={{ color: "#df573f", fontSize: "30px" }} />
          </IconButton>
        )}
        {title}
      </Title>
      <SubTitle>{subTitle}</SubTitle>
      <Name>{name}</Name>
      <div style={{ paddingLeft: "5px" }}>
        <FavoriteIcon onClick={onLikesClick} sx={{ color: collect > 0 ? pink[500] : "gray" }} />
        <span
          style={{
            position: "relative",
            top: "-5px",
            left: "10px",
            fontWeight: "bold",
          }}
        >
          {likes}
        </span>
      </div>
      <Min>{time} min</Min>
    </Container>
  );
};
export default FoodCard;
