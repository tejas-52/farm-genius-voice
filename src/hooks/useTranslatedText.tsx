import { useState, useEffect } from "react";
import { useTranslation } from "./useTranslation";

export function useTranslatedText(text: string): string {
  const { currentLanguage, translate } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    if (currentLanguage.code === "en") {
      setTranslatedText(text);
      return;
    }

    let cancelled = false;
    
    translate(text).then((result) => {
      if (!cancelled) {
        setTranslatedText(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [text, currentLanguage.code, translate]);

  return translatedText;
}
