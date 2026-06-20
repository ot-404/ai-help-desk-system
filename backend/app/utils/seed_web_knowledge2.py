"""
Extensive knowledge seed — deep coverage across every subject area.
Run via the one-liner in the terminal.
"""

TOPICS = [
    # ── MATHEMATICS — Specific Concepts ──────────────────────────────────────
    ("What is a quadratic equation and how do you solve it?", "Mathematics", "quadratic,algebra,equations,math"),
    ("How do you solve simultaneous equations?", "Mathematics", "simultaneous-equations,algebra,math"),
    ("What is the quadratic formula?", "Mathematics", "quadratic-formula,algebra,math"),
    ("How do you find the area of a triangle?", "Mathematics", "area,triangle,geometry,math"),
    ("What is the sine rule and cosine rule?", "Mathematics", "sine-rule,cosine-rule,trigonometry,math"),
    ("How do you differentiate a function?", "Mathematics", "differentiation,calculus,math"),
    ("How do you integrate a function?", "Mathematics", "integration,calculus,math"),
    ("What are logarithms and how do you use them?", "Mathematics", "logarithms,math,exponents"),
    ("What is the binomial theorem?", "Mathematics", "binomial-theorem,algebra,math"),
    ("What are vectors in mathematics?", "Mathematics", "vectors,math,physics"),
    ("What is a matrix and how is it used?", "Mathematics", "matrix,linear-algebra,math"),
    ("What are complex numbers?", "Mathematics", "complex-numbers,imaginary,math"),
    ("What is the Fibonacci sequence?", "Mathematics", "fibonacci,sequences,math"),
    ("What are geometric and arithmetic sequences?", "Mathematics", "sequences,series,math"),
    ("How does long division work?", "Mathematics", "long-division,arithmetic,math"),
    ("What are fractions, decimals, and percentages?", "Mathematics", "fractions,decimals,percentages,math"),
    ("How do you calculate mean, median, mode and range?", "Mathematics", "mean,median,mode,statistics,math"),
    ("What is the standard deviation?", "Mathematics", "standard-deviation,statistics,math"),
    ("What is Pythagoras theorem?", "Mathematics", "pythagoras,geometry,math"),
    ("How do you calculate the circumference and area of a circle?", "Mathematics", "circle,geometry,math"),
    ("What is trigonometry?", "Mathematics", "trigonometry,sin,cos,tan,math"),
    ("What is BODMAS and order of operations?", "Mathematics", "bodmas,order-of-operations,math"),
    ("What are prime numbers and how do you find them?", "Mathematics", "prime-numbers,number-theory,math"),
    ("What is the highest common factor and lowest common multiple?", "Mathematics", "hcf,lcm,math"),
    ("How do you calculate probability?", "Mathematics", "probability,statistics,math"),
    ("What is permutation and combination?", "Mathematics", "permutation,combination,statistics,math"),
    ("What is set theory?", "Mathematics", "set-theory,math,logic"),
    ("What are inequalities in mathematics?", "Mathematics", "inequalities,algebra,math"),
    ("How do you calculate compound and simple interest?", "Mathematics", "compound-interest,simple-interest,math,finance"),
    ("What is a function in mathematics?", "Mathematics", "functions,algebra,math"),
    ("What is Pi and why is it important?", "Mathematics", "pi,circle,math"),
    ("What are surds and how do you simplify them?", "Mathematics", "surds,roots,math"),
    ("What is Euler's number e?", "Mathematics", "euler,e,calculus,math"),
    ("How do you calculate speed, distance and time?", "Mathematics", "speed,distance,time,math,physics"),
    ("What is ratio and proportion?", "Mathematics", "ratio,proportion,math"),
    ("What is a graph and how do you plot one?", "Mathematics", "graphs,coordinates,math"),
    ("What are straight line graphs and gradients?", "Mathematics", "straight-line,gradient,math"),
    ("What is volume and surface area of 3D shapes?", "Mathematics", "volume,surface-area,3d-shapes,math"),
    ("What are angles and how are they classified?", "Mathematics", "angles,geometry,math"),
    ("What is a proof in mathematics?", "Mathematics", "proof,logic,math"),

    # ── ENGLISH — Grammar, Literature, Writing ────────────────────────────────
    ("What are the parts of speech in English?", "English", "parts-of-speech,grammar,english"),
    ("What is a noun, verb, adjective and adverb?", "English", "noun,verb,adjective,adverb,grammar"),
    ("What is the difference between a phrase and a clause?", "English", "phrase,clause,grammar,english"),
    ("How do you use commas correctly?", "English", "commas,punctuation,grammar,english"),
    ("What is the difference between active and passive voice?", "English", "active-voice,passive-voice,grammar"),
    ("What are the different types of sentences?", "English", "sentences,grammar,english"),
    ("What is figurative language — metaphor, simile, personification?", "English", "figurative-language,metaphor,simile,english"),
    ("What is alliteration, assonance and onomatopoeia?", "English", "alliteration,assonance,poetry,english"),
    ("What is the difference between there, their and they're?", "English", "homophones,spelling,grammar,english"),
    ("What are tenses in English — past, present, future?", "English", "tenses,grammar,english"),
    ("How do you write a persuasive essay?", "English", "persuasive-writing,essay,english"),
    ("How do you write a narrative essay?", "English", "narrative-writing,essay,english"),
    ("What is the PEEL paragraph structure?", "English", "peel,essay-writing,english"),
    ("What are the themes in Romeo and Juliet?", "English", "romeo-and-juliet,shakespeare,themes,english"),
    ("What are the themes in Macbeth?", "English", "macbeth,shakespeare,themes,english"),
    ("What is the plot of To Kill a Mockingbird?", "English", "to-kill-a-mockingbird,harper-lee,literature"),
    ("What are the themes in 1984 by George Orwell?", "English", "1984,orwell,dystopia,literature"),
    ("What is the plot of Of Mice and Men?", "English", "of-mice-and-men,steinbeck,literature"),
    ("What are the themes in The Great Gatsby?", "English", "great-gatsby,fitzgerald,literature,themes"),
    ("What is iambic pentameter?", "English", "iambic-pentameter,shakespeare,poetry,english"),
    ("What are literary devices used in poetry?", "English", "literary-devices,poetry,english"),
    ("What is the structure of a sonnet?", "English", "sonnet,poetry,shakespeare,english"),
    ("How do you analyse a poem?", "English", "poetry-analysis,english,literature"),
    ("What is direct and indirect speech?", "English", "direct-speech,indirect-speech,grammar"),
    ("What are conjunctions and connectives?", "English", "conjunctions,connectives,grammar,english"),
    ("What is a pronoun and how is it used?", "English", "pronouns,grammar,english"),
    ("What are prepositions?", "English", "prepositions,grammar,english"),
    ("How do you use apostrophes correctly?", "English", "apostrophes,punctuation,grammar"),
    ("What is etymology — the origin of words?", "English", "etymology,words,english,language"),
    ("What are prefixes and suffixes?", "English", "prefixes,suffixes,vocabulary,english"),
    ("What is the difference between affect and effect?", "English", "affect,effect,grammar,english"),
    ("How do you write a cover letter?", "English", "cover-letter,writing,professional"),
    ("How do you write a formal letter?", "English", "formal-letter,writing,english"),
    ("What is a thesis statement?", "English", "thesis-statement,essay,writing"),
    ("What is plagiarism and how to avoid it?", "English", "plagiarism,academic-writing,ethics"),
    ("What are the conventions of report writing?", "English", "report-writing,english,professional"),
    ("What is Shakespeare's influence on English language?", "English", "shakespeare,english,literature,history"),
    ("What is the hero's journey in storytelling?", "English", "heros-journey,narrative,storytelling,english"),
    ("What are the different genres of literature?", "English", "genres,literature,english"),
    ("What is critical analysis in English?", "English", "critical-analysis,english,literature"),

    # ── GEOGRAPHY — Physical & Human ─────────────────────────────────────────
    ("What are the seven continents of the world?", "Geography", "continents,world,geography"),
    ("What are the five oceans of the world?", "Geography", "oceans,world,geography"),
    ("What are the countries of Africa?", "Geography", "africa,countries,geography"),
    ("What are the countries of Europe?", "Geography", "europe,countries,geography"),
    ("What are the countries of Asia?", "Geography", "asia,countries,geography"),
    ("What are the countries of South America?", "Geography", "south-america,countries,geography"),
    ("What are the capital cities of the world?", "Geography", "capitals,cities,world,geography"),
    ("What are the longest rivers in the world?", "Geography", "rivers,world,geography"),
    ("What are the highest mountains in the world?", "Geography", "mountains,everest,geography"),
    ("How do tectonic plates work?", "Geography", "tectonic-plates,geology,geography"),
    ("What causes earthquakes and where do they occur?", "Geography", "earthquakes,fault-lines,geography"),
    ("What are biomes and ecosystems?", "Geography", "biomes,ecosystems,geography,environment"),
    ("What is the difference between weather and climate?", "Geography", "weather,climate,geography"),
    ("What are the types of rainfall?", "Geography", "rainfall,precipitation,geography"),
    ("What are ocean currents and why do they matter?", "Geography", "ocean-currents,climate,geography"),
    ("What is urbanisation and its effects?", "Geography", "urbanisation,cities,human-geography"),
    ("What is migration and why do people migrate?", "Geography", "migration,human-geography,population"),
    ("What is globalisation?", "Geography", "globalisation,trade,geography,economics"),
    ("What are the causes and effects of deforestation?", "Geography", "deforestation,rainforest,environment"),
    ("What is desertification?", "Geography", "desertification,climate,environment,geography"),
    ("How do glaciers form and move?", "Geography", "glaciers,ice,geography"),
    ("What are the different types of rocks?", "Geography", "rocks,geology,igneous,sedimentary,metamorphic"),
    ("What is the rock cycle?", "Geography", "rock-cycle,geology,geography"),
    ("What are natural resources and how are they used?", "Geography", "natural-resources,geography,economics"),
    ("What is the population distribution of the world?", "Geography", "population,demography,geography"),
    ("What are the causes of poverty in developing countries?", "Geography", "poverty,development,geography"),
    ("What is fair trade?", "Geography", "fair-trade,globalisation,economics"),
    ("What are the effects of climate change on geography?", "Geography", "climate-change,geography,environment"),
    ("What is a river's long profile and cross section?", "Geography", "rivers,geography,erosion"),
    ("What is coastal erosion and deposition?", "Geography", "coastal,erosion,geography"),
    ("What are the different types of climate?", "Geography", "climate-types,geography,weather"),
    ("What is the water cycle?", "Geography", "water-cycle,geography,environment"),
    ("What is the carbon cycle?", "Geography", "carbon-cycle,geography,environment"),
    ("What is a sustainable city?", "Geography", "sustainable-city,urban,geography"),
    ("What is the demographic transition model?", "Geography", "demographic-transition,population,geography"),

    # ── HISTORY — Detailed Events & Periods ───────────────────────────────────
    ("What was the causes and consequences of World War One?", "History", "world-war-1,causes,history"),
    ("What was life like in the trenches in World War One?", "History", "trenches,world-war-1,history"),
    ("What was the Holocaust?", "History", "holocaust,world-war-2,history,genocide"),
    ("What caused the rise of Adolf Hitler?", "History", "hitler,nazi,world-war-2,history"),
    ("What was D-Day in World War Two?", "History", "d-day,world-war-2,normandy,history"),
    ("What was the Treaty of Versailles?", "History", "treaty-of-versailles,world-war-1,history"),
    ("What was the Russian Revolution?", "History", "russian-revolution,bolsheviks,history"),
    ("What was the Great Depression?", "History", "great-depression,economics,history"),
    ("What was the Civil Rights Movement in America?", "History", "civil-rights,martin-luther-king,usa,history"),
    ("What was apartheid in South Africa?", "History", "apartheid,south-africa,mandela,history"),
    ("Who was Martin Luther King Jr?", "History", "martin-luther-king,civil-rights,history"),
    ("Who was Nelson Mandela?", "History", "mandela,south-africa,apartheid,history"),
    ("What was the American Civil War?", "History", "american-civil-war,slavery,history"),
    ("What was the Boston Tea Party?", "History", "boston-tea-party,american-revolution,history"),
    ("What was the French Revolution?", "History", "french-revolution,liberty,equality,history"),
    ("Who was Napoleon Bonaparte?", "History", "napoleon,france,history"),
    ("What was the British Empire?", "History", "british-empire,colonialism,history"),
    ("What was the transatlantic slave trade?", "History", "slave-trade,colonialism,history"),
    ("What was the Black Death?", "History", "black-death,plague,medieval,history"),
    ("What was the Magna Carta?", "History", "magna-carta,democracy,england,history"),
    ("What was the Tudor period in England?", "History", "tudors,henry-viii,elizabeth,history"),
    ("Who was Henry VIII and his six wives?", "History", "henry-viii,tudors,history,england"),
    ("What was the Victorian era?", "History", "victorian,britain,industrial,history"),
    ("What was the ancient Egyptian civilisation?", "History", "egypt,pharaohs,pyramids,ancient,history"),
    ("What was ancient Greece?", "History", "ancient-greece,athens,sparta,history"),
    ("Who was Julius Caesar?", "History", "julius-caesar,rome,history"),
    ("What was the fall of the Roman Empire?", "History", "roman-empire,fall,history"),
    ("What was the Viking Age?", "History", "vikings,scandinavia,history"),
    ("What was the Crusades?", "History", "crusades,medieval,religion,history"),
    ("What was the Reformation?", "History", "reformation,martin-luther,church,history"),
    ("What was the American Revolution?", "History", "american-revolution,independence,history"),
    ("What was the colonisation of Africa?", "History", "colonisation,africa,imperialism,history"),
    ("What was the Cold War?", "History", "cold-war,usa,ussr,history"),
    ("What was the Cuban Missile Crisis?", "History", "cuban-missile-crisis,cold-war,history"),
    ("What was the fall of the Berlin Wall?", "History", "berlin-wall,germany,history,cold-war"),
    ("What was the partition of India?", "History", "india,partition,independence,history"),
    ("Who was Gandhi?", "History", "gandhi,india,independence,history"),
    ("What was the Korean War?", "History", "korean-war,history,korea"),
    ("What was the Vietnam War?", "History", "vietnam-war,usa,history"),
    ("What was the 9/11 terrorist attack?", "History", "9-11,terrorism,history,usa"),

    # ── SCIENCE — Detailed Topics ──────────────────────────────────────────────
    ("What are Newton's three laws of motion?", "Science", "newton,laws-of-motion,physics"),
    ("What is kinetic and potential energy?", "Science", "kinetic-energy,potential-energy,physics"),
    ("How does electricity work?", "Science", "electricity,physics,circuits"),
    ("What is Ohm's law?", "Science", "ohms-law,electricity,physics"),
    ("What are series and parallel circuits?", "Science", "circuits,electricity,physics"),
    ("What is the electromagnetic spectrum?", "Science", "electromagnetic-spectrum,light,physics"),
    ("How does sound travel?", "Science", "sound,waves,physics"),
    ("What is refraction of light?", "Science", "refraction,light,physics,optics"),
    ("What is photosynthesis equation?", "Science", "photosynthesis,biology,plants,chemistry"),
    ("What is cellular respiration?", "Science", "cellular-respiration,biology,energy"),
    ("What are mitosis and meiosis?", "Science", "mitosis,meiosis,cell-division,biology"),
    ("What is natural selection?", "Science", "natural-selection,evolution,darwin,biology"),
    ("What are the kingdoms of living things?", "Science", "kingdoms,classification,biology"),
    ("What is the structure of an atom?", "Science", "atom,protons,neutrons,electrons,chemistry"),
    ("What is ionic and covalent bonding?", "Science", "ionic-bonding,covalent-bonding,chemistry"),
    ("What are acids and bases?", "Science", "acids,bases,ph,chemistry"),
    ("What is the pH scale?", "Science", "ph-scale,acids,bases,chemistry"),
    ("What are chemical reactions and equations?", "Science", "chemical-reactions,equations,chemistry"),
    ("What is the difference between elements, compounds and mixtures?", "Science", "elements,compounds,mixtures,chemistry"),
    ("What are metals and non-metals?", "Science", "metals,non-metals,periodic-table,chemistry"),
    ("How does electrolysis work?", "Science", "electrolysis,chemistry,electricity"),
    ("What is osmosis and diffusion?", "Science", "osmosis,diffusion,biology,cells"),
    ("What are enzymes?", "Science", "enzymes,biology,digestion"),
    ("What is the nervous system?", "Science", "nervous-system,brain,neurons,biology"),
    ("What is the endocrine system?", "Science", "endocrine,hormones,biology"),
    ("How does the heart work?", "Science", "heart,cardiovascular,biology"),
    ("What is blood made of?", "Science", "blood,red-blood-cells,biology"),
    ("What is gravity and how is it calculated?", "Science", "gravity,physics,newton"),
    ("What are waves and their properties?", "Science", "waves,frequency,amplitude,physics"),
    ("What is nuclear fission and fusion?", "Science", "nuclear-fission,fusion,physics"),
    ("What is the greenhouse effect?", "Science", "greenhouse-effect,climate,environment"),
    ("What are food chains and food webs?", "Science", "food-chains,ecology,biology"),
    ("What is biodiversity and why does it matter?", "Science", "biodiversity,ecology,environment"),
    ("What are fossils and how do they form?", "Science", "fossils,geology,evolution"),
    ("What is the structure of the Earth?", "Science", "earth-structure,geology,geography"),

    # ── LANGUAGES ─────────────────────────────────────────────────────────────
    ("How do you learn a new language effectively?", "Languages", "language-learning,tips,linguistics"),
    ("What are the most spoken languages in the world?", "Languages", "languages,world,linguistics"),
    ("What is the difference between a language and a dialect?", "Languages", "language,dialect,linguistics"),
    ("What is Spanish grammar basics?", "Languages", "spanish,grammar,language-learning"),
    ("What is French grammar basics?", "Languages", "french,grammar,language-learning"),
    ("What is the Arabic alphabet?", "Languages", "arabic,alphabet,language"),
    ("How does the Chinese writing system work?", "Languages", "chinese,mandarin,writing,language"),
    ("What are the basics of sign language?", "Languages", "sign-language,asl,communication"),
    ("What is Latin and its influence on English?", "Languages", "latin,english,etymology,language"),

    # ── ARTS & MUSIC ──────────────────────────────────────────────────────────
    ("What are the elements of art?", "Arts", "elements-of-art,design,visual-art"),
    ("What are the principles of design?", "Arts", "design-principles,art,visual"),
    ("Who was Leonardo da Vinci?", "Arts", "leonardo-da-vinci,renaissance,art,history"),
    ("Who was Michelangelo?", "Arts", "michelangelo,renaissance,sculpture,art"),
    ("What was the Baroque period in art?", "Arts", "baroque,art,history"),
    ("Who was Vincent van Gogh?", "Arts", "van-gogh,impressionism,art,history"),
    ("What is the Mona Lisa?", "Arts", "mona-lisa,da-vinci,painting,art"),
    ("What are music notes and how do you read sheet music?", "Music", "music-notes,sheet-music,theory"),
    ("What are the musical scales?", "Music", "scales,music-theory,piano"),
    ("What is the difference between major and minor keys?", "Music", "major,minor,music-theory"),
    ("What are the instruments in an orchestra?", "Music", "orchestra,instruments,classical-music"),
    ("What is music theory?", "Music", "music-theory,notes,rhythm"),
    ("What is rhythm and tempo in music?", "Music", "rhythm,tempo,music"),
    ("Who was Ludwig van Beethoven?", "Music", "beethoven,classical-music,composer"),
    ("Who was Wolfgang Amadeus Mozart?", "Music", "mozart,classical-music,composer"),

    # ── PHYSICAL EDUCATION & SPORT ────────────────────────────────────────────
    ("What are the rules of football (soccer)?", "Sports", "football,soccer,rules,sport"),
    ("What are the rules of basketball?", "Sports", "basketball,rules,nba,sport"),
    ("What are the rules of cricket?", "Sports", "cricket,rules,sport"),
    ("What are the rules of tennis?", "Sports", "tennis,rules,sport"),
    ("What are the rules of rugby?", "Sports", "rugby,rules,sport"),
    ("What is the offside rule in football?", "Sports", "offside,football,rules"),
    ("How does the scoring system in tennis work?", "Sports", "tennis,scoring,sport"),
    ("What are the Olympic games and their history?", "Sports", "olympics,history,sport"),
    ("What is aerobic vs anaerobic exercise?", "Sports", "aerobic,anaerobic,exercise,fitness"),
    ("What is the importance of warm up and cool down?", "Sports", "warm-up,cool-down,exercise,injury"),
    ("What are the components of physical fitness?", "Sports", "fitness,strength,endurance,flexibility"),

    # ── RELIGIOUS STUDIES ─────────────────────────────────────────────────────
    ("What are the five pillars of Islam?", "Religion", "islam,pillars,religion"),
    ("What is the Bible and what does it contain?", "Religion", "bible,christianity,religion"),
    ("What are the core beliefs of Christianity?", "Religion", "christianity,beliefs,religion"),
    ("What are the core beliefs of Islam?", "Religion", "islam,beliefs,religion"),
    ("What are the core beliefs of Hinduism?", "Religion", "hinduism,beliefs,religion"),
    ("What are the core beliefs of Buddhism?", "Religion", "buddhism,beliefs,religion"),
    ("What is Judaism?", "Religion", "judaism,beliefs,religion"),
    ("What is the difference between Sunni and Shia Islam?", "Religion", "sunni,shia,islam,religion"),
    ("What are the major world religions?", "Religion", "world-religions,comparison,religion"),
    ("What is the history of Christianity?", "Religion", "christianity,history,religion"),

    # ── ECONOMICS & BUSINESS ──────────────────────────────────────────────────
    ("What is microeconomics vs macroeconomics?", "Economics", "micro,macro,economics"),
    ("What is the law of supply and demand?", "Economics", "supply,demand,economics"),
    ("What is a monopoly in economics?", "Economics", "monopoly,market,economics"),
    ("What is opportunity cost?", "Economics", "opportunity-cost,economics,decision"),
    ("What is fiscal policy vs monetary policy?", "Economics", "fiscal,monetary,policy,economics"),
    ("What is a budget deficit?", "Economics", "budget-deficit,government,economics"),
    ("What are exchange rates?", "Economics", "exchange-rates,currency,economics"),
    ("What is the World Trade Organization?", "Economics", "wto,trade,economics"),
    ("What is a recession?", "Economics", "recession,economics,gdp"),
    ("What is income inequality?", "Economics", "inequality,income,economics"),
    ("How does international trade work?", "Economics", "international-trade,exports,imports"),
    ("What are the functions of money?", "Economics", "money,currency,economics"),

    # ── PHILOSOPHY & ETHICS ───────────────────────────────────────────────────
    ("What is philosophy?", "Philosophy", "philosophy,thinking,logic"),
    ("What is utilitarianism?", "Philosophy", "utilitarianism,ethics,philosophy"),
    ("What is Kant's categorical imperative?", "Philosophy", "kant,ethics,philosophy"),
    ("What is existentialism?", "Philosophy", "existentialism,sartre,philosophy"),
    ("What is Plato's theory of forms?", "Philosophy", "plato,forms,philosophy"),
    ("What is Aristotle's philosophy?", "Philosophy", "aristotle,ethics,philosophy"),
    ("What is the trolley problem?", "Philosophy", "trolley-problem,ethics,philosophy"),
    ("What is the difference between ethics and morals?", "Philosophy", "ethics,morals,philosophy"),
    ("What is free will vs determinism?", "Philosophy", "free-will,determinism,philosophy"),
    ("What is Socrates and the Socratic method?", "Philosophy", "socrates,socratic-method,philosophy"),

    # ── COMPUTER SCIENCE (School Level) ──────────────────────────────────────
    ("What is an algorithm?", "Computer Science", "algorithm,programming,computer-science"),
    ("What is a flowchart?", "Computer Science", "flowchart,algorithm,computer-science"),
    ("What is pseudocode?", "Computer Science", "pseudocode,programming,computer-science"),
    ("What are variables in programming?", "Computer Science", "variables,programming,code"),
    ("What are loops in programming?", "Computer Science", "loops,for,while,programming"),
    ("What are if statements in programming?", "Computer Science", "if-statements,conditionals,programming"),
    ("What is object-oriented programming?", "Computer Science", "oop,classes,objects,programming"),
    ("What is the difference between hardware and software?", "Computer Science", "hardware,software,computer-science"),
    ("What is data representation — binary and hexadecimal?", "Computer Science", "binary,hexadecimal,data,computer-science"),
    ("What is a computer network?", "Computer Science", "network,computer-science,internet"),
    ("What is cybersecurity at school level?", "Computer Science", "cybersecurity,safety,computer-science"),
    ("What is a database?", "Computer Science", "database,sql,computer-science"),
    ("What is the difference between RAM and storage?", "Computer Science", "ram,storage,computer-science"),
    ("What is machine learning explained simply?", "Computer Science", "machine-learning,ai,computer-science"),
    ("What is sorting and searching algorithms?", "Computer Science", "sorting,searching,algorithms,computer-science"),

    # ── EVERYDAY LIFE & PRACTICAL KNOWLEDGE ──────────────────────────────────
    ("How do you write a CV or resume?", "Careers", "cv,resume,job-application,careers"),
    ("How do you prepare for a job interview?", "Careers", "job-interview,preparation,careers"),
    ("What are good study techniques and habits?", "Education", "study-tips,revision,learning"),
    ("What is time management?", "Education", "time-management,productivity,skills"),
    ("How do you manage personal finances?", "Finance", "personal-finance,budgeting,money"),
    ("What is a mortgage and how does it work?", "Finance", "mortgage,property,finance"),
    ("What are the best ways to save money?", "Finance", "saving,money,finance,tips"),
    ("How does voting work in a democracy?", "Politics", "voting,democracy,politics"),
    ("What are the rights of a citizen?", "Politics", "citizens-rights,law,politics"),
    ("What is the United Nations?", "Politics", "united-nations,international,politics"),
    ("What are the branches of government?", "Politics", "government,branches,politics,democracy"),
    ("How do you cook a basic meal?", "Food", "cooking,basics,food,recipe"),
    ("What are the best foods for brain function?", "Food", "brain-food,nutrition,health"),
    ("How does the economy affect everyday life?", "Economics", "economy,everyday-life,impact"),
    ("What is mental health awareness?", "Health", "mental-health,awareness,wellbeing"),
    ("How do you deal with stress and anxiety?", "Health", "stress,anxiety,mental-health,tips"),
    ("What are good habits for a healthy lifestyle?", "Health", "healthy-lifestyle,habits,wellbeing"),
    ("How do you start exercising as a beginner?", "Health", "exercise,beginner,fitness"),
    ("What are the basics of first aid?", "Health", "first-aid,emergency,health"),
    ("What is social media and its pros and cons?", "Technology", "social-media,pros-cons,technology"),
    ("How do you stay safe online?", "Technology", "online-safety,cybersecurity,internet"),
    ("What are the effects of screen time?", "Health", "screen-time,technology,health"),
    ("What is emotional intelligence?", "Psychology", "emotional-intelligence,eq,skills"),
    ("How do you improve communication skills?", "Psychology", "communication,skills,interpersonal"),
    ("What is conflict resolution?", "Psychology", "conflict-resolution,communication,skills"),
    ("What is teamwork and why does it matter?", "Psychology", "teamwork,collaboration,skills"),
    ("How do you set and achieve goals?", "Psychology", "goals,motivation,productivity"),
    ("What is growth mindset?", "Psychology", "growth-mindset,learning,psychology"),
    ("What is self-discipline?", "Psychology", "self-discipline,habits,psychology"),
]


