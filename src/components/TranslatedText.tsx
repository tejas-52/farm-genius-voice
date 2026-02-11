import { useTranslatedText } from "@/hooks/useTranslatedText";

interface TranslatedTextProps {
  children: string;
}

export function TranslatedText({ children }: TranslatedTextProps) {
  const translatedText = useTranslatedText(children);
  return <>{translatedText}</>;
}

export function T({ children }: TranslatedTextProps) {
  return <TranslatedText>{children}</TranslatedText>;
}
