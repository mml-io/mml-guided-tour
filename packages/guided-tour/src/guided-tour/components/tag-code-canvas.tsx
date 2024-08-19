import * as React from "react";
import { memo, useCallback, useEffect, useState } from "react";

type TagCodeCanvasProps = {
  tagAttributes: Record<string, string>;
  fontSize: number;
  color: string;
  emissive: number;
  tag: string;
};

export const TagCodeCanvas = memo(
  ({ tagAttributes, fontSize, color, emissive, tag }: TagCodeCanvasProps) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const [lineHeight, setLineHeight] = useState<number>(0);
    const [canvasFontSize] = useState<number>(fontSize);

    const [imageWidth, setImageWidth] = useState<number>(0);
    const [imageHeight, setImageHeight] = useState<number>(0);

    const [openingTag] = useState<string>(`<${tag}`);
    const [closingTag] = useState<string>(`></${tag}>`);

    const [imageSrc, setImageSrc] = useState<string>("");
    const [imageEmissive] = useState<number>(emissive);

    const defaultColor = color || "#ffffff";
    const attributeColor = "#ff77aa";
    const eqColor = "#777777";
    const valueColor = "#33aaff";

    const treatedValue = (value: string | number): string => {
      const numberValue = parseFloat(value as string);
      return !isNaN(numberValue)
        ? numberValue.toFixed(2)
        : (value as string).replace("/assets/guidedtour", "https://mml.io");
    };

    const paintCanvas = useCallback(() => {
      ctx!.font = `900 ${canvasFontSize}px monospace`;
      let yPos = lineHeight;
      ctx!.fillStyle = defaultColor;
      ctx!.fillText(openingTag, 0, yPos);
      yPos += lineHeight;
      Object.entries(tagAttributes).forEach(([attribute, attributeValue]) => {
        let xOffset = canvasFontSize * 0.6;

        const notNumberOrBool =
          isNaN(parseFloat(attributeValue as string)) &&
          attributeValue !== "true" &&
          attributeValue !== "false";
        let value = treatedValue(attributeValue);
        if (notNumberOrBool) {
          value = `"${value}"`;
        }

        ctx!.fillStyle = attributeColor;
        ctx!.fillText(` ${attribute}`, xOffset, yPos);
        xOffset += canvasFontSize * (attribute.length + 2) * 0.6;
        ctx!.fillStyle = eqColor;
        ctx!.fillText("=", xOffset, yPos);
        xOffset += canvasFontSize * 2 * 0.6;
        ctx!.fillStyle = valueColor;
        ctx!.fillText(value, xOffset, yPos);
        yPos += lineHeight;
        xOffset = canvasFontSize;
      });
      ctx!.fillStyle = defaultColor;
      ctx!.fillText(closingTag, 0, yPos);
      const dataUrl = canvas.toDataURL("image/png");
      setImageSrc(dataUrl);
    }, [
      canvas,
      closingTag,
      ctx,
      defaultColor,
      canvasFontSize,
      lineHeight,
      openingTag,
      tagAttributes,
    ]);

    const getElementAttributes = useCallback(() => {
      setLineHeight(parseFloat((canvasFontSize * 1.05).toFixed(2)));

      let maxCharacters = 0;
      Object.entries(tagAttributes).forEach(([attribute, attributeValue]) => {
        const value = treatedValue(attributeValue);
        if (attribute.length + value.length + 1 > maxCharacters) {
          maxCharacters = attribute.length + value.length + 3;
        }
      });
      const width = (maxCharacters + 5) * canvasFontSize * 0.6;
      const height = canvasFontSize * (Object.keys(tagAttributes).length + 2) * 1.25;
      canvas.width = width;
      canvas.height = height;
      setImageWidth(Math.round(width * 100) / 10000);
      setImageHeight(Math.round(height * 100) / 10000);
      ctx!.fillStyle = "rgba(0, 0, 0, 0)";
      ctx!.fillRect(0, 0, width, height);

      paintCanvas();
    }, [canvasFontSize, tagAttributes, canvas, ctx, paintCanvas]);

    useEffect(() => {
      getElementAttributes();
    }, [getElementAttributes, tagAttributes]);

    return (
      <m-group>
        <m-image
          src={imageSrc}
          width={imageWidth}
          height={imageHeight}
          emissive={imageEmissive}
          collide={false}
        ></m-image>
      </m-group>
    );
  },
);
TagCodeCanvas.displayName = "TagCodeCanvas";
