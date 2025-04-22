// Generates an array of paragon power needed for each degree (1-100).
export function generateParagonLevels(): number[] {
    return Array.from({ length: 100 }, (_, i) => {
        const degree = i + 1;
        if (degree === 1) return 0;
        if (degree === 100) return 200000;
        const top = 50 * degree ** 3 + 5025 * degree ** 2 + 168324 * degree + 843000;
        return Math.floor(top / 600);
    });
}

export const PARAGON_LEVELS = generateParagonLevels();

/**
 * Calculates the current and next degree based on power.
 * @param power Current paragon power.
 * @returns 
 */
export function degreeCalc(power: number, paragonLevels = PARAGON_LEVELS) {
    const idx = paragonLevels.findIndex(level => power < level);
    if (idx === -1) {
        return 100;
    } else {
        return idx;
    }
}

/**
 * Calculates current power from form values.
 * @returns {number} The calculated power.
 */
export function powerCalc(
    tier5: number,
    towerupgrades: number,
    moneyspent: number,
    cashslider: number,
    popcount: number,
    incomegenerated: number,
    paragontotems: number,
    paragoncost: number
) {
    let power = 0;

    // Tier5s. Max is 50,000 power
    power += Math.min(tier5 * 6000, 50000);

    // Upgrades. Max is 10,000 power
    power += Math.min(towerupgrades * 100, 10000);

    // Money Spent. Max is 60,000 power
    if (paragoncost !== 0) {
        let costpower = 0;

        // Money Spent
        let spentratio = paragoncost / 20000;
        costpower += Math.floor(moneyspent / spentratio);

        // Cash Slider
        let sliderratio = paragoncost * 1.05 / 20000;
        costpower += Math.floor(cashslider / sliderratio);

        power += Math.min(costpower, 60000);
    }

    // Pops or Income. Max is 90,000 power
    let temp = 0;
    temp += Math.floor(popcount / 180);
    temp += Math.floor(incomegenerated / 45);
    power += Math.min(temp, 90000);

    // Totems. No Max
    power += paragontotems * 2000;
    return power;
}