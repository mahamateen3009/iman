import type { HadithResult } from '../types/hadith';

/** Common English stopwords excluded from keyword extraction. */
const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'can', 'to', 'of', 'in', 'on', 'at',
  'by', 'for', 'with', 'about', 'as', 'into', 'like', 'through', 'after',
  'over', 'between', 'out', 'against', 'during', 'without', 'before',
  'under', 'around', 'among', 'and', 'or', 'but', 'not', 'no', 'nor',
  'so', 'yet', 'both', 'either', 'neither', 'each', 'every', 'all', 'any',
  'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too', 'very',
  'just', 'also', 'only', 'own', 'same', 'that', 'this', 'these', 'those',
  'i', 'me', 'my', 'we', 'us', 'our', 'you', 'your', 'he', 'him', 'his',
  'she', 'her', 'it', 'its', 'they', 'them', 'their', 'what', 'which',
  'who', 'whom', 'whose', 'when', 'where', 'why', 'how', 'if', 'because',
  'while', 'from', 'up', 'down', 'off', 'again', 'further', 'here',
  'there', 'now', 'am', 'feel', 'feeling', 'really',
  'get', 'got', 'want', 'need', 'dont', 'cant',
  'wont', 'im', 'ive', 'id', 'ill', 'thing', 'things', 'stuff',
  'lot', 'lots', 'kind', 'sort', 'maybe', 'perhaps', 'though', 'still',
  'even', 'much', 'many', 'keep', 'make', 'makes', 'made', 'go', 'going',
  'help', 'someone', 'something', 'anything', 'everything',
]);

