export interface Temtem {
    dexNumber: number;
    name: string;
    TYPE1: string; // Primary type
    TYPE2?: string; // Optional secondary type
    hp: number;
    sta: number;
    spd: number;
    atk: number;
    def: number;
    spatk: number;
    spdef: number;
    total: number;
    weaknessCount: number;
    resistanceCount: number;
    tier: string;
    holdTechniqueTotal: number;
}

//list of all types in game
export const types = [
    "Neutral",
    "Fire",
    "Water",
    "Nature",
    "Electric",
    "Earth",
    "Mental",
    "Wind",
    "Digital",
    "Melee",
    "Crystal",
    "Toxic",
];

//where x2 is weak or takes signficant damage from, x0.5 is resistant, and x1 is neutral damage
const weaknessResistanceMatrix: number[][] = [
            // Neu   Fir  Wat  Nat  Ele  Ear  Men  Win  Dig  Mee  Cry  Tox
    /* Neu */ [1,   1,   1,   1,   1,   1,   2,   1,   1,   1,   1,   1],
    /* Fir */ [1,   0.5, 2,  0.5,   1,   2,  1,   1,   1,   1,   0.5,  1],
    /* Wat */ [1,   0.5,  0.5, 2,  2,   0.5,    1,   1,   1,   1,   1,  2],
    /* Nat */ [1,   2,   0.5,  0.5, 0.5,  0.5,   1,   1,   1,   1,   1, 2],
    /* Ele */ [1,   1,   1,   1,  0.5,  2,   1,   0.5,   1,  1,   2,   1],
    /* Ear */ [1,   0.5,   2,  2,  0.5,   1,   1,   1,   1,   2,   0.5,   0.5],
    /* Men */ [0.5,   1,   1,   1,   2,   1,   1,   1,   2,   0.5,   2,   1],
    /* Win */ [1,   1,   1,   1,   2,  0.5,   1,   0.5,   1,   1,   1,   1],
    /* Dig */ [1,   1,   2,   1,   2,   1,   1,   1,   2,   1,   1,   0.5],
    /* Mee */ [1,   1,   1,   1,   1,   1,   2,   1,   2,   0.5,   1,   1],
    /* Cry */ [1,   2,   1,   1,   0.5,   2,   0.5,   1,   1,   2,   1,  0.5],
    /* Tox */ [1,   1,   0.5,   0.5,   1,   1,   1,   2,   1,   1,   1,   0.5],
];



//method to calculate the weakness and resistances of each type given temtems type
export const calculateTypeEffectiveness = (type1: string, type2?: string): [number, number] => {
    const type1Index = types.indexOf(type1);
    const type2Index = type2 ? types.indexOf(type2) : -1;

    let weaknessCount = 0;
    let resistanceCount = 0;
    const encounteredResistances = new Set<number>();
    const encounteredWeaknesses = new Set<number>();

    // Helper method to process weaknesses for a given type index
    const determineWeaknesses = (typeIndex: number, otherTypeIndex: number | null) => {
        weaknessResistanceMatrix[typeIndex].forEach((effectiveness, index) => {
            if (effectiveness === 2) {
                if (otherTypeIndex === null || (weaknessResistanceMatrix[otherTypeIndex][index] !== 0.5)) {
                    if (!encounteredWeaknesses.has(index)) {
                        console.log(`${types[typeIndex]} is weak to ${types[index]}`);
                        encounteredWeaknesses.add(index);
                        weaknessCount++;
                    } else {
                        console.log(`${types[type1Index]} and ${types[type2Index]} are both weak to ${types[index]}, only adding once`);
                    }
                } else {
                    console.log(`${types[typeIndex]} is weak to ${types[index]}, but ${types[otherTypeIndex]} resists ${types[index]}`);
                }
            }
        });
    };

    // Helper method to process resistances for a given type index
    const determineResistances = (typeIndex: number, otherTypeIndex: number | null) => {
        weaknessResistanceMatrix[typeIndex].forEach((effectiveness, index) => {
            if (effectiveness === 0.5) {
                if (otherTypeIndex === null || weaknessResistanceMatrix[otherTypeIndex][index] !== 2) {
                    if (!encounteredResistances.has(index)) {
                        console.log(`${types[typeIndex]} is resistant to ${types[index]}`);
                        encounteredResistances.add(index);
                        resistanceCount++;
                    } else {
                        console.log(`${types[type1Index]} and ${types[type2Index]} are both resistant to ${types[index]}, only adding once`);
                    }
                } else {
                    console.log(`${types[typeIndex]} is resistant to ${types[index]}, but ${types[otherTypeIndex]} is weak to ${types[index]}`);
                }
            }
        });
    };


    // Process weaknesses for type1
    determineWeaknesses(type1Index, type2Index === -1 ? null : type2Index);
    // Process weaknesses for type2 if it exists
    if (type2) {
        determineWeaknesses(type2Index, type1Index);
    }

    // Process resistances for type1
    determineResistances(type1Index, type2Index === -1 ? null : type2Index);
    // Process resistances for type2 if it exists
    if (type2) {
        determineResistances(type2Index, type1Index);
    }

    return [weaknessCount, resistanceCount];
};


