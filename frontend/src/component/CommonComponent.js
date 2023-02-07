import styled from "@emotion/styled";
export const ButtonYellow = styled.button`
  font-family: "Poppins", cursive;
  background-color: #f8d750;
  border-radius: 16px;
  font-size: 35px;
  font-weight: bold;
  width: 337px;
  height: 62px;
  color: #18204a;
  border: none;
  margin-top: 20px;
  margin-bottom: 40px;
  cursor: pointer;
`;

export const ButtonYellowBorder = styled.button`
  font-family: "Poppins", cursive;
  color: #f8d750;
  border-radius: 16px;
  font-size: 35px;
  font-weight: bold;
  width: 337px;
  height: 62px;
  margin-top: 20px;
  margin-bottom: 40px;
  border: 4px solid #f8d750;
  background-color: #edf0eb;
  cursor: pointer;
`;

export const PageMask = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
`;

export const CloseIcon = styled.img`
  width: 20px;
  height: 20px;
  float: right;
  margin-right: 30px;
  filter: invert(8%) sepia(31%) saturate(4314%) hue-rotate(217deg) brightness(102%) contrast(93%);
  cursor: pointer;
`;
