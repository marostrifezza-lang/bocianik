/*
 * textos-sk.js — All the app texts in SLOVAK.
 *
 * What it does:  dictionary "key -> text" read by idiomas.js (function t).
 * How to use:    same keys as textos-es.js. {words} in braces are replaced by
 *                values; help texts use "\n" to separate paragraphs.
 *                Slovak has three plural forms, so counted texts have
 *                ".one" (1), ".few" (2-4) and ".other" (0, 5+) variants.
 *                Written by Claude: a native speaker should review it.
 * Depends on:    nothing. Loaded before idiomas.js.
 */

window.TEXTS_SK = {
  // ---------------- Tabs, header and common buttons ----------------
  "tabs.home": "Domov",
  "tabs.diary": "Denník",
  "tabs.counter": "Časovač",
  "tabs.lists": "Zoznamy",
  "tabs.more": "Viac",
  "header.back": "Späť",
  "header.language": "Zmeniť jazyk",
  "header.lightMode": "Svetlý režim",
  "header.darkMode": "Tmavý režim",
  "common.add": "Pridať",
  "common.cancel": "Zrušiť",
  "common.close": "Zavrieť",
  "common.remove": "Odstrániť",
  "common.save": "Uložiť",
  "common.saved": "Uložené",

  // ---------------- Welcome ----------------
  "welcome.title": "Vitaj",
  "welcome.giftFrom": "Darček od {name}",
  "welcome.yourName": "Ako sa voláš?",
  "welcome.whichDate": "Ktorý dátum poznáš?",
  "welcome.optionDue": "Predpokladaný termín pôrodu",
  "welcome.optionLastPeriod": "Prvý deň mojej poslednej menštruácie",
  "welcome.dueDate": "Predpokladaný termín pôrodu",
  "welcome.lastPeriod": "Prvý deň poslednej menštruácie",
  "welcome.calculated": "Vypočítaný termín pôrodu: {date}. Ak ti lekár určil iný, použi ten.",
  "welcome.partnerName": "Meno partnera",
  "welcome.partnerHint": "(nepovinné, pre hru s menami)",
  "welcome.start": "Začať",
  "welcome.restore": "Už mám zálohu: obnoviť ju",

  // ---------------- Home ----------------
  "home.title": "Domov",
  "home.hello": "Ahoj, {name}",
  "home.dueDate": "Termín: {date}",
  "home.weeks.one": "týždeň",
  "home.weeks.few": "týždne",
  "home.weeks.other": "týždňov",
  "home.plusDays.one": "a 1 deň",
  "home.plusDays.few": "a {n} dni",
  "home.plusDays.other": "a {n} dní",
  "home.trimester": "{n}. trimester · {percent} % cesty",
  "home.daysLeft.one": "Zostáva {days} deň!",
  "home.daysLeft.few": "Zostávajú {days} dni",
  "home.daysLeft.other": "Zostáva {days} dní",
  "home.dueToday": "Dnes je predpokladaný termín!",
  "home.pastDays.one": "Termín bol pred 1 dňom. Už to bude!",
  "home.pastDays.other": "Termín bol pred {n} dňami. Už to bude!",
  "home.tooSmall": "Tvoje bábätko je ešte maličké. Od {week}. týždňa tu uvidíš, s čím sa dá porovnať jeho veľkosť.",
  "home.sizeOf": "Tvoje bábätko je veľké asi ako {item}.",
  "home.lengthAndWeight": "Meria asi {length} a váži asi {weight}.",
  "home.lengthOnly": "Meria asi {length}.",
  "home.lessThan": "Meria menej ako {length}.",
  "home.range": "{min} až {max}",
  "home.sizeNote": "Približné rozmery: každé bábätko rastie vlastným tempom.",
  "home.photoAsk": "Odfotíš si bruško?",
  "home.photoAskHint": "Jedna fotka za týždeň a na konci budeš mať celý album.",
  "home.photoDone": "Fotku na tento týždeň už máš",
  "home.photoDoneHint": "Pozri sa v denníku, ako napreduješ.",

  // ---------------- Diary ----------------
  "diary.title": "Denník",
  "diary.newEntry": "Nový záznam",
  "diary.editEntry": "Upraviť záznam",
  "diary.album": "Prehrať album",
  "diary.empty": "Zatiaľ tu nie sú žiadne záznamy. Začni fotkou bruška z tohto týždňa.",
  "diary.week": "{week}. týždeň",
  "diary.weekLabel": "Týždeň",
  "diary.takePhoto": "Odfotiť",
  "diary.pickPhoto": "Vybrať z galérie",
  "diary.preparingPhoto": "Pripravujem fotku…",
  "diary.note": "Poznámka",
  "diary.notePlaceholder": "Ako si sa cítila? Stalo sa tento týždeň niečo výnimočné?",
  "diary.deleteEntry": "Vymazať záznam",
  "diary.confirmDelete": "Vymazať tento záznam aj s fotkou? Nedá sa to vrátiť.",
  "album.previous": "Predchádzajúca",
  "album.pause": "Pozastaviť",
  "album.next": "Ďalšia",

  // ---------------- Contraction timer and movement counter ----------------
  "counter.title": "Časovač",
  "counter.contractions": "Kontrakcie",
  "counter.kicks": "Pohyby",
  "counter.contractionStarted": "Začala sa kontrakcia",
  "counter.contractionEnded": "Ťukni, keď skončí",
  "counter.hospitalNote": "Kedy ísť do pôrodnice, rozhoduj podľa pokynov svojho lekára alebo pôrodnej asistentky.",
  "counter.lastContractions": "Posledné kontrakcie",
  "counter.start": "Začiatok",
  "counter.duration": "Trvanie",
  "counter.sincePrevious": "Od predošlej",
  "counter.inProgress": "prebieha",
  "counter.clearHistory": "Vymazať históriu",
  "counter.confirmClear": "Vymazať všetky zaznamenané kontrakcie?",
  "counter.lastHour": "Posledná hodina",
  "counter.contractionsLower": "počet kontrakcií",
  "counter.averageDuration": "priemerné trvanie",
  "counter.averageInterval": "interval (priemer)",
  "counter.startKicks": "Začať počítať pohyby",
  "counter.tapEachKick": "Ťukni pri každom pohybe",
  "counter.undoOne": "Vrátiť jeden",
  "counter.finish": "Ukončiť",
  "counter.kicksNote": "Ak spozoruješ zmenu v pohyboch bábätka, obráť sa na svojho lekára alebo pôrodnú asistentku.",
  "counter.previousSessions": "Predchádzajúce merania",
  "counter.day": "Deň",
  "counter.time": "Čas",

  // ---------------- Checklists ----------------
  "lists.title": "Zoznamy",
  "lists.hospitalHint": "Opýtaj sa v pôrodnici, čo si máš priniesť: každá má svoje pravidlá.",
  "lists.addItem": "Pridať položku…",
  "lists.deleteList": "Vymazať tento zoznam",
  "lists.confirmDelete": "Vymazať zoznam „{name}“?",
  "lists.newListName": "Názov nového zoznamu",
  "lists.createList": "Vytvoriť zoznam",
  "lists.bagMom": "👜 Taška do pôrodnice: pre teba",
  "lists.bagMom.item1": "Pohodlná nočná košeľa alebo pyžamo s rozopínaním vpredu",
  "lists.bagMom.item2": "Župan a papuče",
  "lists.bagMom.item3": "Pohodlná spodná bielizeň (viac kusov)",
  "lists.bagMom.item4": "Dojčiace podprsenky",
  "lists.bagMom.item5": "Popôrodné vložky",
  "lists.bagMom.item6": "Zubná kefka, šampón a hrebeň",
  "lists.bagMom.item7": "Nabíjačka na telefón s dlhým káblom",
  "lists.bagMom.item8": "Pohodlné oblečenie na cestu domov",
  "lists.bagMom.item9": "Niečo na zahryznutie a fľaša vody",
  "lists.bagBaby": "🍼 Taška do pôrodnice: pre bábätko",
  "lists.bagBaby.item1": "Body (3 alebo 4)",
  "lists.bagBaby.item2": "Overaly na spanie (3 alebo 4)",
  "lists.bagBaby.item3": "Čiapočka a ponožky",
  "lists.bagBaby.item4": "Deka na zabalenie",
  "lists.bagBaby.item5": "Plienky pre novorodenca",
  "lists.bagBaby.item6": "Vlhčené obrúsky",
  "lists.bagBaby.item7": "Oblečenie na odchod z pôrodnice",
  "lists.bagBaby.item8": "Nainštalovaná autosedačka",
  "lists.documents": "📄 Doklady",
  "lists.documents.item1": "Občiansky preukaz",
  "lists.documents.item2": "Preukaz poistenca",
  "lists.documents.item3": "Tehotenská knižka",
  "lists.documents.item4": "Pôrodný plán (ak ho máš)",
  "lists.beforeArrival": "🏠 Pred príchodom bábätka",
  "lists.beforeArrival.item1": "Zložená postieľka alebo kolíska",
  "lists.beforeArrival.item2": "Prebaľovací pult",
  "lists.beforeArrival.item3": "Vanička",
  "lists.beforeArrival.item4": "Oprané oblečenie pre bábätko",
  "lists.beforeArrival.item5": "Kočík",
  "lists.beforeArrival.item6": "Zamrazené jedlo na prvé dni",

  // ---------------- Names game ----------------
  "names.title": "Mená",
  "names.playerA": "Mamina",
  "names.playerB": "Partner",
  "names.viewAdd": "Mená",
  "names.viewVote": "Hlasovať",
  "names.viewMatches": "Zhody",
  "names.addLabel": "Pridaj mená, ktoré sa ti páčia",
  "names.addPlaceholder": "Môžeš ich napísať viac, oddelené čiarkou",
  "names.kind": "Druh mena",
  "names.girl": "Dievča",
  "names.boy": "Chlapec",
  "names.any": "Univerzálne",
  "names.empty": "Zatiaľ tu nie sú žiadne mená. Pridajte tie, ktoré sa páčia vám obom.",
  "names.whoVotes": "Kto teraz hlasuje? Hlasy toho druhého sa nezobrazujú.",
  "names.votingAs": "Hlasuje: {name}",
  "names.remaining.one": "zostáva 1",
  "names.remaining.few": "zostávajú {n}",
  "names.remaining.other": "zostáva {n}",
  "names.no": "Nie",
  "names.yes": "Áno",
  "names.allVoted": "Všetky mená sú odhlasované!",
  "names.changeVoter": "Vymeniť osobu",
  "names.noMatches": "Zatiaľ žiadne zhody. Keď obaja zahlasujete „áno“ za to isté meno, objaví sa tu.",
  "names.resetVotes": "Vynulovať hlasy",
  "names.confirmReset": "Vymazať všetky hlasy? Mená zostanú.",

  // ---------------- "More" menu ----------------
  "more.title": "Viac",
  "more.namesHint": "Vyberte spolu meno pre bábätko",
  "more.settingsHint": "Tvoje údaje a záloha",
  "more.helpHint": "Ako funguje každá časť aplikácie",

  // ---------------- Settings and backup ----------------
  "settings.title": "Nastavenia a záloha",
  "settings.yourData": "Tvoje údaje",
  "settings.colorsTitle": "Farby aplikácie",
  "palette.terracota": "Terakota",
  "palette.rosa": "Ružová",
  "palette.lavanda": "Levanduľová",
  "palette.salvia": "Šalviová",
  "palette.celeste": "Blankytná",
  "settings.backupTitle": "Záloha",
  "settings.backupExplain": "Stiahni si súbor so všetkým, čo si uložila (aj s fotkami). Ulož si ho aj inam, napríklad do e-mailu alebo do cloudu.",
  "settings.lastBackup": "Posledná záloha: {date}",
  "settings.noBackupYet": "Zatiaľ si nespravila žiadnu zálohu.",
  "settings.download": "Stiahnuť zálohu",
  "settings.restore": "Obnoviť zálohu",
  "settings.preparing": "Pripravujem zálohu…",
  "settings.downloaded": "Záloha je stiahnutá. Pozri sa do priečinka Stiahnuté súbory.",
  "settings.confirmRestore": "Všetko, čo je teraz v aplikácii, sa nahradí obsahom zálohy. Pokračovať?",
  "settings.restoreFailed": "Zálohu sa nepodarilo obnoviť.",
  "settings.storageTitle": "Úložisko",
  "settings.persistentYes": "Tvoje údaje sú chránené: telefón ich sám nevymaže.",
  "settings.persistentNo": "Telefón tvoje údaje zatiaľ nechráni. Nainštaluj si aplikáciu na plochu a z času na čas si sprav zálohu.",
  "settings.used": "Využité miesto: {mb} MB",
  "settings.dangerTitle": "Vymazať všetko",
  "settings.deleteAll": "Vymazať všetky moje údaje",
  "settings.confirmDelete1": "Vymazať VŠETKO (fotky, poznámky, zoznamy, mená)?",
  "settings.confirmDelete2": "Naozaj? Nedá sa to vrátiť. Bez zálohy sa to stratí navždy.",
  "backup.invalidFile": "Tento súbor nie je záloha aplikácie {app}.",

  // ---------------- Help ----------------
  "help.title": "Pomoc",
  "help.install.title": "📲 Inštalácia aplikácie",
  "help.install.body":
    "Otvor odkaz v Chrome. Ťukni na ponuku ⋮ a vyber „Inštalovať aplikáciu“ (alebo „Pridať na plochu“).\n" +
    "Ikona {app} sa zobrazí ako každá iná aplikácia. Potom funguje aj bez internetu.\n" +
    "Vždy ju otváraj cez túto ikonu: telefón tak lepšie chráni tvoje údaje.",
  "help.home.title": "🏠 Domov",
  "help.home.body":
    "Ukazuje, v ktorom týždni si, koľko dní zostáva do termínu a s akým ovocím alebo zeleninou sa dá v danom týždni porovnať veľkosť bábätka.\n" +
    "Rozmery sú približné: každé bábätko rastie vlastným tempom. Ak sa termín zmení, oprav ho vo Viac → Nastavenia a záloha.",
  "help.diary.title": "📷 Denník",
  "help.diary.body":
    "Každý týždeň si ulož fotku bruška a poznámku. „Odfotiť“ otvorí fotoaparát a „Vybrať z galérie“ tvoje fotky.\n" +
    "Keď máš aspoň dve fotky, „Prehrať album“ ich ukáže jednu po druhej, aby si videla, ako bruško rástlo.",
  "help.counter.title": "⏱️ Časovač",
  "help.counter.body":
    "Kontrakcie: ťukni na veľké tlačidlo, keď sa kontrakcia začne, a znova, keď skončí. Aplikácia zaznamená, ako dlho trvala a koľko času uplynulo od predošlej, a ukáže prehľad za poslednú hodinu. Kým je táto obrazovka otvorená, displej telefónu nezhasne.\n" +
    "Pohyby: začni meranie a pri každom pohybe bábätka raz ťukni.\n" +
    "Aplikácia iba zaznamenáva údaje: vždy sa riaď pokynmi svojho lekára alebo pôrodnej asistentky.",
  "help.lists.title": "✅ Zoznamy",
  "help.lists.body":
    "Zoznamy na prípravu tašky do pôrodnice, dokladov a domácnosti. Odškrtni, čo už máš, pridaj, čo chýba, a odstráň, čo nepotrebuješ. Môžeš si vytvoriť aj nové zoznamy.",
  "help.names.title": "💞 Mená",
  "help.names.body":
    "Najprv pridajte mená, ktoré sa vám páčia. Potom každý z vás postupne hlasuje „áno“ alebo „nie“ a nevidí pritom hlasy toho druhého.\n" +
    "V časti „Zhody“ sa zobrazia mená, ktoré sa páčili vám obom.",
  "help.privacy.title": "🔐 Tvoje údaje",
  "help.privacy.body":
    "Všetko, čo uložíš (meno, dátum, fotky, poznámky, zoznamy, mená), zostáva iba v tomto telefóne. Aplikácia nemá server a nič neposiela na internet.\n" +
    "Ak aplikáciu odinštaluješ alebo vymažeš údaje Chromu pre túto stránku, všetko sa stratí. Na to slúži záloha.",
  "help.backup.title": "💾 Záloha",
  "help.backup.body":
    "Vo Viac → Nastavenia a záloha ťukni na „Stiahnuť zálohu“. Do priečinka Stiahnuté súbory sa uloží súbor so všetkým, aj s fotkami. Rob ju z času na čas a ulož si ju aj inam.\n" +
    "Ak chceš všetko obnoviť (napríklad v novom telefóne), ťukni na „Obnoviť zálohu“ a vyber tento súbor.",
  "help.languageTheme.title": "🌐 Jazyk, tmavý režim a farby",
  "help.languageTheme.body":
    "Tlačidlo s písmenami (ES, EN, SK) vpravo hore prepína jazyk medzi španielčinou, angličtinou a slovenčinou.\n" +
    "Tlačidlo 🌙 / ☀️ prepína medzi tmavým a svetlým režimom. Farby aplikácie si vyberieš vo Viac → Nastavenia a záloha.",
  "help.creator.title": "Autor",
  "help.creator.body": "Aplikáciu {app} vytvoril ako darček:",
};
