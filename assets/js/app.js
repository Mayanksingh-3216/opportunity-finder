/* Extracted from the original Opportunity Finder demo: main app behavior.
   Application logic and data are kept in the same order as the original page. */

(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const DATA = window.OPPORTUNITY_DATA || {};
  const records = Array.isArray(DATA.records) ? DATA.records : [];
  const INSTITUTION_DATA = window.OPPORTUNITY_INSTITUTION_DATA || {};
  const institutionRecords = Array.isArray(INSTITUTION_DATA.institution_records) ? INSTITUTION_DATA.institution_records : [];
  const institutionSourceDirectory = INSTITUTION_DATA.source_directory || {};
  const STORAGE_KEY = 'opportunity-finder-profile-v2';
  let uiLanguage = 'en';
  const originalTextNodes = new WeakMap();
  const UI_TRANSLATIONS = {
    hi: {
      'Tell me what I can do next.':'बताइए, अगला कदम क्या हो सकता है।','Interactive prototype':'इंटरएक्टिव प्रोटोटाइप','Clear saved profile':'सेव की गई प्रोफ़ाइल हटाएँ','PERSONALIZED OPPORTUNITY DISCOVERY':'आपके लिए अवसर खोजें','Find the next step':'अपने लिए अगला कदम खोजें','that fits you.':'जो आपके लिए सही हो।',
      'Enter your details once. We’ll use your profile to help you explore relevant education opportunities. Jobs and government services are visible as planned sections but are not active yet.':'अपनी जानकारी एक बार भरें। आपकी प्रोफ़ाइल के आधार पर शिक्षा से जुड़े अवसर दिखाए जाएँगे। जॉब और सरकारी सेवाएँ अभी सक्रिय नहीं हैं।','✓ Adaptive form':'✓ जानकारी के अनुसार फ़ॉर्म','✓ Education-specific discovery':'✓ शिक्षा से जुड़े अवसर','✓ Official links shown':'✓ आधिकारिक लिंक',
      'Your details':'आपकी जानकारी','Choose section':'सेक्शन चुनें','Education':'शिक्षा','STEP 1 OF 4':'चरण 1 / 4','First, tell us about yourself':'पहले अपने बारे में बताएँ','Name is required. Other details are optional; more information can improve relevance.':'नाम ज़रूरी है। बाकी जानकारी वैकल्पिक है; इससे अवसर अधिक प्रासंगिक हो सकते हैं।','Personal profile':'व्यक्तिगत प्रोफ़ाइल','Basic details':'बुनियादी जानकारी','We’ll use these details to personalize your experience.':'इन जानकारियों से आपका अनुभव व्यक्तिगत बनाया जाएगा।','Full name':'पूरा नाम','Your name is the only mandatory field.':'केवल नाम भरना अनिवार्य है।','Date of birth':'जन्म तिथि','Optional; age cut-off rules differ by opportunity.':'वैकल्पिक; हर अवसर की आयु-सीमा अलग हो सकती है।','What best describes you right now?':'अभी आप किस स्थिति में हैं?','Choose an option (optional)':'विकल्प चुनें (वैकल्पिक)','School student':'स्कूल के विद्यार्थी','Diploma / ITI student':'डिप्लोमा / ITI विद्यार्थी','College / university student':'कॉलेज / विश्वविद्यालय के विद्यार्थी','Research scholar / PhD student':'रिसर्च स्कॉलर / PhD विद्यार्थी','Completed my studies':'पढ़ाई पूरी कर ली है','Looking for a job':'नौकरी ढूँढ रहा/रही हूँ','Looking to learn a new skill':'नई स्किल सीखना चाहता/चाहती हूँ','Other / prefer not to say':'अन्य / बताना नहीं चाहते','Country':'देश','State / Union Territory':'राज्य / केंद्र शासित प्रदेश','Select state / UT':'राज्य / केंद्र शासित प्रदेश चुनें','District':'ज़िला','Select state to see districts':'ज़िले देखने के लिए पहले राज्य चुनें','Select state first':'पहले राज्य चुनें','Select state / UT':'राज्य / केंद्र शासित प्रदेश चुनें','Other country':'अन्य देश','Select district (optional)':'ज़िला चुनें (वैकल्पिक)','Other / enter manually':'अन्य / खुद भरें','Enter district':'ज़िले का नाम भरें','Enter your district':'अपना ज़िला भरें','City / town':'शहर / कस्बा','Type your city or town':'शहर या कस्बे का नाम लिखें','Choose a state to see its district options.':'राज्य चुनने पर उसके ज़िले दिखाई देंगे।','Suggestions may be available after selecting a district; you can type a place manually.':'ज़िला चुनने पर सुझाव मिल सकते हैं; आप शहर का नाम खुद भी लिख सकते हैं।','Your education profile':'आपकी शिक्षा की जानकारी','Education profile details':'शिक्षा प्रोफ़ाइल की जानकारी','Your selected education level controls which questions appear below. You can leave optional questions blank.':'आपके चुने हुए शिक्षा स्तर के अनुसार नीचे प्रश्न दिखेंगे। वैकल्पिक प्रश्न खाली छोड़ सकते हैं।','Details for your education level':'आपके शिक्षा स्तर की जानकारी','Only relevant fields will be shown.':'केवल संबंधित फ़ील्ड दिखेंगे।','Choose an education level or browse all':'शिक्षा स्तर चुनें या सभी देखें','You can go back to select a level, or continue without it to browse all records.':'आप वापस जाकर शिक्षा स्तर चुन सकते हैं या सभी रिकॉर्ड देखने के लिए आगे बढ़ सकते हैं।','Only matching follow-up questions are shown. All details are optional.':'केवल संबंधित अनुवर्ती प्रश्न दिखेंगे। सभी विवरण वैकल्पिक हैं।','Next: view education opportunities':'आगे: शिक्षा के अवसर देखें','Back to sections':'सेक्शन पर वापस जाएँ','Choose your current or most recent level. Relevant fields will appear automatically.':'अपनी वर्तमान या सबसे हाल की शिक्षा चुनें। उसी के अनुसार संबंधित प्रश्न दिखेंगे।','Current / highest education level':'वर्तमान / उच्चतम शिक्षा स्तर','Not sure yet — let me browse all education opportunities':'अभी तय नहीं — सभी शिक्षा अवसर देखें','Optional. Choose the level that best represents you now; you can update it later.':'वैकल्पिक। अभी अपनी स्थिति से मेल खाता स्तर चुनें; बाद में बदल सकते हैं।','Your form adapts to you':'आपके अनुसार फ़ॉर्म बदलेगा','Select an education level above to see only the relevant follow-up questions. You can skip optional details.':'ऊपर शिक्षा स्तर चुनें, ताकि संबंधित प्रश्न ही दिखें। वैकल्पिक जानकारी छोड़ सकते हैं।','🔒 Demo only: this profile stays in this browser; it is not sent to a server.':'🔒 डेमो: आपकी प्रोफ़ाइल इसी ब्राउज़र में रहती है; सर्वर पर नहीं भेजी जाती।','Next: choose a section':'आगे: सेक्शन चुनें','STEP 2 OF 4':'चरण 2 / 4','Choose what you want to explore':'बताएँ, आप क्या देखना चाहते हैं','These are the three main areas of Opportunity Finder. Only Education & Learning is active in this prototype.':'Opportunity Finder के तीन मुख्य सेक्शन हैं। इस प्रोटोटाइप में केवल शिक्षा और सीखना सक्रिय है।','← Edit details':'← जानकारी बदलें','ACTIVE NOW':'अभी सक्रिय','Education & Learning':'शिक्षा और सीखना','Scholarships, school & college options, admissions, research and skills.':'स्कॉलरशिप, स्कूल/कॉलेज, प्रवेश, रिसर्च और स्किल के अवसर।','Explore education':'शिक्षा के अवसर देखें','COMING SOON':'जल्द उपलब्ध','Jobs, Careers & Startups':'नौकरी, करियर और स्टार्टअप','Government and private jobs, internships, apprenticeships and startup support.':'सरकारी/निजी नौकरी, इंटर्नशिप, अप्रेंटिसशिप और स्टार्टअप सहायता।','Not active yet':'अभी सक्रिय नहीं','Government Schemes & Services':'सरकारी योजनाएँ और सेवाएँ','Citizen services, welfare programmes, financial support and public schemes.':'नागरिक सेवाएँ, कल्याण कार्यक्रम, वित्तीय सहायता और सरकारी योजनाएँ।','Your profile is saved locally in this browser. Education recommendations are based on education-level overlap in a research catalogue—not an official eligibility decision.':'आपकी प्रोफ़ाइल इसी ब्राउज़र में सेव है। सुझाव रिसर्च कैटलॉग में शिक्षा स्तर के मेल पर आधारित हैं, सरकारी पात्रता का निर्णय नहीं हैं।','STEP 3 OF 4':'चरण 3 / 4','STEP 4 OF 4 · ACTIVE SECTION':'चरण 4 / 4 · सक्रिय सेक्शन','Choose a subsection to explore opportunities relevant to your profile.':'अपनी प्रोफ़ाइल से जुड़े अवसर देखने के लिए सब-सेक्शन चुनें।','← All sections':'← सभी सेक्शन','Edit profile':'प्रोफ़ाइल बदलें','Explore subsections':'सब-सेक्शन देखें','Only subsections suitable for your current education level are shown. The next-step routes are suggestions; admission eligibility must be confirmed from the official portal.':'कोई विषय चुनें। संख्या आपके शिक्षा स्तर से टैग किए रिकॉर्ड और कुल रिकॉर्ड दिखाती है।','9 subsections':'9 सब-सेक्शन','YOUR DISCOVERY LIST':'आपके लिए अवसर','Opportunities for your profile':'आपकी प्रोफ़ाइल के लिए अवसर','Start with relevant records, or browse the full research inventory.':'पहले प्रासंगिक रिकॉर्ड देखें या पूरी रिसर्च सूची ब्राउज़ करें।','0 results':'0 परिणाम','Type':'प्रकार','Application status':'आवेदन स्थिति','Sort by':'क्रमबद्ध करें','Most relevant':'सबसे प्रासंगिक','Name A–Z':'नाम A–Z','Status':'स्थिति','Browse all education levels':'सभी शिक्षा स्तर ब्राउज़ करें','Include records not tagged to my selected level; this is for browsing, not eligibility.':'चुने हुए स्तर से टैग न हुए रिकॉर्ड भी दिखाएँ; यह ब्राउज़िंग के लिए है, पात्रता नहीं।','No records found for this selection':'इस चयन के लिए रिकॉर्ड नहीं मिले','Try another subsection, clear a filter or browse all education levels. Some research areas do not yet have tagged records.':'दूसरा सब-सेक्शन चुनें, फ़िल्टर हटाएँ या सभी शिक्षा स्तर ब्राउज़ करें। कुछ क्षेत्रों के रिकॉर्ड अभी टैग नहीं हुए हैं।','Browse all records in this subsection':'इस सब-सेक्शन के सभी रिकॉर्ड देखें','↑ Back to subsections':'↑ सब-सेक्शन पर जाएँ','Reset search and filters':'खोज और फ़िल्टर रीसेट करें','Research snapshot: 24 Oct 2026 · Level-filtered · Institution and state portal data are partial research examples; verify current official notices':'रिसर्च सूची: 13 Oct 2026 · पूरी या प्रोडक्शन-वेरिफाइड नहीं','OPPORTUNITY DETAILS':'अवसर की जानकारी','Opportunity title':'अवसर का नाम','Always confirm current eligibility, dates and instructions on the official source.':'पात्रता, तारीखें और निर्देश आधिकारिक स्रोत पर ज़रूर जाँचें।','Close details':'जानकारी बंद करें','Close':'बंद करें','Scholarship':'स्कॉलरशिप','Education assistance':'शिक्षा सहायता','Fellowship':'फेलोशिप','Academic stipend':'अकादमिक स्टाइपेंड','Entrance exam':'प्रवेश परीक्षा','Course / training':'कोर्स / प्रशिक्षण','Skill programme':'स्किल कार्यक्रम','Free coaching':'मुफ़्त कोचिंग','School Education':'स्कूल शिक्षा','Diploma & Polytechnic':'डिप्लोमा और पॉलिटेक्निक','Undergraduate (UG)':'स्नातक (UG)','Postgraduate (PG)':'स्नातकोत्तर (PG)','PhD & Research':'PhD और रिसर्च','Entrance Exams & Admissions':'प्रवेश परीक्षाएँ और एडमिशन','Scholarships & Financial Aid':'स्कॉलरशिप और वित्तीय सहायता','Fellowships & Academic Stipends':'फेलोशिप और अकादमिक स्टाइपेंड','Skill & Vocational Learning':'स्किल और व्यावसायिक शिक्षा','Select if applicable':'लागू हो तो चुनें','Optional':'वैकल्पिक','Optional profile detail. Scheme-specific cut-offs are not evaluated yet.':'वैकल्पिक जानकारी। योजना की विशिष्ट कट-ऑफ अभी जाँची नहीं जाती।','Currently studying':'अभी पढ़ाई कर रहे हैं','Completed this level':'यह स्तर पूरा कर लिया','Planning to enrol / continue':'प्रवेश / पढ़ाई जारी रखने की योजना','Not currently studying':'अभी पढ़ाई नहीं कर रहे','Open':'खुला','Upcoming':'जल्द शुरू','Closed':'बंद','Deadline Unknown':'अंतिम तिथि अज्ञात','Not specified':'नहीं बताया गया','Location not provided':'स्थान नहीं दिया गया','Profile:':'प्रोफ़ाइल:','Activity:':'वर्तमान स्थिति:','Choose state first':'पहले राज्य चुनें','District list unavailable — enter manually':'ज़िले की सूची उपलब्ध नहीं — खुद भरें','Select district':'ज़िला चुनें','Learning interests':'सीखने की रुचि','What would you like to learn?':'आप क्या सीखना चाहते हैं?','Preferred learning mode':'पसंदीदा सीखने का तरीका','Preferred language for learning':'सीखने की पसंदीदा भाषा','Your goal':'आपका लक्ष्य','Primary school details':'प्राथमिक स्कूल की जानकारी','Middle school details':'मिडिल स्कूल की जानकारी','Class 9–10 details':'कक्षा 9–10 की जानकारी','Class 11–12 details':'कक्षा 11–12 की जानकारी','Diploma / Polytechnic / ITI details':'डिप्लोमा / पॉलिटेक्निक / ITI की जानकारी','Bachelor’s / UG details':'बैचलर / UG की जानकारी','Master’s / PG details':'मास्टर / PG की जानकारी','PhD / Research details':'PhD / रिसर्च की जानकारी','Other qualification details':'अन्य योग्यता की जानकारी','Current class / last class completed':'वर्तमान कक्षा / आख़िरी पूरी कक्षा','Current class':'वर्तमान कक्षा','Current / last class':'वर्तमान / आख़िरी कक्षा','School board':'स्कूल बोर्ड','Expected / completed year':'संभावित / पूरा करने का वर्ष','Completed Class 10':'कक्षा 10 पूरी','Current year / semester':'वर्तमान वर्ष / सेमेस्टर','Branch / trade':'ब्रांच / ट्रेड','Degree / course':'डिग्री / कोर्स','Branch / major / specialization':'ब्रांच / मुख्य विषय / विशेषज्ञता','Master’s degree / course':'मास्टर डिग्री / कोर्स','Specialization / subject':'विशेषज्ञता / विषय','Research / doctoral stage':'रिसर्च / डॉक्टरेट की स्थिति','Research field / subject':'रिसर्च क्षेत्र / विषय','Previous qualification':'पिछली योग्यता','Previous degree':'पिछली डिग्री','School / college / institution':'स्कूल / कॉलेज / संस्थान','Board / university / awarding body':'बोर्ड / विश्वविद्यालय / प्रमाणपत्र देने वाली संस्था','Marks / percentage / GPA':'अंक / प्रतिशत / GPA','What would you like to explore?':'आप क्या देखना चाहते हैं?','Degree / course':'डिग्री / कोर्स','Select if applicable':'लागू हो तो चुनें','e.g. Aditi Sharma':'जैसे: अदिति शर्मा','e.g. 78% or CGPA 8.2':'जैसे: 78% या CGPA 8.2','Enter qualification':'योग्यता लिखें'
    },
    gu: {
      'Tell me what I can do next.':'હું આગળ શું કરી શકું તે જણાવો.','Interactive prototype':'ઇન્ટરેક્ટિવ પ્રોટોટાઇપ','Clear saved profile':'સાચવેલી પ્રોફાઇલ સાફ કરો','PERSONALIZED OPPORTUNITY DISCOVERY':'તમારા માટે તક શોધો','Find the next step':'તમારા માટે આગળનું પગલું શોધો','that fits you.':'જે તમને અનુકૂળ હોય.','Enter your details once. We’ll use your profile to help you explore relevant education opportunities. Jobs and government services are visible as planned sections but are not active yet.':'તમારી વિગતો એકવાર દાખલ કરો. તમારી પ્રોફાઇલ પ્રમાણે શિક્ષણની તકો બતાવીશું. નોકરી અને સરકારી સેવાઓના વિભાગો હજી સક્રિય નથી.','✓ Adaptive form':'✓ તમારી માહિતી પ્રમાણે ફોર્મ','✓ Education-specific discovery':'✓ શિક્ષણની તકો','✓ Official links shown':'✓ સત્તાવાર લિંક્સ','Your details':'તમારી વિગતો','Choose section':'વિભાગ પસંદ કરો','Education':'શિક્ષણ','STEP 1 OF 4':'પગલું 1 / 4','First, tell us about yourself':'પહેલા તમારા વિશે જણાવો','Name is required. Other details are optional; more information can improve relevance.':'નામ જરૂરી છે. બીજી વિગતો વૈકલ્પિક છે; વધુ માહિતીથી યોગ્ય તકો શોધવામાં મદદ મળે છે.','Personal profile':'વ્યક્તિગત પ્રોફાઇલ','Basic details':'મૂળભૂત વિગતો','We’ll use these details to personalize your experience.':'અનુભવને તમારી જરૂરિયાત પ્રમાણે બનાવવા આ વિગતો વાપરીશું.','Full name':'પૂરું નામ','Your name is the only mandatory field.':'ફક્ત નામ ફરજિયાત છે.','Date of birth':'જન્મ તારીખ','Optional; age cut-off rules differ by opportunity.':'વૈકલ્પિક; દરેક તકની વયમર્યાદા અલગ હોઈ શકે છે.','What best describes you right now?':'હાલમાં તમારી સ્થિતિ કઈ છે?','Choose an option (optional)':'વિકલ્પ પસંદ કરો (વૈકલ્પિક)','School student':'શાળાનો વિદ્યાર્થી','Diploma / ITI student':'ડિપ્લોમા / ITI વિદ્યાર્થી','College / university student':'કોલેજ / યુનિવર્સિટી વિદ્યાર્થી','Research scholar / PhD student':'રિસર્ચ સ્કોલર / PhD વિદ્યાર્થી','Completed my studies':'અભ્યાસ પૂર્ણ કર્યો છે','Looking for a job':'નોકરી શોધું છું','Looking to learn a new skill':'નવી કુશળતા શીખવા માંગું છું','Other / prefer not to say':'અન્ય / જણાવવું નથી','Country':'દેશ','State / Union Territory':'રાજ્ય / કેન્દ્રશાસિત પ્રદેશ','Select state / UT':'રાજ્ય / કેન્દ્રશાસિત પ્રદેશ પસંદ કરો','District':'જિલ્લો','Choose a state to see its district options.':'જિલ્લા જોવા માટે રાજ્ય પસંદ કરો.','Select state first':'પહેલા રાજ્ય પસંદ કરો','Select state / UT':'રાજ્ય / કેન્દ્રશાસિત પ્રદેશ પસંદ કરો','Other country':'બીજો દેશ','Select district (optional)':'જિલ્લો પસંદ કરો (વૈકલ્પિક)','Other / enter manually':'અન્ય / જાતે દાખલ કરો','Enter district':'જિલ્લો દાખલ કરો','Enter your district':'તમારો જિલ્લો દાખલ કરો','City / town':'શહેર / નગર','Type your city or town':'શહેર અથવા નગર લખો','Suggestions may be available after selecting a district; you can type a place manually.':'જિલ્લો પસંદ કર્યા પછી સૂચનો મળી શકે છે; તમે શહેર જાતે પણ લખી શકો છો.','Your education profile':'તમારી શિક્ષણ પ્રોફાઇલ','Education profile details':'શિક્ષણ પ્રોફાઇલની વિગતો','Your selected education level controls which questions appear below. You can leave optional questions blank.':'તમે પસંદ કરેલા શિક્ષણ સ્તર મુજબ નીચે પ્રશ્નો દેખાશે. વૈકલ્પિક પ્રશ્નો ખાલી રાખી શકો છો.','Details for your education level':'તમારા શિક્ષણ સ્તરની વિગતો','Only relevant fields will be shown.':'ફક્ત સંબંધિત ક્ષેત્રો દેખાશે.','Choose an education level or browse all':'શિક્ષણ સ્તર પસંદ કરો અથવા બધું જુઓ','You can go back to select a level, or continue without it to browse all records.':'તમે પાછા જઈને સ્તર પસંદ કરી શકો છો અથવા બધા રેકોર્ડ જોવા આગળ વધી શકો છો.','Only matching follow-up questions are shown. All details are optional.':'ફક્ત સંબંધિત અનુગામી પ્રશ્નો દેખાશે. બધી વિગતો વૈકલ્પિક છે.','Next: view education opportunities':'આગળ: શિક્ષણની તકો જુઓ','Back to sections':'વિભાગોમાં પાછા જાઓ','Choose your current or most recent level. Relevant fields will appear automatically.':'તમારું વર્તમાન અથવા છેલ્લું શિક્ષણ સ્તર પસંદ કરો. સંબંધિત પ્રશ્નો આપમેળે દેખાશે.','Current / highest education level':'વર્તમાન / ઉચ્ચતમ શિક્ષણ સ્તર','Not sure yet — let me browse all education opportunities':'હજી નક્કી નથી — બધી શિક્ષણ તકો જુઓ','Optional. Choose the level that best represents you now; you can update it later.':'વૈકલ્પિક. તમારી હાલની સ્થિતિને અનુરૂપ સ્તર પસંદ કરો; પછીથી બદલી શકો છો.','Your form adapts to you':'તમારા પ્રમાણે ફોર્મ બદલાશે','Select an education level above to see only the relevant follow-up questions. You can skip optional details.':'સંબંધિત પ્રશ્નો જોવા ઉપર શિક્ષણ સ્તર પસંદ કરો. વૈકલ્પિક વિગતો છોડી શકો છો.','🔒 Demo only: this profile stays in this browser; it is not sent to a server.':'🔒 ડેમો: પ્રોફાઇલ આ બ્રાઉઝરમાં જ રહે છે; સર્વર પર મોકલાતી નથી.','Next: choose a section':'આગળ: વિભાગ પસંદ કરો','STEP 2 OF 4':'પગલું 2 / 4','Choose what you want to explore':'તમે શું શોધવા માંગો છો?','These are the three main areas of Opportunity Finder. Only Education & Learning is active in this prototype.':'Opportunity Finderના ત્રણ મુખ્ય વિભાગ છે. આ પ્રોટોટાઇપમાં ફક્ત શિક્ષણ અને શીખવું સક્રિય છે.','← Edit details':'← વિગતો બદલો','ACTIVE NOW':'હાલ સક્રિય','Education & Learning':'શિક્ષણ અને શીખવું','Scholarships, school & college options, admissions, research and skills.':'સ્કોલરશિપ, શાળા/કોલેજ, પ્રવેશ, સંશોધન અને કુશળતાની તકો.','Explore education':'શિક્ષણની તકો જુઓ','COMING SOON':'જલ્દી આવશે','Jobs, Careers & Startups':'નોકરી, કારકિર્દી અને સ્ટાર્ટઅપ','Government and private jobs, internships, apprenticeships and startup support.':'સરકારી/ખાનગી નોકરી, ઇન્ટર્નશિપ, એપ્રેન્ટિસશિપ અને સ્ટાર્ટઅપ સહાય.','Not active yet':'હજુ સક્રિય નથી','Government Schemes & Services':'સરકારી યોજનાઓ અને સેવાઓ','Citizen services, welfare programmes, financial support and public schemes.':'નાગરિક સેવાઓ, કલ્યાણ કાર્યક્રમો, નાણાકીય સહાય અને સરકારી યોજનાઓ.','Your profile is saved locally in this browser. Education recommendations are based on education-level overlap in a research catalogue—not an official eligibility decision.':'તમારી પ્રોફાઇલ આ બ્રાઉઝરમાં સાચવાય છે. સૂચનો સંશોધન કેટલોગમાં શિક્ષણ સ્તરના મેળ પર આધારિત છે—આ સત્તાવાર પાત્રતા નિર્ણય નથી.','STEP 3 OF 4':'પગલું 3 / 4','STEP 4 OF 4 · ACTIVE SECTION':'પગલું 4 / 4 · સક્રિય વિભાગ','Choose a subsection to explore opportunities relevant to your profile.':'તમારી પ્રોફાઇલને અનુરૂપ તકો માટે ઉપવિભાગ પસંદ કરો.','← All sections':'← બધા વિભાગો','Edit profile':'પ્રોફાઇલ બદલો','Explore subsections':'ઉપવિભાગો જુઓ','Only subsections suitable for your current education level are shown. The next-step routes are suggestions; admission eligibility must be confirmed from the official portal.':'કોઈ વિષય પસંદ કરો. સંખ્યા તમારા શિક્ષણ સ્તર સાથે ટૅગ થયેલા અને કુલ રેકોર્ડ બતાવે છે.','9 subsections':'9 ઉપવિભાગો','YOUR DISCOVERY LIST':'તમારા માટેની તકો','Opportunities for your profile':'તમારી પ્રોફાઇલ માટેની તકો','Start with relevant records, or browse the full research inventory.':'પ્રથમ સંબંધિત રેકોર્ડ જુઓ અથવા સંપૂર્ણ સંશોધન યાદી જુઓ.','0 results':'0 પરિણામો','Type':'પ્રકાર','Application status':'અરજીની સ્થિતિ','Sort by':'ક્રમમાં ગોઠવો','Most relevant':'સૌથી સંબંધિત','Name A–Z':'નામ A–Z','Status':'સ્થિતિ','Browse all education levels':'બધા શિક્ષણ સ્તરો જુઓ','Include records not tagged to my selected level; this is for browsing, not eligibility.':'પસંદ કરેલા સ્તર સાથે ટૅગ ન થયેલા રેકોર્ડ પણ બતાવો; આ બ્રાઉઝિંગ માટે છે, પાત્રતા માટે નહીં.','No records found for this selection':'આ પસંદગી માટે રેકોર્ડ મળ્યા નથી','Try another subsection, clear a filter or browse all education levels. Some research areas do not yet have tagged records.':'બીજો ઉપવિભાગ પસંદ કરો, ફિલ્ટર દૂર કરો અથવા બધા શિક્ષણ સ્તર જુઓ. કેટલાક ક્ષેત્રોના રેકોર્ડ હજી ટૅગ થયા નથી.','Browse all records in this subsection':'આ ઉપવિભાગના બધા રેકોર્ડ જુઓ','↑ Back to subsections':'↑ ઉપવિભાગો પર પાછા જાઓ','Reset search and filters':'શોધ અને ફિલ્ટર રીસેટ કરો','Research snapshot: 24 Oct 2026 · Level-filtered · Institution and state portal data are partial research examples; verify current official notices':'સંશોધન યાદી: 13 Oct 2026 · સંપૂર્ણ કે પ્રોડક્શન-ચકાસેલી નથી','OPPORTUNITY DETAILS':'તકની વિગતો','Opportunity title':'તકનું નામ','Always confirm current eligibility, dates and instructions on the official source.':'પાત્રતા, તારીખો અને સૂચનાઓ સત્તાવાર સ્ત્રોત પરથી જરૂર ચકાસો.','Close details':'વિગતો બંધ કરો','Close':'બંધ કરો','Scholarship':'સ્કોલરશિપ','Education assistance':'શિક્ષણ સહાય','Fellowship':'ફેલોશિપ','Academic stipend':'શૈક્ષણિક સ્ટાઇપેન્ડ','Entrance exam':'પ્રવેશ પરીક્ષા','Course / training':'કોર્સ / તાલીમ','Skill programme':'કુશળતા કાર્યક્રમ','Free coaching':'મફત કોચિંગ','School Education':'શાળા શિક્ષણ','Diploma & Polytechnic':'ડિપ્લોમા અને પોલિટેકનિક','Undergraduate (UG)':'અંડરગ્રેજ્યુએટ (UG)','Postgraduate (PG)':'પોસ્ટગ્રેજ્યુએટ (PG)','PhD & Research':'PhD અને સંશોધન','Entrance Exams & Admissions':'પ્રવેશ પરીક્ષાઓ અને પ્રવેશ','Scholarships & Financial Aid':'સ્કોલરશિપ અને નાણાકીય સહાય','Fellowships & Academic Stipends':'ફેલોશિપ અને શૈક્ષણિક સ્ટાઇપેન્ડ','Skill & Vocational Learning':'કુશળતા અને વ્યાવસાયિક શિક્ષણ','Select if applicable':'લાગુ પડે તો પસંદ કરો','Optional':'વૈકલ્પિક','Optional profile detail. Scheme-specific cut-offs are not evaluated yet.':'વૈકલ્પિક પ્રોફાઇલ વિગત. યોજનાની ચોક્કસ મર્યાદા હજી તપાસાતી નથી.','Currently studying':'હાલ અભ્યાસ ચાલુ છે','Completed this level':'આ સ્તર પૂર્ણ કર્યું','Planning to enrol / continue':'પ્રવેશ / આગળ અભ્યાસ કરવાની યોજના','Not currently studying':'હાલ અભ્યાસ કરતા નથી','Open':'ખુલ્લું','Upcoming':'ટૂંક સમયમાં','Closed':'બંધ','Deadline Unknown':'અંતિમ તારીખ અજ્ઞાત','Not specified':'જણાવ્યું નથી','Location not provided':'સ્થાન આપ્યું નથી','Profile:':'પ્રોફાઇલ:','Activity:':'હાલની સ્થિતિ:','Learning interests':'શીખવાની રુચિ','What would you like to learn?':'તમે શું શીખવા માંગો છો?','Preferred learning mode':'શીખવાની પસંદગીની રીત','Preferred language for learning':'શીખવાની પસંદગીની ભાષા','Your goal':'તમારો હેતુ','Primary school details':'પ્રાથમિક શાળાની વિગતો','Middle school details':'મિડલ શાળાની વિગતો','Class 9–10 details':'ધોરણ 9–10ની વિગતો','Class 11–12 details':'ધોરણ 11–12ની વિગતો','Diploma / Polytechnic / ITI details':'ડિપ્લોમા / પોલિટેકનિક / ITIની વિગતો','Bachelor’s / UG details':'બેચલર / UGની વિગતો','Master’s / PG details':'માસ્ટર / PGની વિગતો','PhD / Research details':'PhD / સંશોધનની વિગતો','Other qualification details':'અન્ય લાયકાતની વિગતો','Current class / last class completed':'વર્તમાન ધોરણ / છેલ્લું પૂર્ણ ધોરણ','Current class':'વર્તમાન ધોરણ','Current / last class':'વર્તમાન / છેલ્લું ધોરણ','School board':'શાળા બોર્ડ','Expected / completed year':'અપેક્ષિત / પૂર્ણ વર્ષ','Current year / semester':'વર્તમાન વર્ષ / સેમેસ્ટર','Branch / trade':'શાખા / ટ્રેડ','Degree / course':'ડિગ્રી / કોર્સ','Branch / major / specialization':'શાખા / મુખ્ય વિષય / વિશેષતા','Master’s degree / course':'માસ્ટર ડિગ્રી / કોર્સ','Specialization / subject':'વિશેષતા / વિષય','Research / doctoral stage':'સંશોધન / ડોક્ટરલ સ્થિતિ','Research field / subject':'સંશોધન ક્ષેત્ર / વિષય','Previous qualification':'અગાઉની લાયકાત','Previous degree':'અગાઉની ડિગ્રી','School / college / institution':'શાળા / કોલેજ / સંસ્થા','Board / university / awarding body':'બોર્ડ / યુનિવર્સિટી / પ્રમાણપત્ર આપતી સંસ્થા','Marks / percentage / GPA':'ગુણ / ટકાવારી / GPA','What would you like to explore?':'તમે શું શોધવા માંગો છો?'
    }
  };
  Object.assign(UI_TRANSLATIONS.hi, {
    'No formal education':'औपचारिक शिक्षा नहीं','Primary school · Class 1–5':'प्राथमिक स्कूल · कक्षा 1–5','Middle school · Class 6–8':'मिडिल स्कूल · कक्षा 6–8','Secondary · Class 9–10':'माध्यमिक · कक्षा 9–10','Senior secondary · Class 11–12':'उच्च माध्यमिक · कक्षा 11–12','Diploma / Polytechnic / ITI':'डिप्लोमा / पॉलिटेक्निक / ITI','Bachelor’s / Undergraduate (UG)':'स्नातक / अंडरग्रेजुएट (UG)','Master’s / Postgraduate (PG)':'स्नातकोत्तर / पोस्टग्रेजुएट (PG)','PhD / Doctoral / Research':'PhD / डॉक्टरेट / रिसर्च','Other qualification / equivalent':'अन्य योग्यता / समकक्ष','Science — PCM':'विज्ञान — PCM','Science — PCB':'विज्ञान — PCB','Science — PCMB':'विज्ञान — PCMB','Commerce':'कॉमर्स','Arts / Humanities':'कला / मानविकी','Vocational':'व्यावसायिक','Other':'अन्य','Currently studying':'अभी पढ़ाई कर रहे हैं','Completed this level':'यह स्तर पूरा कर लिया','Planning to enrol / continue':'प्रवेश / पढ़ाई जारी रखने की योजना','Not currently studying':'अभी पढ़ाई नहीं कर रहे','School student':'स्कूल विद्यार्थी','Diploma / ITI student':'डिप्लोमा / ITI विद्यार्थी','College / university student':'कॉलेज / विश्वविद्यालय विद्यार्थी','Research scholar / PhD student':'रिसर्च स्कॉलर / PhD विद्यार्थी','Completed my studies':'पढ़ाई पूरी कर ली है','Looking for a job':'नौकरी ढूँढ रहा/रही हूँ','Looking to learn a new skill':'नई स्किल सीखना चाहता/चाहती हूँ','District list unavailable — enter manually':'ज़िलों की सूची उपलब्ध नहीं — खुद भरें','Select state first':'पहले राज्य चुनें','Select state / UT':'राज्य / केंद्र शासित प्रदेश चुनें','Other country':'अन्य देश','Select district (optional)':'ज़िला चुनें (वैकल्पिक)',
    'School-level learning and support':'स्कूल शिक्षा और सहायता','Diploma courses and technical study routes.':'डिप्लोमा कोर्स और तकनीकी शिक्षा के रास्ते।','Bachelor’s study, admission routes and undergraduate support.':'स्नातक पढ़ाई, प्रवेश और UG सहायता।','Master’s programmes and postgraduate scholarship candidates.':'मास्टर प्रोग्राम और PG स्कॉलरशिप विकल्प।','Doctoral research, research funding and related opportunities.':'डॉक्टरेट रिसर्च, रिसर्च फंडिंग और संबंधित अवसर।','Entrance examinations, counselling and admission routes.':'प्रवेश परीक्षाएँ, काउंसलिंग और प्रवेश प्रक्रिया।','Scholarships and education-related financial assistance.':'स्कॉलरशिप और शिक्षा संबंधी वित्तीय सहायता।','Research fellowships, academic stipends and funding.':'रिसर्च फेलोशिप, अकादमिक स्टाइपेंड और फंडिंग।','Skill courses, vocational training and learning programmes.':'स्किल कोर्स, व्यावसायिक प्रशिक्षण और सीखने के कार्यक्रम।',
    'Scholarship':'स्कॉलरशिप','Education Assistance':'शिक्षा सहायता','Fellowship':'फेलोशिप','Stipend':'स्टाइपेंड','Entrance Exam':'प्रवेश परीक्षा','Training':'प्रशिक्षण','Skill Program':'स्किल कार्यक्रम','Free Coaching':'मुफ़्त कोचिंग','Blocked · review needed':'ब्लॉक · समीक्षा ज़रूरी','Verified record':'सत्यापित रिकॉर्ड','Provisional · verify details':'अस्थायी रिकॉर्ड · पुष्टि करें','Listed Open · verify current status':'खुला बताया गया · वर्तमान स्थिति जाँचें','Deadline unknown':'अंतिम तिथि अज्ञात','Open':'खुला','Upcoming':'जल्द शुरू','Closed':'बंद','All types':'सभी प्रकार','All statuses':'सभी स्थितियाँ',
    'Education opportunities for your profile':'आपकी प्रोफ़ाइल के लिए शिक्षा अवसर','Choose a relevant subsection above. Select an education level in your profile for personalized records.':'ऊपर सब-सेक्शन चुनें या पूरी रिसर्च सूची देखें।','Education level has not been selected; results are in browse mode.':'शिक्षा स्तर नहीं चुना गया है; सभी रिकॉर्ड ब्राउज़ हो रहे हैं।','Filtered by education-level tag only. Marks, age, income, category, domicile and course-specific eligibility are not fully evaluated.':'फ़िल्टर केवल शिक्षा स्तर के टैग पर है। अंक, आयु, आय, श्रेणी, निवास और कोर्स-विशिष्ट पात्रता की पूरी जाँच नहीं हुई है।','Browsing all levels: some records may not match your education profile.':'सभी स्तर ब्राउज़ हो रहे हैं; कुछ रिकॉर्ड आपकी प्रोफ़ाइल से मेल नहीं खा सकते।','This is a provisional research inventory; an “Open” label is not a guarantee that the application window remains open.':'यह शुरुआती रिसर्च सूची है; “खुला” लिखे होने से आवेदन अभी खुला होने की गारंटी नहीं है।','Search by name, subject or keyword':'नाम, विषय या कीवर्ड से खोजें','Type':'प्रकार','Application status':'आवेदन स्थिति','Sort by':'क्रमबद्ध करें'
  });
  Object.assign(UI_TRANSLATIONS.gu, {
    'No formal education':'ઔપચારિક શિક્ષણ નથી','Primary school · Class 1–5':'પ્રાથમિક શાળા · ધોરણ 1–5','Middle school · Class 6–8':'મધ્યમ શાળા · ધોરણ 6–8','Secondary · Class 9–10':'માધ્યમિક · ધોરણ 9–10','Senior secondary · Class 11–12':'ઉચ્ચ માધ્યમિક · ધોરણ 11–12','Diploma / Polytechnic / ITI':'ડિપ્લોમા / પોલિટેકનિક / ITI','Bachelor’s / Undergraduate (UG)':'બેચલર / અંડરગ્રેજ્યુએટ (UG)','Master’s / Postgraduate (PG)':'માસ્ટર / પોસ્ટગ્રેજ્યુએટ (PG)','PhD / Doctoral / Research':'PhD / ડોક્ટરલ / સંશોધન','Other qualification / equivalent':'અન્ય લાયકાત / સમકક્ષ','Science — PCM':'વિજ્ઞાન — PCM','Science — PCB':'વિજ્ઞાન — PCB','Science — PCMB':'વિજ્ઞાન — PCMB','Commerce':'કોમર્સ','Arts / Humanities':'કલા / માનવવિદ્યા','Vocational':'વ્યાવસાયિક','Other':'અન્ય','District list unavailable — enter manually':'જિલ્લાની યાદી ઉપલબ્ધ નથી — જાતે દાખલ કરો','School-level learning and support':'શાળાકીય શિક્ષણ અને સહાય','Diploma courses and technical study routes.':'ડિપ્લોમા કોર્સ અને ટેકનિકલ અભ્યાસના માર્ગો.','Bachelor’s study, admission routes and undergraduate support.':'બેચલર અભ્યાસ, પ્રવેશ અને UG સહાય.','Master’s programmes and postgraduate scholarship candidates.':'માસ્ટર પ્રોગ્રામ અને PG સ્કોલરશિપ વિકલ્પો.','Doctoral research, research funding and related opportunities.':'ડોક્ટરલ સંશોધન, રિસર્ચ ફંડિંગ અને સંબંધિત તકો.','Entrance examinations, counselling and admission routes.':'પ્રવેશ પરીક્ષાઓ, કાઉન્સેલિંગ અને પ્રવેશ માર્ગો.','Scholarships and education-related financial assistance.':'સ્કોલરશિપ અને શિક્ષણ સંબંધિત નાણાકીય સહાય.','Research fellowships, academic stipends and funding.':'રિસર્ચ ફેલોશિપ, શૈક્ષણિક સ્ટાઇપેન્ડ અને ફંડિંગ.','Skill courses, vocational training and learning programmes.':'કૌશલ્ય કોર્સ, વ્યાવસાયિક તાલીમ અને અભ્યાસ કાર્યક્રમો.','Scholarship':'સ્કોલરશિપ','Education Assistance':'શિક્ષણ સહાય','Fellowship':'ફેલોશિપ','Stipend':'સ્ટાઇપેન્ડ','Entrance Exam':'પ્રવેશ પરીક્ષા','Training':'તાલીમ','Skill Program':'કૌશલ્ય કાર્યક્રમ','Free Coaching':'મફત કોચિંગ','Blocked · review needed':'બ્લોક · સમીક્ષા જરૂરી','Verified record':'ચકાસાયેલ રેકોર્ડ','Provisional · verify details':'પ્રાથમિક રેકોર્ડ · વિગતો ચકાસો','Listed Open · verify current status':'ખુલ્લું દર્શાવ્યું છે · હાલની સ્થિતિ ચકાસો','Deadline unknown':'અંતિમ તારીખ અજ્ઞાત','Open':'ખુલ્લું','Upcoming':'ટૂંક સમયમાં','Closed':'બંધ','All types':'બધા પ્રકાર','All statuses':'બધી સ્થિતિ','Education opportunities for your profile':'તમારી પ્રોફાઇલ માટે શિક્ષણની તકો','Choose a relevant subsection above. Select an education level in your profile for personalized records.':'ઉપર ઉપવિભાગ પસંદ કરો અથવા સંપૂર્ણ સંશોધન યાદી જુઓ.','Education level has not been selected; results are in browse mode.':'શિક્ષણ સ્તર પસંદ નથી; બધા રેકોર્ડ બ્રાઉઝ થાય છે.','Filtered by education-level tag only. Marks, age, income, category, domicile and course-specific eligibility are not fully evaluated.':'ફિલ્ટર ફક્ત શિક્ષણ સ્તરના ટૅગ પર છે. ગુણ, ઉંમર, આવક, કેટેગરી, નિવાસ અને કોર્સ-વિશિષ્ટ પાત્રતા સંપૂર્ણ તપાસાઈ નથી.','Browsing all levels: some records may not match your education profile.':'બધા સ્તરો જોવાઈ રહ્યા છે; કેટલાક રેકોર્ડ તમારી પ્રોફાઇલને અનુરૂપ ન પણ હોય.','This is a provisional research inventory; an “Open” label is not a guarantee that the application window remains open.':'આ પ્રાથમિક સંશોધન યાદી છે; “ખુલ્લું” લખેલું હોવું અરજી હજી ચાલુ હોવાની ખાતરી નથી.','Search by name, subject or keyword':'નામ, વિષય અથવા કીવર્ડથી શોધો','Type':'પ્રકાર','Application status':'અરજીની સ્થિતિ','Sort by':'ક્રમમાં ગોઠવો'
  });
  Object.assign(UI_TRANSLATIONS.hi, {'Preferred pathway':'आगे का पसंदीदा रास्ता','Choose a pathway':'रास्ता चुनें','All pathways':'सभी रास्ते','Class XI–XII stream':'कक्षा 11–12 की स्ट्रीम','Choose a stream':'स्ट्रीम चुनें','Class XI–XII · choose stream':'कक्षा 11–12 · स्ट्रीम चुनें','Class XI–XII · Science PCM':'कक्षा 11–12 · विज्ञान PCM','Class XI–XII · Science PCB':'कक्षा 11–12 · विज्ञान PCB','Class XI–XII · Science PCMB':'कक्षा 11–12 · विज्ञान PCMB','Class XI–XII · Commerce with Maths':'कक्षा 11–12 · गणित के साथ कॉमर्स','Class XI–XII · Commerce without Maths':'कक्षा 11–12 · गणित के बिना कॉमर्स','Class XI–XII · Arts / Humanities':'कक्षा 11–12 · कला / मानविकी','Class XI–XII · Vocational':'कक्षा 11–12 · व्यावसायिक','Diploma / Polytechnic':'डिप्लोमा / पॉलिटेक्निक','ITI / Trade training':'ITI / ट्रेड प्रशिक्षण','Vocational / skill courses':'व्यावसायिक / स्किल कोर्स','Open schooling (NIOS etc.)':'ओपन स्कूलिंग (NIOS आदि)','Scholarships & Financial Aid':'स्कॉलरशिप और आर्थिक सहायता','Entrance Exams & Admissions':'प्रवेश परीक्षाएँ और दाखिले','Non-technical options are included too: Commerce, Arts/Humanities, vocational and open schooling.':'गैर-तकनीकी विकल्प भी शामिल हैं: कॉमर्स, कला/मानविकी, व्यावसायिक कोर्स और ओपन स्कूलिंग।','No entries match this pathway and stream. Try another choice or show all pathways.':'इस रास्ते और स्ट्रीम से मेल खाने वाला रिकॉर्ड नहीं मिला। दूसरा विकल्प चुनें या सभी रास्ते देखें.'});
  Object.assign(UI_TRANSLATIONS.gu, {'Preferred pathway':'પસંદગીનો શૈક્ષણિક માર્ગ','Choose a pathway':'માર્ગ પસંદ કરો','All pathways':'બધા માર્ગો','Class XI–XII stream':'ધોરણ 11–12ની સ્ટ્રીમ','Choose a stream':'સ્ટ્રીમ પસંદ કરો','Class XI–XII · choose stream':'ધોરણ 11–12 · સ્ટ્રીમ પસંદ કરો','Class XI–XII · Science PCM':'ધોરણ 11–12 · વિજ્ઞાન PCM','Class XI–XII · Science PCB':'ધોરણ 11–12 · વિજ્ઞાન PCB','Class XI–XII · Science PCMB':'ધોરણ 11–12 · વિજ્ઞાન PCMB','Class XI–XII · Commerce with Maths':'ધોરણ 11–12 · ગણિત સાથે કોમર્સ','Class XI–XII · Commerce without Maths':'ધોરણ 11–12 · ગણિત વગર કોમર્સ','Class XI–XII · Arts / Humanities':'ધોરણ 11–12 · કલા / માનવવિદ્યા','Class XI–XII · Vocational':'ધોરણ 11–12 · વ્યાવસાયિક','Diploma / Polytechnic':'ડિપ્લોમા / પોલિટેકનિક','ITI / Trade training':'ITI / ટ્રેડ તાલીમ','Vocational / skill courses':'વ્યાવસાયિક / કૌશલ્ય કોર્સ','Open schooling (NIOS etc.)':'ઓપન સ્કૂલિંગ (NIOS વગેરે)','Scholarships & Financial Aid':'સ્કોલરશિપ અને નાણાકીય સહાય','Entrance Exams & Admissions':'પ્રવેશ પરીક્ષાઓ અને પ્રવેશ','Non-technical options are included too: Commerce, Arts/Humanities, vocational and open schooling.':'બિન-ટેકનિકલ વિકલ્પો પણ છે: કોમર્સ, કલા/માનવવિદ્યા, વ્યાવસાયિક અને ઓપન સ્કૂલિંગ.','No entries match this pathway and stream. Try another choice or show all pathways.':'આ માર્ગ અને સ્ટ્રીમ માટે મેળ ખાતો રેકોર્ડ નથી. બીજો વિકલ્પ પસંદ કરો.'});
  // Additional Indian-language UI translations. Scheme/institution names and official notices remain in their source language.
  const EXTRA_LANGUAGE_TRANSLATIONS = {
    bn:{'Choose language':'ভাষা নির্বাচন করুন','After Class 10, choose your next pathway':'দশম শ্রেণির পরে পরবর্তী পথ বেছে নিন','Preferred pathway':'পছন্দের শিক্ষার পথ','Choose a pathway':'শিক্ষার পথ বেছে নিন','Class XI–XII stream':'একাদশ–দ্বাদশ শ্রেণির বিভাগ','Choose a stream':'বিভাগ বেছে নিন','All pathways':'সব শিক্ষার পথ','Class XI–XII · Science PCM':'একাদশ–দ্বাদশ · বিজ্ঞান PCM','Class XI–XII · Science PCB':'একাদশ–দ্বাদশ · বিজ্ঞান PCB','Class XI–XII · Science PCMB':'একাদশ–দ্বাদশ · বিজ্ঞান PCMB','Class XI–XII · Commerce with Maths':'একাদশ–দ্বাদশ · গণিতসহ বাণিজ্য','Class XI–XII · Commerce without Maths':'একাদশ–দ্বাদশ · গণিত ছাড়া বাণিজ্য','Class XI–XII · Arts / Humanities':'একাদশ–দ্বাদশ · কলা / মানবিক','Class XI–XII · Vocational':'একাদশ–দ্বাদশ · বৃত্তিমূলক','Diploma / Polytechnic':'ডিপ্লোমা / পলিটেকনিক','ITI / Trade training':'ITI / ট্রেড প্রশিক্ষণ','Vocational / skill courses':'বৃত্তিমূলক / দক্ষতা কোর্স','Open schooling (NIOS etc.)':'ওপেন স্কুলিং (NIOS ইত্যাদি)','Not sure yet — show all relevant routes':'এখনও নিশ্চিত নই — সব প্রাসঙ্গিক পথ দেখান','Non-technical options are included too: Commerce, Arts/Humanities, vocational and open schooling.':'অ-প্রযুক্তিগত বিকল্পও রয়েছে: বাণিজ্য, কলা/মানবিক, বৃত্তিমূলক ও ওপেন স্কুলিং।','No entries match this pathway and stream. Try another choice or show all pathways.':'এই পথ ও বিভাগের সঙ্গে মেলে এমন তথ্য নেই। অন্য বিকল্প নিন বা সব পথ দেখুন।'},
    mr:{'Choose language':'भाषा निवडा','After Class 10, choose your next pathway':'इयत्ता १० नंतरचा पुढील मार्ग निवडा','Preferred pathway':'पसंतीचा शैक्षणिक मार्ग','Choose a pathway':'शैक्षणिक मार्ग निवडा','Class XI–XII stream':'इयत्ता ११–१२ शाखा','Choose a stream':'शाखा निवडा','All pathways':'सर्व मार्ग','Class XI–XII · Science PCM':'इयत्ता ११–१२ · विज्ञान PCM','Class XI–XII · Science PCB':'इयत्ता ११–१२ · विज्ञान PCB','Class XI–XII · Science PCMB':'इयत्ता ११–१२ · विज्ञान PCMB','Class XI–XII · Commerce with Maths':'इयत्ता ११–१२ · गणितासह वाणिज्य','Class XI–XII · Commerce without Maths':'इयत्ता ११–१२ · गणिताशिवाय वाणिज्य','Class XI–XII · Arts / Humanities':'इयत्ता ११–१२ · कला / मानवविद्या','Class XI–XII · Vocational':'इयत्ता ११–१२ · व्यावसायिक','Diploma / Polytechnic':'डिप्लोमा / पॉलिटेक्निक','ITI / Trade training':'ITI / ट्रेड प्रशिक्षण','Vocational / skill courses':'व्यावसायिक / कौशल्य अभ्यासक्रम','Open schooling (NIOS etc.)':'मुक्त शिक्षण (NIOS इ.)','Not sure yet — show all relevant routes':'अजून ठरलेले नाही — सर्व संबंधित मार्ग दाखवा','Non-technical options are included too: Commerce, Arts/Humanities, vocational and open schooling.':'वाणिज्य, कला/मानवविद्या, व्यावसायिक आणि मुक्त शिक्षण असे बिगर-तांत्रिक पर्यायही आहेत.','No entries match this pathway and stream. Try another choice or show all pathways.':'या मार्गाशी आणि शाखेशी जुळणारी नोंद नाही. दुसरा पर्याय निवडा किंवा सर्व मार्ग दाखवा.'},
    ta:{'Choose language':'மொழியைத் தேர்ந்தெடுக்கவும்','After Class 10, choose your next pathway':'10ஆம் வகுப்புக்குப் பிறகு அடுத்த கல்விப் பாதையைத் தேர்ந்தெடுக்கவும்','Preferred pathway':'விருப்பமான கல்விப் பாதை','Choose a pathway':'கல்விப் பாதையைத் தேர்ந்தெடுக்கவும்','Class XI–XII stream':'11–12ஆம் வகுப்பு பிரிவு','Choose a stream':'பிரிவைத் தேர்ந்தெடுக்கவும்','All pathways':'அனைத்து பாதைகளும்','Class XI–XII · Science PCM':'11–12ஆம் வகுப்பு · அறிவியல் PCM','Class XI–XII · Science PCB':'11–12ஆம் வகுப்பு · அறிவியல் PCB','Class XI–XII · Science PCMB':'11–12ஆம் வகுப்பு · அறிவியல் PCMB','Class XI–XII · Commerce with Maths':'11–12ஆம் வகுப்பு · கணிதத்துடன் வணிகவியல்','Class XI–XII · Commerce without Maths':'11–12ஆம் வகுப்பு · கணிதமின்றி வணிகவியல்','Class XI–XII · Arts / Humanities':'11–12ஆம் வகுப்பு · கலை / மனிதவியல்','Class XI–XII · Vocational':'11–12ஆம் வகுப்பு · தொழிற்கல்வி','Diploma / Polytechnic':'டிப்ளமா / பாலிடெக்னிக்','ITI / Trade training':'ITI / தொழிற்பயிற்சி','Vocational / skill courses':'தொழிற்கல்வி / திறன் படிப்புகள்','Open schooling (NIOS etc.)':'திறந்தநிலைப் பள்ளிக் கல்வி (NIOS போன்றவை)','Not sure yet — show all relevant routes':'இன்னும் முடிவு செய்யவில்லை — தொடர்புடைய அனைத்தையும் காட்டவும்','Non-technical options are included too: Commerce, Arts/Humanities, vocational and open schooling.':'வணிகவியல், கலை/மனிதவியல், தொழிற்கல்வி மற்றும் திறந்தநிலைப் பள்ளிக் கல்வி போன்ற தொழில்நுட்பமற்ற விருப்பங்களும் உள்ளன.','No entries match this pathway and stream. Try another choice or show all pathways.':'இந்தப் பாதை மற்றும் பிரிவுக்கு பொருந்தும் பதிவுகள் இல்லை. வேறு தேர்வை முயற்சிக்கவும்.'},
    te:{'Choose language':'భాషను ఎంచుకోండి','After Class 10, choose your next pathway':'10వ తరగతి తర్వాత తదుపరి విద్యా మార్గాన్ని ఎంచుకోండి','Preferred pathway':'ఇష్టమైన విద్యా మార్గం','Choose a pathway':'విద్యా మార్గాన్ని ఎంచుకోండి','Class XI–XII stream':'11–12 తరగతుల విభాగం','Choose a stream':'విభాగాన్ని ఎంచుకోండి','All pathways':'అన్ని మార్గాలు','Class XI–XII · Science PCM':'11–12 తరగతులు · సైన్స్ PCM','Class XI–XII · Science PCB':'11–12 తరగతులు · సైన్స్ PCB','Class XI–XII · Science PCMB':'11–12 తరగతులు · సైన్స్ PCMB','Class XI–XII · Commerce with Maths':'11–12 తరగతులు · గణితంతో కామర్స్','Class XI–XII · Commerce without Maths':'11–12 తరగతులు · గణితం లేకుండా కామర్స్','Class XI–XII · Arts / Humanities':'11–12 తరగతులు · ఆర్ట్స్ / హ్యూమానిటీస్','Class XI–XII · Vocational':'11–12 తరగతులు · వృత్తి విద్య','Diploma / Polytechnic':'డిప్లొమా / పాలిటెక్నిక్','ITI / Trade training':'ITI / ట్రేడ్ శిక్షణ','Vocational / skill courses':'వృత్తి / నైపుణ్య కోర్సులు','Open schooling (NIOS etc.)':'ఓపెన్ స్కూలింగ్ (NIOS మొదలైనవి)','Not sure yet — show all relevant routes':'ఇంకా నిర్ణయించలేదు — సంబంధిత అన్ని మార్గాలు చూపండి','Non-technical options are included too: Commerce, Arts/Humanities, vocational and open schooling.':'కామర్స్, ఆర్ట్స్/హ్యూమానిటీస్, వృత్తి విద్య, ఓపెన్ స్కూలింగ్ వంటి నాన్-టెక్నికల్ ఎంపికలూ ఉన్నాయి.','No entries match this pathway and stream. Try another choice or show all pathways.':'ఈ మార్గం, విభాగానికి సరిపోయే రికార్డులు లేవు. మరో ఎంపికను ప్రయత్నించండి.'},
    kn:{'Choose language':'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ','After Class 10, choose your next pathway':'10ನೇ ತರಗತಿಯ ನಂತರದ ಶಿಕ್ಷಣದ ಮಾರ್ಗ ಆಯ್ಕೆಮಾಡಿ','Preferred pathway':'ಆದ್ಯತೆಯ ಶಿಕ್ಷಣ ಮಾರ್ಗ','Choose a pathway':'ಶಿಕ್ಷಣ ಮಾರ್ಗ ಆಯ್ಕೆಮಾಡಿ','Class XI–XII stream':'11–12ನೇ ತರಗತಿ ವಿಭಾಗ','Choose a stream':'ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ','All pathways':'ಎಲ್ಲಾ ಮಾರ್ಗಗಳು','Class XI–XII · Science PCM':'11–12ನೇ ತರಗತಿ · ವಿಜ್ಞಾನ PCM','Class XI–XII · Science PCB':'11–12ನೇ ತರಗತಿ · ವಿಜ್ಞಾನ PCB','Class XI–XII · Science PCMB':'11–12ನೇ ತರಗತಿ · ವಿಜ್ಞಾನ PCMB','Class XI–XII · Commerce with Maths':'11–12ನೇ ತರಗತಿ · ಗಣಿತದೊಂದಿಗೆ ವಾಣಿಜ್ಯ','Class XI–XII · Commerce without Maths':'11–12ನೇ ತರಗತಿ · ಗಣಿತವಿಲ್ಲದ ವಾಣಿಜ್ಯ','Class XI–XII · Arts / Humanities':'11–12ನೇ ತರಗತಿ · ಕಲೆ / ಮಾನವಿಕ','Class XI–XII · Vocational':'11–12ನೇ ತರಗತಿ · ವೃತ್ತಿಪರ','Diploma / Polytechnic':'ಡಿಪ್ಲೊಮಾ / ಪಾಲಿಟೆಕ್ನಿಕ್','ITI / Trade training':'ITI / ಟ್ರೇಡ್ ತರಬೇತಿ','Vocational / skill courses':'ವೃತ್ತಿಪರ / ಕೌಶಲ್ಯ ಕೋರ್ಸ್‌ಗಳು','Open schooling (NIOS etc.)':'ಮುಕ್ತ ಶಾಲಾ ಶಿಕ್ಷಣ (NIOS ಇತ್ಯಾದಿ)','Not sure yet — show all relevant routes':'ಇನ್ನೂ ನಿರ್ಧರಿಸಿಲ್ಲ — ಸಂಬಂಧಿತ ಎಲ್ಲಾ ಮಾರ್ಗಗಳನ್ನು ತೋರಿಸಿ','Non-technical options are included too: Commerce, Arts/Humanities, vocational and open schooling.':'ವಾಣಿಜ್ಯ, ಕಲೆ/ಮಾನವಿಕ, ವೃತ್ತಿಪರ ಮತ್ತು ಮುಕ್ತ ಶಾಲಾ ಶಿಕ್ಷಣದಂತಹ ತಾಂತ್ರಿಕವಲ್ಲದ ಆಯ್ಕೆಯೂ ಇದೆ.','No entries match this pathway and stream. Try another choice or show all pathways.':'ಈ ಮಾರ್ಗ ಮತ್ತು ವಿಭಾಗಕ್ಕೆ ಹೊಂದುವ ದಾಖಲೆಗಳಿಲ್ಲ. ಬೇರೆ ಆಯ್ಕೆ ಮಾಡಿ.'},
    ml:{'Choose language':'ഭാഷ തിരഞ്ഞെടുക്കുക','After Class 10, choose your next pathway':'പത്താം ക്ലാസിന് ശേഷം അടുത്ത വിദ്യാഭ്യാസ വഴി തിരഞ്ഞെടുക്കുക','Preferred pathway':'ഇഷ്ടപ്പെട്ട വിദ്യാഭ്യാസ വഴി','Choose a pathway':'വിദ്യാഭ്യാസ വഴി തിരഞ്ഞെടുക്കുക','Class XI–XII stream':'11–12 ക്ലാസ് വിഭാഗം','Choose a stream':'വിഭാഗം തിരഞ്ഞെടുക്കുക','All pathways':'എല്ലാ വഴികളും','Class XI–XII · Science PCM':'11–12 ക്ലാസ് · സയൻസ് PCM','Class XI–XII · Science PCB':'11–12 ക്ലാസ് · സയൻസ് PCB','Class XI–XII · Science PCMB':'11–12 ക്ലാസ് · സയൻസ് PCMB','Class XI–XII · Commerce with Maths':'11–12 ക്ലാസ് · ഗണിതത്തോടെയുള്ള കൊമേഴ്‌സ്','Class XI–XII · Commerce without Maths':'11–12 ക്ലാസ് · ഗണിതമില്ലാത്ത കൊമേഴ്‌സ്','Class XI–XII · Arts / Humanities':'11–12 ക്ലാസ് · ആർട്സ് / ഹ്യൂമാനിറ്റീസ്','Class XI–XII · Vocational':'11–12 ക്ലാസ് · വൊക്കേഷണൽ','Diploma / Polytechnic':'ഡിപ്ലോമ / പോളിടെക്നിക്','ITI / Trade training':'ITI / ട്രേഡ് പരിശീലനം','Vocational / skill courses':'വൊക്കേഷണൽ / നൈപുണ്യ കോഴ്സുകൾ','Open schooling (NIOS etc.)':'ഓപ്പൺ സ്കൂളിംഗ് (NIOS മുതലായവ)','Not sure yet — show all relevant routes':'ഇനിയും തീരുമാനിച്ചിട്ടില്ല — ബന്ധപ്പെട്ട എല്ലാ വഴികളും കാണിക്കുക','Non-technical options are included too: Commerce, Arts/Humanities, vocational and open schooling.':'കൊമേഴ്‌സ്, ആർട്സ്/ഹ്യൂമാനിറ്റീസ്, വൊക്കേഷണൽ, ഓപ്പൺ സ്കൂളിംഗ് പോലുള്ള നോൺ-ടെക്നിക്കൽ വഴികളും ഉൾപ്പെടുത്തിയിട്ടുണ്ട്.','No entries match this pathway and stream. Try another choice or show all pathways.':'ഈ വഴിക്കും വിഭാഗത്തിനും യോജിച്ച രേഖകളില്ല. മറ്റൊരു തിരഞ്ഞെടുപ്പ് പരീക്ഷിക്കുക.'},
    pa:{'Choose language':'ਭਾਸ਼ਾ ਚੁਣੋ','After Class 10, choose your next pathway':'ਦਸਵੀਂ ਤੋਂ ਬਾਅਦ ਅਗਲਾ ਸਿੱਖਿਆ ਰਸਤਾ ਚੁਣੋ','Preferred pathway':'ਪਸੰਦੀਦਾ ਸਿੱਖਿਆ ਰਸਤਾ','Choose a pathway':'ਸਿੱਖਿਆ ਰਸਤਾ ਚੁਣੋ','Class XI–XII stream':'11–12ਵੀਂ ਜਮਾਤ ਦੀ ਸਟ੍ਰੀਮ','Choose a stream':'ਸਟ੍ਰੀਮ ਚੁਣੋ','All pathways':'ਸਾਰੇ ਰਸਤੇ','Class XI–XII · Science PCM':'11–12ਵੀਂ · ਸਾਇੰਸ PCM','Class XI–XII · Science PCB':'11–12ਵੀਂ · ਸਾਇੰਸ PCB','Class XI–XII · Science PCMB':'11–12ਵੀਂ · ਸਾਇੰਸ PCMB','Class XI–XII · Commerce with Maths':'11–12ਵੀਂ · ਗਣਿਤ ਨਾਲ ਕਾਮਰਸ','Class XI–XII · Commerce without Maths':'11–12ਵੀਂ · ਗਣਿਤ ਤੋਂ ਬਿਨਾਂ ਕਾਮਰਸ','Class XI–XII · Arts / Humanities':'11–12ਵੀਂ · ਆਰਟਸ / ਹਿਊਮੈਨਿਟੀਜ਼','Class XI–XII · Vocational':'11–12ਵੀਂ · ਵੋਕੇਸ਼ਨਲ','Diploma / Polytechnic':'ਡਿਪਲੋਮਾ / ਪੌਲੀਟੈਕਨਿਕ','ITI / Trade training':'ITI / ਟਰੇਡ ਟ੍ਰੇਨਿੰਗ','Vocational / skill courses':'ਵੋਕੇਸ਼ਨਲ / ਹੁਨਰ ਕੋਰਸ','Open schooling (NIOS etc.)':'ਓਪਨ ਸਕੂਲਿੰਗ (NIOS ਆਦਿ)','Not sure yet — show all relevant routes':'ਹਾਲੇ ਪੱਕਾ ਨਹੀਂ — ਸਾਰੇ ਸੰਬੰਧਿਤ ਰਸਤੇ ਦਿਖਾਓ','Non-technical options are included too: Commerce, Arts/Humanities, vocational and open schooling.':'ਕਾਮਰਸ, ਆਰਟਸ/ਹਿਊਮੈਨਿਟੀਜ਼, ਵੋਕੇਸ਼ਨਲ ਅਤੇ ਓਪਨ ਸਕੂਲਿੰਗ ਵਰਗੇ ਗੈਰ-ਤਕਨੀਕੀ ਰਸਤੇ ਵੀ ਸ਼ਾਮਲ ਹਨ।','No entries match this pathway and stream. Try another choice or show all pathways.':'ਇਸ ਰਸਤੇ ਅਤੇ ਸਟ੍ਰੀਮ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲਿਆ।'},
    ur:{'Choose language':'زبان منتخب کریں','After Class 10, choose your next pathway':'دسویں جماعت کے بعد اگلا تعلیمی راستہ منتخب کریں','Preferred pathway':'پسندیدہ تعلیمی راستہ','Choose a pathway':'تعلیمی راستہ منتخب کریں','Class XI–XII stream':'گیارہویں–بارہویں جماعت کا شعبہ','Choose a stream':'شعبہ منتخب کریں','All pathways':'تمام راستے','Class XI–XII · Science PCM':'گیارہویں–بارہویں · سائنس PCM','Class XI–XII · Science PCB':'گیارہویں–بارہویں · سائنس PCB','Class XI–XII · Science PCMB':'گیارہویں–بارہویں · سائنس PCMB','Class XI–XII · Commerce with Maths':'گیارہویں–بارہویں · ریاضی کے ساتھ کامرس','Class XI–XII · Commerce without Maths':'گیارہویں–بارہویں · ریاضی کے بغیر کامرس','Class XI–XII · Arts / Humanities':'گیارہویں–بارہویں · آرٹس / ہیومینیٹیز','Class XI–XII · Vocational':'گیارہویں–بارہویں · ووکیشنل','Diploma / Polytechnic':'ڈپلومہ / پولی ٹیکنک','ITI / Trade training':'ITI / ٹریڈ ٹریننگ','Vocational / skill courses':'ووکیشنل / ہنر کورسز','Open schooling (NIOS etc.)':'اوپن اسکولنگ (NIOS وغیرہ)','Not sure yet — show all relevant routes':'ابھی طے نہیں — تمام متعلقہ راستے دکھائیں','Non-technical options are included too: Commerce, Arts/Humanities, vocational and open schooling.':'کامرس، آرٹس/ہیومینیٹیز، ووکیشنل اور اوپن اسکولنگ جیسے غیر تکنیکی راستے بھی شامل ہیں۔','No entries match this pathway and stream. Try another choice or show all pathways.':'اس راستے اور شعبے سے ملتا ریکارڈ نہیں ملا۔'},
    or:{'Choose language':'ଭାଷା ବାଛନ୍ତୁ','After Class 10, choose your next pathway':'ଦଶମ ଶ୍ରେଣୀ ପରେ ପରବର୍ତ୍ତୀ ଶିକ୍ଷା ପଥ ବାଛନ୍ତୁ','Preferred pathway':'ପସନ୍ଦର ଶିକ୍ଷା ପଥ','Choose a pathway':'ଶିକ୍ଷା ପଥ ବାଛନ୍ତୁ','Class XI–XII stream':'ଏକାଦଶ–ଦ୍ୱାଦଶ ଶ୍ରେଣୀ ବିଭାଗ','Choose a stream':'ବିଭାଗ ବାଛନ୍ତୁ','All pathways':'ସମସ୍ତ ପଥ','Class XI–XII · Science PCM':'ଏକାଦଶ–ଦ୍ୱାଦଶ · ବିଜ୍ଞାନ PCM','Class XI–XII · Science PCB':'ଏକାଦଶ–ଦ୍ୱାଦଶ · ବିଜ୍ଞାନ PCB','Class XI–XII · Science PCMB':'ଏକାଦଶ–ଦ୍ୱାଦଶ · ବିଜ୍ଞାନ PCMB','Class XI–XII · Commerce with Maths':'ଏକାଦଶ–ଦ୍ୱାଦଶ · ଗଣିତ ସହ ବାଣିଜ୍ୟ','Class XI–XII · Commerce without Maths':'ଏକାଦଶ–ଦ୍ୱାଦଶ · ଗଣିତ ବିନା ବାଣିଜ୍ୟ','Class XI–XII · Arts / Humanities':'ଏକାଦଶ–ଦ୍ୱାଦଶ · କଳା / ମାନବିକୀ','Class XI–XII · Vocational':'ଏକାଦଶ–ଦ୍ୱାଦଶ · ବୃତ୍ତିମୂଳକ','Diploma / Polytechnic':'ଡିପ୍ଲୋମା / ପଲିଟେକ୍ନିକ୍','ITI / Trade training':'ITI / ଟ୍ରେଡ୍ ପ୍ରଶିକ୍ଷଣ','Vocational / skill courses':'ବୃତ୍ତିମୂଳକ / ଦକ୍ଷତା ପାଠ୍ୟକ୍ରମ','Open schooling (NIOS etc.)':'ମୁକ୍ତ ବିଦ୍ୟାଳୟ ଶିକ୍ଷା (NIOS ଇତ୍ୟାଦି)','Not sure yet — show all relevant routes':'ଏପର୍ଯ୍ୟନ୍ତ ନିଶ୍ଚିତ ନୁହେଁ — ସମସ୍ତ ପ୍ରାସଙ୍ଗିକ ପଥ ଦେଖାନ୍ତୁ','Non-technical options are included too: Commerce, Arts/Humanities, vocational and open schooling.':'ବାଣିଜ୍ୟ, କଳା/ମାନବିକୀ, ବୃତ୍ତିମୂଳକ ଏବଂ ମୁକ୍ତ ବିଦ୍ୟାଳୟ ଶିକ୍ଷା ପରି ଅଣ-ବୈଷୟିକ ବିକଳ୍ପ ମଧ୍ୟ ଅଛି।','No entries match this pathway and stream. Try another choice or show all pathways.':'ଏହି ପଥ ଓ ବିଭାଗ ସହ ମେଳ ଖାଉଥିବା ତଥ୍ୟ ମିଳିଲା ନାହିଁ।'},
    as:{'Choose language':'ভাষা বাছনি কৰক','After Class 10, choose your next pathway':'দশম শ্ৰেণীৰ পিছত পৰৱৰ্তী শিক্ষাৰ পথ বাছনি কৰক','Preferred pathway':'পছন্দৰ শিক্ষাৰ পথ','Choose a pathway':'শিক্ষাৰ পথ বাছনি কৰক','Class XI–XII stream':'একাদশ–দ্বাদশ শ্ৰেণীৰ শাখা','Choose a stream':'শাখা বাছনি কৰক','All pathways':'সকলো পথ','Class XI–XII · Science PCM':'একাদশ–দ্বাদশ · বিজ্ঞান PCM','Class XI–XII · Science PCB':'একাদশ–দ্বাদশ · বিজ্ঞান PCB','Class XI–XII · Science PCMB':'একাদশ–দ্বাদশ · বিজ্ঞান PCMB','Class XI–XII · Commerce with Maths':'একাদশ–দ্বাদশ · গণিতসহ বাণিজ্য','Class XI–XII · Commerce without Maths':'একাদশ–দ্বাদশ · গণিতবিহীন বাণিজ্য','Class XI–XII · Arts / Humanities':'একাদশ–দ্বাদশ · কলা / মানৱিকী','Class XI–XII · Vocational':'একাদশ–দ্বাদশ · বৃত্তিমূলক','Diploma / Polytechnic':'ডিপ্লোমা / পলিটেকনিক','ITI / Trade training':'ITI / ট্ৰেড প্ৰশিক্ষণ','Vocational / skill courses':'বৃত্তিমূলক / দক্ষতা পাঠ্যক্ৰম','Open schooling (NIOS etc.)':'মুক্ত বিদ্যালয় শিক্ষা (NIOS আদি)','Not sure yet — show all relevant routes':'এতিয়াও নিশ্চিত নহয় — সকলো প্ৰাসংগিক পথ দেখুৱাওক','Non-technical options are included too: Commerce, Arts/Humanities, vocational and open schooling.':'বাণিজ্য, কলা/মানৱিকী, বৃত্তিমূলক আৰু মুক্ত বিদ্যালয় শিক্ষাৰ দৰে অ-কাৰিকৰী বিকল্পও আছে।','No entries match this pathway and stream. Try another choice or show all pathways.':'এই পথ আৰু শাখাৰ সৈতে মিল থকা তথ্য নাই।'}
  };
  Object.assign(UI_TRANSLATIONS.hi, {"After Class 10, which field do you want to choose?": "10वीं के बाद आप किस फील्ड में जाना चाहते हैं?", "Choose a field": "फील्ड चुनें", "Medical / Healthcare / Pharmacy": "मेडिकल / हेल्थकेयर / फार्मेसी", "Engineering / Technical": "इंजीनियरिंग / टेक्निकल", "Commerce / Accounts / Finance": "कॉमर्स / अकाउंट्स / फाइनेंस", "Arts / History / Humanities": "आर्ट्स / हिस्ट्री / ह्यूमैनिटीज", "Non-technical / Business / Hospitality": "नॉन-टेक्निकल / बिज़नेस / हॉस्पिटैलिटी", "Agriculture / Veterinary": "एग्रीकल्चर / वेटरनरी", "Other / Explore all fields": "अन्य / सभी फील्ड देखें", "Diploma field / branch": "डिप्लोमा की फील्ड / ब्रांच", "All diploma fields": "सभी डिप्लोमा फील्ड", "Technical / Engineering diploma": "टेक्निकल / इंजीनियरिंग डिप्लोमा", "Medical / Pharmacy diploma": "मेडिकल / फार्मेसी डिप्लोमा", "Automobile diploma": "ऑटोमोबाइल डिप्लोमा", "Computer / IT diploma": "कंप्यूटर / IT डिप्लोमा", "Electrical diploma": "इलेक्ट्रिकल डिप्लोमा", "Mechanical diploma": "मैकेनिकल डिप्लोमा", "Civil diploma": "सिविल डिप्लोमा", "Non-technical diploma": "नॉन-टेक्निकल डिप्लोमा", "Agriculture diploma": "एग्रीकल्चर डिप्लोमा", "Other diploma": "अन्य डिप्लोमा", "Science PCM — Engineering / Technical": "साइंस PCM — इंजीनियरिंग / टेक्निकल", "Science PCB — Medical / NEET": "साइंस PCB — मेडिकल / NEET", "Science PCMB — both options": "साइंस PCMB — दोनों विकल्प", "Commerce with Maths — Accounts / Finance": "मैथ्स के साथ कॉमर्स — अकाउंट्स / फाइनेंस", "Commerce without Maths — Business / Accounts": "बिना मैथ्स कॉमर्स — बिज़नेस / अकाउंट्स", "Arts / Humanities — BA / History": "आर्ट्स / ह्यूमैनिटीज — BA / हिस्ट्री", "Your Class 12 stream": "आपकी 12वीं की स्ट्रीम", "Use stream from my profile": "मेरी प्रोफाइल वाली स्ट्रीम इस्तेमाल करें", "Science PCM — Engineering / JEE": "साइंस PCM — इंजीनियरिंग / JEE", "Science PCMB — Engineering and Medical": "साइंस PCMB — इंजीनियरिंग और मेडिकल", "Commerce — B.Com / Accounts / Finance": "कॉमर्स — B.Com / अकाउंट्स / फाइनेंस", "Other / show common routes": "अन्य / कॉमन विकल्प दिखाएँ", "Choose your field first. The matching course/admission records will be filtered below. Medical routes commonly require PCB/PCMB; engineering commonly requires PCM, but exact eligibility depends on the institution/course.": "पहले अपनी फील्ड चुनें। नीचे उससे संबंधित कोर्स/एडमिशन रिकॉर्ड दिखेंगे। मेडिकल में आम तौर पर PCB/PCMB और इंजीनियरिंग में PCM की जरूरत होती है; सही पात्रता कोर्स/संस्थान पर निर्भर करती है।", "Results update according to your selected stream. Common cross-stream guides remain visible.": "आपकी चुनी हुई स्ट्रीम के अनुसार रिजल्ट बदलेंगे। सभी स्ट्रीम के लिए उपयोगी सामान्य गाइड भी दिखेंगे."});
  Object.assign(UI_TRANSLATIONS.gu, {"After Class 10, which field do you want to choose?": "ધોરણ 10 પછી તમે કયા ક્ષેત્રમાં જવા માંગો છો?", "Choose a field": "ક્ષેત્ર પસંદ કરો", "Medical / Healthcare / Pharmacy": "મેડિકલ / હેલ્થકેર / ફાર્મસી", "Engineering / Technical": "એન્જિનિયરિંગ / ટેકનિકલ", "Commerce / Accounts / Finance": "કોમર્સ / એકાઉન્ટ્સ / ફાઇનાન્સ", "Arts / History / Humanities": "આર્ટ્સ / ઇતિહાસ / હ્યુમેનિટીઝ", "Diploma field / branch": "ડિપ્લોમા ક્ષેત્ર / શાખા", "All diploma fields": "બધા ડિપ્લોમા ક્ષેત્રો", "Your Class 12 stream": "તમારી ધોરણ 12ની સ્ટ્રીમ", "Use stream from my profile": "મારી પ્રોફાઇલની સ્ટ્રીમ વાપરો", "Science PCM — Engineering / JEE": "સાયન્સ PCM — એન્જિનિયરિંગ / JEE", "Science PCB — Medical / NEET": "સાયન્સ PCB — મેડિકલ / NEET", "Commerce — B.Com / Accounts / Finance": "કોમર્સ — B.Com / એકાઉન્ટ્સ / ફાઇનાન્સ", "Arts / Humanities — BA / History": "આર્ટ્સ / હ્યુમેનિટીઝ — BA / ઇતિહાસ"});
  const EXTRA_PATHWAY_LABELS = ['Preferred pathway','Choose a pathway','All pathways','Class XI–XII stream','Choose a stream','Class XI–XII · choose stream','Class XI–XII · Science PCM','Class XI–XII · Science PCB','Class XI–XII · Science PCMB','Class XI–XII · Commerce with Maths','Class XI–XII · Commerce without Maths','Class XI–XII · Arts / Humanities','Class XI–XII · Vocational','Diploma / Polytechnic','ITI / Trade training','Vocational / skill courses','Open schooling (NIOS etc.)','Scholarships & Financial Aid','Entrance Exams & Admissions','Non-technical options are included too: Commerce, Arts/Humanities, vocational and open schooling.','No entries match this pathway and stream. Try another choice or show all pathways.',"After Class 10, which field do you want to choose?","Choose a field","Medical / Healthcare / Pharmacy","Engineering / Technical","Commerce / Accounts / Finance","Arts / History / Humanities","Non-technical / Business / Hospitality","Agriculture / Veterinary","Other / Explore all fields","Diploma field / branch","All diploma fields","Technical / Engineering diploma","Medical / Pharmacy diploma","Automobile diploma","Computer / IT diploma","Electrical diploma","Mechanical diploma","Civil diploma","Non-technical diploma","Agriculture diploma","Other diploma","Science PCM — Engineering / Technical","Science PCB — Medical / NEET","Science PCMB — both options","Commerce with Maths — Accounts / Finance","Commerce without Maths — Business / Accounts","Arts / Humanities — BA / History","Your Class 12 stream","Use stream from my profile","Science PCM — Engineering / JEE","Science PCMB — Engineering and Medical","Commerce — B.Com / Accounts / Finance","Other / show common routes","Choose your field first. The matching course/admission records will be filtered below. Medical routes commonly require PCB/PCMB; engineering commonly requires PCM, but exact eligibility depends on the institution/course.","Results update according to your selected stream. Common cross-stream guides remain visible."];
  for (const code of Object.keys(EXTRA_LANGUAGE_TRANSLATIONS)) { for (const label of EXTRA_PATHWAY_LABELS) if (!EXTRA_LANGUAGE_TRANSLATIONS[code][label]) EXTRA_LANGUAGE_TRANSLATIONS[code][label]=label; }
  function t(value) { if (typeof value !== 'string') return value; return (UI_TRANSLATIONS[uiLanguage] && UI_TRANSLATIONS[uiLanguage][value]) || (EXTRA_LANGUAGE_TRANSLATIONS[uiLanguage] && EXTRA_LANGUAGE_TRANSLATIONS[uiLanguage][value]) || value; }
  function applyStaticTranslations() {
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())) {
      const parent=node.parentElement;
      if(!parent || parent.closest('script,style,select,option,input,textarea,.opportunity-grid,.detail-content,.source-link,.subsection-grid,.brand-icon,.art-paper,.art-chip')) continue;
      if(!originalTextNodes.has(node)) originalTextNodes.set(node,node.nodeValue);
      const original=originalTextNodes.get(node); const trimmed=original.trim();
      if(!trimmed) continue;
      const translated=t(trimmed);
      if(translated!==trimmed) node.nodeValue=original.replace(trimmed,translated);
      else if(node.nodeValue!==original) node.nodeValue=original;
    }
    document.querySelectorAll('option').forEach(opt=>{
      if(!opt.dataset.originalLabel) opt.dataset.originalLabel=opt.textContent;
      opt.textContent=t(opt.dataset.originalLabel);
    });
    document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(input=>{
      if(!input.dataset.originalPlaceholder) input.dataset.originalPlaceholder=input.placeholder;
      input.placeholder=t(input.dataset.originalPlaceholder);
    });
    document.documentElement.lang=uiLanguage;
  }
  function setLanguage(lang) {
    uiLanguage = ['en','hi','gu','bn','mr','ta','te','kn','ml','pa','ur','or','as'].includes(lang) ? lang : 'en';
    try { localStorage.setItem('opportunity-finder-language',uiLanguage); } catch(e) {}
    $('languageSelect').value=uiLanguage;
    // Re-render adaptive questions so generated field labels/options follow the selected UI language.
    renderAdaptiveFields(true);
    applyStaticTranslations();
    if(profile) {
      if(!$('categoriesStep').hidden) { $('welcomeHeading').textContent=uiLanguage==='hi'?`आप क्या देखना चाहेंगे, ${profile.name}?`:uiLanguage==='gu'?`તમે શું જોવા માંગો છો, ${profile.name}?`:`What would you like to explore, ${profile.name}?`; const pieces=[profile.name,profile.educationLevelLabel,profile.city,profile.district,profile.state].filter((x,i)=>x && !(i===1 && x==='Not specified')); $('profileSummaryChip').innerHTML=`<strong>Profile:</strong> ${pieces.map(esc).join(' · ')} <span>Activity: ${esc(niceActivity(profile.currentActivity))}</span>`; applyStaticTranslations(); }
      if(!$('educationProfileStep').hidden) { renderAdaptiveFields(true); updateEducationProfileContext(); applyStaticTranslations(); }
      if(!$('educationStep').hidden) { updateEducationSummary(); renderSubsections(); renderResults(); }
    }
  }
  let profile = null;
  let selectedSubsection = null;
  let toastTimer = null;
  let lastFocus = null;

  const LEVELS = {
    no_formal_education: 'No formal education',
    primary_1_5: 'Primary school · Class 1–5',
    middle_6_8: 'Middle school · Class 6–8',
    secondary_9_10: 'Secondary · Class 9–10',
    higher_secondary_11_12: 'Senior secondary · Class 11–12',
    diploma_polytechnic: 'Diploma / Polytechnic / ITI',
    bachelors_undergraduate: 'Bachelor’s / Undergraduate (UG)',
    masters_postgraduate: 'Master’s / Postgraduate (PG)',
    phd_doctoral: 'PhD / Doctoral / Research',
    other: 'Other qualification / equivalent'
  };
  const SUBSECTIONS = [
    { name: 'School Education', icon: '🏫', desc: 'Primary, middle, secondary and higher secondary opportunities.' },
    { name: 'Diploma & Polytechnic', icon: '🛠️', desc: 'Diploma, polytechnic, ITI and technical study routes.' },
    { name: 'Undergraduate (UG)', icon: '🎓', desc: 'Bachelor’s study, admission routes and undergraduate support.' },
    { name: 'Postgraduate (PG)', icon: '📘', desc: 'Master’s programmes and postgraduate scholarship candidates.' },
    { name: 'PhD & Research', icon: '🔬', desc: 'Doctoral research, research funding and related opportunities.' },
    { name: 'Entrance Exams & Admissions', icon: '📝', desc: 'Entrance examinations, counselling and admission routes.' },
    { name: 'Scholarships & Financial Aid', icon: '💰', desc: 'Scholarships and education-related financial assistance.' },
    { name: 'Fellowships & Academic Stipends', icon: '🌱', desc: 'Research fellowships, academic stipends and funding.' },
    { name: 'Skill & Vocational Learning', icon: '⚙️', desc: 'Skill courses, vocational training and learning programmes.' }
  ];

  const SUBSECTIONS_BY_LEVEL = {
    no_formal_education: ['School Education','Scholarships & Financial Aid','Skill & Vocational Learning'],
    primary_1_5: ['School Education','Scholarships & Financial Aid','Skill & Vocational Learning'],
    middle_6_8: ['School Education','Entrance Exams & Admissions','Scholarships & Financial Aid','Skill & Vocational Learning'],
    secondary_9_10: ['School Education','Diploma & Polytechnic','Entrance Exams & Admissions','Scholarships & Financial Aid','Skill & Vocational Learning'],
    higher_secondary_11_12: ['School Education','Diploma & Polytechnic','Undergraduate (UG)','Entrance Exams & Admissions','Scholarships & Financial Aid','Skill & Vocational Learning'],
    diploma_polytechnic: ['Diploma & Polytechnic','Undergraduate (UG)','Entrance Exams & Admissions','Scholarships & Financial Aid','Fellowships & Academic Stipends','Skill & Vocational Learning'],
    bachelors_undergraduate: ['Undergraduate (UG)','Postgraduate (PG)','Entrance Exams & Admissions','Scholarships & Financial Aid','Fellowships & Academic Stipends','Skill & Vocational Learning'],
    masters_postgraduate: ['Postgraduate (PG)','PhD & Research','Entrance Exams & Admissions','Scholarships & Financial Aid','Fellowships & Academic Stipends','Skill & Vocational Learning'],
    phd_doctoral: ['PhD & Research','Scholarships & Financial Aid','Fellowships & Academic Stipends','Skill & Vocational Learning'],
    other: ['School Education','Diploma & Polytechnic','Entrance Exams & Admissions','Scholarships & Financial Aid','Skill & Vocational Learning']
  };
  const STATES = [
    'Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chandigarh','Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir',
    'Jharkhand','Karnataka','Kerala','Ladakh','Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
    'Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'
  ];
  // Starter administrative directory, mapped by state/UT. If a new or renamed district is missing,
  // users can choose “Other / enter manually”; verify against an official directory before production.
  const DISTRICTS = {
    'Andaman and Nicobar Islands':['Nicobars','North and Middle Andaman','South Andaman'],
    'Andhra Pradesh':['Alluri Sitharama Raju','Anakapalli','Ananthapuramu','Annamayya','Bapatla','Chittoor','Dr. B.R. Ambedkar Konaseema','East Godavari','Eluru','Guntur','Kakinada','Krishna','Kurnool','Nandyal','NTR','Palnadu','Parvathipuram Manyam','Prakasam','Sri Potti Sriramulu Nellore','Sri Sathya Sai','Srikakulam','Tirupati','Visakhapatnam','Vizianagaram','West Godavari','YSR Kadapa'],
    'Arunachal Pradesh':['Anjaw','Changlang','Dibang Valley','East Kameng','East Siang','Itanagar Capital Complex','Kamle','Kra Daadi','Kurung Kumey','Lohit','Longding','Lower Dibang Valley','Lower Siang','Lower Subansiri','Namsai','Papum Pare','Tawang','Tirap','Upper Siang','Upper Subansiri','West Kameng','West Siang'],
    'Assam':['Bajali','Baksa','Barpeta','Biswanath','Bongaigaon','Cachar','Charaideo','Chirang','Darrang','Dhemaji','Dhubri','Dibrugarh','Dima Hasao','Goalpara','Golaghat','Hailakandi','Hojai','Jorhat','Kamrup','Kamrup Metropolitan','Karbi Anglong','Kokrajhar','Lakhimpur','Majuli','Morigaon','Nagaon','Nalbari','Sivasagar','Sonitpur','South Salmara-Mankachar','Sribhumi','Tamulpur','Tinsukia','Udalguri','West Karbi Anglong'],
    'Bihar':['Araria','Arwal','Aurangabad','Banka','Begusarai','Bhagalpur','Bhojpur','Buxar','Darbhanga','East Champaran','Gaya','Gopalganj','Jamui','Jehanabad','Kaimur','Katihar','Khagaria','Kishanganj','Lakhisarai','Madhepura','Madhubani','Munger','Muzaffarpur','Nalanda','Nawada','Patna','Purnia','Rohtas','Saharsa','Samastipur','Saran','Sheikhpura','Sheohar','Sitamarhi','Siwan','Supaul','Vaishali','West Champaran'],
    'Chandigarh':['Chandigarh'],
    'Chhattisgarh':['Balod','Baloda Bazar','Balrampur','Bastar','Bemetara','Bijapur','Bilaspur','Dantewada','Dhamtari','Durg','Gariaband','Gaurela-Pendra-Marwahi','Janjgir-Champa','Jashpur','Kabirdham','Kanker','Khairagarh-Chhuikhadan-Gandai','Kondagaon','Korba','Korea','Mahasamund','Manendragarh-Chirmiri-Bharatpur','Mohla-Manpur-Ambagarh Chowki','Mungeli','Narayanpur','Raigarh','Raipur','Rajnandgaon','Sakti','Sarangarh-Bilaigarh','Sukma','Surajpur','Surguja'],
    'Dadra and Nagar Haveli and Daman and Diu':['Dadra and Nagar Haveli','Daman','Diu'],
    'Delhi':['Central Delhi','East Delhi','New Delhi','North Delhi','North East Delhi','North West Delhi','Shahdara','South Delhi','South East Delhi','South West Delhi','West Delhi'],
    'Goa':['Kushavati','North Goa','South Goa'],
    'Gujarat':['Ahmedabad','Amreli','Anand','Aravalli','Banaskantha','Bharuch','Bhavnagar','Botad','Chhota Udaipur','Dahod','Dang','Devbhumi Dwarka','Gandhinagar','Gir Somnath','Jamnagar','Junagadh','Kachchh','Kheda','Mahisagar','Mehsana','Morbi','Narmada','Navsari','Panchmahal','Patan','Porbandar','Rajkot','Sabarkantha','Surat','Surendranagar','Tapi','Vadodara','Valsad','Vav-Tharad'],
    'Haryana':['Ambala','Bhiwani','Charkhi Dadri','Faridabad','Fatehabad','Gurugram','Hisar','Jhajjar','Jind','Kaithal','Karnal','Kurukshetra','Mahendragarh','Nuh','Palwal','Panchkula','Panipat','Rewari','Rohtak','Sirsa','Sonipat','Yamunanagar'],
    'Himachal Pradesh':['Bilaspur','Chamba','Hamirpur','Kangra','Kinnaur','Kullu','Lahaul and Spiti','Mandi','Shimla','Sirmaur','Solan','Una'],
    'Jammu and Kashmir':['Anantnag','Bandipora','Baramulla','Budgam','Doda','Ganderbal','Jammu','Kathua','Kishtwar','Kulgam','Kupwara','Poonch','Pulwama','Rajouri','Ramban','Reasi','Samba','Shopian','Srinagar','Udhampur'],
    'Jharkhand':['Bokaro','Chatra','Deoghar','Dhanbad','Dumka','East Singhbhum','Garhwa','Giridih','Godda','Gumla','Hazaribagh','Jamtara','Khunti','Koderma','Latehar','Lohardaga','Pakur','Palamu','Ramgarh','Ranchi','Sahebganj','Seraikela-Kharsawan','Simdega','West Singhbhum'],
    'Karnataka':['Bagalkot','Ballari','Belagavi','Bengaluru Rural','Bengaluru South','Bengaluru Urban','Bidar','Chamarajanagar','Chikkaballapura','Chikkamagaluru','Chitradurga','Dakshina Kannada','Davanagere','Dharwad','Gadag','Hassan','Haveri','Kalaburagi','Kodagu','Kolar','Koppal','Mandya','Mysuru','Raichur','Shivamogga','Tumakuru','Udupi','Uttara Kannada','Vijayanagara','Vijayapura','Yadgir'],
    'Kerala':['Alappuzha','Ernakulam','Idukki','Kannur','Kasaragod','Kollam','Kottayam','Kozhikode','Malappuram','Palakkad','Pathanamthitta','Thiruvananthapuram','Thrissur','Wayanad'],
    'Ladakh':['Kargil','Leh'],
    'Lakshadweep':['Lakshadweep'],
    'Madhya Pradesh':['Agar Malwa','Alirajpur','Anuppur','Ashoknagar','Balaghat','Barwani','Betul','Bhind','Bhopal','Burhanpur','Chhatarpur','Chhindwara','Damoh','Datia','Dewas','Dhar','Dindori','Guna','Gwalior','Harda','Indore','Jabalpur','Jhabua','Katni','Khandwa','Khargone','Maihar','Mandla','Mandsaur','Mauganj','Morena','Narmadapuram','Narsinghpur','Neemuch','Niwari','Pandhurna','Panna','Raisen','Rajgarh','Ratlam','Rewa','Sagar','Satna','Sehore','Seoni','Shahdol','Shajapur','Sheopur','Shivpuri','Sidhi','Singrauli','Tikamgarh','Ujjain','Umaria','Vidisha'],
    'Maharashtra':['Ahilyanagar','Akola','Amravati','Beed','Bhandara','Buldhana','Chandrapur','Chhatrapati Sambhajinagar','Dharashiv','Dhule','Gadchiroli','Gondia','Hingoli','Jalgaon','Jalna','Kolhapur','Latur','Mumbai City','Mumbai Suburban','Nagpur','Nanded','Nandurbar','Nashik','Palghar','Parbhani','Pune','Raigad','Ratnagiri','Sangli','Satara','Sindhudurg','Solapur','Thane','Wardha','Washim','Yavatmal'],
    'Manipur':['Bishnupur','Chandel','Churachandpur','Imphal East','Imphal West','Jiribam','Kakching','Kamjong','Kangpokpi','Noney','Pherzawl','Senapati','Tamenglong','Tengnoupal','Thoubal','Ukhrul'],
    'Meghalaya':['East Garo Hills','East Jaintia Hills','East Khasi Hills','Eastern West Khasi Hills','North Garo Hills','Ri Bhoi','South Garo Hills','South West Garo Hills','South West Khasi Hills','West Garo Hills','West Jaintia Hills','West Khasi Hills'],
    'Mizoram':['Aizawl','Champhai','Hnahthial','Khawzawl','Kolasib','Lawngtlai','Lunglei','Mamit','Saiha','Saitual','Serchhip'],
    'Nagaland':['Chumoukedima','Dimapur','Kiphire','Kohima','Longleng','Meluri','Mokokchung','Mon','Niuland','Noklak','Peren','Phek','Shamator','Tseminyu','Tuensang','Wokha','Zunheboto'],
    'Odisha':['Angul','Balangir','Balasore','Bargarh','Bhadrak','Boudh','Cuttack','Deogarh','Dhenkanal','Gajapati','Ganjam','Jagatsinghpur','Jajpur','Jharsuguda','Kalahandi','Kandhamal','Kendrapara','Keonjhar','Khurda','Koraput','Malkangiri','Mayurbhanj','Nabarangpur','Nayagarh','Nuapada','Puri','Rayagada','Sambalpur','Subarnapur','Sundargarh'],
    'Puducherry':['Karaikal','Mahe','Puducherry','Yanam'],
    'Punjab':['Amritsar','Barnala','Bathinda','Faridkot','Fatehgarh Sahib','Fazilka','Ferozepur','Gurdaspur','Hoshiarpur','Jalandhar','Kapurthala','Ludhiana','Malerkotla','Mansa','Moga','Pathankot','Patiala','Rupnagar','S.A.S. Nagar','Sangrur','Shaheed Bhagat Singh Nagar','Sri Muktsar Sahib','Tarn Taran'],
    'Rajasthan':['Ajmer','Alwar','Anupgarh','Balotra','Banswara','Baran','Barmer','Beawar','Bharatpur','Bhilwara','Bikaner','Bundi','Chittorgarh','Churu','Dausa','Deeg','Dholpur','Didwana-Kuchaman','Dudu','Dungarpur','Gangapur City','Hanumangarh','Jaipur','Jaipur Rural','Jaisalmer','Jalore','Jhalawar','Jhunjhunu','Jodhpur','Jodhpur Rural','Karauli','Khairthal-Tijara','Kota','Kotputli-Behror','Nagaur','Pali','Phalodi','Pratapgarh','Rajsamand','Salumbar','Sanchore','Sawai Madhopur','Shahpura','Sikar','Sirohi','Sri Ganganagar','Tonk','Udaipur'],
    'Sikkim':['Gangtok','Gyalshing','Mangan','Namchi','Pakyong','Soreng'],
    'Tamil Nadu':['Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kallakurichi','Kancheepuram','Kanniyakumari','Karur','Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai','Ramanathapuram','Ranipet','Salem','Sivaganga','Tenkasi','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tirupathur','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar'],
    'Telangana':['Adilabad','Bhadradri Kothagudem','Hanamkonda','Hyderabad','Jagtial','Jangaon','Jayashankar Bhupalpally','Jogulamba Gadwal','Kamareddy','Karimnagar','Khammam','Kumuram Bheem Asifabad','Mahabubabad','Mahabubnagar','Mancherial','Medak','Medchal-Malkajgiri','Mulugu','Nagarkurnool','Nalgonda','Narayanpet','Nirmal','Nizamabad','Peddapalli','Rajanna Sircilla','Rangareddy','Sangareddy','Siddipet','Suryapet','Vikarabad','Wanaparthy','Warangal','Yadadri Bhuvanagiri'],
    'Tripura':['Dhalai','Gomati','Khowai','North Tripura','Sepahijala','South Tripura','Unakoti','West Tripura'],
    'Uttar Pradesh':['Agra','Aligarh','Ambedkar Nagar','Amethi','Amroha','Auraiya','Ayodhya','Azamgarh','Badaun','Baghpat','Bahraich','Ballia','Balrampur','Banda','Barabanki','Bareilly','Basti','Bhadohi','Bijnor','Bulandshahr','Chandauli','Chitrakoot','Deoria','Etah','Etawah','Farrukhabad','Fatehpur','Firozabad','Gautam Buddha Nagar','Ghaziabad','Ghazipur','Gonda','Gorakhpur','Hamirpur','Hapur','Hardoi','Hathras','Jalaun','Jaunpur','Jhansi','Kannauj','Kanpur Dehat','Kanpur Nagar','Kasganj','Kaushambi','Kushinagar','Lakhimpur Kheri','Lalitpur','Lucknow','Maharajganj','Mahoba','Mainpuri','Mathura','Mau','Meerut','Mirzapur','Moradabad','Muzaffarnagar','Pilibhit','Pratapgarh','Prayagraj','Rae Bareli','Rampur','Saharanpur','Sambhal','Sant Kabir Nagar','Shahjahanpur','Shamli','Shravasti','Siddharthnagar','Sitapur','Sonbhadra','Sultanpur','Unnao','Varanasi'],
    'Uttarakhand':['Almora','Bageshwar','Chamoli','Champawat','Dehradun','Haridwar','Nainital','Pauri Garhwal','Pithoragarh','Rudraprayag','Tehri Garhwal','Udham Singh Nagar','Uttarkashi'],
    'West Bengal':['Alipurduar','Bankura','Birbhum','Cooch Behar','Dakshin Dinajpur','Darjeeling','Hooghly','Howrah','Jalpaiguri','Jhargram','Kalimpong','Kolkata','Malda','Murshidabad','Nadia','North 24 Parganas','Paschim Bardhaman','Paschim Medinipur','Purba Bardhaman','Purba Medinipur','Purulia','South 24 Parganas','Uttar Dinajpur']
  };
  const CITY_SUGGESTIONS = {
    'Gujarat|Ahmedabad':['Ahmedabad','Sanand','Dholka','Bavla','Daskroi','Dhandhuka','Detroj-Rampura','Mandal','Viramgam'],
    'Gujarat|Surat':['Surat','Bardoli','Mandvi','Olpad','Kamrej','Palsana'],
    'Gujarat|Vadodara':['Vadodara','Dabhoi','Padra','Savli','Karjan'],
    'Gujarat|Rajkot':['Rajkot','Gondal','Jetpur','Dhoraji','Upleta'],
    'Maharashtra|Pune':['Pune','Pimpri-Chinchwad','Baramati','Daund','Junnar'],
    'Maharashtra|Mumbai City':['Mumbai'], 'Maharashtra|Mumbai Suburban':['Andheri','Bandra','Borivali','Kurla'],
    'Rajasthan|Jaipur':['Jaipur','Amer','Sanganer','Chomu','Phulera'],
    'Delhi|New Delhi':['New Delhi','Connaught Place','Chanakyapuri'],
    'Karnataka|Bengaluru Urban':['Bengaluru','Yelahanka','Anekal','Bengaluru North'],
    'Tamil Nadu|Chennai':['Chennai','Ambattur','Tambaram','Avadi'],
    'Uttar Pradesh|Lucknow':['Lucknow','Malihabad','Mohanlalganj'],
    'West Bengal|Kolkata':['Kolkata']
  };

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const fmtDate = (value) => {
    if (!value) return 'Deadline unknown';
    const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
  };
  const ageFromDob = (dob) => {
    if (!dob) return null;
    const birth = new Date(`${dob}T00:00:00`);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 0 ? age : null;
  };
  function showToast(message) {
    const toast = $('toast'); toast.textContent = message; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }
  function setProgress(step) {
    document.querySelectorAll('[data-progress]').forEach(el => {
      const n = Number(el.dataset.progress); el.classList.toggle('active',n===step); el.classList.toggle('done',n<step);
    });
  }
  function goTo(step) {
    $('profileStep').hidden = step !== 1; $('categoriesStep').hidden = step !== 2; $('educationProfileStep').hidden = step !== 3; $('educationStep').hidden = step !== 4; $('jobsCareerStep').hidden = true;
    setProgress(step); window.scrollTo({top:0,behavior:'smooth'});
  }
  function fillStates() {
    const state = $('state');
    STATES.forEach(s => { const opt=document.createElement('option'); opt.value=s; opt.textContent=s; state.appendChild(opt); });
  }
  function populateDistricts(stateName, selected = '') {
    const select = $('district'); select.innerHTML = '';
    if (!stateName || !DISTRICTS[stateName]) {
      select.disabled = true; select.add(new Option(stateName ? 'District list unavailable — enter manually' : 'Select state first','')); return;
    }
    select.disabled = false; select.add(new Option('Select district (optional)',''));
    (DISTRICTS[stateName]||[]).slice().sort((a,b)=>a.localeCompare(b)).forEach(d=>select.add(new Option(d,d)));
    select.add(new Option('Other / enter manually','__other__'));
    if (selected) select.value = selected;
    $('otherDistrictField').classList.toggle('hidden',select.value !== '__other__');
    updateCitySuggestions();
    $('districtHint').textContent = `${(DISTRICTS[stateName]||[]).length} starter district options for ${stateName}. If yours is missing, choose “Other / enter manually”.`;
  }
  function updateCitySuggestions() {
    const dataList=$('citySuggestions'); dataList.innerHTML='';
    const state=$('state').value; const district=$('district').value;
    const options = CITY_SUGGESTIONS[`${state}|${district}`] || (district && district !== '__other__' ? [district] : []);
    [...new Set(options)].forEach(city=>dataList.appendChild(new Option(city,city)));
  }
  function countryChanged() {
    const india = $('country').value === 'India';
    $('stateField').classList.toggle('hidden',!india);
    $('districtField').classList.toggle('hidden',!india);
    $('otherDistrictField').classList.add('hidden');
    $('state').disabled = !india; $('district').disabled = !india || !$('state').value;
    $('cityField').classList.toggle('span-2',!india);
    if (!india) { $('state').value=''; $('district').innerHTML='<option value="">Not needed for other country</option>'; $('citySuggestions').innerHTML=''; }
    else if ($('state').value) populateDistricts($('state').value);
  }
  function field(label, name, type='text', opts={}) {
    const id = `extra_${name}`;
    const required = opts.required ? ' required' : '';
    const hint = opts.hint ? `<small>${esc(opts.hint)}</small>` : '';
    let control = '';
    if (type === 'select') {
      const options = (opts.options||[]).map(o => typeof o === 'string' ? {value:o,label:o} : o);
      control = `<select id="${id}" name="${esc(name)}"><option value="">${esc(opts.placeholder||'Select if applicable')}</option>${options.map(o=>`<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('')}</select>`;
    } else if (type === 'textarea') {
      control = `<textarea id="${id}" name="${esc(name)}" rows="2" maxlength="400" placeholder="${esc(opts.placeholder||'Optional')}"></textarea>`;
    } else {
      const attrs = type === 'number' ? ` min="${opts.min||1950}" max="${opts.max||2100}"` : '';
      control = `<input id="${id}" name="${esc(name)}" type="${type}" maxlength="${opts.maxlength||160}"${attrs} placeholder="${esc(opts.placeholder||'Optional')}">`;
    }
    return `<label class="field ${opts.span2?'span-2':''}"><span>${esc(label)}${required?' <b>*</b>':''}</span>${control}${hint}</label>`;
  }
  function currentStatusField() {
    return field('Study status','studyStatus','select',{options:[{value:'studying',label:'Currently studying'},{value:'completed',label:'Completed this level'},{value:'planning',label:'Planning to enrol / continue'},{value:'paused',label:'Not currently studying'}]});
  }
  function yearField(label='Expected / completed year') {
    return field(label,'completionYear','number',{min:1950,max:2100,placeholder:'e.g. 2027'});
  }
  function marksField() { return field('Marks / percentage / GPA','marks','text',{placeholder:'e.g. 78% or CGPA 8.2',hint:'Optional profile detail. Scheme-specific cut-offs are not evaluated yet.'}); }
  function institutionFields() {
    return field('School / college / institution','institution') + field('Board / university / awarding body','awardingBody');
  }
  function adaptiveFields(level) {
    const common = currentStatusField();
    const schoolClass = (values) => field('Current class / last class completed','classGrade','select',{options:values}) + field('School board','schoolBoard','select',{options:['CBSE','CISCE / ICSE / ISC','Gujarat State Board','RBSE / Rajasthan Board','State board — other','NIOS','Other / not sure']}) + marksField() + yearField();
    let title='', desc='', fields='';
    switch(level) {
      case 'no_formal_education':
        title='Learning interests'; desc='We will use these to surface learning and training options—not to assume formal qualifications.';
        fields = field('What would you like to learn?','learningInterest','select',{options:['Basic literacy / numeracy','School-level education / equivalency','Digital / computer skills','Technical / vocational skills','Professional certification','Not sure yet']}) + field('Preferred learning mode','learningMode','select',{options:['In person','Online','Hybrid','Any mode']}) + field('Preferred language for learning','learningLanguage','select',{options:['Hindi','English','Gujarati','Other / multiple']}) + field('Your goal','educationGoal','textarea',{span2:true,placeholder:'Tell us what you would like to do next'});
        break;
      case 'primary_1_5':
        title='Primary school details'; desc='Only primary-level questions are shown. Class and marks remain optional.';
        fields = field('Current class','classGrade','select',{options:['Class 1','Class 2','Class 3','Class 4','Class 5']}) + currentStatusField() + field('School board','schoolBoard','select',{options:['CBSE','CISCE','Gujarat State Board','RBSE / Rajasthan Board','Other state board','NIOS','Other / not sure']}) + marksField() + yearField('Expected / completed year') + field('Next learning goal','educationGoal','select',{options:['Continue to next school class','Class 6 admission / school selection test','School transfer / admission','Scholarships / education support','Not decided yet']});
        break;
      case 'middle_6_8':
        title='Middle school details'; desc='Fields are tailored to Classes 6–8.';
        fields = field('Current class','classGrade','select',{options:['Class 6','Class 7','Class 8']}) + currentStatusField() + field('School board','schoolBoard','select',{options:['CBSE','CISCE','Gujarat State Board','RBSE / Rajasthan Board','Other state board','NIOS','Other / not sure']}) + marksField() + yearField() + field('Next learning goal','educationGoal','select',{options:['Continue to next school class','Class 9 admission / school selection test','NMMSS / school scholarship (if eligible)','Academic competitions / Olympiads','Skill / vocational learning','Not decided yet']});
        break;
      case 'secondary_9_10':
        title='Class 9–10 details'; desc='Class, board, results and completion year can help narrow school-level options.';
        fields = field('Current / last class','classGrade','select',{options:['Class 9','Class 10','Completed Class 10']}) + currentStatusField() + field('Were you selected for NMMSS through the Class VIII test?','nmmssStatus','select',{options:[{value:'yes',label:'Yes — I am checking renewal'}, {value:'no',label:'No'}, {value:'unknown',label:'Not sure'}]}) + field('School board','schoolBoard','select',{options:['CBSE','CISCE / ICSE','Gujarat State Board','RBSE / Rajasthan Board','Other state board','NIOS','Other / not sure']}) + marksField() + yearField() + field('Interested in next','educationGoal','select',{options:['Class 11–12','Diploma / Polytechnic','ITI / vocational training','Entrance exam preparation','Not sure yet']});
        break;
      case 'higher_secondary_11_12':
        title='Class 11–12 details'; desc='Stream and current class are asked because some opportunities are course-specific.';
        fields = field('Current / last class','classGrade','select',{options:['Class 11','Class 12','Completed Class 12']}) + field('Stream','stream','select',{options:['Science — PCM','Science — PCB','Science — PCMB','Commerce','Arts / Humanities','Vocational','Other']}) + currentStatusField() + field('Were you selected for NMMSS through the Class VIII test?','nmmssStatus','select',{options:[{value:'yes',label:'Yes — I am checking renewal'}, {value:'no',label:'No'}, {value:'unknown',label:'Not sure'}]}) + field('School board','schoolBoard','select',{options:['CBSE','CISCE / ISC','Gujarat State Board','RBSE / Rajasthan Board','Other state board','NIOS','Other / not sure']}) + marksField() + yearField() + field('Next goal','educationGoal','select',{options:['Bachelor’s degree','Diploma / Polytechnic','ITI / vocational training','Entrance exam / admission','Scholarship / financial aid','Not decided yet']});
        break;
      case 'diploma_polytechnic':
        title='Diploma / Polytechnic / ITI details'; desc='We ask about the trade/course, stage and previous qualification.';
        fields = field('Qualification type','qualificationType','select',{options:['Diploma','Polytechnic diploma','ITI / trade certificate','Vocational certificate','Other technical qualification']}) + field('Branch / trade','specialization','text',{placeholder:'e.g. Electrical, Mechanical, Computer'} ) + field('Current year / semester','studyYear','select',{options:['First year','Second year','Third year','Fourth year','Semester 1','Semester 2','Semester 3','Semester 4','Semester 5','Semester 6','Completed']}) + common + field('Previous qualification','previousQualification','select',{options:['Class 8','Class 10','Class 12','Bachelor’s degree','Other']}) + institutionFields() + marksField() + yearField() + field('Next goal','educationGoal','textarea',{span2:true});
        break;
      case 'bachelors_undergraduate':
        title='Bachelor’s / UG details'; desc='Bachelor’s-specific fields are shown. We do not ask unrelated school or PhD details here.';
        fields = field('Degree / course','degree','select',{options:['BA','BSc','BCom','BTech / BE','BBA','BCA','LLB','BPharm','BDes','MBBS / medical degree','BSc Nursing','Other bachelor’s degree']}) + field('Branch / major / specialization','specialization','text',{placeholder:'e.g. Information Technology, Physics, Nursing'}) + field('Current year / semester','studyYear','select',{options:['Year 1','Year 2','Year 3','Year 4','Year 5','Year 6','Semester 1','Semester 2','Semester 3','Semester 4','Semester 5','Semester 6','Semester 7','Semester 8','Completed']}) + common + field('Previous qualification','previousQualification','select',{options:['Class 12','Diploma / Polytechnic','Other equivalent qualification']}) + institutionFields() + marksField() + yearField() + field('Next goal','educationGoal','select',{options:['Find scholarship / financial aid','Apply for higher studies (PG)','Find entrance exams / admissions','Research / fellowship','Learn a new skill','Explore all education options']});
        break;
      case 'masters_postgraduate':
        title='Master’s / PG details'; desc='Course, specialization, prior degree and current study stage are used for discovery.';
        fields = field('Master’s degree / course','degree','select',{options:['MA','MSc','MCom','MTech / ME','MBA','MCA','LLM','MPharm','MEd','MSc Nursing','Other master’s degree']}) + field('Specialization / subject','specialization','text',{placeholder:'e.g. Computer Science, Economics'}) + field('Current year / semester','studyYear','select',{options:['Year 1','Year 2','Year 3','Semester 1','Semester 2','Semester 3','Semester 4','Completed']}) + common + field('Previous degree','previousQualification','select',{options:['BA','BSc','BCom','BTech / BE','BBA / BCA','MBBS / professional degree','Other bachelor’s degree']}) + institutionFields() + marksField() + yearField() + field('Next goal','educationGoal','select',{options:['Scholarship / financial aid','PhD / research','Entrance exam / admission','Professional certification','Explore all education options']});
        break;
      case 'phd_doctoral':
        title='PhD / Research details'; desc='The form focuses on research area, prior degree, institution and funding goals.';
        fields = field('Research / doctoral stage','researchStage','select',{options:['Planning to apply','Entrance / admission stage','Currently enrolled — coursework','Currently researching','Thesis / dissertation stage','Completed PhD / doctorate','Post-doctoral researcher']}) + field('Research field / subject','researchField','text',{placeholder:'e.g. AI, Biology, Agriculture, Energy'}) + field('Previous highest degree','previousQualification','select',{options:['Master’s degree','Integrated master’s','Professional degree','Other']}) + common + institutionFields() + field('Funding / next goal','educationGoal','select',{options:['PhD admission','Research fellowship','Research project funding','Conference / research support','Postdoctoral opportunity','Not sure yet']}) + yearField('Expected / completed year');
        break;
      case 'other':
        title='Other qualification details'; desc='Describe your qualification in your own words so we can still help you browse.';
        fields = field('Qualification name / level','otherQualification','text',{placeholder:'Enter qualification'}) + field('Subject / specialization','specialization') + common + institutionFields() + marksField() + yearField() + field('What would you like to explore?','educationGoal','textarea',{span2:true});
        break;
      default:
        return `<div class="adaptive-placeholder"><span class="placeholder-spark">✦</span><div><strong>Your form adapts to you</strong><p>Select an education level above to see only the relevant follow-up questions. You can leave them blank and continue.</p></div></div>`;
    }
    return `<div class="adaptive-panel"><div class="adaptive-heading"><span class="spark">✦</span><div><h4>${esc(title)}</h4><p>${esc(desc)}</p></div></div><div class="adaptive-fields">${fields}</div></div>`;
  }
  function renderAdaptiveFields(preserve=true) {
    const old = preserve ? collectAdaptiveFields() : {};
    const level=$('educationLevel').value;
    $('adaptiveEducationFields').innerHTML=adaptiveFields(level);
    Object.entries(old).forEach(([k,v])=>{const node=$('adaptiveEducationFields').querySelector(`[name="${CSS.escape(k)}"]`);if(node)node.value=v;});
  }
  function collectAdaptiveFields() {
    const data={}; $('adaptiveEducationFields').querySelectorAll('[name]').forEach(node=>{data[node.name]=node.value;}); return data;
  }
  function collectProfile() {
    const level=$('educationLevel').value;
    const district=$('district').value==='__other__' ? $('otherDistrict').value.trim() : $('district').value;
    return {
      name:$('fullName').value.trim(), dob:$('dob').value, country:$('country').value,
      currentActivity:$('currentActivity').value, state:$('state').value, district, city:$('city').value.trim(),
      educationLevel:level, educationLevelLabel:LEVELS[level]||'Not specified', extra:collectAdaptiveFields()
    };
  }
  function applyProfile(p) {
    if (!p) return;
    $('fullName').value=p.name||''; $('dob').value=p.dob||''; $('country').value=p.country||'India';
    $('currentActivity').value=p.currentActivity||''; $('state').value=p.state||'';
    countryChanged();
    if (p.state) populateDistricts(p.state, p.district && (DISTRICTS[p.state]||[]).includes(p.district) ? p.district : (p.district ? '__other__' : ''));
    if (p.district && $('district').value==='__other__') $('otherDistrict').value=p.district;
    $('city').value=p.city||''; $('educationLevel').value=p.educationLevel||''; if($('careerGoalInput')) $('careerGoalInput').value=p.goal||''; if($('roadmapEducationLevel')) $('roadmapEducationLevel').value=p.educationLevel||''; if($('roadmapStream')) $('roadmapStream').value=p.goalStream||''; renderAdaptiveFields(false); $('educationLevel').dataset.lastSelectedLevel=p.educationLevel||'';
    if (p.extra) Object.entries(p.extra).forEach(([k,v])=>{const node=$('adaptiveEducationFields').querySelector(`[name="${CSS.escape(k)}"]`);if(node)node.value=v;});
  }
  function saveProfile(p) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
    catch (e) { showToast('Browser could not save the profile. You can still use this session.'); }
  }
  function niceActivity(code) {
    const values={school_student:'School student',diploma_student:'Diploma / ITI student',college_student:'College / university student',researcher:'Research scholar / PhD student',completed_studies:'Completed my studies',job_seeker:'Looking for a job',learning:'Looking to learn a new skill',other:'Other / prefer not to say'};
    return values[code]||'Not specified';
  }
  function enterCategories() {
    const savedGoal = (profile && profile.goal) || ($('careerGoalInput') && $('careerGoalInput').value.trim()) || '';
    const savedGoalStream = (profile && profile.goalStream) || ($('roadmapStream') && $('roadmapStream').value) || '';
    profile=collectProfile();
    if(savedGoal) profile.goal=savedGoal;
    if(savedGoalStream) profile.goalStream=savedGoalStream;
    saveProfile(profile);
    const pieces=[profile.name,profile.educationLevelLabel,profile.city,profile.district,profile.state].filter((x,i)=>x && !(i===1 && x==='Not specified'));
    $('profileSummaryChip').innerHTML=`<strong>Profile:</strong> ${pieces.map(esc).join(' · ')} <span>Activity: ${esc(niceActivity(profile.currentActivity))}</span>`;
    $('welcomeHeading').textContent=uiLanguage==='hi'?`आप क्या देखना चाहेंगे, ${profile.name}?`:uiLanguage==='gu'?`તમે શું જોવા માંગો છો, ${profile.name}?`:`What would you like to explore, ${profile.name}?`;
    goTo(2); applyStaticTranslations();
  }
  function updateEducationSummary() {
    const targetLabel=profileTargetLevel() ? t(LEVELS[profileTargetLevel()]) : '';
    $('educationPersonalizedIntro').textContent=profile.educationLevel ? (uiLanguage==='hi'?`${t(LEVELS[profile.educationLevel])}${targetLabel?' · अगला लक्ष्य: '+targetLabel:''} के अनुसार विकल्प दिख रहे हैं। भविष्य के विकल्प को अभी की पात्रता न समझें; हर scheme की शर्तें official source से जाँचें।`:uiLanguage==='gu'?`${t(LEVELS[profile.educationLevel])}${targetLabel?' · આગળનું લક્ષ્ય: '+targetLabel:''} પ્રમાણે વિકલ્પો બતાવાય છે. આગળના તબક્કાની માહિતી વર્તમાન પાત્રતાની પુષ્ટિ નથી.`:`Showing options for ${t(LEVELS[profile.educationLevel])}${targetLabel?' · next goal: '+targetLabel:''}. Next-step information is not current eligibility; check each scheme’s official rules.`) : (uiLanguage==='hi'?'आपने शिक्षा स्तर नहीं चुना है। आप पूरी सूची ब्राउज़ कर सकते हैं या वापस जाकर प्रोफ़ाइल पूरी कर सकते हैं।':uiLanguage==='gu'?'તમે શિક્ષણ સ્તર પસંદ કર્યું નથી. સંપૂર્ણ યાદી જુઓ અથવા પાછા જઈ પ્રોફાઇલ ભરો.':'You have not selected an education level yet. You can browse the catalogue, or go back and add your details for more relevant results.');
    const label=profile.educationLevel ? t(LEVELS[profile.educationLevel]) : t('Education level not specified');
    $('levelSummaryBanner').innerHTML=`<div><strong>${esc(label)}</strong><p>${esc([profile.state,profile.district,profile.city].filter(Boolean).join(' · ')||t('Location not provided'))} · ${esc(t(niceActivity(profile.currentActivity)))}</p></div><span class="banner-tag">${profile.educationLevel?(uiLanguage==='hi'?'प्रोफ़ाइल के अनुसार':uiLanguage==='gu'?'પ્રોફાઇલ પ્રમાણે':'PROFILE-BASED BROWSING'):(uiLanguage==='hi'?'ब्राउज़ मोड':uiLanguage==='gu'?'બ્રાઉઝ મોડ':'BROWSE MODE')}</span>`;
  }
  function updateEducationProfileContext() {
    const label = profile && profile.educationLevel ? t(LEVELS[profile.educationLevel]) : t('Education level not specified');
    const where = profile ? [profile.state, profile.district, profile.city].filter(Boolean).join(' · ') : '';
    $('educationProfileContext').innerHTML = `<strong>${esc(profile?.name || '')}</strong> · ${esc(label)}${where ? ` · ${esc(where)}` : ''}`;
    if (!profile || !profile.educationLevel) {
      $('educationSpecificTitle').textContent = t('Choose an education level or browse all');
      $('educationSpecificSubtitle').textContent = t('You can go back to select a level, or continue without it to browse all records.');
    } else {
      $('educationSpecificTitle').textContent = t(LEVELS[profile.educationLevel]);
      $('educationSpecificSubtitle').textContent = t('Only matching follow-up questions are shown. All details are optional.');
    }
  }
  function openEducation() {
    profile=collectProfile(); saveProfile(profile); selectedSubsection=null;
    renderAdaptiveFields(true);
    updateEducationProfileContext();
    goTo(3); applyStaticTranslations();
  }
  function openEducationDiscovery() {
    profile=collectProfile(); saveProfile(profile);
    updateEducationSummary(); renderSubsections(); resetFilters(); renderInstitutionFinder(); renderPathwayGuide();
    goTo(4); applyStaticTranslations();
  }
  function recordStatus(r) { return r.application_status || 'Deadline Unknown'; }
  function sectionRecords(section) { return records.filter(r=>Array.isArray(r.subcategories)&&r.subcategories.includes(section)); }
  function profileExtra(){ return (profile && profile.extra) || {}; }
  function normalizeText(v){ return String(v||'').toLowerCase().replace(/[’']/g,'').replace(/\s+/g,' ').trim(); }
  function classNumber(){
    const value = String(profileExtra().classGrade||'');
    const m = value.match(/class\s*(\d+)/i);
    return m ? Number(m[1]) : (value.includes('Completed Class 10') ? 10 : value.includes('Completed Class 12') ? 12 : null);
  }
  function isLevelCompleted(){
    const e=profileExtra();
    const grade=String(e.classGrade||'');
    const research=String(e.researchStage||'');
    // Explicit completed class/degree fields win; an explicit current study status prevents inference from the broad activity field.
    if (/completed class\s*(10|12)/i.test(grade) || e.studyYear==='Completed' || /completed phd|postdoctoral researcher/i.test(research)) return true;
    if (e.studyStatus==='completed') return true;
    if (e.studyStatus==='studying' || e.studyStatus==='planning' || e.studyStatus==='paused') return false;
    return profile?.currentActivity==='completed_studies';
  }
  function completedBachelor(){ return profile?.educationLevel==='bachelors_undergraduate' && isLevelCompleted(); }
  function undergraduateYear(){
    const v=String(profileExtra().studyYear||'');
    if(v==='Completed') return 99;
    const y=v.match(/year\s*(\d+)/i); if(y) return Number(y[1]);
    const sem=v.match(/semester\s*(\d+)/i); if(sem) return Math.ceil(Number(sem[1])/2);
    return null;
  }
  function educationGoalText(){ return normalizeText(profileExtra().educationGoal); }
  function profileTargetLevel(){
    const level=profile?.educationLevel, goal=educationGoalText();
    if(level==='secondary_9_10'){
      if(/class 11|11 12|higher secondary|intermediate/.test(goal)) return 'higher_secondary_11_12';
      if(/diploma|polytechnic|iti|vocational/.test(goal)) return 'diploma_polytechnic';
    }
    if(level==='higher_secondary_11_12' && /bachelor|undergraduate|ug degree/.test(goal)) return 'bachelors_undergraduate';
    if(level==='diploma_polytechnic' && /bachelor|degree|lateral entry/.test(goal)) return 'bachelors_undergraduate';
    if(level==='bachelors_undergraduate' && /higher studies|postgraduate|\bpg\b|masters|master/.test(goal)) return 'masters_postgraduate';
    if(level==='masters_postgraduate' && /phd|research|doctoral/.test(goal)) return 'phd_doctoral';
    if(level==='phd_doctoral' && /postdoctoral|post doctoral/.test(goal)) return 'phd_doctoral';
    return null;
  }
  function gateAcademicStageEligible(){
    const level=profile?.educationLevel;
    if(level==='bachelors_undergraduate'){
      const year=undergraduateYear();
      return isLevelCompleted() || (year!==null && year>=3);
    }
    // GATE's current brochure permits candidates pursuing or holding a higher degree too; we do not surface it by default for PhD/fellowship-focused profiles.
    return level==='masters_postgraduate' || level==='phd_doctoral';
  }
  function isGateEligibleByProfile(){
    if(!gateAcademicStageEligible()) return false;
    const level=profile?.educationLevel;
    const e=profileExtra();
    const goal=educationGoalText();
    const context=normalizeText([e.degree,e.specialization,e.previousQualification,e.educationGoal].filter(Boolean).join(' '));
    const gateRelevant=/gate|mtech|m\.tech|engineering|technology|information technology|\bit\b|computer|electronics|electrical|mechanical|civil|science|mathematics|physics|chemistry|statistics|architecture|biotechnology|pharmacy|agriculture|forestry|horticulture/.test(context);
    if(level==='bachelors_undergraduate'){
      // A completed B.E./B.Tech. applying for PG should see GATE; other graduates see it when PG/entrance/GATE is their stated route.
      return gateRelevant || profileTargetLevel()==='masters_postgraduate' || /entrance|exam|higher studies|postgraduate|\bpg\b|masters|master/.test(goal);
    }
    // For a current PG/PhD student, GATE is only surfaced when it is explicitly relevant to the chosen target/paper—not as a default PhD/fellowship requirement.
    return /\bgate\b|mtech|m\.tech|engineering entrance|gate paper/.test(goal);
  }
  function recordHardGate(r){
    const id=String(r.id||'');
    const e=profileExtra();
    const level=profile?.educationLevel;
    const grade=classNumber();
    const stream=String(e.stream||'');
    const goal=educationGoalText();
    if(id==='EDU-EXM-0007') return isGateEligibleByProfile();
    if(id==='EDU-EXM-0008' || id==='EDU-EXM-0009') return level==='primary_1_5' && grade===5;
    if(id==='EDU-EXM-0010') return level==='middle_6_8' && grade===8;
    // UGC-NET/JRF and the general UGC-JRF fellowship are postgraduate/research routes, not next-step options for a Class XII or bachelor-only profile.
    if(id==='EDU-EXM-0006' || id==='EDU-FEL-0005') return level==='masters_postgraduate' || level==='phd_doctoral';
    // These are closed 2026 undergraduate admission/exam cycles. Show only to the relevant Class XII stage; Class XI gets preparation guidance, not an apply-now claim.
    if(['EDU-EXM-0001','EDU-EXM-0002','EDU-EXM-0003','EDU-EXM-0004'].includes(id)){
      if(level!=='higher_secondary_11_12' || !(grade===12 || String(e.classGrade||'').includes('Completed Class 12'))) return false;
      if(id==='EDU-EXM-0001' && !['Science — PCM','Science — PCMB'].includes(stream)) return false;
      if(id==='EDU-EXM-0002' && !['Science — PCB','Science — PCMB'].includes(stream)) return false;
      if(id==='EDU-EXM-0004' && !['Science — PCM','Science — PCMB'].includes(stream)) return false;
      return true;
    }
    // NMMSS is selected through the Class VIII process. Later classes should see this record only as a continuation/renewal when prior selection is confirmed.
    if(id==='EDU-SCH-0001'){
      if(level==='middle_6_8' && grade===8 && e.studyStatus!=='completed') return true;
      if((level==='secondary_9_10' || level==='higher_secondary_11_12') && e.nmmssStatus==='yes') return true;
      return false;
    }
    // Subject-specific agriculture records must not be suggested to unrelated profiles.
    const title=String(r.title||'');
    const agricultureOnly=/\bICAR\b|agriculture|horticulture|forestry/i.test(title);
    if(agricultureOnly){
      const subjects=normalizeText([e.specialization,e.degree,e.researchField,e.educationGoal].filter(Boolean).join(' '));
      if(!/agricultur|horticultur|forestry|agronom|crop|plant science|veterinary|dairy|fisheries/.test(subjects)) return false;
    }
    return true;
  }
  function recordRelation(r){
    if(!profile || !profile.educationLevel) return 'current';
    if(!recordHardGate(r)) return null;
    const levels=Array.isArray(r.education_levels)?r.education_levels:[];
    const level=profile.educationLevel;
    const target=profileTargetLevel();
    const title=String(r.title||'');
    const id=String(r.id||'');
    const type=String(r.opportunity_type||'');
    const subs=Array.isArray(r.subcategories)?r.subcategories:[];
    const isBeneficiarySensitive=['scholarship','education_assistance','fellowship','stipend','free_coaching'].includes(type);

    // JNVST/AISSEE routes are taken during the qualifying class (V for VI entry; VIII for IX entry).
    // Keep them as profile-stage matches, but their Deadline Unknown / provisional status prevents an Open claim.
    if(['EDU-EXM-0008','EDU-EXM-0009','EDU-EXM-0010'].includes(id)) return 'current';
    // JEE/NEET/CUET are relevant to a qualifying Class XII candidate; GATE is relevant to eligible undergraduates considering PG.
    if(['EDU-EXM-0001','EDU-EXM-0002','EDU-EXM-0003'].includes(id) || id==='EDU-EXM-0007') return 'current';
    // Confirmed NMMSS selection is a continuation/renewal route in later school classes, not a generic fresh scholarship.
    if(id==='EDU-SCH-0001' && ['secondary_9_10','higher_secondary_11_12'].includes(level) && profileExtra().nmmssStatus==='yes') return 'current';

    // A completed degree pursuing the next level should see that level's records as a next step, never as currently entitled.
    if(target && levels.includes(target) && !/renewal/i.test(title) && id!=='EDU-EXM-0007') return 'next_step';

    if(levels.includes(level)){
      // Renewal records are not fresh applications after the relevant education level has already been completed.
      if(isLevelCompleted() && /renewal/i.test(title) && ['bachelors_undergraduate','masters_postgraduate'].includes(level)) return null;
      // A completed Bachelor's student should not be shown bachelor-enrolment grants/scholarships as current matches.
      if(completedBachelor() && isBeneficiarySensitive && !(target==='masters_postgraduate' && levels.includes('masters_postgraduate'))) return null;
      if(level==='masters_postgraduate' && isLevelCompleted() && isBeneficiarySensitive && target==='phd_doctoral' && !levels.includes('phd_doctoral')) return null;
      // Do not show PG-only UGC JRF or UGC-NET records to someone whose only qualifying level is a Bachelor's degree.
      if(level==='bachelors_undergraduate' && (id==='EDU-EXM-0006'||id==='EDU-FEL-0005')) return null;
      return 'current';
    }
    if(target && levels.includes(target) && !/renewal/i.test(title)) return 'next_step';
    return null;
  }
  function recordFitsLevel(r){ return recordRelation(r)!==null; }
  function subsectionsForProfile() {
    const level=profile?.educationLevel;
    const e=profileExtra();
    const grade=classNumber();
    const goal=educationGoalText();
    const completed=isLevelCompleted();
    const wantsSchoolXI=/class 11|11[–-]12|higher secondary|intermediate/.test(goal);
    const wantsDiploma=/diploma|polytechnic/.test(goal);
    const wantsITI=/\biti\b|vocational|skill/.test(goal);
    const wantsEntrance=/entrance|exam|admission|olympiad|competition|jee|neet|cuet|gate|nmmss/.test(goal);
    const wantsUG=/bachelor|undergraduate|\bug\b|degree/.test(goal);
    const wantsPG=/higher studies|postgraduate|\bpg\b|masters|master/.test(goal);
    const wantsPhD=/phd|research|doctoral/.test(goal);
    const wantsScholarship=/scholarship|financial aid|financial support/.test(goal);
    const goalUnclear=!goal || /not sure|not decided|explore all education options/.test(goal);
    let names=[];
    if(!level){
      names=SUBSECTIONS.map(s=>s.name);
    } else if(level==='no_formal_education'){
      names=['School Education','Scholarships & Financial Aid','Skill & Vocational Learning'];
      if(wantsEntrance) names.push('Entrance Exams & Admissions');
    } else if(level==='primary_1_5'){
      names=['School Education','Scholarships & Financial Aid'];
      if(grade===5 || wantsEntrance) names.push('Entrance Exams & Admissions');
      if(wantsITI) names.push('Skill & Vocational Learning');
    } else if(level==='middle_6_8'){
      names=['School Education','Scholarships & Financial Aid'];
      if(grade===8 || wantsEntrance || /nmmss|olympiad|competition/.test(goal)) names.push('Entrance Exams & Admissions');
      if(wantsITI) names.push('Skill & Vocational Learning');
    } else if(level==='secondary_9_10'){
      if(grade===9){
        names=['School Education','Scholarships & Financial Aid'];
        if(wantsEntrance) names.push('Entrance Exams & Admissions');
        if(wantsITI) names.push('Skill & Vocational Learning');
        if(wantsDiploma) names.push('Diploma & Polytechnic');
      } else {
        // At Class X or after passing it, show routes available at the transition. Explicit goals reduce unrelated choices.
        names=['School Education','Scholarships & Financial Aid'];
        if(wantsEntrance || wantsSchoolXI || goalUnclear || wantsDiploma || wantsITI) names.push('Entrance Exams & Admissions');
        if(wantsDiploma || (goalUnclear && !wantsSchoolXI && !wantsITI)) names.push('Diploma & Polytechnic');
        if(wantsITI || (goalUnclear && !wantsSchoolXI && !wantsDiploma)) names.push('Skill & Vocational Learning');
      }
    } else if(level==='higher_secondary_11_12'){
      const atClass11=grade===11 && !completed;
      const class12Completed=grade===12 && (completed || String(e.classGrade||'').includes('Completed Class 12'));
      if(atClass11){
        names=['School Education','Scholarships & Financial Aid','Entrance Exams & Admissions'];
        if(wantsUG) names.push('Undergraduate (UG)');
        if(wantsITI) names.push('Skill & Vocational Learning');
        if(wantsDiploma) names.push('Diploma & Polytechnic');
      } else {
        names=[];
        if(!class12Completed) names.push('School Education');
        names.push('Undergraduate (UG)','Entrance Exams & Admissions','Scholarships & Financial Aid');
        if(wantsDiploma) names.push('Diploma & Polytechnic');
        if(wantsITI || goalUnclear) names.push('Skill & Vocational Learning');
      }
    } else if(level==='diploma_polytechnic'){
      names=['Diploma & Polytechnic','Scholarships & Financial Aid'];
      if(wantsITI || goalUnclear) names.push('Skill & Vocational Learning');
      const diplomaYear=normalizeText(e.studyYear);
      const finalYear=completed || /third year|year 3|fourth year|year 4|completed/.test(diplomaYear) || /bachelor|degree|lateral entry|admission/.test(goal);
      if(finalYear){ names.push('Undergraduate (UG)','Entrance Exams & Admissions'); }
    } else if(level==='bachelors_undergraduate'){
      const y=undergraduateYear();
      const targetPG=profileTargetLevel()==='masters_postgraduate';
      if(completed){
        names=['Postgraduate (PG)','Entrance Exams & Admissions','Scholarships & Financial Aid','Fellowships & Academic Stipends'];
        if(wantsITI || goalUnclear) names.push('Skill & Vocational Learning');
      } else {
        names=['Undergraduate (UG)','Scholarships & Financial Aid'];
        if(wantsITI || goalUnclear) names.push('Skill & Vocational Learning');
        if((y!==null && y>=3) || targetPG || wantsEntrance) names.push('Entrance Exams & Admissions');
        if(targetPG || ((y!==null && y>=3) && wantsPG)) names.push('Postgraduate (PG)');
        if((y!==null && y>=3) && (wantsPhD || wantsScholarship)) names.push('Fellowships & Academic Stipends');
      }
    } else if(level==='masters_postgraduate'){
      const targetPhD=profileTargetLevel()==='phd_doctoral';
      if(completed){
        names=['PhD & Research','Scholarships & Financial Aid','Fellowships & Academic Stipends'];
        if(targetPhD || wantsEntrance || /planning to apply|entrance/.test(normalizeText(e.researchStage))) names.push('Entrance Exams & Admissions');
        if(wantsITI || goalUnclear) names.push('Skill & Vocational Learning');
      } else {
        // An enrolled Master's student retains current PG opportunities while PhD is shown as a separate next step.
        names=['Postgraduate (PG)','Scholarships & Financial Aid','Fellowships & Academic Stipends'];
        if(wantsEntrance || wantsPhD || /planning to apply|entrance/.test(normalizeText(e.researchStage))) names.push('Entrance Exams & Admissions');
        if(wantsITI || goalUnclear) names.push('Skill & Vocational Learning');
        if(targetPhD || wantsPhD) names.push('PhD & Research');
      }
    } else if(level==='phd_doctoral'){
      names=['PhD & Research','Scholarships & Financial Aid','Fellowships & Academic Stipends'];
      if(wantsEntrance || /planning to apply|entrance\/admission stage/.test(normalizeText(e.researchStage))) names.push('Entrance Exams & Admissions');
      if(wantsITI || goalUnclear) names.push('Skill & Vocational Learning');
    } else {
      names=['School Education','Scholarships & Financial Aid','Skill & Vocational Learning'];
      if(wantsEntrance) names.push('Entrance Exams & Admissions');
      if(wantsDiploma) names.push('Diploma & Polytechnic');
    }
    names=[...new Set(names)];
    let selected=SUBSECTIONS.filter(s=>names.includes(s.name));
    let preferred='';
    if(wantsDiploma) preferred='Diploma & Polytechnic';
    else if(wantsITI) preferred='Skill & Vocational Learning';
    else if(wantsEntrance) preferred='Entrance Exams & Admissions';
    else if(wantsScholarship) preferred='Scholarships & Financial Aid';
    else if(level==='bachelors_undergraduate' && (completed || profileTargetLevel()==='masters_postgraduate')) preferred='Postgraduate (PG)';
    else if(level==='masters_postgraduate' && (completed || profileTargetLevel()==='phd_doctoral')) preferred='PhD & Research';
    if(preferred && names.includes(preferred)) selected=selected.slice().sort((a,b)=>(a.name===preferred?-1:0)-(b.name===preferred?-1:0));
    return selected;
  }
  function subsectionIsNextStep(name){
    const level=profile?.educationLevel;
    const grade=classNumber();
    const target=profileTargetLevel();
    const e=profileExtra();
    if(level==='secondary_9_10' && grade===10 && (target==='higher_secondary_11_12'||target==='diploma_polytechnic') && ['Entrance Exams & Admissions','Diploma & Polytechnic','Skill & Vocational Learning'].includes(name)) return true;
    if(level==='higher_secondary_11_12' && grade===11 && name==='Entrance Exams & Admissions') return true; // JEE/NEET/CUET are preparation paths at Class XI, not apply-now cards.
    if(level==='higher_secondary_11_12' && name==='Undergraduate (UG)') return true;
    if(level==='diploma_polytechnic' && name==='Undergraduate (UG)' && (isLevelCompleted() || /bachelor|degree|lateral entry|admission/.test(educationGoalText()))) return true;
    if(level==='bachelors_undergraduate' && isLevelCompleted() && name==='Postgraduate (PG)') return true;
    if(level==='bachelors_undergraduate' && profileTargetLevel()==='masters_postgraduate' && name==='Postgraduate (PG)') return true;
    if(level==='bachelors_undergraduate' && !gateAcademicStageEligible() && name==='Entrance Exams & Admissions' && profileTargetLevel()==='masters_postgraduate') return true;
    if(level==='masters_postgraduate' && (isLevelCompleted() || target==='phd_doctoral') && name==='PhD & Research') return true;
    if(level==='masters_postgraduate' && name==='Entrance Exams & Admissions' && target==='phd_doctoral') return true;
    return false;
  }
  function renderSubsections() {
    renderEducationTransitionDatabase();
    const host=$('subsectionGrid'); host.innerHTML='';
    const visible = subsectionsForProfile();
    if (selectedSubsection && !visible.some(s=>s.name===selectedSubsection)) selectedSubsection = null;
    $('subsectionCount').textContent = `${visible.length} ${uiLanguage==='hi'?'संबंधित उप-सेक्शन':uiLanguage==='gu'?'સંબંધિત ઉપવિભાગ':'relevant subsections'}`;
    visible.forEach(s=>{
      const all=sectionRecords(s.name).length;
      const relevant=profile && profile.educationLevel ? sectionRecords(s.name).filter(r=>recordRelation(r)!==null).length : all;
      const b=document.createElement('button'); b.type='button'; b.className='subsection-card'+(selectedSubsection===s.name?' selected':'');
      const countText = profile && profile.educationLevel
        ? (relevant===0 && s.name==='Entrance Exams & Admissions'
            ? (uiLanguage==='hi'?'आधिकारिक मार्ग देखें':uiLanguage==='gu'?'સત્તાવાર માર્ગ જુઓ':'Official routes')
            : relevant===0 && s.name==='Diploma & Polytechnic' && profile.educationLevel==='secondary_9_10'
              ? (uiLanguage==='hi'?'राज्य के विकल्प देखें':uiLanguage==='gu'?'રાજ્યના વિકલ્પો જુઓ':'Explore state routes')
              : `${relevant} ${relevant===1?'matching record':'matching records'}`)
        : `${all} records`;
      const nextStepTag = subsectionIsNextStep(s.name)
        ? `<span class="subsection-stage-tag">${uiLanguage==='hi'?'अगला चरण · अभी पात्रता नहीं':uiLanguage==='gu'?'આગળનું પગલું · હાલની પાત્રતા નથી':'NEXT STEP · NOT APPLY-NOW ELIGIBILITY'}</span>`
        : '';
      b.innerHTML=`<span class="subsection-icon">${s.icon}</span><span class="subsection-main"><strong>${esc(t(s.name))}</strong>${nextStepTag}<small>${esc(t(s.desc))}</small></span><span class="subsection-count">${esc(countText)}</span>`;
      b.setAttribute('aria-pressed',selectedSubsection===s.name?'true':'false');
      b.addEventListener('click',()=>{
        selectedSubsection=selectedSubsection===s.name?null:s.name;
        renderSubsections(); renderInstitutionFinder(); renderPathwayGuide(); renderResults();
        const transitionPanel=$('transitionDatabasePanel');
        const target = selectedSubsection==='Diploma & Polytechnic'
          ? (transitionPanel && !transitionPanel.hidden ? transitionPanel : $('institutionFinder'))
          : $('resultsShell');
        if (target && !target.hidden) target.scrollIntoView({behavior:'smooth',block:'start'});
      });
      host.appendChild(b);
    });
    if (!profile?.educationLevel) {
      $('educationPersonalizedIntro').textContent = uiLanguage==='hi'
        ? 'प्रोफ़ाइल में शिक्षा स्तर चुनें। अभी सामान्य शुरुआती उप-सेक्शन दिख रहे हैं; वास्तविक योग्यता के अनुसार रिकॉर्ड सीमित करने के लिए Edit profile करें।'
        : uiLanguage==='gu'
          ? 'પ્રોફાઇલમાં શિક્ષણ સ્તર પસંદ કરો. હાલમાં સામાન્ય શરૂઆતના ઉપવિભાગો દેખાય છે; યોગ્યતા પ્રમાણે રેકોર્ડ માટે પ્રોફાઇલ સંપાદિત કરો.'
          : 'Choose an education level in your profile. The list will adapt to your class/degree stage and stated next goal.';
    }
  }
  function typeLabel(type) { return String(type||'Opportunity').replaceAll('_',' ').replace(/\b\w/g, c=>c.toUpperCase()); }
  function verificationDetails(r) {
    if (r.publication_readiness === 'blocked') return {label:'Blocked · review needed',className:'blocked'};
    if (r.publication_readiness === 'production_ready' && r.verification_status === 'Verified') return {label:'Verified record',className:'verified'};
    return {label:'Provisional · verify details',className:'provisional'};
  }
  function getFilteredRecords() {
    // Education discovery must never include records routed to the Jobs/Careers module.
    let list=records.filter(r=>r.category!=='jobs_careers_startups');
    if (selectedSubsection) list=list.filter(r=>(r.subcategories||[]).includes(selectedSubsection));
    // Opportunity eligibility records remain strictly tagged to the selected level. Future pathways
    // (e.g., diploma after Class 10) are shown separately in the state-specific finder and do not
    // widen scholarship eligibility.
    if (profile && profile.educationLevel) list=list.filter(r=>recordRelation(r)!==null);
    const q=$('searchInput').value.trim().toLowerCase();
    if(q) list=list.filter(r=>[r.title,r.id,r.description,r.eligibility_summary,r.opportunity_type,...(r.subcategories||[]),...(r.sources||[]).map(s=>s.name)].filter(Boolean).join(' ').toLowerCase().includes(q));
    const type=$('typeFilter').value; if(type!=='all') list=list.filter(r=>r.opportunity_type===type);
    const status=$('statusFilter').value; if(status!=='all') list=list.filter(r=>recordStatus(r)===status);
    const sort=$('sortFilter').value;
    list.sort((a,b)=>{
      if(sort==='title') return a.title.localeCompare(b.title);
      if(sort==='status') { const order={'Open':0,'Upcoming':1,'Deadline Unknown':2,'Closed':3}; return (order[recordStatus(a)]??2)-(order[recordStatus(b)]??2)||a.title.localeCompare(b.title); }
      const statusOrder={'Open':0,'Upcoming':1,'Deadline Unknown':2,'Closed':3};
      return (statusOrder[recordStatus(a)]??2)-(statusOrder[recordStatus(b)]??2) || a.title.localeCompare(b.title);
    });
    return list;
  }
  function statusClass(s) { return s==='Open'?'open':s==='Upcoming'?'upcoming':s==='Closed'?'closed':''; }
  function listedStatusText(r) {
    const s=recordStatus(r);
    if(s==='Open' && r.verification_status!=='Verified') return 'Listed Open · verify current status';
    return s;
  }
  function relationLabelFor(r) {
    const relation=recordRelation(r);
    if(relation==='next_step') return 'NEXT STEP · NOT CURRENT ELIGIBILITY';
    if(recordStatus(r)==='Closed') return 'PROFILE MATCH · CYCLE CLOSED';
    if(recordStatus(r)==='Deadline Unknown') return 'PROFILE MATCH · CHECK CURRENT STATUS';
    return 'PROFILE MATCH · CURRENT STAGE';
  }
  function relationClassFor(r) {
    const relation=recordRelation(r);
    if(relation==='next_step') return 'next-step';
    if(recordStatus(r)==='Closed') return 'closed-cycle';
    if(recordStatus(r)==='Deadline Unknown') return 'check-status';
    return '';
  }
  function recordCard(r) {
    const verification=verificationDetails(r);
    const subsections=(r.subcategories||[]).slice(0,2).map(s=>`<span class="small-tag">${esc(t(s))}</span>`).join('');
    const dateValues=(r.dates||[]).map(d=>d.date).filter(Boolean).sort();
    const date=dateValues.length?fmtDate(dateValues[0]):'Deadline unknown';
    const desc=r.description||r.eligibility_summary||'Description has not been recorded in the current research inventory.';
    const relation=recordRelation(r); const relationLabel=relationLabelFor(r); const relationClass=relationClassFor(r); return `<article class="opportunity-card"><div class="card-topline"><span class="type-pill">${esc(t(typeLabel(r.opportunity_type)))}</span><span class="verify-pill ${verification.className}">${esc(t(verification.label))}</span><span class="relation-pill ${relationClass}">${esc(t(relationLabel))}</span></div><h4>${esc(r.title)}</h4><p class="card-description">${esc(desc)}${relation==='next_step'?' This is planning information for your selected next education level, not confirmation that you can apply now.':recordStatus(r)==='Closed'?' This cycle is closed; this card is shown for profile relevance/history, not as an available application.':recordStatus(r)==='Deadline Unknown'?' The current application window has not been verified; check the official notice before acting.':''}</p><div class="card-tags">${subsections}</div><div class="card-meta"><span>${esc(r.id)}</span><span>${esc(date)}</span></div><div class="card-bottom"><span class="status-pill ${statusClass(recordStatus(r))}">${esc(t(listedStatusText(r)))}</span><button class="detail-btn" type="button" data-detail-id="${esc(r.id)}">View details ↗</button></div></article>`;
  }
  function simpleKey(value) {
    return String(value||'').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  }
  function currentInstitutionRows() {
    if (!profile || !profile.state || profile.country !== 'India') return [];
    const stateKey = simpleKey(profile.state);
    let rows = institutionRecords.filter(row => simpleKey(row.state) === stateKey);
    const district = String(profile.district||'').trim();
    const allDistricts = $('institutionAllDistricts') ? $('institutionAllDistricts').checked : !district;
    if (district && !allDistricts) {
      const dk = simpleKey(district);
      rows = rows.filter(row => simpleKey(row.district) === dk || simpleKey(row.district).includes(dk) || dk.includes(simpleKey(row.district)));
    }
    const query = $('institutionSearch') ? $('institutionSearch').value.trim().toLowerCase() : '';
    if (query) rows = rows.filter(row => [row.name,row.district,row.state,row.institution_type,...(row.courses||[]).map(c=>c.name)].filter(Boolean).join(' ').toLowerCase().includes(query));
    const course = $('institutionCourseFilter') ? $('institutionCourseFilter').value : 'all';
    if (course !== 'all') rows = rows.filter(row => (row.courses||[]).some(c => c.name === course));
    return rows;
  }
  function renderInstitutionResults() {
    const resultHost = $('institutionResults');
    const count = $('institutionResultCount');
    if (!resultHost || !count) return;
    const rows = currentInstitutionRows();
    count.textContent = `${rows.length} ${rows.length===1?'institution example':'institution examples'}`;
    if (!profile || profile.country!=='India' || !profile.state) {
      resultHost.innerHTML = `<div class="institution-empty">Choose India and a state in Basic Details to get a location-specific college directory.</div>`;
      return;
    }
    if (!rows.length) {
      resultHost.innerHTML = `<div class="institution-empty">No bundled institute record matches this state/district and search yet. This does not mean that no college exists. Use the official state directory/admission links above for the current institute, branch and seat matrix.</div>`;
      return;
    }
    resultHost.innerHTML = `<div class="institution-card-grid">${rows.map(row=>{
      const programs = (row.courses||[]).length
        ? `<ul>${row.courses.map(c=>`<li>${esc(c.name)}${c.approved_intake!=null && c.approved_intake!==''?` — approved intake listed: ${esc(c.approved_intake)}`:''}</li>`).join('')}</ul>`
        : `<p>Programme/branch details are not copied into this prototype. Open the current official seat matrix or programme finder before choosing this institution.</p>`;
      const statusLabel = row.source_status==='current_official_affiliation_2026_27' ? 'Current 2026–27 affiliation detail found' : row.source_status==='official_state_notice_2026' ? '2026 official state notice' : row.source_status==='listed_in_official_jeecup_2026_institute_list' ? 'Listed in official 2026 institute list' : row.source_status==='official_hstes_2026_27_listing' ? 'Listed in HSTES 2026–27 directory' : 'Official directory example · details may need current-cycle check';
      return `<article class="institution-card"><h4>${esc(row.name)}</h4><div class="institution-meta">${esc(row.district)}, ${esc(row.state)} · ${esc(row.institution_type||'Institute')} · ${esc(row.academic_year||'Year not recorded')}</div><p class="institution-programs">${programs}</p><div class="institution-card-links">${row.institution_url?`<a href="${esc(row.institution_url)}" target="_blank" rel="noopener noreferrer">Institute website ↗</a>`:''}<a href="${esc(row.source_url)}" target="_blank" rel="noopener noreferrer">Official source ↗</a></div><div class="institution-note">${esc(statusLabel)}. ${esc(row.note||'Confirm current admission, eligibility, course and seat availability at the official source.')}</div></article>`;
    }).join('')}</div>`;
  }
  const EDUCATION_TRANSITION_DATABASE = window.EDUCATION_TRANSITION_DATABASE || { stages: [], records: [], source_documents: [] };
  const TRANSITION_DB_INITIAL_LIMIT = 8;
  let transitionDbQuery = '';
  let transitionDbExpanded = false;
  let transitionDbCurrentStage = null;
  let transitionDbActiveRecords = [];
  let transitionDbPathway = 'all';
  let transitionDbClass10Stream = 'undecided';
  let transitionDbClass10Field = 'undecided';
  let transitionDbDiplomaField = 'all';
  let transitionDbClass12Stream = 'profile';

  function transitionDatabaseStage(){
    const level=profile?.educationLevel;
    const grade=classNumber();
    const e=profileExtra();
    if(level==='primary_1_5' && grade===5) return 'class5_to6';
    if(level==='middle_6_8' && grade===8) return 'class8_to9';
    if(level==='secondary_9_10' && grade===10) return 'class10_after';
    if(level==='higher_secondary_11_12' && grade===12) return 'class12_after';
    // Degree pathways show only when the person has completed, or is near completion and selected the next stage.
    if(level==='bachelors_undergraduate'){
      const y=undergraduateYear();
      if(isLevelCompleted() || (profileTargetLevel()==='masters_postgraduate' && y!==null && y>=3)) return 'bachelors_after';
    }
    if(level==='masters_postgraduate'){
      const y=String(e.studyYear||'');
      const yearMatch=y.match(/year\s*(\d+)/i);
      const semMatch=y.match(/semester\s*(\d+)/i);
      const pgYear=y==='Completed'?99:(yearMatch?Number(yearMatch[1]):(semMatch?Math.ceil(Number(semMatch[1])/2):null));
      if(isLevelCompleted() || (profileTargetLevel()==='phd_doctoral' && pgYear!==null && pgYear>=2)) return 'masters_after';
    }
    return null;
  }
  function transitionDbTitle(record){
    let title=String(record.title||'Education option').replace(/^\d+\.\s*/,'').trim();
    if(/^meri practical advice$/i.test(title)) return 'Practical advice';
    const generic=/^(eligibility|fees?( aur benefits)?|exam pattern|current application|available schools.*|admission kaise hota hai\?|documents ki preparation list|important state-level alert.*)$/i.test(title);
    if(generic && Array.isArray(record.context) && record.context.length){
      const parent=record.context[record.context.length-1].replace(/^\d+\.\s*/,'');
      return `${parent} — ${title}`;
    }
    return title;
  }
  function transitionDbStageCopy(stage){
    const content={
      class5_to6:{title:'Class 5 → Class 6: school admission options',desc:'School admission and selection routes for a learner in Class 5. Candidate age, district/residence, previous-school and current-cycle rules still need to match the official notice.'},
      class8_to9:{title:'Class 8 → Class 9: school admission options',desc:'National and school-specific admission routes, open schooling, eligible scholarship paths and the Class 9 lateral-entry routes from your uploaded research.'},
      class10_after:{title:'After Class 10: school, diploma, ITI & state-wise routes',desc:'Class XI–XII, engineering and non-engineering diploma, ITI trades, technical/healthcare course caveats, and state/UT portal routes from the supplied research. State-specific portals show only for the selected State/UT.'},
      class12_after:{title:'After Class 12: courses and entrance exams',desc:'Courses and exams filtered by the stream in your profile. A course or exam appearing here is a possible route, not a confirmed personal eligibility decision.'},
      bachelors_after:{title:'After Bachelor’s: postgraduate courses & entrance exams',desc:'PG degree options and national entrance routes from your uploaded research. The sections are filtered by degree/subject when your profile gives enough information; individual course eligibility still varies by institution.'},
      masters_after:{title:'After Master’s/PG: PhD, research & fellowships',desc:'Doctoral admission routes, research institutions and funding pathways from your uploaded research. Professional super-specialisation is labelled separately from a PhD.'}
    };
    return content[stage]||{title:'Education pathways',desc:''};
  }
  function transitionProfileDisciplineTags(stage){
    const e=profileExtra();
    const degree=String(e.degree||'').toLowerCase();
    const subject=String(e.specialization||'').toLowerCase();
    const previous=String(e.previousQualification||'').toLowerCase();
    const blob=[degree,subject,previous].join(' ');
    const tags=[];
    const add=(tag)=>{if(!tags.includes(tag)) tags.push(tag);};
    if(/btech|b\.e\.|engineering|mtech|m\.tech|m\.e\.|electrical|mechanical|civil|electronics|mechatronics|aerospace|instrumentation/.test(blob)) add('engineering');
    if(/computer|information technology|\bit\b|bca|mca|software|data science|cyber|artificial intelligence|machine learning|it systems/.test(blob)) add('computing');
    if(/bsc|msc|science|physics|chemistry|mathematics|statistics|biology|biotechnology|life science|geology|environmental science/.test(blob)) add('science');
    if(/ba|humanities|history|political science|sociology|psychology|english|hindi|languages|philosophy|anthropology|public administration/.test(blob)) add('humanities');
    if(/bcom|mcom|bba|bms|mba|commerce|finance|accounting|business|management|economics/.test(blob)) add('commerce');
    if(/llb|llm|law/.test(blob)) add('law');
    if(/mbbs|md\b|ms medical|dnb|drnb|medical|bds|mds|ayush|bams|bhms/.test(blob)) add('medical');
    if(/bpharm|mpharm|pharmacy|pharmaceutical|niper/.test(blob)) add('pharmacy');
    if(/nursing/.test(blob)) add('nursing');
    if(/physiotherapy|occupational therapy|allied health|public health|\bmph\b/.test(blob)) add('allied_health');
    if(/agriculture|horticulture|forestry|fisheries|veterinary|food technology|animal husbandry|icar/.test(blob)) add('agriculture');
    if(/barch|march|architecture|planning|mplan|urban design/.test(blob)) add('architecture');
    if(/bdes|mdes|design|fashion|textile/.test(blob)) add('design');
    if(/bed|med education|teacher education|pedagogy/.test(blob)) add('education');
    if(/hospitality|tourism|hotel management|food service/.test(blob)) add('hospitality');
    if(/fine arts|performing arts|music|mfa/.test(blob)) add('fine_arts');
    if(!tags.length) return [];
    return tags;
  }
  function transitionProfileSubjectTags(stage){
    const e=profileExtra();
    const degree=String(e.degree||'').toLowerCase();
    const subject=String(e.specialization||'').toLowerCase();
    const blob=[degree,subject].join(' ');
    const tags=[];
    const add=(tag)=>{if(!tags.includes(tag)) tags.push(tag);};
    if(/computer science|computer engineering|\bcse\b/.test(blob)) add('computer_science');
    if(/information technology/.test(blob) || /^it$/.test(subject.trim())) add('information_technology');
    if(/data science|analytics/.test(blob)) add('data_science');
    if(/cybersecurity|network security/.test(blob)) add('cybersecurity');
    if(/artificial intelligence|machine learning/.test(blob)) add('artificial_intelligence');
    if(/physics/.test(blob)) add('physics');
    if(/chemistry/.test(blob)) add('chemistry');
    if(/mathematics|maths/.test(blob)) add('mathematics');
    if(/statistics/.test(blob)) add('statistics');
    if(/biotechnology/.test(blob)) add('biotechnology');
    if(/life sciences/.test(blob)) add('life_sciences');
    if(/biology|zoology|botany/.test(blob)) add('biology');
    if(/electrical engineering|power systems/.test(blob)) add('electrical_engineering');
    if(/mechanical engineering|manufacturing engineering/.test(blob)) add('mechanical_engineering');
    if(/civil engineering|structural engineering/.test(blob)) add('civil_engineering');
    if(/electronics|vlsi|microelectronics/.test(blob)) add('electronics');
    if(/chemical engineering/.test(blob)) add('chemical_engineering');
    if(/aerospace|propulsion/.test(blob)) add('aerospace');
    if(/nursing/.test(blob)) add('nursing');
    if(/pharmacy|pharmaceutical/.test(blob)) add('pharmacy');
    if(/medical|mbbs|mds?|dnb|drnb/.test(blob)) add('medicine');
    if(/law|llm/.test(blob)) add('law');
    if(/finance|financial analytics|accounting|taxation/.test(blob)) add('finance');
    if(/mba|management/.test(blob)) add('management');
    if(/economics|econometrics/.test(blob)) add('economics');
    if(/history/.test(blob)) add('history');
    if(/political science/.test(blob)) add('political_science');
    if(/sociology/.test(blob)) add('sociology');
    if(/psychology/.test(blob)) add('psychology');
    if(/languages|linguistics|literature/.test(blob)) add('languages');
    if(/agriculture|agronomy|horticulture|forestry|fisheries|veterinary/.test(blob)) add('agriculture');
    if(/architecture|march/.test(blob)) add('architecture');
    if(/mplan|urban and regional planning|transport planning/.test(blob)) add('planning');
    if(/mdes|design|fashion|textile/.test(blob)) add('design');
    if(/med|teacher education|pedagogy/.test(blob)) add('education');
    if(/public health|mph/.test(blob)) add('public_health');
    if(/physiotherapy|occupational therapy|allied health/.test(blob)) add('allied_health');
    if(/fine arts|performing arts|music|mfa/.test(blob)) add('fine_arts');
    if(/hospitality|tourism|hotel management/.test(blob)) add('hospitality');
    return tags;
  }
  function renderEducationTransitionDatabase(){
    const panel=$('transitionDatabasePanel');
    if(!panel) return;
    const stage=transitionDatabaseStage();
    if(!stage){panel.hidden=true;panel.innerHTML='';transitionDbCurrentStage=null;transitionDbActiveRecords=[];return;}
    if(stage!==transitionDbCurrentStage){transitionDbQuery='';transitionDbExpanded=false;transitionDbCurrentStage=stage;if(stage!=='class10_after'){transitionDbPathway='all';transitionDbClass10Stream='undecided';}}
    const state=normalizeText(profile?.state||'');
    const profileStream=String(profileExtra().stream||'').trim();
    const stream=stage==='class12_after' && transitionDbClass12Stream!=='profile' ? transitionDbClass12Stream : profileStream;
    let rows=(EDUCATION_TRANSITION_DATABASE.records||[]).filter(r=>r.stage===stage);
    // Explicitly state-specific entries are shown only for that state; an unknown state must not imply relevance.
    rows=rows.filter(r=>!Array.isArray(r.state_tags)||!r.state_tags.length||r.state_tags.some(x=>normalizeText(x)===state));
    // Stream-labelled routes are filtered when the Class 12 student selected a known stream; all-stream routes remain.
    if(stage==='class12_after' && stream && !/^other$/i.test(stream) && !/^profile$/i.test(transitionDbClass12Stream)){
      const normalized=normalizeText(stream);
      const aliases={
        'science — pcm':['science — pcm','pcm','science'],
        'science — pcb':['science — pcb','pcb','science'],
        'science — pcmb':['science — pcmb','pcmb','science'],
        'commerce':['commerce'],
        'arts / humanities':['arts / humanities','arts','humanities'],
        'vocational':['vocational','skill']
      };
      const selected=aliases[normalized]||[stream];
      rows=rows.filter(r=>{
        const tags=Array.isArray(r.stream_tags)?r.stream_tags:[];
        if(!tags.length) return true; // common cross-stream guides remain visible
        return tags.some(tag=>selected.some(a=>normalizeText(tag)===normalizeText(a)));
      });
    }
    // Graduate-to-PG and PG-to-PhD sections are filtered by current degree/subject when the profile provides it.
    let profileTags=[];
    if(stage==='bachelors_after' || stage==='masters_after'){
      profileTags=transitionProfileDisciplineTags(stage);
      if(profileTags.length){
        rows=rows.filter(r=>!Array.isArray(r.discipline_tags)||!r.discipline_tags.length||r.discipline_tags.some(tag=>profileTags.includes(tag)));
      }
      // Keep the most closely matched discipline sections in the initial view.
      if(profileTags.length){
        rows.sort((a,b)=>Number((Array.isArray(b.discipline_tags)&&b.discipline_tags.length>0))-Number((Array.isArray(a.discipline_tags)&&a.discipline_tags.length>0)));
      }
    }
      // For graduates with a named specialisation, filter clearly subject-specific sections too.
      if(stage==='bachelors_after' || stage==='masters_after'){
        const specific=transitionProfileSubjectTags(stage);
        if(specific.length){
          rows=rows.filter(r=>{
            const rt=Array.isArray(r.subject_tags)?r.subject_tags:[];
            return !rt.length || rt.some(tag=>specific.includes(tag));
          });
        }
      }
    if(stage==='class10_after'){
      const goal=educationGoalText();
      const pathway=transitionDbPathway;
      const textOf=r=>`${r.title||''} ${(r.context||[]).join(' ')} ${r.summary||''} ${r.search_text||''} ${(r.content_html||'').replace(/<[^>]*>/g,' ')}`.toLowerCase();
      const fieldPatterns={
        medical:/medical|neet|mbbs|bds|ayush|nursing|pharmacy|pharma|paramedical|allied health|physiotherapy|veterinary|biology|healthcare|clinical/,
        technical:/engineering|technical|computer|information technology|electrical|mechanical|civil|electronics|robotics|polytechnic|jee|pcm|science/,
        commerce:/commerce|accounting|accountancy|finance|banking|economics|business|b\.com|bcom|ca |cma|cs course|management/,
        arts:/arts|humanities|history|political science|sociology|literature|language|journalism|psychology|geography|ba |b\.a\.|fine arts|social work/,
        diploma:/diploma|polytechnic|pharmacy|automobile|electrical|mechanical|civil|computer|electronics|architecture assistantship|tool & die|hotel management|fashion|textile/,
        iti:/\biti\b|industrial training|ncvt|\bdgt\b|trade training|electrician|fitter|welder|plumber|copa/,
        automobile:/automobile|auto mobile|motor vehicle|mechanic motor vehicle|mechanic diesel|automotive/,
        pharma:/pharmacy|pharma|d\.pharm|dpharm|pharmacy diploma|pharmaceutical/,
        nontechnical:/commerce|accounting|office management|fashion|textile|hotel management|hospitality|tourism|beauty|cosmetology|retail|logistics|business|arts|humanities/,
        agriculture:/agriculture|horticulture|fisheries|dairy|veterinary|food technology|agri/,
        computer:/computer|information technology|software|copa|web design|data entry|networking|cyber/,
        electrical:/electrical|electrician|electronics|power systems/,
        mechanical:/mechanical|fitter|machinist|tool & die|welding|manufacturing/,
        civil:/civil|construction|surveying|architecture assistantship/,
        other:/vocational|skill|certificate|training|open schooling|nios|admission|entrance/
      };
      if(transitionDbClass10Field!=='undecided' && pathway==='all'){
        const f=fieldPatterns[transitionDbClass10Field];
        if(f){ const matched=rows.filter(r=>f.test(textOf(r))); if(matched.length) rows=matched; }
      }
      const diplomaPatterns={
        technical:/engineering|technical|computer|information technology|electrical|mechanical|civil|electronics|polytechnic|tool & die/,
        medical:/pharmacy|pharma|medical|healthcare|paramedical|nursing|laboratory|dmlt|allied health/,
        automobile:/automobile|auto mobile|motor vehicle|mechanic motor vehicle|mechanic diesel|automotive/,
        nontechnical:/commerce|office management|fashion|textile|hotel management|hospitality|tourism|beauty|cosmetology|retail|logistics|business/,
        agriculture:/agriculture|horticulture|fisheries|dairy|veterinary|food technology|agri/,
        computer:/computer|information technology|software|copa|web design|data entry|networking|cyber/,
        electrical:/electrical|electrician|power systems/,
        mechanical:/mechanical|fitter|machinist|welding|manufacturing/,
        civil:/civil|construction|surveying|architecture assistantship/,
        other:/vocational|skill|certificate|training|other diploma/
      };
      if(pathway==='diploma' && transitionDbDiplomaField!=='all'){
        const df=diplomaPatterns[transitionDbDiplomaField];
        if(df){ const matched=rows.filter(r=>df.test(textOf(r))); if(matched.length) rows=matched; }
      }
      const pathwayPatterns={
        school:/class xi|class 11|senior secondary|higher secondary|school admission|kendriya|navodaya|bhu|jamia|amu|nios|central hindu|junior college|stream|commerce|humanities|arts|pcm|pcb|pcmb/,
        diploma:/diploma|polytechnic|technical education|engineering diploma|government polytechnic|tool & die|architecture assistantship|state-wise diploma/,
        iti:/\biti\b|industrial training|ncvt|\bdgt\b|trade training|electrician|fitter|welder|plumber|copa/,
        vocational:/vocational|skill course|skill training|short-term course|certificate course|fashion|textile|commercial practice|office management|beauty|cosmetology/,
        open:/open schooling|nios|national institute of open schooling/,
        scholarships:/scholarship|financial assistance|financial support|fee assistance|education assistance/,
        entrance:/entrance|exam|test|admission|counselling|counseling|polycet|jeecup|dcece|pece|iti admission/
      };
      if(pathway!=='all' && pathwayPatterns[pathway]) rows=rows.filter(r=>pathwayPatterns[pathway].test(textOf(r)));
      if(pathway==='school' && transitionDbClass10Stream!=='undecided'){
        const streamPatterns={
          pcm:/pcm|physics.*mathematics|engineering|jee|bitsat|viteee|b\.tech|b\.e\.|architecture|computer science/,
          pcb:/pcb|physics.*biology|medical|neet|mbbs|bds|ayush|nursing|veterinary|pharmacy|pharma|agriculture|life sciences|paramedical/,
          pcmb:/pcmb|pcm|pcb|physics|mathematics|biology|engineering|neet|medical|pharmacy/,
          commerce_math:/commerce|economics|finance|accounting|ca |cs |cma|bcom|bba|management|mathematics|business/,
          commerce_no_math:/commerce|accounting|ca |cs |cma|bcom|bba|management|hospitality|law|business/,
          arts:/arts|humanities|journalism|social work|psychology|law|fine arts|history|political science|sociology|languages|teaching|ba |literature|geography/,
          vocational:/vocational|skill|b\.voc|professional diploma|technical programme|training|certificate|iti|trade/
        };
        const re=streamPatterns[transitionDbClass10Stream];
        if(re) rows=rows.filter(r=>!Array.isArray(r.stream_tags)||!r.stream_tags.length||r.stream_tags.includes(transitionDbClass10Stream)||re.test(textOf(r))||/general|common|all stream|school admission/.test(textOf(r)));
      }

      if(transitionDbClass10Field==='undecided' && pathway==='all' && /diploma|polytechnic/.test(goal)){
        rows=rows.filter(r=>/\bdiploma\b|\bpolytechnic\b|\biti\b|industrial training|technical education|tool & die|architecture assistantship|engineering diploma|state-wise diploma|government polytechnic|ncvt|\bdgt\b/.test(textOf(r)));
      } else if(transitionDbClass10Field==='undecided' && pathway==='all' && /\biti\b|vocational|skill/.test(goal)){
        rows=rows.filter(r=>/\biti\b|vocational|skill|trade|industrial training|ncvt|\bdgt\b|polytechnic|diploma/.test(textOf(r)));
      } else if(transitionDbClass10Field==='undecided' && pathway==='all' && /class 11|higher secondary|intermediate/.test(goal)){
        rows=rows.filter(r=>/class xi|class 11|senior secondary|higher secondary|school admission|kendriya|navodaya|bhu|jamia|amu|nios|central hindu|junior college/.test(textOf(r)));
      } else if(transitionDbClass10Field==='undecided' && pathway==='all' && /entrance exam|exam preparation/.test(goal)){
        rows=rows.filter(r=>/entrance|exam|test|admission|counselling|counseling|polycet|jeecup|dcece|pece/.test(textOf(r)));
      }
      // When a State/UT is selected, put that jurisdiction's portal/institute entries first.
      if(state){ rows.sort((a,b)=>Number((Array.isArray(b.state_tags)&&b.state_tags.length>0))-Number((Array.isArray(a.state_tags)&&a.state_tags.length>0))); }
    }
    transitionDbActiveRecords=rows;
    const copy=transitionDbStageCopy(stage);
    const lang=uiLanguage;
    const sourceLabel=lang==='hi'?'आपके दिए हुए डेटा से':lang==='gu'?'તમારા આપેલા ડેટામાંથી':'FROM YOUR UPLOADED DATA';
    const searchLabel=lang==='hi'?'विकल्प, परीक्षा, स्कूल या कोर्स खोजें':lang==='gu'?'વિકલ્પ, પરીક્ષા, શાળા અથવા કોર્સ શોધો':'Search options, exams, schools or courses';
    const searchPlaceholder=lang==='hi'?'जैसे Navodaya, Diploma, JEE, Nursing':lang==='gu'?'ઉદાહરણ: Navodaya, Diploma, JEE, Nursing':'e.g. Navodaya, Diploma, JEE, Nursing';
    const noData=lang==='hi'?'इस प्रोफ़ाइल के लिए दिए गए डेटा में कोई matching entry नहीं मिली।':lang==='gu'?'આ પ્રોફાઇલ માટે આપેલા ડેટામાં મેળ ખાતી એન્ટ્રી મળી નથી.':'No entries in the uploaded database match this profile/stream.';
    const caution=lang==='hi'?'डेटा की research date 24 October 2026 है। इस update में हर तारीख/eligibility को अलग से verify नहीं किया गया है। Apply करने से पहले संबंधित official portal पर current notice ज़रूर देखें।':lang==='gu'?'ડેટાની સંશોધન તારીખ 24 October 2026 છે. આ અપડેટમાં દરેક તારીખ/પાત્રતા ફરીથી ચકાસવામાં આવી નથી. અરજી પહેલાં અધિકૃત પોર્ટલ પર તાજી સૂચના તપાસો.':'Research snapshot: 24 October 2026. This update integrates your supplied material; dates and eligibility have not been independently re-verified. Check the linked official notice before applying.';
    const cards=rows.map((r,i)=>{
      const title=transitionDbTitle(r);
      const context=(r.context||[]).slice(-2).map(x=>String(x).replace(/^\d+\.\s*/,''));
      const links=(r.links||[]).filter(x=>/^https?:\/\//i.test(x.url||'')).slice(0,3);
      const linkHtml=links.length?`<div class="transition-db-links">${links.map(a=>`<a href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">${esc(a.label)} ↗</a>`).join('')}</div>`:'';
      const tags=(r.stream_tags||[]).map(x=>`<span class="transition-db-chip stream">${esc(x)}</span>`).join('');
      const degreeTags=(r.discipline_tags||[]).map(x=>`<span class="transition-db-chip stream">${esc(x.replaceAll('_',' '))}</span>`).join('');
      const stateTags=(r.state_tags||[]).map(x=>`<span class="transition-db-chip">State/UT: ${esc(x)}</span>`).join('');
      const detail=(r.content_html||'').trim();
      const searchText=String(r.search_text||`${title} ${r.summary||''}`).toLowerCase();
      const sourceLabels={class5_to6:'Class 5 admission research',class8_to9:'Class 8 admission research',class10_after:'Class 10 / diploma / ITI research',class12_after:'Class 12 course & exam research',bachelors_after:'Graduation → PG research',masters_after:'PG → PhD & research'};
      const sourceLabel=sourceLabels[r.stage]||'Uploaded research';
      return `<article class="transition-db-card" data-transition-db-id="${esc(r.id)}" data-transition-db-index="${i}" data-transition-db-search="${esc(searchText)}"><span class="transition-db-chip">${esc(sourceLabel)}</span><span class="transition-db-chip">Research notes · 24 Oct 2026</span>${tags}${degreeTags}${stateTags}<h4>${esc(title)}</h4>${context.length?`<div class="transition-db-context">${esc(context.join(' › '))}</div>`:''}<p>${esc(r.summary||'Detailed source notes are available below.')}</p>${linkHtml}${detail?`<details><summary>View details from your data</summary><div class="transition-db-detail">${detail}</div></details>`:''}</article>`;
    }).join('');
    const chosenStream=stage==='class12_after'&&stream?`<span class="transition-db-chip stream">Stream: ${esc(stream)}</span>`:'';
    const chosenDegree=(stage==='bachelors_after'||stage==='masters_after')?[profileExtra().degree,profileExtra().specialization].filter(Boolean).map(x=>String(x).trim()).join(' · '):'';
    const statusMessage=stage==='class10_after' && !isLevelCompleted()
      ? 'These are next-step routes after qualifying Class 10; they do not mean admission is open or that Class 10 is already passed.'
      : stage==='class12_after' && !isLevelCompleted()
        ? 'You can use these routes for Class 12 planning. Some exams accept appearing candidates; check each current bulletin and stream-specific rule.'
        : 'Use the details and source links below to compare options; school-specific vacancies, cutoffs, DOB, domicile and other eligibility conditions may apply.';
    panel.hidden=false;
    panel.innerHTML=`<div class="transition-db-head"><div><h3>${esc(copy.title)}</h3><p>${esc(copy.desc)}<br><strong>${esc(caution)}</strong><br>${esc(statusMessage)}</p></div><span class="transition-db-badge">${esc(sourceLabel)}</span></div>${chosenStream?`<div>${chosenStream}</div>`:''}${chosenDegree?`<div><span class="transition-db-chip stream">Degree/subject: ${esc(chosenDegree)}</span></div>`:''}${stage==='class10_after'?`<div class="transition-pathway-controls">
      <label>${esc(t('After Class 10, which field do you want to choose?'))}<select id="transitionDbClass10Field"><option value="undecided">${esc(t('Choose a field'))}</option><option value="medical">${esc(t('Medical / Healthcare / Pharmacy'))}</option><option value="technical">${esc(t('Engineering / Technical'))}</option><option value="commerce">${esc(t('Commerce / Accounts / Finance'))}</option><option value="arts">${esc(t('Arts / History / Humanities'))}</option><option value="diploma">${esc(t('Diploma / Polytechnic'))}</option><option value="iti">${esc(t('ITI / Trade training'))}</option><option value="nontechnical">${esc(t('Non-technical / Business / Hospitality'))}</option><option value="agriculture">${esc(t('Agriculture / Veterinary'))}</option><option value="other">${esc(t('Other / Explore all fields'))}</option></select></label>
      <label>${esc(t('Preferred pathway'))}<select id="transitionDbPathway"><option value="all">${esc(t('All pathways'))}</option><option value="school">${esc(t('Class XI–XII · choose stream'))}</option><option value="diploma">${esc(t('Diploma / Polytechnic'))}</option><option value="iti">${esc(t('ITI / Trade training'))}</option><option value="vocational">${esc(t('Vocational / skill courses'))}</option><option value="open">${esc(t('Open schooling (NIOS etc.)'))}</option><option value="scholarships">${esc(t('Scholarships & Financial Aid'))}</option><option value="entrance">${esc(t('Entrance Exams & Admissions'))}</option></select></label>
      <label>${esc(t('Diploma field / branch'))}<select id="transitionDbDiplomaField"><option value="all">${esc(t('All diploma fields'))}</option><option value="technical">${esc(t('Technical / Engineering diploma'))}</option><option value="medical">${esc(t('Medical / Pharmacy diploma'))}</option><option value="automobile">${esc(t('Automobile diploma'))}</option><option value="computer">${esc(t('Computer / IT diploma'))}</option><option value="electrical">${esc(t('Electrical diploma'))}</option><option value="mechanical">${esc(t('Mechanical diploma'))}</option><option value="civil">${esc(t('Civil diploma'))}</option><option value="nontechnical">${esc(t('Non-technical diploma'))}</option><option value="agriculture">${esc(t('Agriculture diploma'))}</option><option value="other">${esc(t('Other diploma'))}</option></select></label>
      <label>${esc(t('Class XI–XII stream'))}<select id="transitionDbClass10Stream"><option value="undecided">${esc(t('Choose a stream'))}</option><option value="pcm">${esc(t('Science PCM — Engineering / Technical'))}</option><option value="pcb">${esc(t('Science PCB — Medical / NEET'))}</option><option value="pcmb">${esc(t('Science PCMB — both options'))}</option><option value="commerce_math">${esc(t('Commerce with Maths — Accounts / Finance'))}</option><option value="commerce_no_math">${esc(t('Commerce without Maths — Business / Accounts'))}</option><option value="arts">${esc(t('Arts / Humanities — BA / History'))}</option><option value="vocational">${esc(t('Vocational stream'))}</option></select></label>
      <p class="transition-pathway-note">${esc(t('Choose your field first. The matching course/admission records will be filtered below. Medical routes commonly require PCB/PCMB; engineering commonly requires PCM, but exact eligibility depends on the institution/course.'))}</p></div>`:''}${stage==='class12_after'?`<div class="transition-pathway-controls"><label>${esc(t('Your Class 12 stream'))}<select id="transitionDbClass12Stream"><option value="profile">${esc(t('Use stream from my profile'))}</option><option value="Science — PCM">${esc(t('Science PCM — Engineering / JEE'))}</option><option value="Science — PCB">${esc(t('Science PCB — Medical / NEET'))}</option><option value="Science — PCMB">${esc(t('Science PCMB — Engineering and Medical'))}</option><option value="Commerce">${esc(t('Commerce — B.Com / Accounts / Finance'))}</option><option value="Arts / Humanities">${esc(t('Arts / Humanities — BA / History'))}</option><option value="Vocational">${esc(t('Vocational stream'))}</option><option value="Other">${esc(t('Other / show common routes'))}</option></select></label><p class="transition-pathway-note">${esc(t('Results update according to your selected stream. Common cross-stream guides remain visible.'))}</p></div>`:''}<div class="transition-db-controls"><label>${esc(searchLabel)}<input id="transitionDbSearch" type="search" value="${esc(transitionDbQuery)}" placeholder="${esc(searchPlaceholder)}"></label><span class="transition-db-count" id="transitionDbCount">${rows.length} research entries</span></div>${rows.length?`<div class="transition-db-grid" id="transitionDbGrid">${cards}</div><div class="transition-db-footer"><span class="transition-db-count">Records are loaded locally from the research database embedded in this HTML.</span><button class="transition-db-button" id="transitionDbExpand" type="button" aria-expanded="${transitionDbExpanded?'true':'false'}"></button></div>`:`<div class="transition-db-empty">${esc(noData)}</div>`}`;
    const search=$('transitionDbSearch');
    if(search) search.addEventListener('input',()=>{transitionDbQuery=search.value;filterEducationTransitionDatabase();});
    const pathwaySelect=$('transitionDbPathway');
    const streamSelect=$('transitionDbClass10Stream');
    const fieldSelect=$('transitionDbClass10Field');
    const diplomaSelect=$('transitionDbDiplomaField');
    const class12StreamSelect=$('transitionDbClass12Stream');
    if(pathwaySelect){pathwaySelect.value=transitionDbPathway;pathwaySelect.addEventListener('change',()=>{transitionDbPathway=pathwaySelect.value;if(transitionDbPathway!=='school')transitionDbClass10Stream='undecided';renderEducationTransitionDatabase();});}
    if(streamSelect){streamSelect.value=transitionDbClass10Stream;streamSelect.disabled=transitionDbPathway!=='school';streamSelect.addEventListener('change',()=>{transitionDbClass10Stream=streamSelect.value;renderEducationTransitionDatabase();});}
    if(fieldSelect){fieldSelect.value=transitionDbClass10Field;fieldSelect.addEventListener('change',()=>{transitionDbClass10Field=fieldSelect.value;if(transitionDbClass10Field==='diploma'){transitionDbPathway='diploma';}else if(transitionDbClass10Field==='iti'){transitionDbPathway='iti';}else if(['medical','technical','commerce','arts'].includes(transitionDbClass10Field)){transitionDbPathway='school';transitionDbClass10Stream=({medical:'pcb',technical:'pcm',commerce:'commerce_no_math',arts:'arts'})[transitionDbClass10Field];}else if(['nontechnical','agriculture','other'].includes(transitionDbClass10Field)){transitionDbPathway='all';transitionDbClass10Stream='undecided';}renderEducationTransitionDatabase();});}
    if(diplomaSelect){diplomaSelect.value=transitionDbDiplomaField;diplomaSelect.disabled=transitionDbPathway!=='diploma';diplomaSelect.addEventListener('change',()=>{transitionDbDiplomaField=diplomaSelect.value;renderEducationTransitionDatabase();});}
    if(class12StreamSelect){class12StreamSelect.value=transitionDbClass12Stream;class12StreamSelect.addEventListener('change',()=>{transitionDbClass12Stream=class12StreamSelect.value;renderEducationTransitionDatabase();});}
    const expand=$('transitionDbExpand');
    if(expand) expand.addEventListener('click',()=>{transitionDbExpanded=!transitionDbExpanded;filterEducationTransitionDatabase();});
    filterEducationTransitionDatabase();
  }
  function filterEducationTransitionDatabase(){
    const panel=$('transitionDatabasePanel');
    if(!panel||panel.hidden) return;
    const q=String(transitionDbQuery||'').trim().toLowerCase();
    const cards=[...panel.querySelectorAll('.transition-db-card')];
    let matches=0,shown=0;
    cards.forEach(card=>{
      const data=transitionDbActiveRecords.find(r=>r.id===card.getAttribute('data-transition-db-id'));
      const hit=!q || String(data?.search_text||'').includes(q);
      if(hit) matches++;
      const withinLimit=!!q||transitionDbExpanded||Number(card.getAttribute('data-transition-db-index'))<TRANSITION_DB_INITIAL_LIMIT;
      const visible=hit&&withinLimit;
      card.hidden=!visible;
      if(visible) shown++;
    });
    const counter=$('transitionDbCount');
    if(counter) counter.textContent=q?`${matches} matching entries · ${shown} shown`:`${matches} research entries · ${shown} shown`;
    const button=$('transitionDbExpand');
    if(button){
      button.hidden=!!q||matches<=TRANSITION_DB_INITIAL_LIMIT;
      button.setAttribute('aria-expanded',transitionDbExpanded?'true':'false');
      button.textContent=transitionDbExpanded?`Show first ${TRANSITION_DB_INITIAL_LIMIT} entries`:`Show all ${matches} entries`;
    }
  }

  function renderPathwayGuide(){
    const panel=$('pathwayGuide');
    if(!panel) return;
    const active=selectedSubsection==='Entrance Exams & Admissions';
    panel.hidden=!active;
    if(!active) { panel.innerHTML=''; return; }
    const level=profile?.educationLevel, grade=classNumber(), extra=profileExtra(), state=profile?.state||'';
    const cards=[];
    const add=(title,status,body,links=[])=>cards.push({title,status,body,links});
    const link=(label,url)=>({label,url});
    if(level==='primary_1_5'){
      if(grade===5){
        add('Class VI school admission','School / state-specific','Class VI admission is usually handled by the school or State/UT rules. Confirm age, required previous class, board and application window in the target school/state notice.',[link('CBSE admission rules','https://www.cbse.gov.in/cbsenew/admission.html'),link('Navodaya official portal','https://navodaya.gov.in/')]);
        add('Jawahar Navodaya Vidyalaya Selection Test (JNVST) — Class VI','Next-cycle dates and candidate rules not verified','A Class V learner may explore JNVST for Class VI admission. Do not treat this route as open until the next official NVS notification confirms dates, age/DOB band, current-school and residence conditions.',[link('Navodaya official admission portal','https://navodaya.gov.in/')]);
        add('Sainik School Class VI (AISSEE)','2026 cycle closed · next notice not verified','AISSEE 2026 covered admission to Classes VI and IX. The 2026 application/exam cycle is over; check the next NTA notice and verify the candidate’s exact date-of-birth and class criteria before applying.',[link('NTA AISSEE official page','https://exams.nta.nic.in/sainik-school-society/')]);
      } else {
        add('School progression / transfer','School-specific','For Classes 1–4, focus on next-class admission, school transfer and age/class requirements. A Class VI selection test is normally relevant when the student is in Class 5 and meets the stated age rules.',[link('CBSE admission rules','https://www.cbse.gov.in/cbsenew/admission.html')]);
      }
    } else if(level==='middle_6_8'){
      if(grade===8){
        add('Class IX school admissions','Class / age rules apply','Some schools run Class IX lateral-entry tests; others use state or school admission rules. Check the current school-specific notice rather than assuming one national test applies everywhere.',[link('Navodaya official portal','https://navodaya.gov.in/'),link('NTA AISSEE official page','https://exams.nta.nic.in/sainik-school-society/')]);
        add('NMMSS selection test','Class VIII route · current cycle needs checking','NMMSS selection is conducted through a State/UT test at Class VIII for eligible students. If selected, later-year scholarship payments are renewals subject to the scheme rules. The current deadline conflict remains unresolved in this research snapshot.',[link('Ministry of Education NMMSS','https://dsel.education.gov.in/scheme/nmmss'),link('National Scholarship Portal','https://scholarships.gov.in/All-Scholarships')]);
      } else {
        add('School admission & academic competitions','Check class-specific criteria','For Classes 6–7, most next-step options are school-level admissions/transfers, scholarship tests and academic competitions with their own class/age criteria. Class IX admission tests generally require the candidate to be in Class VIII.',[link('CBSE admission rules','https://www.cbse.gov.in/cbsenew/admission.html'),link('HBCSE Olympiad information','https://secure.hbcse.tifr.res.in/ino/ino-information.php')]);
      }
    } else if(level==='secondary_9_10'){
      if(grade===9){
        add('Class X continuation / school transfer','Not a single national entrance exam','For a Class 9 student, next-step planning is usually continuation into Class 10 or a school transfer. Diploma and Class XI routes should be treated as future options until Class 10 is completed.',[link('CBSE admission rules','https://www.cbse.gov.in/cbsenew/admission.html')]);
        add('Academic competitions / Olympiads','2026 enrolment closed · class and DOB rules apply','National Standard Examination (NSE) 2026 enrolment has closed. For this cycle, senior science NSEs have different rules for Classes X–XII and a specified date-of-birth window; NSEJS has a separate Class VIII–X and DOB window. The exam dates are in November 2026, but a new application cannot be inferred from the exam date. Verify the exact official eligibility and wait for the next cycle notice.',[link('HBCSE science Olympiad eligibility','https://olympiads.hbcse.tifr.res.in/how-to-participate/eligibility/science-olympiad/'),link('IAPT NSE 2026 schedule and eligibility','https://iapt.org.in/?id=48317&layout=edit&option=com_content&view=article')]);
      } else {
        add('Class XI / Junior College admission','After passing Class X','Class XI admissions generally require Class X or an equivalent qualifying examination. Admission timing, stream, merit and seat rules depend on the school/state; there is no single entrance test for every Class XI seat.',[link('CBSE official admission rules','https://www.cbse.gov.in/cbsenew/admission.html')]);
        add('Diploma / Polytechnic after Class X','State-specific admission','Many Diploma/Polytechnic routes accept eligible Class X/SSC candidates via the State’s current admission process; the exact route may be merit/counselling or another process. If your state is Gujarat, use ACPDC and verify the 2026/next-cycle prospectus.', state.toLowerCase()==='gujarat' ? [link('Gujarat ACPDC official 2026 portal','https://gujdiploma.admissions.nic.in/')] : [link('Find state institutions/admission links','https://dte.gov.in/')]);
        add('ITI / vocational trade admission','Trade-specific criteria','ITI eligibility varies by trade, minimum qualification, age and State/UT process. It is a separate route from Class XI and a diploma; check the specific trade and current state admission notice.',[link('Directorate General of Training','https://dgt.gov.in/')]);
        add('Science Olympiads / National Standard Examinations','2026 enrolment closed · not open for a new application now','The 2026 NSE cycle uses different class and DOB rules for senior science exams (NSEP/NSEC/NSEB/NSEA) and junior science (NSEJS). A Class 10 label alone is not enough to confirm eligibility. Check exact DOB, class-on-cutoff-date and other official conditions; this cycle’s enrolment has closed.',[link('HBCSE science Olympiad eligibility','https://olympiads.hbcse.tifr.res.in/how-to-participate/eligibility/science-olympiad/'),link('IAPT NSE 2026 schedule and eligibility','https://iapt.org.in/?id=48317&layout=edit&option=com_content&view=article')]);
        add('JEE Main / NEET UG / CUET UG','Prepare for a later cycle — not eligible as a Class 10 applicant','These are undergraduate-entry exams with Class XII / equivalent requirements and additional subject/programme rules. A Class 10 student should plan school stream/subjects first, not submit an application to these UG exams now. The 2026 cycles are closed; the next-cycle notices must be checked when officially published.',[link('JEE / NTA eligibility information','https://www.nta.ac.in/Engineeringexam'),link('NEET UG official site','https://neet.nta.nic.in/'),link('CUET UG official site','https://cuet.nta.nic.in/')]);
      }
    } else if(level==='higher_secondary_11_12'){
      if(grade===11){
        add('JEE Main / NEET UG / CUET UG','Preparation route · not an apply-now option for Class XI','Use Class XI for preparation and subject planning. For these UG entrance cycles, candidates generally need to appear in or have passed the qualifying Class XII/equivalent examination for the relevant year and meet subject/programme rules. Check the next official information bulletin before applying.',[link('JEE / NTA information','https://www.nta.ac.in/Engineeringexam'),link('NEET UG official site','https://neet.nta.nic.in/'),link('CUET UG official site','https://cuet.nta.nic.in/')]);
        add('National Standard Examinations / senior science Olympiads','2026 enrolment closed · exams scheduled 21–22 Nov 2026','NSEP (Physics), NSEC (Chemistry), NSEB (Biology) and NSEA (Astronomy) are relevant to some students studying in Class X, XI or XII on 30 Nov 2026. The official 2026 rules also specify a DOB window (1 Jul 2007–30 Jun 2012), residence/study and other conditions. Student enrolment is closed for this cycle; do not label it Open. The next cycle dates are not yet verified.',[link('HBCSE science Olympiad eligibility','https://olympiads.hbcse.tifr.res.in/how-to-participate/eligibility/science-olympiad/'),link('IAPT NSE 2026 schedule and eligibility','https://iapt.org.in/?id=48317&layout=edit&option=com_content&view=article')]);
      } else {
        add('JEE Main — Engineering / technology','2026 cycle closed · next cycle not verified','Relevant for eligible candidates with the required Class XII/equivalent subject combination. The 2026 cycle is closed and a next-cycle date should not be guessed. Check the official notice when released.',[link('NTA engineering exam information','https://www.nta.ac.in/Engineeringexam')]);
        add('NEET UG — Medical / allied pathways','2026 cycle closed · next cycle not verified','Relevant primarily to candidates meeting the current Class XII/equivalent Biology-related subject and other criteria. The 2026 cycle is closed; confirm the next information bulletin.',[link('NEET UG official site','https://neet.nta.nic.in/')]);
        add('CUET UG — Participating university admissions','2026 cycle closed · next cycle not verified','Potentially relevant for UG programmes at participating universities. Each university/programme can set subject and eligibility requirements; the 2026 cycle is closed.',[link('CUET UG official site','https://cuet.nta.nic.in/')]);
      }
    } else if(level==='bachelors_undergraduate'){
      if(isGateEligibleByProfile()){
        add('GATE 2027 — Postgraduate engineering/science admissions','Registration closed 12 Oct 2026','Official GATE 2027 criteria allow candidates in year 3 or higher of an approved undergraduate degree, and candidates who have completed an approved degree. For a completed B.E./B.Tech. IT degree, the general degree-level requirement is met. Fresh GATE 2027 registration closed on 12 October 2026; the 14–21 October correction window is only for candidates who already submitted an application. Exam: 6–21 Feb 2027; results: 19 Mar 2027.',[link('GATE 2027 eligibility','https://gate2027.iitm.ac.in/eligibility_criteria'),link('GATE 2027 official dates','https://gate2027.iitm.ac.in/important_dates')]);
      } else if(!gateAcademicStageEligible()) {
        add('GATE — postgraduate entrance route','Not yet eligible by current undergraduate stage','GATE 2027 permits candidates in the 3rd or higher year of an approved undergraduate degree, or graduates. If you are in Year 1 or Year 2, use this as a future preparation path, not a current application option.',[link('GATE 2027 eligibility','https://gate2027.iitm.ac.in/eligibility_criteria')]);
      } else {
        add('GATE and postgraduate admissions','Check your target course and paper','GATE eligibility is broad, but which paper is useful depends on your degree, target programme and each institution’s admission rules. If the current goal is not GATE/technical or research admission, explore the relevant PG entrance route for your discipline.',[link('GATE 2027 eligibility','https://gate2027.iitm.ac.in/eligibility_criteria')]);
      }
      if(profileTargetLevel()==='masters_postgraduate') add('PG admission and funding','Check discipline-specific criteria','Use the Postgraduate subsection for programmes and scholarships matching your degree/subject. A scholarship listed for enrolled PG students may only become applicable after admission and may have separate marks, income or category conditions.');
    } else if(level==='masters_postgraduate'){
      add('PhD / research admissions','Discipline- and institution-specific','For a PG student planning PhD, check the research discipline, accepted qualifying degree, marks, entrance/interview, supervisor availability and current institute notification. UGC-NET/JRF and ICAR exams are not universal substitutes for each other.',[link('UGC student corner','https://www.ugc.gov.in/Home/student_Corner'),link('UGC-NET official site','https://ugcnet.nta.ac.in/')]);
    } else if(level==='phd_doctoral'){
      add('Research funding and postdoctoral routes','Call-specific','For a doctoral/research profile, prioritize fellowships, research grants and postdoctoral calls whose discipline, stage and current deadline match your profile. Historical or unverified calls must not be shown as currently open.',[link('UGC student corner','https://www.ugc.gov.in/Home/student_Corner')]);
    } else {
      add('Check the next education step','Based on your profile','Select your exact current class/degree and next goal to identify a more precise admission route. Admission tests and cutoffs differ by level, state, subject and cycle.');
    }
    panel.innerHTML=`<div class="pathway-guide-head"><div><h3>Entrance & admission routes for your profile</h3><p>These are stage-aware guidance cards. “Preparation route” is not the same as eligibility to submit an application; always check the current official bulletin. This is an informational stage match, not a complete official eligibility decision.</p></div><span class="institution-tag">PROFILE CHECK</span></div><div class="pathway-guide-grid">${cards.map(c=>`<article class="pathway-guide-card"><span class="pathway-status">${esc(c.status)}</span><h4>${esc(c.title)}</h4><p>${esc(c.body)}</p>${c.links&&c.links.length?`<div class="pathway-links">${c.links.map(a=>`<a href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">${esc(a.label)} ↗</a>`).join('')}</div>`:''}</article>`).join('')}</div>`;
  }

  function renderInstitutionFinder() {
    const panel = $('institutionFinder');
    if (!panel) return;
    const show = selectedSubsection === 'Diploma & Polytechnic';
    panel.hidden = !show;
    if (!show) { panel.innerHTML=''; return; }
    const state = profile && profile.country==='India' ? profile.state : '';
    const district = profile ? profile.district : '';
    const source = state ? institutionSourceDirectory[state] : null;
    const stateRows = state ? institutionRecords.filter(row=>simpleKey(row.state)===simpleKey(state)) : [];
    const portalLinks = source ? `<div class="institution-source-links"><a href="${esc(source.directory_url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a>${source.admission_url && source.admission_url!==source.directory_url ? `<a href="${esc(source.admission_url)}" target="_blank" rel="noopener noreferrer">Official admission portal ↗</a>`:''}</div>` : `<div class="institution-note">A state-specific official diploma directory has not yet been validated and integrated for ${esc(state||'your state')}. No college list is guessed. The bundled examples are only partial; please use your State/UT Directorate of Technical Education's current admission notice and institute/seat matrix.</div>`;
    const sourceNote = source ? `<div class="institution-note"><strong>${esc(source.provider||'Official state source')}</strong> · ${esc(source.academic_year||'Academic year not recorded')}<br>${esc(source.note||'Verify current programme, intake, eligibility and deadline in the official portal.')}</div>` : '';
    const options = [...new Set(stateRows.flatMap(row=>(row.courses||[]).map(c=>c.name)))].sort((a,b)=>a.localeCompare(b));
    panel.innerHTML = `<div class="institution-head"><div><h3>Find diploma / polytechnic institutes in your state</h3><p>Based on your profile location: <strong>${esc([district,state].filter(Boolean).join(', ')||'State not selected')}</strong>. This finder is a partial local directory plus live official state links; it is not a complete national list or a promise of admission eligibility.</p></div><span class="institution-tag">STATE-AWARE FINDER</span></div>${portalLinks}${sourceNote}<div class="institution-controls"><label>Search institute, district or branch<input id="institutionSearch" type="search" placeholder="e.g. Computer Engineering, Jamnagar"></label><label>Branch / programme<select id="institutionCourseFilter"><option value="all">All programmes</option>${options.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select></label><label class="institution-all-districts"><input type="checkbox" id="institutionAllDistricts" ${district?'':'checked'}> All districts in my state</label></div><div class="institution-results-head"><strong>Institute examples</strong><span id="institutionResultCount">0 institutions</span></div><div id="institutionResults"></div><div class="institution-note">Class 9–10 students can explore diploma admission as a possible next step after completing Class 10, but the specific course, minimum subjects/marks, age rules, category/domicile rules and application window must be confirmed in the relevant state prospectus. ITI and Class 11–12 are separate pathways.</div>`;
    $('institutionSearch').addEventListener('input',renderInstitutionResults);
    $('institutionCourseFilter').addEventListener('change',renderInstitutionResults);
    $('institutionAllDistricts').addEventListener('change',renderInstitutionResults);
    renderInstitutionResults();
  }

  const CAREER_MODULE_LABELS = {
    government_job: 'Government jobs',
    recruitment_portal: 'State / UT recruitment portal',
    private_job: 'Private job / career route',
    startup_scheme: 'Startup / business scheme'
  };
  let careerVisibleLimit = 40;
  const CAREER_NOISE_RANGES = {
    private_job: [[154,156],[226,242]],
    startup_scheme: [[243,305],[329,338],[367,381]],
    recruitment_portal: [[141,153]]
  };
  function careerIsDisplayable(r) {
    if (!r || r.category !== 'jobs_careers_startups') return false;
    const match = String(r.id || '').match(/^ATT-MD-(\d+)$/);
    const num = match ? Number(match[1]) : null;
    const ranges = CAREER_NOISE_RANGES[r.opportunity_type] || [];
    if (num !== null && ranges.some(([a,b]) => num >= a && num <= b)) return false;
    return !!String(r.title || '').trim();
  }
  function careerAllRecords() { return records.filter(careerIsDisplayable); }
  function careerHasUsableSource(r) { return (r.sources || []).some(src => /^https?:\/\//i.test(String(src && src.url || ''))); }
  function careerSource(r) { return (r.sources || []).find(src => /^https?:\/\//i.test(String(src && src.url || ''))); }
  function careerSafeDate(r) {
    const dates = (r.dates || []).filter(d => d && /^\d{4}-\d{2}-\d{2}$/.test(String(d.date || ''))).sort((a,b)=>a.date.localeCompare(b.date));
    return dates.length ? fmtDate(dates[0].date) : 'No verified deadline recorded';
  }
  function careerEducationLabel(r) {
    const levels = Array.isArray(r.education_levels) ? r.education_levels : [];
    if (!levels.length) return 'Education: notification-specific';
    return 'Education: ' + levels.map(level => LEVELS[level] || level).join(', ');
  }
  function careerMatchesEducation(r) {
    if (!$('careerMatchEducation').checked || !profile || !profile.educationLevel) return true;
    const levels = Array.isArray(r.education_levels) ? r.education_levels : [];
    return !levels.length || levels.includes(profile.educationLevel) || levels.includes('other');
  }
  function careerRecordSearchText(r) {
    return [r.title,r.id,r.description,r.eligibility_summary,r.application_cycle,r.administrative_scope,r.career_module,r.opportunity_type,
      ...(r.subcategories || []), ...(r.education_levels || []), ...(r.beneficiary_groups || []),
      ...(r.eligibility_rules || []), ...(r.sources || []).map(src => src && (src.name || src.url)),
      ...(r.dates || []).map(d => d && [d.date,d.note,d.cycle,d.event_type].filter(Boolean).join(' '))]
      .filter(Boolean).join(' ').toLowerCase();
  }
  function careerCard(r) {
    const status = recordStatus(r);
    const verification = verificationDetails(r);
    const source = careerSource(r);
    const desc = r.description || r.eligibility_summary || 'Description not recorded; open details to review the available fields.';
    const levelTags = (Array.isArray(r.education_levels) ? r.education_levels : []).slice(0,3).map(v => `<span class="small-tag">${esc(LEVELS[v] || v)}</span>`).join('');
    const module = CAREER_MODULE_LABELS[r.opportunity_type] || typeLabel(r.opportunity_type);
    const applyText = status === 'Open' ? 'Check application' : 'Check official source';
    const sourceButton = source ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(applyText)} ↗</a>` : '';
    const statusText = listedStatusText(r);
    return `<article class="opportunity-card">
      <div class="card-topline"><span class="type-pill">${esc(module)}</span><span class="career-card-status ${statusClass(status)}">${esc(statusText)}</span></div>
      <h4>${esc(r.title)}</h4>
      <p class="card-description">${esc(desc)}</p>
      <div class="card-tags"><span class="small-tag">${esc(r.administrative_scope || 'Scope not specified')}</span>${levelTags}</div>
      <div class="card-meta"><span>${esc(r.id || 'No record ID')}</span><span>${esc(careerSafeDate(r))}</span></div>
      <p class="muted" style="font-size:10px;margin-top:9px">${esc(r.eligibility_summary || careerEducationLabel(r))}</p>
      <p class="muted" style="font-size:10px;margin-top:5px">${esc(verification.label)} · Verify age, stream/trade, domicile, experience and current application status in the notice.</p>
      <div class="career-card-actions"><button type="button" data-detail-id="${esc(r.id)}">View details</button>${sourceButton}</div>
    </article>`;
  }
const ROADMAP_TEMPLATES = {
    software: {
      title:'Software / IT career roadmap',
      summary:'A practical route into software development. A degree can help, but projects, problem-solving and role-specific skills matter too.',
      steps:[
        {title:'Build the right foundation',body:'If you are in school, strengthen maths, English and computer basics. After Class 10, compare the Class 11–12 route with recognised diploma/polytechnic options.'},
        {title:'Choose an eligible study route',body:'After Class 12, compare BTech/BE in CS/IT, BCA, BSc Computer Science or a recognised diploma route. Admission tests and subject requirements vary by institution.'},
        {title:'Learn core technical skills',body:'Pick one programming language, then practise data structures, databases, Git, debugging and basic operating-system/network concepts.'},
        {title:'Build proof of your skills',body:'Create 2–4 useful projects, document them on GitHub, practise explaining your decisions and look for internships or trainee roles.'},
        {title:'Prepare and apply',body:'Build a focused resume, practise coding/interviews and apply to entry-level developer, QA, support or internship roles that match your skills.'}
      ],
      links:[{label:'NPTEL courses',url:'https://www.nptel.ac.in/'},{label:'SWAYAM learning',url:'https://swayam.gov.in/'},{label:'JEE Main',url:'https://jeemain.nta.nic.in/'}]
    },
    engineer: {
      title:'Engineering career roadmap',
      summary:'The route depends on your branch and current qualification. Engineering admission and lateral-entry rules are set by each admission authority/institution.',
      steps:[
        {title:'Choose your branch direction',body:'After Class 10, compare Class 11–12 PCM with a recognised engineering diploma/polytechnic route. Think about computer, electrical, mechanical, civil or another branch.'},
        {title:'Meet subject and entrance requirements',body:'For the Class 12 route, check the current JEE/state entrance bulletin and counselling rules. For diploma admission or lateral entry, use the relevant state technical-admission portal.'},
        {title:'Complete a recognised programme',body:'Choose an approved BTech/BE or relevant diploma programme and review its accreditation, fees, location, placement and practical facilities.'},
        {title:'Build practical experience',body:'Complete branch-related projects, lab work, industry training and internships. Keep evidence of work you can explain.'},
        {title:'Apply for entry roles',body:'Target graduate engineer trainee, junior engineer, technician or branch-specific roles based on the qualification each recruitment notice requires.'}
      ],
      links:[{label:'JEE Main',url:'https://jeemain.nta.nic.in/'},{label:'AICTE',url:'https://www.aicte-india.org/'},{label:'State technical admissions',url:'https://dte.gov.in/'}]
    },
    doctor: {
      title:'Doctor (MBBS) roadmap',
      summary:'For an allopathic doctor, the usual route is eligible Class 12 science subjects, NEET-UG, MBBS and the required internship/registration. Other medical professions have different routes.',
      steps:[
        {title:'Complete school and choose the right subjects',body:'If you are before Class 11, plan for the required science subjects. For MBBS, confirm current Class 12 Physics, Chemistry, Biology/Biotechnology, English and other qualifying-exam rules.'},
        {title:'Prepare during Class 11–12',body:'Study the prescribed syllabus in Physics, Chemistry and Biology, keep up with board requirements and use the current NEET-UG information bulletin as your rulebook.'},
        {title:'Apply for NEET-UG and counselling',body:'Check age, qualifying subjects, marks, nationality and other current criteria. After the result, follow the relevant all-India/state counselling process; admission is not guaranteed by sitting the exam.'},
        {title:'Complete MBBS and internship',body:'Study at a recognised medical college and complete the prescribed course and compulsory rotating internship.'},
        {title:'Complete registration and choose a next path',body:'Meet the current medical-registration requirements. For specialisation, check the appropriate postgraduate entrance and training route.'}
      ],
      links:[{label:'NEET-UG',url:'https://neet.nta.nic.in/'},{label:'National Medical Commission',url:'https://www.nmc.org.in/'},{label:'Medical counselling',url:'https://mcc.nic.in/'}]
    },
    nurse: {
      title:'Nursing career roadmap',
      summary:'Your route may be BSc Nursing, GNM or another approved nursing programme. Entry subjects, minimum marks and admission methods vary by course and state.',
      steps:[
        {title:'Check your school subjects',body:'For BSc Nursing, verify the current eligibility for Class 12/equivalent subjects—commonly PCB and English—and the minimum marks/age rules for the course you choose.'},
        {title:'Compare recognised nursing courses',body:'Compare BSc Nursing, GNM and other approved routes based on your goal, duration and the current rules. Check that the institution and programme are recognised.'},
        {title:'Apply through the right admission route',body:'Use the current state/university entrance, merit or counselling process. Check the official prospectus before paying fees.'},
        {title:'Complete clinical training',body:'Finish theory, supervised clinical practice, attendance and examinations required by the approved programme.'},
        {title:'Register and start applying',body:'Meet the relevant State Nursing Registration Council requirements, then apply for hospital, community-health or government recruitment roles.'}
      ],
      links:[{label:'Indian Nursing Council',url:'https://indiannursingcouncil.org/'},{label:'NEET-UG portal',url:'https://neet.nta.nic.in/'}]
    },
    civil_service: {
      title:'IAS / IPS / UPSC Civil Services roadmap',
      summary:'IAS/IPS recruitment normally runs through the UPSC Civil Services Examination. A recognised bachelor’s degree is required, and age, nationality and category rules must be checked in the current notification.',
      steps:[
        {title:'Build a school-level foundation',body:'If you are in school, focus on reading comprehension, writing, social-science basics, maths/reasoning and current affairs habits.'},
        {title:'Complete a recognised bachelor’s degree',body:'Choose a subject you can study well. Confirm the current UPSC rules on qualifying degree, appearing candidates and documents.'},
        {title:'Read the current UPSC notification',body:'Check age cutoff, attempts, nationality, category relaxations, dates and the exact application instructions. Never rely only on an old coaching chart.'},
        {title:'Prepare for Prelims and Mains',body:'Map the official syllabus, practise previous papers, answer writing and mock tests, and build a revision/current-affairs routine.'},
        {title:'Complete all selection stages',body:'Apply through the official portal, then prepare for Prelims, Mains and Personality Test/Interview according to the current examination rules.'}
      ],
      links:[{label:'UPSC examinations',url:'https://upsc.gov.in/examinations/active-examinations'},{label:'UPSC previous papers',url:'https://upsc.gov.in/examinations/previous-question-papers'}]
    },
    teacher: {
      title:'Teacher career roadmap',
      summary:'Teaching qualifications depend on the class level, subject and employer. Verify the current NCTE, CTET/state TET and recruitment requirements for your intended role.',
      steps:[
        {title:'Choose the class level and subject',body:'Decide whether you want primary, upper-primary, secondary or senior-secondary teaching; each route can have different qualification rules.'},
        {title:'Complete the required qualification',body:'Depending on the role, this may include an approved teacher-education programme, an integrated programme, a bachelor’s degree and/or BEd.'},
        {title:'Check TET / CTET requirements',body:'Review the current official notification and ensure your course, subject and qualification fit the relevant paper/level.'},
        {title:'Build teaching experience',body:'Practise lesson planning, classroom communication, assessment and subject knowledge; use supervised practice/internship requirements where applicable.'},
        {title:'Apply for teacher recruitment',body:'Track central, state and private-school notices. Confirm qualifications, language, age, reservation and document requirements for each post.'}
      ],
      links:[{label:'NCTE',url:'https://ncte.gov.in/'},{label:'CTET',url:'https://ctet.nic.in/'}]
    },
    ca: {
      title:'Chartered Accountant (CA) roadmap',
      summary:'The CA path is governed by ICAI. Entry route and training rules can depend on whether you enter through Foundation or a permitted Direct Entry route.',
      steps:[
        {title:'Build accounting and maths foundations',body:'While in school, strengthen accounting basics, quantitative reasoning, business law awareness and disciplined study habits.'},
        {title:'Check the ICAI entry route',body:'After Class 12, review CA Foundation registration and exam rules. Graduates may have a Direct Entry route only if they meet the current ICAI conditions.'},
        {title:'Complete the required exam stages',body:'Follow the current Foundation/Intermediate/Final structure and pass the papers that apply to your entry route.'},
        {title:'Complete practical training',body:'Register for the required practical training/articleship and other current ICAI training/module requirements.'},
        {title:'Qualify and maintain membership',body:'Pass the remaining requirements, complete ICAI formalities and keep up with current professional/membership obligations.'}
      ],
      links:[{label:'ICAI official website',url:'https://www.icai.org/'}]
    },
    lawyer: {
      title:'Lawyer / Advocate roadmap',
      summary:'The usual law-degree route is a five-year integrated course after Class 12 or a three-year LLB after graduation. Recognised programme and enrolment rules apply.',
      steps:[
        {title:'Choose your entry route',body:'After Class 12, compare approved five-year integrated law programmes. After a bachelor’s degree, check whether a three-year LLB route fits your target.'},
        {title:'Check entrance and college recognition',body:'Review CLAT or the specific university/state admission notice, eligibility, counselling, fees and approved-college status.'},
        {title:'Complete the law degree',body:'Study core law subjects, legal research, drafting and advocacy; take internships or supervised practice opportunities where available.'},
        {title:'Meet enrolment and exam requirements',body:'After graduation, follow the applicable State Bar Council enrolment procedure and current All India Bar Examination rules.'},
        {title:'Choose a practice direction',body:'Build experience in litigation, corporate/commercial work, public law, legal aid or another area; verify any special qualification needed for your role.'}
      ],
      links:[{label:'CLAT Consortium',url:'https://consortiumofnlus.ac.in/'},{label:'Bar Council of India',url:'https://www.barcouncilofindia.org/'}]
    },
    pilot: {
      title:'Pilot / Commercial Pilot Licence roadmap',
      summary:'Flying careers have strict academic, medical, training and licensing requirements. Verify the latest DGCA rules before paying a flight-school deposit.',
      steps:[
        {title:'Check the subject requirements',body:'Confirm the current Class 12 Physics and Mathematics or accepted-equivalent requirement for the licence path you want.'},
        {title:'Complete medical checks early',body:'Review current DGCA medical standards and approved medical examination processes before committing to a training programme.'},
        {title:'Choose a suitable flight-training route',body:'Compare DGCA-approved training organisations, total cost, aircraft availability, instructor access and realistic training timelines.'},
        {title:'Complete exams and flight training',body:'Meet applicable ground-exam, flight-hour, skill-test and documentation requirements for the relevant licence.'},
        {title:'Apply for the licence and jobs',body:'Complete DGCA licensing formalities and apply to operators only when you meet their licence, ratings, experience and medical requirements.'}
      ],
      links:[{label:'DGCA official portal',url:'https://www.dgca.gov.in/digigov-portal/'},{label:'NTA / JEE information',url:'https://www.nta.ac.in/'}]
    },
    defence: {
      title:'Defence / Armed Forces career roadmap',
      summary:'Officer, Agniveer and technical routes have different age, education, subject, fitness and medical rules. Select the exact entry before planning for an exam.',
      steps:[
        {title:'Choose the entry you want',body:'Decide whether you are aiming for NDA, CDS, Agniveer or a technical/specialist entry. These routes are not interchangeable.'},
        {title:'Match your education and subjects',body:'NDA is an after-Class-12 route with wing-specific subject rules; graduate entries have separate degree and notification requirements.'},
        {title:'Check the current notification',body:'Read age/DOB cutoffs, nationality, marital-status conditions, education, physical standards, medical fitness and application dates.'},
        {title:'Prepare for all selection stages',body:'Plan written exam preparation, fitness, medical standards, SSB/selection-board requirements and documents as relevant to the entry.'},
        {title:'Apply only through the official channel',body:'Submit the form through the authorised recruitment portal and keep the application/notice details for later stages.'}
      ],
      links:[{label:'UPSC examinations',url:'https://upsc.gov.in/examinations/active-examinations'},{label:'Join Indian Army',url:'https://joinindianarmy.nic.in/'},{label:'AFCAT',url:'https://afcat.cdac.in/'}]
    },
    data_analyst: {
      title:'Data Analyst / Data Science roadmap',
      summary:'There is no single compulsory national exam for every data analyst job. Focus on fundamentals, demonstrable projects and entry criteria for your chosen roles.',
      steps:[
        {title:'Build quantitative foundations',body:'Strengthen maths, statistics, logical reasoning and written communication at your current study level.'},
        {title:'Learn the core tools',body:'Start with spreadsheets and SQL, then add Python and a visualisation tool such as Power BI or Tableau as your target roles require.'},
        {title:'Create real projects',body:'Use clean datasets to answer specific questions, explain your method, document limitations and publish a portfolio.'},
        {title:'Get practical experience',body:'Try internships, project work, student clubs or supervised industry tasks that demonstrate data cleaning, analysis and communication.'},
        {title:'Apply for suitable entry roles',body:'Target data analyst, reporting analyst, business analyst or junior data-science roles whose degree and skill requirements you meet.'}
      ],
      links:[{label:'SWAYAM courses',url:'https://swayam.gov.in/'},{label:'NPTEL',url:'https://www.nptel.ac.in/'}]
    },
    pharmacist: {
      title:'Pharmacy career roadmap',
      summary:'Pharmacist roles require a recognised pharmacy qualification and applicable registration. DPharm and BPharm routes have different durations and admission rules.',
      steps:[
        {title:'Check Class 12 subject eligibility',body:'Review the current rules for the pharmacy programme you want, including accepted science subjects, marks and age conditions.'},
        {title:'Compare approved courses and admission routes',body:'Look at DPharm and BPharm programmes, state counselling and institution approval. Do not assume every diploma is a pharmacy qualification.'},
        {title:'Complete the recognised programme',body:'Finish required classes, practical work, assessments and any prescribed internship/training.'},
        {title:'Complete professional registration',body:'Check the applicable State Pharmacy Council registration requirements after qualifying.'},
        {title:'Apply for pharmacy roles',body:'Explore hospital, community, industry, quality, production and government vacancies that accept your qualification and registration.'}
      ],
      links:[{label:'Pharmacy Council of India',url:'https://www.pci.nic.in/'}]
    },
    police: {
      title:'Police / law-enforcement career roadmap',
      summary:'Constable, Sub-Inspector and officer posts may have different education, age, physical and domicile requirements. Rules vary by recruitment authority.',
      steps:[
        {title:'Pick the exact post and jurisdiction',body:'Decide between state police, central armed police forces or another law-enforcement role; the qualification required can differ.'},
        {title:'Check the official eligibility notice',body:'Verify education, DOB/age cutoff, domicile, category rules, height/chest/physical standards, medical rules and disqualifications.'},
        {title:'Prepare for written examinations',body:'Study the specific syllabus, reasoning, general awareness, language and relevant subject areas in the official notification.'},
        {title:'Train for physical stages',body:'Build fitness safely and follow the notified running, measurement, physical-efficiency and medical requirements.'},
        {title:'Apply and track stages',body:'Submit the form only on the official recruitment portal and track admit card, tests, results and document verification.'}
      ],
      links:[{label:'SSC official portal',url:'https://ssc.gov.in/'},{label:'State police / recruitment portal',url:'https://www.india.gov.in/'}]
    },
    startup: {
      title:'Business / startup founder roadmap',
      summary:'Build and validate the business before selecting a grant, loan or recognition route. Funding is competitive and not guaranteed.',
      steps:[
        {title:'Define the problem and customer',body:'Describe the problem, who faces it, how they solve it today and why your solution would be better.'},
        {title:'Test a small version',body:'Talk to potential customers, prototype the product/service, estimate costs and test whether people will pay or use it.'},
        {title:'Prepare a business plan',body:'Work out pricing, operating costs, registration/compliance needs, cash flow and what evidence you have of demand.'},
        {title:'Complete suitable registrations',body:'Check which entity, licences and tax registrations apply. Udyam registration is for eligible MSMEs; DPIIT startup recognition has separate conditions.'},
        {title:'Explore the right support',body:'Compare incubators, grants, credit-linked subsidy, loans and equity carefully. Read the current scheme call and repayment/selection terms.'}
      ],
      links:[{label:'Startup India',url:'https://www.startupindia.gov.in/'},{label:'Udyam registration',url:'https://udyamregistration.gov.in/'}]
    },
    scientist: {
      title:'Scientist / Researcher roadmap',
      summary:'The route depends on the research discipline, institution and target job. Requirements for lab/research jobs, PhD admission and government scientist posts can differ considerably.',
      steps:[
        {title:'Choose a subject area',body:'Narrow your interest to a research field and identify what undergraduate subjects/courses are accepted for that discipline.'},
        {title:'Complete the qualifying degree',body:'Build subject fundamentals through a recognised degree; some research programmes require a master’s degree or another specific qualification.'},
        {title:'Gain research experience',body:'Try faculty projects, research internships, lab work, field work or an independent project with clear methods and documented results.'},
        {title:'Check entrance/fellowship requirements',body:'Use the institution-specific notice to confirm whether UGC-NET, CSIR-NET, GATE, ICAR or another exam applies. These exams are not interchangeable.'},
        {title:'Apply for research/PhD roles',body:'Prepare a research statement, references, transcripts and proposal as required; check supervisor availability and funding before applying.'}
      ],
      links:[{label:'UGC student corner',url:'https://www.ugc.gov.in/Home/student_Corner'},{label:'UGC-NET',url:'https://ugcnet.nta.ac.in/'},{label:'ICAR HRD',url:'https://icar.org.in/en/human-resources-development-hrd'}]
    },
    government_job: {
      title:'Government job roadmap',
      summary:'There is no single exam or eligibility rule for all government jobs. Start with a specific post, then match each official notification to your profile.',
      steps:[
        {title:'Choose a realistic job family',body:'Compare roles based on your current qualification: school-level posts where notified, matriculation/12th-level posts, apprenticeships, technical posts or graduate-level recruitment.'},
        {title:'Check the exact notification',body:'Verify age/DOB cutoff, education/stream/trade, domicile, category, physical standards, experience and documents for the particular post.'},
        {title:'Make an exam plan',body:'Download the official syllabus and previous papers. Set a weekly plan for subject knowledge, reasoning, maths, language and general awareness as required.'},
        {title:'Prepare documents early',body:'Keep certificates, photo/signature, identity, category/EWS/PwBD proof and experience records ready only where relevant.'},
        {title:'Apply and track the process',body:'Submit forms only via the official recruitment portal, save the application/receipt and track correction windows, admit cards and results.'}
      ],
      links:[{label:'SSC',url:'https://ssc.gov.in/'},{label:'UPSC',url:'https://upsc.gov.in/'},{label:'National Career Service',url:'https://www.ncs.gov.in/'}]
    },
    general: {
      title:'Personalised career roadmap',
      summary:'Your goal is specific, but it did not match one of the built-in career templates. Use these steps to identify the exact route and avoid relying on guesses.',
      steps:[
        {title:'Define the exact role',body:'Identify the job title, specialisation and sector. Similar titles can have different qualifications and licensing requirements.'},
        {title:'Find the official qualification rules',body:'Check the relevant regulator, recruiting body, university or government notification for required subjects, degree, age and location.'},
        {title:'Plan the qualification or training',body:'List the course, entrance exam, trade training, licence or certificate you actually need, and verify the institution/provider before paying fees.'},
        {title:'Build relevant proof',body:'Develop projects, practical experience, portfolio, supervised training or other evidence that the role expects.'},
        {title:'Track openings and apply',body:'Use official recruitment/admission portals, note each deadline and keep the required documents ready.'}
      ],
      links:[{label:'National Career Service',url:'https://www.ncs.gov.in/'},{label:'Skill India Digital Hub',url:'https://www.skillindiadigital.gov.in/'}]
    }
  };

  const CAREER_GOAL_DB = window.CAREER_GOAL_CATALOGUE || {};
  const CAREER_GOAL_RECORDS = Array.isArray(CAREER_GOAL_DB.records) ? CAREER_GOAL_DB.records : [];
  const CAREER_GOAL_TEMPLATES = CAREER_GOAL_DB.pathway_templates || {};
  const CAREER_GOAL_SEARCH_INDEX = CAREER_GOAL_RECORDS.map(record => ({
    record,
    title: normalizeText(record.goal_title),
    aliases: (Array.isArray(record.search_aliases) ? record.search_aliases : []).map(normalizeText),
    searchable: normalizeText([record.goal_title, record.career_family, record.sector, ...(record.search_aliases||[])].join(' '))
  }));
  const CAREER_GENERIC_GOALS = new Set([
    'doctor','nurse','engineer','engineering','teacher','teaching','pilot','defence','defense','army','navy','air force',
    'government job','govt job','sarkari naukri','police','scientist','researcher','startup','start a business','business',
    'pharmacist','pharmacy','lawyer','law','ca','accountant','data analyst','data science','software developer','software engineer',
    'civil services','civil service','ias','ips','upsc','private job','private jobs','railway job','postal job'
  ]);
  function scoreCareerGoal(record, title, aliases, query) {
    if (!query) return 0;
    if (title === query) return 12000;
    if (aliases.includes(query)) return 11900;
    const words = query.split(/[^a-z0-9]+/).filter(Boolean);
    if (title.startsWith(query)) return 10500 - Math.min(title.length, 100);
    if (aliases.some(alias => alias.startsWith(query))) return 10200 - Math.min(title.length, 100);
    const titleWords = title.split(/[^a-z0-9]+/).filter(Boolean);
    if (titleWords.some(word => word.startsWith(query))) return 9800 - Math.min(title.length, 150);
    if (title.includes(query)) return 9200 - Math.min(title.length, 250);
    if (aliases.some(alias => alias.includes(query))) return 9000 - Math.min(title.length, 250);
    if (words.length >= 2 && words.every(word => (title + ' ' + aliases.join(' ')).includes(word))) return 8500 + words.length*10 - Math.min(title.length, 300);
    const searchable = normalizeText([record.goal_title, record.career_family, record.sector, ...(record.search_aliases||[])].join(' '));
    const hits = words.filter(word => searchable.includes(word)).length;
    if (hits && (hits === words.length || words.length === 1)) return 6000 + hits*100 - Math.min(title.length, 500);
    return 0;
  }
  function searchCareerGoals(query, limit=8) {
    const q = normalizeText(query);
    if (q.length < 2) return [];
    return CAREER_GOAL_SEARCH_INDEX.map(item => ({record:item.record,score:scoreCareerGoal(item.record,item.title,item.aliases,q)}))
      .filter(item => item.score > 0)
      .sort((a,b)=>b.score-a.score || String(a.record.goal_title).localeCompare(String(b.record.goal_title)))
      .slice(0,limit).map(item=>item.record);
  }
  function findExactCareerGoal(query) {
    const q = normalizeText(query);
    if (!q) return null;
    const titleHit = CAREER_GOAL_SEARCH_INDEX.find(item => item.title === q);
    if (titleHit) return titleHit.record;
    const aliasHits = CAREER_GOAL_SEARCH_INDEX.filter(item => item.aliases.includes(q));
    if (aliasHits.length === 1) return aliasHits[0].record;
    if (aliasHits.length > 1) return aliasHits.sort((a,b)=>a.title.length-b.title.length)[0].record;
    return null;
  }
  function findCareerGoalForRoadmap(query, curatedKey) {
    const exact = findExactCareerGoal(query);
    if (exact) return exact;
    const q = normalizeText(query);
    if (!q || (curatedKey !== 'general' && CAREER_GENERIC_GOALS.has(q))) return null;
    const matches = searchCareerGoals(q, 2);
    if (!matches.length) return null;
    const top = CAREER_GOAL_SEARCH_INDEX.find(item=>item.record.goal_id===matches[0].goal_id);
    if (!top) return null;
    const score = scoreCareerGoal(top.record,top.title,top.aliases,q);
    // Use a database record for a strong role-title match, not just a weak category/word overlap.
    if (score >= 9000) return top.record;
    return null;
  }
  function escapeForGoalText(value) { return esc(value == null ? '' : String(value)); }
  function careerGoalSuggestionMarkup(query) {
    const panel = $('careerGoalSearchPanel');
    if (!panel) return;
    const q = String(query||'').trim();
    if (normalizeText(q).length < 2) { panel.hidden = true; panel.innerHTML=''; return; }
    const matches = searchCareerGoals(q, 8);
    if (!matches.length) {
      panel.innerHTML = `<div class="career-goal-search-caption">No close title match</div><p class="career-goal-db-note">Try a profession name, post title, exam or service—for example “India Post Postman”, “IAS Officer”, “Civil Engineer” or “Nurse”.</p>`;
      panel.hidden = false; return;
    }
    panel.innerHTML = `<div class="career-goal-search-caption">Matching goals from ${CAREER_GOAL_RECORDS.length.toLocaleString('en-IN')} career records</div>` + matches.map(record =>
      `<button type="button" class="career-goal-search-item" role="option" data-career-goal-id="${escapeForGoalText(record.goal_id)}"><span><strong>${escapeForGoalText(record.goal_title)}</strong><small>${escapeForGoalText(record.career_family)} · Typical education: ${escapeForGoalText(record.typical_entry_education)}</small></span><em>Use goal</em></button>`
    ).join('') + `<p class="career-goal-db-note">Choose a specific title to see its listed education requirements, selection route, skills, registrations and official starting points.</p>`;
    panel.hidden = false;
    panel.querySelectorAll('[data-career-goal-id]').forEach(button => button.addEventListener('click', () => {
      const record = CAREER_GOAL_RECORDS.find(item=>item.goal_id===button.dataset.careerGoalId);
      if (!record) return;
      $('careerGoalInput').value = record.goal_title;
      panel.hidden = true;
      updateRoadmapStreamVisibility();
      const level = $('roadmapEducationLevel').value || (profile && profile.educationLevel) || '';
      renderGoalRoadmap(record.goal_title, level, true, true);
    }));
  }
  function roadmapStreamValue() {
    const selected = $('roadmapStream') ? $('roadmapStream').value : '';
    if (selected) return selected;
    const existing = profile && profile.extra ? normalizeText(profile.extra.stream || '') : '';
    if (existing.includes('pcmb')) return 'pcmb';
    if (existing.includes('pcm')) return 'pcm';
    if (existing.includes('pcb')) return 'pcb';
    if (existing.includes('commerce')) return 'commerce';
    if (existing.includes('arts') || existing.includes('humanities')) return 'arts';
    if (existing.includes('vocational')) return 'vocational';
    return '';
  }
  function roadmapStreamLabel(value) {
    return ({pcm:'Science — PCM',pcb:'Science — PCB',pcmb:'Science — PCMB',commerce:'Commerce',arts:'Arts / Humanities',vocational:'Vocational',iti_diploma:'ITI / Diploma / Technical',other:'Other / not sure'})[value] || 'Not selected / not sure';
  }
  function updateRoadmapStreamVisibility() {
    const wrap = $('roadmapStreamRow');
    if (!wrap) return;
    const level = $('roadmapEducationLevel') ? $('roadmapEducationLevel').value : '';
    const query = normalizeText(($('careerGoalInput') && $('careerGoalInput').value) || '');
    const roleNeedsStream = /doctor|mbbs|nurs|engineer|engineering|pharmacy|pharmacist|pilot|aviation|jee|neet|btech|b\.e\.|b\.tech|medical/.test(query);
    const rank = roadmapLevelRank(level);
    wrap.hidden = !(roleNeedsStream || ['higher_secondary_11_12','diploma_polytechnic','bachelors_undergraduate'].includes(level) || rank >= 4);
  }
  function careerGoalMinimumRank(record) {
    const text = normalizeText([record && record.typical_entry_education,record && record.eligibility_summary,record && record.exams_or_selection].filter(Boolean).join(' '));
    if (/post-specific|post wise|post-wise|role-specific|depending on (the )?(employer|role|post|notification)|can require|may require|varies by|varies with|no single exam/.test(text)) return null;
    const ranks = [];
    if (/\bclass\s*8\b|\b8th\s*(pass|standard)?\b|middle school/.test(text)) ranks.push(2);
    if (/\bclass\s*10\b|\b10th\b|matriculation|matric pass/.test(text)) ranks.push(3);
    if (/\bclass\s*12\b|\b12th\b|10\s*\+\s*2|senior secondary|higher secondary/.test(text)) ranks.push(4);
    if (/\biti\b|diploma|polytechnic|trade certificate|ncvt|scvt/.test(text)) ranks.push(4);
    if (/\bphd\b|doctorate|doctoral/.test(text)) ranks.push(7);
    if (/postgraduate|master'?s degree|\bmasters?\b|\bm\.?tech\b|\bm\.?sc\b|\bm\.?pharm\b|\bmd\s*\/\s*ms\b|\bdnb\b/.test(text)) ranks.push(6);
    if (/bachelor|undergraduate|graduation|graduate degree|\bb\.?tech\b|\bb\.?e\.?\b|\bb\.?sc\b|\bbca\b|\bmbbs\b|\bllb\b|\bb\.?pharm\b|recognised medical degree|recognized medical degree/.test(text)) ranks.push(5);
    // Prefer the earliest supported alternative if the description explicitly lists multiple routes.
    return ranks.length ? Math.min(...ranks) : null;
  }
  function careerGoalProfileFit(record, level, stream, curatedKey, roadmap) {
    const rank = roadmapLevelRank(level);
    const required = careerGoalMinimumRank(record);
    let className = '', status = 'Details Needed', detail = 'The catalogue does not provide a single universal minimum education level for this role. Check the specific course or recruitment notice.';
    if (!level) detail = 'Select your current education level to compare it with the stated typical entry education.';
    else if (required !== null && rank >= 0 && rank < required) {
      className = 'future'; status = 'Future pathway';
      detail = `Your selected level (${LEVELS[level] || level}) is below the lowest education route identified in this record. Follow the earlier roadmap steps first.`;
    } else if (required !== null && rank >= required) {
      className = 'possible'; status = 'Education level may fit';
      detail = `Your selected level is at or above one listed education route (${record.typical_entry_education}). This does not confirm stream, marks, age, registration or recruitment eligibility.`;
    }
    const text = normalizeText([
      record && record.goal_title, record && record.typical_entry_education, record && record.eligibility_summary,
      record && record.exams_or_selection, roadmap && roadmap.title, roadmap && roadmap.summary,
      ...(roadmap && Array.isArray(roadmap.steps) ? roadmap.steps.map(step=>step.body) : [])
    ].filter(Boolean).join(' '));
    const requiresPCB = /\bpcb\b|physics.{0,60}(chemistry|&|and).{0,50}(biology|biotechnology)|biology.{0,50}(physics|chemistry)/.test(text) || curatedKey==='doctor';
    const requiresPCM = /\bpcm\b|physics.{0,60}(chemistry|&|and).{0,50}(mathematics|maths|math)/.test(text) || curatedKey==='engineer';
    let streamWarning = '';
    if (['pcm','pcb','pcmb','commerce','arts','vocational','iti_diploma'].includes(stream)) {
      if (requiresPCB && !['pcb','pcmb'].includes(stream)) streamWarning = 'The listed route appears to require Biology/PCB or an accepted equivalent. Your selected stream may not match; confirm the current official eligibility rules before treating this path as eligible.';
      else if (requiresPCM && !['pcm','pcmb'].includes(stream)) streamWarning = 'The listed route appears to require Mathematics/PCM or an accepted equivalent. Your selected stream may not match; confirm the current official eligibility rules before treating this path as eligible.';
      if (streamWarning) { className = 'caution'; status = 'Check subject eligibility'; }
    } else if (requiresPCB || requiresPCM) {
      streamWarning = 'This route appears to have specific science-subject requirements. Select your stream above or check the current official course/notice requirements.';
      if (status !== 'Future pathway') status = 'Stream details needed';
    }
    return {className,status,detail,streamWarning,requiredRank:required};
  }
  function careerGoalRelatedMatches(query, selectedRecord, limit=5) {
    return searchCareerGoals(query, 12).filter(record=>!selectedRecord || record.goal_id!==selectedRecord.goal_id).slice(0,limit);
  }
  function careerGoalStepTitle(text, index) {
    const n = normalizeText(text);
    if (/choose|select|decide|identify|define/.test(n)) return 'Choose the right route';
    if (/licen[cs]e|register|registration|membership|accredit/.test(n)) return 'Complete required registration or licence';
    if (/specialis|specializ|postgraduate|super.?special|\bmd\b|\bms\b|\bdnb\b|advanced qualification/.test(n)) return 'Specialise or progress further';
    if (/neet|jee|entrance|exam|test|selection|cbt|written|prelims|mains|qualify|recruitment/.test(n)) return 'Meet entrance and selection requirements';
    if (/apply|recruit|submit|interview|application/.test(n)) return 'Apply through the right route';
    if (/internship|clinical|practical training|industrial training|apprenticeship/.test(n)) return 'Complete practical training';
    if (/class 1|class 2|class 3|class 4|class 5|class 6|class 7|class 8|class 9|class 10|class 11|class 12|school|subjects|foundation/.test(n) && index===0) return 'Meet the entry education requirements';
    if (/build|gain|develop|practise|practice|portfolio|experience|project|skills/.test(n)) return 'Build practical skills and experience';
    if (/check|verify|read|meet|confirm|eligib|requirements/.test(n)) return 'Check qualification and requirements';
    if (index===0) return 'Start with the right qualification';
    if (index===1) return 'Meet the course or selection requirements';
    if (index===2) return 'Complete the core qualification';
    if (index===3) return 'Complete required practical experience';
    if (index===4) return 'Register, apply or progress further';
    return `Step ${index+1}`;
  }

  function matchRoadmapKey(goal) {
    const x=normalizeText(goal);
    const rules=[
      ['doctor',/\bdoctor\b|\bmbbs\b|surgeon|medical doctor|डॉक्टर|चिकित्सक/],
      ['nurse',/\bnurs(e|ing)\b|nursing career|staff nurse|नर्स|नर्सिंग/],
      ['civil_service',/\bias\b|\bips\b|\bupsc\b|civil service|civil services|district magistrate|collector|आईएएस|आईपीएस|यूपीएससी/],
      ['ca',/\bca\b|chartered accountant|accountant|accounting career|सीए|चार्टर्ड अकाउंटेंट/],
      ['lawyer',/\blawyer\b|\badvocate\b|\blaw\b|legal career|वकील|कानून/],
      ['pilot',/\bpilot\b|commercial pilot|aviation|पायलट/],
      ['defence',/\bdefen[cs]e\b|\barmy\b|\bnavy\b|\bair force\b|\bnda\b|\bcds\b|armed forces|अफसर|आर्मी|नेवी|वायु सेना|डिफेंस/],
      ['teacher',/\bteacher\b|teaching|lecturer|professor|शिक्षक|टीचर|अध्यापक/],
      ['pharmacist',/pharmacist|pharmacy|\bd\.?pharm\b|\bb\.?pharm\b|फार्मासिस्ट|फार्मेसी/],
      ['data_analyst',/data analyst|data scientist|data science|business analyst|डेटा एनालिस्ट|डेटा साइंस/],
      ['police',/\bpolice\b|constable|sub.?inspector|\bsi\b|law enforcement|पुलिस|कांस्टेबल/],
      ['startup',/startup|start a business|business owner|entrepreneur|founder|own business|अपना बिजनेस|व्यवसाय|स्टार्टअप/],
      ['scientist',/scientist|researcher|research scientist|\bphd\b|research career|वैज्ञानिक|रिसर्चर/],
      ['software',/software|web developer|app developer|programmer|coding career|\bdeveloper\b|\bcoder\b|computer engineer|\bit engineer\b|software engineer|सॉफ्टवेयर|प्रोग्रामर|डेवलपर/],
      ['engineer',/engineer|engineering|\bbtech\b|\bbe\b|civil engineer|mechanical engineer|electrical engineer|इंजीनियर|अभियांत्रिकी/],
      ['government_job',/government job|govt job|sarkari naukri|सरकारी नौकरी|सरकारी जॉब/]
    ];
    const found=rules.find(([key,re])=>re.test(x));
    return found ? found[0] : 'general';
  }

  function roadmapLevelRank(level) {
    return ({no_formal_education:0,primary_1_5:1,middle_6_8:2,secondary_9_10:3,higher_secondary_11_12:4,diploma_polytechnic:4,bachelors_undergraduate:5,masters_postgraduate:6,phd_doctoral:7,other:3})[level] ?? -1;
  }
  function roadmapFocusIndex(key, level) {
    const rank=roadmapLevelRank(level);
    if(rank<0) return 0;
    switch(key){
      case 'software': case 'engineer': return rank<=3?0:(level==='higher_secondary_11_12'?1:level==='diploma_polytechnic'?2:3);
      case 'doctor': return rank<=3?0:(rank===4?1:2);
      case 'nurse': return rank<=3?0:(rank===4?2:3);
      case 'civil_service': return rank<=4?0:(rank===5?1:2);
      case 'teacher': return rank<=3?0:(rank===4?1:(rank===5?2:3));
      case 'ca': return rank<=3?0:(rank===4?1:2);
      case 'lawyer': return rank<=3?0:(rank===4?1:2);
      case 'pilot': return rank<=3?0:(rank===4?1:2);
      case 'defence': return rank<=3?0:(rank===4?1:2);
      case 'data_analyst': return rank<=3?0:(rank===4?1:2);
      case 'pharmacist': return rank<=3?0:(rank===4?1:2);
      case 'police': return rank<=3?0:(rank===4?1:2);
      case 'scientist': return rank<=4?0:(rank===5?1:2);
      case 'government_job': return rank<=4?0:1;
      default: return 0;
    }
  }
  function syncGoalPlannerFromProfile() {
    if(!$('goalRoadmapForm')) return;
    const goal=(profile&&profile.goal)||'';
    $('careerGoalInput').value=goal;
    $('roadmapEducationLevel').value=(profile&&profile.educationLevel)||'';
    if($('roadmapStream')) $('roadmapStream').value=(profile&&profile.goalStream)||'';
    $('goalRoadmapError').hidden=true;
    updateRoadmapStreamVisibility();
    careerGoalSuggestionMarkup(goal);
    if(goal) renderGoalRoadmap(goal, $('roadmapEducationLevel').value, false, false);
    else $('careerRoadmapResult').hidden=true;
  }
  function renderGoalRoadmap(goal, level, shouldScroll=true, persist=true) {
    const result=$('careerRoadmapResult');
    const cleanGoal=String(goal||'').trim();
    if(!cleanGoal){
      $('goalRoadmapError').textContent='Please enter what you want to become.';
      $('goalRoadmapError').hidden=false;
      $('careerGoalInput').focus();
      return;
    }
    $('goalRoadmapError').hidden=true;
    const effectiveLevel=level || (profile&&profile.educationLevel) || '';
    const key=matchRoadmapKey(cleanGoal);
    const goalRecord=findCareerGoalForRoadmap(cleanGoal,key);
    let roadmap;
    if(goalRecord){
      const template=CAREER_GOAL_TEMPLATES[goalRecord.pathway_template_id] || {};
      const sourceSteps=Array.isArray(goalRecord.how_to_become)&&goalRecord.how_to_become.length ? goalRecord.how_to_become : (template.how_to_become||[]);
      const sourceLinks=(Array.isArray(goalRecord.official_starting_points)?goalRecord.official_starting_points:[])
        .filter(link=>link&&/^https?:\/\//i.test(String(link.url||''))).slice(0,6)
        .map(link=>({label:String(link.label||link.url),url:String(link.url),relevance:String(link.relevance||'')}));
      roadmap={
        title:`${goalRecord.goal_title} — how to become`,
        summary:goalRecord.eligibility_summary || `Career family: ${goalRecord.career_family}. Follow the role-specific steps and check current rules.`,
        steps:sourceSteps.map((body,index)=>({title:careerGoalStepTitle(String(body),index),body:String(body)})),
        links:sourceLinks
      };
    } else {
      roadmap=ROADMAP_TEMPLATES[key]||ROADMAP_TEMPLATES.general;
    }
    const levelRank=roadmapLevelRank(effectiveLevel);
    const genericFocus=roadmapFocusIndex(key,effectiveLevel);
    const entryRank=goalRecord?careerGoalMinimumRank(goalRecord):null;
    const focus=goalRecord && levelRank>=0 && entryRank!==null
      ? Math.max(0,Math.min(roadmap.steps.length-1, levelRank < entryRank ? 0 : levelRank-entryRank+1))
      : genericFocus;
    const levelLabel=LEVELS[effectiveLevel] || 'Education level not selected — general roadmap';
    const currentState=profile&&profile.state ? ` · ${profile.state}` : '';
    const summary=effectiveLevel
      ? `Based on your current level (${levelLabel})${currentState}, the highlighted step is the suggested starting point. This is a planning suggestion, not a formal eligibility decision.`
      : 'Choose your current education level for a more tailored starting point. You can still use this general sequence now.';
    const stream=roadmapStreamValue();
    const fit=goalRecord?careerGoalProfileFit(goalRecord,effectiveLevel,stream,key,roadmap):careerGoalProfileFit(null,effectiveLevel,stream,key,roadmap);
    const eligibilityPanel=goalRecord?`
      <section class="goal-eligibility-panel" aria-label="Eligibility requirements for this career">
        <h5 class="goal-eligibility-heading">Eligibility and route details</h5>
        <div class="goal-eligibility-grid">
          <div class="goal-eligibility-cell"><strong>Typical entry education</strong><p>${escapeForGoalText(goalRecord.typical_entry_education || 'Not specified in this record.')}</p></div>
          <div class="goal-eligibility-cell"><strong>Your profile — preliminary check</strong><span class="goal-profile-fit ${escapeForGoalText(fit.className)}">${escapeForGoalText(fit.status)}</span><p>${escapeForGoalText(fit.detail)}</p>${stream?`<p style="margin-top:6px"><strong>Stream:</strong> ${escapeForGoalText(roadmapStreamLabel(stream))}</p>`:''}${fit.streamWarning?`<p style="margin-top:6px;color:#9e3542"><strong>Subject check:</strong> ${escapeForGoalText(fit.streamWarning)}</p>`:''}</div>
          <div class="goal-eligibility-cell wide"><strong>Eligibility summary</strong><p>${escapeForGoalText(goalRecord.eligibility_summary || 'No detailed eligibility summary is recorded.')}</p></div>
          <div class="goal-eligibility-cell"><strong>Exams / selection</strong><p>${escapeForGoalText(goalRecord.exams_or_selection || 'Role-specific selection route not recorded.')}</p></div>
          <div class="goal-eligibility-cell"><strong>Licence / registration</strong><p>${escapeForGoalText(goalRecord.licence_registration || 'Check whether the exact role is regulated.')}</p></div>
          <div class="goal-eligibility-cell"><strong>Skills to build</strong>${Array.isArray(goalRecord.skills_to_build)&&goalRecord.skills_to_build.length?`<ul>${goalRecord.skills_to_build.slice(0,8).map(skill=>`<li>${escapeForGoalText(skill)}</li>`).join('')}</ul>`:'<p>Skills are role-specific; check current job descriptions.</p>'}</div>
          <div class="goal-eligibility-cell"><strong>Employment routes</strong>${Array.isArray(goalRecord.employment_routes)&&goalRecord.employment_routes.length?`<ul>${goalRecord.employment_routes.slice(0,8).map(route=>`<li>${escapeForGoalText(route)}</li>`).join('')}</ul>`:'<p>Employment route depends on employer and qualification.</p>'}</div>
        </div>
        <div class="goal-eligibility-sources">${roadmap.links.map(link=>`<a href="${escapeForGoalText(link.url)}" target="_blank" rel="noopener noreferrer">${escapeForGoalText(link.label)} ↗</a>`).join('')}</div>
        <p class="career-goal-db-note">Catalogue status: ${escapeForGoalText(goalRecord.verification_status || 'Not recorded')}. These career-pathway seed records are not individually verified eligibility decisions. Confirm age, marks, branch/stream, domicile, category, licence, service conditions and current notification for the exact post/course.</p>
      </section>`:'';
    const fallbackEligibilityPanel=!goalRecord?`<section class="goal-eligibility-panel" aria-label="Preliminary eligibility check"><h5 class="goal-eligibility-heading">Your criteria — preliminary route check</h5><div class="goal-eligibility-grid"><div class="goal-eligibility-cell"><strong>Current education</strong><span class="goal-profile-fit ${escapeForGoalText(fit.className)}">${escapeForGoalText(fit.status)}</span><p>${escapeForGoalText(fit.detail)}</p></div><div class="goal-eligibility-cell"><strong>Stream / subjects</strong><p>${escapeForGoalText(stream?roadmapStreamLabel(stream):'Not selected / not sure')}</p>${fit.streamWarning?`<p style="margin-top:6px;color:#9e3542"><strong>Subject check:</strong> ${escapeForGoalText(fit.streamWarning)}</p>`:`<p style="margin-top:6px">This general roadmap does not by itself verify subject eligibility. Review the specific course/post notice.</p>`}</div><div class="goal-eligibility-cell wide"><strong>What this roadmap can establish</strong><p>${escapeForGoalText(roadmap.summary)} Exam, age, marks, stream, category, domicile, licence and vacancy conditions vary by the exact profession and its official notice. Choose a specific goal suggestion below to view the matching catalogue record if available.</p></div></div></section>`:'';
    const related=careerGoalRelatedMatches(cleanGoal,goalRecord,5);
    const relatedHtml=related.length?`<div class="goal-related-goals"><strong>${goalRecord?'Related career goals in the database':'Closest searchable goals — choose one for role-specific eligibility'}</strong><div class="goal-related-list">${related.map(record=>`<button type="button" data-roadmap-goal-id="${escapeForGoalText(record.goal_id)}">${escapeForGoalText(record.goal_title)}</button>`).join('')}</div></div>`:'';
    const recordStatus=goalRecord?`<p class="career-goal-db-note">Matched catalogue record: ${escapeForGoalText(goalRecord.goal_id)} · ${escapeForGoalText(goalRecord.career_family)} · Pathway family: ${escapeForGoalText((CAREER_GOAL_TEMPLATES[goalRecord.pathway_template_id]||{}).label||goalRecord.pathway_template_id||'not recorded')}</p>`:'';
    const noExactNotice=!goalRecord?`<p class="career-goal-db-note">No exact career-title record was selected for this wording. The general roadmap below is based on the matching route template. Use the suggestions to choose a specific occupation from the ${CAREER_GOAL_RECORDS.length.toLocaleString('en-IN')}-goal database and view its recorded eligibility fields.</p>`:'';
    result.innerHTML=`
      <div class="roadmap-result-head">
        <div><p class="roadmap-result-kicker">${escapeForGoalText(t('YOUR ROADMAP'))}</p><h4>${escapeForGoalText(roadmap.title)}</h4><p><strong>${escapeForGoalText(t('Your goal'))}:</strong> ${escapeForGoalText(goalRecord?goalRecord.goal_title:cleanGoal)}</p></div>
        <span class="roadmap-level-chip">${escapeForGoalText(levelLabel)}</span>
      </div>
      <p class="roadmap-summary">${escapeForGoalText(roadmap.summary)}<br><strong>${escapeForGoalText(summary)}</strong></p>
      ${recordStatus}${noExactNotice}${goalRecord?eligibilityPanel:fallbackEligibilityPanel}
      <div class="roadmap-steps">${roadmap.steps.map((step,index)=>`<article class="roadmap-step ${index===focus?'is-focus':''}"><span class="roadmap-number">${index+1}</span><div class="roadmap-step-body"><p class="roadmap-step-state">${index===focus?escapeForGoalText(t('START HERE')):`${escapeForGoalText(t('STEP'))} ${index+1}`}</p><h5>${escapeForGoalText(step.title)}</h5><p>${escapeForGoalText(step.body)}</p></div></article>`).join('')}</div>
      <div class="roadmap-links"><strong>${escapeForGoalText(t('Useful official starting points'))}</strong>${roadmap.links.map(link=>`<a href="${escapeForGoalText(link.url)}" target="_blank" rel="noopener noreferrer">${escapeForGoalText(link.label)} ↗</a>`).join('')}</div>
      ${relatedHtml}
      <p class="roadmap-disclaimer">${escapeForGoalText(t('Important:'))} ${escapeForGoalText(t('Entry requirements, exams, licences, age limits, subject requirements and application dates can change. Follow the current official notification for your exact role/state before spending money or applying. No admission, job or funding is guaranteed by this roadmap.'))}</p>`;
    result.hidden=false;
    result.querySelectorAll('[data-roadmap-goal-id]').forEach(button=>button.addEventListener('click',()=>{
      const record=CAREER_GOAL_RECORDS.find(item=>item.goal_id===button.dataset.roadmapGoalId);
      if(!record)return;
      $('careerGoalInput').value=record.goal_title;
      $('careerGoalSearchPanel').hidden=true;
      updateRoadmapStreamVisibility();
      renderGoalRoadmap(record.goal_title,$('roadmapEducationLevel').value || (profile&&profile.educationLevel)||'',true,true);
    }));
    if(persist){
      // Store the selected goal/stream separately; keep all existing opportunity records untouched.
      if(effectiveLevel && $('educationLevel').value!==effectiveLevel){
        $('educationLevel').value=effectiveLevel;
        $('educationLevel').dataset.lastSelectedLevel=effectiveLevel;
        renderAdaptiveFields(true);
      }
      const chosenStream=stream;
      profile=collectProfile();
      profile.goal=goalRecord?goalRecord.goal_title:cleanGoal;
      profile.goalStream=chosenStream;
      profile.educationLevel=effectiveLevel;
      profile.educationLevelLabel=LEVELS[effectiveLevel]||'Not specified';
      saveProfile(profile);
      $('careerGoalInput').value=profile.goal;
      $('roadmapEducationLevel').value=effectiveLevel;
      if($('roadmapStream') && chosenStream) $('roadmapStream').value=chosenStream;
    }
    if(shouldScroll) setTimeout(()=>result.scrollIntoView({behavior:'smooth',block:'start'}),50);
  }
  function submitGoalRoadmap(event) {
    event.preventDefault();
    const goal=$('careerGoalInput').value.trim();
    const selectedLevel=$('roadmapEducationLevel').value || (profile&&profile.educationLevel) || '';
    renderGoalRoadmap(goal, selectedLevel, true, true);
  }

  function renderJobsCareer() {
    const all = careerAllRecords();
    const profileParts = profile ? [profile.name, profile.educationLevelLabel || LEVELS[profile.educationLevel] || '', profile.city, profile.district, profile.state].filter(Boolean) : [];
    $('jobsProfileSummary').innerHTML = `<strong>Profile:</strong> ${profileParts.length ? profileParts.map(esc).join(' · ') : 'No profile details saved'} <span>Career results are browsable for all education levels by default.</span>`;
    $('careerGovernmentCount').textContent = all.filter(r => r.opportunity_type === 'government_job').length;
    $('careerPortalCount').textContent = all.filter(r => r.opportunity_type === 'recruitment_portal').length;
    $('careerPrivateCount').textContent = all.filter(r => r.opportunity_type === 'private_job').length;
    $('careerStartupCount').textContent = all.filter(r => r.opportunity_type === 'startup_scheme').length;

    const query = $('careerSearchInput').value.trim().toLowerCase();
    const type = $('careerTypeFilter').value;
    const status = $('careerStatusFilter').value;
    let list = all.filter(r => {
      if (type !== 'all' && r.opportunity_type !== type) return false;
      if (status !== 'all' && recordStatus(r) !== status) return false;
      if (!careerMatchesEducation(r)) return false;
      if ($('careerOnlyWithUrl').checked && !careerHasUsableSource(r)) return false;
      if (query && !careerRecordSearchText(r).includes(query)) return false;
      return true;
    });
    const statusOrder = {Open:0, Upcoming:1, 'Deadline Unknown':2, Closed:3};
    list.sort((a,b) => (statusOrder[recordStatus(a)] ?? 4) - (statusOrder[recordStatus(b)] ?? 4) || String(a.title||'').localeCompare(String(b.title||'')));
    const visible = list.slice(0, careerVisibleLimit);
    $('careerResultCount').textContent = `Showing ${visible.length} of ${list.length} matching records (${all.length} searchable career records in this view).`;
    $('careerResultsScope').textContent = profile && profile.educationLevel ? `Profile level: ${LEVELS[profile.educationLevel] || profile.educationLevel}. Education matching is optional; use the checkbox to narrow results.` : 'Select an education level in your profile to use the optional education-match filter.';
    $('careerResults').innerHTML = visible.map(careerCard).join('');
    $('careerEmptyState').hidden = list.length !== 0;
    $('careerResults').hidden = list.length === 0;
    $('careerLoadMore').hidden = visible.length >= list.length;
    $('careerLoadMore').textContent = `Load more records (${Math.min(list.length-visible.length,40)} more)`;
    $('careerNotice').textContent = 'Research database only. “Listed Open” means a supplied source reported an opening, not that the form is guaranteed to accept applications now. Confirm the live notification, last date, age, education/stream/trade, domicile and other eligibility before applying. Apprenticeship/training, contractual engagement, regular government employment, startup recognition, grant, subsidy and repayable loan are different categories.';
  }
  function openJobsCareer() {
    profile = collectProfile(); saveProfile(profile);
    $('profileStep').hidden = true; $('categoriesStep').hidden = true; $('educationProfileStep').hidden = true; $('educationStep').hidden = true; $('jobsCareerStep').hidden = false;
    careerVisibleLimit = 40;
    setProgress(2); renderJobsCareer(); applyStaticTranslations(); window.scrollTo({top:0,behavior:'smooth'});
  }
  function resetCareerFilters() {
    $('careerSearchInput').value = ''; $('careerTypeFilter').value = 'all'; $('careerStatusFilter').value = 'all'; $('careerMatchEducation').checked = false; $('careerOnlyWithUrl').checked = false; careerVisibleLimit = 40; renderJobsCareer();
  }

  function renderResults() {
    const list=getFilteredRecords();
    $('resultCount').textContent=`${list.length} ${list.length===1?'record':'records'}`;
    $('resultsTitle').textContent=selectedSubsection?t(selectedSubsection):t('Education opportunities for your profile');
    $('resultsDescription').textContent=selectedSubsection
      ? `${uiLanguage==='hi'?'इस सेक्शन के लिए शिक्षा-स्तर से मेल खाते रिसर्च रिकॉर्ड: ':uiLanguage==='gu'?'આ વિભાગ માટે શિક્ષણ સ્તર સાથે મેળ ખાતા સંશોધન રેકોર્ડ: ':'Research records tagged to your selected education level under '}${t(selectedSubsection)}.`
      : profile?.educationLevel
        ? (uiLanguage==='hi'?`${t(LEVELS[profile.educationLevel])} के लिए टैग किए रिकॉर्ड। कोई अवसर पात्रता की आधिकारिक पुष्टि नहीं है।`:uiLanguage==='gu'?`${t(LEVELS[profile.educationLevel])} માટે ટૅગ કરેલા રેકોર્ડ. આ સત્તાવાર પાત્રતા નિર્ણય નથી.`:`Records tagged for ${t(LEVELS[profile.educationLevel])}. These are relevance suggestions, not an official eligibility decision.`)
        : t('Choose a relevant subsection and select an education level in your profile for personalized records.');
    const notice=[];
    if(!profile?.educationLevel) notice.push(t('Education level has not been selected. Choose one to receive profile-relevant catalogue records.'));
    else notice.push(t('Opportunity records are restricted to their education-level tags. Marks, age, income, category, domicile and course-specific eligibility are not fully evaluated by this prototype.'));
    notice.push(t('This is a provisional research inventory; an “Open” label is not a guarantee that the application window remains open.'));
    $('resultNotice').hidden=false; $('resultNotice').textContent=notice.join(' ');
    $('opportunityResults').innerHTML=list.map(recordCard).join('');
    $('emptyState').hidden=list.length!==0;
    $('opportunityResults').hidden=list.length===0;
  }
  function valueText(value) {
    if(value==null||value==='') return '';
    if(typeof value==='string'||typeof value==='number'||typeof value==='boolean') return String(value);
    if(Array.isArray(value)) return value.map(valueText).filter(Boolean).join('; ');
    return Object.entries(value).map(([k,v])=>`${k.replaceAll('_',' ')}: ${valueText(v)}`).filter(x=>!x.endsWith(': ')).join(' · ');
  }
  function listHtml(arr, empty) {
    if(!Array.isArray(arr)||!arr.length) return `<p>${esc(empty)}</p>`;
    return `<ul>${arr.map(x=>`<li>${esc(valueText(x))}</li>`).join('')}</ul>`;
  }
  function showDetails(id) {
    const r=records.find(x=>x.id===id); if(!r)return;
    lastFocus=document.activeElement;
    $('detailTitle').textContent=r.title; $('detailMeta').textContent=`${r.id} · ${t(typeLabel(r.opportunity_type))} · ${r.administrative_scope||'Scope not recorded'}`;
    const v=verificationDetails(r);
    const validSources=(r.sources||[]).filter(s=>s&&/^https?:\/\//i.test(String(s.url||''))); const sources=validSources.length ? validSources.map(s=>`<a class="source-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name||s.url)} ↗<small>${esc(s.type||'source')} · ${esc(s.verification_status||'verification status not recorded')} · ${esc(s.last_checked?`Checked ${s.last_checked}`:'check date not recorded')}</small></a>`).join('') : '<p>No usable URL is recorded. Open the named official portal manually and confirm the current notice.</p>';
    const rules=r.eligibility_rules&&r.eligibility_rules.length?listHtml(r.eligibility_rules,'Eligibility details not recorded.'): `<p>${esc(r.eligibility_summary||'Eligibility details have not been verified in this record.')}</p>`;
    const dates=(r.dates||[]).length?`<ul>${r.dates.map(d=>`<li><strong>${esc(String(d.event_type||'Date').replaceAll('_',' '))}</strong>: ${esc(d.date?fmtDate(d.date):'Deadline unknown')} · ${esc(d.cycle||'Cycle not recorded')} · ${esc(d.source||'source not recorded')}</li>`).join('')}</ul>`:'<p>No verified application date is recorded. Do not infer a deadline.</p>';
    const verified=(r.verified_fields||[]).length?listHtml(r.verified_fields,'No verified fields listed.'):'<p>No verified fields listed.</p>';
    const unresolved=(r.unresolved_fields||[]).length?listHtml(r.unresolved_fields,'No unresolved fields recorded.'):'<p>No unresolved fields recorded.</p>';
    const benefits=(r.benefits||[]).length?listHtml(r.benefits,'Benefits are not fully verified.'):'<p>Benefits are not fully verified in this research record.</p>';
    const docs=(r.required_documents||[]).length?listHtml(r.required_documents,'Document details are not fully verified.'):`<p>Document list is not fully verified (${esc(r.document_list_status||'status not recorded')}).</p>`;
    const levels=(r.education_levels||[]).map(x=>LEVELS[x]||x).join(', ')||'Education level not recorded';
    $('detailContent').innerHTML=`<div class="detail-banner"><strong>Relevance is not official eligibility.</strong><br>${esc(r.description||'Description not recorded.')}<div class="detail-status-row"><span class="verify-pill ${v.className}">${esc(v.label)}</span><span class="status-pill ${statusClass(recordStatus(r))}">${esc(t(listedStatusText(r)))}</span><span class="small-tag">${esc(r.publication_readiness||'readiness not recorded')}</span></div></div><div class="detail-layout"><section class="detail-section"><h4>${esc(t('Education levels'))}</h4><p>${esc(levels)}</p></section><section class="detail-section"><h4>${esc(t('Cycle & status'))}</h4><p>Cycle: ${esc(r.application_cycle||'Not recorded')}<br>Last verified: ${esc(r.last_verified_at||'Not recorded')}</p></section><section class="detail-section wide"><h4>${esc(t('Eligibility notes'))}</h4>${rules}</section><section class="detail-section"><h4>${esc(t('Benefits'))}</h4>${benefits}</section><section class="detail-section"><h4>${esc(t('Required documents'))}</h4>${docs}</section><section class="detail-section wide"><h4>${esc(t('Application dates'))}</h4>${dates}</section><section class="detail-section wide"><h4>${esc(t('Official source links'))}</h4>${sources}</section><section class="detail-section"><h4>${esc(t('Fields checked'))}</h4>${verified}</section><section class="detail-section"><h4>${esc(t('Still needs verification'))}</h4>${unresolved}</section></div>`;
    $('detailModal').hidden=false; document.body.style.overflow='hidden'; $('closeModal').focus();
  }
  function closeDetails() { $('detailModal').hidden=true; document.body.style.overflow=''; if(lastFocus&&typeof lastFocus.focus==='function')lastFocus.focus(); }
  function resetFilters() {
    renderPathwayGuide();
    $('searchInput').value=''; $('typeFilter').value='all'; $('statusFilter').value='all'; $('sortFilter').value='relevant'; renderResults();
  }
  function resetSavedProfile() {
    if(!confirm('Clear the locally saved profile and reset the form?')) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
    $('profileForm').reset(); $('country').value='India'; $('state').value=''; $('educationLevel').dataset.lastSelectedLevel=''; populateDistricts(''); $('district').disabled=true; $('district').innerHTML='<option value="">Select state first</option>';
    $('otherDistrictField').classList.add('hidden'); if($('careerGoalInput')) $('careerGoalInput').value=''; if($('roadmapEducationLevel')) $('roadmapEducationLevel').value=''; if($('careerRoadmapResult')) $('careerRoadmapResult').hidden=true; if($('goalRoadmapError')) $('goalRoadmapError').hidden=true; renderAdaptiveFields(false); profile=null; selectedSubsection=null; goTo(1); showToast('Saved browser profile cleared.');
  }
  function populateTypes() {
    const values=[...new Set(records.filter(r=>r.category!=='jobs_careers_startups').map(r=>r.opportunity_type).filter(Boolean))].sort();
    values.forEach(v=>$('typeFilter').add(new Option(typeLabel(v),v)));
  }
  function init() {
    try { uiLanguage=localStorage.getItem('opportunity-finder-language')||'en'; } catch(e) { uiLanguage='en'; }
    $('languageSelect').value=['en','hi','gu','bn','mr','ta','te','kn','ml','pa','ur','or','as'].includes(uiLanguage)?uiLanguage:'en';
    fillStates(); populateTypes();
    $('state').addEventListener('change',()=>{populateDistricts($('state').value); $('otherDistrict').value=''; applyStaticTranslations();});
    $('district').addEventListener('change',()=>{ $('otherDistrictField').classList.toggle('hidden',$('district').value!=='__other__'); updateCitySuggestions(); applyStaticTranslations(); });
    $('country').addEventListener('change',()=>{countryChanged();applyStaticTranslations();});
    $('educationLevel').addEventListener('change',()=>{
      const select=$('educationLevel');
      const previous=select.dataset.lastSelectedLevel||'';
      const current=select.value;
      if(previous!==current){
        $('adaptiveEducationFields').innerHTML='<div class="adaptive-placeholder"><span class="placeholder-spark">✦</span><div><strong>Your form adapts to you</strong><p>Select an education level above to see only the relevant follow-up questions. You can skip optional details.</p></div></div>';
        select.dataset.lastSelectedLevel=current;
      }
      if(!$('educationProfileStep').hidden){renderAdaptiveFields(false);profile=collectProfile();updateEducationProfileContext();}
      applyStaticTranslations();
    });
    $('profileForm').addEventListener('submit',event=>{
      event.preventDefault();
      const name=$('fullName').value.trim();
      if(!name){$('profileError').hidden=false;$('profileError').textContent='Please enter your name before continuing.';$('fullName').focus();return;}
      if($('dob').value && ageFromDob($('dob').value)===null){$('profileError').hidden=false;$('profileError').textContent='Please check the date of birth.';$('dob').focus();return;}
      $('profileError').hidden=true; enterCategories();
    });
    $('goalRoadmapForm').addEventListener('submit',submitGoalRoadmap);
    $('roadmapEducationLevel').addEventListener('change',()=>{ updateRoadmapStreamVisibility(); if(!$('roadmapEducationLevel').value) return; });
    $('careerGoalInput').addEventListener('input',()=>{ careerGoalSuggestionMarkup($('careerGoalInput').value); updateRoadmapStreamVisibility(); if(profile){ profile.goal=$('careerGoalInput').value.trim(); saveProfile(profile); } });
    if($('roadmapStream')) $('roadmapStream').addEventListener('change',()=>{ if(profile){profile.goalStream=$('roadmapStream').value;saveProfile(profile);} if(!$('careerRoadmapResult').hidden && $('careerGoalInput').value.trim()) renderGoalRoadmap($('careerGoalInput').value,$('roadmapEducationLevel').value || (profile&&profile.educationLevel)||'',false,false); });
    document.querySelectorAll('[data-goal-preset]').forEach(btn=>btn.addEventListener('click',()=>{ $('careerGoalInput').value=btn.dataset.goalPreset||''; $('careerGoalInput').focus(); $('goalRoadmapError').hidden=true; careerGoalSuggestionMarkup($('careerGoalInput').value); updateRoadmapStreamVisibility(); if(profile){profile.goal=$('careerGoalInput').value;saveProfile(profile);} }));
    document.addEventListener('click',event=>{const panel=$('careerGoalSearchPanel');if(panel&&!panel.contains(event.target)&&event.target!==$('careerGoalInput'))panel.hidden=true;});
    $('careerGoalInput').addEventListener('keydown',event=>{if(event.key==='Escape'&&$('careerGoalSearchPanel'))$('careerGoalSearchPanel').hidden=true;});
    $('backToProfile').addEventListener('click',()=>goTo(1));
    $('educationCategory').addEventListener('click',openEducation);
    $('jobsCareerCategory').addEventListener('click',openJobsCareer);
    document.querySelectorAll('[data-disabled-category]').forEach(el=>el.addEventListener('click',()=>showToast(`${el.dataset.disabledCategory} is planned but inactive in this prototype.`)));
    $('backToCategories').addEventListener('click',()=>goTo(2)); $('editEducationProfile').addEventListener('click',()=>goTo(1));
    $('backFromJobs').addEventListener('click',()=>goTo(2)); $('editProfileFromJobs').addEventListener('click',()=>goTo(1));
    ['careerSearchInput','careerTypeFilter','careerStatusFilter','careerMatchEducation','careerOnlyWithUrl'].forEach(id => $(id).addEventListener(id==='careerSearchInput'?'input':'change',()=>{careerVisibleLimit=40;renderJobsCareer();}));
    $('careerResults').addEventListener('click',e=>{const btn=e.target.closest('[data-detail-id]');if(btn)showDetails(btn.dataset.detailId);});
    $('careerLoadMore').addEventListener('click',()=>{careerVisibleLimit+=40;renderJobsCareer();}); $('resetCareerFilters').addEventListener('click',resetCareerFilters);
    $('backFromEducationProfile').addEventListener('click',()=>{profile=collectProfile();saveProfile(profile);goTo(2);applyStaticTranslations();});
    $('continueToEducation').addEventListener('click',openEducationDiscovery);
    ['searchInput','typeFilter','statusFilter','sortFilter'].forEach(id=>$(id).addEventListener(id==='searchInput'?'input':'change',renderResults));
    $('opportunityResults').addEventListener('click',e=>{const btn=e.target.closest('[data-detail-id]');if(btn)showDetails(btn.dataset.detailId);});
    $('resetFilters').addEventListener('click',resetFilters); $('backToSubsections').addEventListener('click',()=>$('subsectionGrid').scrollIntoView({behavior:'smooth',block:'start'}));
    $('closeModal').addEventListener('click',closeDetails); $('closeModalBottom').addEventListener('click',closeDetails); $('detailModal').addEventListener('click',e=>{if(e.target===$('detailModal'))closeDetails();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('detailModal').hidden)closeDetails();});
    $('clearSaved').addEventListener('click',resetSavedProfile);
    $('languageSelect').addEventListener('change',e=>setLanguage(e.target.value));
    $('dob').max=new Date().toISOString().slice(0,10);
    populateDistricts(''); $('district').disabled=true;
    try { const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'); if(saved&&saved.name) applyProfile(saved); } catch(e) {}
    applyStaticTranslations();
  }
  init();
})();
