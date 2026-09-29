import { flightDirections } from "../flight-core.js";

export const diskSelectorSteps = [
  {
    id: "experience",
    title: "Hvor mye har du spilt?",
    help: "Velg det som ligner mest på deg.",
    options: [
      { value: "never", label: "Aldri spilt" },
      { value: "beginner", label: "Nybegynner" },
      { value: "some", label: "Litt erfaring" },
      { value: "intermediate", label: "Viderekommen" },
      { value: "experienced", label: "Erfaren" }
    ]
  },
  {
    id: "distance",
    title: "Hvor langt flyr de fleste kastene dine?",
    help: "Tenk på vanlige kast, ikke det lengste du noen gang har fått til.",
    options: [
      { value: "under50", label: "Under 50 m" },
      { value: "50-70", label: "50-70 m" },
      { value: "70-90", label: "70-90 m" },
      { value: "90-110", label: "90-110 m" },
      { value: "110plus", label: "110 m+" },
      { value: "unknown", label: "Vet ikke ennå" }
    ]
  },
  {
    id: "throw",
    title: "Hvilket kast bruker du mest?",
    help: "Velg kastet du stoler mest på i en runde.",
    options: [
      { value: "backhand", label: "Backhand" },
      { value: "forehand", label: "Forehand" },
      { value: "both", label: "Begge" }
    ]
  },
  {
    id: "goal",
    title: "Hva vil du få til nå?",
    help: "Velg det som ville hjulpet deg mest på neste runde.",
    options: [
      { value: "distance", label: "Kaste lengre" },
      { value: "control", label: "Treffe linjen oftere" },
      { value: "straight", label: "Kaste rettere" },
      { value: "easy", label: "Få disken lettere av gårde" },
      { value: "putting", label: "Putte bedre" },
      { value: "approach", label: "Legge innspill nærmere kurven" }
    ]
  },
  {
    id: "problem",
    title: "Hva skjer oftest når kastet blir dårlig?",
    help: "Se retningen fra der du kaster. Diskvalg og teknikk kan begge spille inn.",
    options: [
      { value: "early-left", label: "Den svinger tidlig til venstre" },
      { value: "early-right", label: "Den svinger tidlig til høyre" },
      { value: "finish-left", label: "Den avslutter hardt til venstre" },
      { value: "finish-right", label: "Den avslutter hardt til høyre" },
      { value: "stall", label: "Den stopper opp og faller" },
      { value: "short", label: "Den flyr for kort" },
      { value: "line", label: "Jeg bommer på linjen" },
      { value: "unknown", label: "Jeg vet ikke" }
    ]
  }
];

export const resultLinks = [
  { label: "Beste disker for nybegynnere", href: "/utstyr/beste-discgolfdisker-for-nybegynnere.html" },
  { label: "Hvordan kaste backhand", href: "/guider/backhand-for-nybegynnere.html" },
  { label: "Hvordan velge disk", href: "/guider/hvilken-discgolfdisk-skal-jeg-velge.html" }
];

export const conditionalSteps = {
  problemStyle: {
    id: "problemStyle", title: "Hvilket kast gjelder problemet?",
    help: "Backhand og forehand svinger vanligvis motsatt vei.",
    options: [{ value: "backhand", label: "Backhand" }, { value: "forehand", label: "Forehand" }]
  },
  handedness: {
    id: "handedness", title: "Hvilken hånd kaster du med?",
    help: "Vi trenger dette for å skille turn fra fade i kastet du beskriver.",
    options: [{ value: "right", label: "Høyre" }, { value: "left", label: "Venstre" }]
  }
};

export function needsDirection(answers) {
  return answers.goal !== "putting" && /^(early|finish)-(left|right)$/.test(answers.problem || "");
}

export function stepsFor(answers) {
  const steps = [...diskSelectorSteps];
  if (needsDirection(answers)) {
    if (answers.throw === "both") steps.push(conditionalSteps.problemStyle);
    steps.push(conditionalSteps.handedness);
  }
  return steps;
}

export function directionContext(answers) {
  if (!needsDirection(answers)) return null;
  return flightDirections({
    throwStyle: answers.throw === "both" ? answers.problemStyle : answers.throw,
    handedness: answers.handedness
  });
}

