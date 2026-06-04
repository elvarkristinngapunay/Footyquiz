// Top 10 quiz data — verified June 2026
// Sources: premierleague.com, Opta Analyst, Wikipedia, La Liga official, FIFA
const TOP10_DATA = {
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
  }
};
