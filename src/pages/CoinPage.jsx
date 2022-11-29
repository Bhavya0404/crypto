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
import { MonthlyCoin } from "../utils/apiService";
import { useCallback } from "react";
import Button from '@mui/material/Button';

const CoinPage = () => {
 // const [low, setLow] = React.useState(0);
 // const [high, setHigh] = React.useState(0);
//  const [close, setClose] = React.useState(0);

  const [resistance1, setResistance1] = React.useState(0);
  const [resistance2, setResistance2] = React.useState(0);
  const [support1, setSupport1] = React.useState(0);
  const [support2, setSupport2] = React.useState(0);
  const [pivotPoint, setPivotPoint] = React.useState(0);
  const [buy,setbuy] = React.useState("DON'T BUY");

  const { id } = useParams();
  const [coin, setCoin] = React.useState({});
  const [prevCoin, setPrevCoin] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { currency, symbol } = CryptoState();

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
  const price = {current: ""};
  const fetchCoinData = async () => {
    const { data } = await axios.get(CoinData(id));
    // console.log(data.market_data.low_24h.inr)
    // console.log(data.market_data.high_24h.inr)
    // console.log(data.market_data.current_price.inr)
   // setLow(data.market_data.low_24h.inr)
   // setHigh(data.market_data.high_24h.inr)
   // setClose(data.market_data.current_price.inr)
   // console.log(low)
   // console.log(high)
   // console.log(close)
    price.current = data?.market_data?.current_price.inr;
    console.log("CURRENT: ", data?.market_data?.current_price.inr)
    setCoin(data);
    setIsLoading(false);
  };
  console.log(price)

  const month  = {low: "", high: "", close: ""};
  const points = {r1: "", r2: "", pp: "", s1: "", s2: ""};
  
  const fetchPrevCoinData = useCallback(async () => {
    const ex1 = coin.symbol?.toString() || '';
    console.log(ex1);
    const MonthlyData = await axios.get(MonthlyCoin(ex1));
   
    console.log(MonthlyData)
    const neww = MonthlyData.data["Time Series (Digital Currency Weekly)"];
   // console.log(neww["2020-03-15"])
   
    for(var key in neww){
      if(key == "2022-11-20"){
        month.low = neww[key]["3a. low (INR)"];
        month.high = neww[key]["2a. high (INR)"];
        month.close = neww[key]["4a. close (INR)"];
       // console.log(month.low)
      //  console.log(month.high)
      //  console.log(month.close)
      }
    }
   // setPrevCoin(neww);
    // setIsLoading(false);
  
  
    console.log(month);
  
   let high=parseInt(month.high)
   let low=parseInt(month.low)
   let close=parseInt(month.close)
    let pp = (high + low + close) / 3;
   
    let r3 = pp + 2* (high - low)
    let r2 = pp + (high - low)
    let r1 = 2* pp - low
    
    let s1 = 2* pp - high;
    let s2 = pp - (high - low)
    let s3 = pp - 2* (high - low)  
 
    points.r1 = r1;
    points.r2 = r2;
    points.pp = pp;
    points.s1 = s1;
    points.s2 = s2;
    setResistance1(points.r1);
    setResistance2(points.r2);
    setPivotPoint(points.pp);
    setSupport1(points.s1);
    setSupport2(points.s2);
   


  
});


  console.log(points)
  
 const buynotbuy  =  ()=>{
    if(coin?.market_data?.current_price>=resistance1 && coin?.market_data?.current_price<=resistance2){
        setbuy("BUY");
    }
 }


  React.useEffect(() => {
    fetchCoinData();
    fetchPrevCoinData();
    buynotbuy();
        
  }, [resistance1, buy]);

  if (isLoading) return <LinearProgress style={{ backgroundColor: "gold" }} />;
 // console.log(prevCoin)
  // prevCoin.map((c) => {
  //   if(c.id === id){
  //     console.log(c)
  //     console.log(c.high_24h)
      
  //   }
  // })


  
  
 // console.log(coin)
 console.log("DATATAAA")
 console.log(coin?.market_data?.current_price[currency.toLowerCase()]);
 console.log(resistance1 - 8)
 console.log(resistance2)
  
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
          <Typography variant="subtitle1" component="h2">RESISTANCE: It is The Upper Range that a coin can hit</Typography>
          <Typography variant="subtitle1" component="h2">SUPPORT: It is the Lower Range that a coin can hit</Typography>
          <Typography >Eg: A Coin can go as High as Resistance Price and as Low as Support Price , This gives User a Clear Range of a Particular Coin</Typography>

          {/* <Typography variant="subtitle1" style={classes.description}>
            {HTMLReactParser(coin?.description?.en.split(". ")[0])}
          </Typography> */}
          <div className={classes.marketData}>
            <span style={{ display: "flex" }}>
              <Typography variant="h5" component="h2" className={classes.heading}>
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
            {/* <span style={{ display: "flex" }}>
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
            </span> */}

          </div>
            
          <div className={classes.marketData}>
          

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
              <Typography style={{color: '#FF0000'}}  variant="h5" className={classes.heading}>
                Resistance 1:{" "}
              </Typography>
              &nbsp;&nbsp;
              <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                {resistance1}
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
            <span>
              {coin?.market_data?.current_price[currency.toLowerCase()] >= resistance1 && coin?.market_data?.current_price[currency.toLowerCase()] <= resistance2 ? 
                <Button variant="contained" color="success">
                  Safe To Consider for Buying
                </Button> : <Button variant="outlined" color="error">
                  Not Safe To Consider for Buying
                </Button>
              }
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
