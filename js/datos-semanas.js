/*
 * datos-semanas.js — Baby size comparison for each pregnancy week (4 to 40).
 *
 * What it does:  provides window.WEEK_DATA, used by the home screen to say
 *                "your baby is the size of ...", in the three app languages.
 * Source:        Alabama Cooperative Extension System, "From Seed to Melon"
 *                (FCS-2098). Original values are in inches/ounces/pounds; they
 *                were converted to cm and grams and rounded. The source itself
 *                says these are approximate and healthy babies come in many sizes.
 *                https://www.aces.edu/wp-content/uploads/2019/09/FCS-2098_FromSeedtoMelonCustom_061918_FORM.pdf
 * How to use:    WEEK_DATA[week] -> { emoji, es, en, sk, cm, grams }
 *                - es/en/sk: the comparison; es/en include the article
 *                  ("una fresa", "a strawberry"); Slovak has no articles.
 *                - cm / grams: a number, a [min, max] range, or null when the
 *                  source gives no value. "cmLessThan" marks "less than X cm".
 * Depends on:    nothing.
 */

window.WEEK_DATA = {
  4:  { emoji: "🌱", es: "una semilla de kiwi",     en: "a kiwi seed",          sk: "semienko kiwi",          cm: null, grams: null },
  5:  { emoji: "🍏", es: "una semilla de manzana",  en: "an apple seed",        sk: "jadierko jablka",        cm: 0.6, cmLessThan: true, grams: null },
  6:  { emoji: "🫛", es: "un guisante",             en: "a pea",                sk: "hrášok",                 cm: 0.8,  grams: null },
  7:  { emoji: "🫐", es: "un arándano",             en: "a blueberry",          sk: "čučoriedka",             cm: 1.3,  grams: null },
  8:  { emoji: "🍇", es: "una uva",                 en: "a grape",              sk: "bobuľa hrozna",          cm: 1.7,  grams: null },
  9:  { emoji: "🟣", es: "un higo",                 en: "a fig",                sk: "figa",                   cm: 1.9,  grams: null },
  10: { emoji: "🍓", es: "una fresa",               en: "a strawberry",         sk: "jahoda",                 cm: 3.2,  grams: 7 },
  11: { emoji: "🍋", es: "una lima",                en: "a lime",               sk: "limetka",                cm: 5,    grams: 9 },
  12: { emoji: "🥕", es: "una zanahoria pequeña",   en: "a baby carrot",        sk: "malá mrkva",             cm: 6.4,  grams: 14 },
  13: { emoji: "🍋", es: "un limón",                en: "a lemon",              sk: "citrón",                 cm: 7,    grams: 21 },
  14: { emoji: "🍑", es: "un melocotón",            en: "a peach",              sk: "broskyňa",               cm: 8.9,  grams: 43 },
  15: { emoji: "🍎", es: "una manzana",             en: "an apple",             sk: "jablko",                 cm: 10,   grams: 66 },
  16: { emoji: "🥑", es: "un aguacate",             en: "an avocado",           sk: "avokádo",                cm: 11.4, grams: 94 },
  17: { emoji: "🍅", es: "un tomate",               en: "a tomato",             sk: "paradajka",              cm: 12.7, grams: 156 },
  18: { emoji: "🫑", es: "un pimiento",             en: "a bell pepper",        sk: "paprika",                cm: 14,   grams: 198 },
  19: { emoji: "🥭", es: "un mango",                en: "a mango",              sk: "mango",                  cm: 15.2, grams: 227 },
  20: { emoji: "🍠", es: "una batata",              en: "a sweet potato",       sk: "batát",                  cm: 16.1, grams: 283 },
  21: { emoji: "🍎", es: "una granada",             en: "a pomegranate",        sk: "granátové jablko",       cm: 27.9, grams: 354 },
  22: { emoji: "🥕", es: "una zanahoria",           en: "a carrot",             sk: "mrkva",                  cm: 27.9, grams: 454 },
  23: { emoji: "🥒", es: "un calabacín amarillo",   en: "a yellow squash",      sk: "žltá cuketa",            cm: 28.6, grams: 567 },
  24: { emoji: "🌽", es: "una mazorca de maíz",     en: "an ear of corn",       sk: "kukuričný klas",         cm: 29.8, grams: 605 },
  25: { emoji: "🥔", es: "un nabo sueco",           en: "a rutabaga",           sk: "kvaka",                  cm: 34.3, grams: 680 },
  26: { emoji: "🥬", es: "una lechuga",             en: "a head of lettuce",    sk: "hlávkový šalát",         cm: 35.6, grams: 794 },
  27: { emoji: "🎃", es: "una calabaza bellota",    en: "an acorn squash",      sk: "žaluďová tekvica",       cm: 36.8, grams: 907 },
  28: { emoji: "🥦", es: "una coliflor",            en: "a cauliflower",        sk: "karfiol",                cm: 37.5, grams: 1020 },
  29: { emoji: "🍆", es: "una berenjena",           en: "an eggplant",          sk: "baklažán",               cm: 38.1, grams: 1130 },
  30: { emoji: "🥥", es: "un coco",                 en: "a coconut",            sk: "kokosový orech",         cm: 40,   grams: 1360 },
  31: { emoji: "🥬", es: "un repollo",              en: "a cabbage",            sk: "hlávka kapusty",         cm: 41.3, grams: 1510 },
  32: { emoji: "🍍", es: "una piña",                en: "a pineapple",          sk: "ananás",                 cm: 42.5, grams: 1510 },
  33: { emoji: "🥭", es: "una papaya",              en: "a papaya",             sk: "papája",                 cm: 43.8, grams: 1930 },
  34: { emoji: "🎃", es: "una calabaza alargada",   en: "a butternut squash",   sk: "maslová tekvica",        cm: 45.1, grams: 2150 },
  35: { emoji: "🍈", es: "un melón",                en: "a cantaloupe",         sk: "cukrový melón",          cm: 46.4, grams: 2380 },
  36: { emoji: "🥬", es: "un puerro",               en: "a leek",               sk: "pór",                    cm: 47,   grams: 2610 },
  37: { emoji: "🍈", es: "un melón verde",          en: "a honeydew melon",     sk: "medový melón",           cm: 48.9, grams: 2870 },
  38: { emoji: "🍈", es: "un melón grande",         en: "a large melon",        sk: "veľký melón",            cm: 49.5, grams: 3060 },
  39: { emoji: "🎃", es: "una calabaza",            en: "a pumpkin",            sk: "tekvica",                cm: 50.2, grams: 3290 },
  40: { emoji: "🍉", es: "una sandía",              en: "a watermelon",         sk: "vodný melón",            cm: [46, 51], grams: [2700, 3600] },
};

// First and last week that have data in the table above.
window.WEEK_DATA_FIRST = 4;
window.WEEK_DATA_LAST = 40;
