export interface Difficulty {
  name: string,
  description: string | undefined,
}

export const difficulties: Difficulty[] = [
  { name: 'Normal', description: 'The normal Mythos setup. Expect the unexpected.' },
  { name: 'No Hard', description: 'All hard Mythos cards removed. Good for beginners.' },
  { name: 'No Easy', description: 'All easy Mythos cards removed. Good for experts.' },
  { name: 'Easy only', description: 'Only easy Mythos cards are used. For a more relaxing apocalypse.' },
  { name: 'Hard only', description: 'Are you sure you wanh̷̗̗̳̤̭̫\'̺͇̳ng̠̟̻̼͡l̴̺̞̣̣͍ͅu̞̥i̗ ͚m̥̗̫͝ͅg̴l͎̕w̦̮\'̟n҉̖̺̼̦̬a̗̕f͟h̢͔ C̳̯̺͙̞ͅt͉h̙̦͚̼͔͡u̱͈̙̩̜l̪̲̙̭̰ͅh͇̼̪̹̱̝͡u ̙̥͕̗̜̓̿̌̔̾̓̆͞R̢̛̹͎͈̙̳̿͑̾͡\'̈́ͦͧͫͨͨ̈͏̠l͇̩͕͎͌͆͊ͥ̒͞ẙ̉̑̔͞҉̠͇̣̖̹̝̺ͅe̛͌̎̐̆̏͂̈͆͏̨̣̱͙͎h̷̦̲͎̥̜̻̹͂ͯ̆̌͗͘͢ ̜͈͒̏͂̉ͥ̄̄̅̚w̛̪͙͍͚̰̫̹̮͓ͤ̂ͦ͛̈̏g̶̳͎ͩ͑̅a̢̱̰̫̱̲̬̝̘̺͑ͫ́̊ͮ͛̔͐̐́ȟ̻̟̻͂̅͗̄́̉̉́͟\'̷͓̰̘̟̫̜̲ͭ̅ṋ̡͓̘̰̙͒̄ͭ͒͑ͧa͉͈͈̜̖̘̅ͣͩͤ̍͛̃̇́̚g̝̬̺͉̫̲̻͆͒ḷ̣̙̘̓ͥ̽ͦ͂ ̨̛̼̣̭̫͔̞ͫ̑́ͅf̶̛̝̞͉̦̤͚̞͔ͬ͒ͪͅh̸̞͍̗̣͉͔̔̒̄̏̄̒̓̽̚t̼̱̪̥̙ͦ̏͗ͩͮ̔̉a̴̯͇͚̿͛̆̃̋g͋̉̀̈̇̚͏͏̠̤̮̖͚̜ͅn̷̴̰̱ͮͨͣͧͅ.̯͇̲̦͖ͭ̍ͥͨͅ' },
  { name: 'Staged', description: 'Mythos cards increase in difficulty with each stage. No hard rumors.' },
  { name: 'Staged (Harder)', description: 'Mythos cards increase in difficulty with each stage. No easy rumors.' },
  { name: 'Custom', description: undefined },
];

export interface Prelude {
  name: string,
  card: string,
  tokens: number,
  notAllowedWith: string,
}

export interface Pack {
  name: string,
  preludes: Prelude[],
  ancientOnes: { name: string, deck: number[] }[],
  cards: string[]
}

