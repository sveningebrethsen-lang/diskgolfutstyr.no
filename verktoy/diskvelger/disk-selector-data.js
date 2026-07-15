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
      { value: "110plus", label: "110 m+" }
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
    help: "Dette hjelper oss å velge tryggere stabilitet.",
    options: [
      { value: "left", label: "Den faller hardt til venstre" },
      { value: "right", label: "Den drar for mye til høyre" },
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

function buildResult({
  category,
  title,
  flight,
  visual,
  description,
  fits,
  avoid,
  examples
}) {
  return {
    category,
    title,
    flight,
    visual,
    description,
    fits,
    avoid,
    examples
  };
}

export function getDiskRecommendation(answers) {
  const novice = ["never", "beginner"].includes(answers.experience);
  const shortThrow = ["under50", "50-70"].includes(answers.distance);
  const longThrow = ["90-110", "110plus"].includes(answers.distance);
  const wantsPutting = answers.goal === "putting";
  const wantsApproach = answers.goal === "approach";
  const wantsStraightOrEasy = ["straight", "easy", "control"].includes(answers.goal);
  const stallsOrFades = ["left", "stall", "short"].includes(answers.problem);

  if (wantsPutting) {
    return buildResult({
      category: "Nøytral putter",
      title: "Velg en putter som flyr rolig og rett",
      flight: { speed: "2-3", glide: "3-5", turn: "0 til -1", fade: "0-1" },
      visual: { speed: 2, glide: 4, turn: "◄", fade: "►" },
      description: "En nøytral putter er lett å kontrollere på korte kast og putting. Den krever ikke høy fart, og den viser deg om slippet ditt er rent.",
      fits: "Putting, korte innspill, rette kast i lav fart og trening hjemme eller på puttinggreen.",
      avoid: "Unngå raske drivere for puttingtrening. De gjør det vanskeligere å se hva du faktisk gjør feil.",
      examples: ["Dynamic Discs Judge", "Innova Aviar", "Latitude 64 Pure"]
    });
  }

  if (wantsApproach || (novice && shortThrow)) {
    return buildResult({
      category: "Putter eller lett midrange",
      title: "Velg kontroll før fart",
      flight: { speed: "3-5", glide: "4-5", turn: "-1 til 0", fade: "0-1" },
      visual: { speed: 3, glide: 5, turn: "◄", fade: "►" },
      description: "Når kastene fortsatt er korte, får du mer igjen for en rolig disk enn en rask driver. Den flyr saktere, men gir deg bedre kontroll og mer læring.",
      fits: "Første runder, innspill, korte hull, rolige backhandkast og trygge kast der du ikke vil miste disken.",
      avoid: "Unngå distance drivers og veldig overstabile disker. De vil ofte fade tidlig og gi mindre nyttig flyvetid.",
      examples: ["Innova Mako3", "Discraft Buzzz", "Latitude 64 Fuse"]
    });
  }

  if (novice || shortThrow || wantsStraightOrEasy || stallsOrFades) {
    return buildResult({
      category: "Understabil midrange",
      title: "Velg en lettkastet midrange",
      flight: { speed: "4-6", glide: "5-6", turn: "-2 til -1", fade: "0-2" },
      visual: { speed: 4, glide: 6, turn: "◄◄", fade: "►" },
      description: "En understabil midrange hjelper nye spillere å få mer rett flyvning uten å måtte kaste hardt. Den er ofte mer nyttig enn en driver hvis disken din staller eller faller tidlig til venstre.",
      fits: "Rette kast, rolige hyzerflips, skogshull, kontrollkast og spillere som vil lære renere release.",
      avoid: "Unngå raske distance drivers foreløpig. Hvis disken staller eller går hardt til venstre, er den ofte for rask eller for overstable for deg nå.",
      examples: ["Latitude 64 Fuse", "Innova Mako3", "Discmania Origin"]
    });
  }

  if (longThrow && answers.goal === "distance") {
    return buildResult({
      category: "Kontrollert fairway-driver",
      title: "Gå for mer lengde uten å miste kontroll",
      flight: { speed: "7-9", glide: "5-6", turn: "-2 til -1", fade: "1-2" },
      visual: { speed: 6, glide: 6, turn: "◄◄", fade: "►►" },
      description: "Når du allerede kaster rundt 90 meter eller mer, kan en fairway-driver gi mer lengde uten å bli like krevende som en distance driver.",
      fits: "Kontrollerte drivekast, rette hull med litt plass, hyzerflip-linjer og kast der du vil ha både lengde og forutsigbarhet.",
      avoid: "Vær forsiktig med speed 12-14 distance drivers hvis du ikke får dem opp i fart. De kan gi kortere kast enn en roligere fairway-driver.",
      examples: ["Innova Leopard", "Latitude 64 Diamond", "Discmania Essence"]
    });
  }

  if (answers.throw === "forehand") {
    return buildResult({
      category: "Stabil midrange eller fairway-driver",
      title: "Velg litt stabilitet, men ikke for mye",
      flight: { speed: "5-8", glide: "4-5", turn: "-1 til 0", fade: "1-2" },
      visual: { speed: 5, glide: 5, turn: "◄", fade: "►►" },
      description: "Forehand tåler ofte litt mer stabilitet, men for mye fade gjør det vanskelig å lære rene linjer. Start med en disk som tåler dreiemoment uten å bli en ren krokdisk.",
      fits: "Forehand-innspill, kontrollerte sidearmkast, vind med måte og hull der du trenger en tydelig, men ikke ekstrem avslutning.",
      avoid: "Unngå veldig overstabile utility-disker som eneste forehanddisk. De kan fungere i vind, men lærer deg lite om ren release.",
      examples: ["Discraft Buzzz", "Innova Teebird", "Discmania FD"]
    });
  }

  return buildResult({
    category: "Stabil midrange eller rolig fairway-driver",
    title: "Velg en disk du kan forme kast med",
    flight: { speed: "5-7", glide: "5-6", turn: "-2 til -1", fade: "1-2" },
    visual: { speed: 5, glide: 6, turn: "◄◄", fade: "►►" },
    description: "Du virker klar for en disk som gir litt mer lengde, men fortsatt er lett å styre. Dette er ofte bedre enn å hoppe rett til de raskeste driverne.",
    fits: "Kontrollkast, lette hyzerflips, rette fairwaykast og videre utvikling av både backhand og forehand.",
    avoid: "Ikke hopp rett til de raskeste driverne hvis du først og fremst trenger bedre linjer og mer forutsigbarhet.",
    examples: ["Innova Leopard", "Discmania FD", "Latitude 64 River"]
  });
}
