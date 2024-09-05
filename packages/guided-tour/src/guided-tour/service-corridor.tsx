import * as React from "react";
import { memo } from "react";

import { Travelator } from "./components/travelator";

type ServiceCorridorProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  wallColor: string;
  glassColor: string;
  glassOpacity: number;
};
export const ServiceCorridor = memo(
  ({
    x,
    y,
    z,
    width,
    height,
    depth,
    wallColor,
    glassColor,
    glassOpacity,
  }: ServiceCorridorProps) => {
    const wallThickness = 0.1;
    const closeGapDistance = 4.75;
    const travelatorWidth = 8;
    const travelatorDepth = 40;
    const travelatorSteps = 10;
    const travelatorTravelTime = 3000;
    return (
      <m-group x={x} y={y} z={z}>
        <m-cube
          id="ground"
          x={-width / 2 - closeGapDistance}
          y={-wallThickness}
          width={width}
          height={wallThickness}
          depth={depth}
          color={wallColor}
        ></m-cube>
        <m-cube
          id="start-wall"
          x={-width / 2 - closeGapDistance}
          z={-depth / 2}
          y={height / 2}
          width={width}
          height={height}
          color={wallColor}
        ></m-cube>
        <m-cube
          id="end-wall"
          x={-width / 2 - closeGapDistance}
          z={depth / 2}
          y={height / 2}
          width={width}
          height={height}
          color={wallColor}
        ></m-cube>
        <m-cube
          id="glass-wall"
          x={-width - closeGapDistance}
          y={height / 2 - wallThickness - 1.5}
          width={width - closeGapDistance}
          height={wallThickness}
          depth={depth}
          opacity={glassOpacity}
          rz={90}
          color={glassColor}
          cast-shadows={false}
        ></m-cube>
        <m-cube
          id="column"
          x={-width - closeGapDistance + 0.5}
          y={height - wallThickness - 0.5}
          width={1}
          height={1}
          depth={depth}
          opacity={1}
          rz={90}
          color={wallColor}
        ></m-cube>
        <m-cube
          id="ceiling"
          x={-width / 2 - closeGapDistance - 0.5}
          y={height - wallThickness}
          width={width - 0.5}
          height={wallThickness}
          depth={depth}
          opacity={glassOpacity}
          color={glassColor}
          cast-shadows={false}
        ></m-cube>
        {Array.from({ length: 4 }).map((_, i) => {
          return (
            <m-group key={i}>
              <Travelator
                x={-width / 2 - 2}
                y={0.1}
                z={-depth / 2 + 48.5 + i * 53.65}
                ry={0}
                width={travelatorWidth}
                depth={travelatorDepth}
                steps={travelatorSteps}
                travelTime={travelatorTravelTime}
                saturation={20}
                lightness={60}
              />
              <Travelator
                x={-width / 2 - 12}
                y={0.1}
                z={-depth / 2 + 48.5 + i * 53.65}
                ry={0}
                width={travelatorWidth}
                depth={travelatorDepth}
                steps={travelatorSteps}
                travelTime={travelatorTravelTime}
                reverse={true}
                saturation={20}
                lightness={60}
              />
            </m-group>
          );
        })}
      </m-group>
    );
  },
);
ServiceCorridor.displayName = "ServiceCorridor";
