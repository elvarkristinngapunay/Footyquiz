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
      // Sources: UEFA.com, Wikipedia. 6 clubs tied at 2 — slots 9 & 10 cover them via aliases.
      players: [
        { name:'Real Madrid',        value:15, aliases:['madrid','real'] },
        { name:'AC Milan',           value:7,  aliases:['milan','ac milan','rossoneri'] },
        { name:'Liverpool',          value:6,  aliases:['liverpool','lfc','the reds'] },
        { name:'Bayern Munich',      value:6,  aliases:['bayern','bayern münchen','fc bayern'] },
        { name:'Barcelona',          value:5,  aliases:['barca','barça','fc barcelona'] },
        { name:'Ajax',               value:4,  aliases:['ajax amsterdam','afc ajax'] },
        { name:'Manchester United',  value:3,  aliases:['man utd','man united','manchester utd','united','mufc'] },
        { name:'Inter Milan',        value:3,  aliases:['inter','internazionale','inter milano'] },
        // Slot 9: Benfica (canonical) — first two-time winner
        { name:'Benfica',            value:2,  aliases:['benfica','sl benfica','as benfica'] },
        // Slot 10: 5 more clubs tied at 2 — accept any (Chelsea, Forest, Porto, Juventus, PSG)
        { name:'Chelsea',            value:2,  aliases:['chelsea','cfc','nottingham forest','forest','nottm forest','porto','fc porto','juventus','juve','old lady','psg','paris saint-germain','paris','paris sg','paris saint germain'] }
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
        { name:'Manchester United',  value:20, aliases:['man utd','man united','manchester utd','united','mufc'] },
        { name:'Liverpool',          value:20, aliases:['liverpool','lfc','the reds'] },
        { name:'Arsenal',            value:14, aliases:['arsenal','gunners','afc'] },
        { name:'Manchester City',    value:10, aliases:['man city','mcfc','city','citizens'] },
        { name:'Everton',            value:9,  aliases:['everton','toffees','efc'] },
        { name:'Aston Villa',        value:7,  aliases:['villa','aston villa','avfc'] },
        { name:'Sunderland',         value:6,  aliases:['sunderland','black cats','safc'] },
        { name:'Chelsea',            value:6,  aliases:['chelsea','cfc','blues'] },
        { name:'Newcastle United',   value:4,  aliases:['newcastle','toon','magpies','nufc'] },
        { name:'Sheffield Wednesday',value:4,  aliases:['sheff wed','sheffield wed','wednesday','owls'] }
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
      // Note: Messi and Mbappé may add to their totals in the 2026 WC — using pre-2026 figures
      players: [
        { name:'Miroslav Klose',    value:16, aliases:['klose'] },
        { name:'Ronaldo',           value:15, aliases:['ronaldo nazario','r9','ronaldo brazil'] },
        { name:'Gerd Müller',       value:14, aliases:['gerd muller','muller'] },
        { name:'Just Fontaine',     value:13, aliases:['fontaine'] },
        { name:'Lionel Messi',      value:13, aliases:['messi','leo messi'] },
        { name:'Pelé',              value:12, aliases:['pele','edson arantes'] },
        { name:'Kylian Mbappé',     value:12, aliases:['mbappe','kylian mbappe'] },
        { name:'Sándor Kocsis',     value:11, aliases:['kocsis','sandor kocsis'] },
        { name:'Jürgen Klinsmann',  value:11, aliases:['klinsmann','jurgen klinsmann'] },
        // 10th: multiple players tied at 10 — accept any of them
        { name:'Gary Lineker',      value:10, aliases:['lineker','gabriel batistuta','batistuta','teofilo cubillas','cubillas','helmut rahn','rahn','thomas muller','grzegorz lato','lato'] }
      ]
    },
    assists: {
      label: 'All-Time Top Assist Providers',
      unit: 'Assists',
      // Note: pre-1994 data is retroactively compiled — less reliable than goals list
      players: [
        { name:'Lionel Messi',            value:8, aliases:['messi','leo messi'] },
        { name:'Diego Maradona',          value:8, aliases:['maradona'] },
        { name:'Pierre Littbarski',       value:7, aliases:['littbarski'] },
        { name:'Grzegorz Lato',           value:7, aliases:['lato'] },
        { name:'David Beckham',           value:6, aliases:['beckham'] },
        { name:'Francesco Totti',         value:6, aliases:['totti'] },
        { name:'Pelé',                    value:6, aliases:['pele'] },
        { name:'Thomas Häßler',           value:6, aliases:['hässler','hassler','thomas hassler'] },
        { name:'Thomas Müller',           value:6, aliases:['muller','thomas muller'] },
        { name:'Bastian Schweinsteiger',  value:6, aliases:['schweinsteiger'] }
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
        // 10th: tied at 2 — Fiorentina & Lazio. Accept either.
        { name:'Fiorentina',     value:2,  aliases:['fiorentina','viola','acf fiorentina','lazio','ss lazio','biancocelesti'] }
      ]
    }
  }
};
