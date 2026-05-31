const PLAYERS = [
  {
    name:"Diego Maradona", pos:"Attacking Mid", nat:"Argentina",
    career_goals:161, career_appearances:350, assists:107,
    intl_caps:91, intl_goals:34, trophies:9,
    color:"#1a3a6b", tc:"#5a8fd4", initials:"DM",
    club_goals:[
      {c:"Argentinos Juniors",n:116,col:"#cc2222"},
      {c:"Boca Juniors",n:35,col:"#f5c518"},
      {c:"Barcelona",n:38,col:"#a50044"},
      {c:"Napoli",n:115,col:"#087cc4"},
      {c:"Sevilla",n:7,col:"#d4131b"},
      {c:"Newell's OB",n:0,col:"#cc2222"},
      {c:"Boca Juniors (2nd)",n:7,col:"#f5c518"}
    ],
    intl_breakdown:{flag:"🇦🇷",country:"Argentina",n:34},
    trophies_list:[
      "Argentine Primera División ×1","Copa del Rey ×1","Supercopa ×1",
      "Serie A ×2","Coppa Italia ×1","Supercoppa Italiana ×1","UEFA Cup ×1","World Cup ×1"
    ]
  },
  {
    name:"Johan Cruyff", pos:"Forward", nat:"Netherlands",
    career_goals:345, career_appearances:606, assists:254,
    intl_caps:48, intl_goals:33, trophies:25,
    color:"#cc2222", tc:"#ff8888", initials:"JC",
    club_goals:[
      {c:"Ajax",n:270,col:"#d2122e"},
      {c:"Barcelona",n:60,col:"#a50044"},
      {c:"LA Aztecs",n:14,col:"#ff6600"},
      {c:"Washington Dips",n:12,col:"#cc0000"},
      {c:"Levante",n:2,col:"#cc0000"},
      {c:"Feyenoord",n:13,col:"#cc0000"}
    ],
    intl_breakdown:{flag:"🇳🇱",country:"Netherlands",n:33},
    trophies_list:[
      "Eredivisie ×6","KNVB Cup ×4","European Cup ×3","Intercontinental Cup ×1",
      "La Liga ×1","Copa del Rey ×1"
    ]
  },
  {
    name:"Michel Platini", pos:"Forward", nat:"France",
    career_goals:314, career_appearances:585, assists:73,
    intl_caps:72, intl_goals:41, trophies:15,
    color:"#1a1a3a", tc:"#7070cc", initials:"MP",
    club_goals:[
      {c:"Nancy",n:127,col:"#cc2222"},
      {c:"Saint-Étienne",n:83,col:"#006600"},
      {c:"Juventus",n:104,col:"#111111"}
    ],
    intl_breakdown:{flag:"🇫🇷",country:"France",n:41},
    trophies_list:[
      "French Cup ×1","Ligue 1 ×1","Serie A ×2","Coppa Italia ×1",
      "European Cup ×1","Cup Winners' Cup ×1","UEFA Super Cup ×1",
      "Intercontinental Cup ×1","Euros ×1"
    ]
  },
  {
    name:"Franz Beckenbauer", pos:"Centre Back", nat:"Germany",
    career_goals:75, career_appearances:622, assists:75,
    intl_caps:103, intl_goals:14, trophies:20,
    color:"#cc0000", tc:"#ff6666", initials:"FB",
    club_goals:[
      {c:"Bayern Munich",n:60,col:"#dc052d"},
      {c:"NY Cosmos",n:8,col:"#006400"},
      {c:"Hamburg",n:5,col:"#005b9a"}
    ],
    intl_breakdown:{flag:"🇩🇪",country:"Germany",n:14},
    trophies_list:[
      "Bundesliga ×5","DFB-Pokal ×4","European Cup ×3","Cup Winners' Cup ×1",
      "Intercontinental Cup ×1","World Cup ×1","Euros ×1"
    ]
  },
  {
    name:"Gerd Müller", pos:"Forward", nat:"Germany",
    career_goals:570, career_appearances:613, assists:107,
    intl_caps:62, intl_goals:68, trophies:14,
    color:"#dc052d", tc:"#ff6688", initials:"GM",
    club_goals:[
      {c:"Bayern Munich",n:566,col:"#dc052d"},
      {c:"Fort Lauderdale",n:38,col:"#ff6600"}
    ],
    intl_breakdown:{flag:"🇩🇪",country:"Germany",n:68},
    trophies_list:[
      "Bundesliga ×4","DFB-Pokal ×4","European Cup ×3","Cup Winners' Cup ×1",
      "Intercontinental Cup ×1","World Cup ×1","Euros ×1"
    ]
  },
  {
    name:"Marco van Basten", pos:"Forward", nat:"Netherlands",
    career_goals:277, career_appearances:373, assists:86,
    intl_caps:58, intl_goals:24, trophies:14,
    color:"#cc0000", tc:"#ff8888", initials:"MV",
    club_goals:[
      {c:"Ajax",n:152,col:"#d2122e"},
      {c:"AC Milan",n:125,col:"#fb090b"}
    ],
    intl_breakdown:{flag:"🇳🇱",country:"Netherlands",n:24},
    trophies_list:[
      "Eredivisie ×3","KNVB Cup ×3","Cup Winners' Cup ×1","Serie A ×3",
      "Supercoppa Italiana ×2","European Cup ×2","UEFA Super Cup ×2",
      "Intercontinental Cup ×2","Euros ×1"
    ]
  },
  {
    name:"Ruud Gullit", pos:"Midfield", nat:"Netherlands",
    career_goals:219, career_appearances:576, assists:126,
    intl_caps:66, intl_goals:17, trophies:18,
    color:"#333", tc:"#aaa", initials:"RG",
    club_goals:[
      {c:"HFC Haarlem",n:36,col:"#cc2222"},
      {c:"Feyenoord",n:41,col:"#cc0000"},
      {c:"PSV",n:53,col:"#e2001a"},
      {c:"AC Milan",n:56,col:"#fb090b"},
      {c:"Sampdoria",n:26,col:"#0e4e96"},
      {c:"Chelsea",n:7,col:"#034694"}
    ],
    intl_breakdown:{flag:"🇳🇱",country:"Netherlands",n:17},
    trophies_list:[
      "Eredivisie ×2","Serie A ×2","Supercoppa Italiana ×2","European Cup ×2",
      "UEFA Super Cup ×1","Intercontinental Cup ×1","FA Cup ×1","Euros ×1"
    ]
  },
  {
    name:"Bobby Charlton", pos:"Midfield", nat:"England",
    career_goals:245, career_appearances:747, assists:77,
    intl_caps:106, intl_goals:49, trophies:11,
    color:"#da291c", tc:"#ff8888", initials:"BC",
    club_goals:[
      {c:"Manchester Utd",n:249,col:"#da291c"},
      {c:"Preston NE",n:0,col:"#ffffff"}
    ],
    intl_breakdown:{flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",country:"England",n:49},
    trophies_list:[
      "First Division ×3","FA Cup ×1","European Cup ×1","World Cup ×1"
    ]
  },
  {
    name:"Ronaldinho", pos:"Forward", nat:"Brazil",
    career_goals:229, career_appearances:647, assists:182,
    intl_caps:97, intl_goals:33, trophies:13,
    color:"#1a1a6b", tc:"#7070ee", initials:"RO",
    club_goals:[
      {c:"Grêmio",n:27,col:"#1565c0"},
      {c:"PSG",n:25,col:"#004170"},
      {c:"Barcelona",n:94,col:"#a50044"},
      {c:"AC Milan",n:26,col:"#fb090b"},
      {c:"Flamengo",n:22,col:"#e53935"},
      {c:"Atlético MG",n:27,col:"#000000"},
      {c:"Querétaro",n:8,col:"#1565c0"}
    ],
    intl_breakdown:{flag:"🇧🇷",country:"Brazil",n:33},
    trophies_list:[
      "La Liga ×2","Supercopa ×2","Champions League ×1","UEFA Super Cup ×1",
      "Club World Cup ×1","World Cup ×1","Copa América ×1","Confederations Cup ×1"
    ]
  },
  {
    name:"David Beckham", pos:"Midfield", nat:"England",
    career_goals:129, career_appearances:724, assists:227,
    intl_caps:115, intl_goals:17, trophies:20,
    color:"#da291c", tc:"#ff8888", initials:"DB",
    club_goals:[
      {c:"Manchester Utd",n:85,col:"#da291c"},
      {c:"Preston (loan)",n:2,col:"#888888"},
      {c:"Real Madrid",n:20,col:"#febe10"},
      {c:"LA Galaxy",n:20,col:"#00245d"},
      {c:"AC Milan",n:2,col:"#fb090b"},
      {c:"PSG",n:0,col:"#004170"}
    ],
    intl_breakdown:{flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",country:"England",n:17},
    trophies_list:[
      "Premier League ×6","FA Cup ×2","Community Shield ×5","Champions League ×1",
      "Intercontinental Cup ×1","La Liga ×1","Supercopa ×1","MLS Cup ×2"
    ]
  },
  {
    name:"Zlatan Ibrahimović", pos:"Forward", nat:"Sweden",
    career_goals:496, career_appearances:827, assists:205,
    intl_caps:122, intl_goals:62, trophies:34,
    color:"#1a3a1a", tc:"#4ade80", initials:"ZI",
    club_goals:[
      {c:"Malmö",n:3,col:"#004b9e"},
      {c:"Ajax",n:48,col:"#d2122e"},
      {c:"Juventus",n:26,col:"#111111"},
      {c:"Inter Milan",n:66,col:"#010e80"},
      {c:"Barcelona",n:22,col:"#a50044"},
      {c:"AC Milan",n:93,col:"#fb090b"},
      {c:"PSG",n:156,col:"#004170"},
      {c:"Man United",n:29,col:"#da291c"},
      {c:"LA Galaxy",n:53,col:"#00245d"}
    ],
    intl_breakdown:{flag:"🇸🇪",country:"Sweden",n:62},
    trophies_list:[
      "Eredivisie ×2","Serie A ×5","Supercoppa Italiana ×3","Ligue 1 ×4",
      "French Cup ×1","French League Cup ×3","French Super Cup ×3",
      "League Cup ×1","Community Shield ×1","Europa League ×1"
    ]
  },
  {
    name:"Ronaldo Nazário", pos:"Forward", nat:"Brazil",
    career_goals:330, career_appearances:499, assists:82,
    intl_caps:98, intl_goals:62, trophies:16,
    color:"#003399", tc:"#6699ff", initials:"RN",
    club_goals:[
      {c:"Cruzeiro",n:22,col:"#0033a0"},
      {c:"PSV",n:54,col:"#e2001a"},
      {c:"Barcelona",n:47,col:"#a50044"},
      {c:"Inter Milan",n:59,col:"#010e80"},
      {c:"Real Madrid",n:104,col:"#febe10"},
      {c:"AC Milan",n:9,col:"#fb090b"},
      {c:"Corinthians",n:35,col:"#000000"}
    ],
    intl_breakdown:{flag:"🇧🇷",country:"Brazil",n:62},
    trophies_list:[
      "Copa do Brasil ×1","La Liga ×2","Copa del Rey ×1","Supercopa ×1",
      "Intercontinental Cup ×1","World Cup ×2","Copa América ×1","Confederations Cup ×1"
    ]
  },
  {
    name:"Zinedine Zidane", pos:"Midfield", nat:"France",
    career_goals:125, career_appearances:689, assists:145,
    intl_caps:108, intl_goals:31, trophies:13,
    color:"#1a1a4a", tc:"#8080ee", initials:"ZZ",
    club_goals:[
      {c:"Cannes",n:6,col:"#cc3300"},
      {c:"Bordeaux",n:28,col:"#003366"},
      {c:"Juventus",n:24,col:"#111111"},
      {c:"Real Madrid",n:49,col:"#febe10"}
    ],
    intl_breakdown:{flag:"🇫🇷",country:"France",n:31},
    trophies_list:[
      "Serie A ×2","Supercoppa Italiana ×1","La Liga ×2","Supercopa ×1",
      "Champions League ×1","UEFA Super Cup ×1","Intercontinental Cup ×1",
      "World Cup ×1","Euros ×1"
    ]
  },
  {
    name:"Thierry Henry", pos:"Forward", nat:"France",
    career_goals:360, career_appearances:794, assists:180,
    intl_caps:123, intl_goals:51, trophies:16,
    color:"#cc0000", tc:"#ff6666", initials:"TH",
    club_goals:[
      {c:"Monaco",n:28,col:"#e2001a"},
      {c:"Juventus",n:3,col:"#111111"},
      {c:"Arsenal",n:228,col:"#ef0107"},
      {c:"Barcelona",n:49,col:"#a50044"},
      {c:"NY Red Bulls",n:52,col:"#ed2939"}
    ],
    intl_breakdown:{flag:"🇫🇷",country:"France",n:51},
    trophies_list:[
      "Ligue 1 ×1","Premier League ×2","FA Cup ×3","Community Shield ×2",
      "La Liga ×1","Copa del Rey ×1","Champions League ×1","UEFA Super Cup ×1",
      "Club World Cup ×1","World Cup ×1","Euros ×1","Confederations Cup ×1"
    ]
  },
  {
    name:"Steven Gerrard", pos:"Midfield", nat:"England",
    career_goals:191, career_appearances:749, assists:171,
    intl_caps:114, intl_goals:21, trophies:11,
    color:"#c8102e", tc:"#ff6666", initials:"SG",
    club_goals:[
      {c:"Liverpool",n:186,col:"#c8102e"},
      {c:"LA Galaxy",n:5,col:"#00245d"}
    ],
    intl_breakdown:{flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",country:"England",n:21},
    trophies_list:[
      "FA Cup ×2","League Cup ×3","UEFA Cup ×1","Champions League ×1",
      "UEFA Super Cup ×1","Community Shield ×1"
    ]
  },
  {
    name:"Frank Lampard", pos:"Midfield", nat:"England",
    career_goals:272, career_appearances:906, assists:177,
    intl_caps:106, intl_goals:29, trophies:15,
    color:"#034694", tc:"#6699ff", initials:"FL",
    club_goals:[
      {c:"West Ham",n:38,col:"#7a263a"},
      {c:"Swansea (loan)",n:0,col:"#121212"},
      {c:"Chelsea",n:211,col:"#034694"},
      {c:"Man City",n:8,col:"#6cabdd"},
      {c:"NYCFC",n:15,col:"#69b3e7"}
    ],
    intl_breakdown:{flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",country:"England",n:29},
    trophies_list:[
      "Premier League ×3","FA Cup ×4","League Cup ×2","Community Shield ×1",
      "Champions League ×1","UEFA Super Cup ×1","Europa League ×1"
    ]
  },
  {
    name:"Paul Scholes", pos:"Midfield", nat:"England",
    career_goals:155, career_appearances:716, assists:83,
    intl_caps:66, intl_goals:14, trophies:25,
    color:"#da291c", tc:"#ff8888", initials:"PS",
    club_goals:[
      {c:"Manchester Utd",n:155,col:"#da291c"}
    ],
    intl_breakdown:{flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",country:"England",n:14},
    trophies_list:[
      "Premier League ×11","FA Cup ×3","League Cup ×2","Community Shield ×6",
      "Champions League ×2","Intercontinental Cup ×1","Club World Cup ×1"
    ]
  },
  {
    name:"Didier Drogba", pos:"Forward", nat:"Ivory Coast",
    career_goals:302, career_appearances:688, assists:125,
    intl_caps:105, intl_goals:65, trophies:16,
    color:"#034694", tc:"#6699ff", initials:"DD",
    club_goals:[
      {c:"Le Mans",n:15,col:"#444444"},
      {c:"Guingamp",n:24,col:"#cc0000"},
      {c:"Marseille",n:32,col:"#2faee0"},
      {c:"Chelsea",n:164,col:"#034694"},
      {c:"Shanghai SH",n:8,col:"#1b5e20"},
      {c:"Galatasaray",n:20,col:"#f6a71b"},
      {c:"Montréal",n:23,col:"#00a0df"},
      {c:"Phoenix Rising",n:16,col:"#cc0000"}
    ],
    intl_breakdown:{flag:"🇨🇮",country:"Ivory Coast",n:65},
    trophies_list:[
      "Premier League ×4","FA Cup ×4","League Cup ×3","Community Shield ×2",
      "Champions League ×1","UEFA Super Cup ×1","Turkish Super Lig ×1","Turkish Cup ×1"
    ]
  },
  {
    name:"Mohamed Salah", pos:"Forward", nat:"Egypt",
    career_goals:332, career_appearances:687, assists:171,
    intl_caps:113, intl_goals:65, trophies:13,
    color:"#c8102e", tc:"#ff6666", initials:"MS",
    club_goals:[
      {c:"Al Mokawloon",n:12,col:"#006600"},
      {c:"Basel",n:20,col:"#ff0000"},
      {c:"Chelsea",n:2,col:"#034694"},
      {c:"Fiorentina",n:9,col:"#4b0082"},
      {c:"Roma",n:34,col:"#a8200d"},
      {c:"Liverpool",n:256,col:"#c8102e"}
    ],
    intl_breakdown:{flag:"🇪🇬",country:"Egypt",n:65},
    trophies_list:[
      "Swiss Super League ×2","Premier League ×1","FA Cup ×1","League Cup ×2",
      "Community Shield ×1","Champions League ×1","UEFA Super Cup ×1","Club World Cup ×1"
    ]
  },
  {
    name:"Wayne Rooney", pos:"Forward", nat:"England",
    career_goals:313, career_appearances:764, assists:168,
    intl_caps:120, intl_goals:53, trophies:16,
    color:"#da291c", tc:"#ff8888", initials:"WR",
    club_goals:[
      {c:"Everton",n:17,col:"#003399"},
      {c:"Manchester Utd",n:253,col:"#da291c"},
      {c:"Everton (return)",n:11,col:"#003399"},
      {c:"DC United",n:25,col:"#231f20"},
      {c:"Derby County",n:7,col:"#1a1a6b"}
    ],
    intl_breakdown:{flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",country:"England",n:53},
    trophies_list:[
      "Premier League ×5","FA Cup ×1","League Cup ×1","Community Shield ×5",
      "Champions League ×1","Club World Cup ×1"
    ]
  },
  {
    name:"Diego Costa", pos:"Forward", nat:"Spain",
    career_goals:199, career_appearances:444, assists:58,
    intl_caps:26, intl_goals:10, trophies:16,
    color:"#ce3524", tc:"#ff8866", initials:"DC",
    club_goals:[
      {c:"SC Braga",n:1,col:"#cc0000"},
      {c:"FC Penafiel",n:5,col:"#006600"},
      {c:"Celta de Vigo",n:6,col:"#6cabdd"},
      {c:"Valladolid",n:9,col:"#6b1f7c"},
      {c:"Albacete",n:9,col:"#ffd700"},
      {c:"Atlético Madrid",n:83,col:"#ce3524"},
      {c:"Grêmio",n:8,col:"#1565c0"},
      {c:"Atlético Mineiro",n:5,col:"#000000"},
      {c:"Rayo Vallecano",n:10,col:"#cc0000"},
      {c:"Chelsea",n:59,col:"#034694"},
      {c:"Wolverhampton",n:1,col:"#ffa500"},
      {c:"Botafogo",n:3,col:"#000000"}
    ],
    intl_breakdown:{flag:"🇪🇸",country:"Spain",n:10},
    trophies_list:[
      "La Liga ×2","Europa League ×1","Supercopa ×1","Premier League ×2",
      "League Cup ×1","Community Shield ×1"
    ]
  },
  {
    name:"Samuel Eto'o", pos:"Forward", nat:"Cameroon",
    career_goals:368, career_appearances:759, assists:143,
    intl_caps:118, intl_goals:56, trophies:15,
    color:"#006600", tc:"#66cc66", initials:"SE",
    club_goals:[
      {c:"Mallorca",n:70,col:"#cc0000"},
      {c:"CD Leganés",n:4,col:"#003399"},
      {c:"Barcelona",n:130,col:"#a50044"},
      {c:"Inter Milan",n:53,col:"#010e80"},
      {c:"Anzhi",n:36,col:"#ff6600"},
      {c:"Chelsea",n:12,col:"#034694"},
      {c:"Everton",n:4,col:"#003399"},
      {c:"Sampdoria",n:2,col:"#0e4e96"},
      {c:"Antalyaspor",n:44,col:"#d32f2f"},
      {c:"Konyaspor",n:6,col:"#006633"},
      {c:"Qatar SC",n:7,col:"#8b0000"}
    ],
    intl_breakdown:{flag:"🇨🇲",country:"Cameroon",n:56},
    trophies_list:[
      "La Liga ×3","Copa del Rey ×1","Supercopa ×1","Champions League ×3",
      "UEFA Super Cup ×1","Club World Cup ×2","Serie A ×1","Supercoppa Italiana ×1",
      "Africa Cup of Nations ×2"
    ]
  },
  {
    name:"Fernando Torres", pos:"Forward", nat:"Spain",
    career_goals:263, career_appearances:706, assists:91,
    intl_caps:110, intl_goals:38, trophies:11,
    color:"#c8102e", tc:"#ff6666", initials:"FT",
    club_goals:[
      {c:"Atlético Madrid",n:129,col:"#ce3524"},
      {c:"Liverpool",n:81,col:"#c8102e"},
      {c:"Chelsea",n:45,col:"#034694"},
      {c:"AC Milan",n:1,col:"#fb090b"},
      {c:"Sagan Tosu",n:7,col:"#004b9e"}
    ],
    intl_breakdown:{flag:"🇪🇸",country:"Spain",n:38},
    trophies_list:[
      "Europa League ×2","Supercopa ×1","FA Cup ×1","Community Shield ×1",
      "Champions League ×1","UEFA Super Cup ×1","World Cup ×1","Euros ×2"
    ]
  },
  {
    name:"Rivaldo", pos:"Forward", nat:"Brazil",
    career_goals:299, career_appearances:694, assists:115,
    intl_caps:74, intl_goals:35, trophies:12,
    color:"#003399", tc:"#6699ff", initials:"RV",
    club_goals:[
      {c:"Mogi Mirim",n:1,col:"#006600"},
      {c:"São Caetano",n:2,col:"#cc0000"},
      {c:"Corinthians",n:11,col:"#000000"},
      {c:"Palmeiras",n:26,col:"#006437"},
      {c:"Deportivo",n:22,col:"#1565c0"},
      {c:"Barcelona",n:130,col:"#a50044"},
      {c:"AC Milan",n:8,col:"#fb090b"},
      {c:"Olympiacos",n:43,col:"#cc0000"},
      {c:"AEK Athens",n:15,col:"#ffd700"},
      {c:"Bunyodkor",n:34,col:"#006400"},
      {c:"São Paulo",n:7,col:"#cc0000"}
    ],
    intl_breakdown:{flag:"🇧🇷",country:"Brazil",n:35},
    trophies_list:[
      "Brasileiro ×1","La Liga ×2","Copa del Rey ×1","Champions League ×1",
      "Greek Super League ×3","World Cup ×1","Copa América ×1","Confederations Cup ×1"
    ]
  },
  {
    name:"Arjen Robben", pos:"Forward", nat:"Netherlands",
    career_goals:209, career_appearances:587, assists:170,
    intl_caps:96, intl_goals:37, trophies:17,
    color:"#dc052d", tc:"#ff6688", initials:"AR",
    club_goals:[
      {c:"Groningen",n:12,col:"#1a5276"},
      {c:"PSV",n:21,col:"#e2001a"},
      {c:"Chelsea",n:19,col:"#034694"},
      {c:"Real Madrid",n:13,col:"#febe10"},
      {c:"Bayern Munich",n:144,col:"#dc052d"}
    ],
    intl_breakdown:{flag:"🇳🇱",country:"Netherlands",n:37},
    trophies_list:[
      "Eredivisie ×1","Premier League ×2","FA Cup ×1","Community Shield ×1",
      "La Liga ×1","Supercopa ×1","Bundesliga ×8","DFB-Pokal ×5",
      "Champions League ×1","UEFA Super Cup ×1","Club World Cup ×1"
    ]
  },
  {
    name:"Franck Ribéry", pos:"Midfield", nat:"France",
    career_goals:163, career_appearances:713, assists:249,
    intl_caps:81, intl_goals:16, trophies:24,
    color:"#dc052d", tc:"#ff6688", initials:"FR",
    club_goals:[
      {c:"US Boulogne",n:5,col:"#444"},
      {c:"Stade Brestois",n:5,col:"#cc0000"},
      {c:"FC Metz",n:2,col:"#6b1f7c"},
      {c:"Ales",n:1,col:"#444"},
      {c:"Galatasaray",n:1,col:"#f6a71b"},
      {c:"Marseille",n:18,col:"#2faee0"},
      {c:"Bayern Munich",n:124,col:"#dc052d"},
      {c:"Fiorentina",n:5,col:"#4b0082"},
      {c:"Salernitana",n:2,col:"#8b0000"}
    ],
    intl_breakdown:{flag:"🇫🇷",country:"France",n:16},
    trophies_list:[
      "Turkish Cup ×1","Bundesliga ×9","DFB-Pokal ×5","Champions League ×1",
      "UEFA Super Cup ×1","Club World Cup ×1","German Super Cup ×7"
    ]
  },
  {
    name:"David Villa", pos:"Forward", nat:"Spain",
    career_goals:367, career_appearances:729, assists:91,
    intl_caps:98, intl_goals:59, trophies:15,
    color:"#0033a0", tc:"#6699ff", initials:"DV",
    club_goals:[
      {c:"Sporting Gijón",n:41,col:"#ee0000"},
      {c:"Real Zaragoza",n:39,col:"#0033a0"},
      {c:"Valencia",n:129,col:"#ff7b00"},
      {c:"Barcelona",n:48,col:"#a50044"},
      {c:"Atlético Madrid",n:15,col:"#ce3524"},
      {c:"Melbourne (loan)",n:2,col:"#6cabdd"},
      {c:"NYCFC",n:80,col:"#69b3e7"},
      {c:"Vissel Kobe",n:13,col:"#cc0000"}
    ],
    intl_breakdown:{flag:"🇪🇸",country:"Spain",n:59},
    trophies_list:[
      "Copa del Rey ×3","La Liga ×3","Champions League ×1","UEFA Super Cup ×1",
      "Club World Cup ×1","Supercopa ×3","World Cup ×1","Euros ×1"
    ]
  },
  {
    name:"Ruud van Nistelrooy", pos:"Forward", nat:"Netherlands",
    career_goals:341, career_appearances:589, assists:82,
    intl_caps:70, intl_goals:35, trophies:11,
    color:"#da291c", tc:"#ff8888", initials:"RN",
    club_goals:[
      {c:"Den Bosch",n:12,col:"#ff6600"},
      {c:"Heerenveen",n:16,col:"#c8102e"},
      {c:"PSV",n:77,col:"#e2001a"},
      {c:"Man United",n:150,col:"#da291c"},
      {c:"Real Madrid",n:64,col:"#febe10"},
      {c:"Hamburg",n:17,col:"#005b9a"},
      {c:"Málaga",n:5,col:"#0057a8"}
    ],
    intl_breakdown:{flag:"🇳🇱",country:"Netherlands",n:35},
    trophies_list:[
      "Eredivisie ×1","Premier League ×1","FA Cup ×1","Community Shield ×1",
      "La Liga ×1","Supercopa ×1"
    ]
  },
  {
    name:"Robin van Persie", pos:"Forward", nat:"Netherlands",
    career_goals:272, career_appearances:602, assists:107,
    intl_caps:102, intl_goals:50, trophies:14,
    color:"#ef0107", tc:"#ff6666", initials:"RV",
    club_goals:[
      {c:"Feyenoord",n:46,col:"#cc0000"},
      {c:"Arsenal",n:132,col:"#ef0107"},
      {c:"Man United",n:58,col:"#da291c"},
      {c:"Fenerbahçe",n:36,col:"#ffcc00"}
    ],
    intl_breakdown:{flag:"🇳🇱",country:"Netherlands",n:50},
    trophies_list:[
      "KNVB Cup ×1","Premier League ×1","FA Cup ×1","Community Shield ×1"
    ]
  },
  {
    name:"Dennis Bergkamp", pos:"Forward", nat:"Netherlands",
    career_goals:264, career_appearances:689, assists:187,
    intl_caps:79, intl_goals:37, trophies:11,
    color:"#ef0107", tc:"#ff6666", initials:"DB",
    club_goals:[
      {c:"Ajax",n:122,col:"#d2122e"},
      {c:"Inter Milan",n:22,col:"#010e80"},
      {c:"Arsenal",n:120,col:"#ef0107"}
    ],
    intl_breakdown:{flag:"🇳🇱",country:"Netherlands",n:37},
    trophies_list:[
      "Eredivisie ×3","KNVB Cup ×3","UEFA Cup ×2","Premier League ×3",
      "FA Cup ×4","Community Shield ×3"
    ]
  },
  {
    name:"Michael Owen", pos:"Forward", nat:"England",
    career_goals:220, career_appearances:475, assists:48,
    intl_caps:89, intl_goals:40, trophies:9,
    color:"#c8102e", tc:"#ff6666", initials:"MO",
    club_goals:[
      {c:"Liverpool",n:158,col:"#c8102e"},
      {c:"Real Madrid",n:13,col:"#febe10"},
      {c:"Newcastle",n:30,col:"#241f20"},
      {c:"Man United",n:17,col:"#da291c"},
      {c:"Stoke City",n:1,col:"#e03a3e"}
    ],
    intl_breakdown:{flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",country:"England",n:40},
    trophies_list:[
      "FA Cup ×1","League Cup ×2","UEFA Cup ×1","UEFA Super Cup ×1",
      "Community Shield ×1","Premier League ×1"
    ]
  },
  {
    name:"Xavi", pos:"Midfield", nat:"Spain",
    career_goals:112, career_appearances:931, assists:217,
    intl_caps:133, intl_goals:13, trophies:33,
    color:"#a50044", tc:"#ff6699", initials:"XV",
    club_goals:[
      {c:"Barcelona",n:85,col:"#a50044"},
      {c:"Al Sadd",n:27,col:"#8b0000"}
    ],
    intl_breakdown:{flag:"🇪🇸",country:"Spain",n:13},
    trophies_list:[
      "La Liga ×8","Copa del Rey ×4","Supercopa ×8","Champions League ×4",
      "UEFA Super Cup ×3","Club World Cup ×3","World Cup ×1","Euros ×2"
    ]
  },
  {
    name:"Andrés Iniesta", pos:"Midfield", nat:"Spain",
    career_goals:88, career_appearances:885, assists:161,
    intl_caps:131, intl_goals:13, trophies:37,
    color:"#a50044", tc:"#ff6699", initials:"AI",
    club_goals:[
      {c:"Barcelona",n:57,col:"#a50044"},
      {c:"Vissel Kobe",n:26,col:"#cc0000"},
      {c:"Emirates Club",n:5,col:"#cc0000"}
    ],
    intl_breakdown:{flag:"🇪🇸",country:"Spain",n:13},
    trophies_list:[
      "La Liga ×9","Copa del Rey ×6","Supercopa ×9","Champions League ×4",
      "UEFA Super Cup ×3","Club World Cup ×3","World Cup ×1","Euros ×2"
    ]
  },
  {
    name:"Francesco Totti", pos:"Attacking Mid", nat:"Italy",
    career_goals:307, career_appearances:786, assists:206,
    intl_caps:58, intl_goals:9, trophies:6,
    color:"#a8200d", tc:"#ff6655", initials:"FT",
    club_goals:[
      {c:"Roma",n:307,col:"#a8200d"}
    ],
    intl_breakdown:{flag:"🇮🇹",country:"Italy",n:9},
    trophies_list:[
      "Serie A ×1","Coppa Italia ×2","Supercoppa Italiana ×2","World Cup ×1"
    ]
  },
  {
    name:"Alessandro Del Piero", pos:"Forward", nat:"Italy",
    career_goals:314, career_appearances:789, assists:168,
    intl_caps:91, intl_goals:27, trophies:15,
    color:"#111111", tc:"#aaaaaa", initials:"AD",
    club_goals:[
      {c:"Juventus",n:290,col:"#1a1a1a"},
      {c:"Padova (loan)",n:1,col:"#006400"},
      {c:"Sydney FC",n:20,col:"#0000cc"},
      {c:"Delhi Dynamos",n:2,col:"#ff6600"},
      {c:"Odisha FC",n:1,col:"#ff6600"}
    ],
    intl_breakdown:{flag:"🇮🇹",country:"Italy",n:27},
    trophies_list:[
      "Serie A ×6","Serie B ×1","Coppa Italia ×1","Supercoppa Italiana ×4",
      "Champions League ×1","UEFA Super Cup ×1","Intercontinental Cup ×1","World Cup ×1"
    ]
  },
  {
    name:"Gianfranco Zola", pos:"Forward", nat:"Italy",
    career_goals:221, career_appearances:637, assists:105,
    intl_caps:35, intl_goals:10, trophies:9,
    color:"#034694", tc:"#6699ff", initials:"GZ",
    club_goals:[
      {c:"Nuorese",n:10,col:"#444"},
      {c:"Torres",n:12,col:"#cc0000"},
      {c:"Napoli",n:32,col:"#087cc4"},
      {c:"Parma",n:49,col:"#ffd700"},
      {c:"Chelsea",n:80,col:"#034694"},
      {c:"Cagliari",n:38,col:"#cc0000"}
    ],
    intl_breakdown:{flag:"🇮🇹",country:"Italy",n:10},
    trophies_list:[
      "UEFA Cup ×1","FA Cup ×1","League Cup ×1","Cup Winners' Cup ×1","UEFA Super Cup ×1"
    ]
  },
  {
    name:"Dani Alves", pos:"Right Back", nat:"Brazil",
    career_goals:66, career_appearances:850, assists:192,
    intl_caps:126, intl_goals:8, trophies:43,
    color:"#a50044", tc:"#ff6699", initials:"DA",
    club_goals:[
      {c:"Bahia",n:4,col:"#cc3300"},
      {c:"Sevilla",n:16,col:"#d4131b"},
      {c:"Barcelona",n:22,col:"#a50044"},
      {c:"Juventus",n:6,col:"#111111"},
      {c:"PSG",n:8,col:"#004170"},
      {c:"São Paulo",n:10,col:"#cc0000"}
    ],
    intl_breakdown:{flag:"🇧🇷",country:"Brazil",n:8},
    trophies_list:[
      "UEFA Cup ×2","La Liga ×6","Copa del Rey ×6","Supercopa ×6",
      "Champions League ×3","UEFA Super Cup ×3","Club World Cup ×3",
      "Serie A ×1","Coppa Italia ×1","Ligue 1 ×2","French Cup ×1","French League Cup ×1",
      "Copa América ×2","Confederations Cup ×2"
    ]
  },
  {
    name:"Jordi Alba", pos:"Left Back", nat:"Spain",
    career_goals:52, career_appearances:601, assists:124,
    intl_caps:92, intl_goals:11, trophies:22,
    color:"#a50044", tc:"#ff6699", initials:"JA",
    club_goals:[
      {c:"Gimnàstic",n:4,col:"#cc0000"},
      {c:"Valencia",n:6,col:"#ff7b00"},
      {c:"Barcelona",n:27,col:"#a50044"},
      {c:"Inter Miami",n:15,col:"#f7b5cd"}
    ],
    intl_breakdown:{flag:"🇪🇸",country:"Spain",n:11},
    trophies_list:[
      "La Liga ×6","Copa del Rey ×5","Supercopa ×4","Champions League ×1",
      "UEFA Super Cup ×1","Club World Cup ×1","World Cup ×1","Euros ×1"
    ]
  },
  {
    name:"Marcelo", pos:"Left Back", nat:"Brazil",
    career_goals:52, career_appearances:721, assists:117,
    intl_caps:58, intl_goals:9, trophies:28,
    color:"#febe10", tc:"#ffd700", initials:"MA",
    club_goals:[
      {c:"Fluminense",n:11,col:"#811232"},
      {c:"Real Madrid",n:38,col:"#febe10"},
      {c:"Olympiacos",n:3,col:"#cc0000"}
    ],
    intl_breakdown:{flag:"🇧🇷",country:"Brazil",n:9},
    trophies_list:[
      "La Liga ×6","Copa del Rey ×2","Supercopa ×5","Champions League ×5",
      "UEFA Super Cup ×3","Club World Cup ×4","Copa Libertadores ×1","Confederations Cup ×1"
    ]
  }
];