export const temtemTiers: Record<string, number[]> = {
    "S": [9, 12, 36, 110, 114, 132, 149, 157, 160],
    "A": [3, 13, 30, 43, 56, 69, 74, 75, 85, 99, 116, 124, 133, 134, 144, 148, 163, 164],
    "B+": [1, 6, 11, 20, 28, 34, 41, 45, 47, 49, 50],
    "B": [54, 59, 63, 68, 71, 78, 80, 83, 87, 89, 91, 94, 96, 98, 101, 112, 118, 121, 122, 123, 126, 128, 129, 135, 141, 142, 146, 158, 162, 165],
    "B-": [15, 18, 26, 31, 38, 65, 106, 136, 137, 152, 154, 155, 156],
    "C": [22, 52, 53, 61, 77, 95, 104, 108, 131, 140, 153],
    "D": [4, 24, 143],
};


export const printTypeMatrix = (): void => {
    const maxTypeLength = Math.max(...types.map(type => type.length));
    const maxValueLength = Math.max(...weaknessResistanceMatrix.flat().map(value => value.toString().length));
    const cellWidth = Math.max(maxTypeLength, maxValueLength) + 1;
    const horizontalLine = '-'.repeat(cellWidth * (types.length + 1));
    const headerRow = ' '.repeat(cellWidth) + types.map(type => type.padStart(cellWidth)).join('');
    console.log(horizontalLine);
    console.log(headerRow);
    console.log(horizontalLine);
    weaknessResistanceMatrix.forEach((row, i) => {
        const rowString = types[i].padStart(cellWidth) + row.map(value => value.toString().padStart(cellWidth)).join('');
        console.log(rowString);
        console.log(horizontalLine);
    });
};


const fetchTechniqueHold = async (techniqueName: string): Promise<number> => {
    const url = `https://temtem-api.mael.tech/api/techniques?name=${encodeURIComponent(techniqueName)}`;
    try {
        const response = await fetch(url);
        return (await response.json()).find((technique: { name: string; }) => technique.name === techniqueName)?.hold?? 0;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching technique hold:', error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
        return 0;
    }
};


export const fetchSelectedTemtemTechniques = async (number: number): Promise<number> => {
    const url = `https://temtem-api.mael.tech/api/temtems/${number}`;
    try {
        const response = await fetch(url);
        const techniquesData = await response.json();
        const holdValuesPromises = techniquesData.techniques.map((technique: { name: string; }) => fetchTechniqueHold(technique.name));
        const holdValues = await Promise.all(holdValuesPromises);
        return holdValues.reduce((acc, holdValue) => acc + holdValue, 0);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching Temtem data:', error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
        return 0;
    }
};

// const temtemTiersArray = Object.values(temtemTiers).flat();
// console.log(temtemTiersArray);


// const fetchSelectedTemtemTechniques = async (number: number): Promise<{ name: string; hold: number }[]> => {
//     const url = `https://temtem-api.mael.tech/api/temtems/${number}`;
//     try {
//         const response = await fetch(url);
//         const techniquesData = await response.json();
//         const techniquesPromises = techniquesData.techniques.map((technique: any) =>
//             fetchTechniqueHold(technique.name).then(hold => ({ name: technique.name, hold }))
//         );
//         return Promise.all(techniquesPromises);
//     } catch (error) {
//         if (error instanceof Error) {
//             console.error('Error fetching Temtem data:', error.message);
//         } else {
//             console.error('An unknown error occurred:', error);
//         }
//         return [];
//     }
// };
// printTypeMatrix();
