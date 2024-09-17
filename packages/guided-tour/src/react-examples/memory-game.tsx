import { MAudioElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { InfoButton } from "../components/info-button";
import { PlayButton } from "../components/play-button";

const numberOfImages = 8;
const columns = 4;

const imageScale = 1.45;
const imageEmissive = 1.5;

const animationTime = 500;
const revealTime = 4000;

const cubeScale = 1.6;
const cubeDepth = 0.1;
const depthCheckSkin = 0.005;
const gap = 1.7;

const blockColor = "#424242";
const blockMatchedColor = "#00ff00";
const blockSelectedColor = "#ffffff";

const frameColor = "#cccccc";

const infoAudioURL = "/assets/guidedtour/sfx_memgame_info.mp3";

const sfxPlayURL = "/assets/guidedtour/sfx_memgame_play.mp3";
const sfxWinURL = "/assets/guidedtour/sfx_memgame_win.mp3";
const sfxYesURL = "/assets/guidedtour/sfx_memgame_yes.mp3";
const sfxNoURL = "/assets/guidedtour/sfx_memgame_no.mp3";

const availableImages = Array.from(
  { length: 15 },
  (_, i) => `/assets/guidedtour/texture_memgame_${i.toString().padStart(2, "0")}.jpg`,
);

type Block = {
  id: number;
  textureURL: string;
  hidden: boolean;
  matched: boolean;
  x: number;
  y: number;
};

const shuffleArray = (array: Array<string | Block>) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const GameFrame = memo(
  ({ x, y, z, color }: { x?: number; y?: number; z?: number; color: string }) => {
    const totalBlocks = numberOfImages * 2;
    const rows = Math.ceil(totalBlocks / columns);
    const frameWidth = columns * gap;
    const frameHeight = rows * gap;

    return (
      <m-group x={x} y={y} z={z}>
        <m-cube
          id="frame-back"
          color={color}
          width={frameWidth + 0.5}
          height={frameHeight + 0.5}
          depth={0.5}
          x={frameWidth / 2 - gap / 2}
          y={frameHeight / 2 - gap / 2}
          z={-0.35}
        ></m-cube>
        <m-cube
          id="frame-left"
          color={color}
          width={0.2}
          height={frameHeight + cubeScale / 2 + 0.42}
          depth={0.92}
          x={0 - cubeScale / 2 - gap / 8}
          y={frameHeight / 2 - cubeScale / 2 - gap / 4}
          z={0}
        ></m-cube>
        <m-cube
          id="frame-right"
          color={color}
          width={0.2}
          height={frameHeight + cubeScale / 2 + 0.42}
          depth={0.92}
          x={0 + frameWidth / 2 + cubeScale / 2 + gap + gap / 8}
          y={frameHeight / 2 - cubeScale / 2 - gap / 4}
        ></m-cube>
        <m-cube
          id="frame-top"
          color={color}
          width={frameWidth + 0.5 + 0.03}
          height={0.2}
          depth={0.92}
          x={frameWidth / 2 - gap / 2}
          y={frameHeight + 0.5 - gap / 2 - 0.165}
          z={0}
        ></m-cube>
        <m-cube
          id="frame-bottom"
          color={color}
          width={frameWidth + 0.5}
          height={1}
          depth={0.5}
          x={frameWidth / 2 - gap / 2}
          y={-1.28}
          z={-0.07}
          rx={-45}
        ></m-cube>
      </m-group>
    );
  },
);
GameFrame.displayName = "GameFrame";

const GameBlocks = memo(({ x, y, z }: { x?: number; y?: number; z?: number }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const mounted = useRef<boolean>(false);
  const audioRef = useRef<MAudioElement | null>(null);

  const [firstIndexSelected, setFirstIndexSelected] = useState<number | null>(null);
  const [secondIndexSelected, setSecondIndexSelected] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [gameInProgress, setGameInProgress] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_gamesPlayed, setGamesPlayed] = useState(new Date().getTime());

  const playSFX = useCallback((sfx: "play" | "yes" | "no" | "win") => {
    const now = document.timeline.currentTime as number;
    if (audioRef.current) {
      switch (sfx) {
        case "play":
          audioRef.current.setAttribute("src", sfxPlayURL);
          break;
        case "yes":
          audioRef.current.setAttribute("src", sfxYesURL);
          break;
        case "no":
          audioRef.current.setAttribute("src", sfxNoURL);
          break;
        case "win":
          audioRef.current.setAttribute("src", sfxWinURL);
          break;
        default:
          break;
      }
      audioRef.current.setAttribute("volume", "5");
      audioRef.current.setAttribute("start-time", `${now}`);
      audioRef.current.setAttribute("pause-time", `${now + 1200}`);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.setAttribute("volume", "0");
        }
      }, 1200);
    }
  }, []);

  const initializeBlocks = useCallback(() => {
    const newBlocks = Array.from({ length: numberOfImages * 2 }, (_, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      return {
        id: index,
        textureURL: images[index],
        hidden: true,
        matched: false,
        x: col * gap,
        y: row * gap,
      };
    });
    setBlocks(newBlocks);
  }, [setBlocks, images]);

  const initializeImages = useCallback(() => {
    const newImages = shuffleArray(availableImages).slice(0, numberOfImages);
    const duplicatedImages = newImages.concat(newImages);
    const shuffledImages = shuffleArray(duplicatedImages);
    setImages(shuffledImages as Array<string>);
  }, [setImages]);

  const revealBlock = useCallback((blockId: number) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((b) => (b.id === blockId ? { ...b, hidden: false, color: "#eeeeee" } : b)),
    );
  }, []);

  const hideBlock = useCallback((blockId: number) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((b) => (b.id === blockId ? { ...b, hidden: true, color: "#424242" } : b)),
    );
  }, []);

  const hideAllBlocks = useCallback(() => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => ({ ...block, hidden: true, color: "#424242" })),
    );
  }, []);

  const revealAllBlocks = useCallback(() => {
    setBlocks((prevBlocks) => prevBlocks.map((block) => ({ ...block, hidden: false })));
  }, []);

  const startGame = useCallback(() => {
    revealAllBlocks();
    playSFX("play");
    setTimeout(() => hideAllBlocks(), revealTime);
    setTimeout(() => setIsResetting(false), revealTime + animationTime);
  }, [hideAllBlocks, playSFX, revealAllBlocks]);

  const resetGame = useCallback(() => {
    setGamesPlayed((prev) => prev + 1);
    setIsResetting(true);
    hideAllBlocks();
    setTimeout(() => initializeImages(), animationTime);
    setTimeout(() => startGame(), 1000 + animationTime);
    setGameInProgress(false);
  }, [hideAllBlocks, initializeImages, startGame]);

  const checkIfGameOver = useCallback(() => {
    if (gameInProgress === false) return;
    if (blocks.every((block) => block.matched)) {
      playSFX("win");
      setIsResetting(true);
      setGameInProgress(false);
      setTimeout(() => resetGame(), revealTime);
    }
  }, [blocks, gameInProgress, playSFX, resetGame]);

  const handleBlockClick = useCallback(
    (blockId: number) => {
      if (animating || isResetting) return;

      const block = blocks.find((b) => b.id === blockId);
      if (!block || block.hidden === false || block.matched === true) return;

      if (gameInProgress === false) {
        setGameInProgress(true);
      }

      if (firstIndexSelected === null) {
        setAnimating(true);
        setTimeout(() => setAnimating(false), animationTime);
        revealBlock(blockId);
        setFirstIndexSelected(blockId);
      } else if (secondIndexSelected === null) {
        revealBlock(blockId);
        setSecondIndexSelected(blockId);
        setAnimating(true);
        const blocksMatched = blocks[firstIndexSelected].textureURL === blocks[blockId].textureURL;
        if (blocksMatched) {
          playSFX("yes");
          setBlocks((prevBlocks) =>
            prevBlocks.map((b) => {
              if (b.id === firstIndexSelected || b.id === blockId) return { ...b, matched: true };
              return b;
            }),
          );
          setFirstIndexSelected(null);
          setSecondIndexSelected(null);
          setAnimating(false);
          checkIfGameOver();
        } else {
          playSFX("no");
          setTimeout(() => {
            setAnimating(false);
            hideBlock(firstIndexSelected);
            hideBlock(blockId);
            setFirstIndexSelected(null);
            setSecondIndexSelected(null);
          }, 1500);
        }
      }
    },
    [
      animating,
      blocks,
      checkIfGameOver,
      firstIndexSelected,
      gameInProgress,
      hideBlock,
      isResetting,
      playSFX,
      revealBlock,
      secondIndexSelected,
    ],
  );

  useEffect(() => initializeBlocks(), [images, initializeBlocks]);
  useEffect(() => checkIfGameOver(), [blocks, checkIfGameOver]);

  useEffect(() => {
    if (mounted.current === false) {
      mounted.current = true;
      initializeImages();
    }
  }, [initializeImages, mounted]);

  return (
    <m-group x={x} y={y} z={z}>
      <PlayButton
        x={-0.5}
        y={y ? -y : 0}
        z={3.5}
        ry={180}
        callback={startGame}
        reEnableTime={revealTime}
        overrideReenable={isResetting || gameInProgress ? false : undefined}
      />
      <m-audio ref={audioRef} loop="false"></m-audio>
      {blocks.map((block) => (
        <m-group
          key={block.id}
          x={block.x}
          y={block.y}
          z={0.1}
          ry={block.hidden ? 180 : 0}
          onClick={() => {
            handleBlockClick(block.id);
          }}
        >
          <m-attr-lerp attr="all" duration={animationTime} easing="easeInOutQuad"></m-attr-lerp>
          <m-cube
            color={
              block.matched ? blockMatchedColor : block.hidden ? blockColor : blockSelectedColor
            }
            width={cubeScale}
            height={cubeScale}
            depth={cubeDepth}
          >
            <m-attr-lerp attr="color" duration={animationTime} easing="easeInOutQuad"></m-attr-lerp>
          </m-cube>
          <m-image
            src={block.textureURL}
            width={imageScale}
            height={imageScale}
            z={cubeDepth / 2 + depthCheckSkin}
            emissive={imageEmissive}
          ></m-image>
        </m-group>
      ))}
    </m-group>
  );
});
GameBlocks.displayName = "GameBlocks";

type MemoryGameProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  visibleTo?: string | number;
};

export const MemoryGame = memo(({ x, y, z, ry, visibleTo }: MemoryGameProps) => {
  return (
    <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
      <InfoButton x={-1} z={3.6} ry={180} infoAudioURL={infoAudioURL} infoAudioDuration={21000} />
      <GameFrame color={frameColor} y={1.33} z={-0.33} />
      <GameBlocks y={1.4} z={0.1} />
    </m-group>
  );
});
MemoryGame.displayName = "MemoryGame";
