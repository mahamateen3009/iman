// Generates src/data/kids_curriculum.json with 90 levels (3 tiers x 30),
// each with level-specific requiredKeywords and distinct correct answers.
import { writeFileSync } from 'node:fs';

const ICONS = [
  'Sparkles','BookOpen','Heart','Star','Sun','Moon','Gift','HandHeart','Smile','Shield',
  'Home','Footprints','Compass','Flag','Flower2','Crown','TreePine','Cloud','Gem','Sword',
  'Scroll','Wind','CloudRain','Snowflake','Feather','Medal','Map','Award','Trophy','Hand',
];

function q(obj) {
  return {
    question: obj.question,
    options: obj.options,
    correctAnswerIndex: obj.correctAnswerIndex ?? 0,
    explanation: obj.explanation,
    acceptFreeText: obj.acceptFreeText ?? false,
    requiredKeywords: obj.requiredKeywords,
  };
}

// ---- TIER 1: Ages 4-7 (30 levels) ----
const tier1 = [
  { title:'Allah is Our Creator', story:'A long, long time ago, Allah made the whole world! Allah made the sun, the moon, the stars, the trees, the animals, and YOU. Everything around us — the sky, the flowers, the birds — was made by Allah. Allah loves it when we remember that He made us and everything we see.',
    questions:[
      q({question:'Who made the sun, the moon, the stars, and YOU?', options:['Allah made everything','Nobody knows','A big machine','The sun made itself'], explanation:'Allah is our Creator — He made the whole world and everything in it.', requiredKeywords:['allah','creator','made']}),
      q({question:'What does "Allah is our Creator" mean?', options:['Allah made everything around us','Allah sleeps like us','Allah forgot about us','Allah is a star'], explanation:'It means Allah made the whole world and everything in it.', acceptFreeText:true, requiredKeywords:['allah','made','world']}),
    ]},
  { title:'Saying Bismillah', story:'Before we eat or start something good, we say "Bismillah" — "In the name of Allah". Saying Bismillah reminds us that everything we do is with Allah\'s help. It brings blessings to what we are about to do.',
    questions:[
      q({question:'What do we say before we eat?', options:['Bismillah','Goodbye','Hello','Yay!'], explanation:'We say Bismillah — "In the name of Allah" — before we eat or start something good.', requiredKeywords:['bismillah','name','allah']}),
      q({question:'Why do we say Bismillah?', options:['To remember Allah and ask His blessing','To make food cold','To finish faster','To show off'], explanation:'We say Bismillah to remember Allah and ask His blessing on what we do.', acceptFreeText:true, requiredKeywords:['bismillah','allah','blessing']}),
    ]},
  { title:'Saying Alhamdulillah', story:'When something good happens, or when we finish eating, we say "Alhamdulillah" — "All praise is for Allah". Saying Alhamdulillah shows we are thankful to Allah for all His gifts, like our food, our family, and our health.',
    questions:[
      q({question:'What do we say to thank Allah?', options:['Alhamdulillah','Oh no','Stop','Hooray'], explanation:'We say Alhamdulillah — "All praise is for Allah" — to thank Allah for His gifts.', requiredKeywords:['alhamdulillah','praise','thankful']}),
      q({question:'When do we say Alhamdulillah?', options:['When we are thankful to Allah','When we are angry','When we are sleepy','When we run away'], explanation:'We say Alhamdulillah when we are thankful to Allah for His gifts.', acceptFreeText:true, requiredKeywords:['alhamdulillah','thankful','allah']}),
    ]},
  { title:'The Shahada', story:'The Shahada is the first pillar of Islam. It says: "There is no god but Allah, and Muhammad is His messenger." When we say the Shahada with our heart, we are telling everyone we are Muslim. It is the most important words a Muslim says.',
    questions:[
      q({question:'What is the Shahada?', options:['There is no god but Allah, and Muhammad is His messenger','A type of food','A new game','A song about birds'], explanation:'The Shahada says: There is no god but Allah, and Muhammad is His messenger.', requiredKeywords:['shahada','allah','muhammad','messenger']}),
      q({question:'Why is the Shahada special?', options:['It is the first pillar and shows we are Muslim','It makes food tasty','It is a magic spell','It helps us run fast'], explanation:'The Shahada is the first pillar of Islam and shows we are Muslim.', acceptFreeText:true, requiredKeywords:['shahada','pillar','muslim']}),
    ]},
  { title:'Salah — Prayer', story:'Muslims pray to Allah five times every day. This prayer is called Salah. We pray in the morning, at noon, in the afternoon, at sunset, and at night. Salah helps us remember Allah all day long and keeps our heart clean.',
    questions:[
      q({question:'How many times a day do Muslims pray Salah?', options:['Five times','One time','Ten times','Never'], explanation:'Muslims pray Salah five times every day.', requiredKeywords:['salah','five','prayer']}),
      q({question:'What does Salah help us do?', options:['Remember Allah all day','Fly in the sky','Cook dinner','Drive a car'], explanation:'Salah helps us remember Allah all day long.', acceptFreeText:true, requiredKeywords:['salah','remember','allah']}),
    ]},
  { title:'Zakat — Sharing', story:'Zakat is sharing some of our money and things with people who need help. When we have enough, Allah asks us to give a little to the poor. Zakat helps everyone have what they need and keeps our hearts kind.',
    questions:[
      q({question:'What is Zakat?', options:['Sharing with people who need help','Keeping everything for ourselves','Hiding our money','Buying toys only'], explanation:'Zakat is sharing some of our money and things with people who need help.', requiredKeywords:['zakat','sharing','poor']}),
      q({question:'Why do we give Zakat?', options:['To help the poor and keep our heart kind','To make people sad','To get taller','To win a race'], explanation:'We give Zakat to help the poor and keep our heart kind.', acceptFreeText:true, requiredKeywords:['zakat','help','poor']}),
    ]},
  { title:'Sawm — Fasting', story:'In the month of Ramadan, Muslims fast from sunrise to sunset. Fasting means we do not eat or drink while the sun is up. It helps us feel what poor people feel and makes us thankful for our food.',
    questions:[
      q({question:'What does fasting in Ramadan mean?', options:['Not eating or drinking while the sun is up','Eating extra food','Sleeping all day','Playing all night'], explanation:'Fasting means not eating or drinking while the sun is up, in the month of Ramadan.', requiredKeywords:['fasting','ramadan','eat']}),
      q({question:'What month do Muslims fast in?', options:['Ramadan','Friday','Winter','Never'], explanation:'Muslims fast in the month of Ramadan.', requiredKeywords:['ramadan','fasting']}),
    ]},
  { title:'Hajj — The Kaaba', story:'Once a year, Muslims travel to Makkah to visit the Kaaba, the holy house of Allah. This trip is called Hajj. Millions of Muslims go around the Kaaba together and pray. It is a very special journey.',
    questions:[
      q({question:'Where do Muslims go for Hajj?', options:['To the Kaaba in Makkah','To the beach','To the moon','To the forest'], explanation:'For Hajj, Muslims travel to the Kaaba in Makkah.', requiredKeywords:['hajj','kaaba','makkah']}),
      q({question:'What is the Kaaba?', options:['The holy house of Allah','A tall tree','A big car','A kind of bird'], explanation:'The Kaaba is the holy house of Allah in Makkah.', acceptFreeText:true, requiredKeywords:['kaaba','house','allah']}),
    ]},
  { title:'Prophet Muhammad (PBUH)', story:'Prophet Muhammad (peace be upon him) is our teacher and the last prophet of Allah. He taught us to be kind, honest, and good to everyone. We love him and follow his example in everything we do.',
    questions:[
      q({question:'Who is Prophet Muhammad (PBUH)?', options:['Our teacher and the last prophet of Allah','A king of games','A farmer only','A mountain climber'], explanation:'Prophet Muhammad (PBUH) is our teacher and the last prophet of Allah.', requiredKeywords:['muhammad','prophet','teacher']}),
      q({question:'What did Prophet Muhammad (PBUH) teach us?', options:['To be kind, honest, and good','To be mean','To lie','To be lazy'], explanation:'He taught us to be kind, honest, and good to everyone.', acceptFreeText:true, requiredKeywords:['muhammad','kind','honest']}),
    ]},
  { title:'The Holy Qur\'an', story:'The Qur\'an is Allah\'s holy book. Allah gave it to Prophet Muhammad (PBUH) through Angel Jibril. The Qur\'an teaches us how to live a good life and make Allah happy. We read it with love and respect.',
    questions:[
      q({question:'What is the Qur\'an?', options:["Allah's holy book","A storybook about cars","A cookbook","A map of the park"], explanation:"The Qur'an is Allah's holy book, given to Prophet Muhammad (PBUH).", requiredKeywords:['quran','book','allah']}),
      q({question:'Who brought the Qur\'an to Prophet Muhammad (PBUH)?', options:['Angel Jibril','A baker','A farmer','A sailor'], explanation:'Angel Jibril brought the Qur\'an to Prophet Muhammad (PBUH).', acceptFreeText:true, requiredKeywords:['jibril','quran','muhammad']}),
    ]},
  { title:'Kindness to Parents', story:'Allah loves it when we are kind to our parents. We listen to them, speak softly, and help them. Our parents love us and care for us, so we show them love and respect every day.',
    questions:[
      q({question:'How do we treat our parents?', options:['With kindness and respect','By shouting','By ignoring them','By running away'], explanation:'We treat our parents with kindness and respect, and help them.', requiredKeywords:['parents','kind','respect']}),
      q({question:'Why does Allah love kindness to parents?', options:['Because they love and care for us','Because they buy toys','Because they are tall','Because they sleep a lot'], explanation:'Allah loves kindness to parents because they love and care for us.', acceptFreeText:true, requiredKeywords:['parents','kind','love']}),
    ]},
  { title:'Kindness to Animals', story:'Allah made the animals, and He wants us to be kind to them. We give water to thirsty animals, feed them, and never hurt them. Even feeding a small bird is a good deed that Allah loves.',
    questions:[
      q({question:'How should we treat animals?', options:['With kindness — feed and give them water','By scaring them','By hurting them','By chasing them'], explanation:'We should be kind to animals — feed them and give them water, and never hurt them.', requiredKeywords:['animals','kind','feed']}),
      q({question:'What is a good deed we can do for animals?', options:['Give water to a thirsty animal','Pull their tail','Shout at them','Lock them up'], explanation:'Giving water to a thirsty animal is a good deed Allah loves.', acceptFreeText:true, requiredKeywords:['animals','water','kind']}),
    ]},
  { title:'Being Honest (Siddiq)', story:'Being honest means telling the truth, even when it is hard. Prophet Muhammad (PBUH) was called Al-Amin — the trustworthy — because he always told the truth. Allah loves honest people.',
    questions:[
      q({question:'What does being honest mean?', options:['Always telling the truth','Telling funny lies','Hiding things','Staying quiet when asked'], explanation:'Being honest means always telling the truth, even when it is hard.', requiredKeywords:['honest','truth','siddiq']}),
      q({question:'What was Prophet Muhammad (PBUH) called for being honest?', options:['Al-Amin — the trustworthy','The fastest runner','The tallest man','The best cook'], explanation:'He was called Al-Amin — the trustworthy — because he always told the truth.', acceptFreeText:true, requiredKeywords:['amin','trustworthy','truth']}),
    ]},
  { title:'Smiling is Charity', story:'Did you know that smiling at someone is a kind of charity? When you smile at your family and friends, you make them happy, and Allah rewards you for it. A smile is a small gift that costs nothing.',
    questions:[
      q({question:'What is a kind of charity we can give every day?', options:['A smile','A frown','A kick','A push'], explanation:'Smiling at someone is a kind of charity that Allah rewards.', requiredKeywords:['smile','charity','sadaqah']}),
      q({question:'Why is smiling special?', options:['It makes people happy and Allah rewards us','It makes food cold','It helps us sleep','It cleans the floor'], explanation:'Smiling makes people happy and Allah rewards us for it.', acceptFreeText:true, requiredKeywords:['smile','happy','charity']}),
    ]},
  { title:'Cleanliness is Half of Faith', story:'Islam teaches us to be clean. We wash our hands, keep our clothes tidy, and do wudu before prayer. Being clean keeps us healthy and makes Allah happy. Cleanliness is half of our faith!',
    questions:[
      q({question:'What is half of our faith?', options:['Cleanliness','Sleeping','Running','Eating'], explanation:'Cleanliness is half of our faith. We keep our body and clothes clean.', requiredKeywords:['cleanliness','faith','clean']}),
      q({question:'What do we do before prayer to be clean?', options:['Wudu — washing','Run fast','Jump high','Sleep more'], explanation:'Before prayer we do wudu — washing — to be clean.', acceptFreeText:true, requiredKeywords:['wudu','clean','wash']}),
    ]},
  { title:'Respecting Elders', story:'Elders are older people like our grandparents and teachers. We respect them by listening, speaking kindly, and helping them. Allah loves it when we show respect to people older than us.',
    questions:[
      q({question:'How do we respect elders?', options:['Listen and speak kindly to them','Ignore them','Talk over them','Walk away'], explanation:'We respect elders by listening, speaking kindly, and helping them.', requiredKeywords:['elders','respect','listen']}),
      q({question:'Who are our elders?', options:['Older people like grandparents and teachers','Babies only','Pets','Toys'], explanation:'Our elders are older people like our grandparents and teachers.', acceptFreeText:true, requiredKeywords:['elders','older','respect']}),
    ]},
  { title:'Sharing Toys & Food', story:'Sharing is a beautiful habit. When we share our toys and food with our brothers, sisters, and friends, Allah is happy with us. Sharing makes everyone feel loved and brings more blessings to us.',
    questions:[
      q({question:'What does Allah love that we share?', options:['Our toys and food','Our secrets','Our worries only','Our chores'], explanation:'Allah loves it when we share our toys and food with others.', requiredKeywords:['sharing','toys','food']}),
      q({question:'Why is sharing good?', options:['It makes everyone feel loved and Allah is happy','It makes us cold','It makes us tired','It makes us sad'], explanation:'Sharing makes everyone feel loved and Allah is happy with us.', acceptFreeText:true, requiredKeywords:['sharing','love','happy']}),
    ]},
  { title:'Saying Assalamu Alaikum', story:'When Muslims meet, they say "Assalamu Alaikum" — "Peace be upon you". It is a beautiful greeting that spreads peace and love. The reply is "Wa Alaikum Assalam" — "And peace be upon you too".',
    questions:[
      q({question:'What do Muslims say when they meet?', options:['Assalamu Alaikum','Goodbye forever','Go away','See you later'], explanation:'Muslims say "Assalamu Alaikum" — "Peace be upon you" — when they meet.', requiredKeywords:['assalamu','alaikum','peace']}),
      q({question:'What is the reply to Assalamu Alaikum?', options:['Wa Alaikum Assalam','I don\'t know','Leave me alone','Bye'], explanation:'The reply is "Wa Alaikum Assalam" — "And peace be upon you too".', acceptFreeText:true, requiredKeywords:['alaikum','assalam','peace']}),
    ]},
  { title:'Prophet Adam (AS)', story:'Prophet Adam (peace be upon him) was the first human Allah ever made. Allah made him from clay and gave him knowledge. Allah taught Adam the names of everything. He was the father of all people.',
    questions:[
      q({question:'Who was the first human Allah made?', options:['Prophet Adam (AS)','A robot','A bird','A fish'], explanation:'Prophet Adam (AS) was the first human Allah ever made.', requiredKeywords:['adam','first','human']}),
      q({question:'What did Allah give Prophet Adam (AS)?', options:['Knowledge and taught him the names of everything','A fast car','A big house of gold','A magic wand'], explanation:'Allah gave Adam knowledge and taught him the names of everything.', acceptFreeText:true, requiredKeywords:['adam','knowledge','names']}),
    ]},
  { title:'Prophet Nuh (AS)', story:'Prophet Nuh (peace be upon him) told his people to worship only Allah, but most did not listen. Allah told him to build a great ark — a big boat. Nuh took the believers and pairs of every animal on the ark. A great flood came, and the ark kept them safe.',
    questions:[
      q({question:'What did Prophet Nuh (AS) build?', options:['A great ark — a big boat','A tall tower','A flying carpet','A stone castle'], explanation:'Prophet Nuh (AS) built a great ark that kept the believers and animals safe from the flood.', requiredKeywords:['nuh','ark','boat']}),
      q({question:'Who did Prophet Nuh (AS) tell people to worship?', options:['Only Allah','The sun','The stars','Idols'], explanation:'Prophet Nuh (AS) told people to worship only Allah.', acceptFreeText:true, requiredKeywords:['nuh','allah','worship']}),
    ]},
  { title:'Prophet Ibrahim (AS)', story:'Prophet Ibrahim (peace be upon him) loved Allah so much that he was called the Friend of Allah. He told people to stop worshipping idols and worship only Allah. He was ready to give up everything for Allah, and Allah saved him.',
    questions:[
      q({question:'Why was Prophet Ibrahim (AS) called the Friend of Allah?', options:['Because he loved Allah and worshipped only Him','Because he was the richest','Because he was the tallest','Because he never slept'], explanation:'Prophet Ibrahim (AS) was called the Friend of Allah because he loved Allah and worshipped only Him.', requiredKeywords:['ibrahim','friend','allah']}),
      q({question:'What did Prophet Ibrahim (AS) tell people to stop doing?', options:['Worshipping idols','Eating fruit','Sleeping early','Playing games'], explanation:'He told people to stop worshipping idols and worship only Allah.', acceptFreeText:true, requiredKeywords:['ibrahim','idols','worship']}),
    ]},
  { title:'Prophet Yunus (AS)', story:'Prophet Yunus (peace be upon him) left his people without Allah\'s permission. A huge whale swallowed him! Inside the whale, he prayed to Allah: "There is no god but You, glory to You, I was wrong." Allah heard him and the whale let him go.',
    questions:[
      q({question:'What animal swallowed Prophet Yunus (AS)?', options:['A huge whale','A little bird','A fast horse','A small cat'], explanation:'A huge whale swallowed Prophet Yunus (AS) after he left his people.', requiredKeywords:['yunus','whale','swallowed']}),
      q({question:'What did Prophet Yunus (AS) do inside the whale?', options:['He prayed to Allah and asked forgiveness','He went to sleep forever','He built a house','He cooked food'], explanation:'Inside the whale, Prophet Yunus (AS) prayed to Allah and asked for forgiveness.', acceptFreeText:true, requiredKeywords:['yunus','prayed','forgiveness']}),
    ]},
  { title:'Prophet Musa (AS)', story:'Prophet Musa (peace be upon him) led his people away from a cruel king. When they reached the sea, Allah told Musa to strike the water with his staff. The sea parted into two walls, and Musa and his people crossed safely!',
    questions:[
      q({question:'What miracle did Allah give Prophet Musa (AS) at the sea?', options:['The sea parted so his people could cross','He flew over the sea','He dug under the sea','He froze the sea'], explanation:'Allah parted the sea so Prophet Musa (AS) and his people could cross safely.', requiredKeywords:['musa','sea','parted']}),
      q({question:'What did Musa (AS) use to strike the water?', options:['His staff','His hand','A rock','A sword'], explanation:'Musa (AS) struck the water with his staff, and the sea parted.', acceptFreeText:true, requiredKeywords:['musa','staff','sea']}),
    ]},
  { title:'Prophet Isa (AS)', story:'Prophet Isa (peace be upon him) was born by a great miracle from Allah. He was kind to the poor and the sick, and Allah gave him the power to heal people. He taught people to worship only Allah.',
    questions:[
      q({question:'What miracle did Allah give Prophet Isa (AS)?', options:['Healing the sick','Building palaces','Flying horses','Cooking feasts'], explanation:'Allah gave Prophet Isa (AS) the power to heal the sick.', requiredKeywords:['isa','heal','sick']}),
      q({question:'What did Prophet Isa (AS) teach people?', options:['To worship only Allah','To gather gold','To race horses','To climb mountains'], explanation:'Prophet Isa (AS) taught people to worship only Allah.', acceptFreeText:true, requiredKeywords:['isa','worship','allah']}),
    ]},
  { title:'Angel Jibril (AS)', story:'Angel Jibril (peace be upon him) is a special angel who brings Allah\'s words to the prophets. He brought the Qur\'an to Prophet Muhammad (PBUH). Angels always obey Allah and never do wrong.',
    questions:[
      q({question:'Who brings Allah\'s words to the prophets?', options:['Angel Jibril (AS)','A postal worker','A farmer','A sailor'], explanation:'Angel Jibril (AS) brings Allah\'s words to the prophets.', requiredKeywords:['jibril','angel','words']}),
      q({question:'What did Angel Jibril bring to Prophet Muhammad (PBUH)?', options:['The Qur\'an','A treasure chest','A fast horse','A basket of food'], explanation:'Angel Jibril brought the Qur\'an to Prophet Muhammad (PBUH).', acceptFreeText:true, requiredKeywords:['jibril','quran','muhammad']}),
    ]},
  { title:'The Kaaba', story:'The Kaaba is the holy house of Allah in Makkah. It is a big black cube, and Muslims all over the world face it when they pray. It was first built by Prophet Ibrahim (AS) and his son Ismail (AS).',
    questions:[
      q({question:'What is the Kaaba?', options:["Allah's holy house in Makkah",'A tall mountain','A deep river','A green forest'], explanation:"The Kaaba is Allah's holy house in Makkah.", requiredKeywords:['kaaba','house','makkah']}),
      q({question:'Who first built the Kaaba?', options:['Prophet Ibrahim (AS) and his son Ismail (AS)','Prophet Musa (AS)','Angel Jibril (AS)','A king of gold'], explanation:'The Kaaba was first built by Prophet Ibrahim (AS) and his son Ismail (AS).', acceptFreeText:true, requiredKeywords:['ibrahim','ismail','kaaba']}),
    ]},
  { title:'Ramadan & Eid', story:'Ramadan is the month we fast and do extra good deeds. At the end of Ramadan, we celebrate Eid al-Fitr! We pray together, give gifts, wear our best clothes, and share food with family and friends.',
    questions:[
      q({question:'What do we celebrate at the end of Ramadan?', options:['Eid al-Fitr','A birthday','A race','A holiday for toys'], explanation:'At the end of Ramadan we celebrate Eid al-Fitr.', requiredKeywords:['eid','ramadan','celebrate']}),
      q({question:'What do we do on Eid?', options:['Pray, give gifts, and share food with family','Sleep all day','Hide alone','Throw away food'], explanation:'On Eid we pray together, give gifts, wear nice clothes, and share food with family.', acceptFreeText:true, requiredKeywords:['eid','pray','gifts']}),
    ]},
  { title:'Making Dua', story:'Dua is talking to Allah. Any time, any place, we can raise our hands and ask Allah for help, say thank you, or tell Him how we feel. Allah always hears our dua and loves it when we talk to Him.',
    questions:[
      q({question:'What is dua?', options:['Talking to Allah','Talking to toys','Talking to walls','Talking to the TV'], explanation:'Dua is talking to Allah — asking for help or saying thank you.', requiredKeywords:['dua','talking','allah']}),
      q({question:'When can we make dua?', options:['Any time, any place','Only at night','Only at school','Never'], explanation:'We can make dua any time and any place — Allah always hears us.', acceptFreeText:true, requiredKeywords:['dua','anytime','allah']}),
    ]},
  { title:'Forgiving Others', story:'Sometimes people hurt our feelings. Allah loves it when we forgive them instead of being angry. Forgiving means letting go of anger and being kind, just like we hope Allah forgives us.',
    questions:[
      q({question:'What does Allah love when someone hurts our feelings?', options:['That we forgive them','That we fight back','That we stay angry','That we run away'], explanation:'Allah loves it when we forgive others instead of staying angry.', requiredKeywords:['forgive','let go','kind']}),
      q({question:'Why do we forgive others?', options:['Because we hope Allah forgives us','To make them sad','To get revenge','To be alone'], explanation:'We forgive others because we hope Allah will forgive us too.', acceptFreeText:true, requiredKeywords:['forgive','allah','kind']}),
    ]},
  { title:'Being a Good Companion', story:'A good Muslim companion is a good friend. We help our friends do good, speak kindly, and never hurt anyone. The Prophet (PBUH) said a good friend is like a seller of good perfume — being near them makes you better.',
    questions:[
      q({question:'What is a good Muslim companion like?', options:['A good friend who helps us do good','Someone who tells us to lie','Someone who hurts us','Someone who is always angry'], explanation:'A good Muslim companion is a good friend who helps us do good.', requiredKeywords:['companion','friend','good']}),
      q({question:'What did the Prophet (PBUH) say a good friend is like?', options:['A seller of good perfume — being near them makes you better','A dark cave','A heavy stone','A loud storm'], explanation:'The Prophet (PBUH) said a good friend is like a seller of good perfume — being near them makes you better.', acceptFreeText:true, requiredKeywords:['friend','perfume','better']}),
    ]},
];

