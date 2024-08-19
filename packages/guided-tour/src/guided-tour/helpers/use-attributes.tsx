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

export const useAttributes = (element: HTMLElement | null) => {
  const [attributes, setAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (element) {
      const updateAttributes = () => {
        setAttributes(getAttributes(element));
      };

      const mutationObserver = new MutationObserver(updateAttributes);
      mutationObserver.observe(element, {
        attributes: true,
      });
      updateAttributes();

      return () => {
        mutationObserver.disconnect();
      };
    }
  }, [element]);

  return attributes;
};
