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

  // ── Future managers go here, same structure ──────────────────────────────
  // { id:'guardiola', manager:'Pep Guardiola', transfers:[ ... ] },
  // { id:'mourinho',  manager:'José Mourinho',  transfers:[ ... ] },
];
