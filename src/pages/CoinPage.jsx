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
import { ListCoins } from "../utils/apiService";

const CoinPage = () => {
  const [low, setLow] = React.useState(0);
  const [high, setHigh] = React.useState(0);
  const [close, setClose] = React.useState(0);

  const [resistance1, setResistance1] = React.useState(0);
  const [resistance2, setResistance2] = React.useState(0);
  const [support1, setSupport1] = React.useState(0);
  const [support2, setSupport2] = React.useState(0);
  const [pivotPoint, setPivotPoint] = React.useState(0);

  const { id } = useParams();
  const [coin, setCoin] = React.useState({});
  const [prevCoin, setPrevCoin] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { currency, symbol } = CryptoState();

  const fetchCoinData = async () => {
    const { data } = await axios.get(CoinData(id));
    // console.log(data.market_data.low_24h.inr)
    // console.log(data.market_data.high_24h.inr)
    // console.log(data.market_data.current_price.inr)
    setLow(data.market_data.low_24h.inr)
    setHigh(data.market_data.high_24h.inr)
    setClose(data.market_data.current_price.inr)
    console.log(low)
    console.log(high)
    console.log(close)

    setCoin(data);
    setIsLoading(false);
  };

  const fetchPrevCoinData = async () => {
    const { data } = await axios.get(ListCoins(currency));
    setPrevCoin(data);
    // setIsLoading(false);
  }

  

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

  const Pivot = () => {
    let pp = (high + low + close) / 3;
   
    let r3 = pp + 2* (high - low)
    let r2 = pp + (high - low)
    let r1 = 2* pp - low
    
    let s1 = 2* pp - high;
    let s2 = pp - (high - low)
    let s3 = pp - 2* (high - low)
    
  console.log("Range: ")

  setResistance1(r1);
  setResistance2(r2);
  setPivotPoint(pp);
  setSupport1(s1);
  setSupport2(s2);
   console.log(resistance1);
   console.log(resistance2);
 
   console.log(pivotPoint);
   console.log(support1);
   console.log(support2);


  };

  React.useEffect(() => {
    fetchCoinData();
    Pivot()
    // fetchPrevCoinData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [low, high, close]);

  if (isLoading) return <LinearProgress style={{ backgroundColor: "gold" }} />;
  // console.log(prevCoin)
  // prevCoin.map((c) => {
  //   if(c.id === id){
  //     console.log(c)
  //     console.log(c.high_24h)
      
  //   }
  // })


  
  
  console.log(coin)
  
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
            
          <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
              <Typography style={{color: '#FF0000'}}  variant="h5" className={classes.heading}>
                Resistance 1:{" "}
              </Typography>
              &nbsp;&nbsp;
              <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                {resistance1}
              </Typography>
            </span>

            <span style={{ display: "flex" }}>
              <Typography style={{color: '#FF0000'}} variant="h5" className={classes.heading}>
              Resistance 2:{" "}
              </Typography>
              &nbsp;&nbsp;
              <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                {resistance2}
              </Typography>
            </span>

            <span style={{ display: "flex" }}>
              <Typography variant="h5" className={classes.heading}>
                Pivot Point:{" "}
              </Typography>
              &nbsp;&nbsp;
              <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                {pivotPoint}
              </Typography>
            </span>

            <span style={{ display: "flex" }}>
              <Typography style={{color: '#0ECB81'}} variant="h5" className={classes.heading}>
                Support 1:{" "}
              </Typography>
              &nbsp;&nbsp;
              <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                {support1}
              </Typography>
            </span>

            <span style={{ display: "flex" }}>
              <Typography style={{color: '#0ECB81'}} variant="h5" className={classes.heading}>
              Support 2:{" "}
              </Typography>
              &nbsp;&nbsp;
              <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                {support2}
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
