// Use with
// import ShareButtons from '../component/ShareButtons';
// <ShareButtons subject="Check out this awesome recipe on FaceCookBook" body="Here is the recipe" />

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TumblrIcon,
  TumblrShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Box from "@mui/material/Box";

const getURL = (type) => {
  if (type === "cookbook") {
    return `https://unsw-cse-comp3900-9900-22t3.github.io/capstone-project-9900-m18p-scrumlegends/cookbook2`;
  } else {
    return `https://unsw-cse-comp3900-9900-22t3.github.io/capstone-project-9900-m18p-scrumlegends/recipe2`;
  }
};

const ShareButtons = ({ type, subject, body, size }) => {
  return (
    <Box>
      <EmailShareButton url={getURL(type)} subject={subject} body={body}>
        <EmailIcon size={size} round />
      </EmailShareButton>

      <FacebookShareButton url={getURL(type)} quote={subject}>
        <FacebookIcon size={size} round />
      </FacebookShareButton>

      <LinkedinShareButton url={getURL(type)} title={subject} summary={body}>
        <LinkedinIcon size={size} round />
      </LinkedinShareButton>

      <RedditShareButton url={getURL(type)} title={subject}>
        <RedditIcon size={size} round />
      </RedditShareButton>

      <TumblrShareButton url={getURL(type)} title={subject} caption={body}>
        <TumblrIcon size={size} round />
      </TumblrShareButton>

      <TwitterShareButton url={getURL(type)} title={subject}>
        <TwitterIcon size={size} round />
      </TwitterShareButton>

      <WhatsappShareButton url={getURL(type)} title={subject}>
        <WhatsappIcon size={size} round />
      </WhatsappShareButton>
    </Box>
  );
};

export default ShareButtons;
