/*
 * textos-es.js — All the app texts in SPANISH.
 *
 * What it does:  dictionary "key -> text" read by idiomas.js (function t).
 * How to use:    to change a text, edit it here (and in textos-en.js /
 *                textos-sk.js for the other languages). Keep the same keys in
 *                the three files. {words} in braces are replaced by values.
 *                Help texts use "\n" to separate paragraphs.
 * Depends on:    nothing. Loaded before idiomas.js.
 */

window.TEXTS_ES = {
  // ---------------- Tabs, header and common buttons ----------------
  "tabs.home": "Inicio",
  "tabs.diary": "Diario",
  "tabs.counter": "Contador",
  "tabs.lists": "Listas",
  "tabs.more": "Más",
  "header.back": "Volver",
  "header.language": "Cambiar idioma",
  "header.lightMode": "Modo claro",
  "header.darkMode": "Modo oscuro",
  "common.add": "Agregar",
  "common.cancel": "Cancelar",
  "common.close": "Cerrar",
  "common.remove": "Quitar",
  "common.save": "Guardar",
  "common.saved": "Guardado",

  // ---------------- Welcome ----------------
  "welcome.title": "Bienvenida",
  "welcome.giftFrom": "Un regalo de {name}",
  "welcome.yourName": "¿Cómo te llamas?",
  "welcome.whichDate": "¿Qué fecha conoces?",
  "welcome.optionDue": "La fecha probable de parto",
  "welcome.optionLastPeriod": "El primer día de mi última menstruación",
  "welcome.dueDate": "Fecha probable de parto",
  "welcome.lastPeriod": "Primer día de la última menstruación",
  "welcome.calculated": "Fecha probable de parto calculada: {date}. Si tu médico te dio otra, usa esa.",
  "welcome.partnerName": "Nombre de tu pareja",
  "welcome.partnerHint": "(opcional, para el juego de nombres)",
  "welcome.start": "Empezar",
  "welcome.restore": "Ya tengo una copia de seguridad: restaurarla",

  // ---------------- Home ----------------
  "home.title": "Inicio",
  "home.hello": "Hola, {name}",
  "home.dueDate": "Fecha probable: {date}",
  "home.weeks.one": "semana",
  "home.weeks.other": "semanas",
  "home.plusDays.one": "y 1 día",
  "home.plusDays.other": "y {n} días",
  "home.trimester": "{n}.º trimestre · {percent} % del camino",
  "home.daysLeft.one": "¡Falta {days} día!",
  "home.daysLeft.other": "Faltan {days} días",
  "home.dueToday": "¡Hoy es la fecha probable!",
  "home.pastDays.one": "Pasó 1 día de la fecha probable. ¡Ya casi!",
  "home.pastDays.other": "Pasaron {n} días de la fecha probable. ¡Ya casi!",
  "home.tooSmall": "Tu bebé todavía es diminuto. Desde la semana {week} verás aquí con qué se compara su tamaño.",
  "home.sizeOf": "Tu bebé tiene el tamaño de {item}.",
  "home.lengthAndWeight": "Mide unos {length} y pesa unos {weight}.",
  "home.lengthOnly": "Mide unos {length}.",
  "home.lessThan": "Mide menos de {length}.",
  "home.range": "{min} a {max}",
  "home.sizeNote": "Medidas aproximadas: cada bebé crece a su propio ritmo.",
  "home.photoAsk": "¿Le sacas una foto a la panza?",
  "home.photoAskHint": "Una foto por semana y al final tendrás tu álbum.",
  "home.photoDone": "Ya guardaste la foto de esta semana",
  "home.photoDoneHint": "Mira cómo vas en el diario.",

  // ---------------- Diary ----------------
  "diary.title": "Diario",
  "diary.newEntry": "Nueva entrada",
  "diary.editEntry": "Editar entrada",
  "diary.album": "Ver álbum",
  "diary.empty": "Todavía no hay entradas. Empieza con una foto de la panza de esta semana.",
  "diary.week": "Semana {week}",
  "diary.weekLabel": "Semana",
  "diary.choosePhoto": "Elegir o sacar foto",
  "diary.changePhoto": "Cambiar foto",
  "diary.preparingPhoto": "Preparando la foto…",
  "diary.note": "Nota",
  "diary.notePlaceholder": "¿Cómo te sentiste? ¿Algo especial esta semana?",
  "diary.deleteEntry": "Borrar entrada",
  "diary.confirmDelete": "¿Borrar esta entrada y su foto? No se puede deshacer.",
  "album.previous": "Anterior",
  "album.pause": "Pausa",
  "album.next": "Siguiente",

  // ---------------- Contraction timer and movement counter ----------------
  "counter.title": "Contador",
  "counter.contractions": "Contracciones",
  "counter.kicks": "Movimientos",
  "counter.contractionStarted": "Empezó una contracción",
  "counter.contractionEnded": "Toca cuando termine",
  "counter.hospitalNote": "Sigue las indicaciones de tu médico o partera sobre cuándo ir al hospital.",
  "counter.lastContractions": "Últimas contracciones",
  "counter.start": "Inicio",
  "counter.duration": "Duración",
  "counter.sincePrevious": "Desde la anterior",
  "counter.inProgress": "en curso",
  "counter.clearHistory": "Borrar historial",
  "counter.confirmClear": "¿Borrar todas las contracciones registradas?",
  "counter.lastHour": "Última hora",
  "counter.contractionsLower": "contracciones",
  "counter.averageDuration": "duración media",
  "counter.averageInterval": "cada (media)",
  "counter.startKicks": "Empezar a contar movimientos",
  "counter.tapEachKick": "Toca con cada movimiento",
  "counter.undoOne": "Deshacer uno",
  "counter.finish": "Terminar",
  "counter.kicksNote": "Si notas algo distinto en los movimientos de tu bebé, consulta con tu médico o partera.",
  "counter.previousSessions": "Sesiones anteriores",
  "counter.day": "Día",
  "counter.time": "Tiempo",

  // ---------------- Checklists ----------------
  "lists.title": "Listas",
  "lists.hospitalHint": "Pregunta en tu hospital qué piden llevar: cada lugar tiene sus reglas.",
  "lists.addItem": "Agregar algo…",
  "lists.deleteList": "Borrar esta lista",
  "lists.confirmDelete": "¿Borrar la lista \"{name}\"?",
  "lists.newListName": "Nombre de una lista nueva",
  "lists.createList": "Crear lista",
  "lists.bagMom": "👜 Bolso del hospital: para ti",
  "lists.bagMom.item1": "Camisón o pijama cómodo que abra adelante",
  "lists.bagMom.item2": "Bata y pantuflas",
  "lists.bagMom.item3": "Ropa interior cómoda (varias)",
  "lists.bagMom.item4": "Sostenes de lactancia",
  "lists.bagMom.item5": "Toallas higiénicas de posparto",
  "lists.bagMom.item6": "Cepillo de dientes, champú y peine",
  "lists.bagMom.item7": "Cargador del teléfono con cable largo",
  "lists.bagMom.item8": "Ropa cómoda para volver a casa",
  "lists.bagMom.item9": "Algo para picar y una botella de agua",
  "lists.bagBaby": "🍼 Bolso del hospital: para el bebé",
  "lists.bagBaby.item1": "Bodies (3 o 4)",
  "lists.bagBaby.item2": "Pijamas enteros (3 o 4)",
  "lists.bagBaby.item3": "Gorrito y medias",
  "lists.bagBaby.item4": "Manta para arroparlo",
  "lists.bagBaby.item5": "Pañales de recién nacido",
  "lists.bagBaby.item6": "Toallitas húmedas",
  "lists.bagBaby.item7": "Ropa para la salida del hospital",
  "lists.bagBaby.item8": "Silla de auto instalada",
  "lists.documents": "📄 Documentos",
  "lists.documents.item1": "Documento de identidad",
  "lists.documents.item2": "Tarjeta del seguro médico",
  "lists.documents.item3": "Carnet o controles del embarazo",
  "lists.documents.item4": "Plan de parto (si tienes uno)",
  "lists.beforeArrival": "🏠 Antes de la llegada",
  "lists.beforeArrival.item1": "Cuna o moisés armado",
  "lists.beforeArrival.item2": "Cambiador",
  "lists.beforeArrival.item3": "Bañera",
  "lists.beforeArrival.item4": "Ropa del bebé lavada",
  "lists.beforeArrival.item5": "Cochecito",
  "lists.beforeArrival.item6": "Comida congelada para los primeros días",

  // ---------------- Names game ----------------
  "names.title": "Nombres",
  "names.playerA": "Mamá",
  "names.playerB": "Pareja",
  "names.viewAdd": "Nombres",
  "names.viewVote": "Votar",
  "names.viewMatches": "Coinciden",
  "names.addLabel": "Agrega nombres que te gusten",
  "names.addPlaceholder": "Puedes poner varios separados por comas",
  "names.kind": "Tipo de nombre",
  "names.girl": "Niña",
  "names.boy": "Niño",
  "names.any": "Cualquiera",
  "names.empty": "Todavía no hay nombres. Agreguen los que les gusten a los dos.",
  "names.whoVotes": "¿Quién vota ahora? Los votos del otro no se muestran.",
  "names.votingAs": "Vota: {name}",
  "names.remaining.one": "queda 1",
  "names.remaining.other": "quedan {n}",
  "names.no": "No",
  "names.yes": "Sí",
  "names.allVoted": "¡Ya votaste todos los nombres!",
  "names.changeVoter": "Cambiar de persona",
  "names.noMatches": "Todavía no hay coincidencias. Cuando los dos voten «sí» al mismo nombre, aparecerá aquí.",
  "names.resetVotes": "Reiniciar votos",
  "names.confirmReset": "¿Borrar todos los votos? Los nombres se conservan.",

  // ---------------- "More" menu ----------------
  "more.title": "Más",
  "more.namesHint": "Elijan juntos el nombre del bebé",
  "more.settingsHint": "Tus datos y la copia de seguridad",
  "more.helpHint": "Cómo funciona cada parte de la app",

  // ---------------- Settings and backup ----------------
  "settings.title": "Ajustes y copia",
  "settings.yourData": "Tus datos",
  "settings.colorsTitle": "Colores de la app",
  "palette.terracota": "Terracota",
  "palette.rosa": "Rosa",
  "palette.lavanda": "Lavanda",
  "palette.salvia": "Salvia",
  "palette.celeste": "Celeste",
  "settings.backupTitle": "Copia de seguridad",
  "settings.backupExplain": "Descarga un archivo con todo lo que guardaste (fotos incluidas). Guárdalo también en otro lado, por ejemplo en tu correo o en la nube.",
  "settings.lastBackup": "Última copia: {date}",
  "settings.noBackupYet": "Todavía no hiciste ninguna copia.",
  "settings.download": "Descargar copia",
  "settings.restore": "Restaurar copia",
  "settings.preparing": "Preparando la copia…",
  "settings.downloaded": "Copia descargada. Revisa la carpeta Descargas.",
  "settings.confirmRestore": "Esto reemplaza todo lo que hay ahora en la app por el contenido de la copia. ¿Continuar?",
  "settings.restoreFailed": "No se pudo restaurar la copia.",
  "settings.storageTitle": "Almacenamiento",
  "settings.persistentYes": "Tus datos están protegidos: el teléfono no los borrará solo.",
  "settings.persistentNo": "El teléfono todavía no protege tus datos. Instala la app en la pantalla de inicio y haz copias de vez en cuando.",
  "settings.used": "Espacio usado: {mb} MB",
  "settings.dangerTitle": "Borrar todo",
  "settings.deleteAll": "Borrar todos mis datos",
  "settings.confirmDelete1": "¿Borrar TODO (fotos, notas, listas, nombres)?",
  "settings.confirmDelete2": "¿Seguro? No se puede deshacer. Si no tienes una copia, se pierde para siempre.",
  "backup.invalidFile": "El archivo no es una copia de {app}.",

  // ---------------- Help ----------------
  "help.title": "Ayuda",
  "help.install.title": "📲 Instalar la app",
  "help.install.body":
    "Abre el enlace en Chrome. Toca el menú ⋮ y elige «Instalar app» (o «Agregar a la pantalla principal»).\n" +
    "Aparecerá el ícono de {app} como el de cualquier otra app. Después funciona sin internet.\n" +
    "Úsala siempre desde ese ícono: así el teléfono protege mejor tus datos.",
  "help.home.title": "🏠 Inicio",
  "help.home.body":
    "Muestra en qué semana estás, cuántos días faltan para la fecha probable y con qué fruta o verdura se compara el tamaño de tu bebé esa semana.\n" +
    "Las medidas son aproximadas: cada bebé crece a su ritmo. Si la fecha probable cambia, corrígela en Más → Ajustes y copia.",
  "help.diary.title": "📷 Diario",
  "help.diary.body":
    "Guarda una foto de la panza y una nota cada semana. Puedes sacar la foto en el momento o elegir una de la galería.\n" +
    "Con dos fotos o más, «Ver álbum» las pasa una tras otra para ver cómo creció la panza.",
  "help.counter.title": "⏱️ Contador",
  "help.counter.body":
    "Contracciones: toca el botón grande cuando empieza una contracción y otra vez cuando termina. La app anota cuánto duró y cuánto tiempo pasó desde la anterior, y muestra un resumen de la última hora. Mientras esta pantalla está abierta, la pantalla del teléfono no se apaga.\n" +
    "Movimientos: empieza una sesión y toca una vez con cada movimiento del bebé.\n" +
    "La app solo registra datos: sigue siempre las indicaciones de tu médico o partera.",
  "help.lists.title": "✅ Listas",
  "help.lists.body":
    "Listas para preparar el bolso del hospital, los documentos y la casa. Marca lo que ya tienes, agrega lo que falte y quita lo que no necesites. También puedes crear listas nuevas.",
  "help.names.title": "💞 Nombres",
  "help.names.body":
    "Primero agreguen los nombres que les gusten. Después, cada uno vota por turnos «sí» o «no», sin ver los votos del otro.\n" +
    "En «Coinciden» aparecen los nombres que a los dos les gustaron.",
  "help.privacy.title": "🔐 Tus datos",
  "help.privacy.body":
    "Todo lo que guardas (nombre, fecha, fotos, notas, listas, nombres) queda solo en este teléfono. La app no tiene servidor y no envía nada a internet.\n" +
    "Si desinstalas la app o borras los datos de Chrome de este sitio, se pierde todo. Por eso existe la copia de seguridad.",
  "help.backup.title": "💾 Copia de seguridad",
  "help.backup.body":
    "En Más → Ajustes y copia, toca «Descargar copia». Se guarda en Descargas un archivo con todo, fotos incluidas. Conviene hacerla de vez en cuando y guardarla también en otro lado.\n" +
    "Para recuperar todo (por ejemplo, en un teléfono nuevo), toca «Restaurar copia» y elige ese archivo.",
  "help.languageTheme.title": "🌐 Idioma, modo oscuro y colores",
  "help.languageTheme.body":
    "El botón con las letras (ES, EN, SK) arriba a la derecha cambia el idioma entre español, inglés y eslovaco.\n" +
    "El botón 🌙 / ☀️ cambia entre modo oscuro y modo claro. Los colores de la app se eligen en Más → Ajustes y copia.",
  "help.creator.title": "Creador",
  "help.creator.body": "{app} fue creada como regalo por:",
};