// Static editorial examples, not a product search/matching engine. Sources checked 2026-09-29.
const innovaSource = "https://www.innovadiscs.com/disc-golf-discs/disc-comparison/";
const aviar = { name: "Innova Aviar (Putt & Approach)", values: { speed: 2, glide: 3, turn: 0, fade: 1 }, source: innovaSource };
export const recommendationProfiles = {
  putter: {
    category: "Nøytral putter", title: "Velg en putter som ligger godt i hånden",
    ranges: { speed: [2, 3], glide: [3, 5], turn: [-1, 0], fade: [0, 1] },
    params: { speed: 2, glide: 3, turn: 0, fade: 1 }, examples: [aviar],
    fits: "Putting og korte kast mot kurven.",
    avoid: "Flight-tall beskriver kast, ikke treffsikkerhet i putting. Grep og en repeterbar rutine er viktigere enn høy speed."
  },
  approach: {
    category: "Putter til kast og innspill", title: "Velg kontroll i lav fart",
    ranges: { speed: [2, 4], glide: [3, 5], turn: [-1, 0], fade: [0, 1] },
    params: { speed: 3, glide: 4, turn: 0, fade: 1 }, examples: [aviar],
    fits: "Korte hull, rolige kast og innspill nær kurven.",
    avoid: "En rask driver er ikke nødvendig for disse kastene. En disk med lite fade stopper heller ikke automatisk ved kurven."
  },
  neutralMid: {
    category: "Nøytral midrange", title: "Velg en midrange for kontrollerte linjer",
    ranges: { speed: [4, 5], glide: [4, 5], turn: [-1, 0], fade: [0, 1] },
    params: { speed: 5, glide: 5, turn: 0, fade: 0 },
    examples: [{ name: "Innova Mako3", values: { speed: 5, glide: 5, turn: 0, fade: 0 }, source: innovaSource }],
    fits: "Kontrollkast, rette linjer og trening på et jevnt slipp.",
    avoid: "Nøytral betyr ikke at alle kast blir rette. Slippvinkel, kastfart og vind påvirker resultatet."
  },
  easyMid: {
    category: "Lett understabil midrange", title: "Prøv litt turn uten å øke speed",
    ranges: { speed: [4, 5], glide: [5, 6], turn: [-2, -1], fade: [0, 1] },
    params: { speed: 5, glide: 6, turn: -1, fade: 0 },
    examples: [{ name: "Latitude 64 Fuse", values: { speed: 5, glide: 6, turn: -1, fade: 0 }, source: "https://latitude64.com/collections/fuse" }],
    fits: "Rolige kast med litt turn og liten avsluttende krok.",
    avoid: "Mer understabilitet løser ikke et urent slipp. Disken kan svinge for mye når du kaster hardt."
  },
  neutralFairway: {
    category: "Nøytral fairway-driver", title: "Velg fairway-fart med kontroll",
    ranges: { speed: [6, 9], glide: [4, 7], turn: [-1, 0], fade: [1, 2] },
    params: { speed: 7, glide: 6, turn: 0, fade: 1 },
    examples: [{ name: "Discmania S-Line FD", values: { speed: 7, glide: 6, turn: 0, fade: 1 }, source: "https://www.discmania.net/collections/s-line/fd" }],
    fits: "Lengre kontrollkast med begrenset turn og en moderat avslutning.",
    avoid: "En fairway-driver er et utgangspunkt, ikke en garanti for mer lengde. Sammenlign med disken du allerede kontrollerer."
  },
  easyFairway: {
    category: "Lett understabil fairway-driver", title: "Prøv en fairway-driver med litt turn",
    ranges: { speed: [6, 9], glide: [5, 6], turn: [-2, -1], fade: [1, 2] },
    params: { speed: 8, glide: 6, turn: -2, fade: 1 },
    examples: [{ name: "Discmania Neo Essence", values: { speed: 8, glide: 6, turn: -2, fade: 1 }, source: "https://europe.discmania.net/collections/essence" }],
    fits: "Lengrekast med plass til en myk sving før avslutningen.",
    avoid: "Ikke velg høyere speed bare fordi du ønsker lengde. Mye turn kan gjøre disken mindre egnet når du trenger en fast linje."
  }
};

