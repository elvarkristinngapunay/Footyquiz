// ─────────────────────────────────────────────────────────────────────────────
//  MONEYBALL TRANSFERS
//  Used by the Moneyball game — guess the transfer fee.
//  Data is organised by manager so future manager-based games can reuse it.
//  Fee is always in € millions.
//  Window: 'Summer' = roughly June–September, 'January' = Jan–Feb window.
// ─────────────────────────────────────────────────────────────────────────────

const MONEYBALL_MANAGERS = [
  {
    id: 'klopp',
    manager: 'Jürgen Klopp',
    transfers: [

      // ── Liverpool (2015 – 2024) ────────────────────────────────────────────
      { player:'Darwin Núñez',            pos:'Centre-Forward',    from:'Benfica',          fromLeague:'Liga Portugal', to:'Liverpool', window:'Summer',  year:2022, fee:85.00  },
      { player:'Virgil van Dijk',          pos:'Centre-Back',       from:'Southampton',      fromLeague:'Premier League',to:'Liverpool', window:'January', year:2018, fee:84.65  },
      { player:'Alisson',                  pos:'Goalkeeper',        from:'Roma',             fromLeague:'Serie A',       to:'Liverpool', window:'Summer',  year:2018, fee:72.50  },
      { player:'Dominik Szoboszlai',       pos:'Attacking Midfield',from:'RB Leipzig',       fromLeague:'Bundesliga',    to:'Liverpool', window:'Summer',  year:2023, fee:70.00  },
      { player:'Naby Keïta',               pos:'Central Midfield',  from:'RB Leipzig',       fromLeague:'Bundesliga',    to:'Liverpool', window:'Summer',  year:2018, fee:60.00  },
      { player:'Luis Díaz',                pos:'Left Winger',       from:'Porto',            fromLeague:'Liga Portugal', to:'Liverpool', window:'January', year:2022, fee:49.00  },
      { player:'Fabinho',                  pos:'Defensive Midfield',from:'Monaco',           fromLeague:'Ligue 1',       to:'Liverpool', window:'Summer',  year:2018, fee:45.00  },
      { player:'Diogo Jota',               pos:'Left Winger',       from:'Wolverhampton',    fromLeague:'Premier League',to:'Liverpool', window:'Summer',  year:2020, fee:44.70  },
      { player:'Mohamed Salah',            pos:'Right Winger',      from:'Roma',             fromLeague:'Serie A',       to:'Liverpool', window:'Summer',  year:2017, fee:42.00  },
      { player:'Cody Gakpo',               pos:'Left Winger',       from:'PSV',              fromLeague:'Eredivisie',    to:'Liverpool', window:'January', year:2023, fee:42.00  },
      { player:'Alexis Mac Allister',      pos:'Central Midfield',  from:'Brighton',         fromLeague:'Premier League',to:'Liverpool', window:'Summer',  year:2023, fee:42.00  },
      { player:'Sadio Mané',               pos:'Left Winger',       from:'Southampton',      fromLeague:'Premier League',to:'Liverpool', window:'Summer',  year:2016, fee:41.20  },
      { player:'Ibrahima Konaté',          pos:'Centre-Back',       from:'RB Leipzig',       fromLeague:'Bundesliga',    to:'Liverpool', window:'Summer',  year:2021, fee:40.00  },
      { player:'Ryan Gravenberch',         pos:'Defensive Midfield',from:'Bayern Munich',    fromLeague:'Bundesliga',    to:'Liverpool', window:'Summer',  year:2023, fee:40.00  },
      { player:'Alex Oxlade-Chamberlain',  pos:'Central Midfield',  from:'Arsenal',          fromLeague:'Premier League',to:'Liverpool', window:'Summer',  year:2017, fee:38.00  },
      { player:'Georginio Wijnaldum',      pos:'Central Midfield',  from:'Newcastle United', fromLeague:'Championship',  to:'Liverpool', window:'Summer',  year:2016, fee:27.50  },
      { player:'Thiago Alcántara',         pos:'Central Midfield',  from:'Bayern Munich',    fromLeague:'Bundesliga',    to:'Liverpool', window:'Summer',  year:2020, fee:22.00  },
      { player:'Wataru Endo',              pos:'Defensive Midfield',from:'Stuttgart',        fromLeague:'Bundesliga',    to:'Liverpool', window:'Summer',  year:2023, fee:20.00  },
      { player:'Xherdan Shaqiri',          pos:'Attacking Midfield',from:'Stoke City',       fromLeague:'Championship',  to:'Liverpool', window:'Summer',  year:2018, fee:14.70  },
      { player:'Konstantinos Tsimikas',    pos:'Left-Back',         from:'Olympiacos',       fromLeague:'Super League',  to:'Liverpool', window:'Summer',  year:2020, fee:13.00  },

      // ── Borussia Dortmund (2008 – 2015) ───────────────────────────────────
      { player:'Henrikh Mkhitaryan',       pos:'Central Midfield',  from:'Shakhtar Donetsk', fromLeague:'Premier Liga',  to:'Dortmund',  window:'Summer',  year:2013, fee:27.50  },
      { player:'Ciro Immobile',            pos:'Centre-Forward',    from:'Torino',           fromLeague:'Serie A',       to:'Dortmund',  window:'Summer',  year:2014, fee:18.50  },
      { player:'Marco Reus',               pos:'Attacking Midfield',from:'Mönchengladbach',  fromLeague:'Bundesliga',    to:'Dortmund',  window:'Summer',  year:2012, fee:17.10  },
      { player:'Pierre-Emerick Aubameyang',pos:'Centre-Forward',    from:'Saint-Étienne',    fromLeague:'Ligue 1',       to:'Dortmund',  window:'Summer',  year:2013, fee:13.00  },
      { player:'Kevin Kampl',              pos:'Central Midfield',  from:'Red Bull Salzburg', fromLeague:'Bundesliga',   to:'Dortmund',  window:'January', year:2015, fee:12.00  },
    ]
  }

  ,

  {
    id: 'ancelotti',
    manager: 'Carlo Ancelotti',
    transfers: [

      // ── Real Madrid ────────────────────────────────────────────────────────
      { player:'Jude Bellingham',       pos:'Attacking Midfield', from:'Borussia Dortmund', fromLeague:'Bundesliga',    to:'Real Madrid',    window:'Summer',  year:2023, fee:127.00 },
      { player:'Gareth Bale',           pos:'Right Winger',       from:'Tottenham',         fromLeague:'Premier League',to:'Real Madrid',    window:'Summer',  year:2013, fee:101.00 },
      { player:'Aurélien Tchouaméni',   pos:'Defensive Midfield', from:'Monaco',            fromLeague:'Ligue 1',       to:'Real Madrid',    window:'Summer',  year:2022, fee:80.00  },
      { player:'James Rodríguez',       pos:'Attacking Midfield', from:'Monaco',            fromLeague:'Ligue 1',       to:'Real Madrid',    window:'Summer',  year:2014, fee:75.00  },
      { player:'Endrick',               pos:'Centre-Forward',     from:'Palmeiras',         fromLeague:'Série A',       to:'Real Madrid',    window:'Summer',  year:2024, fee:47.50  },
      { player:'Asier Illarramendi',    pos:'Defensive Midfield', from:'Real Sociedad',     fromLeague:'LaLiga',        to:'Real Madrid',    window:'Summer',  year:2013, fee:32.00  },
      { player:'Eduardo Camavinga',     pos:'Central Midfield',   from:'Stade Rennais',     fromLeague:'Ligue 1',       to:'Real Madrid',    window:'Summer',  year:2021, fee:31.00  },
      { player:'Isco',                  pos:'Attacking Midfield', from:'Málaga',            fromLeague:'LaLiga',        to:'Real Madrid',    window:'Summer',  year:2013, fee:30.00  },
      { player:'Arda Güler',            pos:'Attacking Midfield', from:'Fenerbahçe',        fromLeague:'Süper Lig',     to:'Real Madrid',    window:'Summer',  year:2023, fee:28.00  },
      { player:'Toni Kroos',            pos:'Central Midfield',   from:'Bayern Munich',     fromLeague:'Bundesliga',    to:'Real Madrid',    window:'Summer',  year:2014, fee:25.00  },

      // ── Chelsea ────────────────────────────────────────────────────────────
      { player:'Fernando Torres',       pos:'Centre-Forward',     from:'Liverpool',         fromLeague:'Premier League',to:'Chelsea',        window:'January', year:2011, fee:58.50  },
      { player:'David Luiz',            pos:'Centre-Back',        from:'Benfica',           fromLeague:'Liga Portugal', to:'Chelsea',        window:'January', year:2011, fee:25.00  },

      // ── Napoli ─────────────────────────────────────────────────────────────
      { player:'Hirving Lozano',        pos:'Left Winger',        from:'PSV',               fromLeague:'Eredivisie',    to:'Napoli',         window:'Summer',  year:2019, fee:50.00  },
      { player:'Konstantinos Manolas',  pos:'Centre-Back',        from:'Roma',              fromLeague:'Serie A',       to:'Napoli',         window:'Summer',  year:2019, fee:36.00  },
      { player:'Fabián Ruiz',           pos:'Central Midfield',   from:'Real Betis',        fromLeague:'LaLiga',        to:'Napoli',         window:'Summer',  year:2018, fee:30.00  },
      { player:'Alex Meret',            pos:'Goalkeeper',         from:'Udinese',           fromLeague:'Serie A',       to:'Napoli',         window:'Summer',  year:2019, fee:26.00  },

      // ── PSG ────────────────────────────────────────────────────────────────
      { player:'Thiago Silva',          pos:'Centre-Back',        from:'AC Milan',          fromLeague:'Serie A',       to:'PSG',            window:'Summer',  year:2012, fee:42.00  },
      { player:'Lucas Moura',           pos:'Right Winger',       from:'São Paulo',         fromLeague:'Série A',       to:'PSG',            window:'January', year:2013, fee:40.00  },
      { player:'Ezequiel Lavezzi',      pos:'Second Striker',     from:'Napoli',            fromLeague:'Serie A',       to:'PSG',            window:'Summer',  year:2012, fee:30.00  },

      // ── Bayern Munich ──────────────────────────────────────────────────────
      { player:'Corentin Tolisso',      pos:'Central Midfield',   from:'Lyon',              fromLeague:'Ligue 1',       to:'Bayern Munich',  window:'Summer',  year:2017, fee:41.50  },
      { player:'Renato Sanches',        pos:'Central Midfield',   from:'Benfica',           fromLeague:'Liga Portugal', to:'Bayern Munich',  window:'Summer',  year:2016, fee:35.00  },
      { player:'Mats Hummels',          pos:'Centre-Back',        from:'Borussia Dortmund', fromLeague:'Bundesliga',    to:'Bayern Munich',  window:'Summer',  year:2016, fee:35.00  },

      // ── AC Milan ───────────────────────────────────────────────────────────
      { player:'Alessandro Nesta',      pos:'Centre-Back',        from:'Lazio',             fromLeague:'Serie A',       to:'AC Milan',       window:'Summer',  year:2002, fee:31.00  },
      { player:'Alberto Gilardino',     pos:'Centre-Forward',     from:'Parma',             fromLeague:'Serie A',       to:'AC Milan',       window:'Summer',  year:2005, fee:25.00  },

      // ── Everton ────────────────────────────────────────────────────────────
      { player:'Ben Godfrey',           pos:'Centre-Back',        from:'Norwich',           fromLeague:'Championship',  to:'Everton',        window:'Summer',  year:2020, fee:27.50  },
    ]
  }

  ,

  {
    id: 'guardiola',
    manager: 'Pep Guardiola',
    transfers: [

      // ── Manchester City (2016 – present) ──────────────────────────────────
      { player:'Jack Grealish',        pos:'Left Winger',        from:'Aston Villa',    fromLeague:'Premier League', to:'Man City', window:'Summer',  year:2021, fee:117.50 },
      { player:'Josko Gvardiol',       pos:'Centre-Back',        from:'RB Leipzig',     fromLeague:'Bundesliga',     to:'Man City', window:'Summer',  year:2023, fee:90.00  },
      { player:'Omar Marmoush',        pos:'Centre-Forward',     from:'Frankfurt',      fromLeague:'Bundesliga',     to:'Man City', window:'January', year:2025, fee:75.00  },
      { player:'Antoine Semenyo',      pos:'Right Winger',       from:'Bournemouth',    fromLeague:'Premier League', to:'Man City', window:'January', year:2026, fee:72.00  },
      { player:'Rúben Dias',           pos:'Centre-Back',        from:'Benfica',        fromLeague:'Liga Portugal',  to:'Man City', window:'Summer',  year:2020, fee:71.60  },
      { player:'Rodri',                pos:'Defensive Midfield', from:'Atlético Madrid',fromLeague:'LaLiga',         to:'Man City', window:'Summer',  year:2019, fee:70.00  },
      { player:'Riyad Mahrez',         pos:'Right Winger',       from:'Leicester City', fromLeague:'Premier League', to:'Man City', window:'Summer',  year:2018, fee:67.80  },
      { player:'Aymeric Laporte',      pos:'Centre-Back',        from:'Athletic Club',  fromLeague:'LaLiga',         to:'Man City', window:'January', year:2018, fee:65.00  },
      { player:'João Cancelo',         pos:'Right-Back',         from:'Juventus',       fromLeague:'Serie A',        to:'Man City', window:'Summer',  year:2019, fee:65.00  },
      { player:'Matheus Nunes',        pos:'Defensive Midfield', from:'Wolverhampton',  fromLeague:'Premier League', to:'Man City', window:'Summer',  year:2023, fee:62.00  },
      { player:'Erling Haaland',       pos:'Centre-Forward',     from:'Borussia Dortmund',fromLeague:'Bundesliga',   to:'Man City', window:'Summer',  year:2022, fee:60.00  },
      { player:'Jérémy Doku',          pos:'Left Winger',        from:'Stade Rennais',  fromLeague:'Ligue 1',        to:'Man City', window:'Summer',  year:2023, fee:60.00  },
      { player:'Nico González',        pos:'Defensive Midfield', from:'Porto',          fromLeague:'Liga Portugal',  to:'Man City', window:'January', year:2025, fee:60.00  },
      { player:'Benjamin Mendy',       pos:'Left-Back',          from:'Monaco',         fromLeague:'Ligue 1',        to:'Man City', window:'Summer',  year:2017, fee:57.50  },
      { player:'John Stones',          pos:'Centre-Back',        from:'Everton',        fromLeague:'Premier League', to:'Man City', window:'Summer',  year:2016, fee:55.60  },
      { player:'Tijjani Reijnders',    pos:'Central Midfield',   from:'AC Milan',       fromLeague:'Serie A',        to:'Man City', window:'Summer',  year:2025, fee:54.90  },
      { player:'Kyle Walker',          pos:'Right-Back',         from:'Tottenham',      fromLeague:'Premier League', to:'Man City', window:'Summer',  year:2017, fee:52.70  },
      { player:'Leroy Sané',           pos:'Right Winger',       from:'FC Schalke 04',  fromLeague:'Bundesliga',     to:'Man City', window:'Summer',  year:2016, fee:52.00  },
      { player:'Bernardo Silva',       pos:'Attacking Midfield', from:'Monaco',         fromLeague:'Ligue 1',        to:'Man City', window:'Summer',  year:2017, fee:50.00  },
      { player:'Kalvin Phillips',      pos:'Defensive Midfield', from:'Leeds United',   fromLeague:'Premier League', to:'Man City', window:'Summer',  year:2022, fee:49.00  },
      { player:'Nathan Aké',           pos:'Centre-Back',        from:'Bournemouth',    fromLeague:'Championship',   to:'Man City', window:'Summer',  year:2020, fee:45.30  },
      { player:'Ederson',              pos:'Goalkeeper',         from:'Benfica',        fromLeague:'Liga Portugal',  to:'Man City', window:'Summer',  year:2017, fee:40.00  },
      { player:'Abdukodir Khusanov',   pos:'Centre-Back',        from:'Lens',           fromLeague:'Ligue 1',        to:'Man City', window:'January', year:2025, fee:40.00  },
      { player:'Vitor Reis',           pos:'Centre-Back',        from:'Palmeiras',      fromLeague:'Série A',        to:'Man City', window:'January', year:2025, fee:37.00  },
      { player:'Rayan Aït-Nouri',      pos:'Left-Back',          from:'Wolverhampton',  fromLeague:'Premier League', to:'Man City', window:'Summer',  year:2025, fee:36.80  },
    ]
  }

  ,

  {
    id: 'arteta',
    manager: 'Mikel Arteta',
    transfers: [

      // ── Arsenal (2019 – present) ───────────────────────────────────────────
      { player:'Declan Rice',           pos:'Central Midfield',   from:'West Ham',       fromLeague:'Premier League', to:'Arsenal', window:'Summer',  year:2023, fee:116.60 },
      { player:'Kai Havertz',           pos:'Centre-Forward',     from:'Chelsea',        fromLeague:'Premier League', to:'Arsenal', window:'Summer',  year:2023, fee:75.00  },
      { player:'Martín Zubimendi',      pos:'Defensive Midfield', from:'Real Sociedad',  fromLeague:'LaLiga',         to:'Arsenal', window:'Summer',  year:2025, fee:70.00  },
      { player:'Eberechi Eze',          pos:'Attacking Midfield', from:'Crystal Palace', fromLeague:'Premier League', to:'Arsenal', window:'Summer',  year:2025, fee:69.30  },
      { player:'Viktor Gyökeres',       pos:'Centre-Forward',     from:'Sporting CP',    fromLeague:'Liga Portugal',  to:'Arsenal', window:'Summer',  year:2025, fee:66.90  },
      { player:'Ben White',             pos:'Right-Back',         from:'Brighton',       fromLeague:'Premier League', to:'Arsenal', window:'Summer',  year:2021, fee:58.50  },
      { player:'Noni Madueke',          pos:'Right Winger',       from:'Chelsea',        fromLeague:'Premier League', to:'Arsenal', window:'Summer',  year:2025, fee:56.00  },
      { player:'Gabriel Jesus',         pos:'Centre-Forward',     from:'Manchester City',fromLeague:'Premier League', to:'Arsenal', window:'Summer',  year:2022, fee:52.20  },
      { player:'Thomas Partey',         pos:'Defensive Midfield', from:'Atlético Madrid',fromLeague:'LaLiga',         to:'Arsenal', window:'Summer',  year:2020, fee:50.00  },
      { player:'Riccardo Calafiori',    pos:'Left-Back',          from:'Bologna',        fromLeague:'Serie A',        to:'Arsenal', window:'Summer',  year:2024, fee:43.70  },
      { player:'Jurriën Timber',        pos:'Right-Back',         from:'Ajax',           fromLeague:'Eredivisie',     to:'Arsenal', window:'Summer',  year:2023, fee:40.00  },
      { player:'Martin Ødegaard',       pos:'Attacking Midfield', from:'Real Madrid',    fromLeague:'LaLiga',         to:'Arsenal', window:'Summer',  year:2021, fee:35.00  },
      { player:'Fábio Vieira',          pos:'Attacking Midfield', from:'Porto',          fromLeague:'Liga Portugal',  to:'Arsenal', window:'Summer',  year:2022, fee:35.00  },
      { player:'Oleksandr Zinchenko',   pos:'Left-Back',          from:'Manchester City',fromLeague:'Premier League', to:'Arsenal', window:'Summer',  year:2022, fee:35.00  },
      { player:'Mikel Merino',          pos:'Central Midfield',   from:'Real Sociedad',  fromLeague:'LaLiga',         to:'Arsenal', window:'Summer',  year:2024, fee:32.00  },
      { player:'David Raya',            pos:'Goalkeeper',         from:'Brentford',      fromLeague:'Premier League', to:'Arsenal', window:'Summer',  year:2024, fee:31.90  },
      { player:'Aaron Ramsdale',        pos:'Goalkeeper',         from:'Sheffield Utd',  fromLeague:'Championship',   to:'Arsenal', window:'Summer',  year:2021, fee:28.00  },
      { player:'Gabriel',               pos:'Centre-Back',        from:'Lille',          fromLeague:'Ligue 1',        to:'Arsenal', window:'Summer',  year:2020, fee:26.00  },
      { player:'Leandro Trossard',      pos:'Left Winger',        from:'Brighton',       fromLeague:'Premier League', to:'Arsenal', window:'January', year:2023, fee:24.00  },
      { player:'Jakub Kiwior',          pos:'Centre-Back',        from:'Spezia',         fromLeague:'Serie A',        to:'Arsenal', window:'January', year:2023, fee:19.50  },
      { player:'Takehiro Tomiyasu',     pos:'Right-Back',         from:'Bologna',        fromLeague:'Serie A',        to:'Arsenal', window:'Summer',  year:2021, fee:18.60  },
      { player:'Albert Sambi Lokonga',  pos:'Central Midfield',   from:'Anderlecht',     fromLeague:'JPL',            to:'Arsenal', window:'Summer',  year:2021, fee:17.50  },
      { player:'Cristhian Mosquera',    pos:'Centre-Back',        from:'Valencia',       fromLeague:'LaLiga',         to:'Arsenal', window:'Summer',  year:2025, fee:15.00  },
      { player:'Christian Nørgaard',    pos:'Defensive Midfield', from:'Brentford',      fromLeague:'Premier League', to:'Arsenal', window:'Summer',  year:2025, fee:11.60  },
      { player:'Jorginho',              pos:'Defensive Midfield', from:'Chelsea',        fromLeague:'Premier League', to:'Arsenal', window:'January', year:2023, fee:11.30  },
    ]
  }

  ,

  {
    id: 'mourinho',
    manager: 'José Mourinho',
    transfers: [

      // ── Manchester United (2016 – 2018) ───────────────────────────────────
      { player:'Paul Pogba',             pos:'Central Midfield',  from:'Juventus',       fromLeague:'Serie A',        to:'Man Utd',     window:'Summer',  year:2016, fee:105.00 },
      { player:'Romelu Lukaku',          pos:'Centre-Forward',    from:'Everton',        fromLeague:'Premier League', to:'Man Utd',     window:'Summer',  year:2017, fee:84.70  },
      { player:'Fred',                   pos:'Central Midfield',  from:'Shakhtar Donetsk',fromLeague:'Premier Liga',  to:'Man Utd',     window:'Summer',  year:2018, fee:59.00  },
      { player:'Nemanja Matić',          pos:'Defensive Midfield',from:'Chelsea',        fromLeague:'Premier League', to:'Man Utd',     window:'Summer',  year:2017, fee:44.70  },
      { player:'Henrikh Mkhitaryan',     pos:'Central Midfield',  from:'Borussia Dortmund',fromLeague:'Bundesliga',   to:'Man Utd',     window:'Summer',  year:2016, fee:42.00  },
      { player:'Eric Bailly',            pos:'Centre-Back',       from:'Villarreal',     fromLeague:'LaLiga',         to:'Man Utd',     window:'Summer',  year:2016, fee:38.00  },
      { player:'Victor Lindelöf',        pos:'Centre-Back',       from:'Benfica',        fromLeague:'Liga Portugal',  to:'Man Utd',     window:'Summer',  year:2017, fee:35.00  },
      { player:'Alexis Sánchez',         pos:'Second Striker',    from:'Arsenal',        fromLeague:'Premier League', to:'Man Utd',     window:'January', year:2018, fee:34.00  },

      // ── Chelsea (2004 – 2007, 2013 – 2015) ────────────────────────────────
      { player:'Andriy Shevchenko',      pos:'Centre-Forward',    from:'AC Milan',       fromLeague:'Serie A',        to:'Chelsea',     window:'Summer',  year:2006, fee:43.88  },
      { player:'Didier Drogba',          pos:'Centre-Forward',    from:'Marseille',      fromLeague:'Ligue 1',        to:'Chelsea',     window:'Summer',  year:2004, fee:38.50  },
      { player:'Michael Essien',         pos:'Defensive Midfield',from:'Lyon',           fromLeague:'Ligue 1',        to:'Chelsea',     window:'Summer',  year:2005, fee:38.00  },
      { player:'Diego Costa',            pos:'Centre-Forward',    from:'Atlético Madrid',fromLeague:'LaLiga',         to:'Chelsea',     window:'Summer',  year:2014, fee:38.00  },
      { player:'Willian',                pos:'Left Winger',       from:'Anzhi',          fromLeague:'Premier Liga',   to:'Chelsea',     window:'Summer',  year:2013, fee:35.50  },
      { player:'Cesc Fàbregas',          pos:'Central Midfield',  from:'Barcelona',      fromLeague:'LaLiga',         to:'Chelsea',     window:'Summer',  year:2014, fee:33.00  },
      { player:'Shaun Wright-Phillips',  pos:'Right Winger',      from:'Manchester City',fromLeague:'Premier League', to:'Chelsea',     window:'Summer',  year:2005, fee:31.50  },
      { player:'Juan Cuadrado',          pos:'Right Midfield',    from:'Fiorentina',     fromLeague:'Serie A',        to:'Chelsea',     window:'January', year:2015, fee:31.00  },
      { player:'Ricardo Carvalho',       pos:'Centre-Back',       from:'Porto',          fromLeague:'Liga Portugal',  to:'Chelsea',     window:'Summer',  year:2004, fee:30.00  },

      // ── Real Madrid (2010 – 2013) ──────────────────────────────────────────
      { player:'Luka Modrić',            pos:'Central Midfield',  from:'Tottenham',      fromLeague:'Premier League', to:'Real Madrid', window:'Summer',  year:2012, fee:35.00  },
      { player:'Ángel Di María',         pos:'Right Winger',      from:'Benfica',        fromLeague:'Liga Portugal',  to:'Real Madrid', window:'Summer',  year:2010, fee:33.00  },
      { player:'Fábio Coentrão',         pos:'Left-Back',         from:'Benfica',        fromLeague:'Liga Portugal',  to:'Real Madrid', window:'Summer',  year:2011, fee:30.00  },

      // ── Tottenham (2019 – 2021) ────────────────────────────────────────────
      { player:'Giovani Lo Celso',       pos:'Attacking Midfield',from:'Real Betis',     fromLeague:'LaLiga',         to:'Tottenham',   window:'Summer',  year:2020, fee:32.00  },
      { player:'Steven Bergwijn',        pos:'Left Winger',       from:'PSV',            fromLeague:'Eredivisie',     to:'Tottenham',   window:'January', year:2020, fee:30.00  },
      { player:'Sergio Reguilón',        pos:'Left-Back',         from:'Real Madrid',    fromLeague:'LaLiga',         to:'Tottenham',   window:'Summer',  year:2020, fee:30.00  },

      // ── AS Roma (2021 – 2023) ──────────────────────────────────────────────
      { player:'Tammy Abraham',          pos:'Centre-Forward',    from:'Chelsea',        fromLeague:'Premier League', to:'Roma',        window:'Summer',  year:2021, fee:41.00  },

      // ── Inter Milan (2008 – 2010) ──────────────────────────────────────────
      { player:'Diego Milito',           pos:'Centre-Forward',    from:'Genoa',          fromLeague:'Serie A',        to:'Inter Milan', window:'Summer',  year:2009, fee:28.00  },
    ]
  }

  ,

  {
    id: 'pochettino',
    manager: 'Mauricio Pochettino',
    transfers: [

      // ── Chelsea (2023 – 2024) ──────────────────────────────────────────────
      { player:'Moisés Caicedo',       pos:'Defensive Midfield', from:'Brighton',       fromLeague:'Premier League', to:'Chelsea',     window:'Summer',  year:2023, fee:116.00 },
      { player:'Roméo Lavia',          pos:'Defensive Midfield', from:'Southampton',    fromLeague:'Championship',   to:'Chelsea',     window:'Summer',  year:2023, fee:62.10  },
      { player:'Christopher Nkunku',   pos:'Centre-Forward',     from:'RB Leipzig',     fromLeague:'Bundesliga',     to:'Chelsea',     window:'Summer',  year:2023, fee:60.00  },
      { player:'Cole Palmer',          pos:'Attacking Midfield', from:'Manchester City',fromLeague:'Premier League', to:'Chelsea',     window:'Summer',  year:2023, fee:47.00  },
      { player:'Axel Disasi',          pos:'Centre-Back',        from:'Monaco',         fromLeague:'Ligue 1',        to:'Chelsea',     window:'Summer',  year:2023, fee:45.00  },
      { player:'Nicolas Jackson',      pos:'Centre-Forward',     from:'Villarreal',     fromLeague:'LaLiga',         to:'Chelsea',     window:'Summer',  year:2023, fee:37.00  },
      { player:'Lesley Ugochukwu',     pos:'Defensive Midfield', from:'Stade Rennais',  fromLeague:'Ligue 1',        to:'Chelsea',     window:'Summer',  year:2023, fee:27.00  },
      { player:'Robert Sánchez',       pos:'Goalkeeper',         from:'Brighton',       fromLeague:'Premier League', to:'Chelsea',     window:'Summer',  year:2023, fee:23.00  },
      { player:'Djordje Petrovic',     pos:'Goalkeeper',         from:'New England',    fromLeague:'MLS',            to:'Chelsea',     window:'Summer',  year:2023, fee:16.00  },

      // ── PSG (2021 – 2023) ──────────────────────────────────────────────────
      { player:'Achraf Hakimi',        pos:'Right-Back',         from:'Inter Milan',    fromLeague:'Serie A',        to:'PSG',         window:'Summer',  year:2021, fee:68.00  },
      { player:'Vitinha',              pos:'Defensive Midfield', from:'Porto',          fromLeague:'Liga Portugal',  to:'PSG',         window:'Summer',  year:2022, fee:41.50  },
      { player:'Nuno Mendes',          pos:'Left-Back',          from:'Sporting CP',    fromLeague:'Liga Portugal',  to:'PSG',         window:'Summer',  year:2022, fee:38.00  },
      { player:'Danilo Pereira',       pos:'Centre-Back',        from:'Porto',          fromLeague:'Liga Portugal',  to:'PSG',         window:'Summer',  year:2021, fee:16.00  },

      // ── Tottenham (2014 – 2019) ────────────────────────────────────────────
      { player:'Tanguy Ndombélé',      pos:'Central Midfield',   from:'Lyon',           fromLeague:'Ligue 1',        to:'Tottenham',   window:'Summer',  year:2019, fee:62.00  },
      { player:'Davinson Sánchez',     pos:'Centre-Back',        from:'Ajax',           fromLeague:'Eredivisie',     to:'Tottenham',   window:'Summer',  year:2017, fee:42.00  },
      { player:'Moussa Sissoko',       pos:'Central Midfield',   from:'Newcastle',      fromLeague:'Championship',   to:'Tottenham',   window:'Summer',  year:2016, fee:35.00  },
      { player:'Heung-min Son',        pos:'Left Winger',        from:'Bayer Leverkusen',fromLeague:'Bundesliga',    to:'Tottenham',   window:'Summer',  year:2015, fee:30.00  },
      { player:'Lucas Moura',          pos:'Right Winger',       from:'PSG',            fromLeague:'Ligue 1',        to:'Tottenham',   window:'January', year:2018, fee:28.40  },
      { player:'Ryan Sessegnon',       pos:'Left-Back',          from:'Fulham',         fromLeague:'Championship',   to:'Tottenham',   window:'Summer',  year:2019, fee:27.00  },
      { player:'Serge Aurier',         pos:'Right-Back',         from:'PSG',            fromLeague:'Ligue 1',        to:'Tottenham',   window:'Summer',  year:2017, fee:25.00  },
      { player:'Vincent Janssen',      pos:'Centre-Forward',     from:'AZ Alkmaar',     fromLeague:'Eredivisie',     to:'Tottenham',   window:'Summer',  year:2016, fee:22.00  },
      { player:'Toby Alderweireld',    pos:'Centre-Back',        from:'Atlético Madrid',fromLeague:'LaLiga',         to:'Tottenham',   window:'Summer',  year:2015, fee:16.00  },
      { player:'Giovani Lo Celso',     pos:'Attacking Midfield', from:'Real Betis',     fromLeague:'LaLiga',         to:'Tottenham',   window:'Summer',  year:2019, fee:16.00  },
      { player:'Fernando Llorente',    pos:'Centre-Forward',     from:'Swansea',        fromLeague:'Premier League', to:'Tottenham',   window:'Summer',  year:2017, fee:15.10  },

      // ── Southampton (2013 – 2014) ──────────────────────────────────────────
      { player:'Daniel Osvaldo',       pos:'Centre-Forward',     from:'Roma',           fromLeague:'Serie A',        to:'Southampton', window:'Summer',  year:2013, fee:15.10  },
    ]
  }

  ,

  {
    id: 'conte',
    manager: 'Antonio Conte',
    transfers: [

      // ── Inter Milan (2019 – 2021) ──────────────────────────────────────────
      { player:'Romelu Lukaku',          pos:'Centre-Forward',    from:'Manchester Utd', fromLeague:'Premier League', to:'Inter Milan',  window:'Summer',  year:2019, fee:74.00  },
      { player:'Achraf Hakimi',          pos:'Right-Back',        from:'Real Madrid',    fromLeague:'LaLiga',         to:'Inter Milan',  window:'Summer',  year:2020, fee:43.00  },
      { player:'Nicolò Barella',         pos:'Central Midfield',  from:'Cagliari',       fromLeague:'Serie A',        to:'Inter Milan',  window:'Summer',  year:2020, fee:32.50  },
      { player:'Christian Eriksen',      pos:'Attacking Midfield',from:'Tottenham',      fromLeague:'Premier League', to:'Inter Milan',  window:'January', year:2020, fee:27.00  },
      { player:'Stefano Sensi',          pos:'Central Midfield',  from:'Sassuolo',       fromLeague:'Serie A',        to:'Inter Milan',  window:'Summer',  year:2020, fee:25.00  },
      { player:'Valentino Lazaro',       pos:'Right Midfield',    from:'Hertha BSC',     fromLeague:'Bundesliga',     to:'Inter Milan',  window:'Summer',  year:2019, fee:22.40  },

      // ── Chelsea (2016 – 2018) ──────────────────────────────────────────────
      { player:'Álvaro Morata',          pos:'Centre-Forward',    from:'Real Madrid',    fromLeague:'LaLiga',         to:'Chelsea',      window:'Summer',  year:2017, fee:66.00  },
      { player:'Tiémoué Bakayoko',       pos:'Defensive Midfield',from:'Monaco',         fromLeague:'Ligue 1',        to:'Chelsea',      window:'Summer',  year:2017, fee:40.00  },
      { player:'Michy Batshuayi',        pos:'Centre-Forward',    from:'Marseille',      fromLeague:'Ligue 1',        to:'Chelsea',      window:'Summer',  year:2016, fee:39.00  },
      { player:'Danny Drinkwater',       pos:'Central Midfield',  from:'Leicester City', fromLeague:'Premier League', to:'Chelsea',      window:'Summer',  year:2017, fee:37.90  },
      { player:'N\'Golo Kanté',          pos:'Defensive Midfield',from:'Leicester City', fromLeague:'Premier League', to:'Chelsea',      window:'Summer',  year:2016, fee:35.80  },
      { player:'David Luiz',             pos:'Centre-Back',       from:'PSG',            fromLeague:'Ligue 1',        to:'Chelsea',      window:'Summer',  year:2016, fee:35.00  },
      { player:'Antonio Rüdiger',        pos:'Centre-Back',       from:'Roma',           fromLeague:'Serie A',        to:'Chelsea',      window:'Summer',  year:2017, fee:35.00  },
      { player:'Davide Zappacosta',      pos:'Right Midfield',    from:'Torino',         fromLeague:'Serie A',        to:'Chelsea',      window:'Summer',  year:2017, fee:25.00  },
      { player:'Marcos Alonso',          pos:'Centre-Back',       from:'Fiorentina',     fromLeague:'Serie A',        to:'Chelsea',      window:'Summer',  year:2016, fee:23.00  },

      // ── Tottenham (2021 – 2023) ────────────────────────────────────────────
      { player:'Richarlison',            pos:'Centre-Forward',    from:'Everton',        fromLeague:'Premier League', to:'Tottenham',    window:'Summer',  year:2022, fee:58.00  },
      { player:'Cristian Romero',        pos:'Centre-Back',       from:'Atalanta',       fromLeague:'Serie A',        to:'Tottenham',    window:'Summer',  year:2022, fee:53.80  },
      { player:'Yves Bissouma',          pos:'Defensive Midfield',from:'Brighton',       fromLeague:'Premier League', to:'Tottenham',    window:'Summer',  year:2022, fee:29.20  },

      // ── Napoli (2023 – present) ────────────────────────────────────────────
      { player:'Alessandro Buongiorno', pos:'Centre-Back',        from:'Torino',         fromLeague:'Serie A',        to:'Napoli',       window:'Summer',  year:2024, fee:36.50  },
      { player:'Sam Beukema',           pos:'Centre-Back',        from:'Bologna',        fromLeague:'Serie A',        to:'Napoli',       window:'Summer',  year:2025, fee:31.00  },
      { player:'Romelu Lukaku',         pos:'Centre-Forward',     from:'Chelsea',        fromLeague:'Premier League', to:'Napoli',       window:'Summer',  year:2024, fee:30.70  },
      { player:'Scott McTominay',       pos:'Central Midfield',   from:'Manchester Utd', fromLeague:'Premier League', to:'Napoli',       window:'Summer',  year:2024, fee:30.50  },
      { player:'David Neres',           pos:'Right Winger',       from:'Benfica',        fromLeague:'Liga Portugal',  to:'Napoli',       window:'Summer',  year:2024, fee:28.00  },
      { player:'Lorenzo Lucca',         pos:'Centre-Forward',     from:'Udinese',        fromLeague:'Serie A',        to:'Napoli',       window:'January', year:2026, fee:26.00  },
      { player:'Noa Lang',              pos:'Left Winger',        from:'PSV',            fromLeague:'Eredivisie',     to:'Napoli',       window:'Summer',  year:2025, fee:25.00  },
    ]
  }

  ,

  {
    id: 'luisenrique',
    manager: 'Luis Enrique',
    transfers: [

      // ── PSG (2023 – present) ───────────────────────────────────────────────
      { player:'Randal Kolo Muani',     pos:'Centre-Forward',    from:'Frankfurt',      fromLeague:'Bundesliga',     to:'PSG',        window:'Summer',  year:2023, fee:95.00  },
      { player:'Khvicha Kvaratskhelia', pos:'Left Winger',       from:'Napoli',         fromLeague:'Serie A',        to:'PSG',        window:'January', year:2025, fee:80.00  },
      { player:'João Neves',            pos:'Central Midfield',  from:'Benfica',        fromLeague:'Liga Portugal',  to:'PSG',        window:'Summer',  year:2024, fee:65.92  },
      { player:'Gonçalo Ramos',         pos:'Centre-Forward',    from:'Benfica',        fromLeague:'Liga Portugal',  to:'PSG',        window:'January', year:2024, fee:65.00  },
      { player:'Ilya Zabarnyi',         pos:'Centre-Back',       from:'Bournemouth',    fromLeague:'Premier League', to:'PSG',        window:'Summer',  year:2025, fee:63.00  },
      { player:'Manuel Ugarte',         pos:'Defensive Midfield',from:'Sporting CP',    fromLeague:'Liga Portugal',  to:'PSG',        window:'Summer',  year:2023, fee:60.00  },
      { player:'Ousmane Dembélé',       pos:'Centre-Forward',    from:'Barcelona',      fromLeague:'LaLiga',         to:'PSG',        window:'Summer',  year:2023, fee:50.00  },
      { player:'Désiré Doué',           pos:'Right Winger',      from:'Stade Rennais',  fromLeague:'Ligue 1',        to:'PSG',        window:'Summer',  year:2024, fee:50.00  },
      { player:'Lucas Hernández',       pos:'Left-Back',         from:'Bayern Munich',  fromLeague:'Bundesliga',     to:'PSG',        window:'Summer',  year:2023, fee:45.00  },
      { player:'Bradley Barcola',       pos:'Left Winger',       from:'Lyon',           fromLeague:'Ligue 1',        to:'PSG',        window:'Summer',  year:2023, fee:45.00  },
      { player:'Willian Pacho',         pos:'Centre-Back',       from:'Frankfurt',      fromLeague:'Bundesliga',     to:'PSG',        window:'Summer',  year:2024, fee:40.00  },
      { player:'Lucas Chevalier',       pos:'Goalkeeper',        from:'Lille',          fromLeague:'Ligue 1',        to:'PSG',        window:'Summer',  year:2025, fee:40.00  },
      { player:'Kang-in Lee',           pos:'Attacking Midfield',from:'RCD Mallorca',   fromLeague:'LaLiga',         to:'PSG',        window:'Summer',  year:2023, fee:22.00  },
      { player:'Lucas Beraldo',         pos:'Centre-Back',       from:'São Paulo',      fromLeague:'Série A',        to:'PSG',        window:'January', year:2024, fee:20.00  },
      { player:'Gabriel Moscardo',      pos:'Defensive Midfield',from:'Corinthians',    fromLeague:'Série A',        to:'PSG',        window:'January', year:2024, fee:20.00  },
      { player:'Matvey Safonov',        pos:'Goalkeeper',        from:'Krasnodar',      fromLeague:'Premier Liga',   to:'PSG',        window:'Summer',  year:2024, fee:20.00  },

      // ── Barcelona (2014 – 2017) ────────────────────────────────────────────
      { player:'Luis Suárez',           pos:'Centre-Forward',    from:'Liverpool',      fromLeague:'Premier League', to:'Barcelona',  window:'Summer',  year:2014, fee:81.72  },
      { player:'André Gomes',           pos:'Central Midfield',  from:'Valencia',       fromLeague:'LaLiga',         to:'Barcelona',  window:'Summer',  year:2016, fee:37.00  },
      { player:'Arda Turan',            pos:'Left Winger',       from:'Atlético Madrid',fromLeague:'LaLiga',         to:'Barcelona',  window:'Summer',  year:2015, fee:34.00  },
      { player:'Paco Alcácer',          pos:'Centre-Forward',    from:'Valencia',       fromLeague:'LaLiga',         to:'Barcelona',  window:'Summer',  year:2016, fee:30.00  },
      { player:'Samuel Umtiti',         pos:'Centre-Back',       from:'Lyon',           fromLeague:'Ligue 1',        to:'Barcelona',  window:'Summer',  year:2016, fee:25.00  },
      { player:'Jérémy Mathieu',        pos:'Left-Back',         from:'Valencia',       fromLeague:'LaLiga',         to:'Barcelona',  window:'Summer',  year:2014, fee:20.00  },
      { player:'Thomas Vermaelen',      pos:'Centre-Back',       from:'Arsenal',        fromLeague:'Premier League', to:'Barcelona',  window:'Summer',  year:2014, fee:19.00  },
      { player:'Ivan Rakitic',          pos:'Central Midfield',  from:'Sevilla',        fromLeague:'LaLiga',         to:'Barcelona',  window:'Summer',  year:2014, fee:18.00  },

      // ── Roma (2011 – 2012) ─────────────────────────────────────────────────
      { player:'Erik Lamela',           pos:'Right Winger',      from:'River Plate',    fromLeague:'Prim. B Nacional',to:'Roma',      window:'Summer',  year:2011, fee:17.00  },
    ]
  }

  // ── Future managers go here, same structure ──────────────────────────────
  // { id:'ferguson', manager:'Sir Alex Ferguson', transfers:[ ... ] },
];
