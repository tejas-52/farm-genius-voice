import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
];

// Fallback dictionary for common terms when API is unavailable
const fallbackDictionary: Record<string, Record<string, string>> = {
  "Languages Supported": { hi: "भाषाएँ उपलब्ध", mr: "उपलब्ध भाषाओ", pa: "ਭਾਸ਼ਾਵਾਂ ਸਮਰਥਿਤ", te: "భాషలు మద్దతు", gu: "ભાષાઓ સમર્થિત", ta: "மொழிகள் ஆதரிக்கப்படுகின்றன", kn: "ಭಾಷೆಗಳು ಬೆಂಬಲಿತವಾಗಿವೆ", bn: "ভাষা সমর্থित", ml: "ഭാഷകൾ പിന്തുണയ്ക്കുന്നു" },
  "Farmers Helped": { hi: "किसानों की मदद की", mr: "शेतकऱ्यांना मदत केली", pa: "ਕਿਸਾਨਾਂ ਦੀ ਮਦਦ ਕੀਤੀ", te: "రైతులకు సహాయపడింది", gu: "ખેડૂતોને મદદ કરી", ta: "விவசாயிகளுக்கு உதவியது", kn: "ರೈತರಿಗೆ ಸಹಾಯ ಮಾಡಿದೆ", bn: "কৃষকদের সাহায্য করা হয়েছে", ml: "കർഷകരെ സഹായിച്ചു" },
  "Accuracy Rate": { hi: "सटीकता दर", mr: "अचूकता दर", pa: "ਸ਼ੁੱਧਤਾ ਦਰ", te: "ఖచ్చితత్వం రేటు", gu: "ચોકસાઈ દર", ta: "துல்லிய விகிதம்", kn: "ನಿಖರತೆ ದರ", bn: "নির্ভুলতার হার", ml: "കൃത്യത നിരക്ക്" },
  "Always Available": { hi: "हमेशा उपलब्ध", mr: "नेहमी उपलब्ध", pa: "ਹਮੇਸ਼ਾ ਉਪਲਬਧ", te: "ఎల్లప్పుడూ అందుబాటులో", gu: "હંમેશા ઉપલબ્ધ", ta: "எப்போதும் கிடைக்கும்", kn: "ಯಾವಾಗಲೂ ಲಭ್ಯವಿದೆ", bn: "সর্বদা উপলব্ধ", ml: "എപ്പോഴും ലഭ്യമാണ്" },
  "Eco-Friendly Practices": { hi: "पर्यावरण-अनुकूल प्रथाएँ", mr: "पर्यावरण पूरक पद्धती", pa: "ਵਾਤਾਵਰਣ ਅਨੁਕੂਲ ਅਭਿਆਸ", te: "పర్యావరణ అనుకూల విధానాలు", gu: "પર્યાવરણલક્ષી પદ્ધતિઓ", ta: "சுற்றுச்சூழல் நட்பு நடைமுறைகள்", kn: "ಪರಿಸರ ಸ್ನೇಹಿ ಪದ್ಧತಿಗಳು", bn: "পরিবেশ বান্ধव অনুশীলন", ml: "പരിസ്ഥിതി സൗഹൃദ രീതികൾ" },
  "Reduce chemical inputs while maintaining high yields": { hi: "अधिक उपज बनाए रखते हुए रासायनिक आदानों को कम करें", mr: "उच्च उत्पादन कायम ठेवत रासायनिक वापर कमी करा", pa: "ਉੱਚ ਝਾੜ ਬਰਕਰਾਰ ਰੱਖਦੇ ਹੋਏ ਰਸਾਇਣਕ ਨਿਵੇਸ਼ ਘਟਾਓ", te: "అధిక దిగుబడిని కొనసాగిస్తూ రసాయన వినియోగాన్ని తగ్గించండి" },
  "Solar Integration": { hi: "सौर एकीकरण", mr: "सौर ऊर्जा वापर", pa: "ਸੋਲਰ ਏਕੀਕਰਣ", te: "సౌర ఏకీకరణ", gu: "સોલર સંકલન", ta: "சூரிய ஒருங்கிணைப்பு", kn: "ಸೌರ ಏಕೀಕರಣ", bn: "ਸੌਰ ਸੰহতਕਰਨ", ml: "സൗരോർജ്ജ സംയോജനം" },
  "Save ₹15,000-30,000/year with renewable energy": { hi: "अक्षय ऊर्जा के साथ ₹15,000-30,000/वर्ष बचाएं", mr: "अक्षय ऊर्जेद्वारे ₹15,000-30,000/वर्ष वाचवा", pa: "ਨਵਿਆਉਣਯੋਗ ਊਰਜਾ ਨਾਲ ਸਾਲਾਨਾ ₹15,000-30,000 ਬਚਾਓ", te: "పునరుత్పాదక శక్తితో సంవత్సరానికి ₹15,000-30,000 ఆదా చేయండి" },
  "Water Conservation": { hi: "जल संरक्षण", mr: "जल संधारण", pa: "ਜਲ ਸੰਭਾਲ", te: "నీటి సంరక్షణ", gu: "જળ સંરક્ષણ", ta: "நீர் பாதுகாப்பு", kn: "ಜಲ ಸಂರಕ್ಷಣೆ", bn: "জল সংরক্ষণ", ml: "ജല സംരക്ഷണം" },
  "Smart irrigation reduces water usage by 40%": { hi: "स्मार्ट सिंचाई से पानी का उपयोग 40% कम हो जाता है", mr: "स्मार्ट सिंचनामुळे पाण्याचा वापर 40% कमी होतो", pa: "ਸਮਾਰਟ ਸਿੰਚਾਈ ਪਾਣੀ ਦੀ ਵਰਤੋਂ 40% ਘਟਾਉਂਦੀ ਹੈ", te: "స్మార్ట్ సాగు నీటి వినియోగం 40% తగ్గిస్తుంది" },
  "Speak naturally in your language": { hi: "अपनी भाषा में स्वाभाविक रूप से बोलें", mr: "तुमच्या भाषेत नैसर्गिकरित्या बोला", pa: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਕੁਦਰਤੀ ਤੌਰ 'ਤੇ ਬੋਲੋ", te: "మీ భాషలో సహజంగా మాట్లాడండి" },
  "Voice-First": { hi: "वॉयस-फर्स्ट", mr: "व्हॉइस-फर्स्ट", pa: "ਵੌਇਸ-ਫਸਟ", te: "వాయిస్-ఫर्स्ट" },
  "Risk Assessment": { hi: "जोखिम मूल्यांकन", mr: "जोखिम मूल्यांकन", pa: "ਜੋਖਮ ਮੁਲਾਂਕਣ", te: "ప్రమాద అంచనా" },
  "Prevent crop loss with early warnings": { hi: "प्रारंभिक चेतावनी के साथ फसल के नुकसान को रोकें", mr: "सकाळी चेतावणी देऊन पीक नुकसान टाळा", pa: "ਸ਼ੁਰੂਆਤੀ ਚੇਤਾਵਨੀਆਂ ਨਾਲ ਫਸਲ ਦੇ ਨੁਕਸਾਨ ਨੂੰ ਰੋਕੋ", te: "ముందస్తు హెచ్చరికలతో పంట నష్టాన్ని నివారించండి" },
  "Sustainability": { hi: "स्थिरता", mr: "शाश्वतता", pa: "ਸਥਿਰਤਾ", te: "స్థిరత్వం" },
  "Eco-friendly farming insights": { hi: "पर्यावरण के अनुकूल खेती की जानकारी", mr: "पर्यावरणपूरक शेती विषयक माहिती", pa: "ਵਾਤਾਵਰਣ ਅਨੁਕੂਲ ਖੇਤੀ ਜਾਣਕਾਰੀ", te: "పర్యావరణ అనుకూల వ్యవసాయ సమాచారం" },
  "Solar & Energy": { hi: "सौर और ऊर्जा", mr: "सौर आणि ऊर्जा", pa: "ਸੋਲਰ ਅਤੇ ਊਰਜਾ", te: "సౌర మరియు శక్తి" },
  "Renewable energy guidance": { hi: "नवीकरणीय ऊर्जा मार्गदर्शन", mr: "अक्षय ऊर्जा मार्गदर्शन", pa: "ਨਵਿਆਉਣਯੋਗ ਊਰਜਾ ਮਾਰਗਦਰਸ਼ਨ", te: "పునరుత్పాదక శక్తి మార్గదర్శనం" },
  "AI-Powered Sustainable Farming": { hi: "एआई-संचालित टिकाऊ खेती", mr: "AI-आधारित शाश्वत शेती", pa: "AI-ਸੰਚਾਲਿਤ ਸਥਿਰ ਖੇਤੀ", te: "AI-ఆధారిత స్థిరమైన వ్యవసాయం" },
  "Your AI Farming": { hi: "आपकी एआई खेती", mr: "तुमची AI शेती", pa: "ਤੁਹਾਡੀ AI ਖੇਤੀ", te: "మీ AI వ్యవసాయం" },
  "Decision Partner": { hi: "निर्णय भागीदार", mr: "निर्णय सहकारी", pa: "ਫੈਸਲਾ ਸਾਂਝੀਦਾਰ", te: "నిర్ణయ భాగస్వామి" },
  "Make smarter, sustainable farming decisions every day. Prevent crop loss, reduce costs, and grow your business — all in your language.": {
    hi: "हर दिन अधिक स्मार्ट, टिकाऊ खेती के निर्णय लें। फसल के नुकसान को रोकें, लागत कम करें, और अपना व्यवसाय बढ़ाएं - सब कुछ आपकी अपनी भाषा में।",
    mr: "दररोज अधिक स्मार्ट, शाश्वत शेती निर्णय घ्या. पिकांचे नुकसान टाळा, खर्च कमी करा आणि आपला व्यवसाय वाढवा - सर्व काही आपल्या भाषेत.",
    pa: "ਹਰ ਰੋਜ਼ ਸਮਾਰਟ, ਸਥਿਰ ਖੇਤੀ ਫੈਸਲੇ ਲਓ। ਫਸਲਾਂ ਦੇ ਨੁਕਸਾਨ ਨੂੰ ਰੋਕੋ, ਖਰਚੇ ਘਟਾਓ, ਅਤੇ ਆਪਣਾ ਕਾਰੋਬਾਰ ਵਧਾਓ - ਸਭ ਕੁਝ ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ।",
    te: "ప్రతిరోజూ తెలివిగా, స్థిరమైన వ్యవసాయ నిర్ణయాలు తీసుకోండి. పంట నష్టాన్ని నివారించండి, ఖర్చులను తగ్గించుకోండి మరియు మీ వ్యాపారాన్ని వృద్ధి చేసుకోండి — అన్నీ మీ భాషలోనే."
  },
  "Sustainability Built-In": { hi: "अंतर्निहित स्थिरता", mr: "शाश्वतता समाविष्ट", pa: "ਸਥਿਰਤਾ ਅੰਦਰੂਨੀ", te: "స్థిరత్వం అంతర్निर्मितं", gu: "બિલ્ટ-ઇન સસ્ટેનેબિલિટી", ta: "உள்ளமைக்கப்பட்ட நிலைத்தன்மை", kn: "ಅಂತರ್ನಿರ್ಮಿತ ಸುಸ್ಥಿರತೆ", bn: "অন্তর্নির্মित স্থાયित्व", ml: "സുസ്ഥിരത അന്തർനിർമ്മിതം" },
  "Farm Smarter,": { hi: "समझदारी से खेती करें,", mr: "हुशारीने शेती करा,", pa: "ਸਮਝਦਾਰੀ ਨਾਲ ਖੇਤੀ ਕਰੋ,", te: "తెలివిగా సాగు చేయండి,", gu: "વધુ સ્માર્ટ ખેતી કરો,", ta: "புத்திசாலித்தனமாக விவசாயം செய்யுங்கள்,", kn: "ಚುರುಕಾಗಿ ಕೃಷಿ ಮಾಡಿ,", bn: "स्मार्ट চাষ করুন,", ml: "മികച്ച രീതിയിൽ കൃഷി ചെയ്യുക," },
  "Save More": { hi: "अधिक बचाएं", mr: "अधिक वाचवा", pa: "ਹੋਰ ਬਚਾਓ", te: "మరింత ఆदा చేయండి", gu: "વધારે બચાવો", ta: "அதிகம் சேமிக்கவும்", kn: "ಹೆಚ್ಚು ಉಳಿಸಿ", bn: "আরও ਸਾশ্রય করুন", ml: "കൂടുതൽ ലാഭിക്കുക" },
  "Try Sustainable Advice": { hi: "टिकाऊ सलाह आज़माएं", mr: "शाश्वत सल्ला करून पहा", pa: "ਟਿਕਾਊ ਸਲਾਹ ਅਜ਼ਮਾਓ", te: "స్థिरమైన సలహాను ప్రయత్నించండి" },
  "Empowering farmers with AI-powered sustainable decision intelligence": { hi: "एआई-संचालित टिकाऊ निर्णय बुद्धिमत्ता के साथ किसानों को सशक्त बनाना", mr: "AI-आधारित शाश्वत निर्णय क्षमतेद्वारे शेतकऱ्यांना सक्षम करणे", pa: "AI-ਸੰਚਾਲਿਤ ਸਥਿਰ ਫੈਸਲੇ ਬੁੱਧੀ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਸ਼ਕਤੀਕਰਨ", te: "AI-ఆధారిత స్థిరమైన నిర్ణయ మేధస్సుతో రైతులను శక్తివంతం చేయడం" },
  "Farming Decision Copilot": { hi: "खेती निर्णय सहायक", mr: "शेती निर्णय सहकारी", pa: "ਖੇਤੀ ਫੈਸਲੇ ਸਹਾਇਕ", te: "వ్యవసాయ నిర్ణయ కోపైలట్" },
  "AI-powered sustainable farming advice": { hi: "एआई-संचालित टिकाऊ खेती सलाह", mr: "AI-आधारित शाश्वत शेती सल्ला" },
  "Voice Mode": { hi: "वॉयस मोड", mr: "आवाज मोड", pa: "ਵੌਇਸ ਮੋਡ", te: "వాయిస్ మోడ్", gu: "વોઇસ મોડ", ta: "குரல் முறை", kn: "ಧ್ವನಿ ಮೋಡ್", bn: "ভয়েস মোড", ml: "വോയ്‌സ് മോഡ്" },
  "How can I help today?": { hi: "आज मैं आपकी कैसे मदद कर सकता हूँ?", mr: "आज मी तुम्हाला कशी मदत करू शकतो?", pa: "ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?", te: "ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?" },
  "Describe your farming situation or upload an image for analysis.": { hi: "अपनी खेती की स्थिति का वर्णन करें या विश्लेषण के लिए एक छवि अपलोड करें।", mr: "आपल्या शेती परिस्थितीचे वर्णन करा किंवा विश्लेषणासाठी फोटो अपलोड करा." },
  "Crop health issue": {
    hi: "फसल स्वास्थ्य समस्या", mr: "पीक आरोग्य समस्या", pa: "ਫਸਲ ਸਿਹਤ ਮੁੱਦੇ", te: "పంట ఆరోగ్య సమస్యలు"
  },
  "Solar pump advice": {
    hi: "सौर पंप सलाह", mr: "सौर पंप सल्ला", pa: "ਸੋਲਰ ਪੰਪ ਸਲਾਹ", te: "సౌర పంప్ సలహా"
  },
  "Reduce chemicals": {
    hi: "रसायन कम करें", mr: "रसायने कमी करा", pa: "ਰਸਾਇਣ ਘਟਾਓ", te: "రసాయనాలను తగ్గించండి"
  },
  "Analyzing your situation...": { hi: "आपकी स्थिति का विश्लेषण कर रहा हूँ...", mr: "तुमच्या परिस्थितीचे विश्लेषण करत आहे...", pa: "ਤੁਹਾਡੀ ਸਥਿਤੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹਾਂ...", te: "మీ పరిస్థితిని విశ్లేషిస్తోంది..." },
  "Supports Hindi, Marathi, Punjabi, Telugu and more languages": { hi: "हिंदी, मराठी, पंजाबी, तेलुगु और अधिक भाषाओं का समर्थन करता है", mr: "हिंदी, मराठी, पंजाबी, तेलगू आणि अधिक भाषांना समर्थन देते" },
  "Soil Health Management": {
    hi: "मृदा स्वास्थ्य प्रबंधन", mr: "मृदा आरोग्य व्यवस्थापन"
  },

  "Chemical Reduction": {
    hi: "रसायन में कमी", mr: "रसायन कपात"
  },
  "Solar & Renewable Energy": {
    hi: "सौर और नवीकरणीय ऊर्जा", mr: "सौर आणि नवीकरणीय ऊर्जा"
  },
  "Smart Machinery": {
    hi: "स्मार्ट मशीनरी", mr: "स्मार्ट यंत्रसामग्री"
  },
  "Moderate": { hi: "मध्यम", mr: "मध्यम", pa: "ਮੱਧਮ", te: "మితమైన", gu: "મધ્યમ", ta: "மிதமான", kn: "ಮಧ್ಯಮ", bn: "মাঝারি", ml: "മിതമായ" },
  "High": { hi: "उच्च", mr: "जास्त", pa: "ਉੱਚ", te: "ఎక్కువ", gu: "ઉચ્ચ", ta: "அதிகம்", kn: "ಹೆಚ್ಚು", bn: "ਉੱਚ", ml: "ഉയർന്ന" },
  "Critical": { hi: "गंभीर", mr: "गंभीर", pa: "ਨਾਜ਼ੁਕ", te: "క్లిష్టమైన", gu: "ગંભીર", ta: "மிகவும் முக்கியமானது", kn: "ನಿರ್ಣಾಯಕ", bn: "গুরুতর", ml: "ഗുരുതരം" },
  "Medium": { hi: "औसत", mr: "औसत", pa: "ਔਸਤ", te: "మధ్యస్థ", gu: "માધ્યમ", ta: "நடுத்தர", kn: "ಮಧ್ಯಮ", bn: "মাঝারি", ml: "സൂക്ഷ്മതയുള്ള" },
  "Soil Health": { hi: "मिट्टी का स्वास्थ्य", mr: "मातीचे आरोग्य", pa: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ", te: "నేల ఆరోగ్యం", gu: "જમીનનું આરોગ્ય", ta: "மண் ஆரோக்கியம்", kn: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ", bn: "মাটির স্বাস্থ্য", ml: "മണ്ണിന്റെ ആരോഗ്യം" },
  "Water Usage": { hi: "पानी का उपयोग", mr: "पाण्याचा वापर", pa: "ਪਾਣੀ ਦੀ ਵਰਤੋਂ", te: "నీటి వినియోగం", gu: "પાણીનો વપરાશ", ta: "நீர் பயன்பாடு", kn: "ನೀರಿನ ಬಳಕೆ", bn: "জলের ব্যবহার", ml: "ജല ഉപയോഗം" },
  "Chemical Input": { hi: "रासायनिक खाद", mr: "रासायनिक खतांचा वापर", pa: "ਰਸਾਇਣਕ ਨਿਵੇਸ਼", te: "రసాయన వినియోగం", gu: "રાસાયણિક ઇનપુટ", ta: "இரசாயன உள்ளீடு", kn: "ರಾಸಾಯನಿಕ ಪ್ರವೇಶ", bn: "রাসায়নিক ইনપુટ", ml: "രാസവസ്തുക്കളുടെ ഉപയോഗം" },
  "Climate Risk": { hi: "जलवायु जोखिम", mr: "हवामान जोखीम", pa: "ਜਲਵਾਯੂ ਜੋਖਮ", te: "వాతావరణ ప్రమాదం", gu: "હવામાન જોખમ", ta: "காலநிலை ஆபத்து", kn: "ಹವಾಮಾನ ಅಪಾಯ", bn: "জলবায়ু ঝুঁকি", ml: "കാലാവസ്ഥാ അപകടസാധ്യത" },
  "Climate Intelligence": { hi: "जलवायु बुद्धिमत्ता", mr: "हवामान बुद्धिमत्ता", pa: "ਜਲਵਾਯੂ ਬੁੱਧੀ", te: "వాతావరణ మేధస్సు", gu: "હવામાન બુદ્ધિ", ta: "காலநிலை நுண்ணறிவு", kn: "ಹವಾಮಾನ ಬುದ್ಧಿವಂತಿಕೆ", bn: "জলবায়ু বুদ্ধিমত্তা", ml: "കാലാവസ്ഥാ വിശകലനം" },
  "Environmental Impact Overview": { hi: "पर्यावरण प्रभाव अवलोकन", mr: "पर्यावरण प्रभाव आढावा" },
  "Organic Transition": { hi: "जैविक संक्रमण", mr: "सेंद्रिय शेतीकडे वाटचाल", pa: "ਜੈਵਿਕ ਤਬਦੀਲੀ", te: "సేంద్రియ మార్పు", gu: "સેન્દ્રીય સંક્રમણ", ta: "ஆர்கானிக் மாற்றம்", kn: "ಸಾವಯವ ಪರಿವರ್ತನೆ", bn: "জৈব রূপান্তর", ml: "ജൈവ കൃഷി രീതിയിലേക്കുള്ള മാറ്റം" },
  "Solar Irrigation": { hi: "सौर सिंचाई", mr: "सौर कृषी पंप", pa: "ਸੋਲਰ ਸਿੰਚਾਈ", te: "సౌర సాగు", gu: "સોલર સિંચાઈ", ta: "சூரிய பாசனம்", kn: "ಸೌರ ನೀರಾವರಿ", bn: "সৌর সেচ", ml: "സൗരോർജ്ജ ജലസേചനം" },
  "Rainwater Harvesting": { hi: "वर्षा जल संचयन", mr: "पावसाचे पाणी साठवण", pa: "ਵਰਖਾ ਜਲ ਸੰਭਾਲ", te: "వర్షపు ನೀటి సంరક્ષಣ", gu: "વરસાદી પાણીનો સંગ્રહ", ta: "மழைநீர் சேகரிப்பு", kn: "ಮಳೆನೀರು ಕೊಯ್ಲು", bn: "বৃষ্টির জল সংগ্রহ", ml: "മഴവെള്ള സംഭരണം" },
  "Crop Rotation": { hi: "फसल चक्र", mr: "पीक फेरपालट", pa: "ਫਸਲ ਚੱਕਰ", te: "పంట మార్పిడి", gu: "પાક ફેરબદલી", ta: "பயிர் சுழற்சி", kn: "ಬೆಳೆ ಸರದಿ", bn: "শস্য ಆবর্তন", ml: "വിള പരിക്രമണം" },
  "Annual Savings:": { hi: "वार्षिक बचत:", mr: "वार्षिक बचत:", pa: "ਸਾਲਾਨਾ ਬਚਤ:", te: "వార్షిక పొదుపు:", gu: "વાર્ષિક બચત:", ta: "ஆண்டு சேமிப்பு:", kn: "ವಾರ್ಷಿಕ ಉಳಿತಾಯ:", bn: "বার্ষিক ਸਾশ্রય:", ml: "വാർഷിക സമ്പാദ്യം:" },
  "Impact:": { hi: "प्रभाव:", mr: "परिणाम:", pa: "ਪ੍ਰਭਾਵ:", te: "ప్రభావం:", gu: "અસર:", ta: "தாக்கம்:", kn: "ಪ್ರಭಾವ:", bn: "প্রভাব:", ml: "സ്വാധീനം:" },
  "Get Detailed Plan": { hi: "विस्तृत योजना प्राप्त करें", mr: "सविस्तर योजना मिळवा" },
  "Get Detailed Sustainability Plan": { hi: "विस्तृत स्थिरता योजना प्राप्त करें", mr: "सविस्तर शाश्वतता योजना मिळवा" },
  "Sustainable Farming Recommendations": { hi: "टिकाऊ खेती की सिफारिशें", mr: "शाश्वत शेती शिफारसी" },
  "Click on any metric for details": { hi: "विवरण के लिए किसी भी मीट्रिक पर क्लिक करें", mr: "तपशीलासाठी कोणत्याही मापकवर क्लिक करा" },
  "Reduced chemical inputs by 50% in first year": { hi: "पहले वर्ष में रासायनिक आदानों में 50% की कमी करें", mr: "पहिल्या वर्षात रासायनिक वापर 50% कमी करा" },
  "Zero fuel costs with solar pumps": { hi: "सौर पंपों के साथ शून्य ईंधन लागत", mr: "सौर पंपांमुळे इंधनाचा खर्च शून्य" },
  "Store monsoon water for dry season": { hi: "शुष्क मौसम के लिए मानसून का पानी संग्रहित करें", mr: "कोरड्या हंगामासाठी पावसाचे पाणी साठवा" },
  "Natural soil fertility restoration": { hi: "प्राकृतिक मिट्टी की उर्वरता बहाली", mr: "नैसर्गिक माती सुपीकता पुनर्संचय" },
  "Start Talking to AI": { hi: "एआई से बात करना शुरू करें", mr: "AI सोबत बोलणे सुरू करा", pa: "AI ਨਾਲ ਗੱਲ ਕਰਨੀ ਸ਼ੁਰੂ ਕਰੋ", te: "AIతో మాట్లాడటం ప్రారంభించండి", gu: "AI સાથે વાત કરવાનું શરૂ કરો", ta: "AI உடன் பேசத் தொடங்குங்கள்", kn: "AI ಜೊತೆ ಮಾತನಾಡಲು ಪ್ರಾರಂಭಿಸಿ", bn: "AI-এর সাথে কথা বলা শুরু করুন", ml: "AI-യുമായി സംസാരിക്കാൻ തുടങ്ങുക" },
  "Watch Demo": { hi: "डेमो देखें", mr: "डेमो पहा", pa: "ਡੈਮੋ ਦੇਖੋ", te: "డెमो చూడండి", gu: "ડેમો જુઓ", ta: "டெமோ பார்க்கவும்", kn: "ಡೆಮೊ ವೀಕ್ಷಿಸಿ", bn: "ডেমো দেখুন", ml: "ഡെമോ കാണുക" },
  "10+ Languages": { hi: "10+ भाषाएं", mr: "10+ भाषा", pa: "10+ ਭਾਸ਼ਾਵਾਂ", te: "10+ భాషలు", gu: "10+ ભાષાઓ", ta: "10+ மொழிகள்", kn: "10+ ಭಾಷೆಗಳು", bn: "10+ ভাষা", ml: "10+ ഭാഷകൾ" },
  "1M+ Farmers": { hi: "1M+ किसान", mr: "10 लाख+ शेतकरी", pa: "10 ਲੱਖ+ ਕਿਸਾਨ", te: "10 లక్షల+ రైతులు", gu: "10 લાખ+ ખેડૂતો", ta: "10 லட்சம்+ விவசாயிகள்", kn: "10 ಲಕ್ಷ+ ರೈತರು", bn: "10 লক্ষ+ কৃষক", ml: "10 ലക്ഷത്തിലധികം കർഷകർ" },
  "100+ Crops": { hi: "100+ फसलें", mr: "100+ पिके", pa: "100+ ਫਸਲਾਂ", te: "100+ పంటలు", gu: "100+ પાકો", ta: "100+ பயிர்கள்", kn: "100+ ಬೆಳೆಗಳು", bn: "100+ ফসল", ml: "100+ വിളകൾ" },
  "Climate & Sustainability Dashboard": { hi: "जलवायु और स्थिरता डैशबोर्ड", mr: "हवामान आणि शाश्वतता डॅशबोर्ड" },
  "Monitor environmental impact and get AI-powered suggestions for sustainable farming": { hi: "पर्यावरणीय प्रभाव की निगरानी करें और टिकाऊ खेती के लिए एआई-संचालित सुझाव प्राप्त करें", mr: "पर्यावरणीय प्रभावाचे निरीक्षण करा आणि शाश्वत शेतीसाठी AI-आधारित सूचना मिळवा" },
  "Smart Advisory": { hi: "स्मार्ट सलाह", mr: "स्मार्ट सल्ला", pa: "ਸਮਾਰਟ ਸਲਾਹ", te: "స్మార్ట్ సలహా" },
  "Precision Smart Advisory": { hi: "सटीक स्मार्ट सलाह", mr: "अचूक स्मार्ट सल्ला", pa: "ਸਟੀਕ ਸਮਾਰਟ ਸਲਾਹ", te: "ఖచ్చితమైన స్మార్ట్ సలహా" },
  "Farm Specs": { hi: "खेत का विवरण", mr: "शेतीचा तपशील", pa: "ਖੇਤ ਦੇ ਵੇਰਵੇ", te: "ఫామ్ స్పెసిఫికేషన్లు" },
  "Land Character": { hi: "जमीन की प्रकृति", mr: "जमिनीचा प्रकार", pa: "ਜ਼ਮੀਨ ਦੀ ਪ੍ਰਕਿਰਤੀ", te: "భూమి స్వభావం" },
  "Run AI Analysis": { hi: "एआई विश्लेषण चलाएं", mr: "AI विश्लेषण करा", pa: "AI ਵਿਸ਼ਲੇਸ਼ਣ ਚਲਾਓ", te: "AI విశ్లేషణను రన్ చేయండి" },
  "Top Recommendations": { hi: "प्रमुख सिफारिशें", mr: "प्रमुख शिफारसी", pa: "ਪ੍ਰਮੁੱਖ ਸਿਫਾਰਸ਼ਾਂ", te: "ముఖ్యమైన సిఫార్సులు" },
  "Optimized for current season": { hi: "वर्तमान सीजन के लिए अनुकूलित", mr: "सध्याच्या हंगामासाठी अनुकूल", pa: "ਮੌਜੂਦਾ ਸੀਜ਼ਨ ਲਈ ਅਨੁਕੂਲਿਤ", te: "ప్రస్తుత సీజన్ కోసం ఆప్టిమైజ్ చేయబడింది" },
  "Expert Farmer Tip": { hi: "विशेषज्ञ किसान टिप", mr: "तज्ज्ञ शेतकरी टीप", pa: "ਮਾਹਰ ਕਿਸਾਨ ਨੁਸਖਾ", te: "నిపుణుల రైతు చిట్కా" },
  "AI Voice Advisor": { hi: "एआई वॉयस सलाहकार", mr: "AI व्हॉइस मार्गदर्शक", pa: "AI ਵੌਇਸ ਸਲਾਹਕਾਰ", te: "AI వాయిస్ సలహాదారు" },
  "Ready to help": { hi: "मदद के लिए तैयार", mr: "मदतीसाठी तयार", pa: "ਮਦਦ ਲਈ ਤਿਆਰ", te: "సహాయం చేయడానికి సిద్ధంగా ఉంది" },
  "Speak naturally in your language. I'm listening.": { hi: "अपनी भाषा में स्वाभाविक रूप से बोलें। मैं सुन रहा हूँ।", mr: "तुमच्या भाषेत नैसर्गिकरित्या बोला. मी ऐकत आहे.", pa: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਕੁਦਰਤੀ ਤੌਰ 'ਤੇ ਬੋਲੋ। ਮੈਂ ਸੁਣ ਰਿਹਾ ਹਾਂ।", te: "మీ భాషలో సహజంగా మాట్లాడండి. నేను వింటున్నాను." },
  "TAP MICROPHONE": { hi: "माइक दबाएं", mr: "माईक दाबा", pa: "ਮਾਈਕ ਦਬਾਓ", te: "మైక్రోఫోన్ నొక్కండి" },
  "TAP TO STOP": { hi: "रुकने के लिए दबाएं", mr: "थांबण्यासाठी दाबा", pa: "ਰੋਕਣ ਲਈ ਦਬਾਓ", te: "నిలిపివేయడానికి నొక్కండి" },
  "Thinking": { hi: "सोच रहा हूँ", mr: "विचार करत आहे", pa: "ਸੋਚ ਰਿਹਾ ਹਾਂ", te: "ఆలోచిస్తున్నాను" }
};

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string) => Promise<string>;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

// Simple translation cache to avoid repeated API calls
const translationCache = new Map<string, string>();

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = useCallback(async (text: string): Promise<string> => {
    // If English, return original text
    if (currentLanguage.code === "en") {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${currentLanguage.code}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    // Check fallback dictionary next (instant result)
    if (fallbackDictionary[text] && fallbackDictionary[text][currentLanguage.code]) {
      const translated = fallbackDictionary[text][currentLanguage.code];
      translationCache.set(cacheKey, translated);
      return translated;
    }

    // If not in dictionary, try API
    setIsTranslating(true);

    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { text, targetLang: currentLanguage.code }
      });

      if (error) {
        console.warn("Translation API error, using fallback/original:", error.message);
        // On error, return text but don't cache it as 'translated'
        return text;
      }

      const translatedText = data?.translatedText || text;

      // Cache the result
      translationCache.set(cacheKey, translatedText);

      return translatedText;
    } catch (error) {
      console.error("Translation exception:", error);
      return text; // Fallback to original text
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  const setLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
  }, []);

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, translate, isTranslating }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
