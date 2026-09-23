// Top 10 quiz data — verified June 2026
// Sources: premierleague.com, Opta Analyst, Wikipedia, La Liga official, FIFA, uefa.com
const TOP10_DATA = {
  'champions-league': {
    name: 'Champions League',
    badge: 'UCL',
    goals: {
      label: 'All-Time Top Goal Scorers',
      unit: 'Goals',
      // UEFA convention: includes European Cup era. All sources agree.
      players: [
        { name:'Cristiano Ronaldo',     value:140, aliases:['ronaldo','cr7'] },
        { name:'Lionel Messi',          value:129, aliases:['messi','leo messi'] },
        { name:'Robert Lewandowski',    value:109, aliases:['lewandowski','lewa'] },
        { name:'Karim Benzema',         value:90,  aliases:['benzema'] },
        { name:'Raúl',                  value:71,  aliases:['raul','raul gonzalez'] },
        { name:'Kylian Mbappé',         value:70,  aliases:['mbappe','kylian mbappe'] },
        { name:'Erling Haaland',        value:57,  aliases:['haaland','erling haaland'] },
        { name:'Thomas Müller',         value:57,  aliases:['muller','thomas muller'] },
        { name:'Ruud van Nistelrooy',   value:56,  aliases:['van nistelrooy','nistelrooy','ruud'] },
        { name:'Harry Kane',            value:54,  aliases:['kane'] }
      ]
    },
    assists: {
      label: 'All-Time Top Assist Providers',
      unit: 'Assists',
      // UEFA official figures (uefa.com). Note: an alternate Opta dataset ranks Giggs #1.
      players: [
        { name:'Cristiano Ronaldo',  value:42, aliases:['ronaldo','cr7'] },
        { name:'Ángel Di María',     value:41, aliases:['di maria','angel di maria','dimaria'] },
        { name:'Lionel Messi',       value:40, aliases:['messi','leo messi'] },
        { name:'Neymar',             value:33, aliases:['neymar jr'] },
        { name:'Ryan Giggs',         value:31, aliases:['giggs'] },
        { name:'Xavi',               value:30, aliases:['xavi hernandez','xavi hernández'] },
        { name:'Thomas Müller',      value:30, aliases:['muller','thomas muller'] },
        { name:'Karim Benzema',      value:29, aliases:['benzema'] },
        { name:'Andrés Iniesta',     value:29, aliases:['iniesta','andres iniesta'] },
        { name:'Kevin De Bruyne',    value:29, aliases:['de bruyne','kdb'] }
      ]
    },
    titles: {
      label: 'Most Successful Clubs (Titles Won)',
      unit: 'Titles',
      // European Cup + UCL combined, through 2025-26.
      // 6 clubs tied at 2 → each gets its own slot (9-14). Sources: UEFA.com, Wikipedia.
      players: [
        { name:'Real Madrid',         value:15, aliases:['madrid','real'] },
        { name:'AC Milan',            value:7,  aliases:['milan','ac milan','rossoneri'] },
        { name:'Liverpool',           value:6,  aliases:['liverpool','lfc','the reds'] },
        { name:'Bayern Munich',       value:6,  aliases:['bayern','bayern münchen','fc bayern'] },
        { name:'Barcelona',           value:5,  aliases:['barca','barça','fc barcelona'] },
        { name:'Ajax',                value:4,  aliases:['ajax amsterdam','afc ajax'] },
        { name:'Manchester United',   value:3,  aliases:['man utd','man united','manchester utd','united','mufc'] },
        { name:'Inter Milan',         value:3,  aliases:['inter','internazionale','inter milano'] },
        // Slots 9-14: 6 clubs tied at 2 titles (ordered by year of first win)
        { name:'Benfica',             value:2,  aliases:['benfica','sl benfica','as benfica'] },
        { name:'Nottingham Forest',   value:2,  aliases:['nottingham forest','forest','nottm forest','nffc'] },
        { name:'Juventus',            value:2,  aliases:['juve','old lady','vecchia signora','juventus fc'] },
        { name:'Porto',               value:2,  aliases:['porto','fc porto','dragões'] },
        { name:'Chelsea',             value:2,  aliases:['chelsea','cfc','blues'] },
        { name:'Paris Saint-Germain', value:2,  aliases:['psg','paris','paris sg','paris saint germain'] }
      ],
      // Clubs just below the cutoff — recognised, but not in the top tier.
      traps: [
        { name:'Celtic',              aliases:['celtic','celtic fc','the bhoys'], note:'🔴 Celtic — <b>1 European Cup</b> (1967), just below the top tier.' },
        { name:'Hamburg',             aliases:['hamburg','hamburger sv','hsv'],   note:'🔴 Hamburg — <b>1 European Cup</b> (1983), just below the top tier.' },
        { name:'Steaua București',    aliases:['steaua','steaua bucharest','steaua bucuresti','fcsb'], note:'🔴 Steaua București — <b>1 European Cup</b> (1986), just below the top tier.' },
        { name:'Marseille',           aliases:['marseille','olympique marseille','om'], note:'🔴 Marseille — <b>1 Champions League</b> (1993), just below the top tier.' },
        { name:'Borussia Dortmund',   aliases:['dortmund','borussia dortmund','bvb'], note:'🔴 Borussia Dortmund — <b>1 Champions League</b> (1997), just below the top tier.' },
        { name:'Feyenoord',           aliases:['feyenoord'], note:'🔴 Feyenoord — <b>1 European Cup</b> (1970), just below the top tier.' },
        { name:'Aston Villa',         aliases:['aston villa','villa','avfc'], note:'🔴 Aston Villa — <b>1 European Cup</b> (1982), just below the top tier.' }
      ]
    }
  },

  'premier-league': {
    name: 'Premier League',
    badge: 'PL',
    goals: {
      label: 'All-Time Top Goal Scorers',
      unit: 'Goals',
      players: [
        { name:'Alan Shearer',    value:260, aliases:['shearer'] },
        { name:'Harry Kane',      value:213, aliases:['kane'] },
        { name:'Wayne Rooney',    value:208, aliases:['rooney'] },
        { name:'Mohamed Salah',   value:193, aliases:['salah','mo salah'] },
        { name:'Andrew Cole',     value:187, aliases:['andy cole','cole'] },
        { name:'Sergio Agüero',   value:184, aliases:['aguero','kun aguero','sergio aguero','kun agüero'] },
        { name:'Frank Lampard',   value:177, aliases:['lampard'] },
        { name:'Thierry Henry',   value:175, aliases:['henry'] },
        { name:'Robbie Fowler',   value:163, aliases:['fowler'] },
        { name:'Jermain Defoe',   value:162, aliases:['defoe'] }
      ]
    },
    assists: {
      label: 'All-Time Top Assist Providers',
      unit: 'Assists',
      players: [
        { name:'Ryan Giggs',       value:162, aliases:['giggs'] },
        { name:'Kevin De Bruyne',  value:119, aliases:['de bruyne','kdb'] },
        { name:'Cesc Fàbregas',    value:111, aliases:['fabregas','cesc fabregas','cesc'] },
        { name:'Wayne Rooney',     value:103, aliases:['rooney'] },
        { name:'Frank Lampard',    value:102, aliases:['lampard'] },
        { name:'Dennis Bergkamp',  value:94,  aliases:['bergkamp'] },
        { name:'Mohamed Salah',    value:94,  aliases:['salah','mo salah'] },
        { name:'David Silva',      value:93,  aliases:['silva','el mago'] },
        { name:'Steven Gerrard',   value:92,  aliases:['gerrard'] },
        { name:'James Milner',     value:90,  aliases:['milner'] }
      ]
    },
    titles: {
      label: 'Most Successful Clubs (English Top Flight Titles)',
      unit: 'Titles',
      // Combined English First Division + Premier League era titles, through 2025-26
      // (Arsenal won 2025-26 → 14). PL era alone only has 8 distinct winners.
      // Sources: Wikipedia "List of English football champions", Opta Analyst.
      players: [
        { name:'Liverpool',          value:20, aliases:['liverpool','lfc','the reds'] },
        { name:'Manchester United',  value:20, aliases:['man utd','man united','manchester utd','united','mufc'] },
        { name:'Arsenal',            value:14, aliases:['arsenal','gunners','afc'] },
        { name:'Manchester City',    value:10, aliases:['man city','mcfc','city','citizens'] },
        { name:'Everton',            value:9,  aliases:['everton','toffees','efc'] },
        { name:'Aston Villa',        value:7,  aliases:['villa','aston villa','avfc'] },
        { name:'Sunderland',         value:6,  aliases:['sunderland','black cats','safc'] },
        { name:'Chelsea',            value:6,  aliases:['chelsea','cfc','blues'] },
        { name:'Newcastle United',   value:4,  aliases:['newcastle','toon','magpies','nufc'] },
        { name:'Sheffield Wednesday',value:4,  aliases:['sheff wed','sheffield wed','wednesday','owls'] }
      ],
      // 4 clubs tied at 3 titles, just outside the top 10
      traps: [
        { name:'Wolves',         aliases:['wolves','wolverhampton','wolverhampton wanderers','wwfc'], note:'🔴 Wolves — <b>3 titles</b>, just outside the top 10.' },
        { name:'Huddersfield',   aliases:['huddersfield','huddersfield town','htafc'], note:'🔴 Huddersfield Town — <b>3 titles</b>, just outside the top 10.' },
        { name:'Leeds United',   aliases:['leeds','leeds united','lufc'], note:'🔴 Leeds United — <b>3 titles</b>, just outside the top 10.' },
        { name:'Blackburn Rovers',aliases:['blackburn','blackburn rovers','rovers','brfc'], note:'🔴 Blackburn Rovers — <b>3 titles</b>, just outside the top 10.' }
      ]
    },
    signings: {
      label: 'Most Expensive Premier League Signings (Ever)',
      unit: '€M',
      // Total transfer package (base + all reported add-ons), incoming to PL clubs. Sources: Sky Sports, ESPN, Fabrizio Romano, official announcements. Verified Sep 2026.
      players: [
        { name:'Alexander Isak',   value:145,   aliases:['isak','alex isak','a isak'],               club:'Liverpool',   year:2025, from:'Newcastle' },
        { name:'Enzo Fernández',   value:145,   aliases:['enzo fernandez','enzo','fernandez'],       club:'Man City',    year:2026, from:'Chelsea' },
        { name:'Bradley Barcola',  value:142,   aliases:['barcola','bradley'],                       club:'Liverpool',   year:2026, from:'PSG' },
        { name:'Morgan Rogers',    value:135,   aliases:['rogers','morgan'],                         club:'Chelsea',     year:2026, from:'Aston Villa' },
        { name:'Florian Wirtz',    value:135,   aliases:['wirtz','florian wirtz','flo wirtz'],       club:'Liverpool',   year:2025, from:'Bayer Leverkusen' },
        { name:'Elliot Anderson',  value:134,   aliases:['anderson','elliot'],                       club:'Man City',    year:2026, from:'Nottingham Forest' },
        { name:'Moisés Caicedo',   value:133,   aliases:['caicedo','moises caicedo','moises'],       club:'Chelsea',     year:2023, from:'Brighton' },
        { name:'Enzo Fernández',   value:121,   aliases:['enzo chelsea','enzo fernandez chelsea'],   club:'Chelsea',     year:2023, from:'Benfica', displayName:'Enzo Fernández (2023)' },
        { name:'Jack Grealish',    value:117.5, aliases:['grealish','jack grealish'],                club:'Man City',    year:2021, from:'Aston Villa' },
        { name:'Declan Rice',      value:117,   aliases:['rice','declan rice','decs'],               club:'Arsenal',     year:2023, from:'West Ham' }
      ],
      // Just outside the top 10
      traps: [
        { name:'Yan Diomandé',   aliases:['diomande','yan diomande','yan'],                          note:'🔴 Yan Diomandé — <b>€140m</b> to Real Madrid, not a Premier League signing.' },
        { name:'Paul Pogba',     aliases:['pogba','paul pogba'],                                     note:'🔴 Paul Pogba — <b>€105m</b> to Man United (2016), just outside the top 10.' },
        { name:'Antony',         aliases:['antony','antony matheus'],                                note:'🔴 Antony — <b>€95m</b> to Man United (2022), outside the top 10.' },
        { name:'Neymar',         aliases:['neymar','neymar jr','ney'],                               note:'🔴 Neymar — <b>€222m</b> to PSG, not a Premier League signing.' },
        { name:'Mbappé',         aliases:['mbappe','mbappé','kylian mbappe','kylian mbappé'],        note:'🔴 Kylian Mbappé — <b>€180m</b> to PSG, not a Premier League signing.' }
      ]
    }
  },

  'la-liga': {
    name: 'La Liga',
    badge: 'LaL',
    goals: {
      label: 'All-Time Top Goal Scorers',
      unit: 'Goals',
      players: [
        { name:'Lionel Messi',       value:474, aliases:['messi','leo messi'] },
        { name:'Cristiano Ronaldo',  value:311, aliases:['ronaldo','cr7'] },
        { name:'Telmo Zarra',        value:251, aliases:['zarra'] },
        { name:'Karim Benzema',      value:238, aliases:['benzema'] },
        { name:'Hugo Sánchez',       value:234, aliases:['hugo sanchez','sanchez'] },
        { name:'Raúl',               value:228, aliases:['raul'] },
        { name:'Alfredo Di Stéfano', value:227, aliases:['di stefano','di stéfano','alfredo di stefano'] },
        { name:'César Rodríguez',    value:221, aliases:['cesar','cesar rodriguez'] },
        { name:'Quini',              value:219, aliases:['enrique castro'] },
        { name:'Pahiño',             value:210, aliases:['pahino'] }
      ]
    },
    assists: {
      label: 'All-Time Top Assist Providers',
      unit: 'Assists',
      players: [
        { name:'Lionel Messi',       value:216, aliases:['messi','leo messi'] },
        { name:'Xavi',               value:129, aliases:['xavi hernandez','xavi hernández'] },
        { name:'Karim Benzema',      value:119, aliases:['benzema'] },
        { name:'Luis Figo',          value:97,  aliases:['figo'] },
        { name:'Cristiano Ronaldo',  value:95,  aliases:['ronaldo','cr7'] },
        { name:'Antoine Griezmann',  value:94,  aliases:['griezmann'] },
        { name:'Dani Alves',         value:87,  aliases:['daniel alves','alves'] },
        { name:'Andrés Iniesta',     value:86,  aliases:['iniesta','andres iniesta'] },
        { name:'Luis Suárez',        value:84,  aliases:['suarez','luis suarez'] },
        { name:'Jesús Navas',        value:83,  aliases:['navas','jesus navas'] }
      ]
    },
    titles: {
      label: 'Most Successful Clubs (La Liga Titles)',
      unit: 'Titles',
      // All-time La Liga winners (only 9 clubs have ever won). Sources: Wikipedia, ESPN.
      players: [
        { name:'Real Madrid',         value:36, aliases:['madrid','real'] },
        { name:'Barcelona',           value:29, aliases:['barca','barça','fc barcelona'] },
        { name:'Atlético Madrid',     value:11, aliases:['atletico','atletico madrid','atleti'] },
        { name:'Athletic Bilbao',     value:8,  aliases:['athletic','athletic club','bilbao'] },
        { name:'Valencia',            value:6,  aliases:['valencia','valencia cf','los che'] },
        { name:'Real Sociedad',       value:2,  aliases:['sociedad','la real','real sociedad de futbol'] },
        { name:'Deportivo La Coruña', value:1,  aliases:['deportivo','depor','la coruna','la coruña'] },
        { name:'Sevilla',             value:1,  aliases:['sevilla','sevilla fc'] },
        { name:'Real Betis',          value:1,  aliases:['betis','real betis balompie'] }
      ]
    }
  },

  'world-cup': {
    name: 'World Cup',
    badge: 'WC',
    goals: {
      label: 'All-Time Top Goal Scorers',
      unit: 'Goals',
      // Updated after the 2026 World Cup. Mbappé (10 goals, Golden Boot) overtook Klose;
      // Messi added 8 to jump to 21; Cristiano Ronaldo added 3 to reach 11 (six different WCs).
      // Sources: FIFA.com, Statista, foxsports, beIN, Al Jazeera. Verified Sep 2026.
      players: [
        { name:'Kylian Mbappé',     value:22, aliases:['mbappe','kylian mbappe','mbappé'] },
        { name:'Lionel Messi',      value:21, aliases:['messi','leo messi','lionel messi'] },
        { name:'Miroslav Klose',    value:16, aliases:['klose','miroslav klose'] },
        { name:'Ronaldo',           value:15, aliases:['ronaldo nazario','r9','ronaldo brazil','fenomeno'] },
        { name:'Gerd Müller',       value:14, aliases:['gerd muller','gerd müller'] },
        { name:'Just Fontaine',     value:13, aliases:['fontaine','just fontaine'] },
        { name:'Pelé',              value:12, aliases:['pele','edson arantes','pelé'] },
        // 8th–10th: three players tied on 11 — accept any
        { name:'Sándor Kocsis',     value:11, aliases:['kocsis','sandor kocsis','sándor kocsis'] },
        { name:'Jürgen Klinsmann',  value:11, aliases:['klinsmann','jurgen klinsmann','jürgen klinsmann'] },
        { name:'Cristiano Ronaldo', value:11, aliases:['cristiano','cristiano ronaldo','cr7'] }
      ],
      // Just outside the top 10 — six players tied at 10 goals
      traps: [
        { name:'Gary Lineker',      aliases:['lineker','gary lineker'],                        note:'🔴 Gary Lineker — <b>10 goals</b>, just outside the top 10.' },
        { name:'Gabriel Batistuta', aliases:['batistuta','gabriel batistuta','batigol'],       note:'🔴 Gabriel Batistuta — <b>10 goals</b>, just outside the top 10.' },
        { name:'Thomas Müller',     aliases:['thomas muller','thomas müller','müller','mueller'], note:'🔴 Thomas Müller — <b>10 goals</b>, just outside the top 10.' },
        { name:'Grzegorz Lato',     aliases:['lato','grzegorz lato'],                          note:'🔴 Grzegorz Lato — <b>10 goals</b>, just outside the top 10.' },
        { name:'Teófilo Cubillas',  aliases:['cubillas','teofilo cubillas','teófilo cubillas'],note:'🔴 Teófilo Cubillas — <b>10 goals</b>, just outside the top 10.' },
        { name:'Helmut Rahn',       aliases:['rahn','helmut rahn'],                            note:'🔴 Helmut Rahn — <b>10 goals</b>, just outside the top 10.' }
      ]
    },
    assists: {
      label: 'All-Time Top Assist Providers',
      unit: 'Assists',
      // Updated after 2026 WC. Messi added 4 assists (12 total, new all-time record). Michael
      // Olise added 7 in a single tournament — new joint-3rd all-time. Note: pre-1994 assists
      // are retroactively compiled; sources: planetfootball, Opta, FIFA.com, beIN, givemesport.
      players: [
        { name:'Lionel Messi',            value:12, aliases:['messi','leo messi','lionel messi'] },
        { name:'Diego Maradona',          value:8,  aliases:['maradona','diego maradona','d10s'] },
        // 3rd–5th: three players tied on 7
        { name:'Pierre Littbarski',       value:7,  aliases:['littbarski','pierre littbarski'] },
        { name:'Grzegorz Lato',           value:7,  aliases:['lato','grzegorz lato'] },
        { name:'Michael Olise',           value:7,  aliases:['olise','michael olise'] },
        // 6th–10th: five players tied on 6
        { name:'Pelé',                    value:6,  aliases:['pele','pelé','edson arantes'] },
        { name:'David Beckham',           value:6,  aliases:['beckham','david beckham'] },
        { name:'Thomas Häßler',           value:6,  aliases:['hässler','hassler','thomas hassler','thomas häßler'] },
        { name:'Bastian Schweinsteiger',  value:6,  aliases:['schweinsteiger','bastian schweinsteiger'] },
        { name:'Kylian Mbappé',           value:6,  aliases:['mbappe','kylian mbappe','mbappé'] }
      ],
      // Just outside the top 10 — also on 6 assists
      traps: [
        { name:'Thomas Müller',       aliases:['thomas muller','thomas müller','müller','mueller'], note:'🔴 Thomas Müller — <b>6 assists</b>, tied but just outside the top 10.' },
        { name:'Francesco Totti',     aliases:['totti','francesco totti'],                       note:'🔴 Francesco Totti — <b>6 assists</b>, tied but just outside the top 10.' },
        { name:'Ivan Perišić',        aliases:['perisic','ivan perisic','perišić','ivan perišić'],note:'🔴 Ivan Perišić — <b>6 assists</b>, tied but just outside the top 10.' },
        { name:'Uwe Seeler',          aliases:['seeler','uwe seeler'],                           note:'🔴 Uwe Seeler — <b>6 assists</b>, tied but just outside the top 10.' }
      ]
    }
  },

  'serie-a': {
    name: 'Serie A',
    badge: 'SA',
    goals: {
      label: 'All-Time Top Goal Scorers',
      unit: 'Goals',
      // Sources: Wikipedia "List of Serie A players with 100 or more goals", Lega Serie A albo d'oro.
      players: [
        { name:'Silvio Piola',          value:274, aliases:['piola'] },
        { name:'Francesco Totti',       value:250, aliases:['totti','er pupone'] },
        { name:'Gunnar Nordahl',        value:225, aliases:['nordahl'] },
        { name:'Giuseppe Meazza',       value:216, aliases:['meazza'] },
        { name:'José Altafini',         value:216, aliases:['altafini','jose altafini'] },
        { name:'Antonio Di Natale',     value:209, aliases:['di natale','dinatale'] },
        { name:'Roberto Baggio',        value:205, aliases:['baggio','il divin codino'] },
        { name:'Ciro Immobile',         value:201, aliases:['immobile'] },
        { name:'Kurt Hamrin',           value:190, aliases:['hamrin'] },
        { name:'Giuseppe Signori',      value:188, aliases:['signori','beppe signori'] }
      ]
    },
    titles: {
      label: 'Most Successful Clubs (Scudetti Won)',
      unit: 'Titles',
      // Through 2025-26 (Inter won 2025-26 → 21; Napoli won 2024-25 → 4).
      // Juventus 36 per FIGC official (club claims 38; 2 stripped via Calciopoli).
      // Sources: Wikipedia, Lega Serie A albo d'oro, Football Italia.
      players: [
        { name:'Juventus',       value:36, aliases:['juve','old lady','vecchia signora','juventus fc'] },
        { name:'Inter Milan',    value:21, aliases:['inter','internazionale','inter milano'] },
        { name:'AC Milan',       value:19, aliases:['milan','ac milan','rossoneri'] },
        { name:'Genoa',          value:9,  aliases:['genoa','genoa cfc','grifone'] },
        { name:'Bologna',        value:7,  aliases:['bologna','bfc'] },
        { name:'Pro Vercelli',   value:7,  aliases:['pro vercelli','vercelli'] },
        { name:'Torino',         value:7,  aliases:['torino','toro','grande torino'] },
        { name:'Napoli',         value:4,  aliases:['napoli','partenopei','ssc napoli'] },
        { name:'Roma',           value:3,  aliases:['roma','as roma','giallorossi'] },
        // Slots 10 & 11: tied at 2 Scudetti — each gets its own slot
        { name:'Fiorentina',     value:2,  aliases:['fiorentina','viola','acf fiorentina'] },
        { name:'Lazio',          value:2,  aliases:['lazio','ss lazio','biancocelesti'] }
      ],
      // 5 clubs tied at 1 Scudetto, just outside the top tier
      traps: [
        { name:'Cagliari',       aliases:['cagliari','cagliari calcio','rossoblu'], note:'🔴 Cagliari — <b>1 Scudetto</b> (1970), just outside the top tier.' },
        { name:'Hellas Verona',  aliases:['verona','hellas verona','gialloblù'], note:'🔴 Hellas Verona — <b>1 Scudetto</b> (1985), just outside the top tier.' },
        { name:'Sampdoria',      aliases:['sampdoria','samp','blucerchiati'], note:'🔴 Sampdoria — <b>1 Scudetto</b> (1991), just outside the top tier.' },
        { name:'Casale',         aliases:['casale','casale fbc'], note:'🔴 Casale — <b>1 Scudetto</b> (1914), just outside the top tier.' },
        { name:'Novese',         aliases:['novese','us novese'], note:'🔴 Novese — <b>1 Scudetto</b> (1922), just outside the top tier.' }
      ]
    }
  },

  'transfers': {
    name: 'Transfers',
    badge: '€',
    signings: {
      label: 'Most Expensive Transfers of All Time',
      unit: '€M',
      // Total package (base + all reported add-ons). Sources: Sky Sports, ESPN, Fabrizio Romano, Transfermarkt, official announcements. Verified Sep 2026.
      players: [
        { name:'Neymar',            value:222,   aliases:['neymar jr','ney'],                               club:'PSG',         year:2017, from:'Barcelona' },
        { name:'Kylian Mbappé',     value:180,   aliases:['mbappe','mbappé','kylian mbappe'],               club:'PSG',         year:2018, from:'Monaco' },
        { name:'Philippe Coutinho', value:160,   aliases:['coutinho','philippe','phil coutinho'],           club:'Barcelona',   year:2018, from:'Liverpool' },
        { name:'Ousmane Dembélé',   value:147,   aliases:['dembele','dembélé','ousmane','ousmane dembele'], club:'Barcelona',   year:2017, from:'Dortmund' },
        { name:'Alexander Isak',    value:145,   aliases:['isak','alex isak','a isak'],                     club:'Liverpool',   year:2025, from:'Newcastle' },
        { name:'Enzo Fernández',    value:145,   aliases:['enzo','fernandez','enzo fernandez'],             club:'Man City',    year:2026, from:'Chelsea' },
        { name:'Bradley Barcola',   value:142,   aliases:['barcola','bradley'],                             club:'Liverpool',   year:2026, from:'PSG' },
        { name:'Yan Diomandé',      value:140,   aliases:['diomande','yan diomande','yan'],                 club:'Real Madrid', year:2026, from:'RB Leipzig' },
        { name:'Morgan Rogers',     value:135,   aliases:['rogers','morgan','morgan rogers'],               club:'Chelsea',     year:2026, from:'Aston Villa' },
        { name:'Florian Wirtz',     value:135,   aliases:['wirtz','florian','florian wirtz'],               club:'Liverpool',   year:2025, from:'Bayer Leverkusen' }
      ],
      // Just outside the top 10
      traps: [
        { name:'Elliot Anderson', aliases:['anderson','elliot','elliot anderson'],                          note:'🔴 Elliot Anderson — <b>€134m</b> Forest→Man City 2026, just outside the top 10.' },
        { name:'Moisés Caicedo',  aliases:['caicedo','moises caicedo','moises'],                           note:'🔴 Moisés Caicedo — <b>€133m</b> Brighton→Chelsea 2023, just outside the top 10.' },
        { name:'João Félix',      aliases:['joao felix','felix','joão félix'],                             note:'🔴 João Félix — <b>€127m</b> Benfica→Atlético 2019, just outside the top 10.' },
        { name:'Jude Bellingham', aliases:['bellingham','jude','jude bellingham'],                         note:'🔴 Jude Bellingham — <b>€127m</b> Dortmund→Real Madrid 2023, just outside the top 10.' },
        { name:'Antoine Griezmann',aliases:['griezmann','grizou'],                                         note:'🔴 Antoine Griezmann — <b>€120m</b> Atlético→Barcelona 2019, just outside the top 10.' },
        { name:'Jack Grealish',   aliases:['grealish','jack','jack grealish'],                             note:'🔴 Jack Grealish — <b>€117.5m</b> Aston Villa→Man City 2021, just outside the top 10.' }
      ]
    }
  }
};
