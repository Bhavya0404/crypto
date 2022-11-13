import { makeStyles } from "@mui/styles";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./components";
import { Home, CoinPage } from "./pages";

const App = () => {
  const useStyles = makeStyles((theme) => ({
    App: {
      backgroundColor: '#14161a',
      color: 'white',
      minHeight: "100vh"
    }
  }))

  const classes = useStyles();
  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coins/:id" element={<CoinPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
