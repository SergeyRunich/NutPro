export const activitiesWork = [
  {
    value: '0',
    name:
      'Velmi lehká - Většinu pracovní doby nebo čas ve škole trávíte v sedě, minimum chůze (úředníci, administrativa, kancelářské práce)',
  },
  {
    value: '1',
    name:
      'Lehká - Pracovní dobu nebo čas ve škole trávíte v sedě, část ve stoje, chodíte aspoň 30 minut denně (laborant, řidič, prodavač/ka)',
  },
  {
    value: '2',
    name:
      'Střední - Pracovní dobu trávíte aktivně ve stoje nebo za chůze, chodíte 60 minut denně (číšník, poštovní doručovatelé, řemeslníci)',
  },
  {
    value: '3',
    name: 'Těžká - Těžká manuální práce (stavební dělníci, zemědělství, lesníci)',
  },
]

export const activitiesFree = [
  {
    value: '0',
    name: 'Velmi lehká – Procházky, práce na zahradě, lehké domácí práce',
  },
  {
    value: '1',
    name: 'Lehká – Pravidelná lehká aktivita aspoň 2x týdně (jízda na kole, lehký běh)',
  },
  {
    value: '2',
    name:
      'Střední – Pravidelná sportovní aktivita 2 - 4x týdně (běh, kolo, plavání, posilovna, týmové sporty apod.)',
  },
  {
    value: '3',
    name: 'Náročná – Pravidelná intenzivní aktivita 4 - 6x týdně, strukturovaný trénink',
  },
  {
    value: '4',
    name: 'Velmi náročná – Pravidelná výkonnostní aktivita 15 h týdně a víc, dvoufázové tréninky',
  },
]

export const looseSpeed = [
  {
    value: 'slow',
    name:
      'Mírné hubnutí - U této varianty, nedochází k tak velkému kalorickému deficitu, takže se můžete těšit na největší porce jídel ze všech tří programů. Pokud máte velmi nabitý a psychicky náročný životní styl, chcete zhubnout bez velkého úsilí a na výsledky tolik nespěcháte, pak je tento program vhodný pro Vás.',
  },
  {
    value: 'middle',
    name:
      'Střední hubnutí - V tomto programu je nastaven středně vysoký kalorický deficit, velikost porcí tedy bude někde uprostřed mezi mírným a intenzivním programem.',
  },
  {
    value: 'fast',
    name:
      'Rychlé hubnutí - S tímto programem zhubnete nejrychleji.Kalorický deficit je vyšší než při předchozích dvou, ale hladovět rozhodně nebudete.Pokud se chystáte zhubnout do plavek a máte odhodlání dosáhnout výsledků co nejdříve, tak je tento program ideální pro Vás.',
  },
]

export const trainingTime = [
  {
    value: 'none',
    name: 'Nechodím',
  },
  {
    value: 'beforeBreakfast',
    name: 'Před snídaní',
  },
  {
    value: 'beforeLunch',
    name: 'Před obědem',
  },
  {
    value: 'beforeDinner',
    name: 'Před večeří',
  },
]

export const PAL = {
  '00': 1.2,
  '10': 1.3,
  '01': 1.3,
  '11': 1.4,
  '02': 1.4,
  '20': 1.4,
  '03': 1.5,
  '12': 1.5,
  '30': 1.6,
  '13': 1.6,
  '22': 1.6,
  '31': 1.7,
  '04': 1.8,
  '23': 1.7,
  '32': 1.8,
  '14': 1.9,
  '33': 1.9,
  '24': 2,
  '34': 2.1,
  '21': 1.5,
}

export const MACRO = {
  loose: {
    1.2: {
      prot: 0.3,
      fat: 0.4,
      carb: 0.3,
    },
    1.3: {
      prot: 0.3,
      fat: 0.383,
      carb: 0.317,
    },
    1.4: {
      prot: 0.3,
      fat: 0.366,
      carb: 0.334,
    },
    1.5: {
      prot: 0.3,
      fat: 0.349,
      carb: 0.351,
    },
    1.6: {
      prot: 0.3,
      fat: 0.332,
      carb: 0.368,
    },
    1.7: {
      prot: 0.3,
      fat: 0.315,
      carb: 0.385,
    },
    1.8: {
      prot: 0.3,
      fat: 0.298,
      carb: 0.402,
    },
    1.9: {
      prot: 0.3,
      fat: 0.281,
      carb: 0.419,
    },
    2: {
      prot: 0.3,
      fat: 0.264,
      carb: 0.436,
    },
    2.1: {
      prot: 0.3,
      fat: 0.247,
      carb: 0.453,
    },
  },
  gain: {
    1.2: {
      prot: 0.25,
      fat: 0.25,
      carb: 0.5,
    },
    1.3: {
      prot: 0.25,
      fat: 0.25,
      carb: 0.5,
    },
    1.4: {
      prot: 0.25,
      fat: 0.25,
      carb: 0.5,
    },
    1.5: {
      prot: 0.25,
      fat: 0.25,
      carb: 0.5,
    },
    1.6: {
      prot: 0.25,
      fat: 0.25,
      carb: 0.5,
    },
    1.7: {
      prot: 0.25,
      fat: 0.27,
      carb: 0.48,
    },
    1.8: {
      prot: 0.25,
      fat: 0.27,
      carb: 0.48,
    },
    1.9: {
      prot: 0.25,
      fat: 0.25,
      carb: 0.5,
    },
    2: {
      prot: 0.25,
      fat: 0.25,
      carb: 0.516,
    },
    2.1: {
      prot: 0.25,
      fat: 0.25,
      carb: 0.5,
    },
  },
  keep: {
    1.2: {
      prot: 0.2,
      fat: 0.4,
      carb: 0.4,
    },
    1.3: {
      prot: 0.2,
      fat: 0.4,
      carb: 0.4,
    },
    1.4: {
      prot: 0.2,
      fat: 0.4,
      carb: 0.4,
    },
    1.5: {
      prot: 0.2,
      fat: 0.4,
      carb: 0.4,
    },
    1.6: {
      prot: 0.2,
      fat: 0.4,
      carb: 0.4,
    },
    1.7: {
      prot: 0.2,
      fat: 0.4,
      carb: 0.4,
    },
    1.8: {
      prot: 0.2,
      fat: 0.4,
      carb: 0.4,
    },
    1.9: {
      prot: 0.2,
      fat: 0.4,
      carb: 0.4,
    },
    2: {
      prot: 0.2,
      fat: 0.4,
      carb: 0.4,
    },
    2.1: {
      prot: 0.2,
      fat: 0.4,
      carb: 0.4,
    },
  },
}

export const looseCoef = {
  slow: 0.87,
  middle: 0.8,
  fast: 0.75,
}
