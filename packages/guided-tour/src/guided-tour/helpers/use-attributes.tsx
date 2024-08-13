import { useEffect, useState } from "react";

const getAttributes = (element: HTMLElement) => {
  const attributes: Record<string, string> = Array.from(element.getAttributeNames()).reduce(
    (acc: Record<string, string>, attr: string) => {
      const value = element.getAttribute(attr);
      if (value) acc[attr] = value;
      return acc;
    },
    {},
  );
  return attributes;
};

export const useAttributes = (elementRef: React.RefObject<HTMLElement | null>) => {
  const [attributes, setAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (elementRef.current) {
      const mutationObserver = new MutationObserver(() => {
        setAttributes(getAttributes(elementRef.current!));
      });
      mutationObserver.observe(elementRef.current, {
        attributes: true,
      });
      return () => {
        mutationObserver.disconnect();
      };
    }
  }, [elementRef]);

  return attributes;
};