/** Emotion synonyms — maps user words to canonical emotion tags. */
const EMOTION_SYNONYMS: Record<string, string[]> = {
  anxiety: ['anxious', 'anxiety', 'worried', 'worry', 'panic', 'nervous', 'stress', 'stressed', 'overwhelm', 'overwhelmed', 'fear', 'afraid', 'scared', 'terrified', 'dread', 'phobia', 'restless', 'on edge', 'cant breathe', "can't breathe", 'racing thoughts', 'chest tight', 'tight chest', 'uneasy', 'apprehens', 'tense', 'tension', 'paranoid', 'suffocat', 'freaking out', 'losing my mind', 'cant relax', "can't relax", 'on edge', 'jittery', 'shaky', 'trembl', 'heart racing', 'palpitat', 'hyperventilat', 'nervous breakdown', 'mental breakdown'],
  sadness: ['sad', 'sadness', 'depress', 'depressed', 'down', 'low', 'unhappy', 'cry', 'crying', 'tears', 'weep', 'weeping', 'grief', 'grieving', 'loss', 'lost', 'lonely', 'loneliness', 'sorrow', 'sorrowful', 'pain', 'painful', 'heartbroken', 'heartbreak', 'devastated', 'shattered', 'broken', 'empty inside', 'hollow', 'miserable', 'miserable', 'hopeless', 'worthless', 'numb', 'dead inside', 'no joy', 'no happiness', 'cant feel', "can't feel", 'gloom', 'gloomy', 'despondent', 'desolate', 'anguish', 'torment', 'agoniz', 'suffering', 'bleak', 'blue', 'down in the dumps', 'heavy heart', 'weight on my chest', 'mourning', 'mourn', 'bereav', 'miss them', 'miss him', 'miss her', 'gone', 'passed away', 'died', 'death', 'funeral'],
  patience: ['patience', 'patient', 'sabr', 'endure', 'endurance', 'hardship', 'hard', 'difficult', 'difficulty', 'trial', 'trials', 'tests', 'tested', 'test', 'suffer', 'suffering', 'illness', 'sick', 'sickness', 'sick', 'unwell', 'disease', 'cancer', 'hospital', 'pain', 'chronic', 'struggle', 'struggling', 'struggled', 'challenge', 'challenging', 'obstacle', 'barrier', 'tough', 'rough', 'hard time', 'difficult time', 'going through', 'enduring', 'persever', 'steadfast', 'hold on', 'holding on', 'keep going', 'cant take it', "can't take it", 'too much', 'burden', 'heavy', 'crushing', 'exhausting', 'draining', 'deplet', 'wearing me down', 'breaking me', 'calamity', 'calamities', 'affliction', 'disaster', 'catastrophe', 'tragedy', 'trauma', 'traumatic', 'abuse', 'abused', 'oppress', 'oppressed', 'injustice', 'treated unfairly', 'wronged', 'mistreated'],
  hope: ['hope', 'hopeless', 'hopeless', 'despair', 'desperate', 'give up', 'giving up', 'given up', 'future', 'lost', 'direction', 'directionless', 'purpose', 'meaning', 'meaningless', 'pointless', 'trust', 'destiny', 'decree', 'qadar', 'no future', 'no point', 'why bother', 'whats the point', "what's the point", 'no reason', 'empty future', 'bleak', 'dark', 'darkness', 'tunnel', 'no light', 'no way out', 'stuck', 'trapped', 'dead end', 'nowhere', 'lost my way', 'lost myself', 'no purpose', 'no meaning', 'worthless', 'nobody cares', 'no one cares', 'forsaken', 'abandoned', 'forsaken', 'wandering', 'lost soul', 'adrift', 'aimless'],
  motivation: ['motivation', 'motivate', 'motivated', 'unmotivated', 'lazy', 'laziness', 'lazing', 'procrastinat', 'unproductive', 'stuck', 'routine', 'habit', 'habits', 'discipline', 'undisciplined', 'drained', 'exhausted', 'tired', 'fatigue', 'weary', 'burnt out', 'burnout', 'burned out', 'no energy', 'low energy', 'sluggish', 'lethargic', 'apathetic', 'apathy', 'indifferent', 'dont care', "don't care", 'no drive', 'no ambition', 'no goals', 'no motivation', 'cant get started', "can't get started", 'putting things off', 'delaying', 'avoiding', 'avoidance', 'scrolling all day', 'wasting time', 'wasting my life', 'no progress', 'no momentum', 'stuck in a rut', 'in a slump', 'in a funk', 'no discipline', 'cant focus', "can't focus", 'distracted', 'distraction', 'scattered', 'no routine', 'no structure', 'no consistency', 'inconsistent', 'starting over', 'keep failing', 'keep falling', 'relapse', 'relapsing', 'gave up on my goals', 'no willpower', 'no self-control', 'no follow through', 'no follow-through'],
  anger: ['angry', 'anger', 'furious', 'rage', 'raging', 'irritat', 'irritated', 'irritating', 'frustrat', 'frustrated', 'frustrating', 'mad', 'resentful', 'resentment', 'bitter', 'bitterness', 'fight', 'fought', 'fighting', 'beat', 'beating', 'hate', 'hated', 'hating', 'hostile', 'aggress', 'aggressive', 'punch', 'punching', 'attack', 'attacking', 'argu', 'argument', 'arguing', 'conflict', 'clash', 'clashing', 'confront', 'confrontation', 'outrage', 'outraged', 'livid', 'fuming', 'seething', 'incens', 'indign', 'wrath', 'enraged', 'infuriat', 'provoked', 'provoking', 'antagoniz', 'venom', 'vengeful', 'vengeance', 'revenge', 'grudge', 'holding a grudge', 'fed up', 'had enough', 'lost my temper', 'losing my temper', 'snapped', 'snapping', 'lashing out', 'lash out', 'boiling', 'blood boiling', 'see red', 'seeing red', 'temper', 'short fuse', 'explosive', 'destructive', 'smash', 'breaking things', 'threw', 'throwing', 'slammed', 'yelling', 'screaming', 'shouting', 'cursing', 'swearing'],
  gratitude: ['grateful', 'gratitude', 'thankful', 'thankfulness', 'blessing', 'blessed', 'blessings', 'thank', 'thanks', 'thanking', 'shukr', 'appreciate', 'appreciation', 'appreciated', 'lucky', 'fortunate', 'fortune', 'blessed me', 'blessed with', 'gifted', 'gift', 'given me', 'allhamdulillah', 'alhamdulillah', 'praise be to allah', 'thank god', 'thank allah', 'so grateful', 'so thankful', 'count my blessings', 'blessed alhamdulillah', 'lucky to have', 'fortunate to', 'gratitude for', 'appreciative', 'content', 'contentment', 'satisfied', 'fulfilled', 'fulfillment', 'joy', 'joyful', 'happy', 'happiness', 'delighted', 'glad', 'gladness', 'overjoyed', 'elated', 'thrilled', 'bliss', 'blissful', 'euphoric', 'cheerful', 'cheer', 'positive', 'optimistic', 'good mood', 'in a good place', 'things are good', 'life is good', 'smiling', 'smile'],
  forgiveness: ['forgive', 'forgiveness', 'guilt', 'guilty', 'sin', 'sinned', 'sinning', 'repent', 'repentance', 'repenting', 'mistake', 'mistakes', 'wrong', 'wronged', 'ashamed', 'shame', 'shameful', 'regret', 'regrets', 'regretful', 'rue', 'remorse', 'remorseful', 'guilty conscience', 'bad conscience', 'did something bad', 'did something wrong', 'i messed up', 'messed up', 'screwed up', 'ruined', 'i failed', 'failed myself', 'failed them', 'let them down', 'let myself down', 'let down', 'disappoint', 'disappointed', 'disappointing', 'disgrace', 'disgraced', 'humiliated', 'embarrassed', 'embarrass', 'i should not have', 'i shouldnt have', "i shouldn't have", 'if only i had not', 'i wish i had not', 'i wish i didnt', "i wish i didn't", 'i regret', 'feeling bad about', 'feeling guilty', 'weight of guilt', 'burden of guilt', 'cant forgive myself', "can't forgive myself", 'how could i', 'how could i do that', 'i betrayed', 'betrayed', 'broke trust', 'broke a promise', 'broke my word', 'backstab', 'two-faced', 'hypocrite', 'hypocrisy', 'tawbah', 'astaghfirullah', 'seeking forgiveness', 'want to repent', 'want forgiveness', 'cleanse my heart', 'purify', 'atonement', 'atone'],
  comfort: ['comfort', 'comforting', 'comforted', 'alone', 'lonely', 'loneliness', 'hurt', 'hurting', 'hurts', 'wounded', 'wound', 'distress', 'distressed', 'peace', 'peaceful', 'calm', 'rest', 'restless', 'isolated', 'isolation', 'empty', 'emptiness', 'numb', 'numbed', 'broken', 'brokenness', 'aching', 'ache', 'heartache', 'heart aches', 'pain', 'painful', 'agony', 'agony', 'suffering', 'suffer', 'wounded heart', 'scarred', 'scars', 'traumatized', 'trauma', 'abandoned', 'abandonment', 'rejected', 'rejection', 'unloved', 'unwanted', 'unseen', 'invisible', 'forgotten', 'ignored', 'neglected', 'unnoticed', 'no one sees me', 'no one hears me', 'nobody listens', 'cant cope', "can't cope", 'overwhelm', 'overwhelmed', 'drowning', 'sinking', 'falling apart', 'falling to pieces', 'crumbling', 'shattered', 'in pieces', 'barely holding on', 'barely hanging on', 'at the end of my rope', 'at my limit', 'past my limit', 'cant go on', "can't go on", 'need a break', 'need rest', 'exhausted', 'burnt out', 'burned out', 'weary', 'weary soul', 'tired of it all', 'soul is tired', 'spirit is heavy', 'heart is heavy', 'need peace', 'seeking peace', 'seeking comfort', 'solace', 'consolation', 'need a safe space', 'need someone to talk to', 'need to be heard', 'need a hug', 'need support', 'need help', 'i am not okay', 'im not okay', "i'm not okay", 'not fine', 'not good', 'struggling to get out of bed', 'cant get out of bed', "can't get out of bed", 'no motivation to do anything', 'everything feels heavy', 'life is hard', 'life is heavy', 'weary of life'],
  character: ['character', 'manners', 'manner', 'kindness', 'kind', 'mercy', 'merciful', 'compassion', 'compassionate', 'love', 'loving', 'brotherhood', 'respect', 'respectful', 'honest', 'honesty', 'truthful', 'truth', 'integrity', 'dignity', 'noble', 'noble character', 'good person', 'good muslim', 'good character', 'akhlaq', 'akhlaaq', 'adab', 'moral', 'morality', 'ethics', 'ethical', 'virtue', 'virtuous', 'decency', 'decent', 'humble', 'humility', 'modest', 'modesty', 'generous', 'generosity', 'charitable', 'charity', 'sadaqah', 'sadaqa', 'forgiving', 'patient', 'gentle', 'gentleness', 'soft heart', 'soft-hearted', 'tender', 'caring', 'care', 'caring person', 'empathy', 'empathetic', 'sympathy', 'sympathetic', 'polite', 'courteous', 'gracious', 'grace', 'honor', 'honorable', 'trustworthy', 'trust', 'reliable', 'dependable', 'loyal', 'loyalty', 'sincere', 'sincerity', 'authentic', 'genuine', 'upright', 'righteous', 'righteousness', 'goodness', 'good deed', 'good deeds', 'helping others', 'helping people', 'serving others', 'best of character', 'best manners', 'beautiful character', 'ihsan', 'ihsaan'],
  relationships: ['sister', 'sisters', 'brother', 'brothers', 'mother', 'mom', 'mum', 'father', 'dad', 'family', 'families', 'sibling', 'siblings', 'parent', 'parents', 'relative', 'relatives', 'kin', 'kins', 'cousin', 'cousins', 'spouse', 'wife', 'wives', 'husband', 'friend', 'friends', 'friendship', 'relationship', 'relationships', 'marriage', 'married', 'marry', 'divorce', 'divorced', 'separation', 'separated', 'ties', 'kinship', 'silah', 'silat ar-rahim', 'silat al-rahim', 'cut off', 'cutting ties', 'breaking ties', 'broke ties', 'argu', 'argument', 'arguing', 'argumentative', 'fight', 'fought', 'fighting', 'dispute', 'disputing', 'disagreement', 'disagree', 'betray', 'betrayed', 'betrayal', 'trust broken', 'broke my trust', 'broke trust', 'jealous', 'jealousy', 'envy', 'envious', 'in-laws', 'in law', 'in-law', 'mother-in-law', 'father-in-law', 'sister-in-law', 'brother-in-law', 'daughter', 'son', 'children', 'child', 'kids', 'aunt', 'uncle', 'grandmother', 'grandfather', 'grandma', 'grandpa', 'niece', 'nephew', 'stepmother', 'stepfather', 'stepmom', 'stepdad', 'stepchildren', 'toxic family', 'toxic relationship', 'abusive', 'abusive family', 'narcissistic parent', 'controlling', 'manipulative', 'gaslight', 'gaslighting', 'comparing me', 'favorites', 'favoritism', 'they dont love me', "they don't love me", 'they dont care', "they don't care", 'unloved by family', 'rejected by family', 'disowned', 'kicked out', 'they hate me', 'my family hates me', 'my sister hates me', 'my brother hates me', 'my parents hate me', 'they wont talk to me', "they won't talk to me", 'not speaking', 'silent treatment', 'shutting me out', 'left me out', 'excluded', 'exclusion', 'i miss my', 'i want to reconcile', 'reconcile', 'reconciliation', 'make amends', 'fix things', 'fix my family', 'fix my marriage', 'fix our relationship', 'i want to fix', 'i want to make peace', 'make peace', 'peace between us', 'bring us together', 'bring the family together', 'unite the family', 'i want my family back', 'i want my friend back', 'i lost my friend', 'i lost my brother', 'i lost my sister', 'i lost my mother', 'i lost my father', 'estranged', 'estrangement', 'no contact', 'went no contact', 'low contact'],
  worship: ['worship', 'prayer', 'salah', 'salat', 'pray', 'praying', 'prayed', 'namaz', 'ibadah', 'ibaadah', 'quran', 'qur\\u2019an', 'koran', 'recite', 'reciting', 'recitation', 'dhikr', 'dhikr', 'zikr', 'remember allah', 'remembrance', 'tasbih', 'tasbeeh', 'dua', 'du\\u2019a', "du'a", 'supplication', 'fasting', 'fast', 'siyam', 'sawm', 'ramadan', 'ramazan', 'zakat', 'zakah', 'charity', 'sadaqah', 'sadaqa', 'hajj', 'umrah', 'mosque', 'masjid', 'jumuah', 'jumua', 'friday prayer', 'congregation', 'congregational', 'imam', 'wudu', 'ablution', 'purity', 'taharah', 'tahara', 'prayer mat', 'prayer rug', 'missed prayer', 'missed salah', 'skip prayer', 'skipping prayer', 'lazy to pray', 'cant pray', "can't pray", 'struggling to pray', 'struggling with salah', 'want to pray more', 'want to worship more', 'closer to allah', 'closer to god', 'connect with allah', 'connection with allah', 'spiritual', 'spirituality', 'faith', 'imaan', 'iman', 'deen', 'doubt', 'doubting', 'questioning faith', 'losing faith', 'weak iman', 'weak faith', 'strengthen faith', 'strengthen iman', 'taqwa', 'god consciousness', 'piety', 'pious', 'righteous', 'sinning', 'commit sin', 'stopping sin', 'want to stop sinning', 'religious', 'religiosity', 'practicing', 'practicing muslim', 'becoming more religious', 'come back to islam', 'come back to deen', 'revert', 'reverting', 'new muslim', 'convert'],
  provision: ['provision', 'rizq', 'rizq', 'money', 'financial', 'finance', 'finances', 'broke', 'poor', 'poverty', 'debt', 'debts', 'in debt', 'owe', 'owing', 'loan', 'loans', 'mortgage', 'rent', 'cant pay', "can't pay", 'cant afford', "can't afford", 'job', 'jobs', 'unemployed', 'unemployment', 'lost my job', 'fired', 'laid off', 'salary', 'paycheck', 'income', 'no income', 'low income', 'business', 'business failed', 'startup', 'financial difficulty', 'financial hardship', 'financial stress', 'money problems', 'struggling financially', 'providing for', 'provide for family', 'cant provide', "can't provide", 'breadwinner', 'bills', 'cant pay bills', "can't pay bills", 'overdue', 'collection', 'collector', 'bankruptcy', 'bankrupt', 'eviction', 'evicted', 'homeless', 'homelessness', 'no money', 'need money', 'financial crisis', 'economic', 'economy', 'inflation', 'cost of living', 'expensive', 'everything is expensive', 'cant make ends meet', "can't make ends meet", 'living paycheck to paycheck', 'paycheck to paycheck', 'rizq is low', 'barakah', 'baraka', 'blessing in wealth', 'no barakah', 'sustenance', 'livelihood', 'earning', 'halaal earning', 'halal earning', 'halal income', 'haram money', 'interest', 'riba', 'usury', 'gambling', 'lottery', 'stock', 'trading', 'crypto', 'investment', 'investing', 'scammed', 'scam', 'fraud', 'stolen money', 'lost money'],
  knowledge: ['knowledge', 'ilm', 'learn', 'learning', 'learned', 'study', 'studying', 'student', 'education', 'school', 'college', 'university', 'exam', 'exams', 'test', 'tests', 'grades', 'grade', 'fail', 'failed', 'failing', 'failure', 'pass', 'studying for', 'cant focus on studying', "can't focus on studying", 'cant concentrate', "can't concentrate", 'procrastinat', 'distracted', 'memorize', 'memorizing', 'memorization', 'hifz', 'hifdh', 'memorize quran', 'memorizing quran', 'quran memorization', 'tajweed', 'arabic', 'learning arabic', 'islamic studies', 'islamic knowledge', 'seeking knowledge', 'seeking ilm', 'sacred knowledge', 'scholar', 'scholars', 'alim', 'aalim', 'ulema', 'scholarship', 'research', 'thesis', 'assignment', 'homework', 'dissertation', 'graduation', 'graduate', 'degree', 'diploma', 'certificate', 'course', 'enrolled', 'enrollment', 'tuition', 'fees', 'cant afford school', "can't afford school", 'dropout', 'dropped out', 'academic', 'academia', 'teacher', 'professor', 'instructor', 'mentor', 'wisdom', 'hikmah', 'hikma', 'understanding', 'comprehension', 'forget', 'forgetting', 'cant remember', "can't remember", 'poor memory', 'retention', 'brain fog', 'cant retain', "can't retain", 'improve memory', 'study tips', 'study habits', 'discipline', 'consistency', 'motivation to study', 'no motivation to study', 'exam stress', 'exam anxiety', 'performance', 'performance pressure', 'parent pressure', 'pressure to succeed', 'imposter syndrome', 'not smart enough', 'feel stupid', 'inferior', 'compare myself'],
  death: ['death', 'died', 'dying', 'dead', 'pass away', 'passed away', 'passing', 'lost someone', 'lost a loved one', 'lost my', 'grief', 'grieving', 'grieve', 'mourn', 'mourning', 'bereavement', 'bereaved', 'funeral', 'janazah', 'janaza', 'burial', 'grave', 'graveyard', 'cemetery', 'casket', 'coffin', 'terminal', 'terminal illness', 'cancer', 'hospice', 'palliative', 'end of life', 'life expectancy', 'months to live', 'weeks to live', 'days to live', 'deathbed', 'near death', 'afterlife', 'hereafter', 'akhirah', 'akhira', 'judgment', 'judgement', 'day of judgment', 'day of judgement', 'yawm al-qiyamah', 'resurrection', 'paradise', 'hellfire', 'jannah', 'jahannam', 'punishment', 'account', 'reckoning', 'standing before allah', 'fear of death', 'afraid of death', 'scared of dying', 'dont want to die', "don't want to die", 'not ready to die', 'what happens after death', 'is there life after death', 'soul', 'ruh', 'rooh', 'spirit', 'spirit leaving', 'transition', 'eternal', 'eternity', 'legacy', 'what will happen to my family when i die', 'will i go to jannah', 'will i go to hell', 'my sins', 'not ready to meet allah', 'meeting allah', 'returning to allah', 'inna lillahi', 'inna lillahi wa inna ilayhi rajiun', 'may allah have mercy', 'may allah grant him jannah', 'may allah grant her jannah', 'rest in peace', 'departed', 'soul departed'],
  pride: ['pride', 'proud', 'arrogance', 'arrogant', 'haughty', 'conceited', 'conceit', 'boastful', 'boasting', 'boast', 'brag', 'bragging', 'show off', 'showing off', 'riya', 'riyaa', 'ostentation', 'vanity', 'ego', 'egotistical', 'self-important', 'self-important', 'narcissist', 'narcissism', 'narcissistic', 'superior', 'superiority', 'look down on', 'looking down on', 'condescending', 'belittle', 'belittling', 'dismissive', 'entitled', 'entitlement', 'i am better', 'better than', 'i deserve more', 'ungrateful', 'i dont need help', "i don't need help", 'i can do it alone', 'stubborn', 'prideful', 'high and mighty', 'full of myself', 'full of himself', 'full of herself', 'big ego', 'inflated ego', 'humility lacking', 'no humility', 'need to be humbled', 'i have a pride problem', 'struggling with pride', 'arrogance of the heart', 'kibr', 'kibr', 'ujb', 'self-admiration', 'self-conceit', 'hidden pride', 'subtle pride', 'spiritual pride', 'religious arrogance', 'pious arrogance', 'i am so religious', 'more religious than', 'better muslim than', 'judging others', 'judgmental', 'looking down on sinners', 'self-righteous', 'self righteous', 'smug', 'contempt', 'disdain', 'scorn', 'sneer', 'patronizing', 'overconfident', 'overconfidence', 'i know better', 'nobody can teach me', 'too proud to apologize', 'too proud to ask for help', 'too proud to admit i am wrong'],
  greed: ['greed', 'greedy', 'materialism', 'materialistic', 'miserly', 'miser', 'stingy', 'stinginess', 'cheap', 'hoard', 'hoarding', 'hoarder', 'accumulate', 'accumulation', 'wealth', 'rich', 'riches', 'money obsessed', 'obsessed with money', 'want more', 'never enough', 'insatiable', 'covetous', 'covet', 'avarice', 'avaricious', 'grasping', 'selfish', 'selfishness', 'self-centered', 'self-centered', 'attachment to dunya', 'attachment to the world', 'love of dunya', 'love of the world', 'dunya', 'worldly', 'worldliness', 'luxury', 'luxuries', 'lavish', 'extravagant', 'extravagance', 'excess', 'consumerism', 'shopping', 'shopping addiction', 'spending', 'overspending', 'compulsive buying', 'buying things', 'acquiring', 'acquisition', 'possessions', 'possessive', 'collecting', 'keeping', 'cant let go', "can't let go", 'attaching heart to', 'attached to', 'material gain', 'profit', 'profit maximization', 'never satisfied', 'always wanting', 'envy of wealth', 'jealous of rich', 'want to be rich', 'obsessed with wealth', 'love of money', 'gold', 'silver', 'properties', 'property', 'real estate', 'cars', 'designer', 'brands', 'status symbols', 'keeping up with', 'compare wealth', 'financial greed', 'bukhl', 'bukhl', 'shuhh', 'hirs', 'hirs al-dunya', 'hubb al-dunya', 'love of this world', 'distracted by dunya', 'dunya took over', 'heart attached to wealth', 'cant give sadaqah', "can't give sadaqah", 'reluctant to give', 'giving hurts', 'too attached to money'],
  envy: ['envy', 'envious', 'jealous', 'jealousy', 'hasad', 'hassad', 'envy of others', 'jealous of', 'envy of', 'comparing', 'compare', 'comparison', 'comparing myself', 'comparing my life', 'everyone is doing better', 'everyone has more', 'why them and not me', 'why do they have', 'i want what they have', 'they have it better', 'social media envy', 'instagram envy', 'looking at others', 'checking up on others', 'cant stop comparing', "can't stop comparing", 'comparison is the thief of joy', 'feeling behind', 'behind in life', 'behind everyone', 'not as successful', 'not as pretty', 'not as smart', 'not as religious', 'not as wealthy', 'not as popular', 'why is everyone else', 'they are so much', 'i wish i had', 'i wish i were', 'i wish i was', 'if only i had', 'why not me', 'others are blessed more', 'allah blessed them more', 'allah gave them more', 'feeling inferior', 'feeling less than', 'inadequate', 'inadequacy', 'not good enough', 'not enough', 'self-worth', 'self esteem', 'low self esteem', 'worthless', 'insecure', 'insecurity', 'insecurities', 'body image', 'looks', 'appearance', 'ugly', 'unattractive', 'too fat', 'too skinny', 'too short', 'too tall', 'too dark', 'too light', 'hair', 'skin', 'beauty standards', 'social media pressure', 'everyone is prettier', 'everyone is happier', 'everyone is richer', 'fomo', 'missing out', 'left behind', 'cant keep up', "can't keep up", ' Competing', 'competition', 'unhealthy competition', 'trying to outdo', 'trying to impress', 'seeking validation', 'need approval', 'need validation', 'people pleasing', 'caring what others think', 'worried about what people think', 'fear of missing out', 'inadequate compared to'],
};