def _llm_with_retry(system, user, fallback, max_attempts=5):
    import time
    from app.services.ai_service import _call_llm_json
    for attempt in range(max_attempts):
        data, model = _call_llm_json(system, user, fallback)
        if model != "unavailable":
            return data, model
        wait = 15 * (attempt + 1)
        print(f"  ⚠ rate limited, waiting {wait}s before retry {attempt + 1}/{max_attempts}…")
        time.sleep(wait)
    return fallback, "unavailable"


def run_seed(db, KnowledgeBase, app):
    from app.services.web_search_service import web_search

    existing_titles = {a.title for a in KnowledgeBase.query.all()}
    added = 0
    skipped = 0
    total = len(TOPICS)

    for i, (query, category, tags) in enumerate(TOPICS, 1):
        print(f"[{i}/{total}] {query}")

        if query in existing_titles:
            print(f"  → already exists, skipping")
            skipped += 1
            continue

        web_chunks = web_search(query, max_results=3)
        context = "\n\n".join(web_chunks) if web_chunks else ""

        if not context:
            print(f"  → no web results, using LLM knowledge only")

        system = (
            "You are an expert educator writing clear, detailed knowledge base articles. "
            "Respond with valid JSON only — no markdown fences, no extra text."
        )
        user = f"""Write a comprehensive knowledge base article answering: {query}

{"Use this web content as reference:\n" + context[:3000] if context else "Answer from your own expert knowledge."}

Return JSON with these exact keys:
- "title": a clear, descriptive article title (string)
- "content": 4-6 paragraphs of accurate, detailed, easy-to-understand information in plain text (string)"""

        fallback = {
            "title": query,
            "content": context[:2000] if context else f"Information about: {query}",
        }

        data, model = _llm_with_retry(system, user, fallback)
        title = str(data.get("title") or query)[:255]
        content = str(data.get("content") or context[:2000] or f"Information about: {query}")

        if title in existing_titles:
            print(f"  → title already exists, skipping")
            skipped += 1
            continue

        article = KnowledgeBase(
            title=title,
            content=content,
            category=category,
            tags=tags,
        )
        db.session.add(article)
        existing_titles.add(title)

        if i % 10 == 0:
            db.session.commit()
            print(f"  ✓ committed batch")

        added += 1
        print(f"  ✓ saved: {title[:70]}")

    db.session.commit()
    print(f"\nDone — {added} articles added, {skipped} skipped.")
    return added
