import { LinearProgress, Typography } from "@mui/material";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import { styled } from "@mui/styles";
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { CoinData } from "../utils/apiService";
import { Coin } from "../components";
import { commaSeparate } from "../utils/commaSeparate";
import { CryptoState } from "../CryptoContext";
import HTMLReactParser from "html-react-parser";

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const { currency, symbol } = CryptoState();

  const fetchCoinData = async () => {
    const { data } = await axios.get(CoinData(id));
    setCoin(data);
    setIsLoading(false);
  };

  let theme = createTheme();
  theme = responsiveFontSizes(theme);

  const CoinPageContainer = styled("div")(({ theme }) => ({
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  }));

  const Sidebar = styled("div")(({ theme }) => ({
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    borderRight: "2px solid gray",
  }));

  const classes = {
    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "justify",
    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      [theme.breakpoints.down("md")]: {
        display: "flex",
        justifyContent: "space-around",
      },
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down("xs")]: {
        alignItems: "start",
      },
    },
  };

  React.useEffect(() => {
    fetchCoinData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <ThemeProvider theme={theme}>
      <CoinPageContainer>
        {/* Sidebar */}
        <Sidebar>
          <img
            src={coin?.image?.large}
            alt={coin?.name}
            height="200"
            style={{ marginBottom: 20 }}
          />
          <Typography variant="h3" style={classes.heading}>
            {coin?.name}
          </Typography>
          <Typography variant="subtitle1" style={classes.description}>
            {HTMLReactParser(coin?.description?.en.split(". ")[0])}
          </Typography>
          <div className={classes.marketData}>
            <span style={{ display: "flex" }}>
              <Typography variant="h5" className={classes.heading}>
                Rank:{" "}
              </Typography>
              &nbsp;&nbsp;
              <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                {coin?.market_cap_rank}
              </Typography>
            </span>
            <span style={{ display: "flex" }}>
              <Typography variant="h5" className={classes.heading}>
                Current Price:{" "}
              </Typography>
              &nbsp;&nbsp;
              <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                {symbol}{" "}
                {commaSeparate(
                  coin?.market_data?.current_price[currency.toLowerCase()]
                )}
              </Typography>
            </span>
            <span style={{ display: "flex" }}>
              <Typography variant="h5" className={classes.heading}>
                Market Cap:{" "}
              </Typography>
              &nbsp;&nbsp;
              <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                {symbol}{" "}
                {commaSeparate(
                  coin?.market_data.market_cap[currency.toLowerCase()].toString().slice(0,-6)
                )}{" "}
                M
              </Typography>
            </span>
          </div>
        </Sidebar>
        {/* Graph */}
        <Coin coin={coin} />
      </CoinPageContainer>
    </ThemeProvider>
  );
};

export default CoinPage;