// ---- TIER 2: Ages 8-10 (30 levels) ----
const tier2 = [
  { title:'The 5 Pillars of Islam', story:'Islam stands on five pillars: Shahada (the declaration of faith), Salah (five daily prayers), Zakat (giving charity), Sawm (fasting in Ramadan), and Hajj (the pilgrimage to Makkah). These five duties are the foundation of a Muslim\'s life and worship.',
    questions:[
      q({question:'Which of these is NOT one of the five pillars?', options:['Eid shopping','Shahada','Salah','Zakat'], explanation:'The five pillars are Shahada, Salah, Zakat, Sawm, and Hajj — Eid shopping is not one.', requiredKeywords:['pillars','shahada','salah','zakat','sawm','hajj']}),
      q({question:'Name the five pillars of Islam.', options:['Shahada, Salah, Zakat, Sawm, Hajj','Pray, eat, sleep, play, run','Read, write, walk, talk, sing','Money, food, games, toys, sleep'], explanation:'The five pillars are Shahada, Salah, Zakat, Sawm, and Hajj.', acceptFreeText:true, requiredKeywords:['shahada','salah','zakat','sawm','hajj']}),
    ]},
  { title:'The 6 Articles of Iman', story:'Iman (faith) has six articles: belief in Allah, His angels, His books, His messengers, the Last Day, and divine destiny (Qadar). Believing in all six is what makes a Muslim\'s faith complete.',
    questions:[
      q({question:'How many articles of Iman are there?', options:['Six','Two','Ten','One'], explanation:'There are six articles of Iman (faith).', requiredKeywords:['iman','six','articles']}),
      q({question:'Which is one of the six articles of Iman?', options:['Belief in Allah\'s angels','Belief in flying','Belief in luck alone','Belief in holidays'], explanation:'Belief in Allah\'s angels is one of the six articles of Iman.', acceptFreeText:true, requiredKeywords:['iman','allah','angels','books','messengers','qadar']}),
    ]},
  { title:'Shahada in Detail', story:'The Shahada has two parts: "There is no god but Allah" — meaning Allah alone deserves worship; and "Muhammad is His messenger" — meaning we follow the Prophet\'s example. Saying it with belief makes someone a Muslim.',
    questions:[
      q({question:'What are the two parts of the Shahada?', options:['No god but Allah; Muhammad is His messenger','Allah is great; pray five times','Give charity; fast Ramadan','Visit Makkah; read Qur\'an'], explanation:'The Shahada is: There is no god but Allah, and Muhammad is His messenger.', requiredKeywords:['shahada','allah','muhammad','messenger']}),
      q({question:'What does "no god but Allah" mean?', options:['Allah alone deserves worship','There are many gods','Allah sleeps','Allah is far away'], explanation:'It means Allah alone deserves worship and there is no other god.', acceptFreeText:true, requiredKeywords:['shahada','allah','worship','alone']}),
    ]},
  { title:'Salah in Detail', story:'Salah is the five daily prayers: Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), and Isha (night). Each prayer has its own time, and we pray facing the Kaaba in Makkah.',
    questions:[
      q({question:'Which is the dawn prayer?', options:['Fajr','Dhuhr','Asr','Isha'], explanation:'Fajr is the dawn prayer, prayed before sunrise.', requiredKeywords:['fajr','dawn','prayer']}),
      q({question:'List the five daily prayers in order.', options:['Fajr, Dhuhr, Asr, Maghrib, Isha','Morning, lunch, tea, dinner, bed','One, two, three, four, five','East, west, north, south, up'], explanation:'The five daily prayers are Fajr, Dhuhr, Asr, Maghrib, and Isha.', acceptFreeText:true, requiredKeywords:['fajr','dhuhr','asr','maghrib','isha']}),
    ]},
  { title:'Zakat in Detail', story:'Zakat is giving a set share (usually 2.5%) of our saved wealth to the poor each year. It purifies our money and helps people in need. Zakat is a duty on every Muslim who has enough savings.',
    questions:[
      q({question:'What share of saved wealth is Zakat usually?', options:['2.5%','10%','50%','100%'], explanation:'Zakat is usually 2.5% of our saved wealth given each year.', requiredKeywords:['zakat','2.5','wealth']}),
      q({question:'Who must pay Zakat?', options:['A Muslim who has enough saved wealth','Only children','Only travellers','Nobody'], explanation:'Zakat is a duty on every Muslim who has enough saved wealth.', acceptFreeText:true, requiredKeywords:['zakat','wealth','poor']}),
    ]},
  { title:'Steps of Wudu', story:'Wudu is the washing we do before Salah. We wash our hands, mouth, nose, face, arms, wipe our head and ears, and wash our feet — all in order. Wudu must be done with clean water and a sincere intention (niyyah).',
    questions:[
      q({question:'What do we do before Salah to become clean?', options:['Wudu','Sleeping','Running','Eating'], explanation:'We do wudu — washing in order — before Salah to become clean.', requiredKeywords:['wudu','wash','clean']}),
      q({question:'What is the first step of wudu?', options:['Wash the hands and make niyyah','Wash the feet','Wipe the head','Wash the ears'], explanation:'The first step of wudu is to wash the hands and make the intention (niyyah).', acceptFreeText:true, requiredKeywords:['wudu','hands','niyyah']}),
    ]},
  { title:'Niyyah — Intention', story:'Niyyah is the intention in our heart before any worship. Before wudu, Salah, or fasting, we make a quiet intention that we are doing this only for Allah. Without a sincere niyyah, the action is not accepted.',
    questions:[
      q({question:'What is niyyah?', options:['The intention in our heart for Allah','A type of food','A prayer mat','A kind of song'], explanation:'Niyyah is the intention in our heart that we are worshipping only for Allah.', requiredKeywords:['niyyah','intention','heart']}),
      q({question:'Why is niyyah important in worship?', options:['Without it the action is not accepted','It makes food tasty','It helps us run','It cleans clothes'], explanation:'Without a sincere niyyah, our worship is not accepted by Allah.', acceptFreeText:true, requiredKeywords:['niyyah','accepted','sincere']}),
    ]},
  { title:'Salah Positions', story:'Salah has set positions: standing (Qiyam), bowing (Ruku), prostration (Sujud), and sitting (Tashahhud). Each position has its own words. Sujud is the closest we can be to Allah, so we make extra dua in it.',
    questions:[
      q({question:'Which position in Salah is closest to Allah?', options:['Sujud (prostration)','Standing','Sitting','Looking around'], explanation:'Sujud (prostration) is the position in which we are closest to Allah.', requiredKeywords:['sujud','prostration','closest']}),
      q({question:'Name the main positions of Salah.', options:['Qiyam, Ruku, Sujud, Tashahhud','Up, down, left, right','Run, jump, sit, sleep','Eat, drink, walk, talk'], explanation:'The main positions are Qiyam (standing), Ruku (bowing), Sujud (prostration), and Tashahhud (sitting).', acceptFreeText:true, requiredKeywords:['qiyam','ruku','sujud','tashahhud']}),
    ]},
  { title:'Sawm in Detail', story:'Fasting (Sawm) in Ramadan means no food, drink, or bad behaviour from dawn (Fajr) to sunset (Maghrib). We also avoid arguing and lying. Fasting teaches patience (Sabr) and makes us feel what the poor feel.',
    questions:[
      q({question:'From which prayer to which prayer do we fast?', options:['Fajr to Maghrib','Dhuhr to Isha','Asr to Fajr','Maghrib to Dhuhr'], explanation:'We fast from Fajr (dawn) to Maghrib (sunset).', requiredKeywords:['fajr','maghrib','fast']}),
      q({question:'What does fasting teach us?', options:['Patience and empathy with the poor','How to cook','How to run fast','How to sleep less'], explanation:'Fasting teaches patience (Sabr) and makes us feel what the poor feel.', acceptFreeText:true, requiredKeywords:['sawm','patience','sabr','poor']}),
    ]},
  { title:'Hajj in Detail', story:'Hajj is the pilgrimage to Makkah once in a lifetime for those who can. Pilgrims wear simple white clothes (Ihram), walk around the Kaaba (Tawaf), and run between Safa and Marwa. It reminds us that all people are equal before Allah.',
    questions:[
      q({question:'What do pilgrims wear for Hajj?', options:['Simple white clothes called Ihram','Gold and jewels','Black suits','Colourful robes'], explanation:'Pilgrims wear simple white clothes called Ihram for Hajj.', requiredKeywords:['ihram','white','clothes']}),
      q({question:'What is walking around the Kaaba called?', options:['Tawaf','Salah','Wudu','Zakat'], explanation:'Walking around the Kaaba is called Tawaf.', acceptFreeText:true, requiredKeywords:['tawaf','kaaba','walk']}),
    ]},
  { title:'Prophet Ibrahim\'s Sacrifice', story:'Allah tested Prophet Ibrahim (AS) by asking him to sacrifice his son. Ibrahim (AS) was ready to obey Allah. Allah replaced his son with a ram — a mercy from Allah. This obedience is remembered every Eid al-Adha.',
    questions:[
      q({question:'What did Allah replace with a ram?', options:['Ibrahim\'s sacrifice of his son','A flock of birds','A bowl of fruit','A mountain'], explanation:'Allah replaced Ibrahim\'s sacrifice of his son with a ram as a mercy.', requiredKeywords:['ibrahim','sacrifice','ram']}),
      q({question:'Which Eid remembers Ibrahim\'s obedience?', options:['Eid al-Adha','Eid al-Fitr','Eid Milad','Eid Mubarak only'], explanation:'Eid al-Adha remembers Prophet Ibrahim\'s (AS) obedience to Allah.', acceptFreeText:true, requiredKeywords:['ibrahim','eid','adha','obedience']}),
    ]},
  { title:'Prophet Yusuf\'s Patience', story:'Prophet Yusuf (peace be upon him) was thrown into a well by his jealous brothers, then sold as a slave, then jailed wrongly. Through all of this he kept his patience (Sabr) and his trust in Allah. Allah raised him to a high position in Egypt.',
    questions:[
      q({question:'What did Prophet Yusuf\'s (AS) brothers do to him?', options:['Threw him into a well','Gave him a crown','Built him a palace','Sent him to school'], explanation:'His jealous brothers threw Prophet Yusuf (AS) into a well.', requiredKeywords:['yusuf','well','brothers']}),
      q({question:'What quality did Prophet Yusuf (AS) show?', options:['Patience (Sabr) and trust in Allah','Anger','Greed','Laziness'], explanation:'Prophet Yusuf (AS) showed patience (Sabr) and trust in Allah through all his trials.', acceptFreeText:true, requiredKeywords:['yusuf','patience','sabr']}),
    ]},
  { title:'Prophet Sulaiman\'s Gratitude', story:'Prophet Sulaiman (peace be upon him) was a great king with a mighty kingdom and could understand animals. Even with all his power, he always thanked Allah. He said, "This is by the grace of my Lord" — teaching us to be grateful, not proud.',
    questions:[
      q({question:'What special gift did Allah give Prophet Sulaiman (AS)?', options:['He could understand animals','He could fly','He could turn invisible','He could breathe fire'], explanation:'Allah gave Prophet Sulaiman (AS) the ability to understand animals.', requiredKeywords:['sulaiman','animals','kingdom']}),
      q({question:'What did Prophet Sulaiman (AS) always say about his blessings?', options:['"This is by the grace of my Lord"','"I am the greatest"','"I did it myself"','"Nobody helped me"'], explanation:'He always said, "This is by the grace of my Lord" — teaching gratitude, not pride.', acceptFreeText:true, requiredKeywords:['sulaiman','grace','grateful']}),
    ]},
  { title:'Amanah — Trustworthiness', story:'Amanah means being trustworthy — keeping promises, returning what is entrusted to you, and never betraying trust. Prophet Muhammad (PBUH) was called Al-Amin even before prophethood because everyone trusted him.',
    questions:[
      q({question:'What does Amanah mean?', options:['Being trustworthy and keeping promises','Being the fastest','Being the tallest','Being the funniest'], explanation:'Amanah means being trustworthy, keeping promises, and never betraying trust.', requiredKeywords:['amanah','trustworthy','promises']}),
      q({question:'Why was Prophet Muhammad (PBUH) called Al-Amin?', options:['Because everyone trusted him','Because he was rich','Because he was tall','Because he never slept'], explanation:'He was called Al-Amin because everyone trusted him to keep his promises.', acceptFreeText:true, requiredKeywords:['amin','trusted','amanah']}),
    ]},
  { title:'Sabr — Patience', story:'Sabr is patience — staying calm and trusting Allah when things are hard. Sabr is not just waiting; it is doing the right thing without complaining. Allah is with those who are patient (Sabireen).',
    questions:[
      q({question:'What is Sabr?', options:['Patience and trusting Allah in hard times','Anger','Fear','Running away'], explanation:'Sabr is patience — staying calm and trusting Allah when things are hard.', requiredKeywords:['sabr','patience','trusting']}),
      q({question:'Who is Allah with, according to the Qur\'an?', options:['Those who are patient (Sabireen)','Those who are rich','Those who are loud','Those who are fast'], explanation:'Allah is with those who are patient (the Sabireen).', acceptFreeText:true, requiredKeywords:['sabr','sabireen','patient']}),
    ]},
  { title:'Controlling Anger', story:'The Prophet (PBUH) taught us to control anger. He said the strong person is not the one who wrestles others, but the one who controls himself when angry. A simple tip is to sit down or make wudu when angry.',
    questions:[
      q({question:'Who is the truly strong person, according to the Prophet (PBUH)?', options:['The one who controls himself when angry','The one who can lift the most','The one who shouts loudest','The one who runs fastest'], explanation:'The strong person is the one who controls himself when angry.', requiredKeywords:['anger','control','strong']}),
      q({question:'What did the Prophet (PBUH) advise when angry?', options:['Sit down or make wudu','Shout louder','Hit something','Run away'], explanation:'The Prophet (PBUH) advised sitting down or making wudu when angry.', acceptFreeText:true, requiredKeywords:['anger','sit','wudu']}),
    ]},
  { title:'Etiquette of Sleeping', story:'Before sleeping, we brush our teeth, make wudu, dust the bed three times, and sleep on our right side. We recite the bedtime duas and the last verses of Surah Al-Baqarah. This protects us through the night.',
    questions:[
      q({question:'Which side did the Prophet (PBUH) sleep on?', options:['The right side','The left side','On his stomach','On his back only'], explanation:'The Prophet (PBUH) slept on his right side.', requiredKeywords:['sleep','right','side']}),
      q({question:'What should we do before sleeping?', options:['Make wudu and recite bedtime duas','Play loud games','Eat a big meal','Watch TV late'], explanation:'Before sleeping we make wudu, dust the bed, and recite bedtime duas.', acceptFreeText:true, requiredKeywords:['sleep','wudu','dua']}),
    ]},
  { title:'Etiquette of Eating', story:'We eat with the right hand, say Bismillah before eating, and Alhamdulillah after. We do not complain about food and we do not waste. The Prophet (PBUH) taught us to eat what is in front of us and share with others.',
    questions:[
      q({question:'Which hand do we eat with?', options:['The right hand','The left hand','Both hands','Whichever is easy'], explanation:'We eat with the right hand, after saying Bismillah.', requiredKeywords:['eat','right','bismillah']}),
      q({question:'What do we say before and after eating?', options:['Bismillah before, Alhamdulillah after','Nothing at all','Goodbye and hello','Yay and oh no'], explanation:'We say Bismillah before eating and Alhamdulillah after.', acceptFreeText:true, requiredKeywords:['bismillah','alhamdulillah','eat']}),
    ]},
  { title:'Etiquette of Entering the Home', story:'When entering the home, we say Assalamu Alaikum, even if no one is there (greeting the angels). We enter with the right foot and recite a dua. This brings peace and blessings to the home.',
    questions:[
      q({question:'What do we say when entering the home?', options:['Assalamu Alaikum','Goodbye','See you','Nothing'], explanation:'We say Assalamu Alaikum when entering the home, even if no one is there.', requiredKeywords:['assalamu','alaikum','enter']}),
      q({question:'Which foot do we enter with?', options:['The right foot','The left foot','Both feet','Whichever'], explanation:'We enter the home with the right foot and recite a dua.', acceptFreeText:true, requiredKeywords:['right','foot','enter']}),
    ]},
  { title:'Seeking Knowledge', story:'Islam loves seeking knowledge. The Prophet (PBUH) said seeking knowledge is a duty on every Muslim. We ask questions, learn from teachers, and act on what we learn. Knowledge that is acted upon is better than worship without understanding.',
    questions:[
      q({question:'What did the Prophet (PBUH) say about seeking knowledge?', options:['It is a duty on every Muslim','It is only for men','It is optional','It is wrong'], explanation:'The Prophet (PBUH) said seeking knowledge is a duty on every Muslim.', requiredKeywords:['knowledge','duty','muslim']}),
      q({question:'Which is better, according to the Prophet (PBUH)?', options:['Knowledge acted upon','Worship without understanding','Sleeping all day','Eating a lot'], explanation:'Knowledge that is acted upon is better than worship without understanding.', acceptFreeText:true, requiredKeywords:['knowledge','acted','understanding']}),
    ]},
  { title:'Birth of Prophet Muhammad (PBUH)', story:'Prophet Muhammad (PBUH) was born in Makkah in the Year of the Elephant. His father Abdullah died before he was born, and his mother Aminah raised him with love. He was known for being honest and kind from a young age.',
    questions:[
      q({question:'Where was Prophet Muhammad (PBUH) born?', options:['In Makkah','In Madinah','In Cairo','In Baghdad'], explanation:'Prophet Muhammad (PBUH) was born in Makkah in the Year of the Elephant.', requiredKeywords:['muhammad','makkah','born']}),
      q({question:'What was his father\'s name?', options:['Abdullah','Ibrahim','Ismail','Yusuf'], explanation:'His father was Abdullah, who died before the Prophet (PBUH) was born.', acceptFreeText:true, requiredKeywords:['muhammad','abdullah','father']}),
    ]},
  { title:'Cave Hira — First Revelation', story:'Prophet Muhammad (PBUH) used to meditate in the Cave of Hira near Makkah. One night, Angel Jibril came and said "Read!" (Iqra). The first verses of the Qur\'an were revealed to him there. This began his prophethood.',
    questions:[
      q({question:'Where did the Prophet (PBUH) receive the first revelation?', options:['In the Cave of Hira','In the Kaaba','In Madinah','On a mountain top in Yemen'], explanation:'The first revelation came to the Prophet (PBUH) in the Cave of Hira near Makkah.', requiredKeywords:['hira','cave','revelation']}),
      q({question:'What did Angel Jibril say first?', options:['"Read!" (Iqra)','"Sleep!"','"Run!"','"Eat!"'], explanation:'Angel Jibril said "Read!" (Iqra) — the first word of the revealed Qur\'an.', acceptFreeText:true, requiredKeywords:['jibril','iqra','read']}),
    ]},
  { title:'Migration to Madinah', story:'When the people of Makkah hurt the Muslims, the Prophet (PBUH) and his followers migrated to Madinah. This journey is called the Hijrah, and the Islamic calendar begins from this event. In Madinah, the Muslims built the first mosque and lived in peace.',
    questions:[
      q({question:'What is the migration to Madinah called?', options:['The Hijrah','The Tawaf','The Wudu','The Zakat'], explanation:'The migration to Madinah is called the Hijrah.', requiredKeywords:['hijrah','migration','madinah']}),
      q({question:'What does the Islamic calendar begin from?', options:['The Hijrah','The birth of the Prophet','The first revelation','Eid al-Fitr'], explanation:'The Islamic (Hijri) calendar begins from the Hijrah — the migration to Madinah.', acceptFreeText:true, requiredKeywords:['hijrah','calendar','madinah']}),
    ]},
  { title:'Treaty of Hudaybiyyah', story:'The Treaty of Hudaybiyyah was a peace agreement between the Muslims of Madinah and the people of Makkah. Even though some terms seemed unfair, the Prophet (PBUH) agreed to it for peace. It brought years of calm and allowed Islam to spread.',
    questions:[
      q({question:'What was the Treaty of Hudaybiyyah?', options:['A peace agreement between Madinah and Makkah','A war plan','A trade deal only','A wedding contract'], explanation:'The Treaty of Hudaybiyyah was a peace agreement between the Muslims and the people of Makkah.', requiredKeywords:['hudaybiyyah','treaty','peace']}),
      q({question:'Why did the Prophet (PBUH) agree to the treaty?', options:['To bring peace and let Islam spread','To start a war','To get rich','To leave Madinah'], explanation:'The Prophet (PBUH) agreed to the treaty to bring peace and allow Islam to spread.', acceptFreeText:true, requiredKeywords:['hudaybiyyah','peace','spread']}),
    ]},
  { title:'Sadaqah — Charity', story:'Sadaqah is any voluntary charity — money, food, a smile, or help. Unlike Zakat, Sadaqah has no fixed amount and can be given any time. The Prophet (PBUH) said even a kind word is Sadaqah. It protects us from harm and increases our blessings.',
    questions:[
      q({question:'What is Sadaqah?', options:['Voluntary charity of any kind','A fixed tax','A type of prayer','A holiday'], explanation:'Sadaqah is voluntary charity of any kind — money, food, or even a kind word.', requiredKeywords:['sadaqah','charity','voluntary']}),
      q({question:'How is Sadaqah different from Zakat?', options:['Sadaqah is voluntary with no fixed amount; Zakat is a fixed duty','They are exactly the same','Sadaqah is only for the rich','Zakat is only for children'], explanation:'Sadaqah is voluntary with no fixed amount, while Zakat is a fixed duty on saved wealth.', acceptFreeText:true, requiredKeywords:['sadaqah','voluntary','zakat']}),
    ]},
  { title:'Respecting the Qur\'an', story:'The Qur\'an is Allah\'s word, so we treat it with deep respect. We keep it clean, place it on a high shelf, and do not put other things on top of it. We recite it with care and try to understand what it means.',
    questions:[
      q({question:'How should we treat the Qur\'an?', options:['With deep respect and keep it clean','Like any old book','Under our pillow with junk on top','On the floor with toys'], explanation:'We treat the Qur\'an with deep respect — keeping it clean and on a high place.', requiredKeywords:['quran','respect','clean']}),
      q({question:'Can we put other books on top of the Qur\'an?', options:['No, we keep it on top or in a high clean place','Yes, anything is fine','Yes, if they are heavy','Yes, if they are new'], explanation:'No — we keep the Qur\'an on top or in a high, clean place, not under other things.', acceptFreeText:true, requiredKeywords:['quran','top','respect']}),
    ]},
  { title:'The Five Daily Prayers — Times', story:'Each prayer has a window of time: Fajr (before sunrise), Dhuhr (just after noon), Asr (afternoon), Maghrib (just after sunset), and Isha (night). Praying on time is one of the most beloved deeds to Allah.',
    questions:[
      q({question:'When is Dhuhr prayed?', options:['Just after noon','Before sunrise','At midnight','At sunset'], explanation:'Dhuhr is prayed just after noon.', requiredKeywords:['dhuhr','noon','prayer']}),
      q({question:'When is Maghrib prayed?', options:['Just after sunset','At noon','Before sunrise','At midnight'], explanation:'Maghrib is prayed just after sunset.', acceptFreeText:true, requiredKeywords:['maghrib','sunset','prayer']}),
    ]},
  { title:'Dua after Salah', story:'After the prayer, we can make dua — raising our hands and asking Allah. This is a special time when duas are accepted. We can ask for forgiveness, blessings for our family, and guidance.',
    questions:[
      q({question:'What can we do right after Salah?', options:['Make dua to Allah','Start a race','Watch TV','Sleep'], explanation:'After Salah we can make dua — it is a special time when duas are accepted.', requiredKeywords:['dua','salah','after']}),
      q({question:'Why is dua after Salah special?', options:['It is a time when duas are accepted','It is the hottest time','It is the coldest time','It is when everyone is busy'], explanation:'Right after Salah is a special time when duas are accepted by Allah.', acceptFreeText:true, requiredKeywords:['dua','salah','accepted']}),
    ]},
  { title:'Review of Seerah', story:'The Seerah is the story of the Prophet\'s (PBUH) life — his birth, his honesty in Makkah, his prophethood at the Cave of Hira, his patience through hardship, the Hijrah to Madinah, and the years of peace. Studying the Seerah helps us love and follow him.',
    questions:[
      q({question:'What is the Seerah?', options:['The story of the Prophet\'s (PBUH) life','A type of food','A kind of game','A song'], explanation:'The Seerah is the story of Prophet Muhammad\'s (PBUH) life.', requiredKeywords:['seerah','prophet','life']}),
      q({question:'Why do we study the Seerah?', options:['To love and follow the Prophet (PBUH)','To get rich','To learn to cook','To win games'], explanation:'We study the Seerah to love and follow the Prophet (PBUH) in our lives.', acceptFreeText:true, requiredKeywords:['seerah','prophet','follow']}),
    ]},
  { title:'Being a Role Model', story:'A good Muslim is a role model — honest, kind, and helpful. The Prophet (PBUH) was the best role model. By following his character, we become people others look up to and trust, and we please Allah.',
    questions:[
      q({question:'Who is the best role model for Muslims?', options:['Prophet Muhammad (PBUH)','A famous singer','A sports star only','A movie hero'], explanation:'Prophet Muhammad (PBUH) is the best role model for Muslims.', requiredKeywords:['prophet','role model','character']}),
      q({question:'How do we become a good role model?', options:['By being honest, kind, and helpful','By being rich only','By being famous','By being loud'], explanation:'We become a good role model by being honest, kind, and helpful — following the Prophet\'s (PBUH) character.', acceptFreeText:true, requiredKeywords:['role model','honest','kind']}),
    ]},
];

