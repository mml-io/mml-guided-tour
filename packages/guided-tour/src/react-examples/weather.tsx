import { MGroupElement, MLabelElement } from "@mml-io/mml-react-types";
import * as React from "react";

type WeatherProps = {
  x?: number;
  y?: number;
  z?: number;
  sx?: number;
  sy?: number;
  sz?: number;
  ry?: number;
  visibleTo?: string;
};
export const Weather = React.memo(({ x, y, z, sx, sy, sz, ry, visibleTo }: WeatherProps) => {
  const APIKey = "47108c5655a21af250ffd62afaf1a3c9";
  const baseAPIURL = "https://api.openweathermap.org/data/2.5/weather";
  const iconBaseURL = "https://openweathermap.org/img/wn";
  const iconBaseURLSuffix = "@4x.png";
  const geocodingAPIURL = "http://api.openweathermap.org/geo/1.0/direct";
  const defaultPlace = "Leeds";

  const mounted = React.useRef<boolean>(false);

  const fontSize = 50;
  const color = "#303030";
  const fontColor = "#ffffff";
  const height = 0.7;

  const locationLabel = React.useRef<MLabelElement>(null);
  const windLabel = React.useRef<MLabelElement>(null);
  const tempLabel = React.useRef<MLabelElement>(null);
  const weatherLabel = React.useRef<MLabelElement>(null);
  const sunriseLabel = React.useRef<MLabelElement>(null);
  const sunsetLabel = React.useRef<MLabelElement>(null);
  const updatedLabel = React.useRef<MLabelElement>(null);
  const iconGroupRef = React.useRef<MGroupElement>(null);

  const fetchData = React.useCallback(async (url: string) => {
    return new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const json = JSON.parse(xhr.responseText);
              resolve(json);
            } else {
              reject(`Failed to fetch data: status ${xhr.status}`);
            }
          }
        };
        xhr.send();
      } catch (e) {
        reject(`Error fetching data: ${e}`);
      }
    });
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const numMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${numMinutes} ${ampm}`;
  };

  const getCurrentFormattedTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const numMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${numMinutes} ${ampm}`;
  };

  const fetchAPIData = React.useCallback(
    async (cityName: string) => {
      const location = locationLabel.current;
      const sunrise = sunriseLabel.current;
      const sunset = sunsetLabel.current;
      const iconGroup = iconGroupRef.current;
      const temp = tempLabel.current;
      const wind = windLabel.current;
      const weather = weatherLabel.current;
      const updated = updatedLabel.current;
      console.log("fetching");

      if (location && sunrise && sunset && temp && wind && weather && updated && iconGroup) {
        try {
          const geocodingURL = `${geocodingAPIURL}?q=${cityName}&limit=1&appid=${APIKey}`;
          const geocodingJSON = (await fetchData(geocodingURL)) as any;
          const { lat, lon } = geocodingJSON[0];

          if (lat && lon) {
            location.setAttribute("content", cityName);
            const requestURL = `${baseAPIURL}?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;
            const weatherJSON = (await fetchData(requestURL)) as any;

            const { temp } = weatherJSON.main;
            const { speed, deg } = weatherJSON.wind;
            const { sunrise, sunset } = weatherJSON.sys;
            const { description, icon } = weatherJSON.weather[0];

            sunrise.setAttribute("content", `sunrise: ${formatTimestamp(sunrise)}`);
            sunset.setAttribute("content", `sunset: ${formatTimestamp(sunset)}`);

            const iconURL = `${iconBaseURL}/${icon}${iconBaseURLSuffix}`;
            const iconImage = document.createElement("m-image");
            iconImage.setAttribute("width", `${2.75}`);
            iconImage.setAttribute("height", `${2.75}`);
            iconImage.setAttribute("src", iconURL);
            iconImage.setAttribute("x", `${-3.65}`);
            iconImage.setAttribute("y", `${2.25}`);
            iconImage.setAttribute("z", `${0.03}`);
            iconGroup.appendChild(iconImage);

            const color = temp > 15 ? (temp > 25 ? "#ffcccc" : "#ccffcc") : "#ccccff";
            const temperature = `${temp}°C`;
            temp.setAttribute("content", `Temp: ${temperature}`);
            temp.setAttribute("font-color", color);

            const windSpeed = `${speed} km/h`;
            wind.setAttribute("content", `Wind: ${windSpeed} ${deg}°`);
            weather.setAttribute("content", description);
            updated.setAttribute("content", `last updated at ${getCurrentFormattedTime()}`);
          } else {
            console.error(`Error: can't get lat and lon for location ${cityName}`);
          }
        } catch (e) {
          console.log("Unable to fetch data");
          console.error(`Error: ${e}`);
        }
      }
    },
    [fetchData],
  );

  React.useEffect(() => {
    fetchAPIData(defaultPlace);
    if (mounted.current === false) {
      mounted.current = true;
      fetchAPIData(defaultPlace);
      setInterval(
        () => {
          fetchAPIData(defaultPlace);
        },
        5 * 60 * 1000,
      );
    }
  }, [fetchAPIData]);

  return (
    <m-group x={x} y={y} z={z} sx={sx} sy={sy} sz={sz} ry={ry} visible-to={visibleTo}>
      <m-cube width="10.2" height="4.65" depth="0.1" y="1.85" z="-0.07" color="#ffffff"></m-cube>
      <m-group id="icon-group"></m-group>
      <m-group id="labels-group">
        <m-label
          ref={locationLabel}
          content="location"
          x={0}
          y={3.6}
          width={10}
          height={0.9}
          color={color}
          font-color={fontColor}
          font-size={fontSize + 10}
        ></m-label>
        <m-label
          ref={windLabel}
          content="wind speed"
          x={0}
          y={2.7}
          width={10}
          height={height}
          color={color}
          font-color={fontColor}
          font-size={fontSize}
        ></m-label>
        <m-label
          ref={tempLabel}
          content="temperature"
          x={0}
          y={2}
          width={10}
          height={height}
          color={color}
          font-color={fontColor}
          font-size={fontSize}
        ></m-label>
        <m-label
          ref={weatherLabel}
          content="weather"
          x={0}
          y={1.3}
          width={10}
          height={height}
          color={color}
          font-color={fontColor}
          font-size={fontSize}
        ></m-label>
        <m-label
          ref={sunriseLabel}
          content="sunrise"
          x={-2.5}
          y={0.6}
          width={5}
          height={height}
          color={color}
          font-color={fontColor}
          font-size={fontSize - 10}
        ></m-label>
        <m-label
          ref={sunsetLabel}
          content="sunset"
          x={2.5}
          y={0.6}
          width={5}
          height={height}
          color={color}
          font-color={fontColor}
          font-size={fontSize - 10}
        ></m-label>
        <m-label
          ref={updatedLabel}
          content="updated"
          x={0}
          y={0}
          width={10}
          height={height}
          color={color}
          font-color={fontColor}
          font-size={fontSize}
        ></m-label>
      </m-group>
    </m-group>
  );
});
Weather.displayName = "Weather";
