// Premier League Winners — title-winning Starting XIs
// XIs transcribed from the Sporcle "Premier League Winners' XIs" quiz screenshot.
// Appended into SXI_TEAMS with tournament:'Premier League Winners'.
(function(){
  const ENG = '🏴󠁧󠁢󠁥󠁮󠁧󠁿';

  function norm(s){
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
      .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  }
  // P(name, short, pos, x, y, extraAliases)
  function P(name, short, pos, x, y, extra){
    const a = new Set();
    a.add(norm(name));
    a.add(norm(short));
    (extra||[]).forEach(e=>a.add(norm(e)));
    return { name, short, pos, x, y, aliases:[...a] };
  }

  const TEAMS = [
    // 1. Arsenal 2025-26
    { id:'arsenal-2026', name:'Arsenal', year:2026, season:'2025-26', formation:'4-4-2',
      starters:[
        P('David Raya','Raya','GK',50,85),
        P('Jurriën Timber','Timber','RB',82,68,['jurrien timber']),
        P('William Saliba','Saliba','CB',62,70),
        P('Gabriel Magalhães','Gabriel','CB',38,70,['gabriel magalhaes','gabriel']),
        P('Riccardo Calafiori','Calafiori','LB',18,68),
        P('Bukayo Saka','Saka','RM',82,48),
        P('Declan Rice','Rice','CM',60,52),
        P('Martín Zubimendi','Zubimendi','CM',40,52,['martin zubimendi']),
        P('Leandro Trossard','Trossard','LM',18,48),
        P('Eberechi Eze','Eze','ST',58,16),
        P('Viktor Gyökeres','Gyökeres','ST',42,16,['gyokeres','viktor gyokeres']),
      ]},

    // 2. Liverpool 2024-25
    { id:'liverpool-2025', name:'Liverpool', year:2025, season:'2024-25', formation:'4-4-2',
      starters:[
        P('Alisson','Alisson','GK',50,85,['alisson becker']),
        P('Trent Alexander-Arnold','Alexander-Arnold','RB',82,68,['trent','alexander arnold','trent alexander arnold']),
        P('Virgil van Dijk','Van Dijk','CB',62,70,['van dijk']),
        P('Ibrahima Konaté','Konaté','CB',38,70,['konate','ibrahima konate']),
        P('Andrew Robertson','Robertson','LB',18,68,['andy robertson']),
        P('Dominik Szoboszlai','Szoboszlai','RM',82,48),
        P('Ryan Gravenberch','Gravenberch','CM',60,52),
        P('Alexis Mac Allister','Mac Allister','CM',40,52,['mac allister','macallister']),
        P('Cody Gakpo','Gakpo','LM',18,48),
        P('Mohamed Salah','Salah','ST',58,16,['mo salah','mohamed salah']),
        P('Luis Díaz','Díaz','ST',42,16,['diaz','luis diaz']),
      ]},

    // 3. Man City 2023-24
    { id:'mancity-2024', name:'Man City', year:2024, season:'2023-24', formation:'4-4-2',
      starters:[
        P('Ederson','Ederson','GK',50,85),
        P('Kyle Walker','Walker','RB',82,68),
        P('Rúben Dias','Dias','CB',62,70,['ruben dias']),
        P('Manuel Akanji','Akanji','CB',38,70),
        P('Joško Gvardiol','Gvardiol','LB',18,68,['josko gvardiol']),
        P('Bernardo Silva','B. Silva','RM',82,48,['bernardo','bernardo silva']),
        P('Rodri','Rodri','CM',60,52),
        P('Mateo Kovačić','Kovačić','CM',40,52,['kovacic']),
        P('Phil Foden','Foden','LM',18,48),
        P('Erling Haaland','Haaland','ST',58,16),
        P('Julián Álvarez','Álvarez','ST',42,16,['alvarez','julian alvarez']),
      ]},

    // 4. Man City 2022-23
    { id:'mancity-2023', name:'Man City', year:2023, season:'2022-23', formation:'4-4-2',
      starters:[
        P('Ederson','Ederson','GK',50,85),
        P('Kyle Walker','Walker','RB',82,68),
        P('Rúben Dias','Dias','CB',62,70,['ruben dias']),
        P('Manuel Akanji','Akanji','CB',38,70),
        P('Nathan Aké','Aké','LB',18,68,['ake','nathan ake']),
        P('Bernardo Silva','B. Silva','RM',82,48,['bernardo','bernardo silva']),
        P('Rodri','Rodri','CM',60,52),
        P('Kevin De Bruyne','De Bruyne','CM',40,52,['de bruyne','kdb']),
        P('Jack Grealish','Grealish','LM',18,48),
        P('Phil Foden','Foden','ST',58,16),
        P('Erling Haaland','Haaland','ST',42,16),
      ]},

    // 5. Man City 2021-22
    { id:'mancity-2022', name:'Man City', year:2022, season:'2021-22', formation:'4-4-2',
      starters:[
        P('Ederson','Ederson','GK',50,85),
        P('Kyle Walker','Walker','RB',82,68),
        P('Rúben Dias','Dias','CB',62,70,['ruben dias']),
        P('Aymeric Laporte','Laporte','CB',38,70),
        P('João Cancelo','Cancelo','LB',18,68,['joao cancelo']),
        P('Bernardo Silva','B. Silva','RM',82,48,['bernardo','bernardo silva']),
        P('Rodri','Rodri','CM',60,52),
        P('Kevin De Bruyne','De Bruyne','CM',40,52,['de bruyne','kdb']),
        P('Raheem Sterling','Sterling','LM',18,48),
        P('Gabriel Jesus','Jesus','ST',58,16,['gabriel jesus']),
        P('Phil Foden','Foden','ST',42,16),
      ]},

    // 6. Man City 2020-21
    { id:'mancity-2021', name:'Man City', year:2021, season:'2020-21', formation:'4-4-2',
      starters:[
        P('Ederson','Ederson','GK',50,85),
        P('Kyle Walker','Walker','RB',82,68),
        P('Rúben Dias','Dias','CB',62,70,['ruben dias']),
        P('John Stones','Stones','CB',38,70),
        P('João Cancelo','Cancelo','LB',18,68,['joao cancelo']),
        P('Bernardo Silva','B. Silva','RM',82,48,['bernardo','bernardo silva']),
        P('Rodri','Rodri','CM',60,52),
        P('İlkay Gündoğan','Gündoğan','CM',40,52,['gundogan','ilkay gundogan']),
        P('Raheem Sterling','Sterling','LM',18,48),
        P('Gabriel Jesus','Jesus','ST',58,16,['gabriel jesus']),
        P('Kevin De Bruyne','De Bruyne','ST',42,16,['de bruyne','kdb']),
      ]},

    // 7. Liverpool 2019-20
    { id:'liverpool-2020', name:'Liverpool', year:2020, season:'2019-20', formation:'4-4-2',
      starters:[
        P('Alisson','Alisson','GK',50,85,['alisson becker']),
        P('Trent Alexander-Arnold','Alexander-Arnold','RB',82,68,['trent','alexander arnold']),
        P('Joe Gomez','Gomez','CB',62,70),
        P('Virgil van Dijk','Van Dijk','CB',38,70,['van dijk']),
        P('Andrew Robertson','Robertson','LB',18,68,['andy robertson']),
        P('Georginio Wijnaldum','Wijnaldum','RM',82,48,['gini wijnaldum']),
        P('Fabinho','Fabinho','CM',60,52),
        P('Jordan Henderson','Henderson','CM',40,52),
        P('Sadio Mané','Mané','LM',18,48,['mane','sadio mane']),
        P('Mohamed Salah','Salah','ST',58,16,['mo salah','mohamed salah']),
        P('Roberto Firmino','Firmino','ST',42,16),
      ]},

    // 8. Man City 2018-19
    { id:'mancity-2019', name:'Man City', year:2019, season:'2018-19', formation:'4-4-2',
      starters:[
        P('Ederson','Ederson','GK',50,85),
        P('Kyle Walker','Walker','RB',82,68),
        P('Aymeric Laporte','Laporte','CB',62,70),
        P('Nicolás Otamendi','Otamendi','CB',38,70,['nicolas otamendi']),
        P('Oleksandr Zinchenko','Zinchenko','LB',18,68),
        P('Bernardo Silva','B. Silva','RM',82,48,['bernardo','bernardo silva']),
        P('David Silva','D. Silva','CM',60,52,['david silva','silva']),
        P('Fernandinho','Fernandinho','CM',40,52),
        P('Raheem Sterling','Sterling','LM',18,48),
        P('Sergio Agüero','Agüero','ST',58,16,['aguero','sergio aguero','kun aguero']),
        P('Gabriel Jesus','Jesus','ST',42,16,['gabriel jesus']),
      ]},

    // 9. Man City 2017-18
    { id:'mancity-2018', name:'Man City', year:2018, season:'2017-18', formation:'4-4-2',
      starters:[
        P('Ederson','Ederson','GK',50,85),
        P('Kyle Walker','Walker','RB',82,68),
        P('Nicolás Otamendi','Otamendi','CB',62,70,['nicolas otamendi']),
        P('John Stones','Stones','CB',38,70),
        P('Danilo','Danilo','LB',18,68),
        P('Bernardo Silva','B. Silva','RM',82,48,['bernardo','bernardo silva']),
        P('Fernandinho','Fernandinho','CM',60,52),
        P('Kevin De Bruyne','De Bruyne','CM',40,52,['de bruyne','kdb']),
        P('Leroy Sané','Sané','LM',18,48,['sane','leroy sane']),
        P('Raheem Sterling','Sterling','ST',58,16),
        P('Gabriel Jesus','Jesus','ST',42,16,['gabriel jesus']),
      ]},

    // 10. Chelsea 2016-17 (3-4-3)
    { id:'chelsea-2017', name:'Chelsea', year:2017, season:'2016-17', formation:'3-4-3',
      starters:[
        P('Thibaut Courtois','Courtois','GK',50,85),
        P('César Azpilicueta','Azpilicueta','CB',66,72,['azpilicueta','cesar azpilicueta','dave']),
        P('David Luiz','David Luiz','CB',50,73,['luiz']),
        P('Gary Cahill','Cahill','CB',34,72),
        P('Victor Moses','Moses','RWB',86,52),
        P('N’Golo Kanté','Kanté','CM',60,54,['kante','ngolo kante']),
        P('Nemanja Matić','Matić','CM',40,54,['matic','nemanja matic']),
        P('Marcos Alonso','Alonso','LWB',14,52,['marcos alonso']),
        P('Pedro','Pedro','RW',74,22,['pedro rodriguez']),
        P('Diego Costa','Costa','ST',50,16,['diego costa']),
        P('Eden Hazard','Hazard','LW',26,22),
      ]},

    // 11. Leicester City 2015-16 (4-4-2)
    { id:'leicester-2016', name:'Leicester City', year:2016, season:'2015-16', formation:'4-4-2',
      starters:[
        P('Kasper Schmeichel','Schmeichel','GK',50,85),
        P('Danny Simpson','Simpson','RB',82,68),
        P('Wes Morgan','Morgan','CB',62,70),
        P('Robert Huth','Huth','CB',38,70),
        P('Christian Fuchs','Fuchs','LB',18,68),
        P('Riyad Mahrez','Mahrez','RM',82,48),
        P('Danny Drinkwater','Drinkwater','CM',60,52),
        P('N’Golo Kanté','Kanté','CM',40,52,['kante','ngolo kante']),
        P('Marc Albrighton','Albrighton','LM',18,48),
        P('Jamie Vardy','Vardy','ST',58,16),
        P('Shinji Okazaki','Okazaki','ST',42,16),
      ]},

    // 12. Chelsea 2014-15 (4-2-3-1)
    { id:'chelsea-2015', name:'Chelsea', year:2015, season:'2014-15', formation:'4-2-3-1',
      starters:[
        P('Thibaut Courtois','Courtois','GK',50,85),
        P('Branislav Ivanović','Ivanović','RB',82,68,['ivanovic']),
        P('John Terry','Terry','CB',62,70),
        P('Gary Cahill','Cahill','CB',38,70),
        P('César Azpilicueta','Azpilicueta','LB',18,68,['azpilicueta','cesar azpilicueta']),
        P('Nemanja Matić','Matić','DM',60,56,['matic','nemanja matic']),
        P('Cesc Fàbregas','Fàbregas','DM',40,56,['fabregas','cesc fabregas','cesc']),
        P('Willian','Willian','CAM',76,34),
        P('Oscar','Oscar','CAM',50,34),
        P('Eden Hazard','Hazard','LW',24,34),
        P('Didier Drogba','Drogba','ST',50,16),
      ]},

    // 13. Man City 2013-14 (4-4-2)
    { id:'mancity-2014', name:'Man City', year:2014, season:'2013-14', formation:'4-4-2',
      starters:[
        P('Joe Hart','Hart','GK',50,85),
        P('Pablo Zabaleta','Zabaleta','RB',82,68),
        P('Vincent Kompany','Kompany','CB',62,70),
        P('Martín Demichelis','Demichelis','CB',38,70,['martin demichelis']),
        P('Aleksandar Kolarov','Kolarov','LB',18,68),
        P('James Milner','Milner','RM',82,48),
        P('Yaya Touré','Touré','CM',60,52,['yaya toure','toure','yaya']),
        P('Fernandinho','Fernandinho','CM',40,52),
        P('Samir Nasri','Nasri','LM',18,48),
        P('Álvaro Negredo','Negredo','ST',58,16,['alvaro negredo']),
        P('Edin Džeko','Džeko','ST',42,16,['dzeko','edin dzeko']),
      ]},

    // 14. Man United 2012-13 (4-2-3-1)
    { id:'manutd-2013', name:'Man United', year:2013, season:'2012-13', formation:'4-2-3-1',
      starters:[
        P('David de Gea','De Gea','GK',50,85,['de gea','david de gea']),
        P('Rafael','Rafael','RB',82,68,['rafael da silva']),
        P('Rio Ferdinand','Ferdinand','CB',62,70),
        P('Nemanja Vidić','Vidić','CB',38,70,['vidic','nemanja vidic']),
        P('Patrice Evra','Evra','LB',18,68),
        P('Michael Carrick','Carrick','DM',60,56),
        P('Tom Cleverley','Cleverley','DM',40,56),
        P('Antonio Valencia','Valencia','RW',76,34),
        P('Wayne Rooney','Rooney','CAM',50,34),
        P('Ashley Young','Young','LW',24,34),
        P('Robin van Persie','Van Persie','ST',50,16,['van persie','rvp']),
      ]},

    // 15. Man City 2011-12 (4-4-2)
    { id:'mancity-2012', name:'Man City', year:2012, season:'2011-12', formation:'4-4-2',
      starters:[
        P('Joe Hart','Hart','GK',50,85),
        P('Micah Richards','Richards','RB',82,68),
        P('Vincent Kompany','Kompany','CB',62,70),
        P('Joleon Lescott','Lescott','CB',38,70),
        P('Gaël Clichy','Clichy','LB',18,68,['gael clichy']),
        P('David Silva','D. Silva','RM',82,48,['david silva','silva']),
        P('Yaya Touré','Touré','CM',60,52,['yaya toure','toure','yaya']),
        P('Gareth Barry','Barry','CM',40,52),
        P('Samir Nasri','Nasri','LM',18,48),
        P('Sergio Agüero','Agüero','ST',58,16,['aguero','sergio aguero','kun aguero']),
        P('Edin Džeko','Džeko','ST',42,16,['dzeko','edin dzeko']),
      ]},

    // 16. Man United 2010-11 (4-4-2)
    { id:'manutd-2011', name:'Man United', year:2011, season:'2010-11', formation:'4-4-2',
      starters:[
        P('Edwin van der Sar','Van der Sar','GK',50,85,['van der sar','edwin van der sar']),
        P('Patrice Evra','Evra','RB',82,68),
        P('Nemanja Vidić','Vidić','CB',62,70,['vidic','nemanja vidic']),
        P('Rio Ferdinand','Ferdinand','CB',38,70),
        P('John O’Shea','O’Shea','LB',18,68,['oshea','john oshea','o shea']),
        P('Nani','Nani','RM',82,48,['luis nani']),
        P('Michael Carrick','Carrick','CM',60,52),
        P('Darren Fletcher','Fletcher','CM',40,52),
        P('Ryan Giggs','Giggs','LM',18,48),
        P('Wayne Rooney','Rooney','ST',58,16),
        P('Dimitar Berbatov','Berbatov','ST',42,16),
      ]},

    // 17. Chelsea 2009-10 (4-4-2)
    { id:'chelsea-2010', name:'Chelsea', year:2010, season:'2009-10', formation:'4-4-2',
      starters:[
        P('Petr Čech','Čech','GK',50,85,['cech','petr cech']),
        P('Branislav Ivanović','Ivanović','RB',82,68,['ivanovic']),
        P('John Terry','Terry','CB',62,70),
        P('Ricardo Carvalho','Carvalho','CB',38,70),
        P('Ashley Cole','A. Cole','LB',18,68,['ashley cole','a cole']),
        P('Joe Cole','J. Cole','RM',82,48,['joe cole','j cole']),
        P('Frank Lampard','Lampard','CM',60,52),
        P('Michael Ballack','Ballack','CM',40,52),
        P('Florent Malouda','Malouda','LM',18,48),
        P('Nicolas Anelka','Anelka','ST',58,16),
        P('Didier Drogba','Drogba','ST',42,16),
      ]},

    // 18. Man United 2008-09 (4-4-2)
    { id:'manutd-2009', name:'Man United', year:2009, season:'2008-09', formation:'4-4-2',
      starters:[
        P('Edwin van der Sar','Van der Sar','GK',50,85,['van der sar','edwin van der sar']),
        P('John O’Shea','O’Shea','RB',82,68,['oshea','john oshea','o shea']),
        P('Nemanja Vidić','Vidić','CB',62,70,['vidic','nemanja vidic']),
        P('Rio Ferdinand','Ferdinand','CB',38,70),
        P('Patrice Evra','Evra','LB',18,68),
        P('Cristiano Ronaldo','Ronaldo','RM',82,48,['cristiano ronaldo','cr7','cristiano']),
        P('Michael Carrick','Carrick','CM',60,52),
        P('Darren Fletcher','Fletcher','CM',40,52),
        P('Ryan Giggs','Giggs','LM',18,48),
        P('Wayne Rooney','Rooney','ST',58,16),
        P('Carlos Tévez','Tévez','ST',42,16,['tevez','carlos tevez']),
      ]},

    // 19. Man United 2007-08 (4-4-2)
    { id:'manutd-2008', name:'Man United', year:2008, season:'2007-08', formation:'4-4-2',
      starters:[
        P('Edwin van der Sar','Van der Sar','GK',50,85,['van der sar','edwin van der sar']),
        P('Wes Brown','Brown','RB',82,68,['wes brown']),
        P('Nemanja Vidić','Vidić','CB',62,70,['vidic','nemanja vidic']),
        P('Rio Ferdinand','Ferdinand','CB',38,70),
        P('Patrice Evra','Evra','LB',18,68),
        P('Cristiano Ronaldo','Ronaldo','RM',82,48,['cristiano ronaldo','cr7','cristiano']),
        P('Michael Carrick','Carrick','CM',60,52),
        P('Paul Scholes','Scholes','CM',40,52),
        P('Ryan Giggs','Giggs','LM',18,48),
        P('Wayne Rooney','Rooney','ST',58,16),
        P('Carlos Tévez','Tévez','ST',42,16,['tevez','carlos tevez']),
      ]},

    // 20. Man United 2006-07 (4-4-2)
    { id:'manutd-2007', name:'Man United', year:2007, season:'2006-07', formation:'4-4-2',
      starters:[
        P('Edwin van der Sar','Van der Sar','GK',50,85,['van der sar','edwin van der sar']),
        P('John O’Shea','O’Shea','RB',82,68,['oshea','john oshea','o shea']),
        P('Nemanja Vidić','Vidić','CB',62,70,['vidic','nemanja vidic']),
        P('Rio Ferdinand','Ferdinand','CB',38,70),
        P('Patrice Evra','Evra','LB',18,68),
        P('Cristiano Ronaldo','Ronaldo','RM',82,48,['cristiano ronaldo','cr7','cristiano']),
        P('Michael Carrick','Carrick','CM',60,52),
        P('Paul Scholes','Scholes','CM',40,52),
        P('Ryan Giggs','Giggs','LM',18,48),
        P('Wayne Rooney','Rooney','ST',58,16),
        P('Louis Saha','Saha','ST',42,16),
      ]},
  ];

  if (typeof SXI_TEAMS !== 'undefined' && Array.isArray(SXI_TEAMS)) {
    TEAMS.forEach(t=>{
      t.flag = ENG;
      t.tournament = 'Premier League Winners';
      t.opponent = '';
      t.score = '';
      t.subs = t.subs || [];
      SXI_TEAMS.push(t);
    });
  }
})();
