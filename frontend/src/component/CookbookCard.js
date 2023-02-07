import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import defaultRecipeImg from "../asset/defaultRecipeImage.jpg";

const Box = styled.div`
  width: 360px;
  height: 222px;
  background: white;
  border-radius: 16px;
  // float: left;
  // margin: 20px 18px;
  padding: 14px;
  position: relative;
  box-sizing: border-box;
`;

const Img = styled.img`
  height: 152px;
  width: 336px;
  border-radius: 14px;
  object-fit: cover;
  cursor: pointer;
`;

const Span = styled.div`
  color: #18204a;
  font-size: 19px;
  font-weight: bold;
  position: relative;
  margin-top: 10px;
  top: -5px;
`;

const CookbookCard = ({ id, img, name, numRecipes }) => {
  const navigate = useNavigate();

  const renderNumRecipes = (numRecipes) => {
    if (!numRecipes) return <>0 recipes</>;
    return numRecipes === 1 ? <>1 recipe</> : <>{numRecipes} recipes</>;
  };

  return (
    <Box>
      <Img
        src={img || defaultRecipeImg}
        onClick={() => {
          navigate(`/cookbookname/${id}/${name}`);
        }}
      ></Img>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Span>{name}</Span>
        {renderNumRecipes(numRecipes)}
      </div>
    </Box>
  );
};

export default CookbookCard;
