/**
 * Calculate yearly savings based on weekly spend and reduction percentage
 * @param spendPerWeek - Amount spent per week on alcohol
 * @param reductionPercentage - Expected reduction percentage (default 70%)
 * @returns Yearly savings amount
 */
export function calculateYearlySavings(
  spendPerWeek: number,
  reductionPercentage: number = 0.7
): number {
  return Math.round(spendPerWeek * 52 * reductionPercentage)
}

/**
 * Calculate calories saved per year based on weekly drinks and reduction
 * @param drinksPerWeek - Number of drinks per week
 * @param reductionPercentage - Expected reduction percentage (default 70%)
 * @param caloriesPerDrink - Average calories per drink (default 150)
 * @returns Yearly calories saved
 */
export function calculateCaloriesSaved(
  drinksPerWeek: number,
  reductionPercentage: number = 0.7,
  caloriesPerDrink: number = 150
): number {
  return Math.round(drinksPerWeek * 52 * caloriesPerDrink * reductionPercentage)
}

/**
 * Calculate additional REM cycles gained per year
 * @param drinksPerWeek - Number of drinks per week
 * @param reductionPercentage - Expected reduction percentage (default 70%)
 * @returns Additional REM cycles per year
 */
export function calculateREMCycles(
  drinksPerWeek: number,
  reductionPercentage: number = 0.7
): number {
  // Assuming 1 drink = ~0.5 REM cycles lost per night
  const remCyclesLostPerWeek = drinksPerWeek * 0.5
  const remCyclesGainedPerWeek = remCyclesLostPerWeek * reductionPercentage
  return Math.round(remCyclesGainedPerWeek * 52)
}

/**
 * Format currency for display
 * @param amount - Amount to format
 * @param currency - Currency symbol (default $)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${amount.toLocaleString()}`
}

/**
 * Format large numbers with k/m suffix
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

