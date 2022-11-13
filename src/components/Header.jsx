import {
  AppBar,
  Container,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles"
import { CryptoState } from "../CryptoContext";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  title: {
    flex: 1,
    color: 'gold',
    fontFamily: 'Montsserat',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
}))

const Navbar = () => {
  const classes = useStyles();
  const {currency, setCurrency} = CryptoState();
  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff"
      },
      mode: "dark"
    }
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Typography onClick={() => navigate('/', {replace: true})} className={classes.title} variant="h6">
              Crypt Dash  
            </Typography>
            <Select
              variant="outlined"
              style={{ width: 100, height: 40, marginRight: 15 }}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value={"USD"}>USD</MenuItem>
              <MenuItem value={"INR"}>INR</MenuItem>
            </Select>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;
