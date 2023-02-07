import Container from "@mui/material/Container";

import ScrumLegendBar from "../component/AppBar";
import Footer from "../component/Footer";

// General error page for invalid navigation or errors
const ErrorPage = () => {
  return (
    <>
      <ScrumLegendBar />
      <Container sx={{ textAlign: "center" }}>
        <h2>Page not found</h2>
        <br />
        <br />
        <h2>but ...</h2>
        <img src="https://i.imgflip.com/4sejgq.jpg" alt="Gordo Ramsay meme"></img>
      </Container>
      <Footer />
    </>
  );
};
export default ErrorPage;
