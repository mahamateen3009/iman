import type { QAResponse } from '../types/chat';
import type { HadithReference } from '../types/chat';

interface QAEntry {
  patterns: RegExp[];
  keywords?: string[];
  answer: string;
  sources: string[];
}

const QA_DATABASE: QAEntry[] = [
  {
    patterns: [
      /prophet.*say.*women.*bow.*husband/i,
      /women.*bow.*husband.*prophet/i,
      /husband.*bow.*prophet.*women/i,
      /if.*permitted.*women.*bow.*husband/i,
      /prostrate.*husband.*prophet/i,
    ],
    keywords: ['women bow', 'bow to husband', 'prostrate to husband', 'women prostrate', 'bow husband'],
    answer: 'No, the Prophet Muhammad (peace be upon him) did not say that women should bow or prostrate to their husbands. The authentic hadith in question is from Sunan an-Nasa\'i and Tirmidhi, where the Prophet (PBUH) said: "If I were to command anyone to prostrate to anyone other than Allah, I would have commanded a woman to prostrate to her husband." The key phrase is "If I were to command" — meaning he did NOT command it. Prostration is exclusively for Allah. The hadith emphasizes the importance and high status of a husband\'s rights in marriage, but it explicitly prohibits bowing or prostrating to anyone other than Allah. No scholar has ever interpreted this as permitting women to physically bow to their husbands. It is about honoring the marital relationship, not about physical prostration.',
    sources: [
      'Sunan an-Nasa\'i, Book of Nikah, Hadith 3255',
      'Jami at-Tirmidhi, Book of Suckling, Hadith 1153',
      'Sunan Abi Dawud, Hadith 1829',
    ],
  },
  {
    patterns: [
      /did.*prophet.*say.*women/i,
      /what.*prophet.*say.*about.*women/i,
      /prophet.*teach.*about.*women/i,
    ],
    keywords: ['prophet say about women', 'prophet women', 'women in islam', 'prophet teach women'],
    answer: 'The Prophet Muhammad (peace be upon him) taught that women are equal to men in spiritual standing and reward. In his Final Sermon, he said: "O people, your women have rights over you and you have rights over your women." He also said: "The best of you are those who are best to their wives" (Tirmidhi). He elevated the status of women in a society where female infants were buried alive. He gave women the right to inherit, to own property, to choose their husbands, and to seek divorce. He was never harsh with his wives and always treated them with gentleness and respect.',
    sources: [
      'The Farewell Sermon (Khutbat al-Wada), 10 AH',
      'Jami at-Tirmidhi, Hadith 3895',
      'Sahih al-Bukhari, Book of Nikah',
    ],
  },
  {
    patterns: [
      /is.*music.*haram/i,
      /music.*halal.*or.*haram/i,
      /is.*listening.*to.*music.*sin/i,
      /music.*forbidden.*islam/i,
    ],
    keywords: ['music', 'music haram', 'listening to music', 'music islam', 'music forbidden', 'songs haram', 'instruments'],
    answer: 'The majority of classical scholars consider musical instruments (not the human voice) to be haram, based on hadiths in Sahih al-Bukhari where the Prophet (PBUH) mentioned that among his Ummah there would be those who make halal silk, alcohol, and musical instruments. However, there is a well-known difference of opinion. Scholars like Ibn Hazm, Al-Ghazali (in some writings), and some modern scholars like Shaykh al-Albani (in certain conditions) permitted the daff (frame drum) at weddings and Eid. The majority view is that musical instruments are prohibited, while singing without instruments and the daff at celebrations are permitted. This is a matter where sincere scholars have differed, so you should follow the position of a qualified scholar you trust.',
    sources: [
      'Sahih al-Bukhari, Book of Drinks, Hadith 5590',
      'Sunan Abi Dawud, Hadith 3690',
      'Ibn Majah, Hadith 2855',
    ],
  },
  {
    patterns: [
      /is.*drawing.*haram/i,
      /drawing.*prohibited.*islam/i,
      /can.*muslim.*draw.*faces/i,
      /is.*art.*haram.*islam/i,
    ],
    keywords: ['drawing', 'draw haram', 'art haram', 'drawing faces', 'drawing prohibited', 'images haram', 'sketching'],
    answer: 'The issue of drawing and creating images of living beings is one where scholars have differed. The majority view, based on hadiths in Sahih al-Bukhari and Muslim where the Prophet (PBUH) said that the makers of images will be punished on the Day of Judgment, is that drawing animate beings (humans and animals) with full features is discouraged or prohibited. However, many scholars distinguish between: (1) drawings for educational, children\'s books, or harmless purposes — which are generally permitted, (2) drawing that could lead to idolatry — which is prohibited, and (3) digital art and photography — where scholars like Ibn Uthaymeen permitted it as it is not "creating" but rather capturing. The safest approach is to consult a scholar for your specific situation, especially if your work involves art.',
    sources: [
      'Sahih al-Bukhari, Book of Dress, Hadith 5951',
      'Sahih Muslim, Book of Clothing, Hadith 5538',
      'Sahih al-Bukhari, Hadith 2225',
    ],
  },
  {
    patterns: [
      /is.*celebrating.*birthdays.*haram/i,
      /birthday.*celebration.*islam/i,
      /can.*muslim.*celebrate.*birthday/i,
    ],
    keywords: ['birthday', 'birthdays', 'celebrating birthday', 'birthday haram', 'birthday islam', 'cake birthday'],
    answer: 'Celebrating birthdays is not mentioned in the Quran or authentic Sunnah, and the Prophet (PBUH) did not celebrate birthdays. The concern some scholars raise is that it may fall under "imitating the practices of other nations" mentioned in a hadith in Sunan Abi Dawud. However, many contemporary scholars distinguish between religious celebration (which would be bid\'ah) and a cultural practice of gratitude and family gathering. A simple acknowledgment of another year of life, thanking Allah for His blessings, and gathering with family without any religious rituals is generally seen as permissible by many scholars. The key is to avoid extravagance, mixing with un-Islamic customs, or treating it as a religious occasion. As with all such matters, consult a scholar you trust.',
    sources: [
      'Sunan Abi Dawud, Hadith 4031',
      'Sahih al-Bukhari, Book of Eids, Hadith 952',
    ],
  },
  {
    patterns: [
      /is.*having.*a.*dog.*haram/i,
      /dog.*in.*house.*islam/i,
      /can.*muslim.*keep.*dog/i,
    ],
    keywords: ['dog', 'dog haram', 'keep dog', 'dog in house', 'pet dog', 'dog islam'],
    answer: 'Keeping dogs in Islam is subject to specific rulings. The Prophet (PBUH) said that angels do not enter a house that has a dog or images (Bukhari). However, Islamic law explicitly permits keeping dogs for specific purposes: hunting, guarding livestock, guarding farms, and — by analogy of many scholars — for security, service dogs, and seeing-eye dogs. Keeping a dog purely as a pet inside the house is generally considered discouraged or prohibited by the majority of scholars. The saliva of a dog is considered ritually impure (najis), requiring washing the affected area seven times, one of them with earth/soil. If you need a dog for a legitimate purpose like security, that is permitted.',
    sources: [
      'Sahih al-Bukhari, Book of Dress, Hadith 3225',
      'Sahih Muslim, Hadith 516',
      'Sahih al-Bukhari, Hadith 5480',
    ],
  },
  {
    patterns: [
      /is.*suicide.*sin.*islam/i,
      /what.*islam.*says.*about.*suicide/i,
      /suicide.*haram/i,
    ],
    keywords: ['suicide', 'suicide islam', 'suicide haram', 'killing oneself', 'kill myself', 'self harm', 'suicide sin'],
    answer: 'In Islam, suicide is strictly prohibited and is considered a major sin. Allah says in the Quran: "And do not kill yourselves. Indeed, Allah is to you ever Merciful" (Quran 4:29). The Prophet (PBUH) said: "Whoever kills himself with a piece of iron, that iron will be in his hand and he will be stabbing himself with it in Hellfire forever" (Bukhari). However — and this is critically important — Islam also teaches that Allah\'s mercy encompasses all things, and that a person suffering from severe mental illness may not be fully accountable for their actions. If you or someone you know is having thoughts of suicide, please know that this is a medical emergency, not a spiritual failure. Please contact a crisis helpline immediately. In the US: 988. In the UK: 116 123 (Samaritans). Allah\'s mercy is greater than any pain you are feeling.',
    sources: [
      'Quran, Surah An-Nisa 4:29-30',
      'Sahih al-Bukhari, Book of Medicine, Hadith 5778',
      'Sahih Muslim, Book of Faith, Hadith 110',
    ],
  },
  {
    patterns: [
      /is.*depression.*lack.*of.*faith/i,
      /depression.*weak.*iman/i,
      /is.*mental.*illness.*test.*from.*allah/i,
      /depression.*punishment.*from.*allah/i,
    ],
    answer: 'No, depression is not a sign of weak faith or a punishment from Allah. This is a harmful misconception. The Prophet (PBUH) himself experienced deep sorrow — the Year of Sorrow, when he lost both his wife Khadijah and his uncle Abu Talib. Many of the Prophets experienced what we would now recognize as symptoms of depression: Prophet Yaqub (AS) grieved so deeply for Yusuf that he lost his sight. Islam teaches that illness — including mental illness — is a test and a means of expiating sins, not a sign of spiritual failure. Seeking professional help for depression is not only permissible but encouraged in Islam, just as you would seek treatment for any physical illness. The Prophet (PBUH) said: "Allah has not sent down a disease except that He has also sent down its cure" (Bukhari). Therapy and medication are part of the means Allah has provided for healing.',
    sources: [
      'Sahih al-Bukhari, Book of Medicine, Hadith 5678',
      'Quran, Surah Yusuf 12:84-87',
      'Sahih al-Bukhari, Book of Tafsir (Year of Sorrow)',
    ],
  },
  {
    patterns: [
      /is.*it.*haram.*to.*be.*gay/i,
      /homosexuality.*islam/i,
      /being.*gay.*sin.*islam/i,
    ],
    keywords: ['gay', 'homosexuality', 'gay islam', 'gay haram', 'gay sin', 'same sex', 'homosexual', 'lgbt'],
    answer: 'In Islamic theology, same-sex attraction (the feeling) is not considered a sin — feelings and temptations are not sinful in Islam; actions are. What Islamic law addresses is same-sex sexual acts, which the majority of scholars consider prohibited based on the story of Prophet Lut (Lot) in the Quran (Surah Al-A\'raf 7:80-84, Surah Hud 11:77-83). A person who experiences same-sex attraction but does not act on it is not sinful and is actually rewarded for their struggle, just as anyone who resists temptation is rewarded. Islam encourages compassion and does not permit harassment or violence toward anyone. If you are struggling with this, speaking to a qualified, compassionate scholar or counselor is recommended. Allah is Most Merciful and knows what is in every heart.',
    sources: [
      'Quran, Surah Al-A\'raf 7:80-84',
      'Quran, Surah Hud 11:77-83',
      'Quran, Surah An-Naml 27:54-58',
    ],
  },
  {
    patterns: [
      /what.*happen.*after.*death.*islam/i,
      /afterlife.*islam/i,
      /what.*islam.*says.*about.*death/i,
      /soul.*after.*death/i,
    ],
    keywords: ['after death', 'afterlife', 'what happens after death', 'soul after death', 'death islam', 'life after death', 'grave', 'barzakh', 'day of judgment'],
    answer: 'In Islam, death is not the end but a transition from one life to another. When a person dies, their soul is taken by the Angel of Death. The soul then enters the state of Barzakh (a barrier/intermediate state) until the Day of Judgment. In the grave, the person is questioned by two angels (Munkar and Nakir) about their Lord, their religion, and their Prophet. Based on their answers and their deeds, the grave becomes either a garden of Paradise or a pit of Hellfire. On the Day of Judgment (Yawm al-Qiyamah), all souls will be resurrected and judged by Allah. Each person will receive their book of deeds and will cross the Sirat (a bridge over Hellfire). Those whose good deeds outweigh their bad will enter Jannah (Paradise), and those whose bad deeds outweigh will enter Jahannam (Hellfire), though Allah may forgive whom He wills. The ultimate destination for believers is Paradise, which is described as a place of eternal peace, joy, and closeness to Allah.',
    sources: [
      'Quran, Surah Al-Imran 3:185',
      'Quran, Surah Al-Mu\'minun 23:99-100',
      'Sahih al-Bukhari, Book of Funerals, Hadith 1338',
      'Quran, Surah Al-Anbiya 21:47',
    ],
  },
  {
    patterns: [
      /is.*tattoo.*haram/i,
      /tattoo.*forbidden.*islam/i,
      /can.*muslim.*get.*tattoo/i,
    ],
    keywords: ['tattoo', 'tattoo haram', 'tattoos islam', 'tattoo forbidden', 'get tattoo', 'ink tattoo', 'permanent tattoo'],
    answer: 'The majority of Islamic scholars consider permanent tattoos to be haram (prohibited), based on the hadith in Sahih al-Bukhari and Sahih Muslim where the Prophet (PBUH) cursed those who get tattoos and those who perform tattooing. The primary concern is that tattooing involves changing Allah\'s creation permanently. Additionally, tattooing creates a barrier on the skin that prevents water from reaching the skin during wudu (ablution), though the majority of scholars say wudu is still valid over a tattoo since the ink penetrates the skin. If a person already has tattoos from before accepting Islam or before knowing the ruling, they are not required to remove them (as removal can be painful and costly), but they should not get new ones. Temporary henna and similar non-permanent decorations are permitted.',
    sources: [
      'Sahih al-Bukhari, Book of Dress, Hadith 5937',
      'Sahih Muslim, Book of Clothing, Hadith 5530',
    ],
  },
  {
    patterns: [
      /is.*it.*haram.*to.*shave.*beard/i,
      /beard.*obligatory.*islam/i,
      /can.*muslim.*shave.*beard/i,
    ],
    answer: 'The majority of scholars (including the four major schools of Islamic law) consider growing the beard to be obligatory for Muslim men, based on the Prophet\'s (PBUH) command: "Trim the moustache and let the beard grow" (Bukhari). The Prophet (PBUH) also said: "Cut the moustache short and leave the beard" (Muslim). Trimming the beard to a fist-length is permitted according to many scholars, but completely shaving it off is considered prohibited by the majority. Some contemporary scholars have held more lenient views, arguing it is recommended rather than obligatory. As with all fiqh matters, following a qualified scholar you trust is the best approach.',
    sources: [
      'Sahih al-Bukhari, Book of Dress, Hadith 5892',
      'Sahih Muslim, Book of Purification, Hadith 259',
      'Sunan Abi Dawud, Hadith 4189',
    ],
  },
  {
    patterns: [
      /can.*women.*go.*to.*mosque/i,
      /women.*praying.*mosque.*islam/i,
      /is.*it.*haram.*for.*women.*to.*go.*to.*masjid/i,
    ],
    keywords: ['women mosque', 'women masjid', 'women go to mosque', 'women pray mosque', 'women in mosque', 'can women go mosque'],
    answer: 'Yes, women are permitted to go to the mosque in Islam. The Prophet (PBUH) explicitly said: "Do not prevent the female servants of Allah from going to the mosques of Allah" (Bukhari and Muslim). However, the Prophet (PBUH) also said that it is better for women to pray at home: "A woman\'s prayer in her room is better than her prayer in her courtyard, and her prayer in her courtyard is better than her prayer in the mosque" (Abu Dawud). The permission is clear — women cannot be prevented from attending the mosque if they wish to go, provided they maintain appropriate dress and conduct. Many mosques have separate prayer areas for women. The practice of excluding women entirely from mosques is a cultural practice, not an Islamic one.',
    sources: [
      'Sahih al-Bukhari, Book of Prayer, Hadith 865',
      'Sahih Muslim, Book of Prayer, Hadith 442',
      'Sunan Abi Dawud, Hadith 570',
    ],
  },
  {
    patterns: [
      /is.*dowry.*islamic/i,
      /mahr.*obligatory/i,
      /what.*is.*mahr.*islam/i,
    ],
    keywords: ['mahr', 'dowry', 'mahr islam', 'dowry islamic', 'mahr obligatory', 'bride price', 'wedding gift'],
    answer: 'Mahr (dowry) is an obligatory gift that the groom gives to the bride in Islamic marriage. It is a right of the woman, not the man or the woman\'s family. The Quran says: "And give the women their mahr as a gift" (Quran 4:4). The mahr can be anything of value — money, gold, property, or even knowledge of the Quran. There is no fixed maximum or minimum, though the Prophet (PBUH) encouraged keeping it simple. The mahr becomes the woman\'s property and she has full control over it. The cultural practice of the bride\'s family paying a dowry to the groom is NOT Islamic and is actually contrary to Islamic teachings. In Islam, the groom pays the mahr to the bride.',
    sources: [
      'Quran, Surah An-Nisa 4:4',
      'Quran, Surah An-Nisa 4:24',
      'Sahih al-Bukhari, Book of Nikah, Hadith 5079',
    ],
  },
  {
    patterns: [
      /is.*it.*haram.*to.*date/i,
      /dating.*in.*islam/i,
      /can.*muslim.*date/i,
      /pre.*marital.*relationship.*islam/i,
    ],
    keywords: ['date', 'dating', 'dating islam', 'date haram', 'premarital', 'pre marital', 'relationship before marriage', 'boyfriend', 'girlfriend'],
    answer: 'In Islam, the concept of dating as practiced in Western culture (unsupervised, physical relationships before marriage) is not permitted. Islam provides a framework called "courtship" or "getting to know someone for marriage" (ta\'aruf) which has specific guidelines: meetings should be chaperoned or in the presence of family, both parties should be honest about their intentions and circumstances, and physical intimacy is reserved for after marriage. This is not to restrict freedom but to protect both individuals emotionally and spiritually. If you are interested in someone, the Islamic approach is to involve your families and explore compatibility in a dignified, transparent way. If it does not work out, no one has been hurt or compromised.',
    sources: [
      'Quran, Surah An-Nur 24:30-31',
      'Quran, Surah Al-Baqarah 2:235',
      'Sahih al-Bukhari, Book of Nikah',
    ],
  },
  {
    patterns: [
      /gold.*silk.*men/i,
      /men.*wear.*gold/i,
      /man.*wear.*gold/i,
      /gold.*forbidden.*men/i,
      /silk.*forbidden.*men/i,
      /men.*wear.*silk/i,
      /man.*wear.*silk/i,
      /gold.*or.*silk/i,
      /is.*gold.*haram.*for.*men/i,
      /is.*silk.*haram.*for.*men/i,
    ],
    keywords: ['gold', 'silk', 'men wear gold', 'man wear gold', 'gold haram', 'silk haram', 'gold men', 'silk men', 'gold forbidden', 'silk forbidden', 'gold ring', 'silk clothing'],
    answer: 'Yes, it is prohibited (haram) for men to wear gold jewelry and natural silk clothing in Islam. The Prophet Muhammad (PBUH) said: "Gold and silk have been permitted for the females of my Ummah and forbidden for the males" (Tirmidhi). In another hadith, he saw a man wearing a gold ring and took it off, saying: "Does one of you seek a coal of fire and put it on his hand?" (Muslim). The prohibition applies to solid gold (jewelry, rings, chains) and garments made of pure natural silk. However, scholars note exceptions: a small amount of gold for medical purposes (like a gold tooth filling) is permitted, and synthetic silk is generally allowed since the hadith refers to natural silk. Silver is permitted for men. Gold-plated items where the gold is negligible and not the primary material are a matter of scholarly difference — consult a scholar for your specific case.',
    sources: [
      'Jami at-Tirmidhi, Book of Clothes, Hadith 1720',
      'Sahih Muslim, Book of Clothing, Hadith 5435',
      'Sahih al-Bukhari, Book of Dress, Hadith 5835',
      'Sunan an-Nasa\'i, Book of Adornment, Hadith 5165',
    ],
  },
  {
    patterns: [
      /nailpolish.*islam/i,
      /nail.*polish.*islam/i,
      /nailpaint.*islam/i,
      /nail.*paint.*islam/i,
      /permissible.*nailpolish/i,
      /permissible.*nail.*polish/i,
      /permissible.*nailpaint/i,
      /permissible.*nail.*paint/i,
      /haram.*nailpolish/i,
      /haram.*nail.*polish/i,
      /haram.*nailpaint/i,
      /can.*muslim.*wear.*nailpolish/i,
      /can.*muslim.*wear.*nail.*polish/i,
      /can.*women.*wear.*nailpolish/i,
      /can.*women.*wear.*nail.*polish/i,
      /nailpolish.*wudu/i,
      /nail.*polish.*wudu/i,
      /nailpolish.*prayer/i,
      /nail.*polish.*prayer/i,
    ],
    keywords: ['nailpolish', 'nail polish', 'nailpaint', 'nail paint', 'nail polish wudu', 'nail polish prayer', 'nail polish haram', 'nail polish permissible', 'nail polish islam'],
    answer: 'Nail polish itself is not haram in Islam — there is no text in the Quran or Sunnah that prohibits it. However, the key issue is that conventional nail polish forms a waterproof coating on the nails, which prevents water from reaching the nail surface during wudu (ablution). Since wudu requires water to touch the nails, wearing regular nail polish invalidates wudu, and therefore you cannot pray while wearing it. There are three approaches scholars mention: (1) Remove the nail polish before making wudu — this is the safest and most widely accepted approach. (2) Use breathable/water-permeable nail polish (brands marketed as "wudu-friendly" or "halal nail polish") — some scholars permit this if water truly penetrates to the nail, while others are cautious because testing shows not all brands are fully permeable. (3) Some scholars hold that nail polish applied after completing wudu is fine as long as it is removed before the next wudu. Nail polish is generally considered a form of adornment that is permissible for women, but should be removed or made permeable before prayer. Consult a scholar you trust for your specific situation.',
    sources: [
      'Quran, Surah Al-Ma\'idah 5:6 (wudu requirements)',
      'Sahih al-Bukhari, Book of Ablution, Hadith 159',
      'Sahih Muslim, Book of Purification, Hadith 221',
    ],
  },
  {
    patterns: [
      /is.*it.*haram.*to.*shave.*beard/i,
      /beard.*obligatory.*islam/i,
      /can.*muslim.*shave.*beard/i,
    ],
    answer: 'The majority of scholars (including the four major schools of Islamic law) consider growing the beard to be obligatory for Muslim men, based on the Prophet\'s (PBUH) command: "Trim the moustache and let the beard grow" (Bukhari). The Prophet (PBUH) also said: "Cut the moustache short and leave the beard" (Muslim). Trimming the beard to a fist-length is permitted according to many scholars, but completely shaving it off is considered prohibited by the majority. Some contemporary scholars have held more lenient views, arguing it is recommended rather than obligatory. As with all fiqh matters, following a qualified scholar you trust is the best approach.',
    sources: [
      'Sahih al-Bukhari, Book of Dress, Hadith 5892',
      'Sahih Muslim, Book of Purification, Hadith 259',
      'Sunan Abi Dawud, Hadith 4189',
    ],
  },
  {
    patterns: [
      /is.*riba.*haram/i, /is.*interest.*haram/i, /riba.*forbidden/i,
      /interest.*bank.*haram/i, /is.*mortgage.*haram/i, /mortgage.*islam/i,
      /bank.*interest.*islam/i, /is.*loan.*haram/i, /student.*loan.*islam/i,
      /credit.*card.*islam/i, /is.*credit.*card.*haram/i,
    ],
    keywords: ['riba', 'interest', 'interest haram', 'riba haram', 'mortgage', 'mortgage haram', 'bank interest', 'loan haram', 'student loan', 'credit card', 'usury'],
    answer: 'Yes, riba (interest/usury) is strictly prohibited in Islam. Allah says in the Quran: "O you who believe, fear Allah and give up what remains of riba, if you are believers" (2:278). The Prophet (PBUH) cursed the one who consumes riba, the one who pays it, the one who records it, and the witnesses to it (Muslim). This applies to conventional bank interest, loans with interest, and credit card interest if you carry a balance. Regarding mortgages: taking a mortgage to buy a home you will live in is a matter of scholarly debate — some scholars prohibit it entirely, while others permit it as a necessity in countries where renting is not viable, especially for families. Islamic (halal) mortgages using murabaha or ijara structures are alternatives. Student loans with interest are also problematic; where interest-free government loans exist, those are preferred. Consult a scholar for your specific financial situation.',
    sources: [
      'Quran, Surah Al-Baqarah 2:275-279',
      'Sahih Muslim, Book of Musaqah, Hadith 1598',
      'Quran, Surah Al-Imran 3:130',
    ],
  },
  {
    patterns: [
      /is.*alcohol.*haram/i, /alcohol.*forbidden.*islam/i, /can.*muslim.*drink/i,
      /is.*wine.*haram/i, /is.*beer.*haram/i, /drinking.*islam/i,
    ],
    keywords: ['alcohol', 'alcohol haram', 'wine', 'beer', 'drinking', 'alcohol islam', 'drink alcohol', 'wine haram', 'beer haram', 'khamr', 'intoxicant'],
    answer: 'Yes, alcohol is strictly haram (prohibited) in Islam. The Quran explicitly forbids it: "O you who believe, intoxicants, gambling, sacrificing on stone altars, and divining arrows are but defilement from the work of Satan, so avoid it that you may be successful" (5:90). The Prophet (PBUH) said: "Every intoxicant is khamr (wine) and every khamr is haram" (Muslim). He also said that a small amount of an intoxicant is haram if a large amount intoxicates. This includes beer, wine, spirits, and any substance that intoxicates the mind. Cooking with alcohol that does not fully evaporate is also prohibited. Non-alcoholic versions of beverages (like 0% beer where alcohol is fully removed) are a matter of scholarly difference — some permit them, others discourage them because they resemble haram drinks.',
    sources: [
      'Quran, Surah Al-Ma\'idah 5:90-91',
      'Sahih Muslim, Book of Drinks, Hadith 2003',
      'Sunan Abi Dawud, Hadith 3681',
    ],
  },
  {
    patterns: [
      /is.*pork.*haram/i, /pork.*forbidden.*islam/i, /can.*muslim.*eat.*pork/i,
      /is.*eating.*pork.*sin/i, /bacon.*islam/i, /ham.*islam/i,
    ],
    keywords: ['pork', 'pork haram', 'bacon', 'ham', 'eating pork', 'pork islam', 'pork forbidden', 'swine', 'pork sin'],
    answer: 'Yes, pork is strictly haram (prohibited) in Islam. The Quran states: "Forbidden to you are dead animals, blood, the flesh of swine, and that which has been dedicated to other than Allah" (5:3). The prohibition on pork is also found in Surah Al-Baqarah 2:173 and Surah Al-An\'am 6:145. This includes all pork products — bacon, ham, pork sausages, lard, and gelatin derived from pork. If gelatin is derived from halal animals (like cattle slaughtered Islamically) or from plant sources, it is permissible. Pork is prohibited in both Islam and Judaism, and the prohibition is considered absolute — there are no differences of opinion among scholars. The only exception is in a life-or-death emergency where no other food is available, as the Quran allows eating haram food to survive.',
    sources: [
      'Quran, Surah Al-Ma\'idah 5:3',
      'Quran, Surah Al-Baqarah 2:173',
      'Quran, Surah Al-An\'am 6:145',
    ],
  },
  {
    patterns: [
      /is.*gambling.*haram/i, /gambling.*forbidden.*islam/i, /can.*muslim.*gamble/i,
      /lottery.*islam/i, /is.*lottery.*haram/i, /betting.*islam/i, /sports.*bet.*islam/i,
    ],
    keywords: ['gambling', 'gambling haram', 'lottery', 'lottery haram', 'betting', 'bet', 'casino', 'gamble', 'maysir', 'sports bet'],
    answer: 'Yes, gambling (maysir) is strictly haram in Islam. The Quran mentions it alongside alcohol: "They ask you about wine and gambling. Say, \'In them is great sin and benefit for people, but their sin is greater than their benefit\'" (2:219). And: "O you who believe, intoxicants, gambling... are but defilement from the work of Satan, so avoid it" (5:90). This includes casino gambling, sports betting, lottery tickets, online betting, and any game of chance where money is wagered. The prohibition is because gambling involves taking wealth without legitimate work, destroys families, and leads to addiction and disputes. Stock market investing is different from gambling because it involves ownership of real assets and is based on analysis, though excessive speculation resembling gambling is discouraged.',
    sources: [
      'Quran, Surah Al-Baqarah 2:219',
      'Quran, Surah Al-Ma\'idah 5:90-91',
      'Sahih Muslim, Book of Musaqah',
    ],
  },
  {
    patterns: [
      /is.*weed.*haram/i, /is.*cannabis.*haram/i, /is.*marijuana.*haram/i,
      /weed.*forbidden.*islam/i, /cannabis.*islam/i, /marijuana.*islam/i,
      /is.*smoking.*weed.*haram/i, /is.*vaping.*haram/i, /vaping.*islam/i,
      /is.*smoking.*haram/i, /cigarette.*haram/i, /is.*vape.*haram/i,
    ],
    keywords: ['weed', 'cannabis', 'marijuana', 'smoking', 'cigarette', 'vape', 'vaping', 'weed haram', 'cannabis haram', 'smoking haram', 'cigarette haram', 'vape haram'],
    answer: 'Marijuana/cannabis is considered haram by the majority of contemporary scholars because it is an intoxicant. The Prophet (PBUH) said: "Every intoxicant is khamr and every khamr is haram" (Muslim), and "Whatever intoxicates in large quantities, a small amount is also haram" (Abu Dawud). Since cannabis alters the mind and is intoxicating, it falls under this prohibition. Regarding smoking cigarettes and vaping: the majority of modern scholars consider them haram or makruh tahrimi (strongly disliked, close to haram) because tobacco is proven to harm the body, and the Quran says: "Do not kill yourselves" (4:29) and "Do not throw yourselves into destruction" (2:195). Vaping with nicotine has the same ruling. Some older scholars held smoking to be makruh (disliked) because the harm was not yet proven, but with modern medical evidence, the ruling has shifted toward prohibition. Consult a scholar you trust.',
    sources: [
      'Sahih Muslim, Book of Drinks, Hadith 2003',
      'Sunan Abi Dawud, Hadith 3681',
      'Quran, Surah An-Nisa 4:29',
      'Quran, Surah Al-Baqarah 2:195',
    ],
  },
  {
    patterns: [
      /is.*hijab.*obligatory/i, /is.*hijab.*fard/i, /is.*hijab.*required/i,
      /must.*women.*wear.*hijab/i, /is.*hijab.*mandatory/i, /does.*islam.*require.*hijab/i,
      /is.*niqab.*obligatory/i, /is.*niqab.*fard/i, /is.*burqa.*required/i,
      /not.*wear.*hijab/i, /without.*hijab/i, /take.*off.*hijab/i, /remove.*hijab/i,
      /hijab.*outside/i, /hijab.*in.*public/i, /hijab.*necessary/i, /hijab.*compulsory/i,
      /girl.*not.*wear.*hijab/i, /woman.*not.*wear.*hijab/i, /no.*hijab/i,
      /can.*i.*not.*wear.*hijab/i, /is.*it.*ok.*without.*hijab/i, /hijab.*choice/i,
      /hijab.*optional/i, /hijab.*not.*required/i, /hijab.*not.*obligatory/i,
    ],
    keywords: ['hijab', 'hijab obligatory', 'hijab required', 'hijab mandatory', 'hijab fard', 'niqab', 'niqab obligatory', 'burqa', 'veil', 'headscarf', 'cover hair', 'women cover', 'hijab compulsory', 'not wear hijab', 'without hijab', 'take off hijab', 'remove hijab', 'hijab outside', 'hijab public', 'hijab necessary', 'no hijab', 'hijab choice', 'hijab optional', 'hijab not required', 'hijab not obligatory', 'girl not wear hijab', 'woman not wear hijab'],
    answer: 'The majority of Islamic scholars (across the four major schools of law) consider hijab (covering the hair and body) to be obligatory for Muslim women, based on Quranic verses: "O Prophet, tell your wives and daughters and the women of the believers to draw their outer garments over themselves" (33:59) and "Tell the believing women to lower their gaze and guard their private parts and not expose their adornment except that which appears thereof, and to draw their headcovers over their chests" (24:31). The obligatory covering (awrah for women) is everything except the face and hands, according to the majority. So a girl or woman going outside without hijab is going against this obligation — it is not permissible according to the majority of scholars. (1) This applies in front of non-mahram men (men she could marry). In front of mahram relatives (father, brother, grandfather, etc.) and other women, she does not need to wear hijab. (2) At home and in women-only gatherings, hijab is not required. (3) If a sister is struggling with hijab: start where you are. Many scholars encourage gradual progress — begin dressing modestly (loose clothing, covering the body), then work toward covering the hair. Allah looks at your effort and intention. Do not let the difficulty stop you from trying. (4) Hijab is not just clothing — it is also an attitude of modesty, dignity, and lowering the gaze. (5) The pressure to remove it (from family, society, work) is a test — the Prophet (PBUH) said: "Islam began as something strange and will return to being strange, so glad tidings to the strangers" (Muslim). (6) If you fear harm for wearing hijab: consult a scholar about your specific situation. In some circumstances of genuine danger, scholars have permitted temporary adjustment, but this must be evaluated case by case with a trusted scholar — not decided alone. (7) Regarding niqab (face covering): this is a matter of scholarly difference. Some scholars (like many in the Hanbali school and contemporary Saudi scholars) consider it obligatory, while the majority (including most Hanafi, Maliki, and Shafi\'i scholars) consider it recommended (mustahab) but not obligatory. The face and hands are the areas of disagreement. A woman should follow the position of a scholar she trusts.',
    sources: [
      'Quran, Surah An-Nur 24:31',
      'Quran, Surah Al-Ahzab 33:59',
      'Sahih al-Bukhari, Book of Dress (covering)',
      'Sahih Muslim, Book of Faith, Hadith 145 (Islam began as something strange)',
    ],
  },
  {
    patterns: [
      /is.*plucking.*eyebrows.*haram/i, /eyebrows.*haram/i, /pluck.*eyebrows.*islam/i,
      /is.*threading.*eyebrows.*haram/i, /is.*shaping.*eyebrows.*haram/i,
      /can.*women.*pluck.*eyebrows/i, /eyebrow.*islam/i,
    ],
    keywords: ['eyebrows', 'eyebrow', 'pluck eyebrows', 'threading eyebrows', 'shaping eyebrows', 'eyebrows haram', 'eyebrow plucking', 'eyebrow islam'],
    answer: 'The majority of scholars consider plucking or shaping the eyebrows (by removing hair between or above the brows) to be haram, based on the hadith in Sahih al-Bukhari and Sahih Muslim where the Prophet (PBUH) cursed "the women who pluck eyebrows and the women who have their eyebrows plucked for the purpose of beautification." The concern is altering Allah\'s creation for cosmetic purposes. However, there are nuances: (1) The prohibition applies to removing hair to create a new shape, not to removing stray hairs around the natural brow or removing a unibrow (hair between the brows that is not part of the eyebrow itself) — some scholars permit this. (2) If a woman has excessive facial hair that looks abnormal (like a beard or thick moustache), removing it is permitted. (3) Trimming with scissors without removing from the root is a matter of difference. The safest approach is to consult a scholar you trust. Henna and non-permanent makeup are generally permitted.',
    sources: [
      'Sahih al-Bukhari, Book of Dress, Hadith 5931',
      'Sahih Muslim, Book of Clothing, Hadith 5528',
      'Sunan an-Nasa\'i, Book of Adornment',
    ],
  },
  {
    patterns: [
      /is.*hair.*dye.*haram/i, /hair.*dye.*islam/i, /can.*muslim.*dye.*hair/i,
      /is.*colouring.*hair.*haram/i, /is.*dying.*hair.*haram/i,
      /can.*men.*dye.*hair/i, /black.*dye.*haram/i, /black.*hair.*dye.*islam/i,
    ],
    keywords: ['hair dye', 'dye hair', 'hair color', 'colouring hair', 'dying hair', 'black dye', 'black hair dye', 'hair dye islam', 'henna'],
    answer: 'Dyeing hair is generally permissible in Islam. The Prophet (PBUH) encouraged it, saying: "The Jews and Christians do not dye their hair, so differ from them" (Bukhari and Muslim). However, there is a specific prohibition on pure black dye. The Prophet (PBUH) said regarding someone who wanted to dye his hair black: "The best thing with which to dye gray hair is henna and katm" (Tirmidhi), and the Prophet discouraged using pure black. Most scholars hold that pure black dye is haram or makruh (disliked) for both men and women, especially if it is done to deceive (e.g., appearing younger for marriage). Henna (reddish-orange), and other colors like brown, dark brown, blonde highlights, etc. are permitted. Both men and women may dye their hair with permissible colors.',
    sources: [
      'Sahih al-Bukhari, Book of Dress, Hadith 5899',
      'Sahih Muslim, Book of Clothing, Hadith 5539',
      'Jami at-Tirmidhi, Book of Dress, Hadith 1752',
    ],
  },
  {
    patterns: [
      /is.*makeup.*haram/i, /makeup.*islam/i, /can.*muslim.*women.*wear.*makeup/i,
      /is.*cosmetics.*haram/i, /is.*foundation.*haram/i, /lipstick.*islam/i,
    ],
    keywords: ['makeup', 'makeup haram', 'cosmetics', 'foundation', 'lipstick', 'makeup islam', 'wear makeup', 'cosmetics haram'],
    answer: 'Makeup itself is not haram in Islam — it is a form of adornment (zeenah), which is permissible for women. The Quran speaks of women\'s adornment as a blessing. However, there are conditions: (1) Makeup should not be worn in front of non-mahram men (men a woman could marry) outside the home, as this falls under displaying adornment publicly, which the Quran addresses in Surah An-Nur 24:31 and Surah An-Nur 24:60. (2) At home, among family and mahram relatives, or in women-only gatherings, wearing makeup is permissible. (3) Makeup products should not contain haram ingredients like pork-derived gelatin or alcohol (some scholars are lenient on synthetic alcohol in cosmetics that is not consumed). (4) Makeup that forms a waterproof barrier (like some foundations) could affect wudu — similar to the nail polish issue, ensure it is removed before ablution. Water-based and removable makeup is generally fine.',
    sources: [
      'Quran, Surah An-Nur 24:31',
      'Quran, Surah An-Nur 24:60',
      'Quran, Surah Al-A\'raf 7:32 (adornment is halal)',
    ],
  },
  {
    patterns: [
      /is.*photography.*haram/i, /is.*taking.*photos.*haram/i, /is.*selfie.*haram/i,
      /photography.*islam/i, /can.*muslim.*take.*photos/i, /is.*camera.*haram/i,
      /are.*pictures.*haram/i, /is.*having.*photos.*haram/i,
    ],
    keywords: ['photography', 'photo', 'photos', 'selfie', 'camera', 'pictures', 'taking photos', 'photography haram', 'pictures haram', 'photos islam'],
    answer: 'There are two main scholarly opinions on photography. The traditional view (held by scholars like Ibn Hajar and some contemporary Saudi scholars including some fatwas from Shaykh Ibn Baz) considers photographs of living beings to be prohibited, equating them to image-making (taswir) mentioned in the hadiths. The other view — held by many contemporary scholars including Shaykh al-Albani, Shaykh Ibn Uthaymeen (in his later works), and the majority of Muslim scholars today — is that photography is permissible because it captures a reflection of Allah\'s creation rather than "creating" an image. They draw an analogy with a mirror reflection. The conditions for permissibility are: (1) the photo should not be of something haram (like immodest dress), (2) it should not be displayed in a manner that disrespects (like on the floor or in the bathroom), (3) it should not lead to idolatry or veneration. Digital photos on phones and for identification, memories, and communication are widely permitted. Hanging photos in the home is more debated — some scholars say angels don\'t enter homes with displayed images, while others say this applies to images that could be venerated.',
    sources: [
      'Sahih al-Bukhari, Book of Dress, Hadith 5951',
      'Sahih Muslim, Book of Clothing, Hadith 5538',
      'Contemporary fatwas from Shaykh al-Albani and Ibn Uthaymeen',
    ],
  },
  {
    patterns: [
      /is.*halloween.*haram/i, /halloween.*islam/i, /can.*muslim.*celebrate.*halloween/i,
      /is.*christmas.*haram/i, /christmas.*islam/i, /can.*muslim.*celebrate.*christmas/i,
      /is.*valentine.*haram/i, /valentine.*islam/i, /can.*muslim.*celebrate.*valentine/i,
      /is.*new.*year.*haram/i, /new.*year.*celebration.*islam/i,
    ],
    keywords: ['halloween', 'christmas', 'valentine', 'new year', 'holiday', 'celebrate christmas', 'celebrate halloween', 'valentine day', 'non muslim holiday', 'merry christmas'],
    answer: 'Non-Islamic holidays like Halloween, Christmas, Valentine\'s Day, and the Gregorian New Year are not celebrated in Islam. The Prophet (PBUH) said: "Whoever imitates a people is one of them" (Abu Dawud), and "Every nation has its festival, and this is our festival" (Bukhari and Muslim), referring to Eid al-Fitr and Eid al-Adha. Most scholars consider actively celebrating non-Islamic religious holidays (like Christmas as a religious observance) to be haram because it involves imitating the practices of other religions and participating in their religious significance. However, scholars differentiate: (1) Wishing non-Muslim neighbors or colleagues well during their holidays out of courtesy is permitted, but participating in the religious aspects is not. (2) Cultural aspects like a family dinner or exchanging gifts without religious intent are more leniently viewed by some scholars. (3) Halloween, which has pagan origins and involves imitating spirits/the dead, is generally considered haram. The safest position is to be kind and respectful to non-Muslims during their holidays without participating in religious or pagan-origined rituals. Consult a scholar for your specific situation.',
    sources: [
      'Sunan Abi Dawud, Hadith 4031',
      'Sahih al-Bukhari, Book of Eids, Hadith 952',
      'Sahih Muslim, Book of Eids, Hadith 892',
    ],
  },
  {
    patterns: [
      /is.*polygamy.*allowed/i, /can.*muslim.*man.*have.*multiple.*wives/i,
      /is.*multiple.*wives.*allowed/i, /second.*wife.*islam/i,
      /is.*polygyny.*allowed/i, /four.*wives.*islam/i, /can.*muslim.*marry.*more.*than.*one/i,
    ],
    keywords: ['polygamy', 'polygyny', 'multiple wives', 'four wives', '4 wives', 'second wife', '2nd wife', 'more than one wife', 'more wives', 'second marriage'],
    answer: 'Yes, Islam permits a man to marry up to four wives simultaneously, but with strict conditions. The Quran states: "And if you fear that you will not deal justly with the orphan girls, then marry those that please you of other women, two or three or four. But if you fear that you will not be just, then marry only one" (4:3). Justice here means equal treatment in financial support, time, and living arrangements. The Quran immediately qualifies the permission with a warning: "And you will never be able to be equal between wives, even if you strive" (4:129), referring to emotional love, which a man cannot control — but he must be just in tangible matters. Polygamy was permitted in a historical context where war left many widows and orphans, and it provided a regulated alternative to the unlimited marriages common in pre-Islamic Arabia. It is a permission, not an obligation. In many Muslim-majority countries today, polygamy is legally restricted or requires court approval. A man considering a second marriage must be honest with his first wife and ensure he can fulfill the conditions of justice.',
    sources: [
      'Quran, Surah An-Nisa 4:3',
      'Quran, Surah An-Nisa 4:129',
      'Sahih al-Bukhari, Book of Nikah',
    ],
  },
  {
    patterns: [
      /is.*divorce.*allowed.*islam/i, /divorce.*islam/i, /can.*muslim.*divorce/i,
      /is.*talaq.*haram/i, /triple.*talaq.*islam/i, /three.*talaq.*islam/i,
      /is.*divorce.*haram/i,
    ],
    keywords: ['divorce', 'divorce islam', 'talaq', 'triple talaq', 'three talaq', 'divorce haram', 'divorce allowed', 'khul', 'annulment', 'faskh'],
    answer: 'Divorce is permitted in Islam but strongly disliked. The Prophet (PBUH) said: "Of all the lawful things, the most detestable to Allah is divorce" (Abu Dawud). Islam provides a structured process: (1) Talaq (divorce) should be pronounced once during a period of purity (tuhr) when no intimacy has occurred, followed by a waiting period (iddah) of three menstrual cycles, during which reconciliation is encouraged. (2) During iddah, the husband can revoke the divorce. (3) If the iddah passes without revocation, the divorce becomes final — this is a "revocable" divorce (talaq raj\'i). After three separate divorces over time, the couple cannot remarry unless the woman marries another man and that marriage ends naturally. Regarding "triple talaq" (saying "talaq, talaq, talaq" at once): The majority of scholars historically considered this to count as three separate divorces, making remarriage impossible. However, many contemporary scholars and some classical scholars (like Ibn Taymiyyah) held that three talaqs pronounced at once count as one, allowing the possibility of remarriage after iddah. Women also have the right to seek divorce through khul\' (returning the mahr), and an Islamic judge can grant faskh (annulment) for valid reasons like cruelty or abandonment.',
    sources: [
      'Quran, Surah Al-Baqarah 2:228-232',
      'Quran, Surah At-Talaq 65:1-2',
      'Sunan Abi Dawud, Hadith 2178',
      'Sahih al-Bukhari, Book of Divorce',
    ],
  },
  {
    patterns: [
      /is.*jihad.*holy.*war/i, /what.*is.*jihad.*islam/i, /jihad.*meaning/i,
      /is.*jihad.*violence/i, /does.*islam.*spread.*by.*sword/i,
    ],
    keywords: ['jihad', 'holy war', 'jihad meaning', 'jihad violence', 'what is jihad', 'jihad islam', 'spread by sword'],
    answer: 'The word "jihad" means "struggle" or "striving" in Arabic — it does not mean "holy war." In Islam, jihad has two meanings: (1) Jihad al-Akbar (the greater jihad) — the internal struggle against one\'s own ego, desires, and sins to become a better person and closer to Allah. The Prophet (PBUH) said to his companions returning from battle: "You have returned from the lesser jihad to the greater jihad" — meaning the struggle against the self. (2) Jihad al-Asghar (the lesser jihad) — armed struggle in self-defense or to protect the oppressed, which is heavily regulated. The Quran is clear: "Fight in the way of Allah those who fight you but do not transgress. Indeed, Allah does not like transgressors" (2:190) and "There is no compulsion in religion" (2:256). Islam does not permit forced conversion — the Quran explicitly forbids it. Historical Islamic expansion was complex and often political/territorial, not religious conversion by force. The claim that Islam was "spread by the sword" is historically inaccurate; forced conversion was rare and often prohibited. Today, the concept of armed jihad is abused by extremist groups in ways that the majority of scholars reject as contradicting Islamic law.',
    sources: [
      'Quran, Surah Al-Baqarah 2:190',
      'Quran, Surah Al-Baqarah 2:256',
      'Quran, Surah Al-Mumtahanah 60:8',
      'Sahih al-Bukhari, Book of Jihad',
    ],
  },
  {
    patterns: [
      /is.*jesus.*in.*islam/i, /what.*islam.*says.*about.*jesus/i, /jesus.*muslim/i,
      /isa.*islam/i, /does.*islam.*believe.*in.*jesus/i, /is.*jesus.*prophet.*islam/i,
    ],
    keywords: ['jesus', 'jesus islam', 'isa', 'isa islam', 'jesus muslim', 'jesus prophet', 'mary', 'maryam', 'messiah', 'jesus in islam', 'does islam believe jesus'],
    answer: 'Yes, Jesus (Isa ibn Maryam, peace be upon him) is one of the greatest prophets in Islam. Muslims believe: (1) Jesus was born miraculously to the Virgin Mary (Maryam) without a father — this is affirmed in the Quran in Surah Maryam 19:16-33 and Surah Al-Imran 3:45-47. (2) He performed miracles by Allah\'s permission — healing the sick, raising the dead, and speaking as an infant. (3) He was given the Injil (Gospel). (4) He is the Messiah (Al-Masih). (5) He was not crucified — rather, Allah raised him up to Himself, and it was made to appear to his enemies that he was crucified (Quran 4:157-158). (6) He will return to earth near the end of times to defeat the Antichrist (Dajjal) and establish justice. However, Muslims do not believe Jesus is God or the Son of God. The Quran states: "The Messiah, son of Mary, was no more than a messenger" (5:75) and "It is not for Allah to take a son" (19:35). Muslims love and revere Jesus deeply, and no Muslim\'s faith is complete without believing in him as a prophet of Allah.',
    sources: [
      'Quran, Surah Maryam 19:16-35',
      'Quran, Surah Al-Imran 3:45-47',
      'Quran, Surah An-Nisa 4:157-158',
      'Sahih al-Bukhari, Book of Prophets, Hadith 3448',
    ],
  },
  {
    patterns: [
      /why.*allah.*allow.*suffering/i, /why.*does.*allah.*allow.*suffering/i,
      /why.*is.*there.*suffering.*islam/i, /why.*does.*god.*allow.*suffering/i,
      /why.*do.*bad.*things.*happen/i, /why.*allah.*allow.*evil/i,
    ],
    keywords: ['suffering', 'why allah allow suffering', 'why god allow suffering', 'bad things happen', 'evil', 'why suffering', 'pain and suffering', 'problem of evil'],
    answer: 'The question of suffering is one of the deepest questions, and Islam offers a comprehensive answer. (1) Free will: Allah gave humans free will, and much suffering is caused by human choices — oppression, greed, cruelty. Without free will, there would be no moral responsibility. (2) Tests and trials: The Quran says: "We will certainly test you with some fear and hunger, and loss of wealth, souls, and fruits. But give good news to the patient" (2:155). Trials are a means of spiritual growth, expiating sins, and raising one\'s rank in Paradise. The Prophet (PBUH) said: "No fatigue, disease, sorrow, sadness, hurt, or distress befalls a Muslim — even a prick from a thorn — except that Allah expiates some of his sins by it" (Bukhari). (3) This world is not the final reality: Islam teaches this life is a temporary test; the eternal life of the Hereafter is where ultimate justice is served. A person who suffered in this life may be compensated beyond imagination in Paradise. (4) We cannot always understand Allah\'s wisdom: "Perhaps you hate a thing and it is good for you; and perhaps you love a thing and it is bad for you. And Allah knows, while you know not" (2:216). (5) Allah suffers with His creation metaphorically — He is As-Salam (the Source of Peace) and Ar-Rahman (the Most Merciful), and He promises that no suffering is wasted. Suffering is not a sign Allah has abandoned you.',
    sources: [
      'Quran, Surah Al-Baqarah 2:155-156',
      'Sahih al-Bukhari, Book of Patience, Hadith 5640',
      'Quran, Surah Al-Baqarah 2:216',
      'Quran, Surah Al-Ankabut 29:2',
    ],
  },
  {
    patterns: [
      /is.*predestination.*real/i, /qadar.*islam/i, /is.*free.*will.*islam/i,
      /destiny.*islam/i, /is.*everything.*predestined/i, /free.*will.*allah/i,
      /is.*qadar.*real/i, /predestination.*islam/i,
    ],
    keywords: ['predestination', 'qadar', 'destiny', 'free will', 'everything predestined', 'qadar islam', 'destiny islam', 'free will islam', 'fate', 'decree'],
    answer: 'Islam teaches a balance between divine decree (qadar) and human free will — this is not a contradiction but a profound truth. (1) Allah has knowledge of everything that will happen — past, present, and future. His knowledge is complete and perfect, but His knowing does not force actions to happen. (2) Allah has written all destinies in the Preserved Tablet (Al-Lawh al-Mahfuz), but this writing is a record of what will happen, not a compulsion. (3) Humans have free will (irada) and make real choices. The Quran repeatedly commands humans to believe, do good, and avoid evil — commands that would be meaningless without free will: "Indeed, We guided him, and he can be either grateful or ungrateful" (76:3). (4) The Prophet (PBUH) said: "Everything is by decree, even inability and ability" (Muslim) and he was asked about ruqyah (healing) and medicine — he replied: "None of this is of any avail except by Allah\'s decree" but he still encouraged using medicine. (5) The correct understanding: we make choices with our free will, but Allah knows what we will choose and has decreed it. We are responsible for our choices, but we rely on Allah (tawakkul) for the outcomes. As the Prophet (PBUH) said: "Tie your camel, then trust in Allah" (Tirmidhi).',
    sources: [
      'Quran, Surah Al-Insan 76:3',
      'Sahih Muslim, Book of Destiny, Hadith 2644',
      'Jami at-Tirmidhi, Hadith 2517',
    ],
  },
  {
    patterns: [
      /is.*black.*magic.*real/i, /is.*sihr.*real/i, /black.*magic.*islam/i,
      /magic.*islam/i, /is.*witchcraft.*haram/i, /sihr.*islam/i,
    ],
    keywords: ['black magic', 'sihr', 'witchcraft', 'magic', 'black magic real', 'sihr real', 'magic islam', 'sorcery'],
    answer: 'Yes, black magic (sihr) is real in Islamic belief, but it is strictly haram to practice. The Quran mentions it in the story of Prophet Musa (Moses) and the sorcerers of Pharaoh (Surah Ta Ha 20:66-70), and in Surah Al-Baqarah 2:102, which tells of two angels (Harut and Marut) who taught sorcery in Babylon as a test — but warned that it is a sin. The Quran says: "They learn from them that by which they cause separation between a man and his wife" (2:102). Key points: (1) Practicing magic, learning it, or consulting magicians/sorcerers is haram and is considered a form of shirk (associating partners with Allah). The Prophet (PBUH) said: "Whoever goes to a fortune-teller and believes what he says has disbelieved in what was revealed to Muhammad" (Abu Dawud). (2) Magic has no real independent power — nothing happens except by Allah\'s will, and magic only affects someone if Allah allows it as a test. (3) Protection from magic: recite the Quran (especially Surah Al-Falaq and Surah An-Nas — the two "protective" surahs), recite Ayat al-Kursi, make dhikr, and trust in Allah. (4) If you believe you are affected by sihr, do not go to a "magician" to break it — that is haram. Instead, recite Quran and make ruqyah with authentic supplications, and if needed, consult a knowledgeable scholar.',
    sources: [
      'Quran, Surah Al-Baqarah 2:102',
      'Quran, Surah Ta Ha 20:66-70',
      'Quran, Surah Al-Falaq 113 and Surah An-Nas 114',
      'Sunan Abi Dawud, Hadith 3904',
    ],
  },
  {
    patterns: [
      /is.*evil.*eye.*real/i, /is.*nazar.*real/i, /evil.*eye.*islam/i,
      /nazar.*islam/i, /is.*hasad.*real/i, /envy.*islam/i, /can.*nazar.*harm/i,
    ],
    keywords: ['evil eye', 'nazar', 'hasad', 'envy', 'evil eye real', 'nazar real', 'nazar islam', 'evil eye islam', 'envy islam'],
    answer: 'Yes, the evil eye (nazar/al-\'ayn) is real in Islamic belief. The Prophet (PBUH) said: "The evil eye is real, and if anything were to overtake destiny, it would be the evil eye" (Muslim). The evil eye occurs when someone looks at something with envy or admiration without mentioning Allah\'s blessing, and it can cause harm by Allah\'s permission. Key points: (1) The harm comes from Allah allowing it — the eye itself has no power; it is a test. (2) Prevention: when you see something you admire (in yourself or others), say "Masha\'Allah" (Allah has willed it) and "Barakallah" (Allah bless it), and recite the Prophet\'s supplication: "Allahumma barik fihi" (O Allah, bless it for him). The Quran tells the story of Prophet Yusuf\'s father advising his sons to enter Egypt through different gates to avoid the evil eye (12:67). (3) Protection: recite Surah Al-Falaq, Surah An-Nas, and Ayat al-Kursi daily, especially morning and evening. (4) If affected: authentic ruqyah (reciting Quran and supplications) is the remedy, not amulets or charms — wearing amulets (tawiz) with anything other than Quran is prohibited by most scholars. (5) Hasad (envy) is a sin of the heart — it is wishing for Allah\'s blessing to be removed from someone. The Prophet (PBUH) warned against it as it "destroys good deeds as fire destroys wood" (Abu Dawud).',
    sources: [
      'Sahih Muslim, Book of Medicine, Hadith 2188',
      'Quran, Surah Yusuf 12:67',
      'Quran, Surah Al-Qalam 68:51',
      'Sunan Abi Dawud, Hadith 3902',
    ],
  },
  {
    patterns: [
      /are.*jinn.*real/i, /is.*jinn.*real/i, /jinn.*islam/i, /what.*are.*jinn/i,
      /do.*jinn.*exist/i, /jinn.*possess/i,
    ],
    keywords: ['jinn', 'jinn real', 'jinn islam', 'jinn exist', 'jinn possess', 'what are jinn', 'genie', 'spirits'],
    answer: 'Yes, jinn are real in Islamic belief. They are a creation of Allah made from smokeless fire, as the Quran states: "And He created the jinn from a smokeless flame of fire" (55:15) and "I did not create jinn and mankind except to worship Me" (51:56). Key points about jinn: (1) Like humans, jinn have free will — some are Muslim (believers), some are disbelievers, and some are mischievous. (2) They live in a parallel realm and cannot normally be seen by humans. (3) Iblis (Satan) is a jinn who disobeyed Allah by refusing to prostrate to Adam. (4) Jinn can possess humans — this is affirmed in the Quran and Sunnah, but it is rare and not as common as cultural beliefs suggest. Signs of possession can mimic mental illness, so medical causes should be ruled out first. (5) Protection from jinn: reciting the Quran (especially Ayat al-Kursi, Surah Al-Falaq, Surah An-Nas, and the morning/evening adhkar), keeping the home clean (the Prophet said jinn inhabit dirty places), saying "Bismillah" before entering the bathroom, and covering food. (6) Jinn cannot predict the future or know the unseen — only Allah knows the unseen. (7) Seeking help from jinn or soothsayers who claim to communicate with jinn is haram. If you believe you are affected, recite Quranic ruqyah and consult a qualified scholar, not a "jinn exorcist" who charges money.',
    sources: [
      'Quran, Surah Ar-Rahman 55:15',
      'Quran, Surah Adh-Dhariyat 51:56',
      'Quran, Surah Al-Jinn 72:1-15',
      'Sahih al-Bukhari, Book of Prophets, Hadith 3314',
    ],
  },
  {
    patterns: [
      /is.*abortion.*haram/i, /abortion.*islam/i, /can.*muslim.*have.*abortion/i,
      /is.*abortion.*allowed.*islam/i,
    ],
    keywords: ['abortion', 'abortion haram', 'abortion islam', 'abortion allowed', 'terminate pregnancy', 'miscarriage islam'],
    answer: 'Abortion in Islam is a nuanced topic where the ruling depends on the stage of pregnancy and the reason. (1) Before 120 days (ensoulment/rhuh): The majority of scholars permit abortion only for a valid medical reason (danger to the mother\'s life, severe fetal abnormality). Some scholars permit it more broadly before 120 days, while others prohibit it from conception. The hadith says the soul is breathed into the fetus at 120 days (Bukhari and Muslim). (2) After 120 days: All major scholars agree that abortion is haram (prohibited) except to save the mother\'s life, because after ensoulment the fetus is considered a living soul with rights. (3) In cases of rape or incest: This is debated — some scholars permit abortion before 120 days to spare the woman further trauma, while others hold it is still not permitted because the child is innocent. (4) "Inconvenience" abortions (not wanting a child, financial reasons) are not considered valid reasons by the majority — the Quran encourages trusting Allah for provision (rizq). If you are facing this decision, please consult a qualified scholar and a medical professional. Allah is Most Merciful and knows your circumstances.',
    sources: [
      'Quran, Surah Al-Isra 17:31 (do not kill children for fear of poverty)',
      'Sahih al-Bukhari, Book of Prophets, Hadith 3208 (ensoulment at 120 days)',
      'Sahih Muslim, Book of Destiny, Hadith 2643',
    ],
  },
  {
    patterns: [
      /is.*masturbation.*haram/i, /masturbation.*islam/i, /is.*self.*pleasure.*haram/i,
      /can.*muslim.*masturbate/i, /is.*masterbation.*haram/i,
    ],
    keywords: ['masturbation', 'masturbation haram', 'masturbation islam', 'self pleasure', 'masterbation', 'masturbate'],
    answer: 'The majority of Islamic scholars consider masturbation to be haram (prohibited), based on the Quranic verse: "And those who guard their private parts except from their wives or those their right hands possess — for indeed, they are not to be blamed. But whoever seeks beyond that, then they are the transgressors" (23:5-7, also 70:29-31). The phrase "beyond that" is understood by the majority to include masturbation. However, there are nuances: (1) Some scholars (a minority view, including some Hanafi scholars) hold that masturbation is haram in general but may be permitted in extreme cases where a person fears falling into zina (fornication) — as the lesser of two evils. (2) Addiction to pornography and masturbation is a real struggle for many, and Islam encourages seeking help, not despairing in Allah\'s mercy. (3) Remedies: fasting (the Prophet recommended fasting for those who cannot marry), lowering the gaze, avoiding triggers, seeking marriage when able, making tawbah (repentance), and if needed, seeking counseling or joining support programs. (4) Repentance: Allah forgives all sins for the one who repents sincerely. Do not let shame keep you from turning back to Allah — He is Ar-Rahman, the Most Merciful.',
    sources: [
      'Quran, Surah Al-Mu\'minun 23:5-7',
      'Quran, Surah Al-Ma\'arij 70:29-31',
      'Sahih al-Bukhari, Book of Marriage, Hadith 5066',
    ],
  },
  {
    patterns: [
      /is.*handshake.*haram/i, /handshake.*opposite.*gender/i, /can.*muslim.*shake.*hand/i,
      /is.*shaking.*hand.*haram/i, /handshake.*non.*mahram/i, /men.*women.*handshake.*islam/i,
    ],
    keywords: ['handshake', 'shake hand', 'shaking hand', 'handshake opposite', 'handshake non mahram', 'handshake haram', 'men women handshake'],
    answer: 'The majority of scholars consider it haram for a man to shake hands with a non-mahram woman (and vice versa), based on the hadith where the Prophet (PBUH) said: "I do not shake hands with women" (Nasa\'i, Ibn Majah) and Aisha (RA) reported: "By Allah, the hand of the Messenger of Allah never touched the hand of a woman" (Bukhari). When the Prophet took the bay\'ah (pledge) from women, he did so verbally without physical contact. However, there are considerations: (1) Some contemporary scholars, particularly in the Maliki school and some modern thinkers, hold that a handshake may be permissible if it is devoid of any desire (shahwa) and is a customary greeting that would cause offense or misunderstanding if refused — especially in professional/workplace settings in non-Muslim countries. (2) The majority view remains that it is better to avoid physical contact and politely decline, explaining religious reasons. (3) You can place your hand over your heart and smile as a respectful alternative. The ruling is about intention and circumstance — if there is any risk of desire or inappropriate feelings, it is clearly haram. Consult a scholar for your specific situation.',
    sources: [
      'Sahih al-Bukhari, Book of Pledge, Hadith 4891',
      'Sunan an-Nasa\'i, Book of Bay\'ah, Hadith 4189',
      'Sunan Ibn Majah, Hadith 2874',
    ],
  },
  {
    patterns: [
      /can.*muslim.*keep.*cat/i, /is.*cat.*haram/i, /cat.*in.*house.*islam/i,
      /are.*cats.*clean.*islam/i, /cat.*pet.*islam/i, /is.*keeping.*cat.*allowed/i,
    ],
    keywords: ['cat', 'cats', 'cat haram', 'keep cat', 'cat pet', 'cat islam', 'cats clean', 'cat in house'],
    answer: 'Yes, keeping cats is permissible (mubah) in Islam, and cats are considered clean (tahir), not impure (najis). The Prophet (PBUH) had a beloved cat named Muezza, and there are well-known stories of his kindness to cats — once he cut off the sleeve of his robe rather than disturb his sleeping cat. Key points: (1) Cats are not najis (impure) — the Prophet (PBUH) said: "Cats are not impure. They are among those who go around among you" (Abu Dawud, Tirmidhi), meaning they are free-roaming and their presence does not invalidate wudu or require washing. (2) Cat fur on clothing does not invalidate prayer. (3) If a cat drinks from a container, the water remains pure — the Prophet said: "They (cats) are among the male and female jinn... and they have the same places as you" (Abu Dawud). (4) However, you must provide proper care — feeding, water, shelter — and the Prophet warned that a woman was punished for starving a cat. (5) Unlike dogs, cats do not require the ritual washing (seven times) for their saliva. So keeping a cat as a pet is fine in Islam, provided it is cared for humanely.',
    sources: [
      'Sunan Abi Dawud, Book of Purification, Hadith 74',
      'Sahih al-Bukhari, Book of Beginning of Creation, Hadith 3313',
      'Jami at-Tirmidhi, Hadith 92',
    ],
  },
  {
    patterns: [
      /is.*chess.*haram/i, /chess.*islam/i, /are.*video.*games.*haram/i,
      /video.*game.*islam/i, /gaming.*haram/i, /are.*games.*haram.*islam/i,
    ],
    keywords: ['chess', 'video games', 'video game', 'gaming', 'chess haram', 'games haram', 'gaming haram', 'playing games'],
    answer: 'The ruling on games like chess and video games depends on their content and effect on you. (1) Chess: Classical scholars differed — Imam Malik and some others considered it disliked or prohibited because it was associated with gambling, while Imam Ash-Shafi\'i and others permitted it if it does not involve gambling or distract from obligatory duties. Ali (RA) was reported to have said: "Chess is gambling of the non-Arabs." The majority of contemporary scholars permit chess if it does not involve betting, does not distract from prayer or obligations, and does not consume excessive time. (2) Video games: The ruling depends on content. Games with haram content (gambling, sexual content, glorifying violence/crime, shirk/occult elements) are haram. Games that are purely recreational, puzzle, sports, or strategy games are permissible as long as they do not: (a) involve gambling, (b) contain inappropriate content, (c) become addictive and distract from prayer, work, or family, (d) cause you to miss obligations. Excessive gaming that wastes time and neglects duties is discouraged. The Prophet (PBUH) said: "There are two blessings which many people lose: health and free time" (Bukhari).',
    sources: [
      'Sahih al-Bukhari, Book of Funerals, Hadith 6412 (blessings of health and time)',
      'Quran, Surah Al-Hijr 15:3 (enjoyment in this world is limited)',
      'Classical fiqh discussions on la\'ib (games)',
    ],
  },
  {
    patterns: [
      /is.*crypto.*haram/i, /cryptocurrency.*islam/i, /bitcoin.*islam/i,
      /is.*trading.*haram/i, /stock.*market.*islam/i, /is.*investing.*haram/i,
      /is.*bitcoin.*haram/i,
    ],
    keywords: ['crypto', 'cryptocurrency', 'bitcoin', 'trading', 'stock', 'stock market', 'investing', 'invest', 'crypto haram', 'bitcoin haram', 'trading haram'],
    answer: 'Cryptocurrency and stock trading are modern topics where scholars have differed. (1) Cryptocurrency (Bitcoin, etc.): Some scholars prohibit it because it is highly speculative (gharar — excessive uncertainty), has no intrinsic value or backing, and is used for haram activities. Others permit it as a medium of exchange and store of value if it is treated like a currency and not as pure speculation/gambling. The majority of contemporary scholars are cautious — they permit holding crypto as a store of value but warn against day-trading it like gambling. (2) Stock market investing: Investing in shares of halal companies (no alcohol, pork, gambling, riba/interest-based banking, or adult entertainment) is permitted by most scholars. Companies must not have significant debt with interest (scholars set thresholds, commonly under 33-40%). Islamic finance scholars have created Shariah-screened stock indexes. (3) Day trading and speculation: Scholars generally discourage excessive speculation that resembles gambling (maysir). (4) Options, futures, and margin trading: Most scholars consider these haram due to gharar (uncertainty) and riba. For specific rulings, consult a scholar knowledgeable in Islamic finance.',
    sources: [
      'Quran, Surah Al-Baqarah 2:275 (trade is halal, riba is haram)',
      'Quran, Surah Al-Ma\'idah 5:90 (gambling prohibited)',
      'Contemporary fatwas from Islamic finance councils (AAOIFI)',
    ],
  },
  {
    patterns: [
      /is.*insurance.*haram/i, /insurance.*islam/i, /can.*muslim.*have.*insurance/i,
      /is.*car.*insurance.*haram/i, /is.*life.*insurance.*haram/i, /is.*health.*insurance.*haram/i,
    ],
    keywords: ['insurance', 'insurance haram', 'car insurance', 'life insurance', 'health insurance', 'insurance islam', 'takaful'],
    answer: 'Commercial insurance is a debated topic among Islamic scholars. (1) The majority of classical and many contemporary scholars consider conventional commercial insurance to be haram because it contains elements of riba (interest), gharar (excessive uncertainty), and maysir (gambling) — you pay a premium not knowing if you will receive anything, and the payout depends on an uncertain future event. (2) However, contemporary scholars differentiate: (a) Mandatory insurance required by law (like car insurance in many countries) is permitted as a necessity — you are obeying the law of the land and protecting yourself from liability. (b) Health insurance: Many scholars permit it, especially in countries without universal healthcare, as a necessity to access medical care. Some still prefer cooperative/takaful insurance (Islamic mutual insurance) when available. (c) Life insurance: This is more debated — some prohibit it outright, while others permit term life insurance to protect dependents, especially for breadwinners. (3) Takaful (Islamic insurance): This is a cooperative model where members contribute to a shared pool, and surplus is returned or donated. Most scholars consider takaful to be halal. For your situation, consult a scholar, but the general principle is: necessity and legal requirement can make otherwise haram things permissible.',
    sources: [
      'Quran, Surah Al-Baqarah 2:185 (Allah intends ease, not hardship)',
      'Quran, Surah Al-Baqarah 2:275-279 (riba prohibited)',
      'Contemporary fatwas from Islamic Fiqh Councils',
    ],
  },
  {
    patterns: [
      /missed.*fast.*what.*do/i, /missed.*ramadan.*fast/i, /how.*make.*up.*missed.*fast/i,
      /missed.*fast.*ramadan.*islam/i, /kaffarah.*missed.*fast/i,
    ],
    keywords: ['missed fast', 'missed ramadan', 'make up fast', 'qada fast', 'kaffarah', 'missed fasting', 'missed fasts'],
    answer: 'If you missed fasts in Ramadan, Islam provides clear guidance: (1) If you missed fasts due to a valid reason (illness, travel, pregnancy, nursing, menstruation), you must make them up (qada) on other days before the next Ramadan. The Quran says: "Whoever is ill or on a journey, then fasting a number of other days" (2:185). You do not need to fast consecutively — you can spread them out. (2) If you missed fasts without a valid excuse (just laziness or neglect), the majority of scholars say you must make them up AND repent (tawbah). Some scholars add a kaffarah (expiation) of feeding a poor person for each missed day, but this is debated. (3) If you broke a fast intentionally by eating or intimacy, kaffarah is required: fasting 60 consecutive days, or feeding 60 poor people, or freeing a slave (no longer applicable). (4) If you cannot fast at all due to chronic illness or old age and cannot make them up, you pay fidyah: feeding one poor person for each missed day (equivalent of one meal). (5) If Ramadan has passed and you have not made up the fasts before the next Ramadan, you should make them up as soon as possible and some scholars add feeding a poor person for each day as a delay penalty. Consult a scholar for your specific case.',
    sources: [
      'Quran, Surah Al-Baqarah 2:184-185',
      'Sahih al-Bukhari, Book of Fasting, Hadith 1950',
      'Sahih Muslim, Book of Fasting',
    ],
  },
  {
    patterns: [
      /can.*prayers.*be.*combined/i, /combining.*prayer.*islam/i, /jama.*prayer.*islam/i,
      /joining.*prayer/i, /shorten.*prayer.*travel/i, /qasr.*prayer/i,
      /travel.*prayer.*islam/i, /can.*i.*combine.*prayer/i,
    ],
    keywords: ['combine prayer', 'combining prayer', 'joining prayer', 'shorten prayer', 'qasr', 'travel prayer', 'jama prayer', 'combine salah'],
    answer: 'Yes, Islam allows combining and shortening prayers in certain situations. (1) Shortening prayers (qasr): When traveling a distance considered "travel" by scholars (commonly set at around 48-80 km / 30-50 miles, though opinions vary), the four-rakat obligatory prayers (Dhuhr, Asr, Isha) are shortened to two rakats. The Quran says: "And when you travel throughout the land, there is no blame upon you for shortening the prayer" (4:101). You continue shortening prayers for the duration of your travel until you return home or intend to stay at your destination for a set period (scholars differ: 4 days, 10 days, 15 days, or 18 days — follow your school or a scholar). (2) Combining prayers (jam\'): You may combine Dhuhr and Asr (either at Dhuhr time or Asr time), or Maghrib and Isha (either at Maghrib time or Isha time). Reasons for combining: (a) Travel, (b) Illness or difficulty, (c) Rain/mud (for Maghrib/Isha specifically, according to some scholars), (d) Hajj (combining Dhuhr and Asr at Arafat, Maghrib and Isha at Muzdalifah). Combining is not allowed for Fajr with any other prayer. (3) You cannot combine prayers simply for convenience or work — there must be a valid reason. Consult a scholar for your situation.',
    sources: [
      'Quran, Surah An-Nisa 4:101',
      'Sahih Muslim, Book of Prayer, Hadith 686 (combining while traveling)',
      'Sahih al-Bukhari, Book of Shortening Prayers, Hadith 1095',
    ],
  },
  {
    patterns: [
      /is.*zakat.*obligatory/i, /how.*calculate.*zakat/i, /zakat.*on.*gold/i,
      /zakat.*jewelry/i, /when.*pay.*zakat/i, /how.*much.*zakat/i, /nisaab.*zakat/i,
    ],
    keywords: ['zakat', 'zakat obligatory', 'calculate zakat', 'zakat on gold', 'zakat jewelry', 'how much zakat', 'nisab', 'nisaab', 'zakat calculation', 'pay zakat'],
    answer: 'Zakat is the third pillar of Islam — an obligatory annual charity (2.5% of qualifying wealth) for Muslims whose wealth exceeds the nisab threshold. Key rules: (1) Nisab: The minimum threshold is the value of 85 grams of gold OR 595 grams of silver. You pay zakat only if your qualifying wealth exceeds this threshold for a full lunar year. Most scholars follow the silver standard today as it benefits the poor more (silver nisab is lower). (2) What is zakatable: Cash, gold, silver, jewelry (if it reaches nisab value — scholars differ on jewelry worn daily vs. stored for savings), business inventory, livestock, agricultural produce, and investments/stocks. (3) What is not zakatable: Your primary home, car, clothing, furniture, tools of your trade, and debts you owe. (4) Rate: 2.5% (one-quarter of a tenth) of qualifying wealth held for a lunar year. (5) Who receives zakat: The Quran specifies 8 categories (9:60): the poor, the needy, those in debt, travelers in need, those struggling in Allah\'s path, those whose hearts are to be reconciled, slaves buying freedom, and zakat administrators. (6) You cannot give zakat to your parents, children, spouse, or descendants/ascendants — they are your responsibility. Siblings and extended family can receive it. Use an online zakat calculator or consult a scholar for complex cases.',
    sources: [
      'Quran, Surah At-Tawbah 9:60 (8 categories)',
      'Quran, Surah Al-Baqarah 2:43',
      'Sahih al-Bukhari, Book of Zakat, Hadith 1403',
      'Sunan Abi Dawud, Hadith 1565',
    ],
  },
  {
    patterns: [
      /is.*adopting.*child.*haram/i, /adoption.*islam/i, /can.*muslim.*adopt/i,
      /orphan.*islam/i, /fostering.*islam/i,
    ],
    keywords: ['adopt', 'adoption', 'adopting child', 'orphan', 'fostering', 'adoption islam', 'adopt child', 'foster child'],
    answer: 'Adoption in the Western sense (where the child takes the adoptive family\'s name and the legal relationship erases the biological one) is not permitted in Islam, but fostering/kafalah is highly encouraged. The Quran states: "Allah has not made for a man two hearts in his interior... nor has He made your adopted sons your real sons. That is your saying with your mouths. But Allah says the truth" (33:4). Key points: (1) An adopted child must keep their biological father\'s name — the Prophet (PBUH) said: "Whoever claims to belong to someone other than his father, Paradise is forbidden to him" (Bukhari). (2) The child is not a mahram to the adoptive family in the same way biological relatives are — hijab rules apply between the adoptive mother/father and the adopted child once they reach puberty, unless the child was adopted very young and nursed by the adoptive mother (creating a milk-kinship/rada\'a, which makes them mahram). (3) The adopted child does not automatically inherit from the adoptive parents — you can give them up to one-third of your estate through a will (wasiyya). (4) Caring for orphans is one of the most beloved deeds to Allah: "And they give food in spite of love for it to the needy, the orphan, and the captive" (76:8). The Prophet (PBUH) said: "I and the caretaker of an orphan will be in Paradise like this" and held up his two fingers (Bukhari). (5) Islamic kafalah (fostering/guardianship) is the proper framework — providing love, care, education, and upbringing while preserving the child\'s identity.',
    sources: [
      'Quran, Surah Al-Ahzab 33:4-5',
      'Sahih al-Bukhari, Book of Prophets, Hadith 5304',
      'Quran, Surah Al-Insan 76:8',
    ],
  },
  {
    patterns: [
      /why.*should.*i.*pray/i, /why.*is.*salah.*important/i, /benefit.*of.*prayer.*islam/i,
      /why.*do.*we.*pray.*5.*times/i, /importance.*of.*salah/i,
    ],
    keywords: ['why pray', 'why salah important', 'benefit of prayer', 'why pray 5 times', 'importance of salah', 'why should i pray', 'prayer importance'],
    answer: 'Salah (prayer) is the second pillar of Islam and the first thing a Muslim will be questioned about on the Day of Judgment. Here is why it matters: (1) It is a direct connection with Allah — the Prophet (PBUH) said: "The closest a servant is to his Lord is when he is in prostration" (Muslim). (2) It was given directly to the Prophet during the Night Journey (Isra and Mi\'raj) — Allah gave it directly rather than through an angel, showing its importance. (3) It prevents sin: "Indeed, prayer prohibits immorality and wrongdoing" (Quran 29:45). Regular prayer builds God-consciousness (taqwa) that makes you less likely to sin throughout the day. (4) It brings peace: "Verily, in the remembrance of Allah do hearts find rest" (Quran 13:28). The five daily prayers create structure and mindfulness throughout your day. (5) It washes away sins: the Prophet (PBUH) compared the five daily prayers to a river you wash in five times a day — it cleanses you of sins (Bukhari). (6) It is a sign of faith — the Prophet (PBUH) said: "Between a man and disbelief (kufr) is the abandonment of prayer" (Muslim). (7) It is not a burden but a gift — a time to pause, reflect, seek help, and find peace. If you struggle with prayer, start with one and build up; Allah loves consistency even if small.',
    sources: [
      'Quran, Surah Al-Ankabut 29:45',
      'Quran, Surah Ar-Ra\'d 13:28',
      'Sahih al-Bukhari, Book of Prayer, Hadith 528',
      'Sahih Muslim, Book of Faith, Hadith 82',
    ],
  },
  {
    patterns: [
      /is.*allah.*real/i, /does.*allah.*exist/i, /proof.*of.*god.*islam/i,
      /how.*know.*allah.*real/i, /evidence.*god.*exists/i, /is.*god.*real.*islam/i,
    ],
    keywords: ['allah real', 'allah exist', 'proof of god', 'evidence god exists', 'god real islam', 'does allah exist', 'is allah real', 'proof allah'],
    answer: 'Islam invites reflection on the existence of God through reason and observation, not blind faith. The Quran repeatedly says: "Indeed, in the creation of the heavens and the earth, the alternation of night and day, the ships that sail for benefit, the rain Allah sends from the sky, and the living creatures... are signs for people who use reason" (2:164). Key reflections: (1) The order and precision of the universe — from the laws of physics to the rotation of planets — points to a Designer, not random chance. (2) The fine-tuning of the universe: if any of dozens of physical constants were slightly different, life could not exist. This suggests intentional design. (3) Human consciousness, morality, and the search for meaning cannot be fully explained by material processes — they point to a spiritual dimension and a Creator. (4) The Quran itself is a sign: it was revealed to an unlettered Prophet (PBUH) and contains no internal contradictions despite being revealed over 23 years in different circumstances. It also contains references to natural phenomena (embryology, the water cycle, the expanding universe) that were unknown at the time. (5) The Prophet\'s life: a man known for honesty (Al-Amin) who could not read or write produced a book of unparalleled eloquence and law. (6) The fitra: Islam teaches every human is born with an innate disposition (fitra) to recognize their Creator — this is why people in every culture throughout history have sought God. Disbelief often comes from cultural conditioning, not from a lack of evidence.',
    sources: [
      'Quran, Surah Al-Baqarah 2:164',
      'Quran, Surah Al-Imran 3:190-191',
      'Quran, Surah Ar-Rum 30:30 (fitra)',
      'Quran, Surah Al-Mulk 67:3-4',
    ],
  },
  {
    patterns: [
      /is.*islam.*spread.*by.*sword/i, /did.*islam.*spread.*by.*force/i,
      /forced.*conversion.*islam/i, /is.*islam.*violent/i, /does.*islam.*force.*conversion/i,
    ],
    keywords: ['spread by sword', 'spread by force', 'forced conversion', 'islam violent', 'force conversion', 'islam spread sword', 'islam spread force'],
    answer: 'No, Islam was not spread by the sword or by forced conversion — this is a historical misconception. (1) The Quran explicitly forbids forced conversion: "There is no compulsion in religion. The right course has become distinct from the wrong" (2:256). (2) The Quran limits warfare to self-defense and protection of religious freedom: "Fight in the way of Allah those who fight you but do not transgress" (2:190) and "Permission to fight has been given to those who are being fought, because they were wronged" (22:39). (3) Historical evidence: In lands under Muslim rule (like Spain, Egypt, Persia, India), Christians, Jews, and other religious communities continued to practice their religions for centuries. If conversion had been forced, these communities would not have survived. (4) The largest Muslim populations today — Indonesia, Malaysia, West Africa — were never conquered by Muslim armies. Islam spread there through trade, Sufi missionaries, and the character of Muslim merchants. (5) Islamic history did include political/territorial expansion (like all empires of the era — Roman, Persian, Byzantine), but political conquest is different from religious conversion. People under Muslim rule often adopted Islam over generations, attracted by its teachings, justice, and the example of Muslims. (6) The Prophet (PBUH) sent letters inviting rulers to Islam peacefully; he never forced anyone. (7) Regrettably, some later Muslim rulers did act unjustly, but this reflects human failure, not Islamic teaching. The majority of scholars and Muslims condemn forced conversion as un-Islamic.',
    sources: [
      'Quran, Surah Al-Baqarah 2:256',
      'Quran, Surah Al-Hajj 22:39-40',
      'Quran, Surah Al-Mumtahanah 60:8',
      'Sahih al-Bukhari, Book of Jihad',
    ],
  },
  {
    patterns: [
      /is.*free.*mixing.*haram/i, /gender.*mixing.*islam/i, /ikhtilat.*islam/i,
      /men.*women.*mixing.*haram/i, /is.*free.*mixing.*allowed/i,
      /opposite.*gender.*interaction.*islam/i,
    ],
    keywords: ['free mixing', 'gender mixing', 'ikhtilat', 'men women mixing', 'opposite gender interaction', 'mixing genders', 'free mixing haram'],
    answer: 'Islam encourages respectful, purposeful interaction between men and women but discourages free, casual mixing (ikhtilat) that could lead to inappropriate situations. Key principles: (1) Lowering the gaze: the Quran commands both men and women: "Tell the believing men to lower their gaze and guard their private parts" (24:30) and "Tell the believing women to lower their gaze" (24:31). This applies to both genders equally. (2) Purposeful interaction: working, studying, buying, selling, and necessary communication with the opposite gender is permitted and normal — the Prophet\'s wives, the female companions, and women throughout Islamic history interacted with men for legitimate purposes. (3) Avoiding seclusion (khalwa): the Prophet (PBUH) said: "No man is alone with a woman but Satan is the third" (Tirmidhi). A man and woman who are non-mahram should not be alone in a closed space. (4) Modesty in dress and speech: both men and women should dress and speak modestly. (5) The concern is not interaction itself but situations that could lead to temptation or impropriety — Islam is realistic about human nature. (6) In workplaces and schools, professional interaction is fine; casual socializing that involves flirting, immodest behavior, or unnecessary seclusion is what scholars discourage. (7) Cultural practices that totally isolate women are cultural, not Islamic — the female companions attended the mosque, asked questions, and participated in society.',
    sources: [
      'Quran, Surah An-Nur 24:30-31',
      'Jami at-Tirmidhi, Hadith 1174',
      'Sahih al-Bukhari, Book of Prayer (women attending mosque)',
    ],
  },
  {
    patterns: [
      /is.*wudu.*invalidated.*by/i, /what.*breaks.*wudu/i, /break.*wudu.*islam/i,
      /nullifies.*wudu/i,
    ],
    keywords: ['wudu invalidated', 'breaks wudu', 'what breaks wudu', 'nullifies wudu', 'wudu breaks', 'invalidate wudu'],
    answer: 'Wudu (ablution) is invalidated by specific things according to Islamic law. The majority of scholars agree that the following break wudu: (1) Anything exiting from the front or rear private parts — urine, stool, gas, and other emissions. The Prophet (PBUH) said: "Allah does not accept the prayer of any of you who is in a state of impurity until he makes wudu" (Bukhari). (2) Deep sleep — losing consciousness. The Prophet (PBUH) said: "The eye is the drawstring of the anus, so when the eyes sleep, the bowels are loosened" (Tirmidhi). Light drowsiness where you are still aware is debated. (3) Loss of consciousness from illness, fainting, or intoxication. (4) Touching the private parts with desire (scholars differ on whether it\'s any touching or only with desire — the Shafi\'i school holds any skin contact with the opposite sex breaks wudu, while the majority hold it must be with desire or the other person is a non-mahram). (5) Vomiting a large amount (debated — some say any amount, others only a mouthful). (6) Eating camel meat — the Prophet (PBUH) was asked about making wudu after eating camel meat and he said: "Yes" (Muslim). (This is a minority opinion in some schools, but the hadith is authentic.) (7) Bleeding — scholars differ; some say any bleeding breaks wudu, others say only if it flows beyond the wound. What does NOT break wudu: laughing, changing clothes, touching the Quran, talking, or being in a state of minor doubt. If in doubt and you are sure you had wudu, do not redo it — certainty is not overridden by doubt.',
    sources: [
      'Quran, Surah Al-Ma\'idah 5:6',
      'Sahih al-Bukhari, Book of Ablution, Hadith 135',
      'Sahih Muslim, Book of Purification, Hadith 363',
      'Jami at-Tirmidhi, Hadith 78',
    ],
  },
  {
    patterns: [
      /is.*istikhara.*prayer/i, /how.*do.*istikhara/i, /salat.*istikhara/i,
      /istikhara.*decision/i, /how.*pray.*istikhara/i, /guidance.*prayer.*islam/i,
    ],
    answer: 'Salat al-Istikhara is the Prayer of Seeking Guidance — a special prayer the Prophet (PBUH) taught for making decisions. The Prophet (PBUH) said: "If any of you is concerned about a decision, let him pray two rakats of voluntary prayer, then say: \'O Allah, I seek Your guidance by Your knowledge, and I seek ability by Your power, and I ask You of Your great bounty...\'" (Bukhari). How to perform it: (1) Pray two rakats of voluntary prayer (nafl) at any time prayers are permitted (not during the prohibited times — sunrise, sunset, zenith). (2) After the prayer, recite the istikhara du\'a: "Allahumma inni astakhiruka bi\'ilmika, wa astaqdiruka bi-qudratika, wa as\'aluka min fadlika al-\'azim. Fa innaka taqdiru wa la aqdir, wa ta\'lamu wa la a\'lam, wa anta \'allam al-ghuyub. Allahumma in kunta ta\'lamu anna hadhal-amra (mention your decision) khayrun li fi dini wa ma\'ashi wa \'aqibati amri (or: \'ajili amri wa ajilihi) fa-qdurhu li wa yassirhu li thumma barik li fihi. Wa in kunta ta\'lamu anna sharrun li fi dini wa ma\'ashi wa \'aqibati amri (or: fi \'ajili amri wa ajilihi) fasrifhu \'anni wasrifni \'anhu, wa-qdur li al-khayra haythu kana thumma ardini bihi." (3) The outcome: Istikhara does not necessarily give you a dream or a sign. After performing it, you proceed with what feels right and what your heart leans toward — Allah will either make it easy (a sign it is good) or place obstacles (a sign to avoid). You can repeat it multiple times. (4) Combine istikhara with practical consultation (istishara) — ask knowledgeable people, consider pros and cons, and then pray istikhara.',
    sources: [
      'Sahih al-Bukhari, Book of Prayer, Hadith 1166',
      'Jami at-Tirmidhi, Book of Prayer, Hadith 436',
    ],
  },
  {
    patterns: [
      /is.*menstruation.*prayer/i, /can.*women.*pray.*menstruation/i, /period.*prayer.*islam/i,
      /menstruation.*islam/i, /haidh.*prayer/i, /can.*women.*fast.*period/i,
      /period.*ramadan.*islam/i,
    ],
    keywords: ['menstruation', 'period', 'haidh', 'menstruation prayer', 'period prayer', 'period fasting', 'women period', 'menstruation islam', 'can women pray period', 'period ramadan'],
    answer: 'In Islam, a woman experiencing menstruation (haidh) is exempt from salah (prayer) and fasting during her period, and she does not make up the missed prayers. Key rulings: (1) Prayer: A menstruating woman does not pray (salah) and does not need to make up these prayers later — this is a mercy and exemption, not a punishment. Aisha (RA) said: "We were commanded to make up the fasts but we were not commanded to make up the prayers" (Muslim). (2) Fasting: A menstruating woman does not fast during Ramadan, but she MUST make up the missed fasts on other days before the next Ramadan. (3) Quran recitation: Scholars differ — some say a menstruating woman cannot touch the Quran or recite it, while others permit recitation from memory for the purpose of dhikr and learning. The majority say she may recite dhikr, du\'a, and even Quranic phrases used in du\'a, but not recite the Quran as formal recitation (qira\'a). Some contemporary scholars permit all recitation. (4) Entering the mosque: The majority say a menstruating woman cannot enter the mosque, but she can pass through. Some contemporary scholars are more lenient. (5) Intimacy: Intercourse during menstruation is prohibited (Quran 2:222), but other forms of intimacy are permitted. (6) After the period ends, the woman must perform ghusl (full-body ritual purification) before resuming prayer. (7) Postpartum bleeding (nifas) follows similar rules. This is not a spiritual demotion — the Prophet (PBUH) never treated menstruating women as spiritually inferior; they continue to make du\'a, dhikr, give charity, and do all good deeds except the specific acts mentioned.',
    sources: [
      'Quran, Surah Al-Baqarah 2:222',
      'Sahih Muslim, Book of Menstruation, Hadith 335',
      'Sahih al-Bukhari, Book of Menstruation, Hadith 321',
    ],
  },
  {
    patterns: [
      /what.*is.*halal.*meat/i, /how.*animal.*slaughtered.*islam/i, /zabihah.*islam/i,
      /halal.*slaughter/i, /is.*meat.*halal/i, /can.*muslim.*eat.*any.*meat/i,
      /ahl.*kitab.*meat/i, /christian.*meat.*halal/i, /jew.*meat.*halal/i,
    ],
    keywords: ['halal meat', 'slaughter', 'zabihah', 'kosher', 'halal slaughter', 'how animal slaughtered', 'halal meat islam', 'christian meat', 'jew meat', 'ahl kitab meat', 'halal food'],
    answer: 'For meat to be halal in Islam, it must meet specific requirements: (1) The animal must be lawful (cow, sheep, goat, chicken, camel, etc. — not pork, carnivorous animals, or animals Islam prohibits). (2) The slaughterer must be a Muslim, or a Jew or Christian (People of the Book) — the Quran permits this: "Food of those who were given the Scripture is lawful for you" (5:5). (3) The name of Allah must be invoked at slaughter: "So eat of that upon which the name of Allah has been mentioned" (6:118). The slaughterer says "Bismillah, Allahu Akbar" before cutting. (4) The slaughter must be done by cutting the throat, windpipe, and the two jugular veins with a sharp blade, in a single motion, causing rapid blood drainage. (5) The animal must be alive and healthy at the time of slaughter. (6) Stunning before slaughter is debated — some scholars permit it if it does not kill the animal before the actual slaughter; others prohibit it. Regarding meat from Jewish (kosher) and Christian sources: The majority of scholars permit it based on 5:5, as long as the animal itself is halal (not pork). However, some contemporary scholars are cautious about commercial meat in Western countries where the name of Allah is not mentioned and the method is not certain — they recommend seeking certified halal or kosher meat. When in doubt, it is better to avoid.',
    sources: [
      'Quran, Surah Al-Ma\'idah 5:3-5',
      'Quran, Surah Al-An\'am 6:118-121',
      'Sahih al-Bukhari, Book of Slaughter, Hadith 5498',
    ],
  },
  {
    patterns: [
      /is.*greeting.*non.*muslim.*haram/i, /can.*wish.*merry.*christmas/i,
      /greeting.*kafir/i, /can.*muslim.*greet.*non.*muslim/i, /salaam.*non.*muslim/i,
    ],
    keywords: ['greeting non muslim', 'merry christmas', 'greeting kafir', 'greet non muslim', 'salaam non muslim', 'wishing non muslim', 'greeting non muslims'],
    answer: 'Greeting non-Muslims is permitted in Islam, with some guidelines. (1) The Prophet (PBUH) said: "When the People of the Book greet you, say \'wa \'alaykum\' (and upon you)" (Bukhari) — this was in a specific historical context where some would say "as-saam (death) upon you" instead of salaam. Most scholars interpret this as: if a non-Muslim greets you with salaam, you may respond with "wa \'alaykum" rather than the full "wa \'alaykum as-salaam." However, many scholars hold that if you know the person is sincerely greeting you with peace, you may give the full greeting out of courtesy. (2) Initiating salaam to non-Muslims: The majority of scholars discourage initiating the Islamic greeting of salaam to non-Muslims, based on the hadith "Do not initiate the greeting of salaam to the Jews and Christians" (Muslim). However, some scholars permit it in contexts of dawah, building relationships, or courtesy. (3) General greetings: You can absolutely say "hello," "good morning," "how are you," and other general greetings to non-Muslims — this is normal courtesy and encouraged. (4) Wishing "Merry Christmas" or similar: Scholars differ — some prohibit it because it affirms a religious belief that contradicts Islam (Jesus as God/Son of God), while others permit it as a cultural courtesy without affirming the belief. The safest approach is to be kind and respectful without participating in religious affirmations. (5) The general principle: "Allah does not forbid you from being righteous and just toward those who have not fought you over religion" (60:8). Kindness to non-Muslim neighbors, colleagues, and friends is encouraged.',
    sources: [
      'Sahih al-Bukhari, Book of Greeting, Hadith 6258',
      'Sahih Muslim, Book of Greeting, Hadith 2163',
      'Quran, Surah Al-Mumtahanah 60:8',
    ],
  },
  {
    patterns: [
      /is.*backbiting.*haram/i, /backbiting.*islam/i, /ghibah.*islam/i,
      /talking.*behind.*back.*islam/i, /is.*gossip.*haram/i, /gossip.*islam/i,
    ],
    keywords: ['backbiting', 'ghibah', 'talking behind back', 'gossip', 'backbiting haram', 'gossip haram', 'backbiting islam'],
    answer: 'Yes, backbiting (ghibah) is strictly haram in Islam. The Quran describes it in vivid terms: "O you who believe, avoid much suspicion. Indeed, some suspicion is sin. And do not spy or backbite each other. Would one of you like to eat the flesh of his brother when dead? You would detest it" (49:12). The Prophet (PBUH) defined backbiting: "Do you know what backbiting is?" They said: "Allah and His Messenger know best." He said: "Mentioning your brother in a way he would dislike." It was asked: "What if what I say is true?" He said: "If it is true, that is backbiting. And if it is not true, you have slandered him" (Muslim). Exceptions where mentioning someone\'s faults is permitted (not considered backbiting): (1) To an authority or judge to seek justice against oppression. (2) To seek a fatwa from a scholar about a situation involving someone. (3) To warn others of a genuine harm (like a dishonest business partner or a potential spouse with a known problem). (4) To identify someone who is openly sinful and unashamed (some scholars limit this to public sinners). Gossip, spreading rumors, and discussing people\'s private matters is also haram. The remedy: speak good or remain silent. The Prophet (PBUH) said: "Whoever believes in Allah and the Last Day, let him speak good or remain silent" (Bukhari).',
    sources: [
      'Quran, Surah Al-Hujurat 49:12',
      'Sahih Muslim, Book of Piety, Hadith 2589',
      'Sahih al-Bukhari, Book of Manners, Hadith 6018',
    ],
  },
  {
    patterns: [
      /is.*lying.*haram/i, /lying.*islam/i, /is.*lying.*sin/i, /can.*muslim.*lie/i,
      /white.*lie.*islam/i, /taqiyya.*islam/i,
    ],
    keywords: ['lying', 'lying haram', 'lying islam', 'lying sin', 'white lie', 'taqiyya', 'lie islam', 'is lying haram'],
    answer: 'Yes, lying is haram in Islam and is considered a major sin. The Prophet (PBUH) said: "Beware of lying, for lying leads to wickedness, and wickedness leads to Hellfire. A man keeps lying and strives for lies until he is recorded with Allah as a liar" (Bukhari and Muslim). Exceptions (where scholars permit limited lying for a greater good): (1) Reconciliation between people: the Prophet (PBUH) said: "I do not consider it permissible to lie except in three cases: a man speaking to his wife to please her, lying in war, and lying to reconcile between people" (Tirmidhi). This means you may say something that is not strictly true to bring two disputing parties back together. (2) To one\'s spouse to maintain harmony — this means permissible compliments, not deceiving about serious matters. (3) In warfare (to mislead the enemy). (4) Under coercion when one\'s life is at risk (like the story of Ammar ibn Yasir, who uttered words of disbelief under torture and was forgiven — Quran 16:106). This is called taqiyya (dissimulation under threat), and it is not deception for harm but self-preservation. The misconception that Muslims are permitted to lie to non-Muslims generally is false — the exceptions are narrow and for specific situations. "White lies" that harm no one and smooth social relations (like "dinner was delicious") are debated; some scholars permit small courtesies, others say even small lies should be avoided. The safest path is to be truthful always and use tactful silence when needed.',
    sources: [
      'Sahih al-Bukhari, Book of Manners, Hadith 6094',
      'Sahih Muslim, Book of Piety, Hadith 2607',
      'Quran, Surah An-Nahl 16:106',
      'Jami at-Tirmidhi, Hadith 1939',
    ],
  },
  {
    patterns: [
      /is.*nasheed.*haram/i, /nasheed.*islam/i, /is.*nasheed.*permissible/i,
      /is.*acapella.*haram/i, /vocal.*only.*music.*islam/i, /is.*singing.*haram/i,
    ],
    keywords: ['nasheed', 'nasheed haram', 'singing', 'acapella', 'vocal only', 'nasheed islam', 'singing haram', 'nasheed permissible'],
    answer: 'Nasheeds (Islamic vocal songs without instruments) are generally permissible in Islam. Key distinctions: (1) The human voice is not considered a musical instrument, so singing is not automatically haram. (2) Nasheeds that contain good content — praising Allah, the Prophet, encouraging good deeds, describing the beauty of Islam — are permissible and even beneficial. (3) Conditions for permissibility: the content must not contain anything haram (vulgar language, calling to sin, inappropriate descriptions of individuals), and it should not become a distraction from obligations or lead to inappropriate emotional states. (4) The majority of scholars who prohibit musical instruments still permit the daff (frame drum/tambourine without metal cymbals) at weddings, Eid, and celebrations — this is established in the Sunnah. (5) Nasheeds with background instrumentation (even soft instruments) are subject to the same ruling as music with instruments — if you follow the majority view that instruments are haram, then instrument-backed nasheeds would also be haram, while purely vocal nasheeds are fine. (6) The Prophet (PBUH) and companions sang poetry and nasheeds while traveling and during work — like the chant "We are returning from Jihad with the victory from Allah" — so singing and poetry are part of Islamic culture. The concern is the content and the instruments, not the act of singing itself.',
    sources: [
      'Sahih al-Bukhari, Book of Jihad, Hadith 2826',
      'Sahih al-Bukhari, Book of Eids, Hadith 949 (daff at Eid)',
      'Sunan an-Nasa\'i, Book of Eids',
    ],
  },
  {
    patterns: [
      /is.*wudu.*with.*socks/i, /wiping.*socks.*wudu/i, /khuffain.*islam/i,
      /can.*wipe.*over.*socks/i, /leather.*socks.*wudu/i, /khuff.*wudu/i,
    ],
    keywords: ['wudu socks', 'wiping socks', 'khuffain', 'khuff', 'leather socks', 'wipe over socks', 'socks wudu', 'wipe socks'],
    answer: 'Yes, Islam permits wiping over socks (khuffain) instead of washing the feet during wudu, under specific conditions. This is a well-established Sunnah based on many authentic hadiths. The Prophet (PBUH) wiped over his leather socks (khuffain) — Al-Mughira ibn Shu\'ba reported: "I was with the Prophet on a journey, and I poured water for him to make wudu. He wiped over his leather socks" (Bukhari and Muslim). Conditions: (1) You must have worn the socks in a state of wudu (i.e., you put them on after making a complete wudu including washing the feet). (2) The socks must cover the area that is normally washed — from the toes to above the ankle. (3) Duration: You may wipe over the socks for one day and one night (24 hours) if you are resident, and for three days and three nights (72 hours) if you are traveling. (4) The wiping: you wet your hands and pass them over the top of each sock once — not the bottom. (5) What breaks it: removing the socks, or the time period expiring. Once either happens, you must make a full wudu (washing the feet) before wearing them again for wiping. (6) Regarding modern socks (cotton, wool, nylon): scholars differ. Some require thick leather or waterproof socks (like the original khuff). Others permit any socks that do not reveal the skin underneath when wiped. The majority of contemporary scholars permit thick socks that stay up on their own. Thin dress socks that show the skin through them are more debated. Follow the position of a scholar you trust.',
    sources: [
      'Sahih al-Bukhari, Book of Ablution, Hadith 203',
      'Sahih Muslim, Book of Purification, Hadith 276',
      'Sunan Abi Dawud, Hadith 158',
    ],
  },
  {
    patterns: [
      /is.*working.*in.*bank.*haram/i, /working.*haram.*company/i, /is.*my.*job.*haram/i,
      /can.*muslim.*work.*bank/i, /is.*working.*in.*haram.*company.*haram/i,
      /haram.*job.*islam/i, /haram.*income.*islam/i,
    ],
    keywords: ['working in bank', 'haram job', 'haram income', 'work bank', 'job haram', 'haram company', 'haram work', 'bank job'],
    answer: 'Working in a conventional bank (where the core business involves interest/riba) is generally considered haram by the majority of scholars, because you would be directly participating in the prohibition. The Prophet (PBUH) cursed the one who consumes riba, pays it, records it, and witnesses it (Muslim). However, there are nuances: (1) If your role does not involve interest directly (e.g., IT, security, cleaning, maintenance), some scholars are more lenient, especially if you have no other job options and need the income to survive. (2) General principle: a job is haram if the core activity is haram (selling alcohol, gambling, interest, pork, adult content) OR if your specific role directly facilitates haram. (3) If you are currently in such a job: (a) Start seeking halal alternatives actively, (b) Make istighfar and tawbah, (c) If you have no other option to feed your family, continue while seeking alternatives — necessity has exceptions, but you must keep trying to leave. (4) Income from a haram job: scholars say it should not be used if avoidable, but if you have already earned it and have no other means, the majority say you may use it for basic needs while seeking halal work — but you should give extra in charity (sadaqah) and make tawbah. (5) Halal jobs in finance: Islamic banks, halal investment firms, and Shariah-compliant financial institutions are permitted. Consult a scholar for your specific situation — the answer depends on your exact role and circumstances.',
    sources: [
      'Sahih Muslim, Book of Musaqah, Hadith 1598',
      'Quran, Surah Al-Baqarah 2:275-279',
      'Quran, Surah An-Nisa 4:29',
    ],
  },
  {
    patterns: [
      /is.*lowering.*gaze.*obligatory/i, /lower.*gaze.*islam/i, /looking.*haram/i,
      /is.*looking.*at.*opposite.*gender.*haram/i, /gaze.*islam/i,
    ],
    keywords: ['lowering gaze', 'lower gaze', 'looking', 'looking haram', 'gaze', 'lower gaze islam', 'look opposite gender', 'looking at women', 'looking at men'],
    answer: 'Yes, lowering the gaze is an obligation in Islam for both men and women. The Quran commands: "Tell the believing men to lower their gaze and guard their private parts. That is purer for them. Indeed, Allah is acquainted with what they do" (24:30), and immediately after: "And tell the believing women to lower their gaze and guard their private parts" (24:31). Key points: (1) This applies to looking at anything haram — immodest images, inappropriate media, the private parts of others, and the beauty of non-mahram men/women that could stir desire. (2) An accidental glance (the first, unintentional look) is forgiven — the Prophet (PBUH) said to Ali: "O Ali, do not follow the first glance with a second, for the first is excused but the second is not" (Tirmidhi, Abu Dawud). So if you accidentally see something, look away and do not continue. (3) Looking for the purpose of marriage (before deciding to marry) is permitted — the Prophet (PBUH) encouraged a man to look at the woman he intends to marry. (4) Medical necessity: a doctor looking at a patient for treatment is permitted. (5) This is not about treating people as objects — it is about protecting your heart and theirs from desire that could lead to haram. The Quran frames it as purity: "That is purer for them." (6) In the age of social media and screens, this includes scrolling past immodest content, avoiding movies/shows with inappropriate scenes, and not deliberately seeking out images that stir desire. (7) Both genders are equally addressed — it is not only men\'s responsibility.',
    sources: [
      'Quran, Surah An-Nur 24:30-31',
      'Jami at-Tirmidhi, Hadith 2776',
      'Sunan Abi Dawud, Hadith 2149',
    ],
  },
  {
    patterns: [
      /is.*awrah.*men/i, /what.*is.*awrah/i, /awrah.*women/i, /nakedness.*islam/i,
      /what.*must.*cover.*islam/i, /awrah.*definition/i,
    ],
    keywords: ['awrah', 'awrah men', 'awrah women', 'nakedness', 'what must cover', 'awrah definition', 'covering body', 'satr', 'what to cover'],
    answer: 'Awrah refers to the parts of the body that must be covered in Islam and that it is haram to expose or look at. The rulings differ between men and women and by context: (1) Men\'s awrah: from the navel to the knee (the majority view). This must be covered in front of everyone except a spouse. The knee itself is included in the awrah (majority view). The area between the navel and knee includes the private parts and the surrounding area. (2) Women\'s awrah in front of non-mahram men: the entire body except the face and hands (the majority view of all four schools). Some scholars (minority, like some Hanbali and contemporary Saudi scholars) include the face and hands — this is the basis for niqab. (3) Women\'s awrah in front of other women: from the navel to the knee (similar to men), though most scholars say a woman may expose more (hair, arms, neck) in front of other women as is culturally normal among women. (4) Women\'s awrah in front of mahram men (father, brother, son, grandfather, uncle, father-in-law): she may expose what is normally exposed at home — hair, neck, arms, lower legs — but the area between navel and knee must always be covered. (5) In front of her husband: there is no awrah between spouses; they may see each other fully. (6) Children: before puberty, the rules are relaxed. The awrah of a young boy is the private parts, and it gradually becomes the full navel-to-knee as he approaches puberty. These rules exist to preserve dignity and prevent the objectification of the body.',
    sources: [
      'Quran, Surah An-Nur 24:31',
      'Sahih al-Bukhari, Book of Prayer, Hadith 368',
      'Sunan Abi Dawud, Book of Dress, Hadith 4104',
      'Jami at-Tirmidhi, Hadith 2785',
    ],
  },
  {
    patterns: [
      /like.*someone.*marry/i, /like.*a.*guy.*family.*marry/i,
      /like.*a.*girl.*family.*marry/i, /ask.*family.*marry/i,
      /tell.*parents.*marry/i, /love.*someone.*arranged/i,
      /is.*it.*halal.*to.*like.*someone/i, /can.*i.*like.*someone.*islam/i,
      /is.*it.*haram.*to.*like.*someone/i, /crush.*islam/i, /liking.*someone.*islam/i,
      /can.*a.*girl.*propose/i, /can.*woman.*ask.*family.*marry/i,
      /is.*it.*permissible.*to.*like.*a.*guy/i, /is.*it.*permissible.*to.*like.*a.*girl/i,
    ],
    keywords: ['like someone', 'like a guy', 'like a girl', 'ask family', 'ask parents', 'get married', 'arranged marriage', 'crush', 'liking', 'propose', 'tell family', 'tell parents'],
    answer: 'Yes, it is permissible in Islam to like someone and want to marry them — the feeling of attraction is natural and not a sin. What matters is how you act on it. Islam encourages marriage and provides a dignified path: (1) Liking someone in your heart is fine — you cannot control feelings. The Prophet (PBUH) said: "There is nothing like marriage for two who love one another" (Ibn Majah), meaning marriage is the solution for love. (2) You should NOT date them secretly, be alone with them, or have a physical relationship before marriage — that is haram. (3) The correct approach is to tell your family (or a trusted elder/wali) that you are interested in this person for marriage. Your family can then approach the person\'s family formally. This is called ta\'aruf (getting to know each other for marriage). (4) A woman can absolutely express interest in a man for marriage — Khadijah (RA) proposed to the Prophet (PBUH) through her friend. There is no shame in this. (5) Before committing, both families should investigate the person\'s character, deen, and compatibility. You can meet in a supervised/chaperoned setting to see if you are compatible. (6) If it does not work out, no haram has occurred — you simply move on. (7) Make istikhara (the guidance prayer) before deciding. The key principle: liking someone is halal, but acting on it through dating/secret relationships is haram. Channel your feelings through the proper Islamic channels — your family.',
    sources: [
      'Sunan Ibn Majah, Book of Marriage, Hadith 1847',
      'Quran, Surah An-Nur 24:30-31',
      'Sahih al-Bukhari, Book of Marriage (story of Khadijah proposing)',
      'Quran, Surah Al-Baqarah 2:235 (expressing interest in marriage)',
    ],
  },
  {
    patterns: [
      /is.*online.*relationship.*haram/i, /online.*dating.*islam/i,
      /is.*talking.*to.*opposite.*gender.*haram/i, /talking.*to.*a.*girl.*islam/i,
      /talking.*to.*a.*boy.*islam/i, /is.*chatting.*haram/i, /texting.*opposite.*gender/i,
    ],
    keywords: ['online relationship', 'online dating', 'talking to girl', 'talking to boy', 'talking to opposite', 'chatting', 'texting', 'messaging', 'social media', 'dm'],
    answer: 'The ruling on talking to the opposite gender online depends on the intention and content. (1) Casual chatting, flirting, or forming intimate relationships with a non-mahram online is not permitted — the same rules that apply in person apply online. The Prophet (PBUH) said: "A man is not alone with a woman but Satan is the third" (Tirmidhi), and private online conversations create a similar "seclusion" in the digital sense. (2) Necessary communication (work, school, asking a question, buying/selling) is permitted as long as it stays professional and modest. (3) If you are talking to someone for the purpose of marriage (ta\'aruf) with the knowledge of families, this is permitted — but it should not be a secret relationship. (4) The dangers of online relationships: they often start innocently but can escalate to emotional attachment, inappropriate conversations, or worse. The Prophet (PBUH) said: "The eyes commit zina (fornication), and their zina is the gaze; the ears commit zina, and their zina is listening" (Bukhari). (5) If you are in such a relationship, the best step is to either make it halal (involve families and pursue marriage) or end it and make tawbah. Allah is Most Merciful and accepts repentance.',
    sources: [
      'Quran, Surah An-Nur 24:30-31',
      'Jami at-Tirmidhi, Hadith 1174',
      'Sahih al-Bukhari, Book of Dress, Hadith 5887',
    ],
  },
  {
    patterns: [
      /is.*istikhara.*prayer/i, /how.*do.*istikhara/i, /salat.*istikhara/i,
      /istikhara.*decision/i, /how.*pray.*istikhara/i, /guidance.*prayer.*islam/i,
    ],
    keywords: ['istikhara', 'guidance prayer', 'decision prayer', 'seeking guidance'],
    answer: 'Salat al-Istikhara is the Prayer of Seeking Guidance — a special prayer the Prophet (PBUH) taught for making decisions. The Prophet (PBUH) said: "If any of you is concerned about a decision, let him pray two rakats of voluntary prayer, then say: \'O Allah, I seek Your guidance by Your knowledge, and I seek ability by Your power, and I ask You of Your great bounty...\'" (Bukhari). How to perform it: (1) Pray two rakats of voluntary prayer (nafl) at any time prayers are permitted (not during the prohibited times — sunrise, sunset, zenith). (2) After the prayer, recite the istikhara du\'a: "Allahumma inni astakhiruka bi\'ilmika, wa astaqdiruka bi-qudratika, wa as\'aluka min fadlika al-\'azim. Fa innaka taqdiru wa la aqdir, wa ta\'lamu wa la a\'lam, wa anta \'allam al-ghuyub. Allahumma in kunta ta\'lamu anna hadhal-amra (mention your decision) khayrun li fi dini wa ma\'ashi wa \'aqibati amri (or: \'ajili amri wa ajilihi) fa-qdurhu li wa yassirhu li thumma barik li fihi. Wa in kunta ta\'lamu anna sharrun li fi dini wa ma\'ashi wa \'aqibati amri (or: fi \'ajili amri wa ajilihi) fasrifhu \'anni wasrifni \'anhu, wa-qdur li al-khayra haythu kana thumma ardini bihi." (3) The outcome: Istikhara does not necessarily give you a dream or a sign. After performing it, you proceed with what feels right and what your heart leans toward — Allah will either make it easy (a sign it is good) or place obstacles (a sign to avoid). You can repeat it multiple times. (4) Combine istikhara with practical consultation (istishara) — ask knowledgeable people, consider pros and cons, and then pray istikhara.',
    sources: [
      'Sahih al-Bukhari, Book of Prayer, Hadith 1166',
      'Jami at-Tirmidhi, Book of Prayer, Hadith 436',
    ],
  },
  {
    patterns: [
      /is.*circumcision.*obligatory/i, /khitan.*islam/i, /is.*khitan.*fard/i,
      /circumcision.*muslim/i, /male.*circumcision.*islam/i,
      /is.*female.*circumcision.*haram/i, /fgm.*islam/i,
    ],
    keywords: ['circumcision', 'khitan', 'female circumcision', 'fgm', 'male circumcision', 'circumcision obligatory'],
    answer: 'Male circumcision (khitan) is considered obligatory (wajib) or strongly recommended (sunnah mu\'akkadah) by the majority of scholars, based on the practice of Prophet Ibrahim (AS) and the Sunnah of the Prophet Muhammad (PBUH). It is one of the acts of fitrah (natural disposition) — the Prophet (PBUH) mentioned five acts of fitrah, including circumcision (Bukhari and Muslim). It is required for male converts and boys. Regarding female circumcision (FGM): This is a critical distinction. What is sometimes called "female circumcision" in some cultures is actually female genital mutilation (FGM), which is strictly prohibited in Islam. The Prophet (PBUH) taught: "Cut but do not exaggerate" — meaning if any practice was permitted, it was only a very minor symbolic procedure, NOT the removal of healthy tissue. The majority of contemporary scholars, including Al-Azhar and major fatwa councils, prohibit FGM entirely and consider it harmful and contrary to Islam. FGM causes serious physical and psychological harm, has no medical benefit, and violates the Islamic principle of not harming the body. It is a cultural practice in some regions, NOT an Islamic requirement. If you or someone you know has been affected, please seek medical and psychological help.',
    sources: [
      'Sahih al-Bukhari, Book of Funerals, Hadith 6329 (acts of fitrah)',
      'Sahih Muslim, Book of Purification, Hadith 257',
      'Contemporary fatwas from Al-Azhar and the International Union of Muslim Scholars (prohibiting FGM)',
    ],
  },
  {
    patterns: [
      /is.*astrology.*haram/i, /horoscope.*islam/i, /zodiac.*islam/i,
      /is.*reading.*horoscope.*haram/i, /astrology.*forbidden/i, /is.*zodiac.*haram/i,
      /star.*sign.*islam/i, /is.*fortune.*telling.*haram/i, /palm.*reading.*islam/i,
    ],
    keywords: ['astrology', 'horoscope', 'zodiac', 'star sign', 'fortune telling', 'palm reading', 'star signs', 'astrology haram', 'horoscope haram'],
    answer: 'Yes, astrology, horoscopes, fortune telling, and palm reading are all haram in Islam. (1) The Prophet (PBUH) said: "Whoever goes to a fortune-teller and believes what he says has disbelieved in what was revealed to Muhammad" (Abu Dawud, Ahmad). (2) The Prophet (PBUH) also said: "The prayer of whoever approaches a soothsayer or fortune-teller will not be accepted for forty days" (Muslim). (3) The concern is that believing stars or fortune-tellers can predict the future attributes knowledge of the unseen (ghayb) to something other than Allah — and only Allah knows the unseen. The Quran says: "With Him are the keys of the unseen; none knows them but He" (6:59). (4) Reading horoscopes "for fun" is still discouraged because it normalizes a practice that undermines tawheed (the oneness of Allah) and reliance on Him. (5) Astronomy (the scientific study of stars, planets, and the universe) is completely different from astrology and is permitted — Islamic civilization made great contributions to astronomy. The prohibition is on believing stars influence human fate or can predict the future. If you have read horoscopes in the past, simply make tawbah (repentance) and stop — Allah forgives all sins.',
    sources: [
      'Sunan Abi Dawud, Hadith 3904',
      'Sahih Muslim, Book of Prayer, Hadith 2230',
      'Quran, Surah Al-An\'am 6:59',
      'Sahih al-Bukhari, Book of Medicine, Hadith 5779',
    ],
  },
  {
    patterns: [
      /is.*jumuah.*obligatory/i, /is.*friday.*prayer.*obligatory/i,
      /can.*women.*attend.*jumuah/i, /jumuah.*women/i, /friday.*prayer.*women/i,
      /is.*juma.*prayer.*fard/i, /who.*must.*attend.*jumuah/i,
    ],
    keywords: ['jumuah', 'juma', 'friday prayer', 'jumuah obligatory', 'jumuah women', 'friday prayer obligatory', 'attend jumuah'],
    answer: 'Jumuah (Friday congregational prayer) is obligatory for Muslim men, replacing the regular Dhuhr prayer on Fridays. The Quran says: "O you who believe, when the call is made for prayer on Friday, hasten to the remembrance of Allah and leave off trade" (62:9). The Prophet (PBUH) said: "People should stop neglecting Friday prayers, or Allah will seal their hearts" (Muslim). (1) It is obligatory (fard) for free, adult, sane, resident men. (2) Women are NOT required to attend Jumuah — they may pray Dhuhr at home. However, if a woman wants to attend the Jumuah prayer, she is welcome and her prayer counts (she does not need to pray Dhuhr separately). Historically, women attended the Jumuah prayer during the Prophet\'s time. (3) Exemptions from Jumuah: the sick, travelers, those in extreme weather/fear, and women. (4) The Jumuah prayer consists of a khutbah (sermon) followed by two rakats led by the imam. (5) It is recommended to bathe (ghusl), wear clean clothes, apply perfume (for men), and arrive early. (6) Missing Jumuah without a valid excuse three times in a row is considered a serious matter — the Prophet (PBUH) said Allah seals the heart of such a person. (7) Friday is a special day in Islam — the Prophet (PBUH) said it is the best day the sun rises on.',
    sources: [
      'Quran, Surah Al-Jumu\'ah 62:9',
      'Sahih Muslim, Book of Friday, Hadith 864',
      'Sahih al-Bukhari, Book of Friday, Hadith 893',
      'Sunan Abi Dawud, Book of Prayer, Hadith 1052',
    ],
  },
  {
    patterns: [
      /what.*is.*janazah/i, /funeral.*prayer.*islam/i, /how.*pray.*janazah/i,
      /is.*janazah.*fard/i, /janazah.*obligatory/i, /funeral.*in.*islam/i,
      /burial.*islam/i, /is.*cremation.*haram/i, /cremation.*islam/i,
    ],
    keywords: ['janazah', 'funeral', 'funeral prayer', 'janazah obligatory', 'burial', 'cremation', 'burial islam', 'funeral islam'],
    answer: 'Janazah (funeral) prayer is a communal obligation (fard kifayah) — if some Muslims perform it, the obligation is lifted from the community, but if no one performs it, the whole community is sinful. Key points: (1) The janazah prayer is a du\'a (supplication) for the deceased — it has no ruku or sujud, only standing and four takbirs. (2) It is highly meritorious — the Prophet (PBUH) said: "Whoever attends the funeral until the prayer has offered one qirat, and whoever attends until the burial has offered two qirats" — explained as two huge mountains of reward (Bukhari and Muslim). (3) Burial: Islam requires burial of the deceased body (dafan), not cremation. The body is washed (ghusl), shrouded in white cloth (kafan), prayed over, and buried. (4) Cremation is prohibited in Islam — the body is a trust from Allah and must be treated with dignity. Burning the body is considered a severe violation. The only exception is in cases of mass death where burial is impossible (like war or plague) — even then, burial is preferred. (5) The burial should be done as soon as possible, ideally within 24 hours. (6) Visiting graves is permitted and encouraged for men (and permitted for women by many scholars, though some discourage it for women due to emotional distress). (7) The deceased benefits from the du\'a and good deeds done on their behalf by the living — giving charity, performing Hajj, or paying debts on their behalf.',
    sources: [
      'Sahih al-Bukhari, Book of Funerals, Hadith 1325',
      'Sahih Muslim, Book of Funerals, Hadith 2198',
      'Quran, Surah Al-Hajj 22:58-59 (honoring the deceased)',
    ],
  },
  {
    patterns: [
      /is.*shirk.*unforgivable/i, /what.*is.*shirk/i, /shirk.*islam/i,
      /is.*shirk.*sin/i, /types.*of.*shirk/i, /major.*shirk/i, /minor.*shirk/i,
    ],
    keywords: ['shirk', 'shirk unforgivable', 'shirk islam', 'what is shirk', 'types of shirk', 'major shirk', 'minor shirk', 'polytheism'],
    answer: 'Shirk is the sin of associating partners with Allah or attributing divine qualities to anything other than Allah. It is the greatest sin in Islam and the only sin Allah does not forgive if a person dies without repenting. The Quran says: "Indeed, Allah does not forgive associating partners with Him, but He forgives what is less than that for whom He wills" (4:48). Types of shirk: (1) Major shirk (shirk al-akbar) — worshipping anyone or anything other than Allah (idols, saints, prophets, nature, oneself). This takes a person out of Islam if done knowingly. Examples: praying to a saint, believing another being has divine powers, seeking help from the dead. (2) Minor shirk (shirk al-asghar) — actions that are a form of shirk in intention but do not take one out of Islam. The Prophet (PBUH) mentioned ar-riya\' (showing off in worship) as minor shirk: "The thing I fear most for you is minor shirk — showing off" (Ahmad). (3) Shirk in Lordship (rububiyyah) — believing someone else shares in Allah\'s power to create, sustain, or control the universe. (4) Shirk in worship (uluhiyyah) — directing any act of worship (prayer, sacrifice, vows, supplication) to other than Allah. (5) Shirk in names and attributes — attributing Allah\'s names or attributes to creation. The good news: shirk is forgiven if a person repents before death. Repentance (tawbah) from shirk is always open — Allah is Ar-Rahman, the Most Merciful. If you have committed shirk unknowingly, make tawbah, renew your shahada, and Allah forgives.',
    sources: [
      'Quran, Surah An-Nisa 4:48',
      'Quran, Surah An-Nisa 4:116',
      'Sahih al-Bukhari, Book of Oneness of Allah, Hadith 4497',
      'Musnad Ahmad, Hadith 23119',
    ],
  },
  {
    patterns: [
      /is.*kufr.*unforgivable/i, /what.*is.*kufr/i, /kufr.*islam/i,
      /types.*of.*kufr/i, /is.*kufr.*sin/i, /disbelief.*islam/i,
    ],
    keywords: ['kufr', 'kufr islam', 'what is kufr', 'types of kufr', 'disbelief', 'kufr sin', 'kufr unforgivable'],
    answer: 'Kufr means "disbelief" or "ingratitude" — the rejection of Allah, His Messenger, or the truth of Islam. It is the opposite of iman (faith). Types of kufr: (1) Kufr al-akbar (major disbelief) — rejecting Allah, the Prophet, the Quran, or any essential part of Islamic faith. This takes a person out of Islam. Examples: denying the existence of Allah, rejecting the prophethood of Muhammad (PBUH), mocking the religion, or knowingly rejecting a known truth of Islam. (2) Kufr al-asghar (minor disbelief/ingratitude) — being ungrateful for Allah\'s blessings, which is disliked but does not take one out of Islam. The word "kufr" literally means "to cover/conceal," and being ungrateful "covers" the blessing. (3) Kufr by action — some actions are described as "kufr" in hadith (like denying a blessing) but are minor and do not expel from Islam, depending on interpretation. Important: A Muslim who commits a sin (even a major sin like drinking alcohol) is NOT a kafir unless they declare the sin to be halal or reject a fundamental of faith. The Kharijite error was declaring sinning Muslims as disbelievers — the mainstream (Ahl al-Sunnah) holds that a sinful Muslim is still a Muslim and may be punished for the sin but is not excommunicated. Repentance from kufr is always accepted — Allah says: "Say to those who disbelieve, if they cease, their past will be forgiven" (8:38). If a person leaves Islam and then sincerely repents and returns, Allah forgives them completely.',
    sources: [
      'Quran, Surah Al-Anfal 8:38',
      'Quran, Surah Al-Baqarah 2:28',
      'Sahih al-Bukhari, Book of Faith, Hadith 25',
      'Sahih Muslim, Book of Faith',
    ],
  },
  {
    patterns: [
      /is.*bidah.*haram/i, /what.*is.*bidah/i, /bidah.*islam/i,
      /is.*innovation.*haram/i, /good.*bidah/i, /types.*of.*bidah/i,
    ],
    keywords: ['bidah', 'bidah haram', 'what is bidah', 'innovation', 'bidah islam', 'good bidah', 'types of bidah', 'religious innovation'],
    answer: 'Bid\'ah (religious innovation) means introducing a new practice into the religion that was not done by the Prophet (PBUH) or his companions, with the intention of seeking reward from Allah. The Prophet (PBUH) said: "The worst of matters are newly invented matters, and every innovation is misguidance" (Muslim). (1) The majority of scholars hold that bid\'ah in matters of worship (ibadah) is haram — you cannot invent new acts of worship, new prayers, new celebrations, or new rituals, because the religion is complete: "This day I have perfected for you your religion" (Quran 5:3). (2) Types of bid\'ah: (a) Bid\'ah in beliefs — introducing false doctrines (like claiming a new prophet after Muhammad). (b) Bid\'ah in worship — inventing new rituals or modifying existing ones (like adding a new salah, celebrating the Prophet\'s birthday as a religious obligation, or specifying acts of worship not prescribed). (c) Bid\'ah in worldly matters — this is NOT haram. Innovation in technology, medicine, organization, daily life is permissible and encouraged. (3) The distinction: matters of dunya (world) are permissible by default; matters of deen (religion/worship) require evidence from the Quran and Sunnah. (4) Some scholars (like Imam Ash-Shafi\'i) categorized bid\'ah into "good" and "bad" — good bid\'ah being things that align with Islamic principles but were not practiced at the Prophet\'s time (like compiling the Quran into a book, building schools). However, the majority of contemporary scholars (especially in the Salafi tradition) reject this categorization and hold all religious innovation is misguidance. (5) Examples that are debated: Mawlid (celebrating the Prophet\'s birthday) — many scholars consider it bid\'ah, while others permit it as a good innovation. Follow a scholar you trust.',
    sources: [
      'Sahih Muslim, Book of Prayer, Hadith 867',
      'Quran, Surah Al-Ma\'idah 5:3',
      'Sahih al-Bukhari, Book of Oneness of Allah, Hadith 2697',
    ],
  },
  {
    patterns: [
      /is.*eating.*with.*left.*hand.*haram/i, /left.*hand.*islam/i,
      /eating.*left.*hand.*islam/i, /is.*using.*left.*hand.*haram/i,
      /can.*left.*handed.*muslim/i, /left.*handed.*islam/i,
    ],
    keywords: ['left hand', 'eating left hand', 'using left hand', 'left handed', 'eating with left', 'left hand islam'],
    answer: 'Using the left hand for eating and drinking is discouraged (makruh) in Islam, but being left-handed is not a sin. The Prophet (PBUH) said: "When one of you eats, let him eat with his right hand, and when he drinks, let him drink with his right hand, for Satan eats with his left hand and drinks with his left hand" (Muslim). (1) The Sunnah is to eat, drink, give, receive, and shake hands with the right hand. (2) For left-handed people: scholars differentiate between natural inability and unwillingness. If a person genuinely cannot use their right hand (due to injury, disability, or being strongly left-dominant), they are excused — the Prophet (PBUH) said: "I cannot do it" and the Prophet said: "You will not be able to do that" (Muslim, regarding a man eating with his left hand who claimed he could not use his right). The Prophet then said: "There is no other way but to strive to do it" — meaning try your best. (3) For hygiene and other actions (like istinja/cleaning after using the bathroom): the right hand is for clean actions (eating, greeting) and the left hand for cleaning. (4) If you are left-handed and struggle to eat with your right hand, try to train yourself gradually, but if it is genuinely impossible, you are excused. The key is the intention to follow the Sunnah. (5) Writing and other tasks can be done with the left hand — the Sunnah specifically addresses eating, drinking, and giving/receiving.',
    sources: [
      'Sahih Muslim, Book of Drinks, Hadith 2022',
      'Sahih al-Bukhari, Book of Ablution, Hadith 3817',
      'Sunan Abi Dawud, Book of Food, Hadith 3775',
    ],
  },
  {
    patterns: [
      /is.*swearing.*haram/i, /swearing.*islam/i, /is.*cursing.*haram/i,
      /is.*bad.*words.*haram/i, /profanity.*islam/i, /is.*swearing.*sin/i,
    ],
    keywords: ['swearing', 'cursing', 'bad words', 'profanity', 'swearing haram', 'cursing haram', 'swear words'],
    answer: 'Yes, using foul language, swearing, and cursing are haram in Islam. The Prophet (PBUH) said: "The believer is not a slanderer, one who curses frequently, nor one who uses foul language" (Tirmidhi). Key points: (1) The Quran commands: "And tell My servants to say that which is best. Indeed, Satan induces dissension among them" (17:53). (2) The Prophet (PBUH) said: "A Muslim is the one from whose tongue and hand other Muslims are safe" (Bukhari). (3) Cursing a specific Muslim is haram — the Prophet (PBUH) said: "Cursing a Muslim is wickedness and fighting him is disbelief" (Bukhari and Muslim). (4) Cursing in general (saying swear words in anger or habit) is also prohibited — the Prophet (PBUH) said: "Allah does not like obscene words or deeds" (Bukhari). (5) Using foul language online, in texts, or in person is all the same. (6) The exception: cursing specific wrongdoers (like oppressors) is debated — some scholars permit it as a supplication against them, while others say it is better to make du\'a for their guidance. The Prophet (PBUH) did curse specific wrongdoers in some hadiths, but he also forgave those who wronged him. (7) If you have a habit of swearing, work on replacing it with dhikr (remembrance of Allah) and conscious speech. Repentance is always open.',
    sources: [
      'Jami at-Tirmidhi, Book of Manners, Hadith 1978',
      'Sahih al-Bukhari, Book of Manners, Hadith 6018',
      'Quran, Surah Al-Isra 17:53',
    ],
  },
  {
    patterns: [
      /is.*music.*haram.*instruments/i, /is.*guitar.*haram/i, /is.*piano.*haram/i,
      /is.*drums.*haram/i, /is.*daff.*permissible/i, /is.*flute.*haram/i,
      /is.*violin.*haram/i, /musical.*instruments.*islam/i,
    ],
    keywords: ['guitar', 'piano', 'drums', 'daff', 'flute', 'violin', 'musical instruments', 'instrument haram', 'guitar haram', 'piano haram', 'drums haram', 'daff permissible'],
    answer: 'This builds on the general music ruling. The majority of classical scholars hold that musical instruments (other than the daff) are haram, based on the hadith in Sahih al-Bukhari where the Prophet (PBUH) mentioned that among his Ummah there would be those who make lawful "silk, alcohol, and musical instruments (ma\'azif)." (1) The daff (frame drum, similar to a tambourine without metal cymbals) is explicitly permitted at weddings, Eid, and celebrations — this is established in many authentic hadiths. (2) Other instruments (guitar, piano, violin, flute, etc.): the majority view is that they are haram. (3) However, there is a minority scholarly opinion — held by Ibn Hazm and some others — that all instruments are permissible if the content is good. (4) Some contemporary scholars (like Shaykh al-Ghazali in some writings) permitted instruments in certain contexts, especially for da\'wah or cultural purposes. (5) The human voice (singing) is not considered an instrument and is generally permissible if the content is good. (6) If you follow a scholar who permits instruments, that is a valid scholarly difference — follow the position you trust. If you are unsure, the safest path is to avoid instruments and focus on vocal nasheeds and the daff.',
    sources: [
      'Sahih al-Bukhari, Book of Drinks, Hadith 5590',
      'Sunan Abi Dawud, Hadith 3690',
      'Ibn Majah, Hadith 2855',
      'Sahih al-Bukhari, Book of Eids, Hadith 949 (daff permitted)',
    ],
  },
  {
    patterns: [
      /is.*interest.*from.*bank.*halal/i, /can.*i.*use.*bank.*interest/i,
      /what.*to.*do.*with.*bank.*interest/i, /is.*savings.*account.*haram/i,
      /bank.*account.*islam/i, /is.*interest.*money.*haram/i,
    ],
    keywords: ['bank interest', 'interest money', 'savings account', 'use bank interest', 'what to do with interest', 'interest from bank', 'bank account islam'],
    answer: 'This is a common practical question. If your bank account accrues interest, here is the guidance: (1) You should not keep your money in an interest-bearing account by choice — if halal banking or non-interest accounts are available, use them. (2) If you are stuck with interest accrual (e.g., a conventional bank account that automatically pays interest): The majority of scholars say you should NOT keep or use the interest money for yourself. Instead, give it away as charity (sadaqah) without the intention of reward — it is considered disposing of haram money, not a charitable act you get rewarded for. The recipient can be the poor, and you do not need to tell them it is interest money. (3) Some scholars permit using the interest money to pay taxes, fees, or public services (since it returns to the public good). (4) Opening an interest-bearing savings account with the intention of earning interest is haram. (5) Islamic banks offer Shariah-compliant savings (mudaraba) accounts that share profit from halal investments — these are permitted. (6) If you have accumulated interest money over years, give it all away to charity (without expecting reward) and switch to a non-interest or Islamic account. (7) The principle: wealth gained through haram means should not be consumed; it should be disposed of to purify your income. Consult a scholar for complex cases.',
    sources: [
      'Quran, Surah Al-Baqarah 2:275-279',
      'Sahih Muslim, Book of Musaqah, Hadith 1598',
      'Contemporary fatwas (IslamQA, Al-Azhar) on disposing of interest',
    ],
  },
  {
    patterns: [
      /is.*love.*marriage.*haram/i, /love.*marriage.*islam/i,
      /is.*love.*marriage.*allowed/i, /can.*muslim.*love.*marriage/i,
      /arranged.*vs.*love.*marriage/i, /is.*love.*before.*marriage.*haram/i,
    ],
    keywords: ['love marriage', 'love before marriage', 'arranged marriage', 'love marriage haram', 'love marriage allowed', 'love marriage islam'],
    answer: 'Love marriage is NOT haram in Islam — what matters is how the love develops and is acted upon. (1) Liking someone and wanting to marry them is natural and permissible. The Prophet (PBUH) said: "There is nothing like marriage for two who love one another" (Ibn Majah) — meaning marriage is the halal solution for love, not a prohibition of it. (2) What is haram is the path many people take: secret dating, physical intimacy, being alone together, and emotional relationships outside of marriage. (3) The correct Islamic approach: if you love someone, tell your family (wali) so they can approach the other person\'s family formally for marriage (ta\'aruf). You can meet with the person in a supervised setting to see if you are compatible. (4) "Arranged marriage" in Islam does NOT mean forced marriage — forced marriage is strictly haram. The Prophet (PBUH) annulled the marriage of a woman who was married against her will (Bukhari). An arranged marriage means families facilitate the introduction, but both parties must freely consent. (5) "Love marriage" where two people independently fall in love and then involve their families for a proper nikah is completely halal — provided no haram occurred before the nikah. (6) The best marriages combine both: family involvement AND mutual love/consent. Pure arranged marriages without the couple\'s input, or pure love marriages without family involvement, both have risks. (7) Make istikhara before deciding. The key: love itself is halal, but the relationship before marriage must follow Islamic guidelines.',
    sources: [
      'Sunan Ibn Majah, Book of Marriage, Hadith 1847',
      'Sahih al-Bukhari, Book of Marriage, Hadith 5136 (forced marriage annulled)',
      'Quran, Surah An-Nur 24:32',
    ],
  },
  {
    patterns: [
      /is.*forced.*marriage.*haram/i, /forced.*marriage.*islam/i,
      /can.*parents.*force.*marriage/i, /is.*arranged.*marriage.*forced/i,
      /forced.*to.*marry/i,
    ],
    keywords: ['forced marriage', 'force marriage', 'forced to marry', 'parents force marriage', 'arranged marriage forced', 'forced marriage haram'],
    answer: 'Yes, forced marriage is strictly haram in Islam. Consent is a fundamental requirement for a valid Islamic marriage (nikah). (1) The Prophet (PBUH) explicitly annulled the marriage of a woman named Khansa bint Khidam, who was married off by her father against her will (Bukhari). (2) The Prophet (PBUH) said: "A previously married woman has more right to her person than her guardian, and a virgin\'s consent should be asked" (Muslim). (3) For a marriage to be valid, both the bride and groom must consent. A marriage conducted without the bride\'s consent is invalid in Islamic law. (4) Cultural pressure or emotional manipulation ("you must marry this person or you are disobedient") that effectively removes free consent is also contrary to Islam. (5) The difference between arranged and forced marriage: An arranged marriage is where families introduce the couple, but the couple freely consents (and can refuse). A forced marriage is where one or both parties are compelled against their will — this is haram and the marriage is invalid. (6) If you are being pressured into a marriage you do not want: (a) Communicate clearly with your family that you do not consent. (b) Seek help from a trusted imam, community leader, or counseling service. (c) In many countries, forced marriage is a crime. (d) You have the Islamic right to refuse — no one can make you marry against your will. (7) The misconception that Islam permits forced marriage is cultural, not religious. Do not let anyone tell you that obeying your parents means accepting a marriage you do not want — obedience to parents does not extend to choosing your spouse.',
    sources: [
      'Sahih al-Bukhari, Book of Marriage, Hadith 5136',
      'Sahih Muslim, Book of Marriage, Hadith 1421',
      'Sunan Ibn Majah, Book of Marriage, Hadith 1874',
    ],
  },
  {
    patterns: [
      /is.*interfaith.*marriage.*allowed/i, /can.*muslim.*woman.*marry.*non.*muslim/i,
      /can.*muslim.*man.*marry.*non.*muslim/i, /interfaith.*marriage.*islam/i,
      /marry.*christian.*islam/i, /marry.*jew.*islam/i, /marry.*hindu.*islam/i,
      /can.*muslim.*marry.*non.*muslim/i,
    ],
    keywords: ['interfaith marriage', 'marry non muslim', 'marry non-muslim', 'marry christian', 'marry jew', 'marry hindu', 'interfaith', 'muslim woman marry non muslim', 'muslim man marry non muslim'],
    answer: 'Interfaith marriage rulings differ between men and women: (1) Muslim men are permitted to marry women from the People of the Book (Jews and Christians), based on the Quran: "And lawful in marriage are chaste women from among the believers and chaste women from among those who were given the Scripture before you" (5:5). However, the majority of contemporary scholars discourage this, especially in Western countries, because of the risk to the children\'s Islamic upbringing and the difficulty in maintaining an Islamic household. (2) Muslim women are NOT permitted to marry non-Muslim men, according to the consensus of scholars. The Quran states: "And do not marry polytheistic women until they believe" (2:221), and the reverse (Muslim women marrying non-Muslim men) is understood to be prohibited by consensus because a Muslim woman\'s Islamic rights (mahr, religious freedom, children\'s faith) may not be respected by a non-Muslim husband, and the husband is the head of the household. (3) If a non-Muslim man converts to Islam, he may then marry a Muslim woman. (4) Marrying a Hindu, Buddhist, atheist, or polytheist is not permitted for either Muslim men or women (only People of the Book — Jews and Christians — are the exception for men). (5) If a spouse converts to Islam and the other does not: the ruling depends on the situation and school of thought — consult a scholar. (6) Cultural interfaith marriages often face practical challenges around children\'s religion, holidays, family relations, and Islamic obligations. Consult a scholar before pursuing an interfaith marriage.',
    sources: [
      'Quran, Surah Al-Ma\'idah 5:5',
      'Quran, Surah Al-Baqarah 2:221',
      'Quran, Surah Al-Mumtahanah 60:10',
    ],
  },
  {
    patterns: [
      /is.*c-section.*haram/i, /is.*epidural.*haram/i, /pain.*relief.*childbirth.*islam/i,
      /is.*medical.*treatment.*haram/i, /is.*ivf.*halal/i, /is.*surrogacy.*haram/i,
    ],
    keywords: ['c section', 'cesarean', 'epidural', 'pain relief', 'childbirth', 'ivf', 'surrogacy', 'medical treatment', 'c-section'],
    answer: 'Medical treatments including c-sections, epidurals, and pain relief during childbirth are all permissible in Islam. (1) The Prophet (PBUH) said: "Allah has not sent down a disease except that He has also sent down its cure" (Bukhari), and: "Seek treatment, O servants of Allah, for Allah has not created a disease without creating a cure for it" (Tirmidhi). (2) C-section (cesarean): Completely permissible. There is no Islamic requirement to give birth naturally — the safety of mother and child is the priority. (3) Epidural and pain relief: Permissible. Islam does not require women to suffer through labor without pain relief — using medicine to ease pain is a mercy. (4) IVF (In vitro fertilization): Permitted by the majority of scholars IF the egg and sperm are from the married couple themselves, and the fertilized egg is implanted in the wife\'s womb. Using donor sperm, donor eggs, or a surrogate is haram because it introduces a third party into the marriage and confuses lineage. (5) Surrogacy: The majority of scholars prohibit commercial surrogacy because it involves a third party carrying the child, which raises issues of lineage, mahram relationships, and the definition of motherhood in Islam (the Quran says: "Their mothers are those who gave birth to them" — 58:2). (6) All forms of necessary medical treatment — surgery, medication, therapy — are permitted and encouraged. The only exception is treatments that are themselves haram (like using alcohol-based medicine when alternatives exist, or treatments involving haram substances without necessity).',
    sources: [
      'Sahih al-Bukhari, Book of Medicine, Hadith 5678',
      'Jami at-Tirmidhi, Book of Medicine, Hadith 2038',
      'Quran, Surah Al-Mujadila 58:2 (surrogacy/lineage)',
      'Contemporary fatwas from Islamic Fiqh Councils on IVF',
    ],
  },
  {
    patterns: [
      /is.*organ.*donation.*haram/i, /organ.*donation.*islam/i,
      /can.*muslim.*donate.*organs/i, /is.*blood.*donation.*halal/i,
      /blood.*donation.*islam/i,
    ],
    keywords: ['organ donation', 'donate organs', 'blood donation', 'donate blood', 'organ donation haram', 'organ donation islam'],
    answer: 'Organ and blood donation are permitted by the majority of contemporary scholars, with some conditions. (1) Blood donation: Permitted and even encouraged — it saves lives, and the Quran says: "Whoever saves one life, it is as if he saved mankind entirely" (5:32). Some scholars historically classified blood as impure, but the necessity of saving life overrides this. (2) Organ donation while alive: Permitted if (a) it does not cause severe harm to the donor (e.g., donating one kidney is generally permitted; donating a vital organ like the heart while alive is not), (b) the donor consents freely, and (c) the recipient benefits. (3) Organ donation after death: The majority of contemporary scholars and major fatwa councils (including the Islamic Fiqh Academy) permit it, based on the principle of saving lives and the Quranic verse above. The body is a trust from Allah, but saving another life is a higher priority. (4) Conditions: (a) The deceased must have consented during life (or their family consents), (b) the organs go to those in medical need, (c) it is not done for commercial profit (selling organs is haram). (5) Some scholars (a minority) hold that organ donation is not permitted because the body must be buried intact, citing the hadith about breaking a bone of a dead person being like breaking it while alive. The majority view permits it for the greater good of saving lives. (6) Registering as an organ donor is permissible — follow the position of a scholar you trust.',
    sources: [
      'Quran, Surah Al-Ma\'idah 5:32 (saving a life)',
      'Resolutions of the Islamic Fiqh Academy (Majma\' al-Fiqh al-Islami)',
      'Sunan Abi Dawud, Book of Funerals, Hadith 3208',
    ],
  },
  {
    patterns: [
      /is.*suicide.*bombing.*islam/i, /is.*terrorism.*islam/i, /does.*islam.*support.*terrorism/i,
      /is.*killing.*innocents.*haram/i, /is.*violence.*in.*islam/i,
      /does.*quran.*say.*kill.*infidels/i,
    ],
    keywords: ['suicide bombing', 'terrorism', 'killing innocents', 'violence in islam', 'does islam support terrorism', 'kill infidels', 'innocent killing'],
    answer: 'Terrorism, suicide bombing, and killing innocent civilians are strictly prohibited in Islam. (1) The Quran says: "Whoever kills a soul unless for a soul or for corruption done in the land — it is as if he had slain mankind entirely. And whoever saves one — it is as if he had saved mankind entirely" (5:32). (2) The Prophet (PBUH) explicitly forbade killing women, children, the elderly, monks, and non-combatants even in war (Bukhari and Muslim). (3) Suicide bombing combines two haram acts: suicide (which is a major sin — the Prophet said: "Whoever kills himself with anything will be punished with it in Hellfire") and killing innocents. (4) The verse often misquoted ("kill them wherever you find them" — 2:191) refers to a specific historical context of self-defense during a battle, not a general command. The very next verse says: "But if they cease, then indeed Allah is Forgiving and Merciful" (2:192). (5) The "verse of the sword" (9:5) is also taken out of context — it refers to a specific treaty violation, and the Quran immediately says: "If they repent, establish prayer, and give zakah, then they are your brothers in religion" (9:11). (6) Extremist groups like ISIS, Al-Qaeda, and others are condemned by the vast majority of Muslim scholars worldwide. Hundreds of scholars signed the Amman Message (2004) and other declarations rejecting extremist ideology. (7) The Quran says: "There is no compulsion in religion" (2:256) and "Do not transgress. Indeed, Allah does not like transgressors" (2:190). (8) If you encounter extremist ideology, know that it contradicts mainstream Islamic scholarship. Speak to a qualified, mainstream scholar.',
    sources: [
      'Quran, Surah Al-Ma\'idah 5:32',
      'Quran, Surah Al-Baqarah 2:190-192',
      'Sahih al-Bukhari, Book of Jihad, Hadith 3015',
      'Sahih Muslim, Book of Jihad, Hadith 1744',
      'The Amman Message (2004) — signed by 500+ scholars',
    ],
  },
  {
    patterns: [
      /is.*women.*driving.*haram/i, /can.*women.*work.*islam/i,
      /can.*women.*have.*job/i, /is.*women.*working.*haram/i,
      /can.*muslim.*women.*work/i, /is.*women.*education.*haram/i,
      /can.*women.*study.*islam/i,
    ],
    keywords: ['women working', 'women work', 'women job', 'women driving', 'women education', 'women study', 'women working haram', 'can women work', 'muslim women work'],
    answer: 'Women working, driving, and pursuing education are all permissible in Islam. (1) Education: Seeking knowledge is an obligation for every Muslim, male and female — the Prophet (PBUH) said: "Seeking knowledge is an obligation upon every Muslim" (Ibn Majah). Aisha (RA) was one of the greatest scholars of Islam, and many female companions were teachers of men. (2) Working: Women are permitted to work and earn their own income, provided their work is halal and they maintain Islamic modesty. Khadijah (RA), the Prophet\'s first wife, was a successful businesswoman. The Quran mentions women who took a pledge of allegiance and participated in society. (3) A woman\'s income is her own — she is not obligated to spend it on the household (that is the husband\'s duty), though she may contribute if she wishes. (4) Driving: There is no Islamic prohibition on women driving. The prohibition in some countries (historically Saudi Arabia) was a cultural/political policy, not an Islamic ruling. (5) Conditions for women working: (a) The job itself is halal (not serving alcohol, not in a haram environment), (b) she maintains hijab/modesty, (c) she avoids free mixing and seclusion (khalwa) with non-mahram men where possible, (d) the work does not cause her to neglect her primary responsibilities (if she has young children, she should ensure they are cared for). (6) The cultural expectation that women should only stay at home is not an Islamic requirement — it is a cultural norm in some societies. Islam gives women the right to own property, run businesses, and be financially independent. (7) Balance is key — a woman should not be forced to work nor forced to stay home; it should be her choice in agreement with her family.',
    sources: [
      'Sunan Ibn Majah, Book of Purification, Hadith 224',
      'Sahih al-Bukhari, Book of Merchandise (Khadijah as businesswoman)',
      'Quran, Surah An-Nisa 4:32 (women can earn)',
      'Sahih Muslim, Book of Piety (Aisha as scholar)',
    ],
  },
  {
    patterns: [
      /is.*men.*and.*women.*equal/i, /does.*islam.*give.*women.*rights/i,
      /women.*rights.*islam/i, /is.*islam.*sexist/i, /does.*islam.*oppress.*women/i,
      /gender.*equality.*islam/i,
    ],
    keywords: ['men women equal', 'women rights', 'women rights islam', 'islam sexist', 'oppress women', 'gender equality', 'does islam oppress women'],
    answer: 'Islam teaches that men and women are equal in spiritual worth and accountability before Allah, though they have different roles and rights. (1) Spiritual equality: The Quran says: "Whoever does righteousness, whether male or female, while being a believer — We will surely cause them to live a good life, and We will surely give them their reward according to the best of what they used to do" (16:97). (2) The Prophet (PBUH) said: "Women are the twin halves of men" (Abu Dawud, Tirmidhi). (3) Rights Islam gave women 1400 years ago (many of which were revolutionary at the time and predated Western legal rights by centuries): the right to inherit, the right to own and manage property, the right to choose her husband (consent required), the right to seek divorce (khul\'), the right to education, the right to keep her own income, the right to mahr (dowry from the husband), financial maintenance by the husband even if she is wealthy, and the right to be treated with kindness (the Prophet said: "The best of you are those who are best to their wives"). (4) Different roles: Islam assigns men the primary financial responsibility for the family, and women the primary role in raising children — but these are not exclusive. A woman can work and a man can help with children. (5) The Quran says: "And they (women) have rights similar to those (of men) over them in kindness" (2:228). (6) Cultural practices that oppress women (forced marriage, honor killings, denying education, female genital mutilation, forbidding mosque attendance) are cultural, NOT Islamic. (7) "Honor killings" are murder and a major sin in Islam — there is no concept of "honor" justifying killing in the Quran or Sunnah. (8) The misconception that Islam oppresses women usually comes from conflating cultural practices with Islamic teachings.',
    sources: [
      'Quran, Surah An-Nahl 16:97',
      'Quran, Surah Al-Baqarah 2:228',
      'Jami at-Tirmidhi, Hadith 2785',
      'Sahih al-Bukhari, Book of Marriage, Hadith 5186',
    ],
  },
  {
    patterns: [
      /is.*music.*in.*quran.*haram/i, /does.*quran.*mention.*music/i,
      /is.*lahw.*haram/i, /is.*entertainment.*haram/i, /movies.*islam/i,
      /is.*watching.*movies.*haram/i, /is.*netflix.*haram/i, /tv.*shows.*islam/i,
    ],
    keywords: ['movies', 'netflix', 'tv shows', 'entertainment', 'watching movies', 'movies haram', 'tv haram', 'entertainment haram', 'lahw'],
    answer: 'Entertainment like movies, TV shows, and streaming (Netflix, etc.) is a nuanced topic in Islam. There is no single verse that says "movies are haram," but scholars evaluate them based on content. (1) Permissible entertainment: Watching content that is clean, educational, inspiring, or harmless (nature documentaries, educational content, family-friendly shows without haram elements) is generally permitted. The Prophet (PBUH) allowed wrestling matches and athletic displays as entertainment. (2) What makes entertainment haram: (a) Content that includes sexual immodesty, romance scenes, or promotes zina (fornication), (b) glorifying haram (alcohol, drugs, crime, gambling), (c) shirk or mockery of religion, (d) excessive time-wasting that distracts from salah, work, or family (the Prophet warned: "There are two blessings which many people lose: health and free time" — Bukhari), (e) content that hardens the heart or increases desire for the haram. (3) The Quran says: "And those who do not witness falsehood, and if they pass by ill speech, they pass by with dignity" (25:72), which some scholars interpret as avoiding gatherings of sin. (4) Music in movies follows the same ruling as music generally — if you follow the majority view that instruments are haram, then movies with music would be problematic. (5) Practical guidance: Be selective. Avoid content that is clearly haram. If a show has a haram scene, skip it. Don\'t let entertainment replace worship, family time, or productivity. (6) The key principle: everything in moderation, and avoid the haram. Consult a scholar if you are unsure about specific content.',
    sources: [
      'Quran, Surah Al-Furqan 25:72',
      'Sahih al-Bukhari, Book of Funerals, Hadith 6412',
      'Sunan an-Nasa\'i, Book of Eids (wrestling as entertainment)',
    ],
  },
  {
    patterns: [
      /is.*cutting.*hair.*women.*haram/i, /women.*cutting.*hair.*islam/i,
      /can.*women.*cut.*hair/i, /short.*hair.*women.*islam/i,
      /is.*trimming.*hair.*haram/i,
    ],
    keywords: ['women cut hair', 'cutting hair women', 'short hair women', 'women cutting hair', 'trim hair', 'cut hair islam', 'women short hair'],
    answer: 'Women cutting or trimming their hair is permissible in Islam, with some conditions. (1) The majority of scholars permit women to cut or trim their hair, as there is no explicit text in the Quran or authentic Sunnah that prohibits it. (2) Conditions: (a) The haircut should not imitate men\'s hairstyles or be masculine — the Prophet (PBUH) cursed women who imitate men and men who imitate women (Bukhari). So a woman should not get a "men\'s cut." (b) The haircut should not imitate disbelieving women\'s distinctive styles if it is a religious/cultural symbol (the hadith about imitating other nations). (c) It should not be done to appear immodest or attract non-mahram men. (3) Trimming the hair for health, hygiene, removing split ends, or managing long hair is clearly permissible. (4) Some scholars (a minority, particularly some Salafi scholars) hold that women should not cut their hair at all, citing the hadith that a woman cannot cut her hair like a man. However, the majority view is that cutting for a good reason (not to imitate men) is fine. (5) The hair must still be covered with hijab in front of non-mahram men — the ruling on cutting does not change the hijab requirement. (6) Shaving the head completely is discouraged for women unless medically necessary, as the Prophet (PBUH) forbade women from shaving their heads (Tirmidhi). Trimming and cutting are different from shaving. (7) Follow the position of a scholar you trust.',
    sources: [
      'Sahih al-Bukhari, Book of Dress, Hadith 5885 (women imitating men)',
      'Jami at-Tirmidhi, Book of Dress, Hadith 1774',
      'Sunan Abi Dawud, Book of Dress',
    ],
  },
  {
    patterns: [
      /is.*perfume.*for.*men.*halal/i, /men.*perfume.*islam/i, /attar.*men/i,
      /is.*it.*sunna.*to.*wear.*perfume/i, /alcohol.*perfume.*islam/i,
      /is.*perfume.*with.*alcohol.*haram/i,
    ],
    keywords: ['perfume', 'attar', 'men perfume', 'perfume alcohol', 'alcohol perfume', 'wear perfume', 'perfume islam'],
    answer: 'Wearing perfume is a Sunnah for both men and women, with important distinctions. (1) The Prophet (PBUH) said: "Two things make one forget the world: perfume and women, and two things make one love the world: prayer and fasting" — meaning perfume is beloved. He loved good smells and frequently used perfume. (2) For men: Wearing perfume (attar, oud, etc.) is a confirmed Sunnah and highly recommended. The Prophet (PBUH) said: "The perfume of men is that whose scent is apparent and whose color is hidden, and the perfume of women is that whose color is apparent and whose scent is hidden" (Tirmidhi). So men should wear perfume that is visible in scent but not colorful (clear oils, not colored). (3) For women: Wearing perfume is also permissible, but it should NOT be worn in public where non-mahram men can smell it — the Prophet (PBUH) said: "When a woman applies perfume and passes by a gathering, she is like an adulteress" (Tirmidhi, Nasai). This means strong perfume in public is discouraged because it attracts attention. Women may wear perfume at home for their husbands or in women-only gatherings. (4) Regarding alcohol in perfume: Most scholars permit using perfumes that contain synthetic alcohol (like denatured alcohol used in sprays) because: (a) it is not intended for drinking, (b) it is synthetic, not derived from dates/grapes (which would make it najis), (c) it evaporates and does not intoxicate. Some stricter scholars avoid all alcohol-based perfumes. The majority view is that alcohol-based perfumes are permissible to use. (5) Applying perfume before prayer is recommended, especially for Friday prayer.',
    sources: [
      'Jami at-Tirmidhi, Book of Dress, Hadith 2787',
      'Sahih al-Bukhari, Book of Friday, Hadith 880',
      'Sunan an-Nasa\'i, Book of Adornment, Hadith 5127',
    ],
  },
  {
    patterns: [
      /how.*to.*pray.*islam/i, /how.*perform.*salah/i, /how.*to.*do.*salah/i,
      /how.*to.*pray.*5.*times/i, /steps.*of.*salah/i, /how.*to.*pray.*namaz/i,
      /how.*to.*pray.*step.*by.*step/i,
    ],
    keywords: ['how to pray', 'how to perform salah', 'how to do salah', 'steps of salah', 'how to pray namaz', 'how to pray islam', 'steps of prayer', 'how to pray step by step'],
    answer: 'Here are the basic steps of Salah (the obligatory prayer): (1) Make wudu (ablution) — cleanse yourself. (2) Face the Qibla (direction of the Kaaba in Mecca). (3) Make the intention (niyyah) in your heart for which prayer you are performing (Fajr, Dhuhr, Asr, Maghrib, Isha). (4) Raise your hands and say "Allahu Akbar" (Takbir al-Tahrim) — this begins the prayer. (5) Place your right hand over your left on your chest and recite the opening du\'a, then recite Surah Al-Fatihah (the opening chapter of the Quran). (6) Recite another surah or verses from the Quran (like Surah Al-Ikhlas). (7) Say "Allahu Akbar" and bow (ruku) — place your hands on your knees, back straight, and say "Subhana Rabbiyal Azeem" three times. (8) Rise from ruku saying "Sami\'a Allahu liman hamidah" and then "Rabbana wa lakal hamd." (9) Say "Allahu Akbar" and prostrate (sujud) — forehead, nose, both palms, both knees, and toes on the ground. Say "Subhana Rabbiyal A\'la" three times. (10) Rise saying "Allahu Akbar" and sit briefly. (11) Perform a second prostration the same way. (12) This completes one rakat. Stand up saying "Allahu Akbar" for the next rakat. (13) Repeat steps 5-11 for each rakat. (14) In the second rakat (and final rakat) after the second prostration, sit and recite Tashahhud: "At-tahiyatu lillahi was-salawatu wat-tayyibat, as-salamu \'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh, as-salamu \'alayna wa \'ala ibadillahis-salihin. Ashhadu an la ilaha illallah, wa ashhadu anna Muhammadan abduhu wa rasuluh." (15) In the final rakat, after Tashahhud, recite Salawat: "Allahumma salli \'ala Muhammad, wa \'ala aali Muhammad..." then make du\'a. (16) Turn your head right saying "As-salamu \'alaykum wa rahmatullah," then left. This ends the prayer. The number of rakats: Fajr (2), Dhuhr (4), Asr (4), Maghrib (3), Isha (4). I recommend learning from a local imam or a trusted app/video — practice makes it natural.',
    sources: [
      'Sahih al-Bukhari, Book of Prayer (many hadiths on prayer method)',
      'Sahih Muslim, Book of Prayer',
      'Quran, Surah Al-Fatihah 1:1-7',
    ],
  },
  {
    patterns: [
      /how.*to.*make.*wudu/i, /how.*do.*wudu/i, /steps.*of.*wudu/i,
      /how.*to.*perform.*ablution/i, /how.*to.*do.*ablution/i, /wudu.*step.*by.*step/i,
    ],
    keywords: ['how to make wudu', 'how to do wudu', 'steps of wudu', 'how to perform ablution', 'how to do ablution', 'wudu step by step', 'wudu steps'],
    answer: 'Wudu (ablution) is the purification before prayer. Steps: (1) Make the intention (niyyah) in your heart to perform wudu. (2) Say "Bismillah" (In the name of Allah). (3) Wash both hands up to the wrists three times. (4) Rinse your mouth with water three times (madmada). (5) Sniff water into your nose and blow it out three times (istinshaq). (6) Wash your entire face three times — from the hairline to the chin, and ear to ear. (7) Wash your right arm from the fingertips to the elbow three times, then the left arm three times. (8) Wipe your head (mash) with wet hands once — from front to back and back to front. (9) Wipe the inside and outside of your ears with wet hands once. (10) Wash your right foot from toes to ankle three times, then the left foot three times. (11) After completing wudu, recite the shahada: "Ashhadu an la ilaha illallah wahdahu la sharika lah, wa ashhadu anna Muhammadan abduhu wa rasuluh. Allahumma ij\'alni minat-tawwabin, waj\'alni minal mutatahhirin." (12) What breaks wudu: passing gas, using the bathroom, deep sleep, loss of consciousness, touching the private parts with desire, and eating camel meat (according to some scholars). (13) Wudu is required before Salah, touching the Quran, and tawaf. If water is unavailable or harmful (due to wounds/sickness), perform tayammum (dry ablution) with clean earth/dust instead.',
    sources: [
      'Quran, Surah Al-Ma\'idah 5:6 (the verse of wudu)',
      'Sahih al-Bukhari, Book of Ablution, Hadith 159',
      'Sahih Muslim, Book of Purification, Hadith 226',
    ],
  },
  {
    patterns: [
      /how.*to.*perform.*ghusl/i, /how.*to.*do.*ghusl/i, /what.*is.*ghusl/i,
      /ghusl.*step.*by.*step/i, /how.*to.*purify.*after.*janabah/i,
      /how.*to.*bath.*islam/i,
    ],
    keywords: ['ghusl', 'how to perform ghusl', 'how to do ghusl', 'what is ghusl', 'janabah', 'ritual bath', 'major impurity', 'purify after'],
    answer: 'Ghusl is the full-body ritual purification required after certain states: sexual intercourse, ejaculation (wet dream or awake), menstruation, and childbirth. Steps: (1) Make the intention (niyyah) in your heart. (2) Say "Bismillah" and wash both hands. (3) Wash the private parts with the left hand. (4) Perform a complete wudu (ablution) as described above. (5) Pour water over your head three times, rubbing the hair to ensure water reaches the roots. (6) Wash the entire body — start with the right side, then the left. Ensure water reaches every part: underarms, navel, behind ears, between toes, etc. (7) For women: if the hair is braided, you do not need to unbraid it — just pour water over the head thoroughly. (8) You can combine ghusl with a regular shower — just make the intention and follow the order. (9) After ghusl, you are fully pure and can perform Salah, touch the Quran, and do all acts of worship. (10) Ghusl is also recommended before Jumuah (Friday prayer), the two Eids, entering Mecca for Umrah/Hajj, and before intimate relations. (11) If water is unavailable, perform tayammum. (12) Signs that ghusl is needed: wet dream (even without physical contact), sexual discharge, intercourse (even without discharge — according to the majority), end of menstruation, end of postpartum bleeding.',
    sources: [
      'Quran, Surah Al-Ma\'idah 5:6 (the verse of ghusl)',
      'Sahih al-Bukhari, Book of Bathing, Hadith 249',
      'Sahih Muslim, Book of Purification, Hadith 317',
    ],
  },
  {
    patterns: [
      /how.*to.*fast.*ramadan/i, /how.*to.*start.*fasting/i, /rules.*of.*fasting/i,
      /what.*breaks.*the.*fast/i, /what.*invalidates.*fast/i, /how.*to.*keep.*roza/i,
      /fasting.*rules.*islam/i,
    ],
    keywords: ['how to fast', 'how to fast ramadan', 'rules of fasting', 'what breaks the fast', 'what invalidates fast', 'how to keep roza', 'fasting rules islam', 'start fasting'],
    answer: 'Fasting (Sawm) in Ramadan is one of the Five Pillars of Islam. (1) Intention (niyyah): Make the intention to fast before Fajr (dawn). It does not need to be spoken — it is in the heart. (2) Suhoor: Eat a pre-dawn meal before Fajr — this is a Sunnah and gives strength. The Prophet (PBUH) said: "Partake of suhoor, for there is blessing in it" (Bukhari). (3) During the fast: from Fajr (dawn) to Maghrib (sunset), you abstain from: eating, drinking, sexual intercourse, and swallowing anything that is considered food/drink. (4) What breaks the fast: (a) eating or drinking intentionally, (b) sexual intercourse during the day, (c) deliberate vomiting, (d) swallowing something non-edible that is larger than a grain, (e) menstruation or postpartum bleeding (even if it starts right before Maghrib), (f) intentionally breaking the fast. (5) What does NOT break the fast: (a) swallowing saliva, (b) tasting food without swallowing, (c) using eye drops, (d) using miswak/toothbrush, (e) injections that are not nutritional, (f) blood tests, (g) using inhalers (according to many scholars), (h) showering/swimming (as long as water is not swallowed). (6) Who is exempt from fasting: the sick, travelers, pregnant/nursing women (if fasting harms them), the elderly who cannot fast, menstruating/postpartum women, and children before puberty. (7) Making up missed fasts: travelers, the sick, and menstruating women must make up missed fasts on other days before the next Ramadan. (8) Iftar: Break the fast at Maghrib with dates and water — the Prophet (PBUH) said: "When one of you breaks his fast, let him break it with dates, for they are blessed" (Abu Dawud). (9) The reward is immense — the Prophet (PBUH) said: "Whoever fasts Ramadan with faith and seeking reward, his previous sins are forgiven" (Bukhari).',
    sources: [
      'Quran, Surah Al-Baqarah 2:183-185',
      'Sahih al-Bukhari, Book of Fasting, Hadith 1923',
      'Sahih Muslim, Book of Fasting',
      'Sunan Abi Dawud, Book of Fasting, Hadith 2356',
    ],
  },
  {
    patterns: [
      /what.*are.*the.*five.*pillars/i, /what.*are.*5.*pillars.*islam/i,
      /five.*pillars.*of.*islam/i, /pillars.*of.*islam/i,
    ],
    keywords: ['five pillars', '5 pillars', 'pillars of islam', 'five pillars of islam'],
    answer: 'The Five Pillars of Islam are the foundational acts of worship and practice that every Muslim is expected to uphold: (1) Shahada (Declaration of Faith): The testimony that "There is no god but Allah, and Muhammad is His Messenger." This is the entry point to Islam — said with conviction, it makes one a Muslim. (2) Salah (Prayer): Performing five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) at their prescribed times. This is the daily connection with Allah. (3) Zakat (Charity): Giving 2.5% of one\'s accumulated wealth (savings, gold, silver, investments) to the poor and needy annually, if one\'s wealth is above the nisab threshold. This purifies wealth and helps the community. (4) Sawm (Fasting): Fasting during the month of Ramadan from dawn to sunset — abstaining from food, drink, and intimate relations during daylight hours. This builds self-discipline and empathy for the poor. (5) Hajj (Pilgrimage): Making the pilgrimage to Mecca at least once in a lifetime, if one is physically and financially able. This unifies Muslims globally and traces the footsteps of Prophet Ibrahim (AS). The Prophet (PBUH) said: "Islam is built upon five: testifying that there is no god but Allah and that Muhammad is His Messenger, establishing prayer, giving zakat, fasting Ramadan, and making Hajj to the House" (Bukhari and Muslim).',
    sources: [
      'Sahih al-Bukhari, Book of Faith, Hadith 8',
      'Sahih Muslim, Book of Faith, Hadith 16',
      'Quran (the concept appears throughout: 2:183, 2:177, 22:27)',
    ],
  },
  {
    patterns: [
      /how.*to.*become.*muslim/i, /how.*convert.*to.*islam/i,
      /how.*revert.*to.*islam/i, /how.*accept.*islam/i,
      /how.*to.*take.*shahada/i, /what.*do.*i.*say.*to.*become.*muslim/i,
    ],
    keywords: ['become muslim', 'convert to islam', 'revert to islam', 'accept islam', 'take shahada', 'become a muslim', 'how to become muslim'],
    answer: 'To become a Muslim, you simply say the Shahada (declaration of faith) with conviction in your heart: "Ashhadu an la ilaha illallah, wa ashhadu anna Muhammadan rasulullah." This means: "I bear witness that there is no god but Allah, and I bear witness that Muhammad is His Messenger." (1) That\'s it — saying these words with sincere belief makes you a Muslim. You do not need a ceremony, a witness, or an imam (though it is recommended to say it in front of witnesses at a mosque so the community can support you). (2) After taking the Shahada: (a) Start learning how to pray (Salah) — this is the most important daily act of worship. (b) Begin learning about the Quran and the Prophet\'s teachings. (c) Take it step by step — Allah looks at your effort and intention, not perfection. (c) Find a local mosque or Muslim community for support. (d) Take a shower (ghusl) as a symbolic purification. (3) All your previous sins are forgiven when you accept Islam — you start with a clean slate. The Prophet (PBUH) said: "Islam wipes out whatever sins came before it" (Muslim). (4) You do not need to change your name unless it has a meaning contrary to Islam. (5) Take things gradually — do not overwhelm yourself. Learn the prayers first, then fasting, then the other pillars. (6) Allah says: "Say, O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, He is the Forgiving, the Merciful" (Quran 39:53). Welcome to Islam.',
    sources: [
      'Sahih Muslim, Book of Faith, Hadith 121',
      'Quran, Surah Az-Zumar 39:53',
      'Sahih al-Bukhari, Book of Faith',
    ],
  },
  {
    patterns: [
      /how.*to.*repent.*islam/i, /how.*to.*make.*tawbah/i, /how.*to.*ask.*forgiveness/i,
      /how.*to.*repent.*for.*sin/i, /tawbah.*step/i, /how.*to.*seek.*forgiveness/i,
    ],
    keywords: ['how to repent', 'how to make tawbah', 'how to ask forgiveness', 'how to repent for sin', 'how to seek forgiveness', 'tawbah steps', 'repentance islam'],
    answer: 'Tawbah (repentance) is the way to return to Allah after sinning. The conditions for valid repentance: (1) Immediate cessation: Stop the sin immediately. You cannot repent while continuing to commit the sin. (2) Sincere regret (nadama): Feel genuine remorse for the sin — not just regret for being caught or for consequences, but regret for disobeying Allah. (3) Firm resolve: Make a sincere intention never to return to the sin. (4) If the sin involved the rights of another person (like stealing, backbiting, or hurting someone), you must also restore that right — return stolen property, apologize to the person, or make amends. This is essential — Allah does not forgive the rights of people unless they forgive you first. (5) For major sins, it is recommended to perform the prayer of repentance (Salat al-Tawbah) — pray two rakats and then make du\'a for forgiveness. (6) Say the dua of forgiveness: "Astaghfirullahal Azeem, aladhi la ilaha illa Huwal Hayyul Qayyum, wa atubu ilayh." (7) Allah says: "O you who believe, repent to Allah with sincere repentance. Perhaps your Lord will remove your ills and admit you to gardens beneath which rivers flow" (Quran 66:8). (8) The Prophet (PBUH) said: "Allah is more pleased with the repentance of His servant than any of you would be upon finding your lost camel in the desert" (Bukhari and Muslim). (9) Even if you sin again after repenting, repent again — and again. Never stop repenting. Allah says: "Do not despair of the mercy of Allah" (Quran 39:53). (10) The best time to repent is now — do not delay, for none of us knows when our time will come.',
    sources: [
      'Quran, Surah At-Tahrim 66:8',
      'Quran, Surah Az-Zumar 39:53',
      'Sahih al-Bukhari, Book of Oneness of Allah, Hadith 6309',
      'Sahih Muslim, Book of Repentance, Hadith 2747',
    ],
  },
  {
    patterns: [
      /who.*was.*prophet.*muhammad/i, /tell.*me.*about.*prophet.*muhammad/i,
      /biography.*prophet.*muhammad/i, /life.*of.*prophet/i, /who.*is.*muhammad.*pbuh/i,
      /history.*of.*prophet.*muhammad/i,
    ],
    keywords: ['who was prophet muhammad', 'who is muhammad', 'prophet muhammad biography', 'life of prophet', 'who is muhammad pbuh', 'history of prophet muhammad', 'about prophet muhammad'],
    answer: 'Prophet Muhammad (peace be upon him) was the final prophet and messenger of Allah, sent to all of humanity. (1) Birth: Born in 570 CE in Mecca (in present-day Saudi Arabia). His father Abdullah died before his birth, and his mother Aminah died when he was 6. He was raised by his grandfather Abdul Muttalib and then his uncle Abu Talib. (2) Early life: He was known as "Al-Amin" (the trustworthy) and "Al-Sadiq" (the truthful) — respected for his honesty and character even before prophethood. He worked as a merchant and shepherd. (3) Marriage: At 25, he married Khadijah (RA), a successful businesswoman 15 years his senior. She was his greatest supporter. (4) Prophethood: At 40, while meditating in the Cave of Hira, the angel Gabriel (Jibreel) came to him with the first revelation: "Read! In the name of your Lord who created" (Quran 96:1). He received revelations over 23 years, which became the Quran. (5) Message: He called people to worship one God (Allah), abandon idolatry, and live with justice, mercy, and morality. He faced severe persecution in Mecca for 13 years. (6) Migration (Hijrah): In 622 CE, he migrated to Medina — this event marks the beginning of the Islamic calendar. (7) In Medina: He established a community based on faith, brotherhood, justice, and the rights of women, orphans, and the poor. He fought defensive battles (Badr, Uhud, Khandaq) and eventually returned to Mecca in 630 CE, conquering it without bloodshed and forgiving his enemies. (8) Character: He was known for his mercy, humility, generosity, and gentleness. He said: "I have been sent to perfect good character" (Ahmad). He was a devoted husband, father, and leader. (9) Death: He passed away in 632 CE in Medina, at 63 years old. His final words were: "The higher fellowship" (referring to Allah). (10) He is the final prophet — no prophet will come after him. The Quran says: "Muhammad is not the father of any of your men, but he is the Messenger of Allah and the last of the prophets" (33:40).',
    sources: [
      'Quran, Surah Al-Ahzab 33:40',
      'Quran, Surah Al-Alaq 96:1-5 (first revelation)',
      'Sahih al-Bukhari, Book of the Beginning of Revelation, Hadith 3',
      'Sirat Ibn Hisham (earliest biography)',
    ],
  },
  {
    patterns: [
      /what.*is.*the.*quran/i, /tell.*me.*about.*the.*quran/i,
      /how.*was.*quran.*revealed/i, /who.*wrote.*the.*quran/i,
      /how.*many.*chapters.*in.*quran/i, /how.*many.*verses.*quran/i,
    ],
    keywords: ['what is the quran', 'about the quran', 'how was quran revealed', 'who wrote the quran', 'how many chapters quran', 'how many verses quran', 'quran revealed'],
    answer: 'The Quran is the holy book of Islam — the literal word of Allah revealed to Prophet Muhammad (PBUH) through the angel Gabriel (Jibreel) over 23 years. (1) Meaning: "Quran" comes from the Arabic root "qara\'a" meaning "to recite" — it is meant to be recited. (2) Revelation: It was revealed gradually from 610 CE (when the Prophet was 40) to 632 CE (his death). The first verses were in the Cave of Hira: "Read! In the name of your Lord who created" (96:1). (3) Preservation: The Quran was memorized by the companions during the Prophet\'s lifetime and written down on parchment, leather, and stone. It was compiled into a single book within 20 years of the Prophet\'s death under Caliph Uthman (RA). It has been preserved word-for-word for 1400 years — not a single letter has changed. (4) Structure: 114 chapters (surahs), 6,236 verses (ayahs). The longest surah is Al-Baqarah (286 verses) and the shortest is Al-Kawthar (3 verses). (5) Content: It covers theology, law, morality, stories of prophets, guidance for daily life, and descriptions of the afterlife. It is not a chronological narrative but a thematic book. (6) Language: It was revealed in Arabic. Translations exist but are considered interpretations — the Arabic text is the Quran. (7) Inimitability: The Quran is considered a miracle — its language, style, and content are beyond human production. The Quran challenges: "If you are in doubt about what We have sent down upon Our servant, then produce a surah like it" (2:23). (8) Reciting it: Muslims recite the Quran in daily prayers and for barakah (blessing). The reward for reciting each letter is immense — the Prophet (PBUH) said: "Whoever recites a letter from the Book of Allah, he will receive a good deed, and a good deed is multiplied tenfold" (Tirmidhi). (9) Memorization: Millions of Muslims have memorized the entire Quran (huffaz) — a continuous chain of oral preservation since the 7th century. (10) Allah says: "Indeed, it is We who sent down the Quran and indeed, We will be its guardian" (15:9).',
    sources: [
      'Quran, Surah Al-Hijr 15:9 (preservation)',
      'Quran, Surah Al-Baqarah 2:23 (challenge)',
      'Sahih al-Bukhari, Book of the Virtues of the Quran',
      'Jami at-Tirmidhi, Book of the Virtues of the Quran, Hadith 2910',
    ],
  },
  {
    patterns: [
      /what.*is.*difference.*sunni.*shia/i, /sunni.*vs.*shia/i,
      /sunni.*shia.*islam/i, /why.*sunni.*shia.*split/i,
      /what.*are.*sunni.*shia/i, /difference.*between.*sunni.*shia/i,
    ],
    keywords: ['sunni shia', 'sunni vs shia', 'sunni and shia', 'difference sunni shia', 'why sunni shia split', 'sunni shia islam'],
    answer: 'Sunni and Shia are the two main branches of Islam. The split occurred over a political disagreement about leadership (the caliphate) after the Prophet\'s death in 632 CE, not over core beliefs. (1) Sunnis (85-90% of Muslims): Believe that the Muslim community should choose its leader (caliph) by consultation and consensus. They accepted Abu Bakr (RA), the Prophet\'s closest companion, as the first caliph. They recognize all four rightly guided caliphs (Abu Bakr, Umar, Uthman, Ali) as legitimate. (2) Shia (10-15%): Believe that leadership should remain within the Prophet\'s family (Ahl al-Bayt), specifically that Ali (RA), the Prophet\'s cousin and son-in-law, should have been the first caliph. They believe the Prophet designated Ali as his successor. (3) Shared beliefs: Both Sunnis and Shias believe in: one God (Allah), the prophethood of Muhammad (PBUH), the Quran as the word of Allah, the five pillars, the angels, the Day of Judgment, and the core articles of faith. (4) Differences in practice: Shias combine some prayers (Dhuhr-Asr and Maghrib-Isha), while Sunnis pray at five separate times. Shias have a concept of marja (religious authority) and taqleed (following a scholar). Sunnis follow one of four schools of jurisprudence (Hanafi, Maliki, Shafi\'i, Hanbali). (5) The tragedy of Karbala (680 CE): The martyrdom of Husain (RA), the Prophet\'s grandson, at the hands of the Umayyad caliph Yazid\'s forces, deepened the Sunni-Shia divide. It is a deeply mournful event, especially for Shias. (6) Despite differences, both branches are Muslims. Scholars on both sides have called for unity and mutual respect. The Quran says: "And hold firmly to the rope of Allah all together and do not become divided" (3:103). (7) Extremism on both sides that declares the other "not Muslim" is rejected by mainstream scholarship.',
    sources: [
      'Quran, Surah Al-Imran 3:103 (unity)',
      'Sahih al-Bukhari, Book of Virtues of the Companions',
      'The Amman Message (2004) — recognized both Sunni and Shia as valid Muslims',
    ],
  },
  {
    patterns: [
      /is.*missing.*prayer.*sin/i, /what.*if.*i.*missed.*prayer/i,
      /how.*to.*make.*up.*missed.*prayer/i, /qada.*prayer/i, /missed.*salah.*what.*do/i,
      /is.*it.*sin.*to.*miss.*prayer/i, /what.*happens.*if.*you.*miss.*prayer/i,
    ],
    keywords: ['missed prayer', 'missing prayer', 'missed salah', 'qada prayer', 'make up missed prayer', 'miss prayer sin', 'what if i missed prayer'],
    answer: 'Missing a prayer intentionally is a major sin in Islam, but there is a path to make it right. (1) Prayer is the most important obligation after the Shahada — the Prophet (PBUH) said: "The covenant that distinguishes us from them is prayer, so whoever abandons it has disbelieved" (Ahmad, Tirmidhi, Nasai). (2) If you miss a prayer unintentionally (oversleeping, forgetting): The Prophet (PBUH) said: "Whoever forgets a prayer or sleeps through its time, let him pray it when he remembers" (Bukhari). So you pray it as soon as you remember — this is called qada. There is no sin in forgetting or oversleeping. (3) If you miss a prayer intentionally (laziness, neglect): This is a major sin. The majority of scholars say you must make it up (qada) AND repent. Some scholars (including Ibn Taymiyyah in one view) say intentional missed prayers cannot be made up and the only path is sincere repentance and resolving never to miss again. The safest approach: make up the missed prayers AND repent sincerely. (4) How to make up missed prayers (qada): Pray the missed prayer exactly as it was — same number of rakats, same recitations. You can make them up any time except during the three prohibited times (sunrise, sunset, zenith). (5) If you have missed many prayers over years: Start by praying all current prayers on time, then gradually make up the missed ones. Some scholars recommend estimating the missed prayers and making them up systematically. Others say focus on establishing current prayers and make sincere tawbah. Consult a scholar. (6) The key: do not let guilt or overwhelm stop you. Start praying now, make tawbah, and Allah will help you. The Prophet (PBUH) said: "Allah says: I am as my servant thinks of Me. If he thinks good, he gets good" (Bukhari). (7) Never give up — Allah\'s mercy is greater than any sin.',
    sources: [
      'Sahih al-Bukhari, Book of Prayer, Hadith 597',
      'Jami at-Tirmidhi, Book of Prayer, Hadith 410',
      'Musnad Ahmad, Hadith 22307',
    ],
  },
  {
    patterns: [
      /is.*non.*muslim.*friend.*haram/i, /can.*muslim.*be.*friend.*non.*muslim/i,
      /is.*having.*non.*muslim.*friends.*haram/i, /friendship.*with.*non.*muslim/i,
      /can.*i.*be.*friend.*with.*kafir/i, /non.*muslim.*friends.*islam/i,
    ],
    keywords: ['non muslim friend', 'non-muslim friend', 'friendship non muslim', 'friend non muslim', 'non muslim friends', 'kafir friend', 'friendship with non muslim'],
    answer: 'Yes, Muslims can be friends with non-Muslims — Islam encourages good relations with all people. (1) The Quran says: "Allah does not forbid you from being righteous and just toward those who do not fight you over religion or drive you from your homes. Indeed, Allah loves the just" (60:8). This verse permits friendship, kindness, and justice with non-Muslims who are not hostile. (2) The Quran also says: "Today all good things have been made lawful for you. The food of the People of the Book is lawful for you, and your food is lawful for them. And lawful in marriage are chaste women from among the believers and chaste women from among those who were given the Scripture before you" (5:5). (3) The verse often cited as prohibiting friendship ("Do not take the Jews and Christians as allies" — 5:51) refers to political/military alliances against Muslims, not personal friendships. The word used is "awliya" (allies/protectors), not "asdiqa" (friends). (4) The Prophet (PBUH) had excellent relations with non-Muslims — he did business with them, visited their sick, accepted their gifts, and treated neighbors kindly regardless of faith. (5) Guidelines: (a) Your closest friends and confidants should be those who strengthen your faith. (b) Do not adopt habits or practices that contradict Islam from non-Muslim friends. (c) Treat all friends with kindness, honesty, and good character — this is da\'wah (invitation to Islam) through your behavior. (d) Do not participate in haram activities with friends (drinking, clubbing, etc.) — you can socialize in halal ways. (e) If a friendship is pulling you away from Islam, reconsider it. (6) Being a good friend to non-Muslims is actually encouraged — the Prophet (PBUH) said: "The best of people are those most beneficial to people" (Tabarani).',
    sources: [
      'Quran, Surah Al-Mumtahanah 60:8',
      'Quran, Surah Al-Ma\'idah 5:5',
      'Sahih al-Bukhari (Prophet\'s relations with non-Muslims)',
      'Musnad Al-Bazzar, Hadith 3437',
    ],
  },
  {
    patterns: [
      /is.*physical.*contact.*before.*marriage.*haram/i, /is.*kissing.*before.*marriage.*haram/i,
      /is.*hugging.*opposite.*gender.*haram/i, /physical.*relationship.*before.*marriage/i,
      /is.*holding.*hands.*haram/i, /is.*touching.*opposite.*gender.*haram/i,
      /can.*i.*kiss.*my.*fiance/i, /physical.*contact.*fiance.*islam/i,
    ],
    keywords: ['physical contact before marriage', 'kissing before marriage', 'hugging opposite gender', 'holding hands haram', 'touching opposite gender', 'physical relationship before marriage', 'kiss fiance', 'touch non mahram'],
    answer: 'Physical contact with a non-mahram person of the opposite gender before marriage is haram in Islam. (1) The Prophet (PBUH) said: "It is better for one of you to be struck in the head with an iron needle than to touch a woman who is not permissible for him" (Tabarani, classified as hasan). (2) This includes: kissing, hugging, holding hands, and any physical touch with a non-mahram. (3) The Prophet (PBUH) said: "A man is not alone with a woman but Satan is the third" (Tirmidhi). (4) During engagement (before nikah): The engagement is a promise to marry, but you are still non-mahram to each other. Physical contact, being alone together, and intimate communication are not permitted until after the nikah (the actual marriage contract). (5) After nikah but before the wedding ceremony (ruksati): After the nikah, you are legally married and physical contact is halal — though culturally many couples wait until the wedding celebration. Islamically, the nikah makes everything halal. (6) If you have already crossed these boundaries: Make sincere tawbah (repentance) — stop the behavior, feel regret, and resolve not to repeat it. Allah forgives all sins. (7) The wisdom: These rules protect individuals from emotional and physical complications, preserve the sanctity of marriage, and prevent the harm that comes from casual intimacy (heartbreak, unwanted pregnancies, disease, emotional damage). (8) If you are struggling: Get married as soon as you are able — the Prophet (PBUH) said: "O young people, whoever among you can marry, should marry, for it helps lower the gaze and guard chastity" (Bukhari). If you cannot marry, fast to help control desires.',
    sources: [
      'Quran, Surah An-Nur 24:30-31 (lower the gaze and guard chastity)',
      'Sahih al-Bukhari, Book of Marriage, Hadith 5066',
      'Jami at-Tirmidhi, Book of Manners, Hadith 2840',
    ],
  },
  {
    patterns: [
      /how.*old.*was.*aisha.*when.*married/i, /aisha.*age.*marriage/i,
      /aisha.*age.*prophet.*marry/i, /did.*prophet.*marry.*aisha.*young/i,
      /aisha.*child.*bride/i, /prophet.*marry.*9.*year.*old/i,
    ],
    keywords: ['aisha age', 'aisha age marriage', 'how old was aisha', 'aisha child bride', 'prophet marry aisha young', 'aisha 9 years old', 'aisha age prophet'],
    answer: 'This is an important and often misunderstood topic. (1) Historical records: According to the most well-known hadith in Sahih al-Bukhari, Aisha (RA) was betrothed to the Prophet (PBUH) at age 6 or 7 and the marriage was consummated at age 9, when she had reached puberty. The Prophet was approximately 53 years old. (2) Context: In 7th century Arabia (and most of the world at that time), marriage at puberty was the norm. Puberty was the marker of adulthood. Life expectancy was much shorter, and marriage shortly after puberty was common across all cultures — Roman, Persian, Indian, European, and Arabian. (3) No condemnation in her time: No one — including the enemies of Islam — criticized this marriage. It was entirely normal for the era. Historical criticism of this marriage is a modern phenomenon applying 21st century standards to 7th century context. (4) Aisha\'s character: She became one of the greatest scholars of Islam, narrating over 2,000 hadiths. She was brilliant, eloquent, and was consulted by senior companions on legal matters. The Prophet (PBUH) had a deeply loving and intellectual relationship with her. He said: "Take half your religion from this Humayra (Aisha)" (Tabarani). (5) Some contemporary scholars have questioned the precise age based on alternative historical calculations, suggesting Aisha may have been in her late teens. However, the majority of traditional scholars accept the Bukhari narration. (6) Today: Islamic scholars universally agree that marriage must be at an age where both parties can consent, understand the responsibility, and where it does not cause harm. Child marriage is condemned by the vast majority of contemporary scholars and is illegal in most Muslim-majority countries. The historical example is understood in its 7th-century context, not as a universal model for all times. (7) The Prophet\'s other marriages were largely for political alliances, widow support, or teaching purposes — his first marriage to Khadijah (15 years his senior) was monogamous for 25 years.',
    sources: [
      'Sahih al-Bukhari, Book of Marriage, Hadith 5133-5134',
      'Sahih Muslim, Book of Marriage',
      'Musnad Ahmad (Aisha as scholar)',
      'Contemporary scholarly discussions on Aisha\'s age',
    ],
  },
  {
    patterns: [
      /is.*evolution.*compatible.*islam/i, /does.*islam.*believe.*evolution/i,
      /is.*darwin.*evolution.*haram/i, /human.*evolution.*islam/i,
      /did.*humans.*evolve.*islam/i, /creation.*vs.*evolution.*islam/i,
    ],
    keywords: ['evolution', 'evolution islam', 'human evolution', 'darwin', 'creation vs evolution', 'does islam believe evolution', 'evolution compatible islam'],
    answer: 'The question of evolution and Islam is nuanced and has a range of scholarly opinions. (1) Core Islamic belief: Allah created Adam (AS) directly — "I am creating a human being from clay" (Quran 38:71-72). Adam was created miraculously, not through an evolutionary process. This is the consensus of scholars. (2) Human evolution: The majority of scholars reject the idea that humans evolved from a common ancestor with apes, because the Quran describes Adam\'s creation as a special, direct act of Allah. (3) Animal and plant evolution: Some scholars permit the idea that Allah used evolution as a mechanism for creating plant and animal species, as long as humans are excluded. The Quran says: "Allah created every creature from water" (24:45), which some see as compatible with an evolutionary process guided by Allah. (4) Theistic evolution: A minority of contemporary scholars (like some associated with Al-Ghazali\'s work and Dr. Shoaib Malik) are open to theistic evolution for humans as well, interpreting "Adam" as the first being given a soul (consciousness), with the physical form potentially developing through evolution. This is a minority view. (5) The key distinction: Islam rejects atheistic/materialistic evolution (the idea that evolution is unguided and random), but some scholars accept guided/theistic evolution (Allah as the designer using natural processes). (6) Scientific theories are not articles of faith in Islam — a Muslim can accept or reject evolution in the scientific sense without affecting their faith, as long as they believe Allah is the Creator. (7) The safest position: believe that Adam was created directly by Allah, and leave the question of animal evolution to scientific inquiry while believing Allah is the Creator of all. (8) This topic is still being discussed by scholars — follow the position you find most convincing from a trusted scholar.',
    sources: [
      'Quran, Surah Sad 38:71-72 (creation of Adam)',
      'Quran, Surah An-Nur 24:45 (creation from water)',
      'Quran, Surah Al-Hijr 15:26 (creation from clay)',
      'Contemporary scholarly discussions (Dr. Shoaib Malik, others)',
    ],
  },
  {
    patterns: [
      /is.*seafood.*halal/i, /can.*muslim.*eat.*seafood/i, /is.*shrimp.*halal/i,
      /is.*crab.*halal/i, /is.*lobster.*halal/i, /is.*squid.*halal/i,
      /is.*oyster.*halal/i, /is.*sushi.*halal/i, /seafood.*islam/i,
    ],
    keywords: ['seafood', 'seafood halal', 'shrimp halal', 'crab halal', 'lobster halal', 'squid halal', 'oyster halal', 'sushi halal', 'seafood islam', 'fish halal'],
    answer: 'The rulings on seafood differ between the Islamic schools of jurisprudence. (1) All four schools agree that fish (with scales) are halal — no slaughter required. The Prophet (PBUH) said about the sea: "Its water is pure and its dead are lawful" (Abu Dawud, Tirmidhi, Nasai). This means dead fish from the sea are permissible to eat. (2) Hanafi school: Only fish with scales are halal. Shrimp, crab, lobster, squid, octopus, oysters, and other non-fish sea creatures are considered makruh tahrimi (close to haram) or haram. (3) Shafi\'i, Maliki, and Hanbali schools: All seafood is halal — including shrimp, crab, lobster, squid, octopus, and oysters. (4) Sushi: If the fish is halal (has scales — like salmon, tuna), then sushi is permissible. If it contains non-scaled fish or other haram ingredients, it depends on your school. Raw fish itself is halal — the prohibition is on specific types, not on raw food. (5) If you follow the Hanafi school and wish to avoid shrimp/crab/lobster, that is valid. If you follow the Shafi\'i/Maliki/Hanbali school and eat them, that is also valid. (6) Frogs: The majority of scholars prohibit eating frogs, based on the hadith where the Prophet (PBUH) forbade killing frogs (Abu Dawud). (7) Consult the scholar/school you follow for specific sea creatures.',
    sources: [
      'Sunan Abi Dawud, Book of Foods, Hadith 3821 (sea is pure, its dead are lawful)',
      'Jami at-Tirmidhi, Book of Foods, Hadith 1752',
      'Sunan an-Nasa\'i, Book of Water, Hadith 427',
    ],
  },
  {
    patterns: [
      /is.*gelatin.*halal/i, /is.*gelatine.*halal/i, /gelatin.*islam/i,
      /is.*gelatin.*from.*pork.*haram/i, /can.*muslim.*eat.*gelatin/i,
    ],
    keywords: ['gelatin', 'gelatine', 'gelatin halal', 'gelatin pork', 'gelatin islam', 'eat gelatin'],
    answer: 'The ruling on gelatin depends on its source. (1) Animal-derived gelatin: The majority of gelatin in food and medicine comes from pork or non-zabihah (non-halal slaughtered) beef. The question is whether the transformation (istihalah) from bones/skin to gelatin changes the ruling. (2) The majority of scholars (including many contemporary fatwa councils) hold that the chemical transformation is significant enough that the resulting gelatin is pure and permissible — this is based on the principle of istihalah (complete chemical change makes the impure pure). (3) A minority of scholars (particularly some Salafi scholars) hold that gelatin derived from pork remains haram regardless of transformation, because the origin was impure. (4) Plant-based and synthetic gelatin (agar-agar, pectin, carrageenan) are always halal. (5) Halal-certified gelatin (from halal-slaughtered cattle) is available and is clearly permissible. (6) Medicinal gelatin (in capsules): The majority of scholars permit it because of necessity (medicine) and the transformation principle. If a halal alternative is available, it is better to use it. (7) Practical guidance: Look for halal-certified products, vegetarian/vegan alternatives, or "bovine gelatin" from halal sources. If you are unsure and there is no alternative, the majority view permits it. (8) Consult the scholar you follow.',
    sources: [
      'Contemporary fatwas from Al-Azhar, European Council for Fatwa and Research',
      'Principle of istihalah (chemical transformation) in Islamic jurisprudence',
      'Quran, Surah Al-Baqarah 2:173 (necessity exception)',
    ],
  },
  {
    patterns: [
      /how.*to.*deal.*with.*intrusive.*thoughts.*islam/i, /waswas.*islam/i,
      /intrusive.*thoughts.*religion/i, /is.*having.*bad.*thoughts.*sin/i,
      /waswasah.*islam/i, /intrusive.*thoughts.*imam/i,
    ],
    keywords: ['intrusive thoughts', 'waswas', 'waswasah', 'intrusive thoughts islam', 'bad thoughts islam', 'intrusive thoughts religion', 'intrusive thoughts sin'],
    answer: 'Intrusive thoughts (waswas) are extremely common and are NOT sins in Islam. (1) The Prophet (PBUH) said: "Allah has overlooked for my Ummah what crosses their minds, as long as they do not speak of it or act upon it" (Bukhari and Muslim). This means thoughts that pop into your head involuntarily — even terrible ones like doubting Allah, imagining shirk, or having bad impulses — are completely forgiven as long as you do not speak them or act on them. (2) The Prophet (PBUH) also said: "Satan comes to one of you and says: Who created this? Who created that? Until he says: Who created your Lord? When you reach that, seek refuge in Allah and stop" (Bukhari). (3) Waswas (whispers of Satan): Satan deliberately puts doubts and disturbing thoughts in your mind to distress you. The cure is: (a) seek refuge in Allah (say "A\'udhu billahi minash-shaytanir-rajeem"), (b) stop engaging with the thought — do not analyze or debate it, (c) say "Amantu billahi wa rasulihi" (I believe in Allah and His Messenger), (d) recite Quran or dhikr, (e) ignore it and move on. (4) OCD and religious scrupulosity: If intrusive thoughts are constant and debilitating, this may be a mental health condition (OCD/scrupulosity) that requires professional help. Islam does not require you to suffer — seeking therapy and medication is permitted and encouraged. (5) The Prophet (PBUH) said: "The religion is ease, and no one overburdens himself in religion except that it overcomes him" (Bukhari). (6) Do not feel guilty for thoughts you cannot control — Allah judges you by your actions and words, not your involuntary thoughts. (7) If thoughts involve self-harm or severe distress, please reach out to a mental health professional or crisis line. Islamic guidance and professional help go together.',
    sources: [
      'Sahih al-Bukhari, Book of Faith, Hadith 5269 (thoughts are forgiven)',
      'Sahih Muslim, Book of Faith, Hadith 233 (whispers of Satan)',
      'Sahih al-Bukhari, Book of Faith, Hadith 39 (religion is ease)',
    ],
  },
  {
    patterns: [
      /is.*taking.*medicine.*haram/i, /is.*antidepressant.*halal/i,
      /is.*therapy.*allowed.*islam/i, /is.*mental.*health.*treatment.*halal/i,
      /is.*medication.*haram/i, /can.*muslim.*take.*antidepressants/i,
      /is.*therapy.*islam/i, /counselling.*islam/i,
    ],
    keywords: ['antidepressant', 'antidepressants', 'therapy', 'medication', 'mental health treatment', 'counselling', 'taking medicine haram', 'is therapy allowed', 'mental health islam', 'medication haram'],
    answer: 'Yes, taking medication (including antidepressants) and going to therapy are completely permissible and often encouraged in Islam. (1) The Prophet (PBUH) said: "Allah has not sent down a disease except that He has also sent down its cure" (Bukhari). And: "Seek treatment, O servants of Allah, for Allah has not created a disease without creating a cure for it" (Tirmidhi). (2) Mental health is health: The brain is an organ like any other — it can become ill. Depression, anxiety, OCD, and other conditions are medical conditions, not spiritual failures. Taking medication for them is like taking medication for diabetes or blood pressure. (3) Antidepressants: Permissible. They are not intoxicants — they restore chemical balance in the brain. The prohibition on intoxicants (khamr) applies to substances that cloud the mind, not to prescribed medications that restore health. (4) Therapy/counseling: Completely permissible and highly encouraged. The Prophet (PBUH) gave counsel and advice to people struggling with sadness, anxiety, and distress. Modern therapy is a professional extension of that. (5) Combining treatment with faith: The best approach is both — take your medication, go to therapy, AND make du\'a, pray, and seek Allah\'s help. They are not contradictory. (6) No stigma: There should be no shame in seeking mental health treatment. The Prophet (PBUH) himself sought treatment and advised others to do so. (7) If medication contains alcohol: Most scholars permit necessary medications that contain small amounts of alcohol, based on the principle of necessity. If an alcohol-free alternative exists, it is better. (8) Please do not stop taking prescribed medication without consulting your doctor. If you are in crisis, contact a crisis line or emergency services immediately.',
    sources: [
      'Sahih al-Bukhari, Book of Medicine, Hadith 5678',
      'Jami at-Tirmidhi, Book of Medicine, Hadith 2038',
      'Sahih Muslim, Book of Peace, Hadith 2204',
    ],
  },
  {
    patterns: [
      /is.*cremation.*haram/i, /is.*burial.*obligatory/i, /can.*muslim.*be.*cremated/i,
      /what.*does.*islam.*say.*about.*cremation/i, /burial.*vs.*cremation.*islam/i,
    ],
    keywords: ['cremation', 'cremation haram', 'can muslim be cremated', 'burial obligatory', 'burial vs cremation', 'cremation islam'],
    answer: 'Cremation is strictly prohibited in Islam — burial (dafan) is the only permissible method of disposing of a deceased Muslim\'s body. (1) The body is a trust (amanah) from Allah and must be treated with dignity and respect. Burning it is considered a violation of that trust. (2) The established Sunnah: The Prophet (PBUH) instructed that the deceased be washed (ghusl), shrouded in white cloth (kafan), prayed over (janazah prayer), and buried in the earth. (3) The Prophet (PBUH) said: "Breaking the bone of a dead person is like breaking it while he is alive" (Abu Dawud, Ibn Majah) — showing the sanctity of the body even after death. (4) In Islamic burial: the body is placed directly on its right side, facing the Qibla, in a grave, without a coffin (unless required by local law). The grave is then filled with earth. (5) Cremation is the practice of Hinduism and some other traditions, not Islam. Even if the deceased requested cremation in their will, that request should not be followed — the Islamic burial takes precedence. (6) Organ donation does not conflict with burial — the body is still buried after organ removal. (7) If a Muslim dies in a non-Muslim country where cremation is common, the family must insist on burial. Most countries allow religious burial. (8) The only exception some scholars mention: if burial is impossible (e.g., at sea or in a mass casualty situation), but even then, burial at sea or in a grave-like structure is preferred over cremation. (9) The funeral should be done as soon as possible, ideally within 24 hours.',
    sources: [
      'Sunan Abi Dawud, Book of Funerals, Hadith 3208',
      'Sunan Ibn Majah, Book of Funerals',
      'Sahih al-Bukhari, Book of Funerals',
    ],
  },
  {
    patterns: [
      /what.*is.*hajj/i, /how.*to.*perform.*hajj/i, /what.*is.*umrah/i,
      /how.*to.*do.*umrah/i, /hajj.*steps/i, /umrah.*steps/i,
      /difference.*hajj.*umrah/i, /when.*is.*hajj/i,
    ],
    keywords: ['hajj', 'umrah', 'how to perform hajj', 'what is hajj', 'how to do umrah', 'what is umrah', 'hajj steps', 'umrah steps', 'difference hajj umrah'],
    answer: 'Hajj and Umrah are pilgrimages to the Kaaba in Mecca. Hajj is one of the Five Pillars and is obligatory once in a lifetime for those who are physically and financially able. Umrah is recommended but not obligatory. (1) Hajj occurs during specific days of the Islamic month of Dhul-Hijjah (the 12th month). Umrah can be performed any time of year. (2) Umrah steps (shorter): (a) Enter the state of Ihram (sacred state) at the miqat — for men, this means wearing two white unstitched cloths. (b) Make the intention for Umrah. (c) Perform Tawaf: circle the Kaaba 7 times counterclockwise. (d) Pray 2 rakats behind Maqam Ibrahim. (e) Drink Zamzam water. (f) Perform Sa\'i: walk/run between the hills of Safa and Marwa 7 times. (g) Men shave their heads (or trim); women cut a small portion of hair. (h) This completes Umrah — you exit Ihram. (3) Hajj steps (includes Umrah plus additional rites): (a) Enter Ihram on the 8th of Dhul-Hijjah. (b) Go to Mina — spend the day and night in prayer. (c) 9th of Dhul-Hijjah (Day of Arafah): Go to the plain of Arafah — stand in prayer and du\'a from afternoon until sunset. This is the most important day of Hajj — the Prophet (PBUH) said: "Hajj is Arafah." (d) After sunset, go to Muzdalifah — spend the night under the open sky, collect pebbles. (e) 10th of Dhul-Hijjah (Eid al-Adha): Return to Mina. Throw 7 pebbles at the largest pillar (Jamarat al-Aqaba). Sacrifice an animal (or have it done for you). Shave or trim hair. (f) Return to Mecca for Tawaf al-Ifadah (the main Tawaf). (g) Spend the 11th, 12th (and 13th) in Mina, throwing pebbles at all three Jamarat each day. (h) Perform the farewell Tawaf (Tawaf al-Wada) before leaving Mecca. (4) Ihram restrictions: no cutting hair/nails, no perfume, no hunting, no intimate relations, men cannot cover their head or wear stitched clothing, women cannot cover their face with niqab (per majority view). (5) The reward: The Prophet (PBUH) said: "Whoever performs Hajj for Allah\'s sake and does not engage in obscene speech or wicked acts, returns like the day his mother gave birth to him (sinless)" (Bukhari).',
    sources: [
      'Quran, Surah Al-Baqarah 2:196-203',
      'Sahih al-Bukhari, Book of Hajj',
      'Sahih Muslim, Book of Hajj, Hadith 2405 (Hajj is Arafah)',
    ],
  },
  {
    patterns: [
      /what.*is.*ramadan/i, /why.*do.*muslims.*fast.*ramadan/i,
      /when.*is.*ramadan/i, /tell.*me.*about.*ramadan/i, /what.*happens.*in.*ramadan/i,
    ],
    keywords: ['ramadan', 'what is ramadan', 'why fast ramadan', 'when is ramadan', 'about ramadan', 'what happens in ramadan', 'why muslims fast ramadan'],
    answer: 'Ramadan is the ninth month of the Islamic (lunar) calendar — the holiest month for Muslims. (1) What happens: Muslims fast from dawn (Fajr) to sunset (Maghrib) every day for the entire month — abstaining from food, drink, and intimate relations during daylight hours. (2) Why: The Quran says: "O you who believe, fasting has been prescribed for you as it was prescribed for those before you, that you may become righteous" (2:183). Ramadan is the month in which the Quran was first revealed to Prophet Muhammad (PBUH): "The month of Ramadan in which was revealed the Quran, a guidance for the people" (2:185). (3) When: Because the Islamic calendar is lunar (based on the moon), Ramadan shifts about 11 days earlier each year on the Gregorian calendar. It lasts 29 or 30 days, determined by the sighting of the new moon. (4) Special practices: (a) Tarawih: special night prayers in the mosque where the entire Quran is recited over the month. (b) Increased Quran recitation. (c) Increased charity (sadaqah). (d) Suhoor (pre-dawn meal) and Iftar (breaking the fast at sunset). (e) Itikaf (seclusion in the mosque, especially in the last 10 days). (5) Laylat al-Qadr (Night of Power): The night the Quran was first revealed, believed to be in the last 10 nights of Ramadan (most likely the 27th). The Quran says: "The Night of Power is better than a thousand months" (97:3). Praying on this night is equivalent to praying for 83 years. (6) Eid al-Fitr: The celebration at the end of Ramadan — a day of prayer, family, food, and joy. (7) Fasting is not just about food — it is about self-discipline, empathy for the poor, increased worship, and spiritual reflection. The Prophet (PBUH) said: "When Ramadan comes, the gates of Paradise are opened, the gates of Hell are closed, and the devils are chained" (Bukhari). (8) Exemptions: the sick, travelers, pregnant/nursing women, elderly, and children before puberty are not required to fast.',
    sources: [
      'Quran, Surah Al-Baqarah 2:183-185',
      'Sahih al-Bukhari, Book of Fasting, Hadith 1899',
      'Quran, Surah Al-Qadr 97:1-5',
    ],
  },
  {
    patterns: [
      /what.*is.*eid/i, /what.*is.*eid.*al.*fitr/i, /what.*is.*eid.*al.*adha/i,
      /difference.*eid.*fitr.*adha/i, /when.*is.*eid/i, /how.*muslims.*celebrate.*eid/i,
    ],
    keywords: ['eid', 'eid al fitr', 'eid al adha', 'what is eid', 'difference eid fitr adha', 'when is eid', 'celebrate eid', 'eid celebration'],
    answer: 'Eid means "festival" or "celebration" — Muslims have two major Eids: (1) Eid al-Fitr (Festival of Breaking the Fast): Celebrated on the 1st of Shawwal (the month after Ramadan). It marks the end of Ramadan fasting. Muslims: (a) pray the Eid prayer in congregation in the morning (usually at a mosque or open field), (b) pay Zakat al-Fitr (a small charity given to the poor before the Eid prayer so they can also celebrate), (c) wear their best clothes, (d) visit family and friends, (e) share special meals and sweets, (f) give gifts (especially to children). The Prophet (PBUH) said: "Let the people of every house eat and drink" (encouraging celebration). (2) Eid al-Adha (Festival of Sacrifice): Celebrated on the 10th of Dhul-Hijjah, during the days of Hajj. It commemorates the willingness of Prophet Ibrahim (AS) to sacrifice his son Ismail (AS) in obedience to Allah — Allah replaced the son with a ram. Muslims: (a) pray the Eid prayer, (b) sacrifice an animal (sheep, goat, cow, or camel) and distribute the meat — one third to family, one third to friends/relatives, one third to the poor, (c) this sacrifice (udhiya/qurbani) is a Sunnah for those who can afford it, (d) celebrate with family, food, and community. (3) Both Eids are joyous occasions — the Prophet (PBUH) said: "There are two Eids for every nation, and these are better than your two Eids" (meaning the two Islamic Eids replace pre-Islamic festivals). (4) Eid prayers: 2 rakats, performed in congregation, with extra takbirs. They are recommended (sunnah) but not obligatory. (5) The Takbir of Eid: "Allahu Akbar, Allahu Akbar, Allahu Akbar, La ilaha illallah, Allahu Akbar, Allahu Akbar, walillahil hamd."',
    sources: [
      'Sahih al-Bukhari, Book of Eids, Hadith 952',
      'Sahih Muslim, Book of Eids',
      'Quran, Surah Al-Kawthar 108:2 (sacrifice)',
    ],
  },
  {
    patterns: [
      /what.*is.*zakat/i, /who.*gets.*zakat/i, /zakat.*categories/i,
      /how.*much.*zakat.*to.*pay/i, /when.*pay.*zakat/i, /zakat.*nisaab/i,
    ],
    keywords: ['what is zakat', 'who gets zakat', 'zakat categories', 'how much zakat', 'when pay zakat', 'nisab zakat', 'zakat recipients', 'zakat eligible'],
    answer: 'Zakat is the obligatory annual charity — one of the Five Pillars of Islam. (1) What it is: Every Muslim who possesses wealth above the nisab (minimum threshold) must pay 2.5% of their accumulated wealth annually to specified categories of recipients. (2) Nisab: The minimum amount of wealth on which zakat is due. It is equivalent to 85 grams of gold or 595 grams of silver (scholars differ on which to use — many use silver as it benefits the poor more). If your savings (after deducting debts and basic needs) exceed the nisab for a full lunar year, you owe zakat. (3) What is zakatable: cash, gold, silver, business inventory, investments, agricultural produce, and livestock. Your primary residence and personal car are NOT zakatable. (4) How much: 2.5% of your zakatable wealth held for one lunar year. (5) Who receives zakat: The Quran specifies 8 categories (9:60): (a) the poor (who have little), (b) the needy (who have nothing), (c) those who collect zakat, (d) those whose hearts are to be reconciled (new Muslims or those inclined to Islam), (e) to free slaves/captives, (f) those in debt who cannot pay, (g) in the path of Allah (those fighting for the faith or doing da\'wah), (h) the wayfarer (traveler who has run out of money). (6) Who cannot receive zakat: your parents, grandparents, children, grandchildren, spouse (you are obligated to support them), and the wealthy. (7) Zakat vs Sadaqah: Zakat is obligatory; sadaqah is voluntary charity. (8) The reward: The Prophet (PBUH) said: "Whoever pays the zakat on his wealth, the evil of his wealth is removed" (Tabarani). (9) Not paying zakat is a major sin — the Quran warns: "Those who hoard gold and silver and spend it not in the path of Allah — give them tidings of a painful punishment" (9:34). (10) Calculate your zakat at IslamicRelief or NZF (National Zakat Foundation) websites. Consult a scholar for complex cases.',
    sources: [
      'Quran, Surah At-Tawbah 9:60 (8 categories)',
      'Quran, Surah At-Tawbah 9:34-35 (warning)',
      'Sahih al-Bukhari, Book of Zakat, Hadith 1403',
      'Sahih Muslim, Book of Zakat',
    ],
  },
  {
    patterns: [
      /is.*music.*in.*quran.*prohibited/i, /is.*drum.*circle.*haram/i,
      /is.*singing.*without.*instruments.*haram/i, /is.*acapella.*singing.*halal/i,
      /is.*humming.*haram/i, /is.*whistling.*haram/i, /is.*beatboxing.*haram/i,
    ],
    keywords: ['singing without instruments', 'acapella singing', 'humming', 'whistling', 'beatboxing', 'singing halal', 'vocal singing islam'],
    answer: 'The human voice (singing without instruments) is generally permissible in Islam, with conditions on content. (1) The majority of scholars hold that singing (without instruments) is permissible if the lyrics are not haram — i.e., not obscene, not promoting haram, and not encouraging sin. (2) The Prophet (PBUH) allowed singing at weddings and celebrations. He said: "The only thing that distinguishes the lawful from the unlawful in marriage is the beating of the daff and the voice (singing) at weddings" (Tirmidhi, Nasai). (3) Humming: Permissible if the tune is not associated with haram music or haram lyrics. (4) Whistling: Generally permissible, though some scholars consider it makruh (disliked) based on a verse (8:35) about the pagans\' whistling at the Kaaba — but the context was about their worship, not whistling in general. (5) Beatboxing: Scholars differ — some permit it as it is vocal percussion (not an instrument), while others say it mimics instruments and is therefore discouraged. The majority permit it if the content is halal. (6) Nasheeds (Islamic vocal songs): Permissible and encouraged when they contain good messages, praise of Allah, the Prophet, or moral teachings. Many nasheed artists perform without instruments. (7) The conditions for permissible singing: (a) the content is not obscene or haram, (b) it does not lead to haram (e.g., mixing, immorality), (c) it does not distract from religious obligations, (d) it is not in a context of free mixing that leads to temptation. (8) Women singing in front of non-mahram men: Some scholars discourage this as it may attract attention, while others permit it if the content is not provocative. (9) Follow a scholar you trust on specific cases.',
    sources: [
      'Jami at-Tirmidhi, Book of Marriage, Hadith 1088',
      'Sunan an-Nasa\'i, Book of Marriage',
      'Sahih al-Bukhari, Book of Eids (singing at Eid)',
    ],
  },
  {
    patterns: [
      /is.*tattoo.*removal.*haram/i, /how.*remove.*tattoo.*islam/i,
      /is.*laser.*tattoo.*removal.*haram/i, /what.*to.*do.*if.*i.*have.*tattoo/i,
      /can.*i.*pray.*with.*tattoo/i, /tattoo.*wudu/i, /does.*tattoo.*break.*wudu/i,
    ],
    keywords: ['tattoo removal', 'remove tattoo islam', 'laser tattoo removal', 'have tattoo', 'pray with tattoo', 'tattoo wudu', 'does tattoo break wudu'],
    answer: 'If you already have a tattoo, here is the Islamic guidance: (1) Getting a tattoo is haram, but having one from before Islam or from before you knew the ruling does not mean you are sinful. (2) Can you pray with a tattoo? Yes. The majority of scholars hold that a tattoo does NOT prevent wudu or salah — the tattoo is under the skin and does not form a barrier to water reaching the skin. You can perform wudu and pray normally. (3) Should you remove it? If removal is safe and affordable, it is recommended (mustahab) to remove it as a form of repentance. However, removal is NOT obligatory — if removal would cause harm, excessive cost, or health problems, you are not required to do it. (4) Laser tattoo removal: Permissible. It is a medical procedure that removes the tattoo without harming the body (when done professionally). (5) If you cannot remove it: Make sincere tawbah (repentance) for getting the tattoo, and do not get any more. Allah forgives past sins. (6) The Prophet (PBUH) cursed the one who does tattoos and the one who gets them (Bukhari), but this applies to the act of getting tattooed. Once it is done, the focus is on repentance and moving forward. (7) Covering the tattoo: If the tattoo is in a place that is normally visible (like the hand or arm), you should cover it during salah and when in public if it is in a place that would normally be covered by clothing. For men, the area between navel and knee must be covered. For women, the normal hijab requirements apply. (8) Do not let having a tattoo discourage you from practicing Islam — Allah accepts all repentance.',
    sources: [
      'Sahih al-Bukhari, Book of Dress, Hadith 5937 (curse on tattoos)',
      'Sahih Muslim, Book of Manners (wudu with tattoos)',
      'Contemporary fatwas on tattoo removal (IslamQA, Assim Al-Hakeem)',
    ],
  },
  {
    patterns: [
      /is.*chocolate.*with.*alcohol.*haram/i, /is.*vanilla.*extract.*haram/i,
      /is.*cooking.*wine.*haram/i, /does.*alcohol.*evaporate.*when.*cooking/i,
      /is.*alcohol.*in.*food.*haram/i, /food.*cooked.*with.*wine/i,
      /is.*rum.*in.*cake.*haram/i, /is.*alcohol.*flavoring.*haram/i,
    ],
    keywords: ['chocolate alcohol', 'vanilla extract', 'cooking wine', 'alcohol in food', 'food cooked with wine', 'rum in cake', 'alcohol flavoring', 'alcohol evaporate cooking'],
    answer: 'Food containing alcohol is haram, even if the alcohol is a small amount or used in cooking. (1) The majority of scholars hold that any food containing alcohol is haram, because the Prophet (PBUH) said: "Whatever intoxicates in large quantities, a small amount of it is haram" (Abu Dawud, Tirmidhi, Ahmad). (2) Cooking with wine: Even though alcohol evaporates during cooking, not all of it evaporates — studies show 5-40% remains depending on cooking time. The majority of scholars say food cooked with wine is haram. (3) Vanilla extract: Contains about 35% alcohol. The majority of scholars consider it haram to consume in food. Some scholars permit it if it is a very small amount used as flavoring and does not intoxicate, but the safer view is to avoid it. Halal vanilla extract (alcohol-free) or vanilla bean/paste are available alternatives. (4) Chocolate with alcohol filling: Clearly haram. Chocolate that uses alcohol as a solvent for flavoring: depends on the amount — if it is trace amounts that cannot intoxicate and are completely transformed, some scholars permit it; others do not. The safest is to avoid it. (5) Rum in cakes/desserts: Haram, as rum is an alcoholic beverage. (6) Industrial food processing: Some foods use alcohol as a carrier for flavors. If the alcohol is completely evaporated or transformed during processing, some scholars permit it. If in doubt, avoid it or look for halal-certified products. (7) Vinegar: Permitted — the Prophet (PBUH) said: "What an excellent condiment vinegar is" (Muslim). Vinegar is made from wine but is completely transformed and is not intoxicating. (8) Medicinal alcohol: If prescribed by a doctor and no alternative exists, it is permitted by necessity. (9) Practical guidance: read labels, look for "alcohol," "wine," "rum," "brandy," "vanilla extract" in ingredients. When in doubt, avoid it.',
    sources: [
      'Sunan Abi Dawud, Book of Drinks, Hadith 3681',
      'Jami at-Tirmidhi, Book of Drinks, Hadith 1865',
      'Sahih Muslim, Book of Drinks, Hadith 3773 (vinegar permitted)',
    ],
  },
  {
    patterns: [
      /is.*modesty.*only.*for.*women/i, /what.*is.*haya/i, /concept.*modesty.*islam/i,
      /is.*modesty.*in.*islam/i, /haya.*islam/i, /what.*does.*islam.*say.*about.*modesty/i,
    ],
    keywords: ['modesty', 'haya', 'modesty islam', 'concept of modesty', 'what is haya', 'modesty only women', 'modesty in islam'],
    answer: 'Modesty (haya) is a core Islamic value for both men and women — it is not just about clothing but about behavior, speech, and mindset. (1) The Prophet (PBUH) said: "Haya (modesty) is a branch of faith" (Bukhari and Muslim). And: "Every religion has a character, and the character of Islam is haya" (Ibn Majah). (2) Haya means: (a) bashfulness and self-respect, (b) avoiding what is shameful, (c) covering what should be covered, (d) lowering the gaze, (e) speaking with dignity, (f) not showing off. (3) For men: (a) Lower the gaze (Quran 24:30 — this verse to men comes before the verse to women). (b) Cover from navel to knee in front of non-mahrams. (c) Grow the beard. (d) Do not wear gold or silk. (e) Speak and act with dignity. (f) Do not imitate women. (4) For women: (a) Lower the gaze (Quran 24:31). (b) Wear hijab — cover everything except face and hands (majority view) in front of non-mahram men. (c) Do not display adornment except to specified mahrams. (d) Speak without softening the voice in a seductive manner. (e) Do not imitate men. (5) Modesty in behavior: (a) Not entering the private space of others without permission (Quran 24:27-28). (b) Not spying or backbiting. (c) Walking and speaking with dignity. (d) Not being alone with a non-mahram. (6) Modesty is internal before external: The Prophet (PBUH) said: "Haya does not bring anything except good" (Bukhari and Muslim). It starts in the heart — if you have haya in your heart, it shows in your actions. (7) Cultural modesty vs Islamic modesty: Islam defines specific requirements; cultures may add more, but the Islamic requirements are the minimum. (8) Both men and women are equally called to haya — it is not a burden on women only.',
    sources: [
      'Quran, Surah An-Nur 24:30-31 (modesty for men and women)',
      'Sahih al-Bukhari, Book of Faith, Hadith 9 (haya is a branch of faith)',
      'Sunan Ibn Majah, Book of Manners, Hadith 4181',
    ],
  },
  {
    patterns: [
      /is.*hitting.*wife.*allowed/i, /is.*domestic.*violence.*allowed.*islam/i,
      /does.*quran.*allow.*beating.*wife/i, /is.*4.34.*wife.*beating/i,
      /can.*husband.*beat.*wife.*islam/i, /is.*wife.*beating.*halal/i,
    ],
    keywords: ['hitting wife', 'wife beating', 'domestic violence islam', 'beat wife islam', 'husband beat wife', 'quran 4 34', '4:34 wife', 'wife beating allowed'],
    answer: 'Domestic violence, wife-beating, and physical abuse are strictly prohibited in Islam. This is a crucial topic often misunderstood due to a mistranslation/misinterpretation of Quran 4:34. (1) The verse (4:34) mentions "wadhribuhunna" in the context of a marital dispute resolution. Classical scholars interpreted this as a light tap (with a miswak/siwak — a small toothbrush stick) that leaves no mark, causes no pain, and is not on the face — as a last resort after counseling and separation in bed. It was meant as a symbolic gesture, NOT physical violence. (2) Contemporary scholars (including Shaykh Abdallah Adhami, Dr. Shabir Ally, and others) argue based on Arabic linguistics that "wadhribuhunna" in this context means "to separate from them" or "to leave them" — based on the multiple meanings of the root word "daraba" in Arabic (which can mean to strike, to travel, to separate, to set an example). (3) The Prophet (PBUH) NEVER hit any of his wives. He said: "The best of you are those who are best to their wives" (Tirmidhi). He said: "I am the best among you in treating my family" (Tirmidhi). (4) His final sermon: "O people, I enjoin good treatment of women" (Bukhari, Muslim). (5) Aisha (RA) said: "The Prophet never hit anything with his hand, not a woman, not a servant, except in battle" (Muslim). (6) Islamic law prohibits: any physical harm, injury, or abuse. If a husband beats his wife, she has the right to seek divorce (khul\') and the authorities should punish him. (7) In many Muslim-majority countries, domestic violence is a crime punishable by law. (8) If you are experiencing domestic violence: (a) you are not at fault, (b) Islam gives you the right to seek help and divorce, (c) contact a domestic violence hotline, your local imam, or the police. In the UK: 0808 2000 247. In the US: 1-800-799-7233. (9) Cultural practices of wife-beating are NOT Islamic — they are cultural and contrary to the Prophet\'s example. No one should use 4:34 to justify violence.',
    sources: [
      'Quran, Surah An-Nisa 4:34-35 (with scholarly interpretation)',
      'Jami at-Tirmidhi, Book of Manners, Hadith 3895 (best to wives)',
      'Sahih Muslim, Book of Virtues (Prophet never hit anyone)',
      'Sahih al-Bukhari, Book of Marriage (final sermon on women)',
    ],
  },
  {
    patterns: [
      /what.*is.*haram.*food/i, /what.*can.*muslim.*not.*eat/i,
      /list.*of.*haram.*food/i, /what.*food.*is.*forbidden.*islam/i,
      /what.*is.*halal.*food/i, /halal.*vs.*haram.*food/i,
    ],
    keywords: ['haram food', 'halal food', 'what can muslim not eat', 'forbidden food islam', 'list of haram food', 'what is halal food', 'halal vs haram food'],
    answer: 'In Islam, food is divided into halal (permissible) and haram (forbidden). (1) Haram foods: (a) Pork and all pork products (bacon, ham, lard, gelatin from pork) — "Forbidden to you are dead meat, blood, the flesh of swine..." (Quran 5:3). (b) Animals not slaughtered in the Islamic method (zabihah) — the animal must be alive and healthy, slaughtered by a Muslim (or Person of the Book) with the name of Allah mentioned ("Bismillah, Allahu Akbar"), with a sharp blade that cuts the throat, windpipe, and blood vessels, allowing the blood to drain. (c) Blood (consumed as food). (d) Animals that die of natural causes, disease, or being strangled/killed by other animals. (e) Animals slaughtered in the name of other than Allah. (f) Intoxicants: alcohol, wine, beer, spirits. (g) Carnivorous animals (lions, dogs, cats, etc.) and birds of prey (eagles, hawks) — according to the majority. (h) Reptiles, insects (except locusts, which are halal), and rodents — according to the majority. (2) Halal foods: (a) All plant-based foods (fruits, vegetables, grains, nuts, seeds). (b) All seafood (according to Shafi\'i/Maliki/Hanbali; Hanafis restrict to scaled fish). (c) Meat from halal animals (cow, sheep, goat, chicken, camel) slaughtered by the Islamic method. (d) Food from People of the Book (Jews and Christians) — their meat is permissible (Quran 5:5), though some scholars require it to meet Islamic slaughter standards. Kosher meat is generally accepted as halal. (e) Milk and dairy products (from halal animals). (f) Eggs from halal birds. (g) Honey. (3) Controversial/depends: (a) Gelatin (see separate entry), (b) vanilla extract (contains alcohol), (c) cheese with animal rennet (some scholars permit if the animal was halal-slaughtered, others differ). (4) If you are unsure whether food is halal: the default is that it is permissible if you don\'t know it is haram, but it is better to verify when possible. Look for halal certification labels.',
    sources: [
      'Quran, Surah Al-Ma\'idah 5:3-5 (forbidden and permitted foods)',
      'Quran, Surah Al-Baqarah 2:172-173',
      'Sahih al-Bukhari, Book of Slaughter',
    ],
  },
  {
    patterns: [
      /is.*swearing.*oath.*by.*quran.*haram/i, /is.*swearing.*by.*other.*than.*allah.*haram/i,
      /is.*taking.*an.*oath.*islam/i, /can.*muslim.*swear.*on.*quran/i,
      /swearing.*by.*prophet/i, /swearing.*by.*mother.*islam/i,
    ],
    keywords: ['swearing oath', 'swear by quran', 'swear by other than allah', 'take an oath islam', 'swear on quran', 'swear by prophet', 'swear by mother'],
    answer: 'In Islam, swearing an oath should only be done by Allah — swearing by anything other than Allah is prohibited. (1) The Prophet (PBUH) said: "Whoever swears by other than Allah has committed shirk" (Tirmidhi, Abu Dawud). And: "Whoever swears, let him swear by Allah or remain silent" (Bukhari). (2) Swearing by the Quran: The Quran is the word of Allah, so swearing by the Quran is considered swearing by Allah — this is permissible. (3) Swearing by the Prophet, by one\'s mother, by the Kaaba, by one\'s honor, or by anything other than Allah is not permitted — the Prophet (PBUH) explicitly forbade it. (4) If you say "I swear by my mother" or "I swear on my life" — this is prohibited. Say "I swear by Allah" instead. (5) Taking a legal oath (in court, on the Quran): Permissible — this is swearing by Allah to tell the truth. (6) False oaths: Making a false oath (swearing by Allah to something that is not true) is a major sin. The Prophet (PBUH) said: "Whoever swears by Allah and is lying, will be taken to Allah on the Day of Resurrection, and his face will be deformed" (Tabarani). (7) Frivolous swearing: The Quran says: "Do not make your oaths a means of deception" (16:94). Do not swear frequently or casually — only when necessary. (8) If you have sworn to do something and later realize it is wrong: The Prophet (PBUH) said: "If you take an oath to do something and then find something better, expiate your oath and do what is better" (Bukhari, Muslim). Expiation (kaffarah): feed 10 poor people, or clothe them, or free a slave, or fast 3 days if you cannot afford the above.',
    sources: [
      'Sahih al-Bukhari, Book of Oaths, Hadith 6104',
      'Jami at-Tirmidhi, Book of Oaths, Hadith 1534',
      'Quran, Surah An-Nahl 16:92-94',
    ],
  },
  {
    patterns: [
      /is.*wishing.*happy.*new.*year.*haram/i, /is.*happy.*new.*year.*haram/i,
      /can.*muslim.*say.*happy.*new.*year/i, /is.*saying.*happy.*new.*year.*allowed/i,
      /can.*muslim.*celebrate.*new.*year/i,
    ],
    keywords: ['happy new year', 'new year haram', 'wishing new year', 'celebrate new year', 'say happy new year', 'new year islam'],
    answer: 'Saying "Happy New Year" (the Gregorian new year on January 1) is a topic scholars differ on. (1) The general principle: Islam has its own calendar (the Hijri calendar, starting from the migration to Medina in 622 CE). The Islamic New Year (1st of Muharram) is a significant day. (2) Saying "Happy New Year" to non-Muslims: The majority of scholars permit this as a courtesy/greeting, not as a religious celebration. It is similar to saying "have a nice day" — it is a social pleasantry, not an act of worship. (3) Celebrating the Gregorian New Year as a religious event: Not permitted — Muslims have their own holidays (Eid al-Fitr, Eid al-Adha). The Prophet (PBUH) said: "Every nation has its festivals, and these are your festivals" (meaning the two Eids). (4) Attending New Year\'s parties: If the party involves haram (alcohol, free mixing, etc.), it should be avoided. If it is a family gathering with no haram, it is a matter of cultural practice that some scholars permit and others discourage. (5) The Islamic New Year (1st of Muharram): This is a meaningful day — it marks the beginning of the Islamic calendar. Muharram is one of the four sacred months. The 10th of Muharram (Ashura) is a day of fasting — the Prophet (PBUH) fasted on this day and encouraged others to do so, commemorating when Allah saved Musa (Moses) from Pharaoh. (6) Practical guidance: If a colleague or non-Muslim friend wishes you "Happy New Year," you can respond politely ("Thank you, same to you") without celebrating it as a religious event. (7) Some stricter scholars say to avoid all such greetings — follow the scholar you trust. The key is your intention: if it is courtesy, it is fine; if it is adopting their religion, it is not.',
    sources: [
      'Sahih al-Bukhari, Book of Eids, Hadith 952 (two Eids)',
      'Sahih Muslim, Book of Fasting (Ashura)',
      'Contemporary fatwas (IslamQA, Yusuf al-Qaradawi)',
    ],
  },
  {
    patterns: [
      /is.*joining.*prayer.*allowed.*without.*travel/i, /can.*i.*combine.*prayer.*at.*home/i,
      /is.*combining.*prayer.*permissible/i, /when.*can.*combine.*prayer/i,
      /jama.*prayer.*without.*reason/i, /combining.*prayer.*raining/i,
    ],
    keywords: ['combine prayer at home', 'combining prayer without travel', 'combine prayer permissible', 'when can combine prayer', 'jama prayer without reason', 'combining prayer rain'],
    answer: 'Combining prayers (Jam\' bayn as-salatayn) is permitted only in specific circumstances, not as a regular practice. (1) Travel: A traveler (on a journey of more than ~80km) may combine Dhuhr with Asr (at either Dhuhr or Asr time) and Maghrib with Isha (at either time). This is established Sunnah — the Prophet (PBUH) combined prayers while traveling (Muslim). (2) Rain/snow: Many scholars permit combining Maghrib and Isha in the mosque during heavy rain, snow, or mud that makes going to the mosque difficult. This is based on the practice of some companions. (3) Sickness: A sick person who finds it difficult to pray each prayer at its time may combine Dhuhr-Asr and Maghrib-Isha. (4) Fear/danger: In situations of fear (war, danger), combining is permitted (Quran 4:102-103). (5) At Arafah (during Hajj): Dhuhr and Asr are combined at the time of Dhuhr. At Muzdalifah: Maghrib and Isha are combined at Isha time. (6) NOT permitted: (a) Combining prayers out of laziness or convenience without a valid reason. (b) Combining Fajr with any other prayer (Fajr is never combined). (c) Combining all five prayers at one time. (7) The difference between combining and shortening: Combining (jam\') means praying two prayers at the time of one. Shortening (qasr) means praying a 4-rakat prayer as 2 rakats. Both apply to travelers. You can combine without shortening (e.g., a sick person combines but prays full rakats). (8) If you miss a prayer and want to combine it with the next: This is making up (qada), not combining (jam\'). You should pray the missed prayer first, then the current one. (9) If you struggle to pray on time regularly, focus on establishing each prayer at its proper time rather than combining.',
    sources: [
      'Sahih Muslim, Book of Prayer, Hadith 706 (combining while traveling)',
      'Quran, Surah An-Nisa 4:102-103 (prayer in fear)',
      'Sahih al-Bukhari, Book of Shortening Prayers',
    ],
  },
  {
    patterns: [
      /is.*drinking.*coffee.*haram/i, /is.*caffeine.*haram/i, /is.*energy.*drink.*haram/i,
      /is.*red.*bull.*haram/i, /is.*tea.*halal/i, /is.*coffee.*islam/i,
      /is.*monster.*energy.*haram/i,
    ],
    keywords: ['coffee', 'caffeine', 'energy drink', 'red bull', 'tea halal', 'coffee islam', 'monster energy', 'is caffeine haram'],
    answer: 'Coffee, tea, and caffeinated drinks are halal in Islam. (1) Caffeine is not an intoxicant — it is a mild stimulant that does not cloud the mind or cause loss of control. The Islamic prohibition on intoxicants (khamr) applies to substances that intoxicate (cause drunkenness, loss of mental faculties), not to mild stimulants like caffeine. (2) Coffee: Completely halal. Historically, some scholars debated coffee when it was first introduced (15th century), but the consensus is that it is permissible. (3) Tea: Halal. (4) Energy drinks (Red Bull, Monster, etc.): The caffeine content is halal. However, check the ingredients for alcohol (some energy drinks contain small amounts of alcohol as a solvent for flavors — check for halal certification). If the energy drink is alcohol-free, it is halal. (5) If caffeine affects you negatively (anxiety, insomnia, heart palpitations): It is better to reduce or avoid it, as Islam encourages taking care of one\'s health. The Prophet (PBUH) said: "There should be neither harming nor reciprocating harm" (Ibn Majah). (6) Excessive caffeine consumption that harms the body is discouraged — moderation is the Islamic principle. (7) Decaf coffee: Halal (check that the decaffeination process does not use alcohol). (8) The key principle: "Whatever intoxicates in large quantities, a small amount of it is haram" — caffeine does not intoxicate even in large quantities, so it does not fall under this ruling.',
    sources: [
      'Principle from Sunan Abi Dawud, Hadith 3681 (intoxicants ruling)',
      'Sahih al-Bukhari (general principle of permissibility)',
      'Contemporary fatwas on caffeine (majority permit)',
    ],
  },
  {
    patterns: [
      /is.*crypto.*staking.*haram/i, /is.*crypto.*mining.*halal/i,
      /is.*nft.*haram/i, /is.*crypto.*trading.*like.*gambling/i,
      /is.*crypto.*future.*haram/i, /is.*crypto.*leverage.*haram/i,
      /is.*defi.*haram/i,
    ],
    keywords: ['crypto staking', 'crypto mining', 'nft', 'crypto trading gambling', 'crypto futures', 'crypto leverage', 'defi', 'nft haram'],
    answer: 'The rulings on different crypto activities: (1) Buying and holding crypto (spot): Many contemporary scholars permit this as a form of trade, similar to buying commodities — buy at a low price, sell at a high price. This is permissible if the crypto project itself is not haram (e.g., a gambling platform token). (2) Crypto mining: Permissible — it is like extracting a resource (like mining gold). The effort and electricity used to validate transactions and earn coins is considered legitimate work. (3) Crypto staking: Scholars differ. Some permit it as a form of earning returns for providing a service (securing the network). Others consider it similar to riba (interest) because you lock your assets and earn a return. The safer view is to avoid it if you are unsure. (4) Crypto futures and leverage (margin trading): Haram — this involves riba (borrowing/lending with interest), gharar (excessive uncertainty), and often resembles gambling. You are trading with borrowed money and speculating on price movements. This is prohibited by the majority of scholars. (5) NFTs: Permissible if the content of the NFT is halal (not obscene images, not haram content). Buying and selling digital art is permissible. (6) DeFi (Decentralized Finance): Many DeFi protocols involve lending/borrowing with interest (riba), liquidity pools that may resemble riba, or high speculation. Scholars generally advise caution — each protocol must be evaluated individually. (7) Crypto as gambling: If you are trading crypto purely on speculation without understanding the project, treating it like a casino, this is closer to gambling (maysir) and is haram. Investing with research and understanding is different from gambling. (8) Practical guidance: (a) stick to spot buying and selling, (b) avoid futures, leverage, and margin, (c) research the project to ensure it is not haram, (d) treat it as an investment, not gambling, (e) consult a scholar knowledgeable about crypto. (9) This is a developing area of Islamic finance — fatwas may evolve.',
    sources: [
      'Quran, Surah Al-Baqarah 2:275-279 (riba prohibition)',
      'Quran, Surah Al-Ma\'idah 5:90-91 (gambling prohibition)',
      'Contemporary fatwas from Shariah advisory boards on crypto',
    ],
  },
  {
    patterns: [
      /is.*talking.*to.*parents.*about.*islam/i, /how.*to.*tell.*parents.*i.*reverted/i,
      /non.*muslim.*parents.*islam/i, /how.*deal.*with.*non.*muslim.*parents/i,
      /parents.*dont.*accept.*islam/i, /parents.*against.*islam/i,
    ],
    keywords: ['non muslim parents', 'tell parents reverted', 'parents dont accept islam', 'parents against islam', 'deal with non muslim parents', 'revert parents'],
    answer: 'Dealing with non-Muslim parents as a new Muslim requires wisdom, patience, and excellent character. (1) The Quran commands: "Your Lord has decreed that you worship none but Him, and that you be good to your parents. Whether one or both of them reach old age, do not say to them \'uff\' and do not scold them, but speak to them noble words" (17:23). This applies regardless of the parents\' faith. (2) You must maintain love, respect, and kindness toward your parents even if they are not Muslim. Converting to Islam does NOT mean cutting ties or being disrespectful. (3) The Prophet (PBUH) taught that a man came to him and asked permission to participate in jihad. The Prophet asked: "Are your parents alive?" He said yes. The Prophet said: "Then strive in their service" (Bukhari). (4) How to tell them: (a) Choose a calm time, not during an argument. (b) Frame it positively — "I have found peace and purpose in Islam," not "Your religion is wrong." (c) Be patient — they may need time to process. (d) Answer their questions gently — they may have misconceptions from the media. (e) Do not debate or argue — focus on your personal spiritual journey. (5) If they are upset: (a) Be extra kind — show them through your behavior that Islam has made you a better person. (b) Cook for them, help them, spend time with them. (c) The best da\'wah is your character. (d) Pray for them — make du\'a that Allah guides them. (6) You cannot force them to accept Islam — guidance comes from Allah. The Quran says: "There is no compulsion in religion" (2:256). (7) If they try to make you do something haram: You should politely decline, but with respect. "I love you, but I cannot do this because of my faith." (8) You do not need their permission to practice Islam, but you should try to avoid unnecessary conflict. (9) The Prophet\'s uncle Abu Talib died as a non-Muslim, yet the Prophet grieved deeply for him. This shows love for non-Muslim family is natural and right. (10) Make du\'a for them constantly — Allah may guide them through your prayers.',
    sources: [
      'Quran, Surah Al-Isra 17:23-24 (kindness to parents)',
      'Quran, Surah Luqman 31:14-15 (goodness to non-Muslim parents)',
      'Sahih al-Bukhari, Book of Jihad, Hadith 3004',
    ],
  },
  {
    patterns: [
      /is.*autopsy.*haram/i, /can.*muslim.*donate.*body.*science/i,
      /is.*organ.*donation.*after.*death.*halal/i, /is.*cremation.*allowed.*if.*asked/i,
      /respecting.*dead.*body.*islam/i, /post.*mortem.*islam/i,
    ],
    keywords: ['autopsy', 'post mortem', 'donate body science', 'respecting dead body', 'autopsy islam', 'post mortem islam', 'donate body'],
    answer: 'Autopsies, body donation, and treatment of the deceased body are governed by specific Islamic principles. (1) General principle: The deceased body must be treated with dignity and buried promptly. The Prophet (PBUH) said: "Hasten the funeral" (Bukhari). (2) Autopsy: (a) If required by law (e.g., in a suspicious death investigation): Permissible, as it serves justice. (b) For medical education/research: The majority of contemporary scholars permit it IF: the deceased consented during life (or family consents), it serves a genuine educational purpose, the body is treated respectfully, and it is buried afterward. (c) Unnecessary mutilation of the body is prohibited. (3) Body donation to science: Similar to autopsy — permissible with prior consent and for genuine medical education, as long as the body is eventually buried (not cremated). The principle of benefiting others and saving future lives applies. (4) Organ donation after death: Permitted by the majority of contemporary scholars (see separate entry on organ donation). (5) Delaying burial: Should be avoided. The body should be buried within 24 hours if possible. Delaying for autopsy or transportation is permissible if necessary. (6) Cremation: Strictly prohibited (see separate entry). Even if the deceased requested it, the Islamic burial takes precedence. (7) Embalming: Generally not recommended unless required by law (e.g., for transportation). It involves replacing blood with chemicals, which alters the body. If required by law, it is permitted out of necessity. (8) Viewing the body: Permissible — seeing the deceased, closing their eyes, and preparing them is part of the Sunnah. (9) The key principle: treat the body with the same dignity as a living person — "Breaking the bone of a dead person is like breaking it while alive" (Abu Dawud).',
    sources: [
      'Sahih al-Bukhari, Book of Funerals, Hadith 1240 (hasten funeral)',
      'Sunan Abi Dawud, Book of Funerals, Hadith 3208 (dignity of body)',
      'Resolutions of the Islamic Fiqh Academy on autopsy and organ donation',
    ],
  },
  {
    patterns: [
      /is.*keeping.*beard.*sunnah.*or.*fard/i, /is.*beard.*mandatory.*all.*schools/i,
      /how.*long.*beard.*islam/i, /is.*trimming.*beard.*allowed/i,
      /beard.*fist.*length/i, /is.*clean.*shaven.*haram/i, /beard.*muslim.*men/i,
    ],
    keywords: ['beard mandatory', 'beard fard or sunnah', 'how long beard', 'trimming beard allowed', 'beard fist length', 'clean shaven haram', 'beard muslim men', 'beard all schools'],
    answer: 'The beard is a significant topic in Islamic practice, and scholars differ on its obligation. (1) The Prophet (PBUH) said: "Trim the moustache and let the beard grow" (Bukhari). And: "Be different from the polytheists: trim the moustache and grow the beard" (Bukhari, Muslim). (2) The majority of scholars (all four schools — Hanafi, Maliki, Shafi\'i, Hanbali) consider growing the beard to be obligatory (wajib or fard) based on the imperative form of the Prophet\'s command. (3) How long: The majority hold that the beard should be grown to a fist\'s length (you can trim what exceeds a fist\'s length when grasped). Some scholars say it should be left entirely without trimming. (4) Trimming: (a) Trimming what exceeds a fist\'s length: Permitted according to the majority (based on the practice of Ibn Umar). (b) Trimming the whole beard short (less than a fist): The majority consider this not permissible. Some contemporary scholars permit a short, neat beard if the intention is not to imitate non-Muslims. (5) Clean-shaven: The majority consider shaving the beard haram (prohibited) because it goes against the Prophet\'s command. Some contemporary scholars (a minority) consider it makruh (disliked) rather than haram. (6) Moustache: Should be trimmed short so it does not cover the upper lip. (7) If you cannot grow a beard (naturally): There is no sin — the ruling applies to those who can grow one. (8) If you shave due to pressure (work, family): Try to find a compromise. In most Western countries, employers cannot legally require you to shave your beard for religious reasons. (9) The beard is a visible sign of Muslim identity and following the Sunnah — but it should not become a source of arrogance. Good character matters more than appearance. (10) Follow the position of a scholar you trust.',
    sources: [
      'Sahih al-Bukhari, Book of Dress, Hadith 5892',
      'Sahih Muslim, Book of Purification, Hadith 259',
      'Sunan an-Nasa\'i, Book of Adornment',
    ],
  },
  {
    patterns: [
      /is.*lowering.*gaze.*both.*genders/i, /does.*quran.*tell.*men.*lower.*gaze/i,
      /is.*looking.*at.*attractive.*person.*haram/i, /is.*window.*shopping.*people.*haram/i,
      /accidentally.*looking.*haram/i, /is.*second.*look.*haram/i, /gaze.*men.*women/i,
    ],
    keywords: ['lowering gaze both', 'men lower gaze', 'looking attractive person', 'accidentally looking', 'second look haram', 'gaze men women', 'first look allowed'],
    answer: 'Lowering the gaze is commanded for BOTH men and women in the Quran. (1) The Quran addresses men first: "Tell the believing men to lower their gaze and guard their chastity. That is purer for them. Indeed, Allah is Aware of what they do" (24:30). Then women: "And tell the believing women to lower their gaze and guard their chastity..." (24:31). (2) The first (accidental) look is forgiven — the Prophet (PBUH) said to Ali (RA): "O Ali, do not follow the first look with a second, for the first is permitted but the second is not" (Abu Dawud, Tirmidhi). (3) What this means: If you accidentally see someone, that is not a sin. But deliberately looking again, or continuing to stare, is haram. (4) Why: The gaze is the gateway to the heart. Looking at attractive people (in person, on screens, on social media) plants seeds of desire that can lead to zina (fornication) of the eyes, then the heart, then physical acts. The Prophet (PBUH) said: "The eyes commit zina, and their zina is the gaze" (Bukhari). (5) Practical applications: (a) In public: be mindful of where you look — look down or away when an attractive non-mahram passes. (b) On social media: avoid scrolling through photos of attractive people, unfollow accounts that are a temptation. (c) At work/school: maintain professional eye contact without staring. (d) In conversation: look at the person respectfully but do not stare at their body. (6) For women: The command is the same — lower your gaze from non-mahram men. (7) Looking at a potential spouse for marriage: Permitted — the Prophet (PBUH) allowed a man to look at a woman he intended to marry (Tirmidhi). This is a necessary exception for compatibility assessment. (8) If you struggle with this: make du\'a for strength, increase your dhikr, avoid triggers (social media, certain places), and get married if you can. (9) This is a lifelong struggle — do not despair, keep trying and seeking Allah\'s help.',
    sources: [
      'Quran, Surah An-Nur 24:30-31',
      'Sunan Abi Dawud, Book of Marriage, Hadith 2144',
      'Sahih al-Bukhari, Book of Dress, Hadith 5887',
    ],
  },
  {
    patterns: [
      /is.*dreaming.*about.*prophet.*real/i, /did.*prophet.*say.*dream/i,
      /can.*prophet.*appear.*in.*dream/i, /dream.*prophet.*white.*hair/i,
      /is.*seeing.*prophet.*in.*dream.*true/i,
    ],
    keywords: ['dream prophet', 'seeing prophet in dream', 'prophet in dream real', 'dream about prophet muhammad', 'prophet appear in dream'],
    answer: 'Seeing the Prophet Muhammad (PBUH) in a dream is considered a true vision, according to authentic hadith. (1) The Prophet (PBUH) said: "Whoever sees me in a dream will see me in reality, for Satan cannot imitate me" (Bukhari). Another version: "Whoever sees me in a dream has truly seen me, for Satan cannot appear in my form" (Muslim). (2) This means: if you genuinely see the Prophet (PBUH) in a dream with his known physical appearance, it is a true vision from Allah. Satan cannot take his form. (3) The Prophet\'s physical appearance: He was of medium height, fair-skinned with a reddish complexion, had black hair (later with some white hairs), a full beard, large dark eyes, and a beautiful face. He had a seal of prophethood between his shoulders. If the person you saw matches this, scholars say it is likely a true vision. (4) However, scholars caution: (a) Not every dream of "the Prophet" is genuine — if the figure does something contrary to Islam, it is not truly the Prophet. (b) Dreams are personal — they are not a source of new rulings or legislation. (c) Do not build religious beliefs on dreams — the religion is complete. (5) Other good dreams: The Prophet (PBUH) said: "A good dream is from Allah, and a bad dream is from Satan. If anyone sees a dream that he dislikes, let him seek refuge in Allah from Satan, spit (lightly) to his left three times, and not tell anyone about it" (Bukhari). (6) Good dreams: thank Allah and share them only with trusted loved ones. Bad dreams: seek refuge in Allah, spit left, do not share, and they will not harm you. (7) Dreaming of deceased loved ones: These may be true visions or just the mind processing grief. Make du\'a for the deceased regardless. (8) If you believe you saw the Prophet (PBUH): thank Allah, reflect on any message, and continue following the Sunnah. Do not let it make you arrogant.',
    sources: [
      'Sahih al-Bukhari, Book of Interpretation of Dreams, Hadith 6592',
      'Sahih Muslim, Book of the Characteristics of the End Times, Hadith 2266',
      'Jami at-Tirmidhi, Book of Dreams',
    ],
  },
  {
    patterns: [
      /is.*music.*haram.*if.*it.*calms.*me/i, /is.*lofi.*haram/i,
      /is.*classical.*music.*haram/i, /is.*instrumental.*music.*haram/i,
      /is.*background.*music.*haram/i, /is.*relaxing.*music.*haram/i,
      /is.*study.*music.*haram/i,
    ],
    keywords: ['lofi', 'classical music', 'instrumental music', 'background music', 'relaxing music', 'study music', 'music calms me', 'instrumental haram'],
    answer: 'This builds on the general music ruling. The content of the music (lyrics) and the use of instruments are the two factors scholars consider. (1) Instrumental music (classical, lofi, background, relaxing): If you follow the majority view that musical instruments are haram, then instrumental music with instruments (piano, guitar, violin, etc.) would also be haram — even if there are no lyrics. The hadith in Bukhari mentions "musical instruments (ma\'azif)" generally, without restricting the ruling to songs with bad lyrics. (2) However, if you follow the minority scholarly opinion (Ibn Hazm, and some contemporary scholars) that instruments are permissible, then instrumental music is also permissible. (3) The argument for the majority view: Music often leads to heedlessness (ghaflah) — distraction from the remembrance of Allah. Even calming music replaces dhikr and reflection with worldly entertainment. (4) The argument for the minority view: Music is just sound — what makes it haram is the content (obscene lyrics) or the context (clubs, drinking, immorality), not the sound itself. Calming instrumental music for studying is not different from listening to birds or nature sounds. (5) Practical guidance: (a) If you follow the majority view: replace music with Quran recitation, nasheeds (vocals only), nature sounds, or white noise for studying/relaxing. (b) If you follow the minority view: listen to instrumental music that does not have haram associations and does not distract you from your religious obligations. (c) If music is a coping mechanism for anxiety/depression: seek professional help, use dhikr and Quran, and follow the scholar you trust. (6) The safest position: avoid instruments and listen to Quran, nasheeds, and nature sounds. (7) Do not judge others who follow a different scholarly opinion on this — it is a matter of valid scholarly difference.',
    sources: [
      'Sahih al-Bukhari, Book of Drinks, Hadith 5590 (instruments mentioned generally)',
      'Contemporary scholarly discussions (Shaykh al-Albani vs. Shaykh al-Ghazali)',
      'Ibn Hazm, Al-Muhalla (minority opinion permitting instruments)',
    ],
  },
  {
    patterns: [
      /is.*playing.*sports.*haram/i, /is.*gym.*halal/i, /is.*bodybuilding.*halal/i,
      /can.*muslim.*go.*gym/i, /is.*sports.*allowed.*islam/i, /is.*fitness.*halal/i,
      /is.*weightlifting.*halal/i, /is.*swimming.*halal/i,
    ],
    keywords: ['playing sports', 'gym halal', 'bodybuilding', 'go gym', 'sports allowed islam', 'fitness halal', 'weightlifting', 'swimming halal'],
    answer: 'Sports, exercise, and fitness are encouraged in Islam. (1) The Prophet (PBUH) said: "The strong believer is better and more beloved to Allah than the weak believer" (Muslim). He also said: "Your body has a right over you" (Bukhari). (2) Sports and exercise are permissible and encouraged — the Prophet (PBUH) wrestled, raced, and encouraged archery, horseback riding, and swimming. He said: "Teach your children swimming and archery" (Tabarani). (3) Gym and bodybuilding: Permissible — taking care of your physical health is part of Islam. (4) Conditions: (a) Your clothing must cover the awrah — for men, navel to knee; for women, the full hijab (though some scholars permit more relaxed dress in women-only gyms). (b) Do not display your body to non-mahrams — be mindful in mixed gyms. (c) Do not let exercise take time away from prayers and religious obligations. (d) Do not engage in sports that involve haram (e.g., betting on games). (e) Do not harm your body — exercise safely. (5) Mixed gyms: Scholars differ. Some say it is permissible to go to a mixed gym if you lower your gaze and dress modestly. Others prefer women-only or men-only facilities. Use your judgment and follow a scholar you trust. (6) Sports as a career: Permissible as long as the sport itself is halal, does not involve haram (gambling, excessive exposure), and does not interfere with your religious obligations. (7) Competitive sports: Permissible — the Prophet (PBUH) allowed races and competitions. (8) Martial arts: Permissible for self-defense and fitness, as long as the philosophy/rituals do not contradict Islamic beliefs. (9) Swimming: Permissible and encouraged. (10) The key: be healthy, strong, and modest — use your body for good.',
    sources: [
      'Sahih Muslim, Book of Piety, Hadith 2664 (strong believer)',
      'Sahih al-Bukhari, Book of Fasting, Hadith 1975 (body has rights)',
      'Musnad Al-Bazzar (teach swimming and archery)',
    ],
  },
  {
    patterns: [
      /is.*cursing.*other.*religion.*haram/i, /is.*insulting.*other.*religion.*haram/i,
      /can.*muslim.*insult.*other.*faiths/i, /is.*mocking.*other.*religion.*haram/i,
      /respecting.*other.*religions.*islam/i, /is.*islam.*tolerant.*other.*faiths/i,
    ],
    keywords: ['cursing other religion', 'insulting other religion', 'mocking other faiths', 'respecting other religions', 'islam tolerant other faiths', 'insult other religion'],
    answer: 'Insulting, mocking, or cursing other religions and their followers is prohibited in Islam. (1) The Quran explicitly commands: "And do not insult those they invoke other than Allah, lest they insult Allah in enmity out of ignorance" (6:108). This verse was revealed because Muslims were insulting the idols of the pagans, and Allah told them not to — because it would lead the pagans to insult Allah in retaliation. (2) The principle: Respect the beliefs of others so they do not disrespect Islam in response. (3) The Prophet (PBUH) never insulted other religions — he debated with respect, wisdom, and good character. When he met Christians (the delegation of Najran), he treated them with hospitality, allowed them to pray in his mosque, and debated with them respectfully. (4) The Quran says: "Invite to the way of your Lord with wisdom and good instruction, and argue with them in a way that is best" (16:125). (5) Differences with other religions should be discussed intellectually and respectfully, not through mockery or insults. (6) Modern context: (a) Mocking other religions on social media is haram. (b) Drawing offensive cartoons of any religious figure is haram. (c) Calling non-Muslims derogatory names (kafir as an insult) is not the Islamic way — kafir is a theological term, not a slur. (7) How to respond when Islam is insulted: (a) Respond with wisdom and calmness, not with more insults. (b) Correct misconceptions with facts and good character. (c) The Prophet (PBUH) endured insults and mockery for years and responded with patience and kindness. (d) Violence in response to insults is NOT the Islamic way — the Prophet (PBUH) never attacked those who insulted him. (8) The best da\'wah (invitation to Islam) is through your excellent character, not through arguing or insulting.',
    sources: [
      'Quran, Surah Al-An\'am 6:108 (do not insult other gods)',
      'Quran, Surah An-Nahl 16:125 (invite with wisdom)',
      'Sahih al-Bukhari, Book of Virtues (Prophet\'s treatment of Najran Christians)',
    ],
  },
  {
    patterns: [
      /is.*wishing.*happy.*easter.*haram/i, /is.*wishing.*happy.*diwali.*haram/i,
      /can.*muslim.*say.*happy.*diwali/i, /can.*muslim.*say.*happy.*easter/i,
      /is.*wishing.*other.*religious.*holidays.*haram/i,
    ],
    keywords: ['happy easter', 'happy diwali', 'wishing other religious holidays', 'say happy diwali', 'say happy easter', 'wishing other religions'],
    answer: 'Wishing non-Muslims well on their religious holidays is a topic scholars differ on, but the majority permit courteous greetings. (1) The general principle: You may show courtesy and kindness to non-Muslims without participating in their religious rituals. (2) Saying "Happy Diwali," "Happy Easter," "Happy Hanukkah": The majority of contemporary scholars (including Shaykh al-Qaradawi and many others) permit this as a social courtesy, similar to saying "have a nice day" — it is not an endorsement of their religion, just good manners. (3) The Quran says: "Allah does not forbid you from being righteous and just toward those who do not fight you over religion" (60:8). Being kind and courteous is encouraged. (4) What to avoid: (a) Participating in religious rituals (prayers, worship) of other faiths. (b) Adopting their religious symbols or practices as your own. (c) Celebrating their holidays as your own holidays (Muslims have Eid al-Fitr and Eid al-Adha). (5) The stricter view: Some scholars say you should not wish others on their religious holidays because it implies approval of their religion. This is a valid minority opinion — follow the scholar you trust. (6) Practical guidance: If a non-Muslim friend wishes you well on a holiday, respond politely ("Thank you, same to you and your family"). If you wish them first, keep it general ("Have a wonderful time with your family") rather than specifically religious ("May God bless your celebration of..."). (7) In the workplace: Wishing colleagues well on their holidays is good professional etiquette and reflects the good character Muslims should have. (8) The key is your intention: if you are being courteous, it is fine; if you are adopting their religion, it is not. (9) Muslims are encouraged to share their own joy (Eid) with non-Muslim friends — invite them to Eid celebrations, share food, and build bridges.',
    sources: [
      'Quran, Surah Al-Mumtahanah 60:8',
      'Contemporary fatwas (Yusuf al-Qaradawi, IslamQA)',
      'Sahih al-Bukhari (Prophet\'s courtesy to non-Muslims)',
    ],
  },
  {
    patterns: [
      /is.*greeting.*salaam.*to.*non.*muslim.*first/i, /who.*should.*say.*salaam.*first/i,
      /can.*muslim.*greet.*non.*muslim.*first/i, /is.*saying.*assalam.*to.*non.*muslim/i,
      /greeting.*non.*muslim.*first.*haram/i, /yusuf.*greeting.*non.*muslim/i,
    ],
    keywords: ['greeting salaam non muslim', 'who say salaam first', 'greet non muslim first', 'saying assalam to non muslim', 'greeting non muslim first'],
    answer: 'The ruling on greeting non-Muslims with "Assalamu alaykum" is nuanced. (1) The Prophet (PBUH) said: "Do not initiate the greeting of salam to the Jews and Christians" (Tirmidhi). This hadith is the basis for the ruling that Muslims should not initiate "Assalamu alaykum" to non-Muslims. (2) The reason: "Assalamu alaykum" means "peace be upon you" — it is a prayer for peace and is a distinctive Muslim greeting. Initiating it to non-Muslims was discouraged to maintain the distinctiveness of the Islamic greeting and because "salam" is one of Allah\'s names. (3) If a non-Muslim greets you with "Assalamu alaykum": The Prophet (PBUH) said: "If the People of the Book greet you with salam, say: \'Wa alaykum\' (and upon you)" (Bukhari, Muslim). This is a neutral response — you wish them well without invoking the full Islamic greeting. (4) How to greet non-Muslims: You can say "Hello," "Hi," "Good morning," "Good evening," "Peace" — these are all fine. You do not need to say "Assalamu alaykum." (5) If a non-Muslim says "Assalamu alaykum" to you: respond with "Wa alaykum" (and upon you) or "Wa alaykum as-salam" (and upon you be peace). Some scholars say to respond fully because returning a greeting is an obligation (Quran 4:86). (6) Contemporary context: Some scholars argue that in multicultural societies, the distinction is less important and Muslims can greet non-Muslims with salaam as a gesture of goodwill. The stricter scholars maintain the hadith should be followed. (7) The key: Be kind, courteous, and respectful to everyone regardless of faith. The restriction is specifically on the Islamic formula "Assalamu alaykum," not on being friendly. (8) The Prophet (PBUH) was kind to his non-Muslim neighbors and treated them with excellent character. (9) Follow the scholar you trust on this matter.',
    sources: [
      'Sahih al-Bukhari, Book of Asking Permission, Hadith 6258',
      'Sahih Muslim, Book of Greetings, Hadith 2163',
      'Jami at-Tirmidhi, Book of Manners, Hadith 2597',
      'Quran, Surah An-Nisa 4:86 (returning greetings)',
    ],
  },
  {
    patterns: [
      /is.*freemason.*compatible.*islam/i, /is.*freemasonry.*haram/i,
      /can.*muslim.*be.*freemason/i, /is.*joining.*masonic.*lodge.*haram/i,
    ],
    keywords: ['freemason', 'freemasonry', 'masonic lodge', 'joining freemason', 'freemason haram', 'freemason islam'],
    answer: 'Joining Freemasonry is prohibited for Muslims according to the consensus of Islamic scholars and major fatwa councils. (1) The Islamic Fiqh Academy (Majma\' al-Fiqh al-Islami) and numerous scholars have issued rulings declaring Freemasonry incompatible with Islam. (2) Reasons: (a) Freemasonry is a secretive organization with hidden rituals and beliefs that are not disclosed until one advances through the degrees. Islam requires transparency in beliefs. (b) Freemasonry requires members to swear oaths of allegiance to the lodge and to protect fellow Freemasons — even above truth and justice. This conflicts with Islamic loyalty to Allah and justice. (c) Some Masonic rituals and symbols have roots in esoteric and mystical traditions that may involve elements contrary to tawheed (the oneness of Allah). (d) Freemasonry promotes a universalist religion that blends all faiths — this is incompatible with Islam, which holds that Islam is the final and complete truth. (e) The secrecy and hierarchical structure means a Muslim may unknowingly commit to beliefs or practices that contradict Islam. (3) If you have been invited to join: politely decline. (4) If you are already a member: scholars recommend leaving the organization and making tawbah. (5) This ruling applies to Freemasonry and similar secretive organizations. (6) Note: Much conspiracy theory surrounds Freemasonry — the Islamic ruling is based on the secrecy, oaths, and beliefs of the organization, not on conspiracy theories about global control. (7) Consult a scholar if you have specific questions about an organization you are considering joining.',
    sources: [
      'Resolution of the Islamic Fiqh Academy (Majma\' al-Fiqh al-Islami) on Freemasonry',
      'Fatwas from Al-Azhar and major scholars',
      'Quran, Surah Al-Ma\'idah 5:51 (loyalty to Allah)',
    ],
  },
  {
    patterns: [
      /is.*joining.*army.*haram/i, /can.*muslim.*join.*military/i,
      /is.*serving.*in.*non.*muslim.*army.*halal/i, /muslim.*soldier.*non.*muslim.*country/i,
      /is.*fighting.*for.*non.*muslim.*country.*haram/i,
    ],
    keywords: ['join army', 'join military', 'serving non muslim army', 'muslim soldier', 'non muslim country military', 'fighting for non muslim country'],
    answer: 'Muslims serving in the military of a non-Muslim country is a topic scholars have addressed with nuance. (1) The majority of contemporary scholars permit Muslims to serve in the military of the country they live in, with conditions: (a) The country is not at war with Muslims. If the country is fighting against Muslims (e.g., invading a Muslim country), it is not permissible to fight against your Muslim brothers and sisters. (b) You are not ordered to do anything haram — if ordered to fight against innocent civilians, you must refuse. (c) Your service is for defending the country, maintaining peace, or providing humanitarian aid. (2) The Quran says: "O you who believe, be persistently standing firm for Allah, witnesses in justice. And do not let the hatred of a people prevent you from being just. Be just — that is nearer to righteousness" (5:8). (3) Muslims have served honorably in the militaries of Britain, America, France, India, and many other countries — many Muslim soldiers have died serving their countries. (4) In the US and UK: there are Muslim military chaplains and Muslim service members. The military accommodates prayer times, halal food, and beard/hijab in many cases. (5) If the country fights a just war (defending against aggression, peacekeeping, humanitarian intervention): Permissible to serve. (6) If the country fights an unjust war (aggression, invading another country): It is not permissible to participate in the aggression, though some scholars say you can serve in non-combat roles (medical, logistics). (7) If you are deployed to a Muslim country: You should request non-combat roles if possible. Fighting against Muslims is a serious matter — consult a scholar. (8) Conscientious objection: Islam permits refusing to fight if the war is unjust. (9) Consult a knowledgeable scholar before enlisting if you have concerns.',
    sources: [
      'Quran, Surah Al-Ma\'idah 5:8 (justice)',
      'Quran, Surah Al-Baqarah 2:190 (fighting in self-defense)',
      'Contemporary fatwas on Muslims serving in Western militaries',
    ],
  },
  {
    patterns: [
      /is.*dream.*interpretation.*islam/i, /how.*to.*interpret.*dream.*islam/i,
      /is.*dream.*meaning.*true/i, /do.*dreams.*come.*true.*islam/i,
      /types.*of.*dreams.*islam/i,
    ],
    keywords: ['dream interpretation', 'interpret dream islam', 'dream meaning true', 'do dreams come true islam', 'types of dreams islam', 'dream meaning islam'],
    answer: 'Dreams in Islam are categorized into three types, as described by the Prophet (PBUH). (1) The Prophet (PBUH) said: "There are three types of dreams: a true dream from Allah, a dream from Satan to cause distress, and the subconscious reflection of what one thinks about during the day" (Bukhari). (2) True dreams (ru\'ya sadiqa): These are from Allah and can be guidance, glad tidings, or warnings. The Prophet (PBUH) said: "True dreams are one of the forty-six parts of prophethood" (Bukhari). True dreams are clear, vivid, and memorable — they do not feel confused or random. (3) Dreams from Satan (hulm): These are designed to cause fear, sadness, or confusion. The Prophet (PBUH) said: "If anyone sees a dream that he dislikes, let him seek refuge in Allah from Satan, spit (lightly) to his left three times, and not tell anyone about it — it will not harm him" (Bukhari). (4) Subconscious dreams: Dreams that reflect your daily thoughts, worries, or experiences. These have no special meaning. (5) Dream interpretation: The Prophet (PBUH) interpreted dreams for his companions, and some companions (like Ibn Sirin) became known for dream interpretation. However: (a) Dream interpretation is not an exact science — different scholars may interpret the same dream differently. (b) Only qualified, knowledgeable people should interpret dreams. (c) A dream should not be taken as a source of religious rulings or as divine law. (d) If you have a good dream: thank Allah and (optionally) share it only with trusted loved ones. (e) If you have a bad dream: seek refuge in Allah, spit left, do not share it, and it will not harm you. (6) The Prophet (PBUH) said: "At the end of time, the believer\'s dream will hardly ever fail" (Bukhari) — meaning true dreams will become more common near the end of times. (7) Do not make major life decisions based solely on dreams — consult Allah through istikhara and consult knowledgeable people.',
    sources: [
      'Sahih al-Bukhari, Book of Interpretation of Dreams, Hadith 6594',
      'Sahih Muslim, Book of the Characteristics of the End Times',
      'Sahih al-Bukhari, Book of Prayer, Hadith 99 (true dreams as part of prophethood)',
    ],
  },
  {
    patterns: [
      /is.*wudu.*valid.*without.*washing.*nose/i, /is.*washing.*nose.*fard.*wudu/i,
      /what.*are.*fard.*of.*wudu/i, /what.*are.*obligatory.*acts.*wudu/i,
      /what.*breaks.*wudu.*complete.*list/i, /nullifiers.*of.*wudu/i,
    ],
    keywords: ['fard of wudu', 'obligatory acts wudu', 'nullifiers of wudu', 'what breaks wudu complete', 'washing nose wudu', 'wudu without nose'],
    answer: 'The obligatory acts (fard) and nullifiers of wudu are essential to know for valid prayer. (1) The fard (obligatory) acts of wudu, based on Quran 5:6: (a) Washing the face once (some scholars say the face includes rinsing mouth and nose). (b) Washing the arms to the elbows. (c) Wiping the head. (d) Washing the feet to the ankles. (e) Sequence (tartib) — doing them in the order mentioned in the Quran (Hanafi school does not consider sequence obligatory; other schools do). (f) Continuity (muwalah) — washing without long pauses (some schools consider it obligatory). (2) Sunnah acts (recommended but not obligatory): washing hands first, rinsing mouth (madmada), rinsing nose (istinshaq), wiping ears, saying Bismillah, doing each action three times, starting with the right side. (3) What breaks wudu (nullifiers): (a) Passing gas (farting) from either private part. (b) Urination. (c) Defecation. (d) Passing anything from the private parts (like kidney stones). (e) Deep sleep — if you lose awareness of your surroundings (light sleep where you can hear is debated; the majority say any sleep breaks wudu). (f) Loss of consciousness (fainting, anesthesia). (g) Intoxication. (h) Touching the private parts with desire (majority view) — touching without desire is debated. (i) Touching a non-mahram with desire (some scholars; debated). (j) Eating camel meat (majority view, based on a hadith in Muslim). (4) What does NOT break wudu: (a) Bleeding (majority view — some Shafi\'i scholars differ). (b) Vomiting (majority view). (c) Laughing during prayer (Hanafi view says it breaks wudu; majority of other schools say it does not). (d) Touching the Quran. (e) Touching a non-mahram without desire (majority view). (f) Being in the same room as someone in janabah. (5) If in doubt: The Prophet (PBUH) said: "Do not leave [prayer] until you hear a sound or smell an odor" (Bukhari). If you are not sure whether you passed gas, do not act on the doubt — assume wudu is still valid. (6) Ghusl is required (wudu alone is not enough) after: sexual intercourse, ejaculation, menstruation, postpartum bleeding.',
    sources: [
      'Quran, Surah Al-Ma\'idah 5:6 (verse of wudu)',
      'Sahih al-Bukhari, Book of Ablution',
      'Sahih Muslim, Book of Purification',
      'Sahih Muslim, Book of Purification, Hadith 360 (camel meat)',
    ],
  },
  {
    patterns: [
      /is.*cat.*saliva.*najis/i, /is.*cat.*impure.*islam/i, /can.*cat.*pray.*in.*mosque/i,
      /is.*cat.*around.*prayer.*mat/i, /cat.*wudu.*saliva/i, /is.*cat.*clean.*shafi/i,
    ],
    keywords: ['cat saliva najis', 'cat impure islam', 'cat prayer mat', 'cat saliva wudu', 'cat clean shafi', 'cat around prayer'],
    answer: 'Cats are considered clean (tahir) animals in Islam — their saliva is not impure (najis). (1) The Prophet (PBUH) said about cats: "They are not impure. They are among those who go around among you" (Abu Dawud, Tirmidhi, Nasai). This means cats are considered clean animals that roam freely and do not make things impure. (2) The story of Abu Hurayrah (RA): His name means "father of the kitten" — he was given this name by the Prophet (PBUH) because he used to carry a kitten with him. This shows the Prophet\'s fondness for cats. (3) If a cat drinks from your water container: You can still use that water for wudu — the Prophet (PBUH) was asked about this and said: "They (cats) are pure. They are of those that frequent you" (various hadith in Abu Dawud, Tirmidhi, Nasai). (4) If a cat walks on your prayer mat: The mat is not made impure — you can pray on it. (5) If a cat licks your hand: You do not need to wash it before wudu (though washing hands is part of wudu anyway). (6) Cat saliva on clothes: Does not make the clothes impure for prayer. (7) Owning cats: Permissible and many Muslims keep cats. The Prophet (PBUH) allowed cats in homes. (8) Feeding stray cats: Encouraged — caring for animals is rewarded in Islam. A woman was forgiven for giving water to a thirsty dog (Bukhari). (9) The exception: If a cat eats something impure (like a mouse) and then its saliva gets on your clothes, some scholars say to wash the spot — but this is debated. The majority say cats are always pure. (10) Cats in the mosque: The Prophet (PBUH) allowed cats in the mosque — they are not impure. (11) This is different from dogs — dog saliva is considered impure (najis) by the majority of scholars, requiring washing the area seven times (one with earth).',
    sources: [
      'Sunan Abi Dawud, Book of Purification, Hadith 75',
      'Jami at-Tirmidhi, Book of Purification, Hadith 92',
      'Sunan an-Nasa\'i, Book of Purification, Hadith 318',
      'Sahih al-Bukhari, Book of Ablution (Abu Hurayrah and the kitten)',
    ],
  },
  {
    patterns: [
      /is.*knocking.*on.*wood.*haram/i, /is.*evil.*eye.*protection.*islam/i,
      /how.*protect.*from.*evil.*eye/i, /ruqyah.*islam/i, /how.*protect.*from.*sihr/i,
      /ayat.*ul.*kursi.*protection/i, /morning.*evening.*adhkar/i,
    ],
    keywords: ['knocking on wood', 'evil eye protection', 'how protect from evil eye', 'ruqyah', 'how protect from sihr', 'ayat ul kursi', 'morning adhkar', 'evening adhkar', 'protection from sihr'],
    answer: 'Protection from the evil eye (nazar), black magic (sihr), and jinn is through authentic Islamic means — not through superstitions. (1) Knocking on wood, crossing fingers, lucky charms: These are superstitions that are not from Islam. They can border on shirk (associating partners with Allah) if one believes the wood or charm itself has power. Protection comes only from Allah. (2) Authentic Islamic protections: (a) Morning and evening adhkar (remembrances): The Prophet (PBUH) taught specific du\'as to recite morning and evening for protection. These include: (i) Reciting Surah Al-Ikhlas, Al-Falaq, and An-Nas three times morning and evening (the three "Quls"). (ii) Ayat al-Kursi (Quran 2:255) — the Prophet (PBUH) said whoever recites it in the morning is protected until evening, and vice versa. (iii) "Bismillahil-ladhi la yadurru ma\'asmihi shay\'un fil-ardi wa la fis-samai, wa Huwas-Sami\'ul \'Alim" (In the name of Allah, with whose name nothing is harmed on earth or in heaven, and He is the All-Hearing, the All-Knowing) — three times morning and evening. (iv) Saying "Subhanallahi wa bihamdihi" 100 times morning and evening. (3) Ruqyah (spiritual healing): Permissible if it uses Quran and authentic du\'as. The Prophet (PBUH) practiced ruqyah and permitted it as long as it does not involve shirk. Reciting Surah Al-Fatiha, Ayat al-Kursi, and the three Quls over yourself or a sick person is established Sunnah. (4) Protection from sihr (black magic): (a) Regular prayer and Quran recitation. (b) Morning/evening adhkar. (c) The last two verses of Surah Al-Baqarah (2:285-286) — the Prophet (PBUH) said whoever recites them at night will be protected. (d) Surah Al-Baqarah in the home — the Prophet (PBUH) said: "Do not make your houses into graves, for Satan flees from a house in which Surah Al-Baqarah is recited" (Muslim). (5) Protection from jinn: same as above — regular prayer, Quran, adhkar. (6) If you suspect you are affected by sihr or the evil eye: (a) Increase your Quran recitation and du\'a. (b) Visit a qualified raqi (someone who does authentic ruqyah). (c) Do NOT go to fortune-tellers, magicians, or "healers" who use non-Islamic methods — this is haram. (d) Continue your daily prayers and trust in Allah. (7) Allah is the ultimate protector — "And if Allah should touch you with adversity, there is no remover of it except Him" (Quran 6:17).',
    sources: [
      'Sahih al-Bukhari, Book of Prophetic Commentary (Ayat al-Kursi)',
      'Sahih al-Bukhari, Book of Invocations, Hadith 6610 (morning/evening du\'a)',
      'Sahih Muslim, Book of Musaqah, Hadith 1709 (Surah Al-Baqarah in the home)',
      'Sunan Abi Dawud, Book of Medicine, Hadith 3901 (ruqyah)',
    ],
  },
  {
    patterns: [
      /is.*joking.*haram/i, /is.*joking.*in.*islam/i, /is.*sarcasm.*haram/i,
      /can.*muslim.*joke/i, /is.*prank.*haram/i, /is.*lying.*in.*joke.*haram/i,
      /is.*laughing.*too.*much.*haram/i,
    ],
    keywords: ['joking haram', 'joking islam', 'sarcasm haram', 'can muslim joke', 'prank haram', 'lying in joke', 'laughing too much'],
    answer: 'Joking is permissible in Islam, but with guidelines. (1) The Prophet (PBUH) joked with his companions and was known for his gentle humor. He said: "I joke, but I only speak the truth" (Tirmidhi, Ahmad). (2) Guidelines for permissible joking: (a) The joke must be truthful — you cannot lie in a joke. The Prophet (PBUH) said: "Woe to the one who speaks lies to make people laugh. Woe to him, woe to him" (Abu Dawud, Tirmidhi). (b) The joke must not hurt or insult anyone — no mocking, no bullying, no making fun of someone\'s appearance, disability, or background. (c) The joke must not be about haram topics (sexual jokes, jokes about religion, jokes that mock Islamic practices). (d) The joke must not cause fear or distress — pranks that scare people or cause harm are not permissible. (e) Joking should be moderate — not so frequent that you are never serious. The Prophet (PBUH) said: "Do not laugh too much, for excessive laughter kills the heart" (Tirmidhi, Ibn Majah). (3) Sarcasm: Permissible if it does not hurt the person or mock them. If it is mean-spirited or degrading, it is haram. (4) Pranks: (a) Harmless pranks (like a funny surprise) are fine if they do not scare, harm, or humiliate. (b) Pranks that cause fear, injury, or public humiliation are haram. (c) Fake emergencies (like pretending someone died) are haram because they cause severe distress. (5) The Prophet\'s humor was gentle and made people happy — he once playfully told an old woman that no old women enter Paradise (meaning she would be young in Paradise) (Tirmidhi). His humor was always kind, never hurtful. (6) Laughter: Permissible and natural — the Quran describes believers as having "marks on their faces from the traces of prostration" and mentions that their reward is Paradise. Moderate laughter is fine; excessive laughter that makes you heedless is discouraged. (7) The key: be kind, be truthful, and do not hurt anyone — even in humor.',
    sources: [
      'Jami at-Tirmidhi, Book of Manners, Hadith 1956 (I joke but speak truth)',
      'Sunan Abi Dawud, Book of Manners, Hadith 4972 (woe to lying joker)',
      'Jami at-Tirmidhi, Book of Zuhd, Hadith 2305 (excessive laughter)',
    ],
  },
  {
    patterns: [
      /is.*calling.*parents.*by.*first.*name.*haram/i, /is.*disrespecting.*parents.*haram/i,
      /how.*to.*treat.*parents.*islam/i, /is.*cutting.*ties.*with.*parents.*haram/i,
      /is.*obeying.*parents.*in.*everything.*required/i, /rights.*of.*parents.*islam/i,
    ],
    keywords: ['disrespecting parents haram', 'how to treat parents islam', 'cutting ties with parents', 'obeying parents in everything', 'rights of parents', 'treating parents islam'],
    answer: 'Kindness to parents is one of the most emphasized obligations in Islam — second only to worship of Allah. (1) The Quran says: "Your Lord has decreed that you worship none but Him, and that you be good to your parents. Whether one or both of them reach old age while with you, do not say to them \'uff\' (a word of disrespect), do not scold them, and speak to them noble words. And lower to them the wing of humility out of mercy, and say: My Lord, have mercy on them as they raised me when I was small" (17:23-24). (2) Good treatment includes: (a) Speaking respectfully — not raising your voice, not using harsh words. (b) Serving them — helping with their needs, especially in old age. (c) Spending on them if they are in need. (d) Visiting them regularly. (e) Making du\'a for them. (f) Not cutting ties. (3) Obedience to parents: You must obey your parents in all matters EXCEPT: (a) If they tell you to commit shirk (associate partners with Allah) — "But if they strive to make you associate with Me that of which you have no knowledge, do not obey them, but accompany them in the world with kindness" (31:15). (b) If they tell you to commit a sin (haram) — there is no obedience to creation in disobedience to the Creator. (c) If they interfere in your marriage choice — you should respect their advice but are not required to marry someone you do not want. (4) Cutting ties (silat al-rahm): Severing family ties is a major sin. The Prophet (PBUH) said: "The one who severs ties of kinship will not enter Paradise" (Bukhari, Muslim). (5) Even if your parents are non-Muslim: You must treat them with kindness (see separate entry on non-Muslim parents). (6) Calling parents by first name: Discouraged — use respectful titles (Mother, Father, or their respected names). (7) If your parents are abusive: This is a complex situation. You should seek help from a trusted imam or counselor. Islam does not require you to endure abuse, but it does require you to maintain some level of connection and not be the one to sever ties. Distance may be necessary for your safety, but maintain what connection you safely can. (8) After they pass away: Make du\'a for them, give charity on their behalf, fulfill their promises, and maintain ties with their friends and relatives.',
    sources: [
      'Quran, Surah Al-Isra 17:23-24 (kindness to parents)',
      'Quran, Surah Luqman 31:14-15 (if they urge shirk)',
      'Sahih al-Bukhari, Book of Manners, Hadith 5985 (severing ties)',
      'Sahih Muslim, Book of Piety, Hadith 2553 (not entering Paradise)',
    ],
  },
  {
    patterns: [
      /is.*living.*in.*non.*muslim.*country.*haram/i, /is.*dar.*al.*kufr.*haram/i,
      /can.*muslim.*live.*in.*west/i, /is.*moving.*to.*western.*country.*haram/i,
      /is.*living.*in.*america.*haram/i, /is.*living.*in.*uk.*haram/i,
    ],
    keywords: ['living in non muslim country', 'living in west haram', 'moving to western country', 'dar al-kufr', 'living in america haram', 'living in uk haram', 'muslim living in west'],
    answer: 'Living in a non-Muslim country is permissible according to the majority of contemporary scholars, with conditions. (1) The historical debate: Classical scholars discussed "Dar al-Islam" (land of Islam) vs "Dar al-Kufr" (land of disbelief). Some classical scholars discouraged living in Dar al-Kufr unless there was a valid reason (da\'wah, trade, seeking knowledge, fear of persecution). (2) Contemporary scholars (including Shaykh al-Qaradawi, Al-Azhar, and many others) hold that living in non-Muslim countries is permissible if: (a) You can practice your religion freely (pray, fast, give zakat, wear hijab, eat halal). (b) You are not persecuted for your faith. (c) You fulfill your religious obligations. (d) You raise your children as Muslims. (3) Reasons that make living in the West permissible: (a) Freedom to practice Islam — many Western countries protect religious freedom. (b) Da\'wah — Muslims in the West are ambassadors of Islam. The Prophet (PBUH) sent companions to Christian lands (like the migration to Abyssinia). (c) Economic opportunity, education, and seeking a better life — these are valid reasons. (d) Some Muslims were born in the West and it is their homeland. (4) Conditions for Muslims living in the West: (a) Maintain your Islamic identity — pray, fast, give zakat, read Quran. (b) Raise your children as Muslims — Islamic education, mosque attendance, Muslim community. (c) Obey the laws of the land as long as they do not contradict Islam. The Prophet (PBUH) said: "There is no obedience in disobedience to Allah" — you obey the country\'s laws unless they force you to commit haram. (d) Be a good citizen — contribute to society, help neighbors, be honest in work. (e) Avoid assimilating into haram aspects of the culture. (5) If you cannot practice Islam freely or face persecution: Hijrah (migration) to a Muslim country may be necessary. But for most Muslims in the West, religious freedom is protected. (6) The Prophet (PBUH) allowed Muslims to live in Abyssinia (a Christian kingdom) because they could practice their faith there. (7) The Muslim community in the West is a form of ongoing da\'wah — your good character, honesty, and practice of Islam is the best invitation to the faith.',
    sources: [
      'Sahih al-Bukhari, Book of Prayer (migration to Abyssinia)',
      'Quran, Surah An-Nisa 4:97-100 (migration discussion)',
      'Contemporary fatwas (Al-Azhar, Qaradawi, European Council for Fatwa and Research)',
    ],
  },
  {
    patterns: [
      /is.*swearing.*on.*children.*haram/i, /is.*beating.*children.*haram/i,
      /how.*to.*discipline.*children.*islam/i, /is.*hitting.*child.*allowed/i,
      /can.*parents.*hit.*children.*islam/i, /is.*child.*abuse.*haram/i,
    ],
    keywords: ['beating children haram', 'how discipline children islam', 'hitting child allowed', 'parents hit children islam', 'child abuse haram', 'disciplining children'],
    answer: 'Child abuse, beating children, and harsh physical punishment are prohibited in Islam. (1) The Prophet (PBUH) was extremely gentle with children. He said: "He is not of us who does not have mercy on young children" (Tirmidhi). He used to play with children, carry them, and kiss them. (2) Discipline in Islam: (a) The goal is teaching and guidance, not punishment. (b) The Prophet (PBUH) taught by example, gentle advice, and positive reinforcement. (c) Physical discipline, if ever used, must be: light (no marks, no pain, no injury), on a non-sensitive area (not the face), as an absolute last resort, and never in anger. (3) What is prohibited: (a) Beating, slapping, or hitting that causes pain, injury, or fear. (b) Hitting the face — the Prophet (PBUH) said: "If you fight, avoid striking the face" (Bukhari, Muslim). (c) Verbal abuse, name-calling, humiliation. (d) Denying food, sleep, or basic needs as punishment. (e) Excessive punishment for mistakes. (4) Islamic approach to discipline: (a) Teach by example — children learn more from what they see than what they are told. (b) Set clear expectations and consequences. (c) Use time-outs, loss of privileges, and conversation. (d) Teach them about Allah\'s love and mercy — not just fear. (e) The Prophet (PBUH) said: "When a person\'s child reaches the age of seven, teach them to pray" — through gentle encouragement, not force. (f) For older children: have conversations, explain the reasoning behind rules. (5) The Prophet (PBUH) said: "The best of you are those who are best to their families" (Tirmidhi). Your children are part of your family. (6) If you were beaten as a child: Islam does not justify what was done to you. Cultural practices of harsh discipline are NOT Islamic. (7) If you are struggling with parenting: seek parenting classes, counseling, and support. Islam encourages seeking knowledge and help. (8) In many countries, physical punishment of children is illegal. Follow the law and Islamic principles of mercy. (9) The Prophet (PBUH) said: "Your children are a trust from Allah" — treat them as a precious trust, not as property to punish.',
    sources: [
      'Jami at-Tirmidhi, Book of Manners, Hadith 1919 (mercy on children)',
      'Sahih al-Bukhari, Book of Dress, Hadith 2410 (avoid the face)',
      'Sahih al-Bukhari, Book of Prayer, Hadith 6025 (teach prayer at 7)',
    ],
  },
  {
    patterns: [
      /is.*asking.*too.*many.*questions.*haram/i, /is.*questioning.*religion.*haram/i,
      /can.*muslim.*question.*islam/i, /is.*doubting.*haram/i, /is.*doubt.*in.*islam/i,
      /is.*it.*ok.*to.*doubt/i, /how.*to.*deal.*with.*doubts.*islam/i,
    ],
    keywords: ['questioning religion haram', 'can muslim question islam', 'is doubting haram', 'doubt in islam', 'is it ok to doubt', 'how to deal with doubts', 'questioning islam'],
    answer: 'Having doubts and asking questions about Islam is normal, natural, and not inherently haram. Islam encourages seeking knowledge and understanding. (1) The Quran repeatedly says: "Will you not reason?" "Do you not think?" "Do they not reflect?" — Allah invites us to use our intellect and ask questions. (2) The Prophet (PBUH) welcomed questions from his companions and from non-Muslims. He answered patiently and with wisdom. (3) Doubts (shubuhat): Having a doubt cross your mind is not a sin — it is a waswas (whisper) that you should address, not suppress. The problem is only when you hold onto doubts and let them grow without seeking answers. (4) How to deal with doubts: (a) Seek knowledge — read, ask scholars, study. Ignorance breeds doubt; knowledge cures it. (b) Read the Quran with understanding — read a tafsir (explanation). (c) Read responses to common objections — there are excellent books and websites addressing criticisms of Islam. (d) Surround yourself with knowledgeable, practicing Muslims. (e) Make du\'a for guidance — "Rabbi zidni ilma" (My Lord, increase me in knowledge). (f) Do not let doubts fester in isolation — talk to someone you trust. (5) The types of questions: (a) Questions to understand ("Why do we pray 5 times?") — encouraged, seek the answer. (b) Questions born of genuine confusion ("How can God be just if there is suffering?") — valid, seek scholarly responses. (c) Questions that are really objections ("I don\'t think Islam is true") — engage intellectually, study the evidence for Islam. (6) The Prophet (PBUH) said: "The cure for ignorance is asking" (Abu Dawud, Ibn Majah). (7) If your doubts are overwhelming: (a) This is common — many Muslims go through periods of doubt. (b) Do not panic — take your time. (c) Seek out a qualified scholar or a Muslim counselor. (d) Read books like "MisGod\'ed" by Shabir Ally, "The Divine Reality" by Hamza Tzortzis, or responses by scholars. (e) Continue praying even if you feel disconnected — the connection will return. (8) Do not let anyone tell you that asking questions is haram — intellectual engagement strengthens faith. (9) The only caution: do not seek answers from anti-Islam sources expecting objective information — go to fair, qualified scholars.',
    sources: [
      'Quran, Surah Al-Baqarah 2:268 (Satan threatens you with poverty and orders you to immorality — includes doubts)',
      'Sunan Ibn Majah, Book of Purification, Hadith 336 (cure for ignorance is asking)',
      'Sahih al-Bukhari, Book of Knowledge (Prophet answered questions patiently)',
    ],
  },
  {
    patterns: [
      /is.*black.*color.*sunna/i, /is.*white.*color.*recommended.*islam/i,
      /what.*color.*clothes.*islam/i, /is.*wearing.*black.*haram/i,
      /is.*wearing.*red.*haram/i, /is.*wearing.*yellow.*haram/i, /favorite.*color.*prophet/i,
    ],
    keywords: ['black color sunna', 'white color recommended islam', 'what color clothes islam', 'wearing black haram', 'wearing red haram', 'prophet favorite color', 'color clothes islam'],
    answer: 'There is no general prohibition on wearing specific colors in Islam, with a few exceptions. (1) White: The most recommended color. The Prophet (PBUH) said: "Wear white clothes, for they are the best of your clothes, and shroud your dead in them" (Abu Dawud, Tirmidhi). The Prophet frequently wore white. (2) Black: Permissible. The Prophet (PBUH) wore black as well. Many scholars and imams wear black. There is no prohibition on wearing black for mourning either — Aisha (RA) wore black after the Prophet\'s death. (3) Green: Associated with Islam and considered a blessed color. The Prophet\'s favorite color is said to have been green. Green is associated with Paradise in the Quran. (4) Red: The Prophet (PBUH) wore a red-striped garment (a Yemeni burda). Pure red for men is debated — some scholars discourage it as it is associated with women\'s clothing in some cultures. The majority permit red-patterned clothing for men. (5) Yellow/Saffron: Permissible, though some scholars discourage saffron-dyed clothes for men as it is associated with certain religious traditions (Hindu/Buddhist monks). (6) What is prohibited for men: (a) Saffron-dyed clothes (some scholars) — to avoid imitating monks. (b) Pure silk and gold threads (men, not women). (7) What is prohibited for women: Nothing specific in terms of color — women can wear any color. (8) Dying clothes: Permissible with any halal dye. (9) The shroud (kafan): White cloth for both men and women. (10) The key principle: clothing should be modest, not imitating the opposite gender, and not imitating distinctive religious clothing of other faiths. Color choice is mostly a matter of personal preference and culture.',
    sources: [
      'Sunan Abi Dawud, Book of Dress, Hadith 4076 (wear white)',
      'Sahih al-Bukhari, Book of Dress (Prophet wore various colors)',
      'Jami at-Tirmidhi, Book of Dress',
    ],
  },
  {
    patterns: [
      /is.*listening.*to.*quran.*instead.*of.*reciting/i, /is.*listening.*quran.*reward/i,
      /reward.*for.*listening.*quran/i, /is.*playing.*quran.*while.*working.*halal/i,
      /can.*i.*listen.*to.*quran.*while.*sleeping/i, /quran.*while.*driving/i,
    ],
    keywords: ['listening to quran instead of reciting', 'listening quran reward', 'playing quran while working', 'quran while sleeping', 'quran while driving', 'listen quran halal'],
    answer: 'Listening to the Quran is highly rewarded and a valid form of engagement with Allah\'s word. (1) The Quran says: "When the Quran is recited, listen to it and pay attention, that you may receive mercy" (7:204). Listening attentively is commanded. (2) The Prophet (PBUH) said: "Whoever listens to a verse from the Book of Allah, for him is a light (reward) for each letter" (Tirmidhi, classed as hasan by some). (3) Listening vs reciting: Both have rewards. Reciting has the reward of each letter multiplied by ten (Tirmidhi). Listening also has great reward. If you cannot recite (due to not knowing Arabic, or being in a state of impurity), listening is an excellent alternative. (4) The best practice: Recite what you can AND listen to recitations. Both strengthen your connection with the Quran. (5) Listening while working/driving: Permissible, as long as you are not in a state that requires ghusl (major impurity) — some scholars say you should not have the Quran reciting if you are in janabah. For routine work and driving, it is fine and a great way to fill your time with remembrance. (6) Listening while sleeping: Permissible — many scholars encourage it as a form of protection and blessing. It is not the same as consciously listening, but it brings barakah to your home. (7) Playing Quran in the home: Recommended — the Prophet (PBUH) said: "Do not make your houses into graves" (Bukhari) — meaning let the Quran be recited in your home. Having Quran playing in the home keeps Satan away and brings tranquility. (8) The only caution: Do not let listening become a replacement for learning to recite — make an effort to learn to recite even a small portion. (9) If you do not know Arabic: Listening to the Quran in Arabic while reading the translation is an excellent way to connect. (10) Choose reciters whose recitation touches your heart — different reciters have different styles (Mishary Alafasy, Abdul Basit, Sudais, etc.).',
    sources: [
      'Quran, Surah Al-A\'raf 7:204 (listen to the Quran)',
      'Sahih al-Bukhari, Book of Prayer, Hadith 435 (don\'t make houses into graves)',
      'Jami at-Tirmidhi, Book of the Virtues of the Quran',
    ],
  },
  {
    patterns: [
      /what.*is.*barzakh/i, /what.*happens.*in.*the.*grave/i, /life.*in.*grave/i,
      /punishment.*of.*grave/i, /is.*grave.*punishment.*real/i,
      /what.*happens.*after.*burial/i, /soul.*in.*grave/i,
    ],
    keywords: ['barzakh', 'what happens in the grave', 'life in the grave', 'punishment of the grave', 'grave punishment', 'after burial', 'soul in grave', 'grave torment'],
    answer: 'Barzakh is the intermediate state between death and the Day of Resurrection — the life of the grave. (1) The Quran says: "Behind them is a barrier (barzakh) until the Day they are resurrected" (23:100). Barzakh means "barrier" — it is the state between this world and the Hereafter. (2) What happens in the grave: After burial, the soul is returned to the body in a different form, and two angels — Munkar and Nakir — question the deceased: "Who is your Lord? What is your religion? Who is your Prophet?" The believer answers: "My Lord is Allah, my religion is Islam, and my Prophet is Muhammad (PBUH)." The disbeliever or hypocrite cannot answer. (3) For the believer: The grave is expanded as far as the eye can see, filled with light, and a window to Paradise is opened so they can see their place. The Prophet (PBUH) said: "The grave is one of the gardens of Paradise, or one of the pits of the Hellfire" (Tirmidhi). (4) For the disbeliever or sinner: The grave is constricted, and they may experience punishment — the Prophet (PBUH) described the grave as pressing like the earth closing in. However, not all sinners are punished in the grave — Allah may forgive them. (5) Martyrs (shuhada): They are alive with Allah — their souls are in green birds flying freely in Paradise. (6) Good deeds that protect from grave punishment: The Prophet (PBUH) said that reciting Surah Al-Mulk (chapter 67) every night protects from the punishment of the grave (Tirmidhi). Regular prayer, charity, and good character also protect. (7) The questioning is real but the exact nature is known only to Allah — we believe in it as described without over-analyzing the mechanics. (8) Visiting graves: The Prophet (PBUH) said: "Visit the graves, for they remind you of the Hereafter" (Muslim). (9) The soul is aware in Barzakh — it can hear the footsteps of the living and receives the greeting (salam) of visitors. (10) Barzakh ends when the Trumpet is blown and all are resurrected for the Day of Judgment.',
    sources: [
      'Quran, Surah Al-Mu\'minun 23:100 (barzakh)',
      'Jami at-Tirmidhi, Book of Funerals, Hadith 2460 (grave as garden or pit)',
      'Sunan Abi Dawud, Book of Funerals (questioning by Munkar and Nakir)',
      'Jami at-Tirmidhi, Book of the Virtues of the Quran, Hadith 2891 (Surah Al-Mulk)',
    ],
  },
  {
    patterns: [
      /what.*is.*dajjal/i, /who.*is.*dajjal/i, /signs.*of.*day.*of.*judgment/i,
      /signs.*of.*the.*hour/i, /end.*of.*times.*islam/i, /is.*dajjal.*real/i,
      /when.*is.*day.*of.*judgment/i, /major.*signs.*qiyamah/i,
    ],
    keywords: ['dajjal', 'who is dajjal', 'what is dajjal', 'signs of day of judgment', 'signs of the hour', 'end of times islam', 'major signs qiyamah', 'when is day of judgment', 'signs of qiyamah'],
    answer: 'The Day of Judgment (Qiyamah) will be preceded by major and minor signs. (1) The exact timing is known only to Allah: "They ask you about the Hour: When will it be? Say: Knowledge of it rests with my Lord alone. None but He reveals its time" (Quran 7:187). (2) Minor signs (many have already appeared): the sending of the Prophet Muhammad (PBUH) as the final messenger, the spread of ignorance of Islam, the spread of music and musical instruments, the spread of immorality, the building of tall buildings, the decrease of knowledge and increase of ignorance, time passing more quickly, the increase of earthquakes, the spread of killing, people competing in building mosques, the acceptance of lying and rejection of truth. (3) Major signs (not yet appeared): (a) The emergence of Al-Mahdi — a righteous leader from the family of the Prophet who will rule the Muslims with justice before the end times. (b) The emergence of the Dajjal (the False Messiah / Antichrist) — a human being who will claim to be divine, perform miracles to deceive people, and spread corruption. The Prophet (PBUH) warned extensively about him. He will have one eye, the word "kafir" written between his eyes (readable by believers), and will be followed by the enemies of Islam. (c) The descent of Prophet Isa (Jesus, AS) from heaven — he will return to earth, kill the Dajjal, break the cross, abolish the jizya, and rule with the Sharia of Muhammad (PBUH). (d) The emergence of Ya\'juj and Ma\'juj (Gog and Magog) — a corrupt people who will spread destruction. (e) The Beast of the Earth. (f) The sun rising from the west. (g) The smoke. (h) Three landslides — in the East, the West, and the Arabian Peninsula. (4) The Prophet (PBUH) said: "The Hour will not come until ten signs appear: the smoke, the Dajjal, the Beast, the sun rising from the west, the descent of Isa son of Maryam, Ya\'juj and Ma\'juj, three landslides — east, west, and Arabian Peninsula — and a fire that drives people to their gathering place" (Muslim). (5) Protection from the Dajjal: Reciting the first 10 verses of Surah Al-Kahf (chapter 18) — the Prophet (PBUH) said: "Whoever memorizes the first ten verses of Surah Al-Kahf will be protected from the Dajjal" (Muslim). Also, reciting the last 10 verses. Seeking refuge in Allah from the Dajjal in every prayer (in the tashahhud): "Allahumma inni a\'udhu bika min \'adhabi jahannam, wa min \'adhabil-qabr, wa min fitnatil-mahya wal-mamat, wa min fitnatil-masihid-dajjal." (6) The descent of Jesus: Muslims believe Jesus (AS) was not crucified but was raised to Allah, and will return before the Day of Judgment. (7) Do not fear these signs — focus on your relationship with Allah and being prepared for death at any time. The Prophet (PBUH) said: "If the Hour comes and one of you has a small palm tree in his hand and can finish planting it before it comes, let him plant it" (Ahmad) — meaning keep doing good even in the last moments.',
    sources: [
      'Sahih Muslim, Book of Tribulations and Portents (major signs)',
      'Sahih al-Bukhari, Book of Afflictions (Dajjal)',
      'Quran, Surah Al-A\'raf 7:187 (timing of the Hour)',
      'Sahih Muslim, Book of Prayer, Hadith 809 (protection from Dajjal with Surah Al-Kahf)',
    ],
  },
  {
    patterns: [
      /who.*are.*the.*angels.*islam/i, /what.*are.*angels.*in.*islam/i,
      /who.*is.*gabriel.*islam/i, /who.*is.*jibreel/i, /types.*of.*angels/i,
      /what.*do.*angels.*do.*islam/i, /is.*angel.*real/i,
    ],
    keywords: ['angels islam', 'who are angels', 'what are angels islam', 'who is gabriel', 'jibreel', 'types of angels', 'what do angels do', 'angel real'],
    answer: 'Angels (Mala\'ika) are a fundamental article of faith in Islam — the second after belief in Allah. (1) Belief in angels is required: "The Messenger believes in what has been revealed to him from his Lord, as do the believers. All believe in Allah, His angels, His books, and His messengers" (Quran 2:285). (2) What angels are: They are created from light (nur), unlike humans (created from clay) and jinn (created from smokeless fire). They are not physical beings but can take physical form by Allah\'s permission. They do not have free will — they obey Allah completely and do not sin. (3) The Prophet (PBUH) said: "Angels were created from light, jinn were created from smokeless fire, and Adam was created from what has been described to you" (Muslim). (4) Major angels and their roles: (a) Jibreel (Gabriel) — the angel of revelation, who brought the Quran to the Prophet (PBUH) and brought revelations to all prophets. (b) Mikail (Michael) — responsible for rain, vegetation, and sustenance. (c) Israfil — will blow the Trumpet (Soor) to begin the Day of Judgment. (d) Azrail (Malak al-Mawt) — the angel of death who takes souls at their appointed time. (e) Munkar and Nakir — the two angels who question the deceased in the grave. (f) Ridwan — the gatekeeper of Paradise. (g) Malik — the gatekeeper of Hell. (h) Kiraman Katibeen — the two recording angels on each person\'s right and left shoulders, recording good and bad deeds. (i) Munkar and Nakir. (5) Guardian angels: Each person has angels who protect them by Allah\'s command. The Quran says: "For each one are successive [angels] before and behind him who protect him by the decree of Allah" (13:11). (6) Angels and humans: Angels attend gatherings of dhikr (remembrance of Allah), Friday prayers, and surround those who recite Quran. The Prophet (PBUH) said: "Allah has angels who roam the roads, seeking gatherings of dhikr" (Bukhari). (7) Angels do not intercede except by Allah\'s permission (Quran 53:26). (8) Unlike Christianity, Islam does not teach that angels ever rebelled or fell — all angels are obedient to Allah. The being who disobeyed (Iblis/Satan) was a jinn, not an angel (Quran 18:50). (9) We cannot see angels in their true form, but they see us and are always present.',
    sources: [
      'Quran, Surah Al-Baqarah 2:285 (belief in angels)',
      'Quran, Surah Al-Hijr 15:26-27 (creation of angels, jinn, humans)',
      'Sahih Muslim, Book of Piety, Hadith 2794 (angels created from light)',
      'Quran, Surah Ar-Ra\'d 13:11 (guardian angels)',
    ],
  },
  {
    patterns: [
      /what.*is.*sunnah/i, /what.*does.*sunnah.*mean/i, /types.*of.*sunnah/i,
      /difference.*quran.*sunnah/i, /is.*sunnah.*important/i, /why.*follow.*sunnah/i,
    ],
    keywords: ['what is sunnah', 'what does sunnah mean', 'types of sunnah', 'difference quran sunnah', 'is sunnah important', 'why follow sunnah'],
    answer: 'Sunnah means the way, practice, or tradition of Prophet Muhammad (PBUH) — his sayings, actions, approvals, and characteristics. It is the second source of Islamic law after the Quran. (1) The Quran says: "Whatever the Messenger gives you, take it; and whatever he forbids you, abstain from it" (59:7). And: "Say: If you love Allah, then follow me, Allah will love you" (3:31). (2) Types of Sunnah: (a) Sunnah Qawliyyah (verbal) — the sayings of the Prophet (PBUH), recorded as hadith. Example: "Actions are judged by intentions." (b) Sunnah Fi\'liyyah (action-based) — what the Prophet did, like how he prayed, fasted, or slept. (c) Sunnah Taqririyyah (approval-based) — actions the Prophet saw and did not object to, implying approval. (d) Sunnah Wasfiyyah (character-based) — his manners, ethics, and personality. (3) Categories by obligation: (a) Sunnah Mu\'akkadah (emphasized) — acts the Prophet rarely left, like the Sunnah prayers before Fajr. Leaving them is disliked but not sinful. (b) Sunnah Ghayr Mu\'akkadah (non-emphasized) — acts the Prophet did sometimes, like the 4 Sunnah rakats before Asr. (c) Sunnah \'Adiyyah (habitual) — the Prophet\'s personal preferences, like eating with the right hand. Following these brings reward but leaving them is not disliked. (4) Difference between Quran and Sunnah: The Quran is the literal word of Allah, revealed through Gabriel. The Sunnah is the Prophet\'s application, explanation, and supplementation of the Quran. The Quran gives principles; the Sunnah shows how to implement them. Example: The Quran says "establish prayer" but does not give details — the Sunnah shows how many rakats, what to recite, and how to perform each movement. (5) Importance: The Prophet (PBUH) said: "I have been given the Quran and something like it with it" (Abu Dawud) — meaning the Sunnah is also revelation and must be followed. (6) Hadith are the recorded reports of the Sunnah, graded by authenticity (Sahih, Hasan, Da\'if). (7) Following the Sunnah is an act of love for the Prophet (PBUH) and brings immense reward. (8) The Sunnah is preserved through the meticulous science of hadith authentication.',
    sources: [
      'Quran, Surah Al-Hashr 59:7 (follow the Messenger)',
      'Quran, Surah Al-Imran 3:31 (follow me, Allah will love you)',
      'Sunan Abi Dawud, Book of Sunnah, Hadith 4604 (Quran and something like it)',
      'Sahih al-Bukhari, Book of Faith (actions judged by intentions)',
    ],
  },
  {
    patterns: [
      /what.*is.*hadith/i, /what.*does.*hadith.*mean/i, /types.*of.*hadith/i,
      /how.*hadith.*authenticated/i, /sahih.*hadith.*meaning/i, /what.*is.*isnad/i,
      /how.*reliable.*hadith/i, /hadith.*science/i,
    ],
    keywords: ['what is hadith', 'what does hadith mean', 'types of hadith', 'how hadith authenticated', 'sahih hadith meaning', 'what is isnad', 'how reliable hadith', 'hadith science'],
    answer: 'Hadith (plural: Ahadith) is a report describing the words, actions, or approvals of Prophet Muhammad (PBUH). Hadith is the primary source of the Sunnah and the second source of Islamic law after the Quran. (1) Structure of a hadith: Every hadith has two parts: (a) Isnad (chain of narration) — the list of people who transmitted the hadith from the Prophet to the compiler. Example: "X told me, from Y, from Z, from the Prophet (PBUH)..." (b) Matn (text) — the actual content of the hadith. (2) Authentication of hadith: Scholars developed a rigorous science (Mustalah al-Hadith) to verify the authenticity of each hadith by examining: (a) The reliability of each narrator in the chain — their memory, character, and piety. (b) The continuity of the chain — whether each narrator actually met the one before them. (c) The text — whether it contradicts the Quran or stronger hadiths. (3) Categories of hadith by authenticity: (a) Sahih (authentic) — the highest grade. Narrators are reliable, chain is continuous, no irregularities. The major Sahih collections are Sahih al-Bukhari and Sahih Muslim. (b) Hasan (good) — reliable but with slightly weaker narrators than Sahih. Still usable for rulings. (c) Da\'if (weak) — has flaws in the chain (poor memory, missing narrator, etc.). Not used for rulings but may be used for encouragement/virtues. (d) Mawdu\' (fabricated) — a lie attributed to the Prophet. Rejected entirely. (4) Major hadith collections (Kutub al-Sittah — the Six Books): (a) Sahih al-Bukhari — the most authentic book after the Quran. (b) Sahih Muslim — second most authentic. (c) Sunan Abi Dawud. (d) Sunan at-Tirmidhi. (e) Sunan an-Nasa\'i. (f) Sunan Ibn Majah. (5) Additional important collections: Muwatta Imam Malik, Musnad Ahmad, Sunan ad-Darimi. (6) The Prophet (PBUH) warned: "Whoever tells a lie about me deliberately, let him take his seat in the Hellfire" (Bukhari). This is why authentication was taken so seriously. (7) Hadith vs Sunnah: Hadith is the recorded report; Sunnah is the actual practice. All hadiths contribute to our knowledge of the Sunnah, but not all hadiths are authentic. (8) The science of hadith is one of the most rigorous historical authentication systems ever developed — scholars traveled thousands of miles to verify a single narrator.',
    sources: [
      'Sahih al-Bukhari, Book of Knowledge, Hadith 107 (lying about the Prophet)',
      'Quran, Surah Al-Hashr 59:7 (authority of the Prophet)',
      'Classical works on hadith science (Muqaddimah Ibn al-Salah, Nukhbat al-Fikr)',
    ],
  },
  {
    patterns: [
      /who.*are.*the.*sahaba/i, /who.*are.*companions.*prophet/i, /what.*is.*sahaba/i,
      /best.*companions.*islam/i, /who.*are.*rightly.*guided.*caliphs/i,
      /abu.*bakr.*umar.*uthman.*ali/i, /who.*are.*the.*ten.*promised.*paradise/i,
    ],
    keywords: ['sahaba', 'companions prophet', 'what is sahaba', 'best companions islam', 'rightly guided caliphs', 'abu bakr umar uthman ali', 'ten promised paradise'],
    answer: 'The Sahaba (companions) are the men and women who saw the Prophet Muhammad (PBUH), believed in him, and died as Muslims. They are the generation who transmitted the Quran, the Sunnah, and the entire Islamic tradition to subsequent generations. (1) The Prophet (PBUH) said: "The best of people is my generation, then those who come after them, then those who come after them" (Bukhari, Muslim). (2) The Rightly Guided Caliphs (Al-Khulafa\' ar-Rashidun): The first four caliphs after the Prophet\'s death: (a) Abu Bakr as-Siddiq (RA) — ruled 632-634 CE. The Prophet\'s closest companion, first adult male to accept Islam. He compiled the Quran and fought the apostasy wars. (b) Umar ibn al-Khattab (RA) — ruled 634-644 CE. Known for his justice, he expanded the Islamic empire and established many administrative systems. (c) Uthman ibn Affan (RA) — ruled 644-656 CE. He standardized the Quran into one copy and distributed it. Known for his generosity. (d) Ali ibn Abi Talib (RA) — ruled 656-661 CE. The Prophet\'s cousin and son-in-law. Known for his knowledge and bravery. The Prophet (PBUH) said: "The caliphate after me will be thirty years, then it will become a kingdom" (Ahmad, Tirmidhi). (3) The Ten Promised Paradise (Al-\'Ashara al-Mubashshara): Ten companions the Prophet (PBUH) named during their lifetimes as being promised Paradise: Abu Bakr, Umar, Uthman, Ali, Talha, Zubayr, Abd ar-Rahman ibn Awf, Sa\'d ibn Abi Waqqas, Sa\'id ibn Zayd, and Abu Ubaydah ibn al-Jarrah (RA). (4) Other notable companions: (a) Khadijah (RA) — first Muslim and the Prophet\'s first wife. (b) Aisha (RA) — great scholar, narrated over 2,000 hadiths. (c) Fatima (RA) — the Prophet\'s daughter, "leader of the women of Paradise." (d) Bilal (RA) — the first muezzin (caller to prayer), a freed Abyssinian slave. (e) Salman al-Farsi (RA) — first Persian companion, suggested the trench in the Battle of Khandaq. (5) Respect for the Sahaba: Sunni Islam holds all Sahaba in high regard and prohibits cursing or disrespecting any of them. The Prophet (PBUH) said: "Do not curse my companions, for if one of you were to spend the weight of Mount Uhud in gold, it would not equal a handful or half a handful of what they spent" (Bukhari, Muslim). (6) The Sahaba were not perfect — they were human and made mistakes. But they were the best generation, chosen by Allah to be with His final Prophet. (7) Their disagreements were based on sincere interpretation, and Allah forgave them. (8) The number of Sahaba is estimated at over 100,000. (9) Loving the Sahaba is a sign of faith; cursing them is a sign of hypocrisy, according to the Prophet (PBUH).',
    sources: [
      'Sahih al-Bukhari, Book of Virtues of the Companions, Hadith 3651 (best generation)',
      'Sahih Muslim, Book of the Merits of the Companions, Hadith 2537 (do not curse companions)',
      'Jami at-Tirmidhi, Book of Virtues (ten promised paradise)',
      'Sahih al-Bukhari, Book of the Virtues of the Companions',
    ],
  },
  {
    patterns: [
      /does.*allah.*have.*a.*body/i, /is.*allah.*physical/i, /does.*allah.*have.*form/i,
      /can.*we.*see.*allah/i, /will.*we.*see.*allah.*in.*paradise/i,
      /is.*allah.*male.*or.*female/i, /does.*allah.*have.*gender/i,
      /where.*is.*allah/i, /does.*allah.*sit.*on.*throne/i,
    ],
    keywords: ['does allah have a body', 'is allah physical', 'does allah have form', 'can we see allah', 'will we see allah in paradise', 'is allah male or female', 'does allah have gender', 'where is allah', 'does allah sit on throne'],
    answer: 'Allah is beyond human comprehension — He has no physical body, no form, no gender, and nothing resembles Him. (1) The Quran says: "There is nothing like unto Him, and He is the All-Hearing, the All-Seeing" (42:11). This is the foundational principle: Allah is completely unlike His creation. (2) No physical body: Allah is not physical. He created bodies, so He cannot have a body. A body is limited, needs space, and can be perceived by senses — Allah is beyond all of this. (3) No gender: Allah is neither male nor female. In Arabic, "Allah" is grammatically masculine (as are most nouns), but this is a linguistic feature, not a statement of gender. Allah says: "He is the Creator of the heavens and the earth" — the pronoun "He" (Huwa) is used because Arabic has no gender-neutral pronoun. Allah is beyond male and female. (4) Can we see Allah in this world: No. The Prophet (PBUH) was asked: "Did you see your Lord?" He said: "He is light, how could I see Him?" (Muslim). And Musa (Moses) asked to see Allah, and Allah said: "You will not see Me" (Quran 7:143). (5) Will we see Allah in Paradise: Yes — the believers will see Allah in Paradise. The Prophet (PBUH) said: "You will see your Lord on the Day of Resurrection as you see the full moon" (Bukhari, Muslim). This is the greatest joy of Paradise. The exact "how" is beyond our understanding — we believe it without comparing it to worldly seeing. (6) Where is Allah: The Quran says: "The Most Merciful rose above the Throne" (20:5) and "He is with you wherever you are" (57:4). The majority of scholars (Ahl al-Sunnah) hold that Allah is above the Throne (in a way that befits His majesty, not physically), AND He is with His creation through His knowledge, power, and hearing — not by being physically present everywhere. (7) Allah\'s attributes: The Quran mentions Allah\'s "hand," "face," "eyes," etc. The majority of scholars (Ahl al-Sunnah) interpret these as real attributes of Allah that befit His majesty, without comparing them to human attributes, without asking "how," and without denying them. "There is nothing like unto Him." (8) Allah does not need the Throne — the Throne is the greatest of creation, and Allah is above it in a way that befits Him. (9) The key principle: believe in what Allah and His Messenger described, without distortion, denial, likening to creation, or asking "how." "We believe in it, all of it is from our Lord" (Quran 3:7).',
    sources: [
      'Quran, Surah Ash-Shura 42:11 (nothing like Him)',
      'Quran, Surah Al-A\'raf 7:143 (Musa cannot see Allah)',
      'Sahih al-Bukhari, Book of Tawheed, Hadith 7437 (see Allah like the full moon)',
      'Sahih Muslim, Book of Faith, Hadith 178 (Allah is light, how could I see Him)',
      'Quran, Surah Taha 20:5 (Allah above the Throne)',
    ],
  },
  {
    patterns: [
      /what.*is.*tahajjud/i, /how.*to.*pray.*tahajjud/i, /when.*is.*tahajjud/i,
      /is.*tahajjud.*obligatory/i, /tahajjud.*time/i, /qiyam.*al.*layl/i,
      /night.*prayer.*islam/i, /is.*praying.*at.*night.*rewarding/i,
    ],
    keywords: ['tahajjud', 'how to pray tahajjud', 'when is tahajjud', 'is tahajjud obligatory', 'tahajjud time', 'qiyam al layl', 'night prayer islam', 'praying at night rewarding'],
    answer: 'Tahajjud (also called Qiyam al-Layl) is the voluntary night prayer — one of the most beloved and rewarding acts of worship. (1) The Quran says: "And from [part of] the night, pray Tahajjud as an extra offering for yourself, that your Lord may raise you to a praised station" (17:79). (2) Time: Tahajjud is prayed in the last third of the night (after Isha and before Fajr). The best time is the last third — the Prophet (PBUH) said: "Our Lord descends every night to the lowest heaven during the last third of the night and says: Who is calling upon Me, that I may answer him? Who is asking of Me, that I may give him? Who is seeking My forgiveness, that I may forgive him?" (Bukhari, Muslim). (3) How to pray: (a) Pray 2, 4, 6, or 8 rakats (in pairs of 2). (b) Recite from the Quran what is easy for you. (c) Make lots of du\'a after the prayer — this is the best time for du\'a to be accepted. (d) The Prophet (PBUH) used to pray 11 rakats (8 Tahajjud + 3 Witr). (4) Is it obligatory: No — it is a Sunnah (voluntary), but highly recommended. The Prophet (PBUH) said: "The best prayer after the obligatory prayers is the night prayer" (Muslim). (5) Witr: The Prophet (PBUH) never left Witr, even while traveling. Witr is 1 rakat (or 3) prayed after Tahajjud, before Fajr. Some scholars consider Witr obligatory (wajib), others consider it a strong Sunnah. (6) Benefits: (a) Closeness to Allah. (b) Forgiveness of sins. (c) Du\'a accepted. (d) Tranquility and peace. (e) The Prophet (PBUH) said: "You should pray Tahajjud, for it is the habit of the righteous before you, and it brings you near to your Lord, and expiates sins, and prevents the body from disease" (Tirmidhi). (7) If you cannot wake up for the last third: pray before sleeping — the intention counts. Or wake up 10-15 minutes before Fajr and pray 2 rakats. (8) Even 2 rakats of Tahajjud are better than the whole world and everything in it. Start small and build the habit. (9) The Prophet (PBUH) said: "Hold fast to night prayer, for it is the practice of the righteous before you, a means of drawing near to your Lord, an expiation for wrong deeds, and a restraint from sin" (Tirmidhi).',
    sources: [
      'Quran, Surah Al-Isra 17:79 (command to pray Tahajjud)',
      'Sahih al-Bukhari, Book of Tahajjud, Hadith 1145 (Allah descends in last third)',
      'Sahih Muslim, Book of Prayer, Hadith 1163 (best prayer after obligatory)',
      'Jami at-Tirmidhi, Book of Prayer, Hadith 3549 (expels disease and sin)',
    ],
  },
  {
    patterns: [
      /what.*is.*laylat.*al.*qadr/i, /when.*is.*laylat.*qadr/i, /night.*of.*power.*islam/i,
      /how.*to.*find.*laylat.*qadr/i, /what.*to.*do.*on.*laylat.*qadr/i,
      /laylatul.*qadr.*dua/i, /better.*than.*thousand.*months/i,
    ],
    keywords: ['laylat al qadr', 'laylatul qadr', 'when is laylat qadr', 'night of power islam', 'how to find laylat qadr', 'what to do on laylat qadr', 'better than thousand months'],
    answer: 'Laylat al-Qadr (the Night of Power/Decree) is the holiest night of the year — the night the Quran was first revealed. (1) The Quran says: "Indeed, We sent it [the Quran] down during the Night of Decree. And what will make you know what the Night of Decree is? The Night of Decree is better than a thousand months. The angels and the Spirit descend therein, by permission of their Lord, for every matter. Peace it is until the emergence of dawn" (97:1-5). (2) Better than a thousand months: Worship on this one night is more rewarding than worship for 83 years (1000 months). This shows the immense mercy of Allah — He gives immense reward for a small effort. (3) When: It falls in the last 10 nights of Ramadan, on an odd night — most likely the 27th, but it could be the 21st, 23rd, 25th, 27th, or 29th. The Prophet (PBUH) said: "Seek it in the last ten nights of Ramadan, in the odd nights" (Bukhari). (4) Why it is hidden: Allah hid the exact night so that Muslims would strive in worship throughout the last 10 nights, not just one night. This is Allah\'s wisdom — it encourages more worship. (5) What to do: (a) Pray Tahajjud (night prayer). (b) Recite Quran. (c) Make lots of du\'a. (d) Do dhikr (remembrance of Allah). (e) Give charity. (f) The Prophet (PBUH) said: "Whoever stands [in prayer] on Laylat al-Qadr with faith and seeking reward, his previous sins are forgiven" (Bukhari, Muslim). (6) The best du\'a for Laylat al-Qadr: Aisha (RA) asked the Prophet (PBUH): "What should I say if I know which night is Laylat al-Qadr?" He said: "Say: Allahumma innaka \'afuwwun tuhibbul \'afwa fa\'fu \'anni (O Allah, You are the Most Pardoning, You love to pardon, so pardon me)" (Tirmidhi). (7) Signs of Laylat al-Qadr: The Prophet (PBUH) mentioned signs: the night is calm, neither too hot nor too cold, the moon appears split, and the morning after rises with a sun that is not too bright (Muslim). (8) Itikaf (seclusion in the mosque): Many scholars and pious people practice Itikaf during the last 10 days of Ramadan to maximize the chance of catching Laylat al-Qadr. (9) Even if you cannot do much: even 2 rakats of prayer with sincere du\'a on the odd nights is immensely rewarding. (10) The Prophet\'s wife Aisha (RA) said: "The Prophet used to strive in worship during the last ten nights more than at any other time" (Muslim).',
    sources: [
      'Quran, Surah Al-Qadr 97:1-5',
      'Sahih al-Bukhari, Book of Prayer, Hadith 2017 (seek it in last ten odd nights)',
      'Jami at-Tirmidhi, Book of Prayer, Hadith 3514 (du\'a of Laylat al-Qadr)',
      'Sahih Muslim, Book of Prayer, Hadith 1175 (signs of Laylat al-Qadr)',
    ],
  },
  {
    patterns: [
      /is.*oral.*sex.*halal/i, /is.*oral.*sex.*haram/i, /is.*anal.*sex.*haram/i,
      /is.*anal.*sex.*allowed.*islam/i, /what.*is.*permissible.*in.*bed.*islam/i,
      /intimacy.*in.*islam/i, /what.*is.*allowed.*between.*spouses/i,
      /is.*kissing.*wife.*halal/i, /is.*foreplay.*allowed.*islam/i,
    ],
    keywords: ['oral sex halal', 'oral sex haram', 'anal sex haram', 'anal sex islam', 'what is permissible in bed islam', 'intimacy in islam', 'what is allowed between spouses', 'foreplay allowed islam', 'kissing wife halal'],
    answer: 'Intimacy between spouses is a beautiful and blessed thing in Islam — within clear boundaries. (1) The Quran says: "Your wives are a tilth for you, so go to your tilth as you will, and send [good deeds] ahead for yourselves" (2:223). This means intimacy is permitted in whatever position you both agree to, as long as it is in the place of tilth (the vagina). (2) What is permitted between spouses: (a) Vaginal intercourse in any position. (b) Kissing, touching, and caressing all parts of the body. (c) Foreplay — the Prophet (PBUH) said: "Let none of you come upon his wife like an animal; let there be an emissary between them." When asked what the emissary was, he said: "The kiss and [sweet] words" (Daylami). (d) The Prophet (PBUH) also said: "Everything is permissible except anal sex" (Ahmad, Tirmidhi). (3) Anal sex: Strictly prohibited (haram). This is the consensus of all scholars, based on: (a) The Quranic verse "go to your tilth" — the tilth is the vagina, not the anus. (b) The Prophet (PBUH) said: "Whoever has intercourse with his wife in her anus has cursed her" (Ahmad, Abu Dawud). (c) It is harmful physically and goes against the natural purpose of intimacy. (4) Oral sex: Scholars differ. (a) Some permit it as part of mutual pleasure between spouses, as long as both agree and it does not involve swallowing impurities. (b) Some discourage it as it is not from the Sunnah and may be considered imitating practices not known to the early Muslims. (c) The safest position: discuss with a scholar you trust. The majority of contemporary scholars permit it between consenting spouses as part of intimacy. (5) During menstruation: Intercourse is prohibited during menstruation (Quran 2:222). However, other intimacy (kissing, touching above the navel and below the knee, according to some scholars) is permitted. The Prophet (PBUH) was asked about what is permitted with a menstruating wife — he said: "Everything except intercourse" (Muslim). (6) After menstruation/childbirth: Ghusl is required before intercourse. (7) Covering during intimacy: The Prophet (PBUH) said: "When you have intercourse with your wife, cover yourselves, and do not uncover yourselves like donkeys" (Ibn Majah). (8) Making du\'a before intimacy: The Prophet (PBUH) taught: "Bismillah, Allahumma jannibnash-shaytan, wa jannibish-shaytana ma razaqtana (In the name of Allah, O Allah, keep Satan away from us, and keep Satan away from what You provide us)" (Bukhari, Muslim). (9) Ghusl after intimacy is required before prayer, even if no ejaculation occurred (majority view). (10) The key: intimacy is a source of reward (sadaqah) when done within marriage — the Prophet (PBUH) said: "In the private part of each of you there is sadaqah" (Muslim).',
    sources: [
      'Quran, Surah Al-Baqarah 2:223 (tilth)',
      'Quran, Surah Al-Baqarah 2:222 (menstruation)',
      'Sahih al-Bukhari, Book of Marriage, Hadith 5166 (du\'a before intimacy)',
      'Sahih Muslim, Book of Menstruation (everything except intercourse)',
      'Musnad Ahmad (anal sex prohibited)',
    ],
  },
  {
    patterns: [
      /can.*women.*touch.*quran.*during.*period/i, /is.*reading.*quran.*during.*menstruation.*allowed/i,
      /can.*women.*read.*quran.*on.*phone.*period/i, /menstruation.*quran.*app/i,
      /can.*menstruating.*woman.*enter.*mosque/i, /can.*women.*fast.*during.*period/i,
    ],
    keywords: ['women touch quran period', 'reading quran menstruation', 'read quran phone period', 'menstruating woman mosque', 'women fast during period', 'quran app period', 'menstruation quran'],
    answer: 'The rulings for a menstruating woman are compassionate and practical. (1) Salah (prayer): A menstruating woman does not pray, and she does not need to make up missed prayers. The Prophet (PBUH) said (to women): "Is it not that when one of you menstruates, she does not pray or fast?" (Bukhari). This is a mercy — not a punishment. She does not need to make up the missed prayers. (2) Fasting: She does not fast during menstruation, but she MUST make up the missed fasts after Ramadan (on other days before the next Ramadan). Unlike prayer, fasting is made up. (3) Touching the Quran: The majority of scholars say a menstruating woman should not touch the Arabic text of the Quran directly. (4) Reading the Quran (reciting): Scholars differ: (a) The majority (Hanafi, some Shafi\'i, Hanbali) say she should not recite the Quran verbally. (b) Some scholars (including some Shafi\'i and contemporary scholars) permit reciting if there is a need (e.g., a teacher, student, or fear of forgetting). (c) Listening to the Quran (audio) is permitted by all scholars. (d) Reciting the Quran silently (in the heart/mind) is permitted. (5) Using a Quran app on phone: Many contemporary scholars permit reading the Quran on a phone during menstruation, because: (a) You are not touching the physical mushaf (Quran book). (b) The screen is not considered the "Quran" in the same way. (c) Many scholars make an analogy to touching the Quran through a cover or barrier (which is debated but permitted by some). However, some stricter scholars still discourage it. (6) Entering the mosque: The majority say a menstruating woman should not enter the mosque. However, some contemporary scholars permit passing through (e.g., to attend a class or use facilities) as long as she does not sit in the prayer area. (7) Tawaf (circumambulating the Kaaba): Not permitted during menstruation — Aisha (RA) was told by the Prophet to not do Tawaf until she was pure (Bukhari). (8) Other acts she CAN do: du\'a, dhikr (tasbih, tahleel, takbeer), sending blessings on the Prophet (salawat), listening to Islamic lectures, giving charity, reading Islamic books (not the Quran text). (9) Intimacy: See separate entry — intercourse is prohibited, but other intimacy is allowed. (10) The key: menstruation is a natural biological process, not a spiritual deficiency. A menstruating woman is still a believer, still earns reward for her good deeds, and her relationship with Allah continues through du\'a, dhikr, and charity.',
    sources: [
      'Sahih al-Bukhari, Book of Menstruation, Hadith 304 (Aisha and Tawaf)',
      'Sahih al-Bukhari, Book of Menstruation (do not pray or fast)',
      'Contemporary fatwas on Quran apps during menstruation',
      'Quran, Surah Al-Baqarah 2:222 (menstruation is harm, so withdraw)',
    ],
  },
  {
    patterns: [
      /what.*is.*the.*kaaba/i, /what.*is.*inside.*the.*kaaba/i, /why.*do.*muslims.*face.*kaaba/i,
      /who.*built.*the.*kaaba/i, /is.*kaaba.*an.*idol/i, /do.*muslims.*worship.*kaaba/i,
      /what.*is.*black.*stone/i, /hajr.*aswad/i,
    ],
    keywords: ['what is the kaaba', 'what is inside the kaaba', 'why face kaaba', 'who built the kaaba', 'is kaaba an idol', 'do muslims worship kaaba', 'black stone', 'hajr aswad'],
    answer: 'The Kaaba is the sacred house in Mecca that Muslims face during prayer — it is the direction of prayer (Qibla), NOT an object of worship. (1) What it is: The Kaaba is a cube-shaped building (about 13.1m high, 11.03m wide) in the center of the Grand Mosque (Masjid al-Haram) in Mecca. It is covered with a black silk and gold-embroidered cloth (Kiswah). (2) Who built it: The Kaaba was first built by Prophet Adam (AS), then rebuilt by Prophet Ibrahim (Abraham) and his son Ismail (Ishmael) (AS) after it was damaged. The Quran says: "And [mention, O Muhammad], when We designated for Abraham the site of the House, [saying]: Do not associate anything with Me and purify My House for those who perform Tawaf and those who stand [in prayer]" (22:26). (3) Why Muslims face it: Allah commanded Muslims to face the Kaaba during prayer as a unifying direction — it does not mean Muslims worship it. The Quran says: "So turn your face toward al-Masjid al-Haram. And wherever you are, turn your faces toward it" (2:144). Just as a compass needle points north, the Kaaba points Muslims toward Allah. (4) Do Muslims worship the Kaaba: Absolutely not. Worship is for Allah alone. The Kaaba is a building — a focal point and a symbol of unity. If a Muslim prayed toward the Kaaba while believing the Kaaba itself has divine power, that would be shirk. The Prophet (PBUH) said: "The Black Stone is from Paradise" (Tirmidhi) — but even the Black Stone is not worshipped. (5) The Black Stone (Hajr al-Aswad): A sacred stone set in the eastern corner of the Kaaba. It was given to Ibrahim (AS) by Gabriel. It is from Paradise (according to hadith). During Tawaf, Muslims kiss or point to it (following the Prophet\'s practice), not as worship but as reverence and following the Sunnah. Umar (RA) said: "I know you are only a stone that can neither harm nor benefit. If I had not seen the Prophet (PBUH) kissing you, I would not have kissed you" (Bukhari). (6) Inside the Kaaba: It is a simple room with a marble floor, three pillars, and a lamp. It is opened twice a year for cleaning. (7) Historical: Before Islam, the Kaaba housed 360 idols. The Prophet (PBUH) destroyed them when he conquered Mecca, restoring it to the worship of Allah alone. (8) The Kaaba was damaged and rebuilt several times (floods, fire). The current structure was last extensively renovated by Saudi authorities. (9) Tawaf (circling the Kaaba 7 times) is an act of worship for Allah, not for the Kaaba. (10) The Kaaba is a symbol of tawheed (oneness of Allah) — the first house dedicated to the worship of one God.',
    sources: [
      'Quran, Surah Al-Baqarah 2:144 (face the Kaaba)',
      'Quran, Surah Al-Hajj 22:26 (Ibrahim and the House)',
      'Sahih al-Bukhari, Book of Hajj, Hadith 1597 (Umar and the Black Stone)',
      'Jami at-Tirmidhi, Book of Hajj, Hadith 877 (Black Stone from Paradise)',
    ],
  },
  {
    patterns: [
      /what.*is.*the.*99.*names.*of.*allah/i, /how.*many.*names.*does.*allah.*have/i,
      /what.*are.*asma.*ul.*husna/i, /beautiful.*names.*of.*allah/i,
      /list.*of.*allah.*names/i, /memorizing.*99.*names/i,
    ],
    keywords: ['99 names of allah', 'how many names allah', 'asma ul husna', 'beautiful names of allah', 'list allah names', 'memorizing 99 names'],
    answer: 'Allah has 99 names (Asma\' al-Husna — the Most Beautiful Names), each describing a perfect attribute. (1) The Quran says: "And to Allah belong the best names, so invoke Him by them" (7:180). And: "He is Allah, the Creator, the Inventor, the Fashioner; to Him belong the best names" (59:24). (2) The Prophet (PBUH) said: "Allah has ninety-nine names, one hundred minus one. Whoever memorizes them will enter Paradise" (Bukhari, Muslim). "Memorizes" here means not just knowing them by heart, but understanding them, acting upon them, and supplicating to Allah by them. (3) Some of the 99 names: (a) Ar-Rahman (The Most Gracious) — His mercy encompasses all creation. (b) Ar-Raheem (The Most Merciful) — His mercy is especially for the believers. (c) Al-Malik (The King), Al-Quddus (The Holy), As-Salam (The Source of Peace). (d) Al-Muhmin (The Guardian of Faith), Al-Azeez (The Almighty), Al-Jabbar (The Compeller). (e) Al-Khaliq (The Creator), Al-Bari\' (The Maker), Al-Musawwir (The Fashioner). (f) Al-Ghaffar (The Forgiving), Al-Qahhar (The Subduer), Al-Wahhab (The Bestower). (g) Al-Razzaq (The Provider), Al-Fattah (The Opener), Al-Alim (The All-Knowing). (h) As-Sami\' (The All-Hearing), Al-Basir (The All-Seeing). (i) Al-Hakam (The Judge), Al-\'Adl (The Just). (j) Al-Latif (The Subtle/Kind), Al-Khabir (The All-Aware). (k) Al-Halim (The Forbearing), Al-\'Azeem (The Great), Al-Ghafur (The Forgiving). (l) Ash-Shakur (The Grateful), Al-\'Ali (The High), Al-Kabir (The Great). (m) Al-Hafiz (The Preserver), Al-Muqit (The Sustainer), Al-Hasib (The Reckoner). (n) Al-Jalil (The Majestic), Al-Karim (The Generous), Al-Raqib (The Watchful). (o) Al-Mujib (The Responsive), Al-Wasi\' (The All-Encompassing), Al-Hakim (The Wise). (4) The greatest name: The Prophet (PBUH) mentioned that Allah has a greatest name (Ism Allah al-A\'zam) by which He answers du\'a. Scholars differ on which it is — some say "Al-Hayy al-Qayyum" (the Ever-Living, the Sustainer), others say "Allah" itself, or "Ar-Rahman." (5) Benefit of knowing the names: Calling Allah by the name that fits your need (e.g., "Ya Razzaq" for provision, "Ya Shafi" for healing, "Ya Ghaffar" for forgiveness) is a powerful way to make du\'a. (6) Memorizing: Learn a few at a time with their meanings. There are many apps and books for this. (7) There may be more than 99 — the hadith says "ninety-nine" but scholars note that Allah\'s names are not limited to 99; rather, 99 are specifically mentioned as leading to Paradise.',
    sources: [
      'Quran, Surah Al-A\'raf 7:180 (best names)',
      'Quran, Surah Al-Hashr 59:22-24 (names of Allah)',
      'Sahih al-Bukhari, Book of Tawheed, Hadith 2736 (99 names, Paradise)',
      'Sahih Muslim, Book of Dhikr, Hadith 2677',
    ],
  },
  {
    patterns: [
      /is.*music.*in.*ringtones.*haram/i, /is.*alarm.*music.*haram/i,
      /is.*listening.*to.*nasheed.*with.*beat.*haram/i, /is.*vocals.*only.*nasheed.*halal/i,
      /is.*humming.*song.*haram/i, /is.*whistling.*tune.*haram/i,
      /is.*singing.*in.*shower.*haram/i,
    ],
    keywords: ['ringtones music haram', 'alarm music', 'nasheed with beat', 'vocals only nasheed', 'humming song', 'whistling tune', 'singing in shower', 'nasheed beat'],
    answer: 'This builds on the general music ruling. Practical applications: (1) Ringtones: If you follow the majority view that instruments are haram, then using a musical ringtone (with instruments) is discouraged. Using a nasheed (vocal only) ringtone, Quran recitation, or a simple tone is better. (2) Alarms: Similar to ringtones — a simple beep or vocal nasheed is better than an instrumental song. However, some scholars permit it as a necessity (you need an alarm to wake up for Fajr). (3) Nasheeds with beats/vocals only: (a) Nasheeds with only vocals (no instruments) are permissible by the majority. (b) Nasheeds with a vocal beat (beatboxing, vocal percussion) — scholars differ: some permit it as it is not an instrument, others discourage it as it mimics instruments. (c) Nasheeds with actual instruments follow the general music ruling. (4) Humming a song: If you are humming a song that has haram lyrics or was originally played with instruments, it is discouraged. Humming a halal tune or nasheed is fine. (5) Whistling: Generally permissible (see separate entry). (6) Singing in the shower: Singing itself (without instruments) is generally permissible if the lyrics are halal. However, some scholars discourage singing in the bathroom because it is a place where one should be mindful and not engage in entertainment. The majority do not consider it haram. (7) Background music in stores/public places: You cannot control this, so there is no sin on you for hearing it. The Prophet (PBUH) said: "Allah has pardoned my Ummah for what they say to themselves, what they think, and what they feel, as long as they do not act upon it or speak of it" (Bukhari). (8) The key: if you are unsure, follow the majority position of avoiding instruments, and use vocals, nasheeds, Quran, or nature sounds instead. If you follow a scholar who permits instruments, that is also a valid position.',
    sources: [
      'Sahih al-Bukhari, Book of Drinks, Hadith 5590 (instruments)',
      'Contemporary fatwas on ringtones and nasheeds',
      'General principle of permissibility and necessity',
    ],
  },
  {
    patterns: [
      /what.*is.*dua/i, /how.*to.*make.*dua.*properly/i, /how.*does.*dua.*work/i,
      /why.*my.*dua.*not.*answered/i, /etiquette.*of.*dua/i, /best.*time.*for.*dua/i,
      /how.*to.*ask.*allah/i, /can.*dua.*change.*destiny/i,
    ],
    keywords: ['what is dua', 'how to make dua', 'how does dua work', 'why dua not answered', 'etiquette of dua', 'best time for dua', 'how to ask allah', 'dua change destiny'],
    answer: 'Du\'a is supplication — calling upon Allah, asking Him for something, or praising Him. It is one of the most powerful acts of worship. (1) The Quran says: "Call upon Me, I will respond to you" (40:60). And: "Your Lord says: Call upon Me, I will answer you" (40:60). (2) The Prophet (PBUH) said: "Du\'a is worship" (Tirmidhi, Abu Dawud). And: "Nothing is more honorable to Allah than du\'a" (Tirmidhi, Ibn Majah). (3) Etiquette of du\'a: (a) Start with praise of Allah (Alhamdulillah) and send blessings on the Prophet (sallallahu \'alayhi wa sallam). (b) Raise your hands. (c) Be sincere and humble. (d) Be certain Allah will answer — the Prophet (PBUH) said: "Call upon Allah while being certain of being answered, and know that Allah does not respond to a supplication from a heedless, inattentive heart" (Tirmidhi). (e) Face the Qibla if possible. (f) End with "Ameen" and send blessings on the Prophet again. (g) Do not be hasty — the Prophet (PBUH) said: "Each one of you will be answered as long as he does not hurry, saying: I prayed but I was not answered" (Bukhari, Muslim). (h) Do not pray for sin or cutting family ties. (i) Use Allah\'s beautiful names (e.g., "Ya Razzaq, provide for me"). (4) Best times for du\'a: (a) The last third of the night (Allah descends and asks: Who is calling upon Me?). (b) Between the adhan and iqamah. (c) While prostrating (sujud) — the Prophet (PBUH) said: "The closest a servant is to his Lord is when he is prostrating, so make much du\'a in it" (Muslim). (d) On Friday (especially the last hour before Maghrib). (e) During rain (the Prophet (PBUH) said du\'a is not rejected during rain). (f) While traveling. (g) After obligatory prayers. (h) During Laylat al-Qadr. (i) Between Asr and Maghrib on Friday (debated). (5) Why du\'a seems unanswered: (a) You may be asking for something harmful — Allah gives something better instead. (b) Your income may be haram — the Prophet (PBUH) mentioned a man on a long journey, disheveled, raising his hands to the sky, but his food is haram, drink is haram, clothing is haram — "how can he be answered?" (Muslim). (c) It may be delayed — Allah answers in His own time. (d) The answer may be: giving you what you asked, OR something better, OR storing the reward for the Hereafter. The Prophet (PBUH) said: "Any Muslim who makes du\'a, there is no sin in it — either it is given in this world, or stored for him in the Hereafter, or an evil is averted from him equal to it" (Ahmad). (6) Can du\'a change destiny: The Prophet (PBUH) said: "Nothing repels destiny except du\'a, and nothing increases lifespan except righteousness" (Tirmidhi). So du\'a can change what was decreed. (7) Make du\'a for both this world and the Hereafter. (8) The best du\'a is for forgiveness, guidance, and Paradise.',
    sources: [
      'Quran, Surah Ghafir 40:60 (call upon Me)',
      'Sahih al-Bukhari, Book of Du\'a, Hadith 634 (do not hurry)',
      'Sahih Muslim, Book of Piety, Hadith 2735 (closest in sujud)',
      'Jami at-Tirmidhi, Book of Du\'a (du\'a repels destiny)',
    ],
  },
  {
    patterns: [
      /is.*singing.*quran.*haram/i, /is.*reciting.*quran.*with.*tune.*haram/i,
      /can.*quran.*be.*sung/i, /is.*melodious.*recitation.*halal/i,
      /is.*reciting.*quran.*beautifully.*rewarded/i, /tajweed.*singing/i,
    ],
    keywords: ['singing quran haram', 'reciting quran with tune', 'can quran be sung', 'melodious recitation', 'reciting quran beautifully', 'tajweed singing'],
    answer: 'Reciting the Quran with a beautiful, melodious voice is a Sunnah and is encouraged — but it is not "singing" in the musical sense. (1) The Prophet (PBUH) said: "Beautify the Quran with your voices" (Bukhari, Abu Dawud, Nasai). And: "He who does not recite the Quran in a pleasant voice is not from us" (Bukhari, Abu Dawud). (2) Melodious recitation (Tarteel) is encouraged — the Quran says: "And recite the Quran in measured, distinct parts" (73:4). This means reciting slowly, beautifully, and with proper tajweed. (3) Difference between melodious recitation and singing: (a) Reciting the Quran beautifully follows the rules of tajweed (proper pronunciation) — the melody comes from the natural rhythm of the Arabic and the reciter\'s voice, not from musical composition. (b) "Singing" the Quran (adding musical notes, changing the words to fit a tune, or treating it like a song) is not permissible — it disrespects the sacredness of the text. (c) The reciter should not stretch words or alter vowels to fit a melody in a way that changes the meaning. (4) Using musical tunes for Quran: The majority of scholars prohibit reciting the Quran to the tune of popular songs or using musical instruments — this disrespects the Quran. (5) The reciters we hear (like Mishary Alafasy, Abdul Basit, Sudais) use a beautiful, natural melody that follows tajweed rules — this is the Sunnah. (6) Listening to beautiful recitation: Encouraged and rewarded. It softens the heart. (7) If you cannot recite beautifully: The Prophet (PBUH) said: "The one who is skilled in the Quran is with the honorable, obedient scribes (angels), and the one who recites the Quran while it is difficult for him will have two rewards" (Bukhari, Muslim). So even struggling to recite gives double reward. (8) Learning tajweed: Highly recommended — it ensures the Quran is recited as it was revealed. (9) The key: recite beautifully, but within the rules of tajweed — do not turn the Quran into a song.',
    sources: [
      'Sahih al-Bukhari, Book of the Virtues of the Quran, Hadith 5021 (beautify with your voice)',
      'Sahih al-Bukhari, Book of the Virtues of the Quran, Hadith 4937 (two rewards for the one who struggles)',
      'Quran, Surah Al-Muzzammil 73:4 (recite in measured parts)',
    ],
  },
  {
    patterns: [
      /is.*wudu.*valid.*if.*water.*doesnt.*reach.*skin/i, /is.*nailpolish.*wudu.*valid/i,
      /can.*i.*pray.*with.*acrylic.*nails/i, /is.*acrylic.*nail.*haram/i,
      /is.*gel.*nail.*haram/i, /is.*press.*on.*nail.*haram/i, /does.*nailpolish.*break.*wudu/i,
    ],
    keywords: ['nailpolish wudu valid', 'acrylic nails wudu', 'gel nails haram', 'press on nails', 'acrylic nails haram', 'does nailpolish break wudu', 'water reach skin wudu'],
    answer: 'The key issue with nail products is whether they prevent water from reaching the nail during wudu. (1) Traditional nail polish: Forms a solid, waterproof layer on the nail — water cannot reach the nail surface. This means wudu performed over nail polish is INVALID — the majority of scholars require water to touch every part of the skin/nail that needs to be washed (the hands up to the elbows). You must remove the polish before wudu. (2) Breathable / halal nail polish: Some brands (like Inglot O2, Tuesday in Love) claim to be "breable" and allow water to pass through. Scholars differ: (a) Some accept the scientific tests showing water passes through and permit wudu with them. (b) Others are skeptical of the tests or the concept and say you must remove them. (c) The cautious approach: remove it before wudu. (3) Acrylic nails (fake nails): These are glued to the natural nail and cover it completely — water cannot reach the nail. Wudu is invalid with acrylic nails. You must remove them before wudu. (4) Gel nails: Similar to acrylic — they form a waterproof layer. Must be removed before wudu. (5) Press-on nails: Same — they cover the nail. Remove before wudu. (6) Henna: Does NOT prevent wudu because it stains the nail/skin but does not form a waterproof layer — water reaches the skin. Henna is permissible. (7) Can you pray with nail polish: Only if the wudu was done WITHOUT the polish (i.e., you made wudu first, then applied polish). The wudu remains valid until broken — but once broken, you must remove the polish to make a new wudu. (8) Are nail products haram in themselves: The polish/nails are not haram as objects — the issue is that they prevent valid wudu. If you wear them when not praying, it is not haram (though some scholars discourage beautification for non-mahrams to see). (9) Practical tip: If you want to wear nail polish, apply it AFTER wudu and remove it before the next wudu. Or use breathable polish if you trust the brand and your scholar permits it. (10) The same principle applies to anything that blocks water: thick lotion, paint, etc. — if it prevents water from reaching the skin, it must be removed for wudu.',
    sources: [
      'Quran, Surah Al-Ma\'idah 5:6 (wash your faces and hands)',
      'Sahih al-Bukhari, Book of Ablution (water must reach skin)',
      'Contemporary fatwas on breathable nail polish and acrylic nails',
    ],
  },
  {
    patterns: [
      /is.*sleeping.*on.*stomach.*haram/i, /is.*sleeping.*position.*islam/i,
      /how.*did.*prophet.*sleep/i, /sunna.*way.*to.*sleep/i, /is.*sleeping.*after.*asr.*haram/i,
      /dua.*before.*sleeping/i, /what.*to.*recite.*before.*sleep/i,
    ],
    keywords: ['sleeping on stomach haram', 'sleeping position islam', 'how prophet slept', 'sunna way to sleep', 'sleeping after asr', 'dua before sleeping', 'recite before sleep'],
    answer: 'Islam provides guidance on sleeping habits for both physical and spiritual benefit. (1) Sleeping position: The Prophet (PBUH) saw a man sleeping on his stomach and said: "This is a lying position that Allah dislikes" (Ahmad, Abu Dawud). Sleeping on the stomach is disliked (makruh). The Sunnah is to sleep on the right side. The Prophet (PBUH) said: "When you go to your bed, lie on your right side" (Bukhari). (2) Sunnah of sleeping: (a) Sleep on the right side, with the right hand under the right cheek. (b) Make wudu before sleeping if possible. (c) Dust the bed three times (in case of insects). (d) Recite specific du\'as and verses. (3) Du\'a before sleeping: "Bismika Allahumma amutu wa ahya (In Your name, O Allah, I die and I live)" (Bukhari). (4) What to recite before sleep (the Prophet\'s practice): (a) Ayat al-Kursi (2:255) — the Prophet (PBUH) said: "When you go to bed, recite Ayat al-Kursi, for you will have a protector from Allah and no devil will approach you until morning" (Bukhari). (b) The three Quls (Surah Al-Ikhlas, Al-Falaq, An-Nas) — cup them in your hands, blow, and wipe over your body (Bukhari). (c) Surah Al-Mulk (protection from grave punishment). (d) "Subhanallah 33 times, Alhamdulillah 33 times, Allahu Akbar 34 times" — the Prophet (PBUH) said this is better than a servant (Bukhari, Muslim). (e) The last two verses of Surah Al-Baqarah. (5) Sleeping after Asr: Some scholars discourage it based on a weak hadith. The majority do not consider it haram. If it does not affect your prayers or health, it is fine. (6) Sleeping too much: The Quran says: "And We made your sleep for rest, and made the night as a covering, and made the day for livelihood" (78:9-11). Excessive sleep is discouraged — it wastes time and leads to laziness. The Prophet (PBUH) disliked sleeping before Isha and talking after it. (7) Early to bed, early to rise: The Prophet (PBUH) woke up for Tahajjud and Fajr. Sleeping early allows for Tahajjud. (8) Waking up du\'a: "Alhamdulillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur (Praise be to Allah who gave us life after death, and to Him is the resurrection)" (Bukhari). (9) Naps (Qailulah): The Prophet (PBUH) used to nap in the early afternoon — this is a Sunnah and helps with energy for night prayer. (10) The key: sleep is a blessing from Allah — use it well, recite your du\'as, and wake up for worship.',
    sources: [
      'Sahih al-Bukhari, Book of Du\'a, Hadith 247 (lie on your right side)',
      'Sahih al-Bukhari, Book of Prophetic Commentary (Ayat al-Kursi before sleep)',
      'Musnad Ahmad (sleeping on stomach disliked)',
      'Sahih al-Bukhari, Book of Du\'a (du\'as before sleep)',
    ],
  },
  {
    patterns: [
      /is.*saying.*bismillah.*before.*eating.*important/i, /etiquette.*of.*eating.*islam/i,
      /how.*did.*prophet.*eat/i, /sunna.*way.*to.*eat/i, /dua.*before.*eating/i,
      /dua.*after.*eating/i, /is.*wasting.*food.*haram/i, /eating.*too.*much.*haram/i,
    ],
    keywords: ['bismillah before eating', 'etiquette of eating islam', 'how prophet ate', 'sunna way to eat', 'dua before eating', 'dua after eating', 'wasting food haram', 'eating too much haram'],
    answer: 'Islam has detailed etiquette (adab) for eating that brings blessing (barakah) to your food and health. (1) Before eating: (a) Wash your hands. (b) Say "Bismillah" (In the name of Allah). The Prophet (PBUH) said: "When one of you eats, let him mention the name of Allah. If he forgets to mention Allah at the beginning, let him say: Bismillahi awwalahu wa akhirahu (In the name of Allah, at its beginning and end)" (Abu Dawud, Tirmidhi). (c) Eat with your right hand — the Prophet (PBUH) said: "When one of you eats, let him eat with his right hand, and when he drinks, let him drink with his right hand, for Satan eats with his left hand and drinks with his left hand" (Muslim). (2) During eating: (a) Eat from what is in front of you (if sharing a plate). (b) Do not blow on hot food — let it cool. (c) Chew well and eat slowly. (d) Do not criticize food — the Prophet (PBUH) never criticized food; if he liked it, he ate it, and if he did not, he left it (Bukhari). (3) How the Prophet ate: (a) He sat down to eat. (b) He ate with three fingers (right hand). (c) He ate in moderation. (4) Moderation: The Prophet (PBUH) said: "No human ever filled a vessel worse than the stomach. A few mouthfuls are enough to keep a person\'s back straight. But if he must, then one-third for food, one-third for drink, and one-third for breath" (Tirmidhi, Ibn Majah). Overeating is discouraged. (5) Wasting food: The Quran says: "Eat and drink, but do not waste. Indeed, He does not love the wasteful" (7:31). Wasting food is haram. Take only what you can eat, and finish your plate. (6) After eating: (a) Say: "Alhamdulillahil-ladhi at\'amana wa saqana wa ja\'alana muslimin (Praise be to Allah who has fed us, given us drink, and made us Muslims)" (Abu Dawud, Tirmidhi). (b) The Prophet (PBUH) said: "Whoever eats food and says Alhamdulillah, it is as if he has freed a slave" (Muslim). (c) Lick your fingers — the Prophet (PBUH) said: "When one of you eats, let him not wipe his hand until he licks it or has it licked" (Bukhari, Muslim). (7) Sharing food: The Prophet (PBUH) said: "The food of one is enough for two, the food of two is enough for four, and the food of four is enough for eight" (Muslim) — meaning share your food. (8) Guests: Serving a guest is a Sunnah — the Prophet (PBUH) said: "Whoever believes in Allah and the Last Day, let him honor his guest" (Bukhari). (9) Barakah: Mentioning Allah, eating with the right hand, and following the Sunnah brings barakah (blessing) — less food satisfies more. (10) Food is a blessing — be grateful, do not waste, and eat what is halal and good.',
    sources: [
      'Sahih al-Bukhari, Book of Food, Hadith 5376 (Prophet never criticized food)',
      'Sahih Muslim, Book of Drinks, Hadith 2022 (eat with right hand)',
      'Jami at-Tirmidhi, Book of Food, Hadith 1754 (one-third rule)',
      'Quran, Surah Al-A\'raf 7:31 (do not waste)',
    ],
  },
  {
    patterns: [
      /is.*using.*credit.*card.*haram/i, /is.*credit.*card.*halal.*islam/i,
      /is.*credit.*card.*debt.*haram/i, /can.*muslim.*have.*credit.*card/i,
      /is.*credit.*card.*interest.*haram/i, /is.*buy.*now.*pay.*later.*haram/i,
    ],
    keywords: ['using credit card haram', 'credit card halal islam', 'credit card debt haram', 'can muslim have credit card', 'credit card interest haram', 'buy now pay later haram'],
    answer: 'The ruling on credit cards depends on how they are used. (1) Using a credit card for convenience (paying the full balance every month, avoiding interest): Permitted by the majority of contemporary scholars. The card functions like a debit card — you buy now and pay in full within the grace period. No interest is incurred. (2) Using a credit card and paying interest (not paying the full balance, incurring interest charges): Haram — the interest (riba) is clearly prohibited. The Quran says: "Allah has permitted trade and forbidden interest" (2:275). (3) The card agreement: Some scholars raise concern about the card agreement, which includes a clause that you agree to pay interest if you do not pay in full. Even if you intend to always pay in full, you have signed a contract that includes a commitment to riba in case of default. Some scholars consider this problematic. The majority of contemporary scholars permit it because: (a) the default clause is contingent (only applies if you fail to pay), (b) you intend and usually do pay in full, (c) it is a practical necessity in many countries. (4) Cash advances: Haram — cash advances on credit cards incur interest immediately (no grace period) and often have higher rates. (5) Buy Now Pay Later (BNPL, like Klarna, Afterpay): If the plan is interest-free and you pay on time, it is generally permissible. But if you miss a payment and incur interest/fees, it becomes problematic. Some scholars are cautious because the business model often depends on late fees. (6) Credit card rewards (cashback, points): If you pay your balance in full and do not pay interest, the rewards are permissible — they are like a discount. Some scholars are cautious because the rewards are funded by interest paid by other customers, but the majority permit it. (7) The safest approach: (a) Use debit cards when possible. (b) If using a credit card, always pay the full balance on time. (c) Never pay interest. (d) Treat it like a debit card, not a loan. (8) If you are in credit card debt with interest: (a) Make tawbah for incurring interest. (b) Pay off the debt as quickly as possible. (c) Stop using the card until the debt is cleared. (d) Seek financial counseling if needed. (9) Consult a scholar for complex cases.',
    sources: [
      'Quran, Surah Al-Baqarah 2:275-279 (riba prohibition)',
      'Contemporary fatwas on credit cards (majority permit with conditions)',
      'Principle: contingent haram clauses in contracts (debated by scholars)',
    ],
  },
  {
    patterns: [
      /is.*wearing.*amulet.*haram/i, /is.*taweez.*haram/i, /is.*wearing.*talisman.*haram/i,
      /is.*wearing.*evil.*eye.*bracelet.*haram/i, /is.*hamsa.*haram/i,
      /is.*wearing.*quran.*amulet.*haram/i, /can.*i.*wear.*ayat.*ul.*kursi.*necklace/i,
    ],
    keywords: ['amulet haram', 'taweez haram', 'talisman haram', 'evil eye bracelet haram', 'hamsa haram', 'quran amulet haram', 'wear ayat ul kursi necklace'],
    answer: 'The ruling on amulets (taweez) and protective objects depends on what they contain and the wearer\'s belief. (1) Amulets containing Quran or Allah\'s names: (a) Some scholars permit wearing a small piece of paper or pendant with Quran verses or Allah\'s names, as long as you believe Allah (not the object) protects you. (b) Other scholars (including Ibn Taymiyyah and many Salafi scholars) prohibit all amulets, even with Quran, because: (i) it may lead to treating the Quran like a charm, (ii) the Prophet (PBUH) said: "Whoever wears an amulet has committed shirk" (Ahmad), (iii) the Companions (like Ibn Mas\'ud) prohibited amulets. (2) Amulets containing non-Quranic content (symbols, numbers, unknown words, names of jinn/saints): Strictly prohibited — this is shirk if you believe the object itself has protective power. (3) Evil eye bracelet / Nazar bead / Hamsa: These are cultural symbols (common in Middle Eastern and South Asian cultures) believed to ward off the evil eye. (a) If you believe the bracelet itself protects you: This is shirk — protection comes only from Allah. (b) If you wear it as decoration or cultural adornment without believing it has power: Some scholars permit it, others discourage it because it resembles practices of shirk. The safest view: avoid it. (4) Wearing Quran verses as jewelry (necklace, bracelet): Same debate as amulets. Some scholars permit if you believe Allah protects and the jewelry is a reminder. Others say it is disrespectful to wear Quran as jewelry (it may be taken into impure places like the bathroom). (5) The Prophet\'s practice: He taught du\'a and dhikr for protection, NOT amulets. (6) Authentic protection: Morning/evening adhkar, Ayat al-Kursi, the three Quls, Surah Al-Mulk, and reliance on Allah. (7) If you have been wearing an amulet: Remove it, make du\'a to Allah for protection, and follow the authentic Sunnah of morning/evening adhkar. (8) The key principle: "And if Allah should touch you with harm, none can remove it but He" (Quran 6:17). All protection is from Allah alone. (9) Follow the scholar you trust on this matter.',
    sources: [
      'Musnad Ahmad, Hadith 16968 (whoever wears an amulet has committed shirk)',
      'Quran, Surah Al-An\'am 6:17 (protection is from Allah alone)',
      'Sahih al-Bukhari, Book of Medicine (Prophet taught du\'a, not amulets)',
      'Ibn Taymiyyah, Majmu\' al-Fatawa (prohibition of amulets)',
    ],
  },
  {
    patterns: [
      /is.*wishing.*ramadan.*mubarak.*correct/i, /is.*saying.*ramadan.*mubarak.*bidah/i,
      /what.*to.*say.*in.*ramadan/i, /is.*ramadan.*kareem.*correct/i,
      /ramadan.*mubarak.*vs.*kareem/i, /is.*saying.*eid.*mubarak.*halal/i,
    ],
    keywords: ['ramadan mubarak', 'ramadan kareem', 'say in ramadan', 'eid mubarak', 'ramadan greetings', 'is ramadan mubarak bidah'],
    answer: 'Greeting people in Ramadan and on Eid is a good practice. (1) "Ramadan Mubarak" (Blessed Ramadan): A common, acceptable greeting. It is not a religious obligation nor a bid\'ah — it is a cultural/religious greeting expressing good wishes. (2) "Ramadan Kareem" (Generous Ramadan): Also commonly used. Some scholars (like Shaykh Ibn Uthaymeen) noted that saying "Ramadan Kareem" is not quite right because it is Ramadan that is generous (by Allah\'s making), and the proper response would be "Allahu Akram" (Allah is more generous). However, the majority of scholars see no problem with it as a greeting. (3) The Prophet\'s practice: The Prophet (PBUH) would give glad tidings to his companions at the arrival of Ramadan. He said: "Ramadan has come to you — a month of blessing in which Allah covers you with mercy, removes sins, and answers prayers" (Tabarani). So congratulating people on Ramadan\'s arrival is from the Sunnah. (4) "Eid Mubarak" (Blessed Eid): A common, permissible greeting on Eid. The Prophet\'s companions used to say to each other on Eid: "Taqabbal Allahu minna wa minkum (May Allah accept from us and from you)" — this is an established practice. (5) The Prophet (PBUH) said: "They (the angels) say Ameen to your du\'a, so congratulate each other" — some interpret this as encouraging mutual greetings on good occasions. (6) What to say in Ramadan: Any good greeting is fine — "Ramadan Mubarak," "Ramadan Kareem," or simply "May Allah bless your Ramadan." (7) Other recommended sayings: When you break your fast, the Prophet (PBUH) said the du\'a is not rejected: "Dhahabadh-dhama\'u wabtallatil-\'uruqu wa thabatal-ajru inshaAllah (The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills)" (Abu Dawud). (8) Do not over-think greetings — the spirit is to share joy and good wishes, which is from the Sunnah.',
    sources: [
      'Musnad Al-Bazzar / Tabarani (Prophet gave glad tidings of Ramadan)',
      'Jami\' at-Tirmidhi (companions said Taqabbal Allahu minna wa minkum on Eid)',
      'Sunan Abi Dawud, Book of Fasting, Hadith 2357 (du\'a at iftar)',
    ],
  },
  {
    patterns: [
      /is.*vaping.*nicotine.*haram/i, /is.*vape.*without.*nicotine.*halal/i,
      /is.*e.*cigarette.*haram/i, /is.*hookah.*haram/i, /is.*shisha.*haram/i,
      /is.*nicotine.*haram/i, /is.*zyn.*haram/i, /is.*snus.*haram/i,
    ],
    keywords: ['vaping nicotine haram', 'vape without nicotine', 'e cigarette haram', 'hookah haram', 'shisha haram', 'nicotine haram', 'zyn haram', 'snus haram'],
    answer: 'The rulings on modern nicotine/tobacco products. (1) The general principle: "Whatever intoxicates in large quantities, a small amount is haram" (Abu Dawud, Tirmidhi). And: "Do not throw yourselves into destruction" (Quran 2:195). And: "Do not kill yourselves" (Quran 4:29). (2) Cigarettes / tobacco: The majority of contemporary scholars hold that smoking is haram or at least strongly prohibited (makruh tahrimi), because: (a) it is scientifically proven to cause cancer, heart disease, and death — harming the body which is a trust from Allah. (b) it wastes money. (c) it harms others through secondhand smoke. Some older scholars (before the health effects were known) considered it makruh (disliked) rather than haram. (3) Vaping (e-cigarettes): (a) With nicotine: Harmful — nicotine is addictive and has health risks. The majority consider it haram or strongly discouraged, like smoking. (b) Without nicotine: Still involves inhaling chemicals into the lungs with unknown long-term effects. Most scholars discourage it. Some say it is less haram than smoking but still not recommended. (4) Hookah / Shisha: Same ruling as smoking — haram or strongly discouraged due to health harm. Hookah smoke contains toxins and is often worse than cigarettes in terms of smoke volume. (5) Nicotine pouches (Zyn, snus): These do not involve smoking, so the respiratory harm is avoided. However: (a) nicotine is addictive and has cardiovascular effects. (b) Some scholars permit them as a harm-reduction tool for quitting smoking. (c) Others say any addictive substance that harms the body is haram. (d) The cautious view: avoid them unless using as a step to quit smoking. (6) Chewing tobacco: Same as smoking — harmful to health, haram or discouraged. (7) The body is a trust: The Prophet (PBUH) said: "Your body has a right over you" (Bukhari). Harming it deliberately is contrary to this. (8) If you are addicted: (a) Make du\'a for strength. (b) Seek medical help (nicotine patches, counseling, medications). (c) Gradually reduce. (d) Allah forgives — keep trying to quit. (9) Secondhand smoke: Harming others is also haram — do not smoke around children, family, or in public. (10) The safest position: avoid all tobacco and nicotine products.',
    sources: [
      'Quran, Surah Al-Baqarah 2:195 (do not throw yourselves into destruction)',
      'Quran, Surah An-Nisa 4:29 (do not kill yourselves)',
      'Sunan Abi Dawud, Book of Drinks, Hadith 3681 (intoxicants principle)',
      'Contemporary fatwas (majority hold smoking is haram due to proven harm)',
    ],
  },
  {
    patterns: [
      /is.*working.*in.*haram.*restaurant.*haram/i, /is.*working.*in.*supermarket.*selling.*alcohol.*haram/i,
      /is.*working.*in.*place.*that.*sells.*pork/i, /is.*serving.*alcohol.*haram/i,
      /is.*working.*in.*pub.*haram/i, /is.*working.*in.*casino.*haram/i,
      /is.*working.*in.*bank.*that.*charges.*interest/i,
    ],
    keywords: ['working haram restaurant', 'selling alcohol haram', 'working supermarket alcohol', 'serving alcohol haram', 'working pub haram', 'working casino haram', 'working bank interest'],
    answer: 'Working in a place that involves haram depends on the nature of your involvement. (1) Direct involvement in haram: Haram — if your job directly involves: (a) selling alcohol, pork, or haram items, (b) serving or preparing alcohol, (c) working in a casino/gambling establishment, (d) working in a bank dealing with interest-based transactions, (e) any job whose primary function is facilitating haram. The Prophet (PBUH) cursed ten people related to alcohol: the maker, the one who has it made, the drinker, the one who carries it, the one to whom it is carried, the one who serves it, the one who sells it, the one who profits from it, the buyer, and the one for whom it is bought (Tirmidhi, Ibn Majah). (2) Indirect involvement (working in a place that also sells haram): (a) If you work in a supermarket that sells both halal and haram items, and your job is stocking shelves or being a cashier (scanning all items including haram): some scholars permit it if you cannot find other work, while others discourage it. The income may be mixed. The safer position is to seek employment that does not involve haram at all. (b) If you work in a restaurant that serves both halal and haram food and your job is cooking/serving both: problematic. If you only cook/serve the halal food, it is better. (3) Working in a conventional bank: (a) If your role directly involves interest-based transactions (loan officer, interest calculation): haram. (b) If your role is IT, security, cleaning, or maintenance: some scholars permit it because your work itself is not haram, though you are in a haram environment. The cautious view is to seek alternatives. (c) Working in an Islamic bank is halal. (4) If you cannot find another job: (a) Some scholars permit continuing while actively seeking halal employment, based on necessity. (b) Make du\'a for a halal job. (c) Keep looking — Allah will provide. The Prophet (PBUH) said: "Whoever abandons something for the sake of Allah, Allah replaces it with something better." (5) Income from haram work: The income is haram — you should not consume it, and you should give away what you earned from haram as charity (without reward for yourself). (6) If you are in such a job: make tawbah, seek a halal alternative, and transition as soon as you can. (7) Consult a scholar for your specific situation.',
    sources: [
      'Jami at-Tirmidhi, Book of Drinks, Hadith 1845 (ten cursed related to alcohol)',
      'Contemporary fatwas on working in haram environments',
      'Quran, Surah Al-Baqarah 2:275 (riba prohibition)',
    ],
  },
  {
    patterns: [
      /is.*fasting.*on.*monday.*and.*thursday.*sunnah/i, /why.*did.*prophet.*fast.*monday.*thursday/i,
      /is.*fasting.*white.*days.*sunnah/i, /ayyam.*al.*bidh/i, /voluntary.*fasting.*islam/i,
      /best.*days.*to.*fast/i, /is.*fasting.*muharram.*sunnah/i, /ashura.*fasting/i,
    ],
    keywords: ['fasting monday thursday', 'why prophet fast monday thursday', 'white days fasting', 'ayyam al bidh', 'voluntary fasting', 'best days to fast', 'fasting muharram', 'ashura fasting'],
    answer: 'Voluntary fasting is highly recommended and brings immense reward. Here are the main Sunnah fasts: (1) Fasting Mondays and Thursdays: The Prophet (PBUH) fasted these days regularly. When asked why, he said: "The deeds of people are presented to Allah on Monday and Thursday, and I like my deeds to be presented while I am fasting" (Tirmidhi, Ahmad). (2) The White Days (Ayyam al-Bidh): The 13th, 14th, and 15th of every Islamic month. The Prophet (PBUH) said: "Fasting three days of every month is fasting for a lifetime, and the white days are the 13th, 14th, and 15th" (Nasai). They are called "white" because the nights are lit by the full moon. (3) Fasting the 9th and 10th of Muharram (Ashura and Tasu\'a): The Prophet (PBUH) fasted Ashura (10th Muharram) and said: "If I live until next year, I will fast the 9th too" (Muslim) — to differ from the Jews who fasted only the 10th. Ashura commemorates Allah saving Musa (Moses) from Pharaoh. Fasting Ashura expiates the sins of the previous year (Muslim). (4) Fasting the 9th of Dhul-Hijjah (Day of Arafah): For those not performing Hajj, fasting on the Day of Arafah expiates the sins of the previous year and the coming year (Muslim). (5) Fasting six days of Shawwal (after Ramadan): The Prophet (PBUH) said: "Whoever fasts Ramadan and then follows it with six days of Shawwal, it is as if he fasted the entire year" (Muslim). (6) Fasting in the month of Sha\'ban: The Prophet (PBUH) used to fast most of Sha\'ban. Aisha (RA) said: "I never saw the Prophet fast a month more than Sha\'ban" (Bukhari). (7) Fasting every other day (fast of Dawud): The Prophet (PBUH) said: "The best fasting is the fasting of Dawud — he used to fast one day and break his fast one day" (Bukhari, Muslim). (8) What NOT to fast: (a) Eid al-Fitr (1st Shawwal) — haram to fast. (b) Eid al-Adha (10th Dhul-Hijjah) and the 11th, 12th, 13th (days of Tashreeq) — haram to fast unless you are doing Hajj and don\'t have a sacrificial animal. (c) Specifically singling out Friday for fasting — the Prophet (PBUH) said: "Do not fast on Friday unless you fast a day before or after" (Bukhari). (d) Singling out Saturday — debated, some discourage it. (9) You can combine: fast Monday AND the white days if they coincide. (10) Start with what is easy — even one voluntary fast a month is rewarding.',
    sources: [
      'Jami at-Tirmidhi, Book of Fasting, Hadith 747 (Monday/Thursday)',
      'Sahih Muslim, Book of Fasting, Hadith 1162 (Ashura expiates sins)',
      'Sahih Muslim, Book of Fasting, Hadith 1162 (Day of Arafah expiates two years)',
      'Sahih Muslim, Book of Fasting, Hadith 1164 (six of Shawwal = lifetime)',
      'Sahih al-Bukhari, Book of Fasting, Hadith 1979 (fast of Dawud)',
    ],
  },
  {
    patterns: [
      /what.*is.*dhikr/i, /how.*to.*do.*dhikr/i, /best.*dhikr/i, /morning.*evening.*dhikr/i,
      /tasbih.*tahmeed.*takbeer/i, /is.*counting.*tasbih.*beads.*bidah/i, /dhikr.*beads/i,
      /tasbih.*after.*prayer/i, /how.*many.*tasbih.*after.*prayer/i,
    ],
    keywords: ['what is dhikr', 'how to do dhikr', 'best dhikr', 'morning evening dhikr', 'tasbih tahmeed takbeer', 'tasbih beads bidah', 'dhikr beads', 'tasbih after prayer'],
    answer: 'Dhikr (remembrance of Allah) is one of the most powerful and accessible acts of worship. (1) The Quran says: "So remember Me; I will remember you" (2:152). And: "The men who remember Allah and the women who remember — Allah has prepared for them forgiveness and a great reward" (33:35). (2) The Prophet (PBUH) said: "The example of the one who remembers his Lord and the one who does not is like the living and the dead" (Bukhari). (3) Best dhikr: The Prophet (PBUH) said: "The best dhikr is La ilaha illallah (there is no god but Allah), and the best du\'a is Alhamdulillah (all praise is for Allah)" (Tirmidhi, Ibn Majah). (4) Tasbih after prayer: After every obligatory prayer, the Prophet (PBUH) taught: (a) "Subhanallah" 33 times. (b) "Alhamdulillah" 33 times. (c) "Allahu Akbar" 33 times. (d) Then say: "La ilaha illallah wahdahu la sharika lah, lahul mulk wa lahul hamd wa huwa \'ala kulli shay\'in qadeer" — 1 time. Total: 100. The Prophet (PBUH) said: "Whoever says this after every prayer, his sins are forgiven even if they are like the foam of the sea" (Muslim). (5) Morning and evening dhikr: The Prophet (PBUH) taught specific du\'as for morning (after Fajr) and evening (after Asr) for protection and blessing. These include: (a) Surah Al-Ikhlas, Al-Falaq, An-Nas (three times each). (b) Ayat al-Kursi (once). (c) "Bismillahil-ladhi la yadurru ma\'asmihi shay\'un fil-ardi wa la fis-sama" (three times). (d) "Subhanallahi wa bihamdihi" (100 times). (e) "La ilaha illallah wahdahu la sharika lah..." (10 or 100 times). (6) Counting beads (tasbih/misbaha): Some scholars consider using prayer beads a bid\'ah because the Companions used their fingers. Others permit it as a convenience. The Prophet (PBUH) said: "Count on your fingers, for they will be asked and will speak" (Tirmidhi, Abu Dawud). Using fingers is the Sunnah; using beads is permitted but not from the Sunnah. (7) Continuous dhikr: The Prophet (PBUH) said: "Keep your tongue moist with the remembrance of Allah" (Tirmidhi). This means saying "Subhanallah, Alhamdulillah, La ilaha illallah, Allahu Akbar" throughout the day — while walking, driving, waiting. (8) Istighfar (seeking forgiveness): The Prophet (PBUH) said: "Whoever says: Astaghfirullahal-ladhi la ilaha illa Huwal Hayyul Qayyuma wa atubu ilayh — his sins are forgiven even if he fled from the battlefield" (Abu Dawud, Tirmidhi). Say it at least 100 times daily. (9) Salawat (blessings on the Prophet): "Allahumma salli \'ala Muhammad wa \'ala aali Muhammad" — the Prophet (PBUH) said: "Whoever sends blessings on me once, Allah sends blessings on him ten times" (Muslim). (10) Dhikr is the easiest way to earn immense reward — no wudu needed, can be done anywhere, anytime.',
    sources: [
      'Quran, Surah Al-Baqarah 2:152 (remember Me)',
      'Sahih Muslim, Book of Dhikr, Hadith 597 (tasbih after prayer)',
      'Jami at-Tirmidhi, Book of Dhikr (best dhikr)',
      'Sahih al-Bukhari, Book of Prayer (count on fingers)',
    ],
  },
  {
    patterns: [
      /is.*tattooing.*eyebrows.*haram/i, /is.*microblading.*haram/i, /is.*microblading.*eyebrows/i,
      /is.*permanent.*makeup.*haram/i, /is.*semi.*permanent.*makeup.*haram/i,
      /is.*tattoo.*eyebrows.*islam/i, /is.*feathering.*brows.*haram/i,
    ],
    keywords: ['microblading haram', 'permanent makeup haram', 'semi permanent makeup', 'tattooing eyebrows', 'microblading eyebrows', 'feathering brows', 'permanent makeup islam'],
    answer: 'Microblading and permanent makeup are forms of cosmetic tattooing — and the ruling follows the tattoo ruling. (1) Tattooing is haram: The Prophet (PBUH) cursed the one who does tattoos and the one who gets them (Bukhari). The majority of scholars consider tattoos haram because: (a) it involves changing Allah\'s creation, (b) it involves inserting pigment into the skin permanently, (c) it may prevent water from reaching the skin in wudu (if it forms a solid layer). (2) Microblading (eyebrow tattooing): This is a form of tattooing — pigment is inserted into the skin with small cuts. The majority of scholars consider it haram for the same reasons as tattoos. It is a cosmetic tattoo. (3) Permanent makeup (eyeliner, lip color, etc.): Same ruling — it is tattooing, and the majority consider it haram. (4) Semi-permanent makeup: Even if it fades over time, it still involves inserting pigment into the skin. The ruling is the same as permanent — haram by the majority. (5) Distinction from regular makeup: Regular makeup (applied on the surface, washed off) is permissible (with conditions about modesty and content). Microblading/permanent makeup is different because it is inserted into the skin. (6) The exception — some scholars\' view: A minority of contemporary scholars permit microblading/permanent makeup if: (a) it is not on the eyebrows (to avoid the eyebrow-plucking prohibition), (b) it does not form a waterproof layer that prevents wudu, (c) it is for medical/aesthetic reasons (like scars). However, the majority view is that it is haram. (7) If you have already gotten microblading/permanent makeup: (a) Make tawbah. (b) It is not obligatory to remove it if removal causes harm, but it is recommended if safe. (c) If it forms a waterproof layer, it may affect wudu — check with a scholar. (d) You can still pray — the tattoo is under the skin. (8) Alternatives: Regular eyebrow pencils, powders, and gels (applied on the surface, washed off daily) are permissible for women (in front of other women or their husbands, not in front of non-mahram men). (9) Follow the scholar you trust on this matter.',
    sources: [
      'Sahih al-Bukhari, Book of Dress, Hadith 5937 (curse on tattoos)',
      'Contemporary fatwas on microblading and permanent makeup',
      'General tattoo ruling applied to cosmetic tattooing',
    ],
  },
  {
    patterns: [
      /is.*fasting.*while.*traveling.*allowed/i, /should.*i.*fast.*while.*traveling/i,
      /is.*it.*better.*to.*fast.*or.*break.*fast.*when.*traveling/i, /qasr.*fasting/i,
      /travel.*fasting.*ruling/i, /can.*i.*fast.*on.*a.*plane/i,
    ],
    keywords: ['fasting while traveling', 'should i fast traveling', 'break fast traveling', 'qasr fasting', 'travel fasting ruling', 'fast on plane'],
    answer: 'Travelers have a concession regarding fasting during Ramadan. (1) The Quran says: "Whoever is sick or on a journey — then [an equal number] of other days. Allah intends for you ease and does not intend for you hardship" (2:185). (2) The ruling: A traveler (on a journey of more than ~80km or whatever is considered "travel" in local custom) has the OPTION to fast or break the fast. Both are permissible. (3) What is better: The majority of scholars say it is BETTER to break the fast while traveling (to take the concession Allah gave), and make up the fast later. The Prophet (PBUH) said: "It is not righteousness to fast while traveling" (Bukhari). However, some scholars (including some Companions) preferred to fast while traveling if it was not too difficult. (4) If fasting is difficult while traveling: You should break the fast — the Prophet (PBUH) saw a man being shaded while fasting on a journey and said: "It is not righteousness to fast while traveling" (Bukhari). (5) If fasting is easy (e.g., short flight, not too hot): You may fast if you prefer, but breaking it is still permissible and recommended by the majority. (6) When does the traveler\'s concession apply: From the time you leave your city (pass the built-up area) until you return. If you intend to stay in the destination for more than 4 days (majority view) or 15 days (Hanafi view), you are no longer considered a traveler and must fast/pray full. (7) Making up: Missed fasts while traveling must be made up on other days before the next Ramadan. (8) Shortening prayers (Qasr): While traveling, 4-rakat prayers are shortened to 2 rakats (Dhuhr, Asr, Isha). This is separate from the fasting concession. You can combine prayers (Jam\') and shorten them while traveling. (9) Can you fast on a plane: Yes, but it may be easier to break the fast due to the travel concession. If you choose to fast, your fast is valid — follow the prayer times of your location (or the country you are flying over, depending on the scholar you follow for high-altitude fasting). (10) If you started the day fasting at home and then started traveling during the day: The majority say you may continue or break — some say once you start, you should complete. (11) If you were traveling and return home during the day: The majority say you do not start fasting mid-day — you make up the day later.',
    sources: [
      'Quran, Surah Al-Baqarah 2:185 (traveler concession)',
      'Sahih al-Bukhari, Book of Fasting, Hadith 1946 (not righteousness to fast while traveling)',
      'Sahih Muslim, Book of Fasting (concession for travelers)',
    ],
  },
  {
    patterns: [
      /is.*plucking.*white.*hair.*haram/i, /is.*dyeing.*white.*hair.*sunnah/i,
      /is.*it.*haram.*to.*pluck.*gray.*hair/i, /does.*plucking.*white.*hair.*cause.*more/i,
      /kina.*white.*hair/i, /should.*muslim.*dye.*gray.*hair/i,
    ],
    keywords: ['plucking white hair haram', 'dyeing white hair sunnah', 'pluck gray hair haram', 'plucking white hair', 'dye gray hair', 'white hair islam'],
    answer: 'Plucking white/gray hair is discouraged, and dyeing it is recommended. (1) The Prophet (PBUH) said: "Do not pluck white hairs, for no Muslim grows old in Islam while his white hairs increase in Islam except that it is light for him on the Day of Resurrection" (Abu Dawud, Nasai, classed as hasan). So white hairs are a source of light and reward on the Day of Judgment — plucking them is discouraged. (2) Dyeing white hair: Recommended (Sunnah). The Prophet (PBUH) said: "The Jews and Christians do not dye their hair, so differ from them" (Bukhari, Muslim). (3) What colors to use: (a) The Prophet (PBUH) used henna and katam (a plant-based dye). (b) The majority of scholars permit any color EXCEPT black. The Prophet (PBUH) said: "At the end of time there will be people who will dye their hair black; they will not smell the fragrance of Paradise" (Abu Dawud, Nasai). (c) Some scholars interpret the prohibition on black as applying specifically to young men dyeing to deceive about their age. Others hold it is generally disliked. The safest is to avoid pure black. (d) Permitted colors: brown, dark brown, reddish (henna), blonde, etc. (4) Henna: The best and most Sunnah dye. It gives a reddish/orange color. The Prophet (PBUH) used it and recommended it. (5) Why dye: (a) to differ from Jews and Christians (who traditionally did not dye). (b) to look good for one\'s spouse. (c) to maintain a dignified appearance. (6) For women: Same ruling — dyeing is recommended, avoid pure black, henna is excellent. (7) If you have white hairs at a young age: do not be embarrassed — it is a sign of wisdom and a source of reward. Dye them if you wish. (8) Chemical dyes: Permitted as long as they do not contain haram ingredients and do not form a waterproof layer that prevents wudu (most hair dyes do not prevent wudu because they penetrate the hair shaft). (9) Do not pluck white hairs — dye them instead. (10) Some scholars say trimming white hairs (cutting with scissors) is fine, unlike plucking (which pulls from the root).',
    sources: [
      'Sunan Abi Dawud, Book of Dress, Hadith 4202 (do not pluck white hairs)',
      'Sahih al-Bukhari, Book of Dress, Hadith 5899 (differ by dyeing)',
      'Sunan Abi Dawud, Book of Dress, Hadith 4211 (black dye)',
    ],
  },
  {
    patterns: [
      /is.*asking.*scholar.*obligatory/i, /who.*is.*qualified.*scholar/i,
      /how.*to.*find.*a.*scholar/i, /what.*is.*fatwa/i, /can.*i.*follow.*any.*imam/i,
      /taqleed.*islam/i, /do.*i.*need.*to.*follow.*madhhab/i,
    ],
    keywords: ['asking scholar obligatory', 'who is qualified scholar', 'how to find scholar', 'what is fatwa', 'follow any imam', 'taqleed islam', 'follow madhhab'],
    answer: 'Seeking knowledge from qualified scholars is an important part of Islam. (1) The Quran says: "Ask the people of knowledge if you do not know" (16:43, 21:7). (2) Who is a qualified scholar (\'Alim): Someone who has: (a) studied the Quran, hadith, and Islamic jurisprudence (fiqh) under qualified teachers for many years, (b) memorized or deeply studied the Quran and major hadith collections, (c) understanding of the Arabic language, (d) knowledge of the principles of jurisprudence (usul al-fiqh), (e) wisdom and piety. (3) What is a fatwa: A fatwa is a non-binding scholarly opinion on a religious question, given by a qualified scholar (mufti). It is based on the Quran, Sunnah, and the methodologies of Islamic jurisprudence. A fatwa is not a law — it is guidance. (4) Do you need to follow a madhhab (school of thought): (a) The four major schools (Hanafi, Maliki, Shafi\'i, Hanbali) are valid paths of Islamic jurisprudence. (b) Some scholars say you must follow one school consistently (taqleed). (c) Others say you can take from any school as long as you follow qualified scholars. (d) The majority hold that laypeople should follow a scholar they trust, whether that scholar follows a specific school or not. (5) How to find a scholar: (a) Local imam at your mosque. (b) Islamic centers and organizations. (c) Trusted online fatwa services (IslamQA.org, SeekersGuidance, Yaqeen Institute). (d) Scholars known in your community. (6) Can you follow any imam: You should follow a scholar who is qualified and whose methodology is sound. Not everyone who gives religious opinions is qualified — be careful of self-taught "scholars" on social media. (7) When to seek a fatwa: When you face a specific question about halal/haram, worship, or daily life that you cannot answer from the basic sources. (8) Can you switch scholars: Yes — if you move, or if you find a more qualified scholar, you may follow someone else. However, "fatwa shopping" (asking until you get the answer you want) is discouraged. (9) Laypeople and independent reasoning (ijtihad): A layperson does not do ijtihad (independent legal reasoning) — they follow scholars. But they should learn the basics of their religion. (10) The Prophet (PBUH) said: "Allah does not take away knowledge by snatching it, but He takes it away by taking the scholars" (Bukhari). Seek knowledge before it is gone.',
    sources: [
      'Quran, Surah An-Nahl 16:43 (ask people of knowledge)',
      'Sahih al-Bukhari, Book of Knowledge, Hadith 71 (knowledge taken with scholars)',
      'Classical works on usul al-fiqh (principles of jurisprudence)',
    ],
  },
  {
    patterns: [
      /what.*is.*sadaqah/i, /difference.*zakat.*sadaqah/i, /types.*of.*sadaqah/i,
      /best.*sadaqah/i, /sadaqah.*jariyah/i, /is.*smiling.*sadaqah/i,
      /can.*sadaqah.*be.*non.*money/i, /reward.*for.*charity.*islam/i,
    ],
    keywords: ['what is sadaqah', 'difference zakat sadaqah', 'types of sadaqah', 'best sadaqah', 'sadaqah jariyah', 'is smiling sadaqah', 'sadaqah non money', 'reward charity islam'],
    answer: 'Sadaqah is voluntary charity — any act of kindness or giving for the sake of Allah. It is broader than zakat and includes both material and non-material giving. (1) The Quran says: "Whatever you spend of good is for parents, relatives, orphans, the needy, and the traveler — whatever you do of good, Allah knows it" (2:215). (2) The Prophet (PBUH) said: "Charity (sadaqah) is a proof" (Muslim) — meaning it proves your faith and your concern for others. (3) Difference between Zakat and Sadaqah: (a) Zakat is obligatory (2.5% of qualifying wealth annually). Sadaqah is voluntary. (b) Zakat has specific recipients (8 categories in Quran 9:60). Sadaqah can be given to anyone in need. (c) Zakat is a fixed amount. Sadaqah can be any amount. (d) Zakat purifies wealth. Sadaqah brings additional reward. (4) Types of Sadaqah: (a) Money: giving to the poor, needy, orphans, mosques, schools, hospitals. (b) Non-money: the Prophet (PBUH) said: "Every bone of the human body must give sadaqah each day the sun rises: judging justly between two people is sadaqah; helping a man onto his mount or lifting his luggage is sadaqah; a good word is sadaqah; every step you take toward prayer is sadaqah; and removing harmful objects from the path is sadaqah" (Bukhari, Muslim). (5) Smiling: The Prophet (PBUH) said: "Your smile to your brother is sadaqah" (Tirmidhi, classed as hasan). (6) Sadaqah Jariyah (continuous charity): Charity that continues to benefit people after your death and earns you reward continuously. Examples: building a mosque, digging a well, planting a tree, writing a book, funding a school, sponsoring an orphan. The Prophet (PBUH) said: "When a person dies, his deeds end except three: continuous charity, beneficial knowledge, or a righteous child who prays for him" (Muslim). (7) Best sadaqah: The Prophet (PBUH) said: "The best charity is that given out of what is left after you have provided for your family" (Bukhari). And: "The most beloved deed to Allah is the one done regularly, even if small" (Bukhari). (8) Giving in secret: The Prophet (PBUH) said: "Seven whom Allah will shade on the Day when there is no shade but His... a man who gives charity so secretly that his left hand does not know what his right hand gave" (Bukhari, Muslim). (9) Even a small amount: "Do not belittle any good deed, even meeting your brother with a cheerful face" (Muslim). (10) Sadaqah increases wealth — the Prophet (PBUH) said: "Charity does not decrease wealth" (Muslim). It purifies and blesses your wealth.',
    sources: [
      'Sahih al-Bukhari, Book of Funerals, Hadith 1295 (judging justly is sadaqah)',
      'Sahih Muslim, Book of Funerals, Hadith 1631 (three deeds that continue after death)',
      'Jami at-Tirmidhi, Book of Manners, Hadith 1956 (smile is sadaqah)',
      'Sahih Muslim, Book of Piety, Hadith 2588 (charity does not decrease wealth)',
    ],
  },
];

function normalizeNumbers(text: string): string {
  return text
    .replace(/\b4\b/g, 'four')
    .replace(/\b3\b/g, 'three')
    .replace(/\b2\b/g, 'two')
    .replace(/\b1\b/g, 'one');
}

function isQuestion(message: string): boolean {
  const lower = message.toLowerCase().trim();

  // Exclude emotional/personal statements — those go to the empathetic path.
  const emotionalMarkers = [
    /\bi feel\b/, /\bi am feeling\b/, /\bim feeling\b/, /\bi'm feeling\b/,
    /\bi am so\b/, /\bi am really\b/, /\bi am struggling\b/,
    /\bi am sad\b/, /\bi am anxious\b/, /\bi am scared\b/,
    /\bi am depressed\b/, /\bi am lonely\b/, /\bi am lost\b/,
    /\bi am hopeless\b/, /\bi am angry\b/, /\bi am tired\b/,
    /\bi am worried\b/, /\bi am stressed\b/, /\bi am hurting\b/,
    /\bi am broken\b/, /\bi am exhausted\b/, /\bi am overwhelmed\b/,
    /\bhelp me\b/, /\bi need help\b/, /\bi cant\b/, /\bi can't\b/,
    /\bi have been\b/, /\bmy heart\b/, /\bmy mind\b/, /\bmy soul\b/,
    /\bplease pray\b/, /\bmake dua\b/, /\bmaking dua\b/,
  ];
  const isEmotional = emotionalMarkers.some((re) => re.test(lower));

  // If the message is clearly emotional AND short (no complex question structure),
  // treat it as emotional support, not a factual question.
  const wordCount = lower.split(/\s+/).length;
  if (isEmotional && wordCount < 25) return false;

  // Detect question structure — must have a question mark OR start with a
  // question word OR contain a question phrasing anywhere in the message.
  const hasQuestionMark = lower.includes('?');

  const questionStarters = [
    'is ', 'are ', 'was ', 'were ', 'can ', 'could ', 'should ',
    'what ', 'why ', 'how ', 'does ', 'do ', 'did ', 'will ', 'would ',
    'is it ', 'are there ', 'has ', 'have ', 'may ', 'must ',
    'shall ', 'whats ', "what's ",
  ];
  const startsWithQuestion = questionStarters.some((m) => lower.startsWith(m));

  // Also detect question phrasings anywhere in the message (not just the start),
  // to catch messages like "I was wondering, is it permissible to..."
  const questionPhrasings = [
    /\bis it (permissible|haram|halal|allowed|forbidden|obligatory|wrong|sin)\b/,
    /\bcan (i|we|a |muslim|women|men|someone)\b.*\?/,
    /\bis (this|that|it)\b.*\?/,
    /\bdoes islam\b/, /\bwhat does islam\b/, /\bwhat does islam say\b/,
    /\bdoes allah\b/, /\bdoes the prophet\b/, /\bdid the prophet\b/,
    /\bwhat is the ruling\b/, /\bwhat is the islamic\b/,
    /\bis there a ruling\b/, /\bwhat do scholars\b/,
  ];
  const hasQuestionPhrasing = questionPhrasings.some((re) => re.test(lower));

  if (!hasQuestionMark && !startsWithQuestion && !hasQuestionPhrasing) return false;

  // Must relate to Islam/religion — broad list of Islamic terms and topics
  const islamicTerms = [
    'islam', 'islamic', 'muslim', 'muslims', 'quran', "qur'an", 'koran',
    'prophet', 'muhammad', 'mohammad', 'pbuh', 'saw', 'hadith', 'hadees',
    'sunnah', 'allah', 'god', 'haram', 'halal', 'sin', 'sinful',
    'permissible', 'prohibited', 'forbidden', 'allowed', 'obligatory',
    'wajib', 'fard', 'mustahab', 'makruh', 'sharia', 'fiqh', 'ruling',
    'prayer', 'salah', 'salat', 'fasting', 'fast', 'ramadan', 'zakat', 'hajj',
    'mosque', 'masjid', 'imam', 'scholar', 'fatwa',
    'jannah', 'jahannam', 'paradise', 'hell', 'afterlife', 'day of judgment',
    'marriage', 'nikah', 'divorce', 'talaq', 'mahr', 'dowry', 'wife', 'wives',
    'women', 'men', 'husband', 'family', 'dog', 'tattoo',
    'beard', 'music', 'drawing', 'art', 'birthday', 'celebrat',
    'gay', 'homosexual', 'suicide', 'death', 'depression', 'mental',
    'date', 'dating', 'courtship', 'riba', 'interest',
    'gold', 'silk', 'nailpolish', 'nail polish', 'nailpaint', 'nail paint',
    'wear', 'wudu', 'ablution', 'clothing', 'dress',
    'alcohol', 'wine', 'beer', 'pork', 'bacon', 'gambling', 'lottery', 'bet',
    'weed', 'cannabis', 'marijuana', 'smoking', 'cigarette', 'vape', 'vaping',
    'hijab', 'niqab', 'burqa', 'headscarf', 'veil', 'awrah', 'nakedness',
    'eyebrow', 'eyebrows', 'hair dye', 'hair color', 'makeup', 'cosmetic',
    'photograph', 'photo', 'selfie', 'camera', 'picture',
    'halloween', 'christmas', 'valentine', 'new year', 'holiday', 'eid',
    'polygamy', 'polygyny', 'second wife', 'four wives', '4 wives', 'multiple wives',
    'jihad', 'holy war', 'jesus', 'isa', 'messiah', 'mary', 'maryam',
    'suffering', 'evil', 'predestination', 'qadar', 'destiny', 'free will',
    'black magic', 'sihr', 'witchcraft', 'evil eye', 'nazar', 'hasad', 'envy',
    'jinn', 'possess', 'abortion',
    'masturbation', 'handshake', 'cat', 'cats', 'chess', 'video game', 'gaming',
    'crypto', 'bitcoin', 'stock', 'invest', 'insurance',
    'missed fast', 'qada', 'kaffarah', 'combine prayer', 'shorten prayer',
    'adopt', 'adoption', 'orphan', 'foster',
    'backbiting', 'gossip', 'lying', 'nasheed', 'singing',
    'sock', 'khuff', 'khuffain', 'leather sock',
    'bank', 'job', 'work', 'income', 'gaze', 'lower gaze',
    'halal meat', 'slaughter', 'zabihah', 'kosher',
    'menstruation', 'period', 'haidh',
    'istikhara', 'guidance prayer',
    'greeting', 'salaam', 'non muslim', 'non-muslim',
    'crush', 'like someone', 'like a guy', 'like a girl',
    'arranged marriage', 'propose', 'get married', 'marry',
    'online relationship', 'online dating', 'chatting', 'texting',
    'dua', 'dhikr', 'repent', 'tawbah', 'sin',
    'khitan', 'circumcision', 'halal food',
    'freemason', 'magic', 'astrology', 'horoscope', 'zodiac', 'palm reading',
    'juma', 'jumuah', 'friday prayer', 'congregation',
    'janazah', 'funeral', 'grave', 'burial', 'cremation',
    'shirk', 'kufr', 'bidah', 'innovation',
    'left hand', 'left handed', 'swearing', 'cursing', 'profanity', 'foul language',
    'guitar', 'piano', 'drums', 'daff', 'flute', 'violin', 'instrument',
    'savings account', 'interest money', 'bank interest',
    'love marriage', 'forced marriage', 'arranged marriage', 'interfaith', 'marry non',
    'c section', 'cesarean', 'epidural', 'ivf', 'surrogacy', 'childbirth',
    'organ donation', 'blood donation', 'donate organ', 'donate blood',
    'terrorism', 'suicide bombing', 'killing innocents',
    'women working', 'women education', 'women driving', 'women rights',
    'movies', 'netflix', 'tv shows', 'entertainment',
    'short hair', 'cutting hair', 'perfume', 'attar',
    'how to pray', 'salah steps', 'namaz', 'how to make wudu', 'ghusl', 'tayammum',
    'how to fast', 'what breaks the fast', 'suhoor', 'iftar',
    'five pillars', 'shahada', 'become muslim', 'convert to islam',
    'how to repent', 'tawbah steps', 'repentance',
    'who was muhammad', 'biography prophet', 'what is the quran', 'quran revealed',
    'sunni shia', 'sunni vs shia',
    'missed prayer', 'qada prayer', 'non muslim friend', 'non-muslim friend',
    'physical contact before marriage', 'kissing before marriage', 'aisha age',
    'evolution', 'darwin', 'seafood', 'shrimp', 'gelatin',
    'intrusive thoughts', 'waswas', 'antidepressant', 'therapy', 'medication',
    'cremation', 'hajj', 'umrah', 'ramadan', 'eid', 'zakat', 'nisab',
    'haya', 'modesty', 'domestic violence', 'wife beating', 'haram food', 'halal food',
    'swearing oath', 'happy new year', 'coffee', 'caffeine', 'energy drink',
    'crypto staking', 'crypto mining', 'nft', 'defi',
    'non muslim parents', 'autopsy', 'post mortem', 'body donation',
    'beard mandatory', 'lowering gaze', 'dream prophet', 'dream interpretation',
    'lofi', 'classical music', 'instrumental music',
    'playing sports', 'gym', 'bodybuilding', 'fitness', 'swimming halal',
    'cursing other religion', 'happy easter', 'happy diwali',
    'freemason', 'freemasonry', 'join army', 'join military',
    'joking', 'sarcasm', 'prank', 'disrespecting parents', 'rights of parents',
    'living in non muslim country', 'living in west', 'dar al-kufr',
    'beating children', 'discipline children', 'child abuse',
    'questioning religion', 'doubt in islam', 'doubts',
    'black color', 'white clothes', 'prophet favorite color',
    'listening to quran', 'playing quran',
    'evil eye protection', 'ruqyah', 'ayat ul kursi', 'morning adhkar',
    'cat saliva', 'fard of wudu', 'nullifiers of wudu',
    'barzakh', 'grave', 'dajjal', 'signs of day of judgment', 'end of times',
    'angels islam', 'gabriel', 'jibreel', 'what is sunnah', 'what is hadith',
    'sahaba', 'companions', 'caliphs', 'does allah have body', 'see allah',
    'tahajjud', 'night prayer', 'laylat al qadr', 'night of power',
    'oral sex', 'anal sex', 'intimacy', 'menstruation quran',
    'kaaba', 'black stone', '99 names of allah', 'asma ul husna',
    'dua', 'how to make dua', 'dhikr', 'tasbih', 'sadaqah', 'zakat vs sadaqah',
    'sleeping position', 'etiquette of eating', 'credit card', 'amulet', 'taweez',
    'ramadan mubarak', 'eid mubarak', 'vaping', 'hookah', 'nicotine', 'shisha',
    'working in haram', 'voluntary fasting', 'monday thursday fasting',
    'microblading', 'permanent makeup', 'fasting while traveling',
    'white hair', 'plucking white hair', 'qualified scholar', 'fatwa', 'madhhab',
    'sadaqah jariyah', 'melodious recitation', 'quran singing',
    'acrylic nails', 'gel nails', 'breathable nail polish',
  ];

  const hasIslamicTerm = islamicTerms.some((term) => lower.includes(term));

  // If it's clearly a question about Islamic topics, detect it
  if (hasIslamicTerm && (hasQuestionMark || startsWithQuestion || hasQuestionPhrasing)) return true;

  // Also match "did the prophet say..." type patterns
  if (/did.*prophet.*say|prophet.*say.*about|what.*did.*prophet/i.test(lower)) return true;

  return false;
}

export function tryAnswerQuestion(message: string): QAResponse | null {
  if (!isQuestion(message)) return null;

  // Normalize numbers ("4 wives" -> "four wives") for better pattern matching
  const normalized = normalizeNumbers(message.toLowerCase());
  const lower = normalized;

  // First pass: try exact regex pattern matches (highest confidence)
  for (const entry of QA_DATABASE) {
    if (entry.patterns.some((p) => p.test(lower) || p.test(normalized) || p.test(message.toLowerCase()))) {
      return {
        question: message.trim(),
        answer: entry.answer,
        sources: entry.sources,
      };
    }
  }

  // Second pass: keyword scoring — count how many of the entry's keywords
  // appear in the message. This catches casual phrasings that don't match
  // any rigid regex. Pick the entry with the highest keyword overlap.
  let bestEntry: QAEntry | null = null;
  let bestScore = 0;

  for (const entry of QA_DATABASE) {
    if (!entry.keywords || entry.keywords.length === 0) continue;
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score++;
      }
    }
    // Require at least 2 keyword matches (or 1 if it's a very specific keyword)
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && bestScore >= 2) {
    return {
      question: message.trim(),
      answer: bestEntry.answer,
      sources: bestEntry.sources,
    };
  }

  // If exactly 1 strong keyword match on a very specific topic, still use it
  if (bestEntry && bestScore === 1) {
    const strongKeywords = [
      'nailpolish', 'nail polish', 'istikhara', 'awrah', 'khuffain',
      'tawbah', 'janazah', 'jumuah', 'sihr', 'hasad',
    ];
    if (bestEntry.keywords?.some((kw) => strongKeywords.includes(kw) && lower.includes(kw))) {
      return {
        question: message.trim(),
        answer: bestEntry.answer,
        sources: bestEntry.sources,
      };
    }
  }

  // Fallback for detected questions that don't match a specific entry.
  // Give a concise clarifying response instead of the emotional template.
  return {
    question: message.trim(),
    answer: 'This is a specific question about Islamic rulings. I don\'t have a detailed answer prepared for this exact topic, but here is general guidance: For matters of halal and haram, the primary sources are the Quran and the authentic Sunnah (hadith), followed by the understanding of qualified scholars. Islamic rulings often depend on context — your intention, circumstances, and the specific details of your situation. I strongly recommend consulting a qualified scholar (Aalim) or your local Imam who can give you an answer based on the authentic sources and tailored to your situation. You can also search trusted Islamic fatwa websites like IslamQA.org or consult the hadith collections (Sahih al-Bukhari, Sahih Muslim, and the Sunan) for the primary texts on this topic.',
    sources: [
      'Quran and authentic Sunnah (primary sources)',
      'Consult a qualified scholar for specific rulings',
    ],
  };
}

export function isFactualQuestion(message: string): boolean {
  return isQuestion(message);
}