export const packs: Pack[] = [
  {
    name: 'Eldritch Horror',
    preludes: [],
    ancientOnes: [ //           G1 Y1 B1 G2 Y2 B2 G3 Y3 B3
      { name: 'Azathoth', deck: [1, 2, 1, 2, 3, 1, 2, 4, 0] },
      { name: 'Cthulhu', deck: [0, 2, 2, 1, 3, 0, 3, 4, 0] },
      { name: 'Shub-Niggurath', deck: [1, 2, 1, 3, 2, 1, 2, 4, 0] },
      { name: 'Yog-Sothoth', deck: [0, 2, 1, 2, 3, 1, 3, 4, 0] },
    ],
    /* card format is
     * COLOR-ID-DIFFICULTY EXPANSION ELDRITCH CLUES
     * with spaces removed
     *
     * COLOR:      blue/yelw/gren
     * ID:         unique ID to avoid name conflicts (not used internally)
     * DIFFICULTY: E/N/H for easy/normal/hard
     * EXPANSION:  single letter code indicating expansion (see index.html)
     * ELDRITCH:   (optional) number of starting eldritch tokens, or - for ongoing but no tokens
     * CLUES:      (optional) a lowercase c if clues can be placed on the card
     */
    cards: ['blue-13-EB3', 'blue-14-HB-', 'blue-15-HB8', 'blue-16-HB3', 'blue-17-NB-', 'blue-18-HB0', 'blue-19-NB4', 'blue-20-NB-c', 'blue-21-EB-', 'blue-22-NB4', 'blue-23-EB4', 'blue-24-EB4', 'gren-16-NB', 'gren-17-EB', 'gren-18-EB', 'gren-19-HB-', 'gren-20-NB', 'gren-21-NB-', 'gren-22-EB', 'gren-24-EB', 'gren-25-HB', 'gren-26-EB', 'gren-27-HB', 'gren-28-NB', 'gren-29-HB', 'gren-30-NB', 'gren-31-HB', 'gren-32-NB', 'gren-33-NB-', 'gren-35-NB', 'yelw-27-NB', 'yelw-28-HB', 'yelw-29-HB', 'yelw-30-NB', 'yelw-31-NB', 'yelw-32-NB', 'yelw-33-NB', 'yelw-34-EB', 'yelw-35-HB', 'yelw-36-EB', 'yelw-37-EB', 'yelw-38-HB', 'yelw-39-NB', 'yelw-40-NB', 'yelw-41-NB', 'yelw-42-EB', 'yelw-43-NB', 'yelw-44-HB', 'yelw-45-EB', 'yelw-46-NB', 'yelw-47-NB'],
  },
  {
    name: 'Forsaken Lore',
    preludes: [],
    ancientOnes: [
      { name: 'Yig', deck: [1, 2, 1, 2, 3, 1, 2, 4, 0] },
    ],
    cards: ['blue-11-HL3', 'blue-12-NL-', 'gren-13-NL', 'gren-15-HL', 'yelw-25-NL', 'yelw-26-HL'],
  },
  {
    name: 'Mountains of Madness',
    preludes: [
      {
        name: 'Rumors From the North',
        card: 'blue-22-NB4',
        tokens: 6,
        notAllowedWith: 'Ithaqua',
      },
    ],
    ancientOnes: [
      { name: 'Ithaqua', deck: [0, 2, 2, 4, 2, 0, 2, 4, 0] },
      { name: 'Rise of the Elder Things', deck: [2, 2, 1, 3, 3, 1, 4, 4, 0] },
    ],
    cards: ['blue-05-NM3', 'blue-06-EM5', 'blue-07-HM-', 'blue-08-HM3', 'blue-09-NM-', 'blue-10-NM4', 'gren-11-HM', 'gren-12-NM', 'gren-14-HM', 'gren-23-HM', 'gren-34-EM', 'gren-36-EM', 'gren-37-NM', 'gren-38-NM-', 'gren-39-NM-', 'yelw-14-NM', 'yelw-15-HM', 'yelw-16-HM', 'yelw-17-HM', 'yelw-18-HM', 'yelw-19-EM', 'yelw-20-NM', 'yelw-21-EM', 'yelw-22-EM', 'yelw-23-NM', 'yelw-24-NM'],
  },
  {
    name: 'Strange Remnants',
    preludes: [],
    ancientOnes: [
      { name: 'Syzygy', deck: [0, 2, 2, 3, 3, 0, 3, 5, 0] },
    ],
    cards: ['blue-00-HR4c', 'blue-01-HR2', 'blue-02-NR-', 'blue-03-NR4', 'blue-04-ER3', 'gren-00-ER', 'gren-01-ER', 'gren-02-NR-', 'gren-03-NR-', 'gren-04-NR', 'gren-05-HR-', 'gren-06-HR', 'yelw-00-NR', 'yelw-01-ER', 'yelw-02-ER', 'yelw-03-HR', 'yelw-04-NR', 'yelw-05-NR', 'yelw-06-HR', 'yelw-07-HR'],
  },
  {
    name: 'Under the Pyramids',
    preludes: [],
    ancientOnes: [
      { name: 'Abhoth', deck: [1, 2, 1, 3, 2, 1, 2, 4, 0] },
      { name: 'Nephren-Ka', deck: [0, 2, 2, 1, 3, 0, 3, 4, 0] },
    ],
    cards: ['blue-36-HP-', 'blue-37-EP-', 'blue-38-NP4', 'blue-39-EP3', 'blue-40-HP0', 'blue-41-NP4', 'gren-07-EP-', 'gren-08-EP', 'gren-09-NP', 'gren-10-NP', 'gren-59-HP', 'gren-60-HP', 'gren-61-HP-', 'gren-62-NP', 'yelw-08-HP', 'yelw-09-NP', 'yelw-10-NP', 'yelw-11-NP', 'yelw-12-HP', 'yelw-13-HP', 'yelw-68-EP', 'yelw-69-EP'],
  },
  {
    name: 'Signs of Carcosa',
    preludes: [
      {
        name: 'The King In Yellow',
        card: 'blue-35-NC1',
        tokens: 2,
        notAllowedWith: 'Hastur',
      },
    ],
    ancientOnes: [
      { name: 'Hastur', deck: [0, 2, 2, 2, 3, 0, 3, 5, 0] },
    ],
    cards: ['blue-31-NC-c', 'blue-32-HC2', 'blue-33-HC5', 'blue-34-NC3', 'blue-35-NC1', 'blue-42-EC4', 'gren-48-NC-', 'gren-49-NC', 'gren-50-NC', 'gren-51-EC', 'gren-52-EC', 'gren-54-HC-', 'gren-55-HC', 'gren-56-NC-', 'yelw-58-NC', 'yelw-59-NC', 'yelw-60-NC', 'yelw-61-EC', 'yelw-62-EC', 'yelw-63-HC', 'yelw-64-HC', 'yelw-65-HC', 'yelw-66-NC', 'yelw-67-NC'],
  },
  {
    name: 'The Dreamlands',
    preludes: [
      {
        name: 'Web Between Worlds',
        card: 'blue-16-HB3',
        tokens: 4,
        notAllowedWith: 'Atlach-Nacha',
      },
    ],
    ancientOnes: [
      { name: 'Atlach-Nacha', deck: [1, 2, 1, 3, 2, 1, 2, 4, 0] },
      { name: 'Hypnos', deck: [0, 2, 1, 2, 3, 1, 3, 4, 0] },
    ],
    cards: ['blue-25-ED-', 'blue-26-ND3', 'blue-27-ND3', 'blue-28-ND3c', 'blue-29-HD-', 'blue-30-HD3', 'gren-40-ED', 'gren-41-ED', 'gren-42-ND', 'gren-43-ND-', 'gren-44-ND-', 'gren-45-HD', 'gren-46-HD', 'gren-47-HD', 'yelw-48-ED', 'yelw-49-ED', 'yelw-50-ND', 'yelw-51-ND', 'yelw-52-ND', 'yelw-53-ND', 'yelw-54-ND', 'yelw-55-HD', 'yelw-56-HD', 'yelw-57-HD'],
  },
  {
    name: 'Cities in Ruin',
    preludes: [],
    ancientOnes: [
      { name: 'Shudde M\'ell', deck: [0, 2, 2, 4, 2, 0, 2, 4, 0] },
    ],
    cards: ['blue-43-HS-', 'blue-44-NS3', 'blue-45-ES3', 'gren-63-HS', 'gren-64-HS-', 'gren-65-NS', 'gren-66-NS', 'gren-67-NS-', 'gren-68-NS', 'gren-69-HS-', 'gren-70-ES', 'gren-71-ES-', 'yelw-70-HS', 'yelw-71-HS', 'yelw-72-HS', 'yelw-73-NS', 'yelw-74-NS', 'yelw-75-NS', 'yelw-76-NS', 'yelw-77-HS', 'yelw-78-NS', 'yelw-79-ES', 'yelw-80-ES', 'yelw-81-ES'],
  },
  {
    name: 'Masks of Nyarlathotep',
    preludes: [],
    ancientOnes: [
      { name: 'Antediluvium', deck: [1, 2, 1, 2, 3, 1, 2, 4, 0] },
      { name: 'Nyarlathotep', deck: [1, 2, 1, 2, 3, 1, 2, 4, 0] },
    ],
    cards: ['blue-46-HN0', 'gren-72-NN', 'gren-73-EN', 'gren-74-EN', 'gren-75-NN', 'gren-76-EN', 'gren-77-NN', 'gren-78-HN', 'gren-79-HN', 'gren-80-NN-', 'yelw-82-NN', 'yelw-83-EN', 'yelw-84-EN', 'yelw-85-EN', 'yelw-86-HN', 'yelw-87-NN', 'yelw-88-HN', 'yelw-89-NN', 'yelw-90-NN', 'yelw-91-HN'],
  },
];