/** Emotion-to-tag synonym map for broader relevance scoring. */
const EMOTION_EXPANSION: Record<string, string[]> = {
  anxiety: ['anxiety', 'worry', 'fear', 'distress', 'comfort', 'trust', 'surrender', 'patience', 'hope', 'dhikr', 'remembrance'],
  sadness: ['sadness', 'sorrow', 'grief', 'pain', 'patience', 'comfort', 'hope', 'trial', 'loss', 'loneliness', 'tears'],
  patience: ['patience', 'trial', 'hardship', 'suffering', 'endurance', 'illness', 'reward', 'hope', 'trust', 'perseverance', 'steadfast'],
  hope: ['hope', 'trust', 'motivation', 'reward', 'paradise', 'comfort', 'ease', 'mercy', 'future', 'relief', 'salvation'],
  motivation: ['motivation', 'strength', 'action', 'courage', 'change', 'worship', 'dhikr', 'perseverance', 'strive', 'effort', 'diligence', 'discipline'],
  anger: ['anger', 'self-control', 'patience', 'character', 'relationships', 'forgiveness', 'mercy', 'restraint', 'silence', 'calm'],
  gratitude: ['gratitude', 'blessings', 'appreciation', 'joy', 'contentment', 'thankful', 'praise', 'favor', 'bounty', 'shukr', 'satisfaction'],
  forgiveness: ['forgiveness', 'repentance', 'guilt', 'sin', 'hope', 'mercy', 'pardon', 'expiat', 'return', 'tawbah', 'remorse', 'amend'],
  comfort: ['comfort', 'hope', 'patience', 'dhikr', 'remembrance', 'trust', 'peace', 'calm', 'ease', 'relief', 'solace', 'tranquility'],
  character: ['character', 'manners', 'kindness', 'mercy', 'compassion', 'love', 'integrity', 'honesty', 'truthful', 'dignity', 'noble', 'righteous', 'brotherhood', 'generosity', 'humility', 'virtue'],
  relationships: ['relationships', 'character', 'patience', 'anger', 'mercy', 'compassion', 'kindness', 'forgiveness', 'family', 'kinship', 'brotherhood', 'love', 'ties', 'reconciliation', 'peace'],
  worship: ['worship', 'prayer', 'salah', 'dhikr', 'remembrance', 'faith', 'taqwa', 'piety', 'devotion', 'obedience', 'surrender', 'hope', 'motivation', 'comfort', 'patience'],
  provision: ['provision', 'rizq', 'patience', 'hope', 'trust', 'gratitude', 'contentment', 'reliance', 'tawakkul', 'sabr', 'comfort', 'motivation'],
  knowledge: ['knowledge', 'wisdom', 'learning', 'study', 'patience', 'motivation', 'discipline', 'effort', 'action', 'understanding', 'reflection', 'hope'],
  death: ['death', 'patience', 'hope', 'comfort', 'hereafter', 'paradise', 'trial', 'suffering', 'grief', 'sorrow', 'remembrance', 'trust', 'fear'],
  pride: ['pride', 'humility', 'character', 'manners', 'manners', 'self-control', 'knowledge', 'worship', 'repentance', 'forgiveness', 'truth', 'honesty'],
  greed: ['greed', 'contentment', 'gratitude', 'patience', 'charity', 'generosity', 'detachment', 'dunya', 'worship', 'hope', 'trust', 'rizq'],
  envy: ['envy', 'gratitude', 'contentment', 'patience', 'character', 'love', 'brotherhood', 'humility', 'comparison', 'self-worth', 'hope', 'trust'],
};