export function getDiskRecommendation(answers) {
  const novice = ["never", "beginner"].includes(answers.experience);
  const unknownDistance = !["under50", "50-70", "70-90", "90-110", "110plus"].includes(answers.distance);
  const style = answers.throw === "both" ? answers.problemStyle || "both" : answers.throw;
  const direction = directionContext(answers);
  const problemSide = answers.problem?.endsWith("left") ? "venstre" : "høyre";
  const earlyTurn = Boolean(direction && answers.problem.startsWith("early-") && problemSide === direction.turn);
  const hardFade = Boolean(direction && answers.problem.startsWith("finish-") && problemSide === direction.fade);

  let profileId;
  let reason;
  // Priority: purpose -> conservative entry -> speed family -> stability. No direction diagnosis without context.
  if (answers.goal === "putting") {
    profileId = "putter";
    reason = "Du vil putte bedre. Derfor prioriterer vi en putter fremfor lengden på drivekastene dine.";
  } else if (answers.goal === "approach") {
    profileId = "approach";
    reason = "Du ønsker bedre innspill. Lav speed er nyttig nær kurven også for deg som kaster langt.";
  } else if (novice && (unknownDistance || answers.distance === "under50")) {
    profileId = "approach";
    reason = unknownDistance
      ? "Du er ny og vet ikke kastelengden ennå. En putter til rolige kast er et forsiktig startpunkt uten å gjette meter."
      : "Du er ny og oppgir kast under 50 meter. Start med lav speed og øv på et jevnt slipp.";
  } else {
    const fairway = !novice && ["70-90", "90-110", "110plus"].includes(answers.distance) &&
      ["distance", "control"].includes(answers.goal) && answers.problem !== "stall";
    const easy = !earlyTurn && (hardFade || answers.goal === "easy" ||
      (answers.goal === "distance" && style === "backhand"));
    profileId = fairway ? (easy ? "easyFairway" : "neutralFairway") : (easy ? "easyMid" : "neutralMid");
    reason = fairway
      ? `Du har erfaring og oppgir ${answers.distance === "110plus" ? "over 110" : answers.distance} meter på vanlige kast. En fairway-driver er et kontrollert utgangspunkt for ${answers.goal === "control" ? "å treffe linjen" : "å utforske mer lengde"}.`
      : unknownDistance
        ? "Uten kjent kastelengde velger vi moderat speed. Prøv den i rolig tempo før du vurderer en raskere disk."
        : "Vi prioriterer moderat speed for dette målet. Det gjør det enklere å øve på linjen uten å jage høyere fart.";
  }
  const profile = recommendationProfiles[profileId];
  const context = answers.goal === "putting" ? "" : style === "forehand"
    ? " For forehand: se etter et behagelig grep og øv på rent slipp; forehand krever ikke automatisk en overstabil disk."
    : style === "both"
      ? " Du bruker begge kastestiler. Prøv samme disk med begge før du vurderer en mer spesialisert disk."
      : " For backhand: start rolig og se om du kan gjenta samme slipp og linje.";
  let problemNote = "";
  if (answers.goal !== "putting") {
    if (earlyTurn) problemNote = " Tidlig sving i turn-retningen kan komme av mye turn eller slippvinkel. Vi prioriterer ikke ekstra understabilitet.";
    else if (hardFade) problemNote = " Den harde avslutningen går i fade-retningen. Lavere speed eller mindre fade kan være verdt å prøve.";
    else if (needsDirection(answers)) problemNote = " Retningen alene forklarer ikke feilen. Se på slippvinkelen før du endrer stabilitet.";
    else if (answers.problem === "stall") problemNote = " Når disken stiger og stopper, bør du også sjekke om forkanten peker for høyt.";
    else if (answers.problem === "short") problemNote = " For lite lengde er ikke i seg selv et tegn på at du trenger en raskere disk.";
    else if (answers.problem === "line") problemNote = " Ved linjebom er et gjentakbart sikte og slipp et nyttig første steg.";
    if (answers.problem && answers.problem !== "unknown") problemNote += " Dette kan skyldes både diskvalg og kasteteknikk.";
  }
  return {
    ...profile, profileId, direction,
    flight: Object.fromEntries(Object.entries(profile.ranges).map(([key, range]) => [key, `${range[0]} til ${range[1]}`])),
    description: reason + context + problemNote,
    visual: { speed: profile.params.speed, glide: profile.params.glide },
    // Evidence classes for maintainers; never represented as physical testing in UI.
    evidence: { examples: "FACT", recommendation: "RULE-BASED RECOMMENDATION", flight: "PEDAGOGICAL EXPLANATION" }
  };
}
