import FavoriteIcon from "@mui/icons-material/Favorite";
import { pink } from "@mui/material/colors";
import styled from "styled-components";

const Tag = styled.span`
  text-align: center;
  padding-left: 15px;
  padding-right: 15px;
  background-color: #f8d750;
  font-family: "Gloria Hallelujah", cursive;
  font-size: 20px;
  border-radius: 16px;
  height: 39px;
  border-radius: 14px;
  position: absolute;
  bottom: 56px;
  right: -50px;
`;

const Img = styled.img`
  height: 204px;
  width: 344px;
  border-radius: 14px;
  float: right;
  object-fit: cover;
`;

const Title = styled.span`
  font-size: 24px;
  color: #18204a;
  margin-top: 4px;
  margin-bottom: 6px;
  font-weight: bold;
`;

const SubTitle = styled.div`
  font-size: 20px;
  width: 260px;
  color: #18204a;
  margin-bottom: 6px;
`;

const Name = styled.div`
  font-size: 14px;
  color: #ff8906;
  margin-bottom: 8px;
  padding-left: 10px;
`;

const Min = styled.div`
  font-size: 14px;
  color: #18204a;
  position: absolute;
  bottom: 0px;
  right: 0;
  font-weight: bold;
  background: white;
  border-radius: 8px;
  right: -50px;
  height: 34px;
  line-height: 34px;
  padding: 0 6px;
`;

const FoodCardSec = (props) => {
  const { img, mealType, title, subTitle, name, time, likes, onImgClick, onLikesClick } = props;

  return (
    <div
      style={{
        width: "720px",
        minHeight: "240px",
        padding: "16px 0 8px",
        boxSizing: "border-box",
        borderTop: "2px solid #18204a",
        borderBottom: "2px solid #18204a",
      }}
    >
      <div style={{ float: "left", width: "310px", position: "relative" }}>
        <Title>{title}</Title>
        <SubTitle>{subTitle}</SubTitle>
        <Name>{name}</Name>
        <div style={{ paddingLeft: "9px", marginTop: "18px" }}>
          <FavoriteIcon onClick={onLikesClick} sx={{ color: likes > 0 ? pink[500] : "gray" }} />
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
        {/* <ButtonImg src={buttonImg}></ButtonImg> */}
        <Tag>{mealType}</Tag>
        <Min>{time} min</Min>
      </div>
      {onImgClick ? (
        <Img src={img} onClick={onImgClick} style={{ cursor: "pointer" }} />
      ) : (
        <Img src={img} onClick={onImgClick} />
      )}
    </div>
  );
};
export default FoodCardSec;