/** Expand emotions into all related tag-words for scoring. */
function expandEmotionsForScoring(emotions: string[]): string[] {
  const expanded = new Set<string>(emotions);
  for (const e of emotions) {
    if (EMOTION_EXPANSION[e]) {
      EMOTION_EXPANSION[e].forEach((t) => expanded.add(t));
    }
  }
  return [...expanded];
}

export interface ScoredHadith {
  result: HadithResult;
  score: number;
  matchedKeywords: string[];
}

/**
 * Extract meaningful keywords from a user message, filtering stopwords
 * and short tokens. Returns lowercased unique keywords.
 */
export function extractKeywords(message: string): string[] {
  const lower = message.toLowerCase();
  const tokens = lower
    .replace(/[^a-z\s']/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return [...new Set(tokens)];
}

/**
 * Extract canonical emotions from a user message.
 */
export function extractEmotions(message: string): string[] {
  const lower = message.toLowerCase();
  const matched = new Set<string>();
  for (const [emotion, synonyms] of Object.entries(EMOTION_SYNONYMS)) {
    if (synonyms.some((s) => lower.includes(s))) {
      matched.add(emotion);
    }
  }
  return [...matched];
}

/**
 * Score a hadith's relevance to the user's message on a 0–1 scale.
 *
 * Scoring combines:
 *  - Emotion tag match (strongest signal): if the user's emotions
 *    overlap with the hadith's tags, high score.
 *  - Keyword overlap: user keywords found in hadith text.
 *  - Semantic tag match: user keywords found in hadith tags.
 */
export function scoreHadith(
  hadith: { text: string; tags?: string[] },
  keywords: string[],
  emotions: string[]
): { score: number; matched: string[] } {
  if (keywords.length === 0 && emotions.length === 0) {
    return { score: 0, matched: [] };
  }

  const textLower = hadith.text.toLowerCase();
  const tags = hadith.tags?.map((t) => t.toLowerCase()) ?? [];
  const matched: string[] = [];
  let score = 0;

  // Expand emotions into all related tags for matching.
  const expandedEmotions = expandEmotionsForScoring(emotions);

  // Emotion-to-tag matching (strongest signal): check if ANY expanded
  // emotion synonym appears in the hadith's tags.
  if (expandedEmotions.length > 0 && tags.length > 0) {
    const emotionMatches = expandedEmotions.filter((e) => tags.includes(e));
    if (emotionMatches.length > 0) {
      score += 0.6 * (emotionMatches.length / Math.max(expandedEmotions.length, 1));
      emotionMatches.forEach((m) => { if (!matched.includes(m)) matched.push(m); });
    }
  }

  // Keyword-to-text matching.
  let textHits = 0;
  for (const kw of keywords) {
    if (textLower.includes(kw)) {
      textHits++;
      if (!matched.includes(kw)) matched.push(kw);
    }
  }
  if (keywords.length > 0) {
    score += 0.3 * (textHits / keywords.length);
  }

  // Keyword-to-tag matching (semantic) — also check expanded emotions.
  let tagHits = 0;
  const allTagSearchTerms = [...keywords, ...expandedEmotions];
  for (const term of allTagSearchTerms) {
    if (tags.some((t) => t === term || t.includes(term) || term.includes(t))) {
      tagHits++;
    }
  }
  if (allTagSearchTerms.length > 0) {
    score += 0.25 * (tagHits / allTagSearchTerms.length);
  }

  // Emotion-to-text matching (for API results with no tags).
  if (emotions.length > 0) {
    let emotionTextHits = 0;
    for (const emotion of emotions) {
      const synonyms = EMOTION_SYNONYMS[emotion] ?? [];
      if (synonyms.some((s) => textLower.includes(s))) {
        emotionTextHits++;
      }
    }
    if (emotionTextHits > 0) {
      score += 0.35 * (emotionTextHits / emotions.length);
    }
  }

  return { score: Math.min(score, 1), matched };
}

/** Relevance threshold — hadiths above this are considered relevant. */
export const RELEVANCE_THRESHOLD = 0.25;

/**
 * Filter and rank hadiths by relevance score, keeping only those
 * at or above the threshold.
 */
export function filterByRelevance(
  hadiths: HadithResult[],
  keywords: string[],
  emotions: string[],
  tagsMap?: Map<string, string[]>
): ScoredHadith[] {
  const scored = hadiths.map((result) => {
    const tags = tagsMap?.get(result.sourceLabel) ?? [];
    const { score, matched } = scoreHadith(
      { text: result.text, tags },
      keywords,
      emotions
    );
    return { result, score, matchedKeywords: matched };
  });

  return scored
    .filter((s) => s.score >= RELEVANCE_THRESHOLD)
    .sort((a, b) => b.score - a.score);
}
