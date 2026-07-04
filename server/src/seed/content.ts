export interface SeedQuestion {
  text: string;
  choices: string[];
  correctIndex: number;
}

export interface SeedQuiz {
  title: string;
  description: string;
  questions: SeedQuestion[];
}

export interface SeedSubject {
  name: string;
  description: string;
  icon: string;
  color: string;
  quizzes: SeedQuiz[];
}

export const seedSubjects: SeedSubject[] = [
  {
    name: "History",
    description: "Forgotten wars, accidental kings, and borders nobody remembers.",
    icon: "Scroll",
    color: "from-amber-500 to-red-600",
    quizzes: [
      {
        title: "Footnotes of the Past",
        description: "10 real historical facts almost nobody remembers correctly.",
        questions: [
          { text: "Which country's Statutes of 1600 are recognized as the oldest written constitution still in force today?", choices: ["San Marino", "United States", "United Kingdom", "Iceland"], correctIndex: 0 },
          { text: "In what year did the Republic of Vermont declare independence, 14 years before joining the United States as its 14th state?", choices: ["1777", "1791", "1783", "1801"], correctIndex: 0 },
          { text: "The 1830 reign of Louis XIX, the shortest-reigning monarch in French history, lasted approximately how long?", choices: ["About 20 minutes", "About 3 hours", "About 1 day", "About 1 week"], correctIndex: 0 },
          { text: "The 1325 conflict between Bologna and Modena, known as the \"War of the Bucket,\" was fought over the theft of what everyday object?", choices: ["A wooden bucket", "A church bell", "A wine barrel", "A silver chalice"], correctIndex: 0 },
          { text: "Joshua Norton, who declared himself \"Emperor of the United States\" in 1859, lived in which American city?", choices: ["San Francisco", "New Orleans", "Boston", "Philadelphia"], correctIndex: 0 },
          { text: "The Toledo War of 1835-36 was a boundary dispute between the state of Ohio and which U.S. territory?", choices: ["Michigan Territory", "Indiana Territory", "Illinois Territory", "Wisconsin Territory"], correctIndex: 0 },
          { text: "In 1859, the \"Pig War\" nearly caused armed conflict between the United States and Britain over a disputed border on which island?", choices: ["San Juan Island", "Vancouver Island", "Orcas Island", "Whidbey Island"], correctIndex: 0 },
          { text: "In March 2007, a company of about 170 soldiers got lost in bad weather and accidentally crossed the unmarked border of Liechtenstein from which neighboring country?", choices: ["Switzerland", "Austria", "Germany", "France"], correctIndex: 0 },
          { text: "The Principality of Sealand, a micronation founded in 1967 on a former WWII sea fort, sits in international waters off the coast of which country?", choices: ["United Kingdom", "Netherlands", "Denmark", "Belgium"], correctIndex: 0 },
          { text: "The Nootka Crisis of 1789, a territorial dispute over Pacific Northwest trading posts, was between Spain and which other power?", choices: ["Great Britain", "Russia", "France", "Netherlands"], correctIndex: 0 },
        ],
      },
    ],
  },
  {
    name: "Geography",
    description: "Places, borders, and quirks of the map you've never studied.",
    icon: "Globe2",
    color: "from-emerald-500 to-teal-600",
    quizzes: [
      {
        title: "The Blank Spots on the Map",
        description: "10 real geographic facts that barely anyone can place.",
        questions: [
          { text: "Point Nemo, the location on Earth farthest from any land, was named after a fictional submarine captain created by which author?", choices: ["Jules Verne", "H.G. Wells", "Arthur Conan Doyle", "Edgar Allan Poe"], correctIndex: 0 },
          { text: "Which African country has three official capital cities, splitting executive, legislative, and judicial functions between Pretoria, Cape Town, and Bloemfontein?", choices: ["South Africa", "Tanzania", "Benin", "Ivory Coast"], correctIndex: 0 },
          { text: "The world's shortest scheduled passenger flight, lasting under two minutes, connects Westray and Papa Westray in which country's island chain?", choices: ["Scotland", "Norway", "Iceland", "Faroe Islands"], correctIndex: 0 },
          { text: "Which is the only country that borders both France and Spain, sitting directly between them in the Pyrenees?", choices: ["Andorra", "Monaco", "Liechtenstein", "San Marino"], correctIndex: 0 },
          { text: "The Danakil Depression, one of the hottest and lowest-lying places on Earth, is located primarily in which country?", choices: ["Ethiopia", "Djibouti", "Eritrea", "Sudan"], correctIndex: 0 },
          { text: "Kazakhstan shares one of the longest continuous land borders in Asia with which country?", choices: ["Russia", "China", "Mongolia", "Uzbekistan"], correctIndex: 0 },
          { text: "The Baarle-Nassau/Baarle-Hertog area, famous for its patchwork of enclaves and exclaves, straddles the border of which two countries?", choices: ["Belgium and the Netherlands", "Belgium and Germany", "the Netherlands and Germany", "Luxembourg and Belgium"], correctIndex: 0 },
          { text: "The Republic of Kiribati is the only country situated in all four hemispheres. In which ocean is it located?", choices: ["Pacific Ocean", "Indian Ocean", "Atlantic Ocean", "Arctic Ocean"], correctIndex: 0 },
          { text: "Mount Roraima, the tabletop mountain believed to have inspired Arthur Conan Doyle's \"The Lost World,\" sits at the tripoint of Brazil, Guyana, and which other country?", choices: ["Venezuela", "Suriname", "Colombia", "Ecuador"], correctIndex: 0 },
          { text: "Which sea has shrunk to roughly a tenth of its 1960s size due to Soviet-era irrigation diversion of the rivers that fed it?", choices: ["The Aral Sea", "The Caspian Sea", "The Dead Sea", "Lake Balkhash"], correctIndex: 0 },
        ],
      },
    ],
  },
  {
    name: "Biology",
    description: "The strangest, oldest, and most extreme organisms that ever lived.",
    icon: "Dna",
    color: "from-lime-500 to-green-600",
    quizzes: [
      {
        title: "Life's Weirdest Corners",
        description: "10 real biological facts most people have never encountered.",
        questions: [
          { text: "The \"immortal jellyfish,\" capable of reverting to its juvenile polyp stage, belongs to which genus?", choices: ["Turritopsis", "Aurelia", "Cassiopea", "Chrysaora"], correctIndex: 0 },
          { text: "The mantis shrimp's punch strikes so fast it creates collapsing cavitation bubbles that emit brief flashes of light known as what?", choices: ["Sonoluminescence", "Bioluminescence", "Triboluminescence", "Chemiluminescence"], correctIndex: 0 },
          { text: "Discovered in 2015, which fish is the only known species to exhibit whole-body warm-bloodedness (endothermy)?", choices: ["The opah (moonfish)", "Bluefin tuna", "Great white shark", "Swordfish"], correctIndex: 0 },
          { text: "The axolotl, famous for regenerating limbs and organs, is a neotenic salamander native to lakes near which city?", choices: ["Mexico City", "Bogotá", "Quito", "Guatemala City"], correctIndex: 0 },
          { text: "Tardigrades survive the vacuum of space by entering an extreme dehydrated survival state known by what general term?", choices: ["Cryptobiosis", "Diapause", "Hibernation", "Estivation"], correctIndex: 0 },
          { text: "Naked mole-rats are one of the only known mammals to exhibit which social structure, common among bees and ants, built around a single breeding queen?", choices: ["Eusociality", "Monogamy", "Polyandry", "Matriarchy"], correctIndex: 0 },
          { text: "Radiocarbon dating of eye lens tissue suggests the Greenland shark, one of the longest-living vertebrates, can live to approximately what age?", choices: ["About 400 years", "About 150 years", "About 1,000 years", "About 70 years"], correctIndex: 0 },
          { text: "Which bird lays the largest egg relative to its own body size of any bird species?", choices: ["Kiwi", "Ostrich", "Emu", "Cassowary"], correctIndex: 0 },
          { text: "Bombardier beetles spray attackers with a boiling, caustic chemical jet created by mixing hydroquinones with which other compound in an internal reaction chamber?", choices: ["Hydrogen peroxide", "Sulfuric acid", "Ammonia", "Formic acid"], correctIndex: 0 },
          { text: "Nearly all commercial Cavendish bananas are genetically identical seedless clones, leaving the crop vulnerable to which fungal disease that already wiped out the previous dominant variety, the Gros Michel?", choices: ["Panama disease", "Black Sigatoka", "Banana bunchy top", "Anthracnose"], correctIndex: 0 },
        ],
      },
    ],
  },
  {
    name: "Mathematics",
    description: "Numbers, proofs, and curiosities that never make it to school.",
    icon: "Sigma",
    color: "from-sky-500 to-blue-600",
    quizzes: [
      {
        title: "Numbers Nobody Memorizes",
        description: "10 real mathematical facts you were never taught in school.",
        questions: [
          { text: "What is the name given to numbers that equal the sum of their own proper divisors, such as 6 (1+2+3) and 28?", choices: ["Perfect numbers", "Amicable numbers", "Abundant numbers", "Prime numbers"], correctIndex: 0 },
          { text: "Graham's number, once the largest number ever used in a serious mathematical proof, requires which notation to even write down?", choices: ["Knuth's up-arrow notation", "Conway chained arrow notation", "Steinhaus–Moser notation", "Standard scientific notation"], correctIndex: 0 },
          { text: "In the Collatz conjecture, which operation is applied to a positive integer whenever it is even?", choices: ["Divide it by 2", "Multiply it by 3 and add 1", "Subtract 1 from it", "Square it"], correctIndex: 0 },
          { text: "153 is the smallest number greater than 9 that equals the sum of each of its digits raised to the power of its digit count. What is this type of number called?", choices: ["A narcissistic (Armstrong) number", "A perfect number", "A triangular number", "A Fibonacci number"], correctIndex: 0 },
          { text: "The repeating decimal 0.999... is mathematically proven to be exactly equal to which integer?", choices: ["1", "0", "2", "It has no exact equivalent"], correctIndex: 0 },
          { text: "The number 1729, the smallest number expressible as the sum of two positive cubes in two different ways, is famously known as what type of number?", choices: ["A taxicab number", "A perfect number", "A highly composite number", "A pronic number"], correctIndex: 0 },
          { text: "Proven in 1976, the Four Color Theorem became famous as the first major mathematical theorem to rely essentially on what?", choices: ["A computer", "A statistical survey", "Quantum computation", "Crowdsourced verification"], correctIndex: 0 },
          { text: "The infinite series 1 - 1/3 + 1/5 - 1/7 + ... converges to which famous constant divided by 4?", choices: ["Pi", "Euler's number (e)", "The golden ratio", "Catalan's constant"], correctIndex: 0 },
          { text: "A \"Sophie Germain prime\" is a prime p for which 2p+1 is also prime. What is the smallest Sophie Germain prime?", choices: ["2", "3", "5", "11"], correctIndex: 0 },
          { text: "Apéry's constant, the sum of the reciprocals of the cubes of every positive integer, had its irrationality proven in 1978 by whom?", choices: ["Roger Apéry", "Paul Erdős", "Srinivasa Ramanujan", "Leonhard Euler"], correctIndex: 0 },
        ],
      },
    ],
  },
  {
    name: "Physics",
    description: "Vacuum fluctuations, dying stars, and the physics behind daily life.",
    icon: "Atom",
    color: "from-violet-500 to-purple-600",
    quizzes: [
      {
        title: "Forces You've Never Heard Of",
        description: "10 real physics facts far outside the standard curriculum.",
        questions: [
          { text: "The Casimir effect, a measurable attractive force between two uncharged conducting plates in a vacuum, arises from what phenomenon?", choices: ["Quantum vacuum fluctuations", "Gravitational lensing", "Van der Waals forces alone", "Magnetic induction"], correctIndex: 0 },
          { text: "Which subatomic particle, predicted in 1930 by Wolfgang Pauli to preserve conservation of energy in beta decay, wasn't experimentally detected until 1956?", choices: ["The neutrino", "The positron", "The muon", "The neutron"], correctIndex: 0 },
          { text: "Superfluid helium-4, cooled below its \"lambda point\" of about 2.17 Kelvin, flows with zero what physical property?", choices: ["Viscosity", "Density", "Mass", "Surface tension"], correctIndex: 0 },
          { text: "The \"Mpemba effect\" is the counterintuitive observation that, under certain conditions, what can freeze faster than cold water?", choices: ["Hot water", "Salt water", "Distilled water", "Carbonated water"], correctIndex: 0 },
          { text: "PSR J1748-2446ad, the fastest-spinning pulsar ever discovered, rotates approximately how many times per second?", choices: ["716 times", "100 times", "1,000 times", "50 times"], correctIndex: 0 },
          { text: "The \"Unruh effect\" predicts that an observer accelerating through a vacuum would perceive a warm bath of what, which a stationary observer would not?", choices: ["Thermal radiation", "Antimatter", "Magnetic monopoles", "Dark energy"], correctIndex: 0 },
          { text: "In the 2019 redefinition of the SI unit system, the kilogram was redefined by fixing the exact value of which fundamental constant?", choices: ["Planck's constant", "Avogadro's number", "The speed of light", "The elementary charge"], correctIndex: 0 },
          { text: "Water's \"triple point,\" where solid, liquid, and gas coexist in equilibrium, occurs at a pressure of approximately how many pascals?", choices: ["About 612 Pa", "About 101,325 Pa", "About 6,120 Pa", "About 1 Pa"], correctIndex: 0 },
          { text: "Cosmic-ray muons reach Earth's surface in far greater numbers than classical physics would predict, a result explained by which effect of special relativity?", choices: ["Time dilation", "Length expansion", "Mass-energy equivalence", "Doppler blueshift"], correctIndex: 0 },
          { text: "In the most extreme neutron stars, called magnetars, the magnetic field can be roughly how many times stronger than Earth's?", choices: ["A quadrillion times", "A million times", "A billion times", "A trillion times"], correctIndex: 0 },
        ],
      },
    ],
  },
  {
    name: "Astronomy",
    description: "Planets, pulsars, and signals that scientists still argue about.",
    icon: "Telescope",
    color: "from-indigo-500 to-blue-700",
    quizzes: [
      {
        title: "Signals From the Void",
        description: "10 real astronomy facts far beyond the solar-system basics.",
        questions: [
          { text: "Which planet in our solar system has the shortest day, completing one rotation in under 10 hours?", choices: ["Jupiter", "Saturn", "Earth", "Neptune"], correctIndex: 0 },
          { text: "Olympus Mons, the largest known volcano in the solar system, is located on which planet?", choices: ["Mars", "Venus", "Mercury", "Jupiter"], correctIndex: 0 },
          { text: "A single rotation of Venus on its axis takes longer than its entire orbit around the Sun. About how many Earth days does that rotation take?", choices: ["243 days", "116 days", "365 days", "88 days"], correctIndex: 0 },
          { text: "Which moon of Saturn has lakes and seas of liquid methane and ethane, making it the only other body in the solar system known to have stable surface liquid?", choices: ["Titan", "Europa", "Enceladus", "Io"], correctIndex: 0 },
          { text: "Which planet's axis is tilted so extremely, at about 98 degrees, that it essentially rotates lying on its side?", choices: ["Uranus", "Neptune", "Saturn", "Pluto"], correctIndex: 0 },
          { text: "In 2012, the Voyager 1 spacecraft, launched in 1977, became the first human-made object to do what?", choices: ["Enter interstellar space", "Leave the solar system's gravity entirely", "Reach relativistic speed", "Orbit a black hole"], correctIndex: 0 },
          { text: "Which dwarf planet, discovered in 2005, was informally nicknamed \"Xena\" before receiving its official name after a Greek goddess of discord?", choices: ["Eris", "Makemake", "Haumea", "Ceres"], correctIndex: 0 },
          { text: "The 1977 \"Wow! signal,\" a strong unexplained radio burst, was recorded using which radio telescope?", choices: ["The Big Ear telescope", "The Arecibo Observatory", "The Green Bank Telescope", "The Parkes Observatory"], correctIndex: 0 },
          { text: "Betelgeuse, the red supergiant star in the constellation Orion, is expected to eventually end its life as what kind of explosive event?", choices: ["A supernova", "A nova", "A gamma-ray burst only", "A planetary nebula collapse"], correctIndex: 0 },
          { text: "Magnetars, the most extreme class of neutron star, generate magnetic fields roughly how many times stronger than the strongest magnets ever built in a lab?", choices: ["Ten billion times", "A thousand times", "A hundred times", "Ten times"], correctIndex: 0 },
        ],
      },
    ],
  },
  {
    name: "Literature",
    description: "Pen names, forbidden manuscripts, and constraints only writers would attempt.",
    icon: "BookOpen",
    color: "from-orange-500 to-amber-600",
    quizzes: [
      {
        title: "Pages Behind the Pages",
        description: "10 real literary facts most readers have never come across.",
        questions: [
          { text: "Charlotte Brontë first published \"Jane Eyre\" in 1847 under which male pen name?", choices: ["Currer Bell", "Ellis Bell", "Acton Bell", "George Eliot"], correctIndex: 0 },
          { text: "\"The Tale of Genji,\" often cited as the oldest novel still in existence, was written around 1000 AD by a woman known to us only by which court name?", choices: ["Murasaki Shikibu", "Sei Shōnagon", "Ono no Komachi", "Izumi Shikibu"], correctIndex: 0 },
          { text: "Charles Dickens published several early sketches and stories under which pseudonym before becoming famous under his own name?", choices: ["Boz", "Cross", "Sparks", "Marlowe"], correctIndex: 0 },
          { text: "Lewis Carroll, author of \"Alice in Wonderland,\" worked professionally under his real name, Charles Dodgson, in which academic field?", choices: ["Mathematics", "Theology", "Medicine", "Law"], correctIndex: 0 },
          { text: "Which epic poem, over 200,000 verse lines long and originating in India, is considered the longest poem ever written?", choices: ["The Mahabharata", "The Ramayana", "The Iliad", "The Shahnameh"], correctIndex: 0 },
          { text: "Herman Melville's \"Moby-Dick\" was a commercial failure on release in 1851. By his death in 1891, roughly how many copies had it sold?", choices: ["Fewer than 4,000", "About 50,000", "About 500,000", "Over 1 million"], correctIndex: 0 },
          { text: "Which author instructed his friend and literary executor, Max Brod, to burn all his unpublished manuscripts after his death — an instruction that was never carried out?", choices: ["Franz Kafka", "Emily Dickinson", "Virgil", "Gerard Manley Hopkins"], correctIndex: 0 },
          { text: "The word \"robot\" first appeared in a 1920 play by which Czech writer, derived from the Czech word \"robota\" meaning forced labor?", choices: ["Karel Čapek", "Franz Kafka", "Milan Kundera", "Jaroslav Hašek"], correctIndex: 0 },
          { text: "Georges Perec's 1969 novel \"La Disparition\" is a notable example of a lipogram because it entirely avoids using which letter?", choices: ["E", "A", "S", "I"], correctIndex: 0 },
          { text: "Which Portuguese-language writer authored under more than 70 distinct literary pseudonyms he called \"heteronyms,\" each with its own biography and style?", choices: ["Fernando Pessoa", "Jorge Luis Borges", "Gabriel García Márquez", "Pablo Neruda"], correctIndex: 0 },
        ],
      },
    ],
  },
  {
    name: "Computer Science",
    description: "The internet's forgotten firsts, from bugs to banner ads.",
    icon: "Cpu",
    color: "from-cyan-500 to-teal-600",
    quizzes: [
      {
        title: "The Internet's Buried Firsts",
        description: "10 real computing facts that predate most programmers' careers.",
        questions: [
          { text: "The first computer \"bug\" — literally a moth taped into a logbook in 1947 — was found by a team working on which computer?", choices: ["The Harvard Mark II", "ENIAC", "UNIVAC I", "Colossus"], correctIndex: 0 },
          { text: "What was the name of the first computer virus to spread \"in the wild\" on personal computers, written in 1982 by a 15-year-old targeting Apple II systems?", choices: ["Elk Cloner", "Creeper", "Brain", "Morris Worm"], correctIndex: 0 },
          { text: "The domain name \"google.com\" was first registered in which year?", choices: ["1997", "1998", "1995", "2000"], correctIndex: 0 },
          { text: "The Python programming language, created in 1991, was named after which British comedy group rather than the reptile most people assume?", choices: ["Monty Python's Flying Circus", "The Goon Show", "Fawlty Towers", "Blackadder"], correctIndex: 0 },
          { text: "The web's first banner ad, which appeared on HotWired in October 1994, was created for which company?", choices: ["AT&T", "IBM", "Apple", "Coca-Cola"], correctIndex: 0 },
          { text: "Thomas Edison used the word \"bug\" to describe defects in his inventions as far back as which decade, predating its use in computing?", choices: ["The 1870s", "The 1900s", "The 1920s", "The 1940s"], correctIndex: 0 },
          { text: "Completed in 1945 and weighing about 30 tons, which machine is often cited as the first general-purpose electronic computer?", choices: ["ENIAC", "Colossus", "Z3", "EDSAC"], correctIndex: 0 },
          { text: "The \"@\" symbol was chosen for email addresses in 1971 by which computer scientist, credited with sending the first networked email?", choices: ["Ray Tomlinson", "Vint Cerf", "Tim Berners-Lee", "Bob Kahn"], correctIndex: 0 },
          { text: "Registered on March 15, 1985 and still active today, which was the very first domain name ever registered?", choices: ["symbolics.com", "ibm.com", "apple.com", "mit.edu"], correctIndex: 0 },
          { text: "The QWERTY keyboard layout, designed in the 1870s, was arranged in part to reduce which mechanical problem in early typewriters?", choices: ["Typebars jamming together", "Keys overheating", "Ink smudging", "Excessive typing noise"], correctIndex: 0 },
        ],
      },
    ],
  },
  {
    name: "Art",
    description: "The strange materials, secrets, and stories behind famous works.",
    icon: "Palette",
    color: "from-rose-500 to-pink-600",
    quizzes: [
      {
        title: "Brushstrokes and Backstories",
        description: "10 real art-history facts far beyond the museum placard.",
        questions: [
          { text: "The pigment \"Mummy Brown,\" used by painters for centuries until supplies ran out, was made by grinding up the remains of what?", choices: ["Egyptian mummies", "Volcanic ash", "Crushed insects", "Burnt bones"], correctIndex: 0 },
          { text: "Artist Yves Klein patented the formula for his signature ultramarine shade, \"International Klein Blue,\" during which decade?", choices: ["The 1960s", "The 1950s", "The 1970s", "The 1980s"], correctIndex: 0 },
          { text: "Grant Wood's \"American Gothic\" (1930) depicts a farmer standing beside a woman Wood intended as his daughter, though the painting is commonly captioned as showing his what?", choices: ["Wife", "Sister", "Mother", "Niece"], correctIndex: 0 },
          { text: "Salvador Dalí said the melting clocks in \"The Persistence of Memory\" were inspired by watching what food item melt in the sun?", choices: ["Camembert cheese", "Ice cream", "Butter", "Wax candles"], correctIndex: 0 },
          { text: "The \"Mona Lisa\" was stolen from the Louvre in 1911 by an Italian handyman who believed the painting belonged in which country?", choices: ["Italy", "France", "Spain", "Vatican City"], correctIndex: 0 },
          { text: "Edvard Munch created how many original painted or pastel versions of \"The Scream\"?", choices: ["Four", "One", "Two", "Six"], correctIndex: 0 },
          { text: "Auguste Rodin's famous sculpture \"The Thinker\" was originally conceived as part of a larger, unfinished work called what?", choices: ["The Gates of Hell", "The Burghers of Calais", "The Kiss", "The Age of Bronze"], correctIndex: 0 },
          { text: "Despite his fame, only around how many paintings are definitively attributed to Johannes Vermeer today?", choices: ["34", "100", "200", "10"], correctIndex: 0 },
          { text: "The Rosetta Stone carries the same decree in hieroglyphic, Demotic, and which third script?", choices: ["Ancient Greek", "Latin", "Coptic", "Aramaic"], correctIndex: 0 },
          { text: "Too ill in his final years to paint, Henri Matisse turned to a technique using scissors and colored paper commonly known as what?", choices: ["Cut-outs (découpage)", "Collage", "Origami", "Silkscreen"], correctIndex: 0 },
        ],
      },
    ],
  },
];
