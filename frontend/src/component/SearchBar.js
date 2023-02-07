import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { SEARCH } from "../config";

import AdvanceSearch from "./AdvanceSearch";
import { InputText } from "./InputText";

const Button = styled.button`
  font-family: "Poppins", cursive;
  width: 150px;
  height: 60px;
  border-radius: 16px;
  background-color: #18204a;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
`;

const AdvanceSearchButton = styled.span`
  font-size: 18px;
  text-decoration: underline;
  // padding-top: 30px;
  margin-left: 44px;
  // float: right;
  cursor: pointer;
`;

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyWord] = React.useState("");
  const [openAdvanceSearch, setOpenAdvanceSearch] = React.useState(false);

  const handleSearch = async () => {
    const response = await fetch(`${SEARCH.BASIC}?search_query=${searchKeyword}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      const recipeList = await response.json();
      window.recipeList = recipeList;
      navigate("/SearchingResult");
    } else {
      navigate("/error");
    }
  };

  const closeAdvanceSearch = () => {
    setOpenAdvanceSearch(false);
  };

  return (
    <>
      <div style={{ width: "100%", paddingBottom: "20px" }}>
        <InputText
          placeholder={"Search for specific recipe?"}
          onChange={(e) => {
            setSearchKeyWord(e.target.value);
          }}
        />
        <Button onClick={handleSearch}>Search</Button>
        <AdvanceSearchButton
          onClick={() => {
            setOpenAdvanceSearch(true);
          }}
        >
          Advanced Search
        </AdvanceSearchButton>
        {openAdvanceSearch ? <AdvanceSearch close={closeAdvanceSearch} /> : <></>}
      </div>
    </>
  );
};

export default SearchBar;
