// Career Path — guess the player from their club history (oldest → newest).
// `club` should match a CLUB_LOGOS key where possible so the badge shows;
// the club name is always displayed as text regardless.
const CAREER_PATH_PLAYERS = [
  { name:'Zlatan Ibrahimović', aliases:['zlatan','ibrahimovic','ibrahimović','zlatan ibrahimovic'], clubs:[
    {club:'Malmö', years:'1999–2001'}, {club:'Ajax', years:'2001–2004'}, {club:'Juventus', years:'2004–2006'},
    {club:'Inter Milan', years:'2006–2009'}, {club:'Barcelona', years:'2009–2011'}, {club:'AC Milan', years:'2011–2012'},
    {club:'PSG', years:'2012–2016'}, {club:'Manchester United', years:'2016–2018'}, {club:'LA Galaxy', years:'2018–2019'},
    {club:'AC Milan', years:'2020–2023'} ]},

  { name:'Carlos Tévez', aliases:['tevez','tévez','carlos tevez','carlitos'], clubs:[
    {club:'Boca Juniors', years:'2001–2004'}, {club:'Corinthians', years:'2005–2006'}, {club:'West Ham', years:'2006–2007'},
    {club:'Manchester United', years:'2007–2009'}, {club:'Manchester City', years:'2009–2013'}, {club:'Juventus', years:'2013–2015'},
    {club:'Boca Juniors', years:'2015–2016'}, {club:'Shanghai SH', years:'2017'}, {club:'Boca Juniors', years:'2018–2021'} ]},

  { name:'Robinho', aliases:['robinho','robson de souza'], clubs:[
    {club:'Santos', years:'2002–2005'}, {club:'Real Madrid', years:'2005–2008'}, {club:'Manchester City', years:'2008–2010'},
    {club:'AC Milan', years:'2010–2014'}, {club:'Santos', years:'2014–2015'} ]},

  { name:'Nicolas Anelka', aliases:['anelka','nicolas anelka','le sulk'], clubs:[
    {club:'PSG', years:'1996–1997'}, {club:'Arsenal', years:'1997–1999'}, {club:'Real Madrid', years:'1999–2000'},
    {club:'PSG', years:'2000–2002'}, {club:'Liverpool', years:'2002'}, {club:'Manchester City', years:'2002–2005'},
    {club:'Fenerbahçe', years:'2005–2007'}, {club:'Chelsea', years:'2008–2012'} ]},

  { name:'Hernán Crespo', aliases:['crespo','hernan crespo','hernán crespo'], clubs:[
    {club:'River Plate', years:'1993–1996'}, {club:'Parma', years:'1996–2000'}, {club:'Lazio', years:'2000–2002'},
    {club:'Inter Milan', years:'2002–2003'}, {club:'Chelsea', years:'2003–2004'}, {club:'AC Milan', years:'2004–2005'},
    {club:'Inter Milan', years:'2006–2009'}, {club:'Genoa', years:'2009'}, {club:'Parma', years:'2010–2012'} ]},

  { name:'Ronaldo', aliases:['ronaldo','r9','ronaldo nazario','o fenomeno','the phenomenon','brazilian ronaldo'], clubs:[
    {club:'Cruzeiro', years:'1993–1994'}, {club:'PSV', years:'1994–1996'}, {club:'Barcelona', years:'1996–1997'},
    {club:'Inter Milan', years:'1997–2002'}, {club:'Real Madrid', years:'2002–2007'}, {club:'AC Milan', years:'2007–2008'},
    {club:'Corinthians', years:'2009–2011'} ]},

  { name:'David Beckham', aliases:['beckham','david beckham','becks'], clubs:[
    {club:'Manchester United', years:'1992–2003'}, {club:'Real Madrid', years:'2003–2007'}, {club:'LA Galaxy', years:'2007–2012'},
    {club:'AC Milan', years:'2009–2010'}, {club:'PSG', years:'2013'} ]},

  { name:'Thierry Henry', aliases:['henry','thierry henry','titi'], clubs:[
    {club:'Monaco', years:'1994–1999'}, {club:'Juventus', years:'1999'}, {club:'Arsenal', years:'1999–2007'},
    {club:'Barcelona', years:'2007–2010'}, {club:'NY Red Bulls', years:'2010–2014'} ]},

  { name:'Luís Figo', aliases:['figo','luis figo','luís figo'], clubs:[
    {club:'Sporting CP', years:'1989–1995'}, {club:'Barcelona', years:'1995–2000'}, {club:'Real Madrid', years:'2000–2005'},
    {club:'Inter Milan', years:'2005–2009'} ]},

  { name:'Gareth Bale', aliases:['bale','gareth bale'], clubs:[
    {club:'Southampton', years:'2006–2007'}, {club:'Tottenham', years:'2007–2013'}, {club:'Real Madrid', years:'2013–2022'},
    {club:'Tottenham', years:'2020–2021'}, {club:'LAFC', years:'2022–2023'} ]},

  { name:'Mohamed Salah', aliases:['salah','mo salah','mohamed salah'], clubs:[
    {club:'Basel', years:'2012–2014'}, {club:'Chelsea', years:'2014–2016'}, {club:'Fiorentina', years:'2015'},
    {club:'Roma', years:'2015–2017'}, {club:'Liverpool', years:'2017–'} ]},

  { name:'Romelu Lukaku', aliases:['lukaku','romelu lukaku','big rom'], clubs:[
    {club:'Anderlecht', years:'2009–2011'}, {club:'Chelsea', years:'2011–2014'}, {club:'Everton', years:'2014–2017'},
    {club:'Manchester United', years:'2017–2019'}, {club:'Inter Milan', years:'2019–2021'}, {club:'Chelsea', years:'2021–2022'},
    {club:'Inter Milan', years:'2022–2023'}, {club:'Roma', years:'2023–2024'}, {club:'Napoli', years:'2024–'} ]},

  { name:'Ángel Di María', aliases:['di maria','angel di maria','ángel di maría','dimaria','fideo'], clubs:[
    {club:'Rosario Central', years:'2005–2007'}, {club:'Benfica', years:'2007–2010'}, {club:'Real Madrid', years:'2010–2014'},
    {club:'Manchester United', years:'2014–2015'}, {club:'PSG', years:'2015–2022'}, {club:'Juventus', years:'2022–2023'},
    {club:'Benfica', years:'2023–'} ]},

  { name:'Radamel Falcao', aliases:['falcao','radamel falcao','el tigre'], clubs:[
    {club:'River Plate', years:'2005–2009'}, {club:'Porto', years:'2009–2011'}, {club:'Atlético Madrid', years:'2011–2013'},
    {club:'Monaco', years:'2013–2019'}, {club:'Manchester United', years:'2014–2015'}, {club:'Chelsea', years:'2015–2016'},
    {club:'Galatasaray', years:'2019–2021'} ]},

  { name:'Alexis Sánchez', aliases:['alexis','sanchez','alexis sanchez','alexis sánchez'], clubs:[
    {club:'Udinese', years:'2008–2011'}, {club:'Barcelona', years:'2011–2014'}, {club:'Arsenal', years:'2014–2018'},
    {club:'Manchester United', years:'2018–2020'}, {club:'Inter Milan', years:'2019–2022'}, {club:'Marseille', years:'2022–2023'},
    {club:'Inter Milan', years:'2023–2024'}, {club:'Udinese', years:'2024–'} ]},

  { name:'Gonzalo Higuaín', aliases:['higuain','gonzalo higuain','higuaín','pipita'], clubs:[
    {club:'River Plate', years:'2005–2007'}, {club:'Real Madrid', years:'2007–2013'}, {club:'Napoli', years:'2013–2016'},
    {club:'Juventus', years:'2016–2019'}, {club:'AC Milan', years:'2019'}, {club:'Chelsea', years:'2019'},
    {club:'Inter Miami', years:'2020–2022'} ]},

  { name:'Arjen Robben', aliases:['robben','arjen robben'], clubs:[
    {club:'Groningen', years:'2000–2002'}, {club:'PSV', years:'2002–2004'}, {club:'Chelsea', years:'2004–2007'},
    {club:'Real Madrid', years:'2007–2009'}, {club:'Bayern Munich', years:'2009–2019'}, {club:'Groningen', years:'2020–2021'} ]},

  { name:'Wesley Sneijder', aliases:['sneijder','wesley sneijder'], clubs:[
    {club:'Ajax', years:'2002–2007'}, {club:'Real Madrid', years:'2007–2009'}, {club:'Inter Milan', years:'2009–2013'},
    {club:'Galatasaray', years:'2013–2017'}, {club:'Nice', years:'2017–2018'} ]},

  { name:'Didier Drogba', aliases:['drogba','didier drogba'], clubs:[
    {club:'Marseille', years:'2003–2004'}, {club:'Chelsea', years:'2004–2012'}, {club:'Shanghai SH', years:'2012'},
    {club:'Galatasaray', years:'2013–2014'}, {club:'Chelsea', years:'2014–2015'}, {club:'Montréal', years:'2015–2016'} ]},

  { name:'Cristiano Ronaldo', aliases:['cristiano','cristiano ronaldo','cr7'], clubs:[
    {club:'Sporting CP', years:'2002–2003'}, {club:'Manchester United', years:'2003–2009'}, {club:'Real Madrid', years:'2009–2018'},
    {club:'Juventus', years:'2018–2021'}, {club:'Manchester United', years:'2021–2022'}, {club:'Al Nassr', years:'2023–'} ]},

  { name:'Lionel Messi', aliases:['messi','lionel messi','leo messi','la pulga'], clubs:[
    {club:'Barcelona', years:'2004–2021'}, {club:'PSG', years:'2021–2023'}, {club:'Inter Miami', years:'2023–'} ]},

  { name:'Neymar', aliases:['neymar','neymar jr','neymar junior'], clubs:[
    {club:'Santos', years:'2009–2013'}, {club:'Barcelona', years:'2013–2017'}, {club:'PSG', years:'2017–2023'},
    {club:'Al Hilal', years:'2023–2025'}, {club:'Santos', years:'2025–'} ]},

  { name:'Sergio Agüero', aliases:['aguero','agüero','sergio aguero','kun aguero','kun'], clubs:[
    {club:'Independiente', years:'2003–2006'}, {club:'Atlético Madrid', years:'2006–2011'}, {club:'Manchester City', years:'2011–2021'},
    {club:'Barcelona', years:'2021–2022'} ]},

  { name:'Fernando Torres', aliases:['torres','fernando torres','el nino','el niño'], clubs:[
    {club:'Atlético Madrid', years:'2001–2007'}, {club:'Liverpool', years:'2007–2011'}, {club:'Chelsea', years:'2011–2014'},
    {club:'AC Milan', years:'2014–2015'}, {club:'Atlético Madrid', years:'2015–2018'}, {club:'Sagan Tosu', years:'2018–2019'} ]},

  { name:'Xherdan Shaqiri', aliases:['shaqiri','xherdan shaqiri'], clubs:[
    {club:'Basel', years:'2009–2012'}, {club:'Bayern Munich', years:'2012–2015'}, {club:'Inter Milan', years:'2015'},
    {club:'Stoke City', years:'2015–2018'}, {club:'Liverpool', years:'2018–2021'}, {club:'Lyon', years:'2021–2022'} ]},

  { name:'James Rodríguez', aliases:['james','james rodriguez','james rodríguez'], clubs:[
    {club:'Banfield', years:'2008–2010'}, {club:'Porto', years:'2010–2013'}, {club:'Monaco', years:'2013–2014'},
    {club:'Real Madrid', years:'2014–2020'}, {club:'Bayern Munich', years:'2017–2019'}, {club:'Everton', years:'2020–2021'} ]},

  { name:'Edinson Cavani', aliases:['cavani','edinson cavani','el matador'], clubs:[
    {club:'Danubio', years:'2005–2007'}, {club:'Palermo', years:'2007–2010'}, {club:'Napoli', years:'2010–2013'},
    {club:'PSG', years:'2013–2020'}, {club:'Manchester United', years:'2020–2022'}, {club:'Valencia', years:'2022–2023'},
    {club:'Boca Juniors', years:'2023–'} ]},

  { name:'Andriy Shevchenko', aliases:['shevchenko','andriy shevchenko','sheva'], clubs:[
    {club:'Dynamo Kyiv', years:'1994–1999'}, {club:'AC Milan', years:'1999–2006'}, {club:'Chelsea', years:'2006–2009'},
    {club:'AC Milan', years:'2008–2009'}, {club:'Dynamo Kyiv', years:'2009–2012'} ]},

  { name:'Kevin De Bruyne', aliases:['de bruyne','kevin de bruyne','kdb'], clubs:[
    {club:'Genk', years:'2008–2012'}, {club:'Chelsea', years:'2012–2014'}, {club:'Werder Bremen', years:'2012–2013'},
    {club:'Wolfsburg', years:'2014–2015'}, {club:'Manchester City', years:'2015–2025'}, {club:'Napoli', years:'2025–'} ]},

  // ── Career paths drawn from the Higher or Lower player pool ──
  { name:'David Villa', aliases:['villa','david villa','el guaje'], clubs:[
    {club:'Sporting Gijón', years:'2003–2005'}, {club:'Real Zaragoza', years:'2005–2007'}, {club:'Valencia', years:'2007–2010'},
    {club:'Barcelona', years:'2010–2013'}, {club:'Atlético Madrid', years:'2013–2014'}, {club:'NYCFC', years:'2015–2018'},
    {club:'Vissel Kobe', years:'2019'} ]},

  { name:'Jordi Alba', aliases:['jordi alba','alba'], clubs:[
    {club:'Gimnàstic', years:'2008–2009'}, {club:'Valencia', years:'2009–2012'}, {club:'Barcelona', years:'2012–2023'},
    {club:'Inter Miami', years:'2023–'} ]},

  { name:'Marcelo', aliases:['marcelo','marcelo vieira'], clubs:[
    {club:'Fluminense', years:'2005–2007'}, {club:'Real Madrid', years:'2007–2022'}, {club:'Olympiacos', years:'2022–2023'},
    {club:'Fluminense', years:'2023–2024'} ]},

  { name:'Diego Maradona', aliases:['maradona','diego maradona','el diego','d10s'], clubs:[
    {club:'Argentinos Juniors', years:'1976–1981'}, {club:'Boca Juniors', years:'1981–1982'}, {club:'Barcelona', years:'1982–1984'},
    {club:'Napoli', years:'1984–1991'}, {club:'Sevilla', years:'1992–1993'}, {club:"Newell's OB", years:'1993–1994'} ]},

  { name:'Johan Cruyff', aliases:['cruyff','johan cruyff','cruijff'], clubs:[
    {club:'Ajax', years:'1964–1973'}, {club:'Barcelona', years:'1973–1978'}, {club:'LA Aztecs', years:'1979–1980'},
    {club:'Washington Dips', years:'1980–1981'}, {club:'Levante', years:'1981'}, {club:'Feyenoord', years:'1983–1984'} ]},

  { name:'Ruud Gullit', aliases:['gullit','ruud gullit'], clubs:[
    {club:'HFC Haarlem', years:'1979–1982'}, {club:'Feyenoord', years:'1982–1985'}, {club:'PSV', years:'1985–1987'},
    {club:'AC Milan', years:'1987–1993'}, {club:'Sampdoria', years:'1993–1994'}, {club:'Chelsea', years:'1995–1998'} ]},

  { name:'Ronaldinho', aliases:['ronaldinho','ronaldinho gaucho','ronaldinho gaúcho','dinho'], clubs:[
    {club:'Grêmio', years:'1998–2001'}, {club:'PSG', years:'2001–2003'}, {club:'Barcelona', years:'2003–2008'},
    {club:'AC Milan', years:'2008–2011'}, {club:'Flamengo', years:'2011–2012'}, {club:'Atlético MG', years:'2012–2014'},
    {club:'Querétaro', years:'2014–2015'} ]},

  { name:'Zinedine Zidane', aliases:['zidane','zinedine zidane','zizou'], clubs:[
    {club:'Cannes', years:'1989–1992'}, {club:'Bordeaux', years:'1992–1996'}, {club:'Juventus', years:'1996–2001'},
    {club:'Real Madrid', years:'2001–2006'} ]},

  { name:'Frank Lampard', aliases:['lampard','frank lampard','super frank'], clubs:[
    {club:'West Ham', years:'1995–2001'}, {club:'Chelsea', years:'2001–2014'}, {club:'Man City', years:'2014–2015'},
    {club:'NYCFC', years:'2015–2016'} ]},

  { name:'Wayne Rooney', aliases:['rooney','wayne rooney','wazza'], clubs:[
    {club:'Everton', years:'2002–2004'}, {club:'Manchester Utd', years:'2004–2017'}, {club:'Everton', years:'2017–2018'},
    {club:'DC United', years:'2018–2019'}, {club:'Derby County', years:'2020–2021'} ]},

  { name:'Diego Costa', aliases:['diego costa','costa'], clubs:[
    {club:'Celta de Vigo', years:'2006–2007'}, {club:'Valladolid', years:'2009–2010'}, {club:'Atlético Madrid', years:'2010–2014'},
    {club:'Chelsea', years:'2014–2017'}, {club:'Atlético Madrid', years:'2018–2020'}, {club:'Wolverhampton', years:'2022–2023'},
    {club:'Botafogo', years:'2023–2024'} ]},

  { name:"Samuel Eto'o", aliases:['etoo',"eto'o",'samuel etoo',"samuel eto'o"], clubs:[
    {club:'Mallorca', years:'2000–2004'}, {club:'Barcelona', years:'2004–2009'}, {club:'Inter Milan', years:'2009–2011'},
    {club:'Anzhi', years:'2011–2013'}, {club:'Chelsea', years:'2013–2014'}, {club:'Everton', years:'2014–2015'},
    {club:'Antalyaspor', years:'2015–2018'} ]},

  { name:'Rivaldo', aliases:['rivaldo','rivaldo ferreira'], clubs:[
    {club:'Corinthians', years:'1993–1994'}, {club:'Palmeiras', years:'1994–1996'}, {club:'Deportivo', years:'1996–1997'},
    {club:'Barcelona', years:'1997–2002'}, {club:'AC Milan', years:'2002–2003'}, {club:'Olympiacos', years:'2004–2007'},
    {club:'AEK Athens', years:'2007–2008'}, {club:'São Paulo', years:'2011–2013'} ]},

  { name:'Franck Ribéry', aliases:['ribery','ribéry','franck ribery'], clubs:[
    {club:'US Boulogne', years:'2004–2005'}, {club:'FC Metz', years:'2004–2005'}, {club:'Galatasaray', years:'2005–2006'},
    {club:'Marseille', years:'2005–2007'}, {club:'Bayern Munich', years:'2007–2019'}, {club:'Fiorentina', years:'2019–2021'},
    {club:'Salernitana', years:'2021–2022'} ]},

  { name:'Ruud van Nistelrooy', aliases:['van nistelrooy','nistelrooy','ruud van nistelrooy'], clubs:[
    {club:'Den Bosch', years:'1993–1997'}, {club:'Heerenveen', years:'1997–1998'}, {club:'PSV', years:'1998–2001'},
    {club:'Man United', years:'2001–2006'}, {club:'Real Madrid', years:'2006–2010'}, {club:'Hamburg', years:'2010–2011'},
    {club:'Málaga', years:'2011–2012'} ]},

  { name:'Robin van Persie', aliases:['van persie','robin van persie','rvp'], clubs:[
    {club:'Feyenoord', years:'2001–2004'}, {club:'Arsenal', years:'2004–2012'}, {club:'Man United', years:'2012–2015'},
    {club:'Fenerbahçe', years:'2015–2018'}, {club:'Feyenoord', years:'2018–2019'} ]},

  { name:'Michael Owen', aliases:['owen','michael owen'], clubs:[
    {club:'Liverpool', years:'1996–2004'}, {club:'Real Madrid', years:'2004–2005'}, {club:'Newcastle', years:'2005–2009'},
    {club:'Manchester Utd', years:'2009–2012'}, {club:'Stoke City', years:'2012–2013'} ]},

  { name:'Dani Alves', aliases:['dani alves','daniel alves','alves'], clubs:[
    {club:'Bahia', years:'2001–2002'}, {club:'Sevilla', years:'2003–2008'}, {club:'Barcelona', years:'2008–2016'},
    {club:'Juventus', years:'2016–2017'}, {club:'PSG', years:'2017–2019'}, {club:'São Paulo', years:'2019–2022'} ]},

  { name:'Gianfranco Zola', aliases:['zola','gianfranco zola'], clubs:[
    {club:'Napoli', years:'1989–1993'}, {club:'Parma', years:'1993–1996'}, {club:'Chelsea', years:'1996–2003'},
    {club:'Cagliari', years:'2003–2005'} ]},
];
