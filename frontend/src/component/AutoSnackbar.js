import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// Usage:
// import AutoSnackbar from "../component/AutoSnackbar";

// Set up variables for snackbar:
// const [snackbar, setSnackbar] = useState({ open: false, text: "" });

// Add component to end of DOM
// <AutoSnackbar state={snackbar} setter={setSnackbar} />

// Set variable to trigger
// setSnackbar({ open: true, severity: "info", text: "Please login first" });

// fields: state={open, severity, text} setter
function AutoSnackbar(props) {
  const severity = props.state.severity || "info";
  const handleClose = () => {
    props.setter({
      ...props.state,
      open: false,
    });
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={props.state.open}
      onClose={handleClose}
      autoHideDuration={2500}
      key={props.state.text}
    >
      <Alert
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          fontSize: "30px",
          borderWidth: "2px",
        }}
      >
        {props.state.text}
      </Alert>
    </Snackbar>
  );
}

export default AutoSnackbar;
