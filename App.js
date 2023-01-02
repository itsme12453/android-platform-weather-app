import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, View, ImageBackground, Image } from 'react-native';
import { useFonts } from "expo-font";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as Location from 'expo-location';
import React, { useState, useEffect, useCallback, } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { Provider as PaperProvider, } from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons, } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

SplashScreen.preventAutoHideAsync();

export default function App() {
  // const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState([{ postalCode: "Loading", country: "Loading" }]);
  const [temp, setTemp] = useState(0);
  const [feelsLike, setFeelsLike] = useState(0);
  const [condition, setCondition] = useState("Loading");
  const [icon, setIcon] = useState({ uri: "loading" });
  const [timeOfDay, setTimeOfDay] = useState("Afternoon");

  const [windSpeed, setWindSpeed] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [windPressure, setWindPressure] = useState(0);

  const [hourData, setHourData] = useState([]);
  let hourDataArr = [];
  const [fewDaysData, setFewDaysData] = useState([]);
  let fewDaysDataArr = [];

  const [fontsLoaded] = useFonts({
    "Ubuntu-Medium": require("./assets/fonts/Ubuntu-Medium.ttf"),
    "Ubuntu-Regular": require("./assets/fonts/Ubuntu-Regular.ttf"),
    "Ubuntu-Bold": require("./assets/fonts/Ubuntu-Bold.ttf"),
    "Mukta-SemiBold": require("./assets/fonts/Mukta-SemiBold.ttf"),
  });

  // const backgrounds = ["https://i.pinimg.com/originals/81/81/84/818184967bf1a67e3497015c86de310d.jpg", "https://img.freepik.com/premium-photo/abstract-colorful-gradient-backgrounds-brochure-banner-wallpaper-mobile-screen-holographic-multicolor-backdrop_494516-1085.jpg?w=2000", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e0a88e22-dda8-4e0c-a654-5a331d981d92/d3iodaj-fa36c660-6451-4d13-a52a-07f418a13c25.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2UwYTg4ZTIyLWRkYTgtNGUwYy1hNjU0LTVhMzMxZDk4MWQ5MlwvZDNpb2Rhai1mYTM2YzY2MC02NDUxLTRkMTMtYTUyYS0wN2Y0MThhMTNjMjUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.pDNwi_2Z_yanJJ8gxUUlTx_xQV7H0k66VdvPrPtjzBI"];

  // const image = { uri: backgrounds[Math.floor(Math.random() * backgrounds.length)] };
  const image = { uri: "https://i.pinimg.com/originals/81/81/84/818184967bf1a67e3497015c86de310d.jpg" };
  // const image = { uri: "https://img.freepik.com/premium-photo/abstract-colorful-gradient-backgrounds-brochure-banner-wallpaper-mobile-screen-holographic-multicolor-backdrop_494516-1085.jpg?w=2000" }
  // const image = { uri: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e0a88e22-dda8-4e0c-a654-5a331d981d92/d3iodaj-fa36c660-6451-4d13-a52a-07f418a13c25.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2UwYTg4ZTIyLWRkYTgtNGUwYy1hNjU0LTVhMzMxZDk4MWQ5MlwvZDNpb2Rhai1mYTM2YzY2MC02NDUxLTRkMTMtYTUyYS0wN2Y0MThhMTNjMjUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.pDNwi_2Z_yanJJ8gxUUlTx_xQV7H0k66VdvPrPtjzBI" };

  const Title = (props) => {
    return (
      <Text style={styles.title}>{props.text}</Text>
    )
  };

  const MiniTitle = (props) => {
    return (
      <Text style={styles.miniTitle}>{props.text}</Text>
    )
  };

  async function getTemp(locationArg){
    try {
      // const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=e7055ec990e34aa4996155629222912&q=${locationArg}`);
      const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=e7055ec990e34aa4996155629222912&q=${locationArg}&days=7&aqi=no&alerts=no`);
      const jsonRes = await res.json();
      const codes = require("./assets/codes.json");
  
      // console.log(jsonRes["forecast"]["forecastday"][0]["hour"]);
      // console.log(jsonRes["current"]["condition"]["code"])
      setTemp(Math.round(jsonRes["current"]["temp_c"]));
      setFeelsLike(Math.round(jsonRes["current"]["feelslike_c"])); 
      setCondition(jsonRes["current"]["condition"]["text"]);
      setWindSpeed(Math.round(jsonRes["current"]["wind_mph"]));
      setHumidity(Math.round(jsonRes["current"]["humidity"]));
      setWindPressure(Math.round(jsonRes["current"]["pressure_in"]));
  
      for(let data in jsonRes["forecast"]["forecastday"][0]["hour"]){
        const imgURL = jsonRes["forecast"]["forecastday"][0]["hour"][data]["condition"]["code"];

        for (let item in codes){
          if (codes[item]["code"] == imgURL){
            let imgURLA = codes[item]["icon"]

            hourDataArr.push([jsonRes["forecast"]["forecastday"][0]["hour"][data]["time"].split(" ")[1], Math.round(jsonRes["forecast"]["forecastday"][0]["hour"][data]["temp_c"]), imgURLA]);
          }
        }
      }

      for (let date in jsonRes["forecast"]["forecastday"]){
        let day = jsonRes["forecast"]["forecastday"][date]["date"];
        let avgTemp = Math.round(jsonRes["forecast"]["forecastday"][date]["day"]["avgtemp_c"]);
        let text = jsonRes["forecast"]["forecastday"][date]["day"]["condition"]["text"];

        fewDaysDataArr.push([day, avgTemp, text]);
      }

      // console.log(jsonRes["forecast"]["forecastday"][1]);
      // console.log(toString(jsonRes["forecast"]["forecastday"]).length)

      for (let item in codes){
        if(codes[item]["code"] == jsonRes["current"]["condition"]["code"]){
          // lightning = { uri: codes[item]["icon"] };
          // let img = require(codes[item]["icon"]);

          setIcon({ uri: codes[item]["icon"] });
          setHourData(hourDataArr);
          setFewDaysData(fewDaysDataArr);

          return;
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    (async () => {
       let { status } = await Location.requestForegroundPermissionsAsync();
      //  if (status !== 'granted') {
      //    setErrorMsg('Permission to access location was denied');
      //  }
 
      let currentLocation = await Location.getCurrentPositionAsync({})
      let region = await Location.reverseGeocodeAsync( { longitude: currentLocation.coords.longitude, latitude: currentLocation.coords.latitude } );
      setLocation(region);
      //  console.log(location[0].country);

      getTemp(region[0].postalCode);
    })();

    if (new Date().getHours() < 12 && new Date().getHours() >= 6){
      setTimeOfDay("Morning")
    } else if (new Date().getHours() >= 12 && new Date().getHours() < 18){
      setTimeOfDay("Afternoon")
    } else {
      setTimeOfDay("Evening")
    }

    // console.log(new Date().getHours())

   }, []);


  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider>
      <ScrollView>
        <View style={styles.container} onLayout={onLayoutRootView}>
          {/* <Ubuntu text="Good Afternoon"></Ubuntu> */}
          {/* <ImageBackground imageStyle={{ borderBottomLeftRadius: 45, borderBottomRightRadius: 45 }} source={image} style={styles.imgBG}> */}
          <LinearGradient colors={['#15BDF8', "#15BDF8", '#218fd1', '#1267f3']} style={styles.imgBG}>
            <View>
              <Title text={`Good\n${timeOfDay}`}></Title>
              <MiniTitle text={new Date().toLocaleString()}></MiniTitle>
            </View>

            {/* <View width> */}
            <Image source={icon} style={styles.icon} ></Image>
            {/* </View> */}
            
            <View>
              <Text style={styles.temp}>{temp}°</Text>
              <Text style={{
                fontFamily: "Ubuntu-Bold",
                marginTop: -25,
                textAlign: "center",
                color: "#FEFEFE",
                fontSize: RFPercentage(2),
              }}>Feels like {feelsLike}°</Text>
              <Text style={{
                fontFamily: "Ubuntu-Regular",
                marginTop: 10,
                textAlign: "center",
                color: "#FEFEFE",
                fontSize: RFPercentage(4),
              }}>{condition}</Text>

              <MiniTitle text={`${location[0].postalCode}, ${location[0].country}`}></MiniTitle>
            {/* <MiniTitle text={location[0].country}></MiniTitle> */}
            </View>

            <View
              style={{
                backgroundColor: "#fff",
                width: "100%",
                height: 0.5,
                marginTop: 20,
              }}
            />

            <View style={styles.icons}>
              <View style={styles.materialIcon}>
                <MaterialCommunityIcons name="weather-windy" size={RFPercentage(5)} color="white" />
                <Text style={styles.iconDataText}>{windSpeed} mph</Text>
                <Text style={styles.iconDataTextSmall}>{`Wind Speed`}</Text>
              </View>
              <View style={styles.materialIcon}>
              <Ionicons name="water-outline" size={RFPercentage(5)} color="white" />
                <Text style={styles.iconDataText}>{humidity}%</Text>
                <Text style={styles.iconDataTextSmall}>Humidity</Text>
              </View>
              <View style={styles.materialIcon}>
              <MaterialCommunityIcons name="weather-windy-variant" size={RFPercentage(5)} color="white" />
                <Text style={styles.iconDataText}>{windPressure} in</Text>
                <Text style={styles.iconDataTextSmall}>{`Wind Pressure`}</Text>
              </View>
            </View>
          {/* </ImageBackground> */}
          </LinearGradient>
          
          
          <View style={{ flexGrow: 1, marginLeft: 20, marginRight: 20, marginBottom: 30, }}>
            {/* <View style={{ flexDirection: "row", marginBottom: 10, }}> */}
              <Text style={styles.today}>Today</Text>
              {/* <Text style={styles.next7Days}>Next 7 Days</Text> */}
            {/* </View> */}

            <ScrollView horizontal={true}>
              <View style={styles.hourDataStyle}>
                {
                  hourData.map(data => {
                    // console.log();

                    if (parseInt(data[0].substring(0, 2)) == new Date().getHours()){
                      return (
                        <ImageBackground key={data[0]} source={image} style={styles.cardActive} imageStyle={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                          <Text style={{
                              marginTop: 10,
                              textAlign: "center",
                              fontFamily: "Ubuntu-Regular",
                              color: "#FFF",
                              fontSize: RFPercentage(2),
                          }}>{data[0]}</Text>
                          <Image source={{ uri: data[2] }} style={{ width: "100%", aspectRatio: 1/1, marginTop: -20, }}></Image>
                          <Text style={{
                            textAlign: "center",
                            fontFamily: "Mukta-SemiBold",
                            color: "#FFF",
                            fontSize: RFPercentage(5),
                            marginTop: -35,
                          }}>{data[1]}°</Text>
                        </ImageBackground>
                      )
                    }
                    
                    return (
                      <View key={data[0]} style={styles.card}>
                        <Text style={styles.miniHour}>{data[0]}</Text>
                        <Image source={{ uri: data[2] }} style={{ width: "100%", aspectRatio: 1/1, marginTop: -20, }}></Image>
                        <Text style={styles.cardTemp}>{data[1]}°</Text>
                      </View>
                    )
                })
                }

                {/* <View style={styles.card}>
                  <Text style={styles.miniHour}>19:00</Text>
                  <Image source={icon} style={{ width: "100%", aspectRatio: 1/1, marginTop: -20, }}></Image>
                  <Text style={styles.cardTemp}>19°</Text>
                </View> */}

                {/* <ImageBackground source={image} style={styles.cardActive} imageStyle={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                  <Text style={{
                      marginTop: 10,
                      textAlign: "center",
                      fontFamily: "Ubuntu-Regular",
                      color: "#FFF",
                      fontSize: RFPercentage(2),
                  }}>19:00</Text>
                  <Image source={icon} style={{ width: "100%", aspectRatio: 1/1, marginTop: -20, }}></Image>
                  <Text style={{
                    textAlign: "center",
                    fontFamily: "Mukta-SemiBold",
                    color: "#FFF",
                    fontSize: RFPercentage(5),
                    marginTop: -35,
                  }}>19°</Text>
                </ImageBackground> */}
              </View>
            </ScrollView>

            <Text style={styles.next7Days}>Next Few Days {<Text style={styles.avgTempStyle}>(Average Temperature)</Text>}</Text>

            <View>
              {
                fewDaysData.map(data => {
                  let date = `${data[0].split("-")[2]}/${data[0].split("-")[1]}/${data[0].split("-")[0]}`;

                  return (
                    <View key={data[1]} style={{
                      display: "flex",
                      // justifyContent: "space-between",
                      flexDirection: "row",
                      // flexWrap: "nowrap",
                    }}>
                      <Text style={{
                        flex: 1,
                        color: "#7c94b4",
                        marginBottom: 4,
                        fontFamily: "Ubuntu-Medium",
                        fontSize: RFPercentage(2),
                      }}>{date}</Text>
                      <Text style={{
                        flex: 1,
                        color: "#FFF",
                        marginBottom: 4,
                        fontFamily: "Ubuntu-Medium",
                        fontSize: RFPercentage(2),
                        justifyContent: "flex-end",
                      }}>{data[1]}°</Text>
                      <Text numberOfLines={1} style={{
                        flex: 1,
                        color: "#7c94b4",
                        fontFamily: "Ubuntu-Medium",
                        fontSize: RFPercentage(2),
                        justifyContent: "center",
                      }}>{data[2]}</Text>
                    </View>
                )})
              }
            </View>
          </View>
          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000918",
  },
  imgBG: {
    flex: 0,
    alignItems: "center",
    padding: "10%",
    paddingBottom: "5%",
    // borderRadius: 50,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
  },
  title: {
    textAlign: "center",
    fontFamily: "Ubuntu-Medium",
    color: "#fff",
    fontSize: RFPercentage(6),
  },
  miniTitle: {
    marginTop: 10,
    textAlign: "center",
    fontFamily: "Ubuntu-Regular",
    color: "#FEFEFE",
    fontSize: RFPercentage(2),
  },
  miniHour: {
    marginTop: 10,
    textAlign: "center",
    fontFamily: "Ubuntu-Regular",
    color: "#5A697B",
    fontSize: RFPercentage(2),
  },
  iconDataText: {
    marginTop: 5,
    textAlign: "center",
    fontFamily: "Ubuntu-Regular",
    color: "#fff",
    fontSize: RFPercentage(2),
  },
  iconDataTextSmall: {
    marginTop: 5,
    textAlign: "center",
    fontFamily: "Ubuntu-Regular",
    color: "#fefefe",
    fontSize: RFPercentage(2),
  },
  today: {
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Ubuntu-Medium",
    color: "#FFF",
    fontSize: RFPercentage(3),
    // textAlign: "left",
  },
  next7Days: {
    fontFamily: "Ubuntu-Medium",
    color: "#007EC5",
    opacity: 0.8,
    fontSize: RFPercentage(2.5),
    marginBottom: 10,
    // textAlign: "right",
  },
  avgTempStyle: {
    fontFamily: "Ubuntu-Medium",
    color: "#96b0d7",
    opacity: 0.8,
    fontSize: RFPercentage(1.75),
    marginBottom: 10,
  },
  icon: {
    marginTop: -80,
    width: "120%",
    aspectRatio: 1/1,
  },
  temp: {
    marginTop: -100,
    textAlign: "center",
    fontFamily: "Mukta-SemiBold",
    color: "#FEFEFE",
    fontSize: RFPercentage(13),
  },
  icons: {
    width: "100%",
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  materialIcon: {
    marginLeft: 20,
    marginRight: 20,
    alignItems: "center",
  },
  hourDataStyle: {
    flexDirection: "row",
    marginLeft: -5,
    marginRight: -5,
    marginBottom: 10,
  },
  card: {
    // backgroundColor: "#fff",
    width: 120,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#1e3250",
    alignItems: "center",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },
  cardActive: { 
    width: 120,
    borderRadius: 30,
    alignItems: "center",
  },
  cardTemp: {
    textAlign: "center",
    fontFamily: "Mukta-SemiBold",
    color: "#DFDFDF",
    fontSize: RFPercentage(5),
    marginTop: -35,
  },
  dayInfo: {
    flex: 1,
    color: "#7c94b4",
    marginBottom: 4,
    fontFamily: "Ubuntu-Medium",
    fontSize: RFPercentage(2),
  }
});
