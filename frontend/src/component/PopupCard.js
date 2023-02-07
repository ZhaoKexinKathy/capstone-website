import styled from "styled-components";

const PopupCard = styled.div`
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 440px;
  height: 600px;
  border-radius: 16px;
  background-color: #edf0eb;
  text-align: center;
  padding: 30px;
  z-index: 10;
`;
export default PopupCard;
