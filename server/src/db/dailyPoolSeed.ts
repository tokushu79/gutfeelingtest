// Fallback pool of verified, extremely obscure trivia questions used to
// auto-rotate the Daily Impossible Question whenever the admin hasn't
// scheduled a specific question for the current date.
export interface DailyPoolItem {
  text: string;
  choices: string[];
  correctChoiceIndex: number;
}

export const dailyPoolSeed: DailyPoolItem[] = [
  {
    text: "The Anglo-Zanzibar War of 1896, the shortest recorded war in history, lasted approximately how long?",
    choices: ["About 38 minutes", "About 3 hours", "About 1 day", "About 1 week"],
    correctChoiceIndex: 0,
  },
  {
    text: "Fermat's Last Theorem, scribbled in a book margin in 1637, was finally proven in 1994 by which mathematician?",
    choices: ["Andrew Wiles", "Andrew Wolfe", "Michael Atiyah", "Roger Penrose"],
    correctChoiceIndex: 0,
  },
  {
    text: "In the Monty Hall probability puzzle, switching your initial choice after a wrong door is revealed changes your odds of winning to what fraction?",
    choices: ["2/3", "1/2", "1/3", "3/4"],
    correctChoiceIndex: 0,
  },
  {
    text: "Vincent van Gogh is believed to have sold only one painting during his lifetime. What was its title?",
    choices: ["The Red Vineyard", "Starry Night", "Sunflowers", "The Potato Eaters"],
    correctChoiceIndex: 0,
  },
  {
    text: "The 'Great Emu War' of 1932 saw the Australian military deployed with machine guns against an overwhelming population of which bird?",
    choices: ["Emus", "Ostriches", "Cassowaries", "Wild turkeys"],
    correctChoiceIndex: 0,
  },
  {
    text: "Hydrogen, the simplest element, makes up approximately what percentage of all atoms in the observable universe?",
    choices: ["About 90%", "About 50%", "About 25%", "About 99%"],
    correctChoiceIndex: 0,
  },
  {
    text: "The mysterious 1959 'Dyatlov Pass incident,' involving the deaths of nine hikers, took place in which mountain range?",
    choices: ["Ural Mountains", "Caucasus Mountains", "Altai Mountains", "Carpathian Mountains"],
    correctChoiceIndex: 0,
  },
  {
    text: "Charles Darwin's famous survey voyage aboard HMS Beagle lasted approximately how many years?",
    choices: ["5 years", "2 years", "10 years", "1 year"],
    correctChoiceIndex: 0,
  },
  {
    text: "NASA's Curiosity rover, which landed on Mars in 2012, is powered by what kind of energy source rather than solar panels?",
    choices: [
      "A radioisotope thermoelectric generator (nuclear decay)",
      "Solar panels",
      "A hydrogen fuel cell",
      "A lithium battery only",
    ],
    correctChoiceIndex: 0,
  },
  {
    text: "Which country became the first in the world to grant women the right to vote in national elections, in 1893?",
    choices: ["New Zealand", "Finland", "Australia", "United Kingdom"],
    correctChoiceIndex: 0,
  },
];
