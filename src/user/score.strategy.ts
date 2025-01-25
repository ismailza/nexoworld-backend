import { CoinType } from 'src/enum/coin-type.enum';

export class ScoreStrategy {
  // Base XP values for each coin type
  COIN_XP_VALUES: Record<CoinType, { min: number; max: number }> = {
    [CoinType.COMMON]: { min: 8, max: 12 },
    [CoinType.RARE]: { min: 20, max: 30 },
    [CoinType.EPIC]: { min: 40, max: 60 },
    [CoinType.LEGENDARY]: { min: 80, max: 120 },
  };
  // Base XP required to level up
  BASE_LEVEL_UP_XP = 100;
  // Level growth factor
  LEVEL_GROWTH_FACTOR = 1.5;

  // Function to calculate the XP required for the next level
  private calculateLevelUpXp = (level: number): number => {
    return Math.floor(
      this.BASE_LEVEL_UP_XP * Math.pow(level, this.LEVEL_GROWTH_FACTOR),
    );
  };

  // Function to calculate the new level and XP remainder
  calculateLevelAndXp = (
    xp: number,
  ): { level: number; remainingXp: number } => {
    let level = 1;
    let remainingXp = xp;
    let xpThreshold = this.calculateLevelUpXp(level);

    while (remainingXp >= xpThreshold) {
      level++;
      remainingXp -= xpThreshold;
      xpThreshold = this.calculateLevelUpXp(level);
    }

    return { level, remainingXp };
  };

  // Function to calculate XP earned for a coin
  calculateXp = (coinType: CoinType, currentLevel: number): number => {
    const { min, max } = this.COIN_XP_VALUES[coinType];
    const randomXp = Math.floor(Math.random() * (max - min + 1)) + min;
    const levelMultiplier = 1 + currentLevel * 0.1; // 10% XP boost per level
    return Math.floor(randomXp * levelMultiplier);
  };
}
