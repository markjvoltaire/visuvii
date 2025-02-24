Below is a Markdown document that explains how the updated payout calculations work, including the new scaling for leftover winners:

---

# Tournament Payout Calculation Explanation

This document explains the logic behind our dynamic `calculatePayouts` function. The function calculates tournament prizes by dynamically distributing the prize pool based on the number of entries and the tournament's rules. Recent changes ensure that lower placements (like 11th place) never receive more than a higher placement (like 10th place) by scaling the leftover prize distribution.

---

## Key Assumptions

- **Total Pot:**  
  The total pot is calculated as:  
  `totalPot = entriesSize * entryPrice`

- **Prize Pool:**  
  After a 10% platform fee, 90% of the total pot is available for prizes:  
  `prizePool = totalPot * 0.9`

- **Winners:**  
  The top 25% of entrants (rounded up) are designated as winners.

- **Payout Distribution:**
  - **For Small Tournaments (10 or fewer winners):**  
    A preset ideal array of percentages (e.g., `[25, 15, 10, 7, 5, 4, 4, 4, 4, 4]`) is scaled so that the winners split 100% of the prize pool proportionally.
  - **For Larger Tournaments (more than 10 winners):**
    - **Positions 1–5:** Fixed percentages of 25%, 15%, 10%, 7%, and 5%, respectively.
    - **Positions 6–10:** Each receives 4% of the prize pool.
    - **Leftover Winners (Positions 11+):**  
      Typically, 18% of the prize pool is reserved for positions 11 to 25 (i.e., 15 winners receiving 1.2% each). However, if there are fewer than 15 leftover winners (i.e., total winners are less than 25), the total leftover percentage is scaled down so that each leftover winner still only gets 1.2% of the prize pool. This adjustment prevents any lower-ranked placement (such as 11th place) from receiving more than the 4% allocated to 10th place.

---

## Detailed Breakdown

### 1. Small Tournaments (Winners ≤ 10)

- **Ideal Array:**  
  `[25, 15, 10, 7, 5, 4, 4, 4, 4, 4]`  
  This array represents the intended percentages for positions 1 through 10.

- **Scaling:**  
  Only the needed slice of the array is taken (based on the number of winners), and these percentages are scaled so that they sum to 100% of the prize pool. Each winner's share is computed as:

  ```js
  fraction = p / (sum of sliced percentages)
  ```

### 2. Larger Tournaments (Winners > 10)

- **Fixed Payouts for Top 10:**

  - **1st Place:** 25%
  - **2nd Place:** 15%
  - **3rd Place:** 10%
  - **4th Place:** 7%
  - **5th Place:** 5%
  - **6th–10th Places:** 4% each

- **Leftover Winners (Positions 11+):**
  - **Default:**  
    If there are exactly 15 leftover winners (i.e., a total of 25 winners), each gets 1.2% (because 18% ÷ 15 = 1.2%).
  - **Scaling Down:**  
    If there are fewer than 15 leftover winners, instead of giving them a larger percentage, we scale the total leftover percentage down to:  
    `leftoverPercent = leftoverWinners * 0.012`  
    This guarantees that each leftover winner receives exactly 1.2% of the prize pool, ensuring that 11th place (and beyond) never exceeds the 4% given to 10th place.

---

## Payout Object Structure

Each payout object includes:

- **place:** A string representing the placement (e.g., "1st", "2nd").
- **prize:** The prize amount (formatted as a string, e.g., "$225.00").
- **percentage:** The fraction of the prize pool allocated to that position (e.g., 0.25 for 25%).

---

## Complete `calculatePayouts` Function

```js
// Helper to get ordinal strings like "1st", "2nd", etc.
function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Calculates the tournament payouts based on:
 *  - 90% prize pool (after a 10% platform fee)
 *  - Top 25% winners
 *  - Fixed distribution for positions 1-10
 *  - Leftover distribution for positions 11-25 (18% total)
 *
 * If there are fewer than 15 leftover winners, the 18% is scaled
 * so that each leftover winner gets exactly 1.2% of the prize pool,
 * ensuring that lower placements never exceed higher placements.
 */
function calculatePayouts(entriesSize, entryPrice) {
  const totalPot = entriesSize * entryPrice;
  const prizePool = totalPot * 0.9; // 90% of total pot
  const winnersCount = Math.ceil(entriesSize * 0.25);

  let payouts = [];

  // For small tournaments (10 or fewer winners)
  if (winnersCount <= 10) {
    // Ideal percentages for up to 10 positions
    const idealArray = [25, 15, 10, 7, 5, 4, 4, 4, 4, 4];
    const percentages = idealArray.slice(0, winnersCount);
    const sumPercent = percentages.reduce((acc, curr) => acc + curr, 0);

    payouts = percentages.map((p, index) => {
      const fraction = p / sumPercent;
      return {
        place: getOrdinal(index + 1),
        prize: `$${(prizePool * fraction).toFixed(2)}`,
        percentage: fraction,
      };
    });
  } else {
    // Fixed distribution for larger tournaments

    // Positions 1-5
    payouts.push({
      place: getOrdinal(1),
      prize: `$${(prizePool * 0.25).toFixed(2)}`,
      percentage: 0.25,
    });
    payouts.push({
      place: getOrdinal(2),
      prize: `$${(prizePool * 0.15).toFixed(2)}`,
      percentage: 0.15,
    });
    payouts.push({
      place: getOrdinal(3),
      prize: `$${(prizePool * 0.1).toFixed(2)}`,
      percentage: 0.1,
    });
    payouts.push({
      place: getOrdinal(4),
      prize: `$${(prizePool * 0.07).toFixed(2)}`,
      percentage: 0.07,
    });
    payouts.push({
      place: getOrdinal(5),
      prize: `$${(prizePool * 0.05).toFixed(2)}`,
      percentage: 0.05,
    });

    // Positions 6-10: each gets 4%
    for (let i = 6; i <= Math.min(10, winnersCount); i++) {
      payouts.push({
        place: getOrdinal(i),
        prize: `$${(prizePool * 0.04).toFixed(2)}`,
        percentage: 0.04,
      });
    }

    // Leftover winners (positions 11+)
    if (winnersCount > 10) {
      const leftoverWinners = winnersCount - 10;

      // Default: 18% of prize pool for positions 11-25
      let leftoverPercent = 0.18;

      // Scale down if there are fewer than 15 leftover winners
      if (leftoverWinners < 15) {
        leftoverPercent = leftoverWinners * 0.012; // each gets 1.2%
      }

      const perWinner = (prizePool * leftoverPercent) / leftoverWinners;
      const fractionPerWinner = leftoverPercent / leftoverWinners;

      for (let i = 11; i <= winnersCount; i++) {
        payouts.push({
          place: getOrdinal(i),
          prize: `$${perWinner.toFixed(2)}`,
          percentage: fractionPerWinner,
        });
      }
    }
  }

  return payouts;
}

export { calculatePayouts, getOrdinal };
```

---

## Summary

- **For Small Tournaments:**  
  The function scales an ideal array of percentages to allocate 100% of the prize pool among up to 10 winners.

- **For Larger Tournaments:**
  - **Positions 1–5** get fixed percentages (25%, 15%, 10%, 7%, and 5%).
  - **Positions 6–10** each receive 4%.
  - **Positions 11+** normally share 18% of the prize pool (1.2% each if there are 15 leftover winners). If there are fewer leftover winners, the total leftover percentage is scaled down so each leftover still gets 1.2%, ensuring that the payout hierarchy remains intact.

This implementation guarantees that no lower place receives a higher percentage than a higher place, preserving the intended payout structure.

---
