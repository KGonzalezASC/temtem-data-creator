//fetch data from api https://temtem-api.mael.tech/api/temtems
import {calculateTypeEffectiveness, fetchSelectedTemtemTechniques, Temtem, temtemTiers} from "./temtem";

const fetchTemtemData = async (number: number): Promise<Temtem> => {
    // Introduce a delay before making the API call
    await delay(100); // Delay of 100ms to avoid rate limiting

    const url = `https://temtem-api.mael.tech/api/temtems/${number}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const [weaknessCount, resistanceCount] = calculateTypeEffectiveness(data.types[0], data.types[1]);

        // Find the tier for the given dexNumber
        let tier = "";
        for (const [key, value] of Object.entries(temtemTiers)) {
            if (value.includes(number)) {
                tier = key;
                break;
            }
        }
        return {
            name: data.name,
            dexNumber: data.number,
            TYPE1: data.types[0],
            TYPE2: data.types[1] || "",
            hp: data.stats.hp,
            sta: data.stats.sta,
            spd: data.stats.spd,
            atk: data.stats.atk,
            def: data.stats.def,
            spatk: data.stats.spatk,
            spdef: data.stats.spdef,
            total: data.stats.total,
            weaknessCount: weaknessCount,
            resistanceCount: resistanceCount,
            holdTechniqueTotal: await fetchSelectedTemtemTechniques(data.number),
            tier: tier, // Assign the tier found
        };
    } catch (error) {
        console.error('Error fetching Temtem data:', error instanceof Error ? error.message : 'Unknown error');
        // Return an empty object that satisfies the Temtem interface
        return {
            dexNumber: 0,
            name: "",
            TYPE1: "",
            TYPE2: "",
            hp: 0,
            sta: 0,
            spd: 0,
            atk: 0,
            def: 0,
            spatk: 0,
            spdef: 0,
            total: 0,
            weaknessCount: 0,
            resistanceCount: 0,
            tier: "",
            holdTechniqueTotal: 0,
        };
    }
};
const temtem: number[] = [
    9, 12, 36, 110, 114, 132, 149, 157, 160, 3, 13, 30, 43, 56, 69, 74, 75, 85, 99,
    116, 124, 133, 134, 144, 148, 163, 164, 1, 6, 11, 20, 28, 34, 41, 45, 47, 49, 50,
    54, 59, 63, 68, 71, 78, 80, 83, 87, 89, 91, 94, 96, 98, 101, 112, 118, 121, 122,
    123, 126, 128, 129, 135, 141, 142, 146, 158, 162, 165, 15, 18, 26, 31, 38, 65, 106,
    136, 137, 152, 154, 155, 156, 22, 52, 53, 61, 77, 95, 104, 108, 131, 140, 153, 4,
    24, 143
]

const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const fetchAllTemtemData = async (): Promise<Temtem[]> => {
    const temtemData: Temtem[] = [];
    for (const number of temtem) {
        const data = await fetchTemtemData(number);
        temtemData.push(data);
    }
    return temtemData;
};

const printTemtemData = async (): Promise<void> => {
    const temtemData = await fetchAllTemtemData();
    console.log(temtemData);
};

// Call the function to fetch and print Temtem data
printTemtemData();