// ---- TIER 3: Ages 11-14 (30 levels) ----
const tier3 = [
  { title:'Tafsir of Surah Al-Fatiha', story:'Surah Al-Fatiha, "The Opening", is the mother of the Qur\'an and is recited in every unit of Salah. It praises Allah as the Lord of all worlds, the Most Merciful, the Master of the Day of Judgement. We worship only Him and ask Him to guide us on the straight path — not the path of those who earned His anger or went astray.',
    questions:[
      q({question:'In your own words, explain the meaning of Surah Al-Fatiha.', options:['It is the Opening — we praise Allah as Lord of all worlds and ask Him to guide us on the straight path','It is about Allah being one with no partner','It is about seeking refuge from evil','It is about the morning light'], explanation:'Surah Al-Fatiha is the Opening — it praises Allah as Lord of all worlds, the Most Merciful, the Master of the Day of Judgement, and asks Him to guide us on the straight path.', acceptFreeText:true, requiredKeywords:['fatiha','opening','lord','worlds','straight path']}),
      q({question:'Which verse of Al-Fatiha asks for guidance?', options:['Guide us on the straight path','Allah is One','I seek refuge in Allah','By the morning light'], explanation:'The verse "Guide us on the straight path" asks Allah for guidance.', requiredKeywords:['fatiha','guide','straight path']}),
    ]},
  { title:'Tafsir of Surah Al-Ikhlas', story:'Surah Al-Ikhlas, "Sincerity", declares the absolute oneness of Allah. It says Allah is One, the Eternal Refuge, who neither begets nor is born, and there is none comparable to Him. It is a powerful statement of Tawheed — that Allah is unique, absolute, and unlike any creation.',
    questions:[
      q({question:'In your own words, explain the meaning of Surah Al-Ikhlas.', options:['It declares Allah is One, the Eternal Refuge, who does not beget nor is He begotten, and none is comparable to Him','It is the Opening asking for guidance on the straight path','It is about seeking refuge from the evil whisperer','It is about the morning light and silence'], explanation:'Surah Al-Ikhlas declares the absolute oneness of Allah — He is One, the Eternal Refuge, who neither begets nor is begotten, and none is comparable to Him.', acceptFreeText:true, requiredKeywords:['ikhlas','one','beget','comparable','eternal']}),
      q({question:'Which concept does Surah Al-Ikhlas teach?', options:['Tawheed — the absolute oneness and uniqueness of Allah','The straight path and guidance','Seeking refuge from evil','The story of the morning'], explanation:'Surah Al-Ikhlas teaches Tawheed — the absolute oneness and uniqueness of Allah.', requiredKeywords:['ikhlas','tawheed','one','unique']}),
    ]},
  { title:'Tafsir of Surah Al-Falaq', story:'Surah Al-Falaq, "The Daybreak", is a prayer for refuge. We seek Allah\'s protection from the evil of what He created, from the darkness of night, from those who practise witchcraft, and from the envier when he envies. It teaches us to turn to Allah for safety from all harms.',
    questions:[
      q({question:'In your own words, explain the meaning of Surah Al-Falaq.', options:['It is a prayer seeking Allah\'s refuge from the evil of creation, the night, witchcraft, and envy','It declares Allah is One and absolute','It praises Allah as Lord of all worlds','It is about the morning light of guidance'], explanation:'Surah Al-Falaq is a prayer seeking Allah\'s refuge from the evil of what He created, the darkness of night, witchcraft, and the envier.', acceptFreeText:true, requiredKeywords:['falaq','refuge','evil','night','envy']}),
      q({question:'From what does Surah Al-Falaq seek refuge?', options:['The evil of creation, night, witchcraft, and envy','Being one of many','Going astray on the path','The whisperer who withdraws'], explanation:'It seeks refuge from the evil of creation, the darkness of night, witchcraft, and the envier.', requiredKeywords:['falaq','refuge','evil','envy']}),
    ]},
  { title:'Tafsir of Surah An-Nas', story:'Surah An-Nas, "Mankind", seeks refuge in Allah from the evil of the whisperer (waswas) who whispers into the hearts of people — both from among the jinn and mankind. It teaches us to guard our heart from doubts and bad thoughts by turning to Allah.',
    questions:[
      q({question:'In your own words, explain the meaning of Surah An-Nas.', options:['It seeks refuge in Allah from the whisperer who whispers into the hearts of people, from jinn and mankind','It declares Allah is One who does not beget','It seeks refuge from the evil of creation and envy','It praises Allah as Lord of all worlds'], explanation:'Surah An-Nas seeks refuge in Allah from the whisperer (waswas) who whispers into the hearts of people — from jinn and mankind.', acceptFreeText:true, requiredKeywords:['nas','whisperer','waswas','hearts','jinn']}),
      q({question:'From whom does Surah An-Nas seek refuge?', options:['The whisperer who whispers into hearts, from jinn and mankind','Those who earned anger','Those who went astray','The envier who envies'], explanation:'It seeks refuge from the whisperer (waswas) who whispers into the hearts of people — from jinn and mankind.', requiredKeywords:['nas','whisperer','jinn','hearts']}),
    ]},
  { title:'Connecting the Four Quls', story:'The four short surahs often called the "Quls" — Al-Kafirun, Al-Ikhlas, Al-Falaq, and An-Nas — are recited for protection and to strengthen faith. Al-Kafirun rejects false worship, Al-Ikhlas affirms Tawheed, and Al-Falaq and An-Nas seek refuge from outer and inner harms.',
    questions:[
      q({question:'Which surah affirms the absolute oneness of Allah among the four Quls?', options:['Al-Ikhlas','Al-Kafirun','Al-Falaq','An-Nas'], explanation:'Al-Ikhlas affirms the absolute oneness (Tawheed) of Allah among the four Quls.', requiredKeywords:['ikhlas','tawheed','one']}),
      q({question:'Which two surahs among the Quls seek refuge from harm?', options:['Al-Falaq and An-Nas','Al-Ikhlas and Al-Kafirun','Al-Fatiha and Al-Ikhlas','Al-Kafirun and Al-Falaq'], explanation:'Al-Falaq and An-Nas seek refuge from outer and inner harms.', acceptFreeText:true, requiredKeywords:['falaq','nas','refuge']}),
    ]},
  { title:'Hadith 1 — Intention', story:'The first hadith of the Forty Hadith of Imam Nawawi states: "Actions are but by intentions, and every person shall have only what he intended." This teaches that the value of any deed depends on the sincere intention behind it — done for Allah alone.',
    questions:[
      q({question:'What does the first hadith of Imam Nawawi teach?', options:['Actions are judged by their intention','We should sleep early','We should eat with the right hand','We should travel to Makkah'], explanation:'It teaches that actions are judged by intentions — every person gets only what they intended.', requiredKeywords:['intention','niyyah','actions']}),
      q({question:'In your own words, explain the meaning of this hadith.', options:['The value of a deed depends on the sincere intention behind it, done for Allah alone','The number of deeds matters more than the heart','Wealth is what matters most','Fame is what counts'], explanation:'A deed\'s value depends on the sincere intention (niyyah) behind it — done for Allah alone.', acceptFreeText:true, requiredKeywords:['intention','niyyah','sincere','allah']}),
    ]},
  { title:'Hadith 2 — Islam, Iman, Ihsan', story:'The second hadith (the Hadith of Jibril) defines the religion: Islam is the five pillars, Iman is belief in Allah, angels, books, messengers, the Last Day, and Qadar; and Ihsan is to worship Allah as if you see Him, for even if you do not see Him, He sees you.',
    questions:[
      q({question:'What does Ihsan mean in the Hadith of Jibril?', options:['To worship Allah as if you see Him, and if not, know He sees you','To give lots of money','To fast every day','To travel often'], explanation:'Ihsan is to worship Allah as if you see Him, and if you do not, to know that He sees you.', requiredKeywords:['ihsan','worship','see']}),
      q({question:'List the three parts of the religion in the Hadith of Jibril.', options:['Islam, Iman, Ihsan','Salah, Zakat, Sawm','Fajr, Dhuhr, Asr','Makkah, Madinah, Jerusalem'], explanation:'The religion has three parts: Islam, Iman, and Ihsan.', acceptFreeText:true, requiredKeywords:['islam','iman','ihsan']}),
    ]},
  { title:'Hadith 3 — Pillars of Islam', story:'The third hadith states that Islam is built on five pillars: testifying that there is no god but Allah and Muhammad is His messenger, establishing Salah, giving Zakat, fasting Ramadan, and performing Hajj for those who are able.',
    questions:[
      q({question:'What are the five pillars mentioned in this hadith?', options:['Shahada, Salah, Zakat, Sawm, Hajj','Pray, eat, sleep, walk, talk','Money, food, games, toys, sleep','Read, write, sing, dance, run'], explanation:'The five pillars are the Shahada, Salah, Zakat, Sawm, and Hajj.', requiredKeywords:['pillars','shahada','salah','zakat','sawm','hajj']}),
      q({question:'In your own words, what does this hadith teach?', options:['Islam is built on five pillars — the Shahada, Salah, Zakat, Sawm, and Hajj','Islam is about being rich','Islam is about winning arguments','Islam is about sleeping'], explanation:'Islam is built on five pillars: Shahada, Salah, Zakat, Sawm, and Hajj.', acceptFreeText:true, requiredKeywords:['pillars','shahada','salah','zakat','sawm','hajj']}),
    ]},
  { title:'Hadith 4 — Stages of Creation', story:'The fourth hadith explains that each person is created in stages: a drop, then a clot, then a lump, then bones clothed with flesh. The soul is breathed in, and life is decreed. It teaches us about Allah\'s power over our existence.',
    questions:[
      q({question:'What does the fourth hadith describe?', options:['The stages of human creation in the womb','The five daily prayers','The story of a battle','The rules of trade'], explanation:'It describes the stages of human creation in the womb.', requiredKeywords:['creation','stages','womb','soul']}),
      q({question:'What is breathed into the body during creation?', options:['The soul (ruh)','Water','Fire','Wind only'], explanation:'The soul (ruh) is breathed into the body during creation.', acceptFreeText:true, requiredKeywords:['soul','ruh','creation']}),
    ]},
  { title:'Hadith 5 — Rejecting Innovation', story:'The fifth hadith warns: "Whoever introduces into this affair of ours something that does not belong to it, it is rejected." This teaches us to follow the religion as the Prophet (PBUH) taught it, and to avoid innovated practices (bid\'ah) that have no basis in Islam.',
    questions:[
      q({question:'What does the fifth hadith teach about innovation?', options:['Innovations not part of the religion are rejected','All new things are good','New foods are forbidden','New clothes are required'], explanation:'It teaches that any innovation not belonging to the religion is rejected.', requiredKeywords:['bidah','innovation','rejected']}),
      q({question:'In your own words, explain this hadith.', options:['We must follow the religion as the Prophet (PBUH) taught it, and avoid innovated practices with no basis','We must invent new prayers','We must change the pillars every year','We must follow whatever is popular'], explanation:'We follow the religion as the Prophet (PBUH) taught it, and avoid innovated practices (bid\'ah) with no basis in Islam.', acceptFreeText:true, requiredKeywords:['bidah','prophet','rejected','innovation']}),
    ]},
  { title:'Ibn Sina — Medicine', story:'Ibn Sina (Avicenna) was a great Muslim scholar of the Golden Age. He wrote "The Canon of Medicine", which was used in European universities for centuries. He saw the pursuit of knowledge as an act of worship, since understanding Allah\'s creation deepens faith.',
    questions:[
      q({question:'What famous book did Ibn Sina write?', options:['The Canon of Medicine','The Book of Lights','The Muqaddimah','The Faith of Islam'], explanation:'Ibn Sina wrote "The Canon of Medicine", used in European universities for centuries.', requiredKeywords:['ibn sina','canon','medicine']}),
      q({question:'How did Ibn Sina see the pursuit of knowledge?', options:['As an act of worship that deepens faith','As a way to get rich','As a waste of time','As something only for kings'], explanation:'He saw the pursuit of knowledge as an act of worship that deepens faith.', acceptFreeText:true, requiredKeywords:['ibn sina','knowledge','worship','faith']}),
    ]},
  { title:'Al-Khwarizmi — Algebra', story:'Al-Khwarizmi was a Muslim mathematician whose work gave us the word "algebra". He introduced systematic ways to solve equations and brought Arabic numerals to the world. His work laid the foundation for modern mathematics and computing.',
    questions:[
      q({question:'What field did Al-Khwarizmi help found?', options:['Algebra','Astronomy only','Medicine','Poetry'], explanation:'Al-Khwarizmi\'s work gave us the word "algebra" and laid the foundation for modern mathematics.', requiredKeywords:['khwarizmi','algebra','mathematics']}),
      q({question:'What numerals did Al-Khwarizmi help spread?', options:['Arabic numerals','Roman numerals','Greek letters','Tally marks'], explanation:'Al-Khwarizmi helped spread Arabic numerals to the world.', acceptFreeText:true, requiredKeywords:['khwarizmi','arabic','numerals']}),
    ]},
  { title:'Fatima al-Fihri — Education', story:'Fatima al-Fihri was a Muslim woman who founded the Qarawiyyin Mosque and university in Fes, Morocco — the world\'s oldest continuously running university. She used her inheritance to build a centre of learning that taught for over a thousand years.',
    questions:[
      q({question:'What did Fatima al-Fihri found?', options:['The Qarawiyyin university in Fes','A hospital in Baghdad','An observatory in Cairo','A library in Cordoba'], explanation:'Fatima al-Fihri founded the Qarawiyyin Mosque and university in Fes — the world\'s oldest continuously running university.', requiredKeywords:['fatima','fihri','qarawiyyin','fes']}),
      q({question:'What did she use to build this centre of learning?', options:['Her inheritance','A royal grant','Borrowed money','Tax funds'], explanation:'She used her inheritance to build the Qarawiyyin, a centre of learning that has taught for over a thousand years.', acceptFreeText:true, requiredKeywords:['fatima','fihri','inheritance','learning']}),
    ]},
  { title:'The House of Wisdom', story:'The House of Wisdom (Bayt al-Hikmah) in Baghdad was a great library and translation centre of the Islamic Golden Age. Scholars of many faiths worked together to translate Greek, Persian, and Indian works into Arabic, sparking advances in science, medicine, and philosophy.',
    questions:[
      q({question:'What was the House of Wisdom?', options:['A library and translation centre in Baghdad','A palace in Makkah','A mosque in Cairo','A fort in Spain'], explanation:'The House of Wisdom was a great library and translation centre in Baghdad during the Golden Age.', requiredKeywords:['house of wisdom','baghdad','translation']}),
      q({question:'Who worked at the House of Wisdom?', options:['Scholars of many faiths working together','Only one scholar','Only soldiers','Only the caliph'], explanation:'Scholars of many faiths worked together there, translating works and advancing knowledge.', acceptFreeText:true, requiredKeywords:['house of wisdom','scholars','translation']}),
    ]},
  { title:'Islamic Golden Age — Values', story:'The Islamic Golden Age was driven by values the Qur\'an and Sunnah encouraged: curiosity, humility, and service. Seeking knowledge was seen as worship; helping the sick and poor was a duty. These values produced advances still shaping the world today.',
    questions:[
      q({question:'Which value drove the Islamic Golden Age?', options:['Curiosity and seeking knowledge as worship','Greed for gold','Conquest for its own sake','Pride in wealth'], explanation:'Curiosity and seeing the seeking of knowledge as worship drove the Golden Age.', requiredKeywords:['golden age','curiosity','knowledge','worship']}),
      q({question:'In your own words, how did Islam encourage science?', options:['By teaching that seeking knowledge is worship and serving creation is a duty','By forbidding questions','By banning books','By closing libraries'], explanation:'Islam encouraged science by teaching that seeking knowledge is worship and serving creation is a duty.', acceptFreeText:true, requiredKeywords:['knowledge','worship','science','service']}),
    ]},
  { title:'Gheebah — Backbiting', story:'Gheebah (backbiting) is mentioning something about your brother or sister that they would dislike, even if it is true. The Qur\'an compares it to eating the flesh of a dead brother — a powerful image of how harmful it is. We must guard our tongue and speak only good.',
    questions:[
      q({question:'What is Gheebah?', options:['Mentioning something about someone that they would dislike, behind their back','Praising someone to their face','Giving a gift','Asking after someone\'s health'], explanation:'Gheebah is backbiting — mentioning something about someone that they would dislike, behind their back.', requiredKeywords:['gheebah','backbiting','tongue']}),
      q({question:'What does the Qur\'an compare Gheebah to?', options:['Eating the flesh of a dead brother','Eating sweet fruit','Drinking cold water','Climbing a mountain'], explanation:'The Qur\'an compares Gheebah to eating the flesh of a dead brother — a powerful image of its harm.', acceptFreeText:true, requiredKeywords:['gheebah','flesh','dead','brother']}),
    ]},
  { title:'Digital Ethics in Islam', story:'Islamic manners apply online too. We must be truthful, avoid gossip and backbiting, protect privacy, and not spread harmful content. The Prophet (PBUH) taught that a person\'s tongue can lead them to good or ruin — and that applies to what we type and share.',
    questions:[
      q({question:'How should a Muslim behave online?', options:['Truthfully, avoiding gossip, protecting privacy','By sharing every rumour','By insulting others','By spreading secrets'], explanation:'A Muslim online should be truthful, avoid gossip and backbiting, protect privacy, and not spread harm.', requiredKeywords:['online','truthful','privacy','gossip']}),
      q({question:'In your own words, how does the Sunnah apply to digital life?', options:['We guard our tongue and what we type, speaking only good and avoiding harm','We can say anything online','Online life has no rules','We should post often to be famous'], explanation:'The Sunnah of guarding the tongue applies to what we type and share — speak only good and avoid harm.', acceptFreeText:true, requiredKeywords:['tongue','type','good','harm']}),
    ]},
  { title:'Mental Wellbeing in the Qur\'an', story:'The Qur\'an offers comfort for the heart: "With hardship comes ease" and "Do not despair of Allah\'s mercy." It teaches us to turn to Allah in sadness, to have sabr (patience), and to seek help through patience and prayer. Mental wellbeing is part of trusting Allah\'s care.',
    questions:[
      q({question:'What does the Qur\'an say about hardship?', options:['With hardship comes ease','Hardship never ends','Hardship is a punishment only','Hardship means Allah hates us'], explanation:'The Qur\'an teaches that with hardship comes ease.', requiredKeywords:['hardship','ease','quran']}),
      q({question:'How does the Qur\'an comfort a sad heart?', options:['"Do not despair of Allah\'s mercy" and seek help through patience and prayer','By telling us to give up','By telling us to hide','By telling us to be angry'], explanation:'The Qur\'an says "Do not despair of Allah\'s mercy" and to seek help through patience (sabr) and prayer.', acceptFreeText:true, requiredKeywords:['despair','mercy','sabr','patience']}),
    ]},
  { title:'Avoiding Gossip Online', story:'Sharing unverified news or rumours online can harm innocent people and spread fear. Islam teaches us to verify before sharing and to stay silent if in doubt. The Prophet (PBUH) said it is enough for a person to be considered a liar that they repeat everything they hear.',
    questions:[
      q({question:'What should we do before sharing news online?', options:['Verify it first, and stay silent if in doubt','Share it instantly to be first','Share it even if it might be false','Share it if it is exciting'], explanation:'We must verify news before sharing and stay silent if in doubt, to avoid harm.', requiredKeywords:['verify','silent','gossip']}),
      q({question:'What did the Prophet (PBUH) say about repeating everything we hear?', options:['It is enough for a person to be considered a liar','It is a sign of wisdom','It is required','It is rewarded'], explanation:'The Prophet (PBUH) said it is enough for a person to be considered a liar that they repeat everything they hear.', acceptFreeText:true, requiredKeywords:['liar','repeat','verify']}),
    ]},
  { title:'Battle of Badr', story:'The Battle of Badr was the first major battle in Islamic history. A small Muslim army of about 313 faced a much larger Makkan army. With faith and trust in Allah, the Muslims won. It showed that victory comes from Allah, not just numbers or weapons.',
    questions:[
      q({question:'Why was the Battle of Badr significant?', options:['It was the first major battle, won by a small Muslim army with Allah\'s help','It ended the Islamic Golden Age','It was a trade agreement','It was a marriage ceremony'], explanation:'Badr was the first major battle — a small Muslim army won against a much larger one through Allah\'s help.', requiredKeywords:['badr','first','battle','victory']}),
      q({question:'In your own words, what does Badr teach?', options:['Victory comes from Allah, not just numbers or weapons','Money wins wars','Lies win battles','Anger is strength'], explanation:'Badr teaches that victory comes from Allah, not from numbers or weapons alone.', acceptFreeText:true, requiredKeywords:['badr','victory','allah','faith']}),
    ]},
  { title:'Battle of Uhud', story:'The Battle of Uhud was a hard lesson for the early Muslims. The Prophet (PBUH) placed archers on a hill and told them not to leave their posts. When some left to chase the spoils, the enemy attacked from behind. Many Muslims were martyred, including the Prophet\'s uncle Hamza.',
    questions:[
      q({question:'What mistake caused the Muslim loss at Uhud?', options:['The archers left their posts against the Prophet\'s orders','They prayed too much','They fasted that day','They brought too few horses'], explanation:'The archers left their hill posts against the Prophet\'s (PBUH) orders, and the enemy attacked from behind.', requiredKeywords:['uhud','archers','posts','orders']}),
      q({question:'Who was martyred at Uhud and known as the "Lion of Allah"?', options:['Hamza, the Prophet\'s uncle','Abu Bakr','Umar','Ali only'], explanation:'Hamza, the Prophet\'s (PBUH) uncle, was martyred at Uhud and is called the "Lion of Allah".', acceptFreeText:true, requiredKeywords:['uhud','hamza','martyred']}),
    ]},
  { title:'Conquest of Makkah', story:'After years of exile and conflict, the Prophet (PBUH) returned to Makkah with a large army. The Makkans expected revenge, but he forgave them, asking, "What do you think I will do with you?" They said, "A good brother." He replied, "Go, you are free." This was mercy in action.',
    questions:[
      q({question:'How did the Prophet (PBUH) treat the Makkans when he conquered Makkah?', options:['He forgave them and set them free','He punished them all','He exiled them','He took their wealth'], explanation:'He forgave the Makkans, telling them "Go, you are free" — mercy in action.', requiredKeywords:['makkah','forgave','free','mercy']}),
      q({question:'In your own words, what does the Conquest of Makkah teach?', options:['That true strength is shown through mercy and forgiveness','That power is for revenge','That war is the goal','That anger wins'], explanation:'It teaches that true strength is shown through mercy and forgiveness, not revenge.', acceptFreeText:true, requiredKeywords:['makkah','mercy','forgiveness']}),
    ]},
  { title:'The Farewell Sermon', story:'In his Farewell Sermon, the Prophet (PBUH) summarised the religion: sanctity of life and property, kindness to women, the end of blood feuds, equality of all races — no Arab over a non-Arab except by piety. He left us the Qur\'an and his Sunnah, and asked us to hold firmly to them.',
    questions:[
      q({question:'What did the Prophet (PBUH) leave us to hold onto?', options:['The Qur\'an and his Sunnah','A treasure of gold','A map of battles','A list of enemies'], explanation:'He left us the Qur\'an and his Sunnah, and asked us to hold firmly to them.', requiredKeywords:['farewell','quran','sunnah']}),
      q({question:'What did the Farewell Sermon say about equality?', options:['No Arab has superiority over a non-Arab except by piety','Arabs are always above others','Wealth decides rank','Strength decides rank'], explanation:'It declared that no Arab has superiority over a non-Arab except by piety.', acceptFreeText:true, requiredKeywords:['farewell','equality','piety','arab']}),
    ]},
  { title:'Tawheed — Oneness of Allah', story:'Tawheed is the core of Islam: Allah is One in His lordship, His worship, and His names and attributes. He has no partner, no equal, and no offspring. Every belief and action in Islam flows from this single truth.',
    questions:[
      q({question:'What is Tawheed?', options:['The oneness of Allah in lordship, worship, and names','The five daily prayers','The pilgrimage to Makkah','The fasting of Ramadan'], explanation:'Tawheed is the oneness of Allah — in His lordship, His worship, and His names and attributes.', requiredKeywords:['tawheed','oneness','allah','one']}),
      q({question:'Name the three categories of Tawheed.', options:['Lordship, Worship, Names and Attributes','Salah, Zakat, Sawm','Fajr, Dhuhr, Asr','Makkah, Madinah, Jerusalem'], explanation:'The three categories are Tawheed of Lordship, of Worship, and of Names and Attributes.', acceptFreeText:true, requiredKeywords:['tawheed','lordship','worship','names']}),
    ]},
  { title:'Purpose of Life', story:'The Qur\'an states our purpose clearly: "I did not create jinn and mankind except to worship Me." Worship in Islam is not only prayer — it is every good action done sincerely for Allah. Work, study, kindness, and care for family all become worship with the right intention.',
    questions:[
      q({question:'What does the Qur\'an say is the purpose of life?', options:['To worship Allah','To gather wealth','To become famous','To defeat others'], explanation:'The Qur\'an says we were created to worship Allah.', requiredKeywords:['purpose','worship','allah']}),
      q({question:'In your own words, is worship only prayer?', options:['No — any good action done sincerely for Allah is worship','Yes, only Salah counts','Only fasting counts','Only Hajj counts'], explanation:'Worship is not only prayer — any good action done sincerely for Allah becomes worship.', acceptFreeText:true, requiredKeywords:['worship','intention','action','allah']}),
    ]},
  { title:'Mercy in Islam', story:'Mercy (Rahmah) is at the heart of Islam. Allah\'s most repeated names are Ar-Rahman and Ar-Raheem — the Most Merciful. The Prophet (PBUH) was sent as "a mercy to all the worlds". We are taught to be merciful to people, animals, and the earth itself.',
    questions:[
      q({question:'Which two names of Allah mean "the Most Merciful"?', options:['Ar-Rahman and Ar-Raheem','Al-Malik and Al-Quddus','Al-Aleem and Al-Hakeem','Al-Jabbar and Al-Mutakabbir'], explanation:'Ar-Rahman and Ar-Raheem are the two names of Allah that mean "the Most Merciful".', requiredKeywords:['rahman','raheem','mercy','merciful']}),
      q({question:'In your own words, what does "mercy to all the worlds" mean?', options:['The Prophet (PBUH) was sent as a mercy to all of creation — people, animals, and the earth','It means he was sent only to one city','It means he was sent only for the rich','It means he was sent only for men'], explanation:'It means the Prophet (PBUH) was sent as a mercy to all of creation — people, animals, and the earth.', acceptFreeText:true, requiredKeywords:['mercy','prophet','worlds','creation']}),
    ]},
  { title:'Leadership in Islam', story:'Leadership in Islam is a trust (Amanah), not a privilege. The Prophet (PBUH) said a leader of a people is their servant. A Muslim leader is just, consults others (Shura), and puts the welfare of the people before personal gain.',
    questions:[
      q({question:'How does Islam view leadership?', options:['As a trust and a service to the people','As a way to get rich','As a right to be proud','As power over others'], explanation:'Islam views leadership as a trust (Amanah) and a service to the people.', requiredKeywords:['leadership','trust','amanah','service']}),
      q({question:'What did the Prophet (PBUH) say a leader is?', options:['The servant of the people','Their master','Their enemy','Their owner'], explanation:'The Prophet (PBUH) said a leader of a people is their servant.', acceptFreeText:true, requiredKeywords:['leader','servant','people']}),
    ]},
  { title:'Responsibility to Society', story:'A Muslim is responsible not only for themselves but for their society. We enjoin good and forbid wrong, care for the poor and orphans, and work for justice. The Prophet (PBUH) said all people are like a body — when one part hurts, the whole body suffers.',
    questions:[
      q({question:'What did the Prophet (PBUH) compare the community to?', options:['One body — when one part hurts, all of it suffers','A broken jar','A pile of stones','A row of trees'], explanation:'The Prophet (PBUH) compared the community to one body — when one part hurts, the whole body feels it.', requiredKeywords:['body','community','hurts']}),
      q({question:'In your own words, what is a Muslim\'s duty to society?', options:['To enjoin good, forbid wrong, care for the poor, and work for justice','To mind only one\'s own business','To gather wealth only','To stay silent always'], explanation:'A Muslim\'s duty is to enjoin good, forbid wrong, care for the poor and orphans, and work for justice.', acceptFreeText:true, requiredKeywords:['society','justice','poor','good']}),
    ]},
  { title:'Comprehensive Worldview', story:'A Muslim\'s worldview is built on Tawheed, purpose, mercy, and responsibility. Every part of life — worship, family, work, society, and the environment — is connected to Allah. This integrated view gives a Muslim balance, meaning, and direction in everything they do.',
    questions:[
      q({question:'What is at the centre of a Muslim\'s worldview?', options:['Tawheed — the oneness of Allah','Wealth and fame','Competition alone','Personal comfort'], explanation:'Tawheed — the oneness of Allah — is at the centre of a Muslim\'s worldview.', requiredKeywords:['worldview','tawheed','allah']}),
      q({question:'In your own words, how does Islam connect all parts of life?', options:['Every part of life — worship, family, work, society — is connected to Allah','Only prayer matters','Only family matters','Only money matters'], explanation:'Every part of life — worship, family, work, society, and the environment — is connected to Allah.', acceptFreeText:true, requiredKeywords:['worldview','life','allah','connected']}),
    ]},
  { title:'Review & Champion Reflection', story:'You have reached the end of your journey as a Young Scholar. Reflect on everything you have learned: Tawheed, the Seerah, the Golden Age, ethics, mercy, leadership, and responsibility. A true scholar does not just know — they act, share, and remain humble before Allah.',
    questions:[
      q({question:'What does a true scholar do, according to this journey?', options:['Act on knowledge, share it, and stay humble before Allah','Keep knowledge secret','Boast about what they know','Ignore what they learned'], explanation:'A true scholar acts on their knowledge, shares it, and stays humble before Allah.', requiredKeywords:['scholar','act','humble','knowledge']}),
      q({question:'In your own words, what was the most important lesson of this tier?', options:['That Tawheed, mercy, and responsibility connect every part of a Muslim\'s life','That winning is everything','That money is the goal','That fame matters most'], explanation:'The most important lesson is that Tawheed, mercy, and responsibility connect every part of a Muslim\'s life.', acceptFreeText:true, requiredKeywords:['tawheed','mercy','responsibility','life']}),
    ]},
];

function buildTier(id, name, ageMin, ageMax, levels) {
  return {
    id, name, ageMin, ageMax,
    levels: levels.map((l, i) => ({
      id: `t${id}-l${i + 1}`,
      tier: id,
      levelNumber: i + 1,
      title: l.title,
      icon: ICONS[i % ICONS.length],
      storyText: l.story,
      questions: l.questions,
    })),
  };
}

const curriculum = {
  tiers: [
    buildTier(1, 'Little Explorers', 4, 7, tier1),
    buildTier(2, 'Faith Seekers', 8, 10, tier2),
    buildTier(3, 'Young Scholars', 11, 14, tier3),
  ],
};

writeFileSync(
  'src/data/kids_curriculum.json',
  JSON.stringify(curriculum, null, 2) + '\n',
);

console.log('Wrote curriculum:', curriculum.tiers.length, 'tiers,',
  curriculum.tiers.reduce((s, t) => s + t.levels.length, 0), 'levels');
