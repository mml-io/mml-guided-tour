import * as React from "react";

const worldSizeX = 19; // Number of cells horizontally
const worldSizeY = 16; // Number of cells vertically
const squareSize = 6;
const cellWidth = squareSize / worldSizeX;
const cellHeight = squareSize / worldSizeY;

const visibleOpacity = 1;
const invisibleOpacity = 0;

const spawnChance = 0.3333334;

type ConwayCubesProps = {
  x?: number;
  y?: number;
  z?: number;
  sy: number;
  sz: number;
};
const ConwayCubes = ({ x, y, z, sy, sz }: ConwayCubesProps) => {
  const [world, setWorld] = React.useState(
    new Array(worldSizeX).fill(0).map(() => new Array(worldSizeY).fill(0)),
  );
  const statesHistory = React.useRef(new Set());
  const latestCellCount = React.useRef<number[]>([]);

  const getID = (x: number, y: number): string => {
    return `x:${x}-y:${y}`;
  };

  const toggleCube = React.useCallback((x: number, y: number, visible: boolean): void => {
    const cubeID = getID(x, y);
    const cube = document.getElementById(cubeID);
    if (cube) {
      cube.setAttribute("opacity", visible ? `${visibleOpacity}` : `${invisibleOpacity}`);
      cube.setAttribute("cast-shadows", visible ? "true" : "false");
    }
  }, []);

  const initWorld = React.useCallback(() => {
    const newWorld = new Array(worldSizeX).fill(0).map(() => new Array(worldSizeY).fill(0));
    for (let x = 0; x < worldSizeX; x++) {
      for (let y = 0; y < worldSizeY; y++) {
        newWorld[x][y] = Math.random() < spawnChance ? 1 : 0;
        toggleCube(x, y, newWorld[x][y] === 1);
      }
    }
    setWorld(newWorld);
  }, [toggleCube]);

  const resetSimulation = React.useCallback(() => {
    statesHistory.current.clear();
    latestCellCount.current = [];
    initWorld();
  }, [initWorld]);

  const countNeighbours = React.useCallback(
    (x: number, y: number): number => {
      let count = 0;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const nx = (x + dx + worldSizeX) % worldSizeX;
          const ny = (y + dy + worldSizeY) % worldSizeY;
          count += world[nx][ny];
        }
      }
      return count;
    },
    [world],
  );

  const update = React.useCallback(() => {
    const newWorld = new Array(worldSizeX).fill(0).map(() => new Array(worldSizeY).fill(0));
    let hash = "";
    let aliveCells = 0;

    for (let x = 0; x < worldSizeX; x++) {
      for (let y = 0; y < worldSizeY; y++) {
        const nn = countNeighbours(x, y);
        const alive = world[x][y] === 1;

        if (alive && (nn < 2 || nn > 3)) {
          newWorld[x][y] = 0;
        } else if (!alive && nn === 3) {
          newWorld[x][y] = 1;
        } else {
          newWorld[x][y] = world[x][y];
        }

        if (newWorld[x][y] === 1) {
          aliveCells++;
        }

        hash += `${newWorld[x][y]}`;

        toggleCube(x, y, newWorld[x][y] === 1);
      }
    }

    latestCellCount.current.push(aliveCells);
    if (latestCellCount.current.length > 1000) {
      latestCellCount.current.shift();
    }

    setWorld(newWorld);

    let stuckWithGliders = false;
    if (latestCellCount.current.length >= 1000) {
      stuckWithGliders = latestCellCount.current.every((num) => num === latestCellCount.current[0]);
    }

    if (statesHistory.current.has(hash) || stuckWithGliders) {
      resetSimulation();
    } else {
      statesHistory.current.add(hash);
    }

    if (statesHistory.current.size > 2) {
      statesHistory.current.delete(statesHistory.current.values().next().value);
    }
  }, [countNeighbours, resetSimulation, toggleCube, world]);

  React.useEffect(() => {
    initWorld();
  }, [initWorld]);

  React.useEffect(() => {
    const intervalId = setInterval(update, 1000.0 / 4.0);
    return () => clearInterval(intervalId);
  }, [update]);

  return (
    <m-group id="cubes-group" x={x} y={y} z={z} sy={sy} sz={sz}>
      <m-group ry="90">
        {Array.from(world.keys()).map((x) =>
          Array.from(world[x].keys()).map((y) => (
            <m-cube
              key={`cube-${x}-${y}`}
              id={`x:${x}-y:${y}`}
              x={(x - worldSizeX / 2) * cellWidth + cellWidth / 2}
              y={cellHeight * y + cellHeight / 2}
              z={0}
              color={`hsl(${(x / worldSizeX) * 360}, 100%, 70%)`}
              sx={cellWidth}
              sy={cellHeight}
              sz={0.25}
              collide="false"
              cast-shadows="false"
              opacity={invisibleOpacity}
            ></m-cube>
          )),
        )}
      </m-group>
    </m-group>
  );
};

export default ConwayCubes;
