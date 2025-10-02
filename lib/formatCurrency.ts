export function formatCurrency(
  amount: number,
  currency: string = "usd"
): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch (error) {
    // Fallback formatting in case of error
    console.error("Error formatting currency:", error);
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
  }
}
