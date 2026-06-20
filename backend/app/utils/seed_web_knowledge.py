"""
Seed the knowledge base with extensive content from web searches across every major topic.
Run via: .venv\Scripts\python seed_web_knowledge.py
"""

TOPICS = [
    # ── IT & Technology ──────────────────────────────────────────────────────
    ("What is TCP/IP and how does it work?", "Networking", "tcp/ip,networking,protocols"),
    ("How does DNS work?", "Networking", "dns,networking,domain"),
    ("What is a VPN and how does it protect privacy?", "Networking", "vpn,privacy,security"),
    ("How does HTTP and HTTPS work?", "Networking", "http,https,web,security"),
    ("What is a firewall and how does it work?", "Security", "firewall,network,security"),
    ("How does SSL/TLS encryption work?", "Security", "ssl,tls,encryption,security"),
    ("What is two-factor authentication?", "Security", "2fa,authentication,security"),
    ("How do SQL injection attacks work and how to prevent them?", "Security", "sql-injection,security,web"),
    ("What is phishing and how to avoid it?", "Security", "phishing,cybersecurity,email"),
    ("How does ransomware work?", "Security", "ransomware,malware,cybersecurity"),
    ("What is the difference between RAM and ROM?", "Hardware", "ram,rom,memory,hardware"),
    ("How does a CPU work?", "Hardware", "cpu,processor,hardware"),
    ("What is SSD vs HDD?", "Hardware", "ssd,hdd,storage,hardware"),
    ("How does GPU work?", "Hardware", "gpu,graphics,hardware"),
    ("What is cloud computing?", "Cloud", "cloud,aws,azure,computing"),
    ("What is Docker and containerization?", "DevOps", "docker,containers,devops"),
    ("What is Kubernetes?", "DevOps", "kubernetes,orchestration,devops"),
    ("How does Git version control work?", "Development", "git,version-control,development"),
    ("What is REST API?", "Development", "rest,api,web-development"),
    ("What is machine learning?", "AI", "machine-learning,ai,data-science"),
    ("What is artificial intelligence?", "AI", "ai,artificial-intelligence,technology"),
    ("How does a neural network work?", "AI", "neural-network,deep-learning,ai"),
    ("What is Python programming?", "Development", "python,programming,development"),
    ("What is JavaScript?", "Development", "javascript,web,programming"),
    ("What is a database and how does SQL work?", "Database", "sql,database,data"),
    ("What is NoSQL database?", "Database", "nosql,mongodb,database"),
    ("What is Linux and how is it different from Windows?", "Operating Systems", "linux,windows,os"),
    ("How does Wi-Fi work?", "Networking", "wifi,wireless,networking"),
    ("What is Bluetooth technology?", "Networking", "bluetooth,wireless,technology"),
    ("What is IPv4 vs IPv6?", "Networking", "ipv4,ipv6,networking,protocols"),
    ("What is cybersecurity?", "Security", "cybersecurity,security,hacking"),
    ("How does email work technically?", "Networking", "email,smtp,imap,networking"),
    ("What is an operating system?", "Operating Systems", "os,operating-system,software"),
    ("What is agile software development?", "Development", "agile,scrum,development"),
    ("What is DevOps?", "DevOps", "devops,ci-cd,development,operations"),
    ("What is blockchain technology?", "Technology", "blockchain,crypto,distributed"),
    ("What is the Internet of Things (IoT)?", "Technology", "iot,smart-devices,technology"),
    ("What is quantum computing?", "Technology", "quantum,computing,technology"),
    ("How does a router work?", "Networking", "router,networking,hardware"),
    ("What is binary code?", "Development", "binary,code,programming,fundamentals"),

    # ── Science ──────────────────────────────────────────────────────────────
    ("How does photosynthesis work?", "Science", "photosynthesis,biology,plants"),
    ("What is the theory of relativity?", "Science", "relativity,einstein,physics"),
    ("How does the human immune system work?", "Science", "immune-system,biology,health"),
    ("What is DNA and how does it work?", "Science", "dna,genetics,biology"),
    ("How do vaccines work?", "Science", "vaccines,immunology,health"),
    ("What is quantum physics?", "Science", "quantum-physics,physics,science"),
    ("How does the solar system work?", "Science", "solar-system,astronomy,space"),
    ("What is climate change and global warming?", "Science", "climate-change,environment,science"),
    ("How does evolution work?", "Science", "evolution,darwin,biology"),
    ("What is the periodic table?", "Science", "periodic-table,chemistry,elements"),
    ("How does gravity work?", "Science", "gravity,physics,newton"),
    ("What is nuclear energy?", "Science", "nuclear,energy,physics"),
    ("How does the human brain work?", "Science", "brain,neuroscience,biology"),
    ("What is cell division?", "Science", "cell-division,mitosis,biology"),
    ("How do black holes work?", "Science", "black-holes,astronomy,space"),
    ("What is the big bang theory?", "Science", "big-bang,cosmology,universe"),
    ("What is thermodynamics?", "Science", "thermodynamics,physics,energy"),
    ("How does radioactivity work?", "Science", "radioactivity,nuclear,physics"),
    ("What is CRISPR gene editing?", "Science", "crispr,genetics,biotechnology"),
    ("How does the water cycle work?", "Science", "water-cycle,earth-science,environment"),

    # ── Health & Medicine ─────────────────────────────────────────────────────
    ("How does the cardiovascular system work?", "Health", "heart,cardiovascular,health"),
    ("What is diabetes and how is it managed?", "Health", "diabetes,blood-sugar,health"),
    ("What causes high blood pressure?", "Health", "blood-pressure,hypertension,health"),
    ("How does cancer develop?", "Health", "cancer,oncology,health"),
    ("What is mental health and why does it matter?", "Health", "mental-health,psychology,wellbeing"),
    ("What is depression and how is it treated?", "Health", "depression,mental-health,treatment"),
    ("How does the digestive system work?", "Health", "digestion,gut,health"),
    ("What is the importance of sleep?", "Health", "sleep,health,wellbeing"),
    ("How does exercise benefit the body?", "Health", "exercise,fitness,health"),
    ("What are vitamins and minerals?", "Health", "vitamins,minerals,nutrition"),
    ("What is a healthy diet?", "Health", "diet,nutrition,health"),
    ("How do antibiotics work?", "Health", "antibiotics,medicine,infection"),
    ("What is cholesterol?", "Health", "cholesterol,heart,health"),
    ("What causes allergies?", "Health", "allergies,immune,health"),
    ("What is the difference between bacteria and viruses?", "Health", "bacteria,virus,microbiology"),
    ("How does the respiratory system work?", "Health", "respiratory,lungs,breathing"),
    ("What is first aid and CPR?", "Health", "first-aid,cpr,emergency"),
    ("What are the symptoms of a stroke?", "Health", "stroke,emergency,health"),
    ("What is anxiety disorder?", "Health", "anxiety,mental-health,disorder"),
    ("How does the endocrine system work?", "Health", "hormones,endocrine,health"),

    # ── Mathematics ───────────────────────────────────────────────────────────
    ("What is calculus and how is it used?", "Mathematics", "calculus,math,derivatives"),
    ("What is linear algebra?", "Mathematics", "linear-algebra,matrices,math"),
    ("What is statistics and probability?", "Mathematics", "statistics,probability,math"),
    ("How does the Pythagorean theorem work?", "Mathematics", "pythagorean,geometry,math"),
    ("What is prime numbers?", "Mathematics", "prime-numbers,number-theory,math"),
    ("What is algebra?", "Mathematics", "algebra,equations,math"),

    # ── History ───────────────────────────────────────────────────────────────
    ("What caused World War I?", "History", "world-war-1,history,europe"),
    ("What caused World War II?", "History", "world-war-2,history,nazi"),
    ("What was the Cold War?", "History", "cold-war,history,usa,ussr"),
    ("What was the Renaissance?", "History", "renaissance,history,art,europe"),
    ("What was the Industrial Revolution?", "History", "industrial-revolution,history,economy"),
    ("What was the Roman Empire?", "History", "roman-empire,history,ancient"),
    ("What was the French Revolution?", "History", "french-revolution,history,france"),
    ("What is the history of the internet?", "History", "internet,history,technology"),
    ("What was slavery in America?", "History", "slavery,american-history,civil-war"),
    ("What was the Space Race?", "History", "space-race,history,nasa,ussr"),

    # ── Business & Finance ────────────────────────────────────────────────────
    ("How does the stock market work?", "Finance", "stocks,market,investing,finance"),
    ("What is cryptocurrency?", "Finance", "cryptocurrency,bitcoin,blockchain"),
    ("What is inflation and how does it work?", "Finance", "inflation,economics,money"),
    ("How does compound interest work?", "Finance", "compound-interest,savings,finance"),
    ("What is GDP?", "Finance", "gdp,economics,economy"),
    ("How do taxes work?", "Finance", "taxes,income-tax,finance"),
    ("What is supply and demand?", "Finance", "supply-demand,economics,market"),
    ("What is venture capital?", "Finance", "venture-capital,startups,investing"),
    ("How to create a business plan?", "Business", "business-plan,entrepreneurship,startup"),
    ("What is marketing?", "Business", "marketing,advertising,business"),
    ("What is project management?", "Business", "project-management,pmp,agile"),
    ("What is return on investment (ROI)?", "Finance", "roi,investment,finance"),
    ("How does insurance work?", "Finance", "insurance,risk,finance"),
    ("What is the Federal Reserve?", "Finance", "federal-reserve,monetary-policy,economics"),
    ("What is a credit score?", "Finance", "credit-score,credit,finance"),

    # ── Geography & Environment ───────────────────────────────────────────────
    ("How do earthquakes happen?", "Geography", "earthquakes,geology,natural-disasters"),
    ("How do volcanoes work?", "Geography", "volcanoes,geology,earth-science"),
    ("What causes tsunamis?", "Geography", "tsunamis,ocean,natural-disasters"),
    ("What is deforestation and its effects?", "Environment", "deforestation,environment,climate"),
    ("What is ocean pollution?", "Environment", "ocean-pollution,environment,plastic"),
    ("How do hurricanes form?", "Geography", "hurricanes,weather,meteorology"),
    ("What is the ozone layer?", "Environment", "ozone,atmosphere,environment"),
    ("What are renewable energy sources?", "Environment", "renewable-energy,solar,wind,green"),
    ("What is biodiversity?", "Environment", "biodiversity,ecosystem,environment"),
    ("How do tides work?", "Geography", "tides,ocean,moon,gravity"),

    # ── Psychology & Society ──────────────────────────────────────────────────
    ("What is emotional intelligence?", "Psychology", "emotional-intelligence,eq,psychology"),
    ("How does memory work?", "Psychology", "memory,brain,psychology"),
    ("What is cognitive bias?", "Psychology", "cognitive-bias,psychology,decision-making"),
    ("What is Maslow's hierarchy of needs?", "Psychology", "maslow,needs,motivation,psychology"),
    ("What is social media's effect on mental health?", "Psychology", "social-media,mental-health,psychology"),
    ("What is leadership?", "Psychology", "leadership,management,skills"),
    ("What is critical thinking?", "Psychology", "critical-thinking,logic,reasoning"),
    ("What causes stress and how to manage it?", "Psychology", "stress,mental-health,management"),
    ("What is mindfulness and meditation?", "Psychology", "mindfulness,meditation,wellbeing"),
    ("How does addiction work?", "Psychology", "addiction,brain,psychology,health"),

    # ── Arts, Culture & Entertainment ────────────────────────────────────────
    ("What is the history of music?", "Arts", "music,history,culture"),
    ("How does photography work?", "Arts", "photography,camera,art"),
    ("What is impressionism in art?", "Arts", "impressionism,art,painting,history"),
    ("How are movies made?", "Arts", "movies,filmmaking,cinema"),
    ("What is classical literature?", "Arts", "literature,books,classics"),
    ("What is jazz music?", "Arts", "jazz,music,culture"),
    ("What is architecture?", "Arts", "architecture,design,buildings"),
    ("How does animation work?", "Arts", "animation,film,art"),

    # ── Food & Cooking ────────────────────────────────────────────────────────
    ("How does fermentation work in food?", "Food", "fermentation,food,science,cooking"),
    ("What is the Maillard reaction in cooking?", "Food", "maillard,cooking,chemistry,food"),
    ("What are macronutrients?", "Food", "macronutrients,protein,carbs,fat,nutrition"),
    ("How to make bread from scratch?", "Food", "bread,baking,recipe,cooking"),
    ("What is the Mediterranean diet?", "Food", "mediterranean-diet,nutrition,health"),
    ("What is veganism?", "Food", "veganism,plant-based,diet,nutrition"),
    ("How is coffee made?", "Food", "coffee,brewing,food,culture"),
    ("What are probiotics?", "Food", "probiotics,gut-health,nutrition"),

    # ── Sports & Fitness ──────────────────────────────────────────────────────
    ("How does the human body build muscle?", "Sports", "muscle,fitness,exercise,biology"),
    ("What is HIIT training?", "Sports", "hiit,fitness,exercise,training"),
    ("How does yoga benefit the body?", "Sports", "yoga,fitness,flexibility,mindfulness"),
    ("What is the science of running?", "Sports", "running,marathon,fitness,biomechanics"),
    ("How do athletes train for the Olympics?", "Sports", "olympics,training,athletics,sports"),

    # ── Law & Governance ──────────────────────────────────────────────────────
    ("What are human rights?", "Law", "human-rights,law,international"),
    ("How does the US legal system work?", "Law", "us-law,constitution,legal-system"),
    ("What is intellectual property?", "Law", "intellectual-property,copyright,patent"),
    ("What is GDPR?", "Law", "gdpr,privacy,data-protection,eu"),
    ("How does democracy work?", "Law", "democracy,government,politics"),

    # ── Engineering ───────────────────────────────────────────────────────────
    ("How do bridges stay standing?", "Engineering", "bridges,structural-engineering,physics"),
    ("How does an airplane fly?", "Engineering", "airplane,aerodynamics,aviation"),
    ("How do electric cars work?", "Engineering", "electric-cars,ev,battery,engineering"),
    ("How does a jet engine work?", "Engineering", "jet-engine,aviation,engineering"),
    ("What is 3D printing?", "Engineering", "3d-printing,additive-manufacturing,technology"),
    ("How do solar panels work?", "Engineering", "solar-panels,photovoltaic,renewable-energy"),
    ("How does a nuclear reactor work?", "Engineering", "nuclear-reactor,energy,engineering"),
    ("What is nanotechnology?", "Engineering", "nanotechnology,science,engineering"),
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
    """Search the web for each topic and save as a KB article. Safe to re-run."""
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
            "You are a knowledgeable writer. Write a clear, informative knowledge base article. "
            "Respond with valid JSON only — no markdown fences, no extra text."
        )
        user = f"""Write a knowledge base article answering this question: {query}

{"Use this web content as reference:\n" + context[:3000] if context else "Answer from your own knowledge."}

Return JSON with these exact keys:
- "title": a clear article title (string)
- "content": 3-5 paragraphs of accurate, useful information in plain text (string)"""

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

        # Commit in batches of 10
        if i % 10 == 0:
            db.session.commit()
            print(f"  ✓ committed batch (added {added + 1} so far)")

        added += 1
        print(f"  ✓ saved: {title[:60]}")

    db.session.commit()
    print(f"\nDone — {added} articles added, {skipped} skipped.")
    return added
