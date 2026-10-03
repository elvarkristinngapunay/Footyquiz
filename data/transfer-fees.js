// ─────────────────────────────────────────────────────────────────────────────
//  BIG TRANSFERS — single source of truth for every €100m+ deal.
//  Read by: the "€100M Club" quiz (eg-datasets.js) and the Top 10 "Transfers" +
//  Premier League "Signings" lists (top10.js). Change a fee HERE and all stay in sync.
//
//  fee  = headline total in € millions INCLUDING add-ons announced with the deal.
//         £ deals converted at the rate on the day (≈1.15–1.18), rounded to the nearest €1m.
//  Sources: club statements, Sky Sports, ESPN, Goal, Wikipedia "List of most expensive
//  association football transfers". Reported figures differ by a few €m between outlets
//  (FX + how add-ons are counted) — the notes flag the least certain ones.
//  Verified Oct 2026.
// ─────────────────────────────────────────────────────────────────────────────
const BIG_TRANSFERS = [
  { key:'neymar-2017',    name:'Neymar',            aliases:['neymar jr','neymar da silva','ney','neymar junior'],        from:'Barcelona',       to:'PSG',             year:2017, fee:222 },
  { key:'mbappe-2018',    name:'Kylian Mbappé',     aliases:['mbappe','kylian mbappe','km7','mbappé'],                    from:'Monaco',          to:'PSG',             year:2018, fee:180 },
  { key:'coutinho-2018',  name:'Philippe Coutinho', aliases:['coutinho','phil coutinho','philippe'],                      from:'Liverpool',       to:'Barcelona',       year:2018, fee:160, note:'£105m up front + ~£37m add-ons (club: €120m + €40m)' },
  { key:'dembele-2017',   name:'Ousmane Dembélé',   aliases:['dembele','dembélé','ousmane dembele','ousmane'],            from:'Dortmund',        to:'Barcelona',       year:2017, fee:145, note:'€105m + €40m add-ons (later reports of ~€148m paid)' },
  { key:'isak-2025',      name:'Alexander Isak',    aliases:['isak','alex isak','a isak'],                                from:'Newcastle',       to:'Liverpool',       year:2025, fee:145, note:'£125m, British record' },
  { key:'enzo-2026',      name:'Enzo Fernández',    aliases:['enzo fernandez','enzo','fernandez','enzo man city','enzo city'], from:'Chelsea',    to:'Man City',        year:2026, fee:145, note:'£125m, equalled the British record' },
  { key:'barcola-2026',   name:'Bradley Barcola',   aliases:['barcola','bradley','bradley barcola'],                      from:'PSG',             to:'Liverpool',       year:2026, fee:144, note:'£106m + £17m add-ons' },
  { key:'diomande-2026',  name:'Yan Diomandé',      aliases:['diomande','yan diomande','yan','diomandé'],                 from:'RB Leipzig',      to:'Real Madrid',     year:2026, fee:140, note:'Reported €140m including bonuses' },
  { key:'rogers-2026',    name:'Morgan Rogers',     aliases:['rogers','morgan','morgan rogers'],                          from:'Aston Villa',     to:'Chelsea',         year:2026, fee:137, note:'£117m, most expensive British player' },
  { key:'wirtz-2025',     name:'Florian Wirtz',     aliases:['wirtz','florian','florian wirtz'],                          from:'Leverkusen',      to:'Liverpool',       year:2025, fee:136, note:'£100m + £16m add-ons' },
  { key:'anderson-2026',  name:'Elliot Anderson',   aliases:['anderson','elliot','elliot anderson'],                      from:'Nottingham Forest', to:'Man City',      year:2026, fee:135.5, note:'£116m' },
  { key:'caicedo-2023',   name:'Moisés Caicedo',    aliases:['caicedo','moises caicedo','moises','moisés caicedo'],       from:'Brighton',        to:'Chelsea',         year:2023, fee:134, note:'£100m + £15m add-ons' },
  { key:'bellingham-2023',name:'Jude Bellingham',   aliases:['bellingham','jude','jude bellingham'],                      from:'Dortmund',        to:'Real Madrid',     year:2023, fee:133, note:'€103m + ~€30m add-ons' },
  { key:'felix-2019',     name:'João Félix',        aliases:['joao felix','felix','joão félix','joao'],                   from:'Benfica',         to:'Atlético Madrid', year:2019, fee:126 },
  { key:'rice-2023',      name:'Declan Rice',       aliases:['rice','declan rice','decs'],                                from:'West Ham',        to:'Arsenal',         year:2023, fee:122, note:'£100m + £5m add-ons' },
  { key:'enzo-2023',      name:'Enzo Fernández',    aliases:['enzo','enzo fernandez','fernandez','enzo chelsea','enzo fernandez chelsea','enzo 2023','enzo fernandez 2023'], from:'Benfica', to:'Chelsea',       year:2023, fee:121, note:'Release clause' },
  { key:'griezmann-2019', name:'Antoine Griezmann', aliases:['griezmann','grizou','antoine griezmann'],                   from:'Atlético Madrid', to:'Barcelona',       year:2019, fee:120, note:'Release clause' },
  { key:'grealish-2021',  name:'Jack Grealish',     aliases:['grealish','jack grealish'],                                 from:'Aston Villa',     to:'Man City',        year:2021, fee:118, note:'£100m' },
  { key:'tonali-2026',    name:'Sandro Tonali',     aliases:['tonali','sandro tonali','sandro'],                          from:'Newcastle',       to:'Tottenham',       year:2026, fee:117, note:'£92.5m + £7.5m add-ons' },
  { key:'hazard-2019',    name:'Eden Hazard',       aliases:['hazard','eden hazard'],                                     from:'Chelsea',         to:'Real Madrid',     year:2019, fee:115, note:'Widely reported ~€115m; announced as €100m rising to €146m with add-ons' },
  { key:'lukaku-2021',    name:'Romelu Lukaku',     aliases:['lukaku','big rom','romelu lukaku'],                         from:'Inter Milan',     to:'Chelsea',         year:2021, fee:115, note:'£97.5m' },
  { key:'kane-2023',      name:'Harry Kane',        aliases:['kane','harry kane'],                                        from:'Tottenham',       to:'Bayern Munich',   year:2023, fee:114, note:'€98m + add-ons (fixed fee ~€100m)' },
  { key:'pogba-2016',     name:'Paul Pogba',        aliases:['pogba','la pioche','paul pogba'],                           from:'Juventus',        to:'Man United',      year:2016, fee:105, note:'€105m (+€5m conditional)' },
  { key:'bale-2013',      name:'Gareth Bale',       aliases:['bale','gareth bale'],                                       from:'Tottenham',       to:'Real Madrid',     year:2013, fee:101, note:'€91m + instalment costs' },
  { key:'ronaldo-2018',   name:'Cristiano Ronaldo', aliases:['ronaldo','cr7','cristiano','cristiano ronaldo'],            from:'Real Madrid',     to:'Juventus',        year:2018, fee:100, note:'€100m (+€12m ancillary costs)' },
  { key:'nunez-2022',     name:'Darwin Núñez',      aliases:['nunez','núñez','darwin nunez','darwin','darwin núñez'],     from:'Benfica',         to:'Liverpool',       year:2022, fee:100, note:'€75m + €25m add-ons' },
  { key:'antony-2022',    name:'Antony',            aliases:['antony','antony matheus','antony santos'],                  from:'Ajax',            to:'Man United',      year:2022, fee:100, note:'€95m + €5m add-ons' },
  { key:'mudryk-2023',    name:'Mykhailo Mudryk',   aliases:['mudryk','mykhailo mudryk','misha mudryk'],                  from:'Shakhtar Donetsk',to:'Chelsea',         year:2023, fee:100, note:'€70m + €30m add-ons' }
];

// Clubs counted as "Premier League signings" for the PL Top 10 list
const BIG_TRANSFERS_PL_CLUBS = ['Man City','Chelsea','Liverpool','Arsenal','Tottenham','Man United','Newcastle','Aston Villa','West Ham','Everton','Nottingham Forest'];
