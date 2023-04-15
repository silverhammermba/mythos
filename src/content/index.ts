export const difficulties = [
  { name: 'Normal', description: 'The normal Mythos setup. Expect the unexpected.' },
  { name: 'No Hard', description: 'All hard Mythos cards removed. Good for beginners.' },
  { name: 'No Easy', description: 'All easy Mythos cards removed. Good for experts.' },
  { name: 'Easy only', description: 'Only easy Mythos cards are used. For a more relaxing apocalypse.' },
  { name: 'Hard only', description: 'Are you sure you wanh̷̗̗̳̤̭̫\'̺͇̳ng̠̟̻̼͡l̴̺̞̣̣͍ͅu̞̥i̗ ͚m̥̗̫͝ͅg̴l͎̕w̦̮\'̟n҉̖̺̼̦̬a̗̕f͟h̢͔ C̳̯̺͙̞ͅt͉h̙̦͚̼͔͡u̱͈̙̩̜l̪̲̙̭̰ͅh͇̼̪̹̱̝͡u ̙̥͕̗̜̓̿̌̔̾̓̆͞R̢̛̹͎͈̙̳̿͑̾͡\'̈́ͦͧͫͨͨ̈͏̠l͇̩͕͎͌͆͊ͥ̒͞ẙ̉̑̔͞҉̠͇̣̖̹̝̺ͅe̛͌̎̐̆̏͂̈͆͏̨̣̱͙͎h̷̦̲͎̥̜̻̹͂ͯ̆̌͗͘͢ ̜͈͒̏͂̉ͥ̄̄̅̚w̛̪͙͍͚̰̫̹̮͓ͤ̂ͦ͛̈̏g̶̳͎ͩ͑̅a̢̱̰̫̱̲̬̝̘̺͑ͫ́̊ͮ͛̔͐̐́ȟ̻̟̻͂̅͗̄́̉̉́͟\'̷͓̰̘̟̫̜̲ͭ̅ṋ̡͓̘̰̙͒̄ͭ͒͑ͧa͉͈͈̜̖̘̅ͣͩͤ̍͛̃̇́̚g̝̬̺͉̫̲̻͆͒ḷ̣̙̘̓ͥ̽ͦ͂ ̨̛̼̣̭̫͔̞ͫ̑́ͅf̶̛̝̞͉̦̤͚̞͔ͬ͒ͪͅh̸̞͍̗̣͉͔̔̒̄̏̄̒̓̽̚t̼̱̪̥̙ͦ̏͗ͩͮ̔̉a̴̯͇͚̿͛̆̃̋g͋̉̀̈̇̚͏͏̠̤̮̖͚̜ͅn̷̴̰̱ͮͨͣͧͅ.̯͇̲̦͖ͭ̍ͥͨͅ' },
  { name: 'Staged', description: 'Mythos cards increase in difficulty with each stage.' },
  { name: 'Custom', description: undefined },
];

export const packs = [
  {
    name: 'Eldritch Horror',
    ancientOnes: [ //           G1 Y1 B1 G2 Y2 B2 G3 Y3 B3
      { name: 'Azathoth', deck: [1, 2, 1, 2, 3, 1, 2, 4, 0] },
      { name: 'Cthulhu', deck: [0, 2, 2, 1, 3, 0, 3, 4, 0] },
      { name: 'Shub-Niggurath', deck: [1, 2, 1, 3, 2, 1, 2, 4, 0] },
      { name: 'Yog-Sothoth', deck: [0, 2, 1, 2, 3, 1, 3, 4, 0] },
    ],
  },
  {
    name: 'Forsaken Lore',
    ancientOnes: [
      { name: 'Yig', deck: [1, 2, 1, 2, 3, 1, 2, 4, 0] },
    ],
  },
  {
    name: 'Mountains of Madness',
    ancientOnes: [
      { name: 'Ithaqua', deck: [0, 2, 2, 4, 2, 0, 2, 4, 0] },
      { name: 'Rise of the Elder Things', deck: [2, 2, 1, 3, 3, 1, 4, 4, 0] },
    ],
  },
  {
    name: 'Strange Remnants',
    ancientOnes: [
      { name: 'Syzygy', deck: [0, 2, 2, 3, 3, 0, 3, 5, 0] },
    ],
  },
  {
    name: 'Under the Pyramids',
    ancientOnes: [
      { name: 'Abhoth', deck: [1, 2, 1, 3, 2, 1, 2, 4, 0] },
      { name: 'Nephren-Ka', deck: [0, 2, 2, 1, 3, 0, 3, 4, 0] },
    ],
  },
  {
    name: 'Signs of Carcosa',
    ancientOnes: [
      { name: 'Hastur', deck: [0, 2, 2, 2, 3, 0, 3, 5, 0] },
    ],
  },
  {
    name: 'The Dreamlands',
    ancientOnes: [
      { name: 'Atlach-Nacha', deck: [1, 2, 1, 3, 2, 1, 2, 4, 0] },
      { name: 'Hypnos', deck: [0, 2, 1, 2, 3, 1, 3, 4, 0] },
    ],
  },
  {
    name: 'Cities in Ruin',
    ancientOnes: [
      { name: 'Shudde M\'ell', deck: [0, 2, 2, 4, 2, 0, 2, 4, 0] },
    ],
  },
  {
    name: 'Masks of Nyarlathotep',
    ancientOnes: [
      { name: 'Antediluvium', deck: [1, 2, 1, 2, 3, 1, 2, 4, 0] },
      { name: 'Nyarlathotep', deck: [1, 2, 1, 2, 3, 1, 2, 4, 0] },
    ],
  },
];
