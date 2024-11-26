/* 
Wyznacz medianę wydatków do pierwszej niedzieli (włącznie) każdego miesiąca
(np. dla 2023-09 i 2023-10 są to dni 1, 2, 3 wrz i 1 paź).
Rozwiązanie należy podzielić na dwie funkcje:
solution1 → rozwiązanie niezoptymalizowane (tzw. pierwsza wersja)
solution2 → rozwiązanie zoptymalizowane z użyciem jednej z metod. 
*/

const expenses = {
  "2023-01": {
    "01": {
      food: [22.11, 43, 11.72, 2.2, 36.29, 2.5, 19],
      fuel: [210.22],
    },
    "09": {
      food: [11.9],
      fuel: [190.22],
    },
  },
  "2023-03": {
    "07": {
      food: [20, 11.9, 30.2, 11.9],
    },
    "04": {
      food: [10.2, 11.5, 2.5],
      fuel: [],
    },
  },
  "2023-04": {},
};

// Helper function to locate the first Sunday of a given month
function locateInitialSunday(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const offsetDays = (7 - firstDay.getDay()) % 7;
  return 1 + offsetDays;
}

// Non-optimized solution
function solution1(expenses) {
  let result = null;
  const allExpenses = [];

  for (const [yearMonth, days] of Object.entries(expenses)) {
    const [year, month] = yearMonth.split("-").map(Number);
    const firstSunday = locateInitialSunday(year, month);

    for (const [day, categories] of Object.entries(days)) {
      if (Number(day) <= firstSunday) {
        for (const category of Object.values(categories)) {
          allExpenses.push(...category);
        }
      }
    }
  }

  if (allExpenses.length === 0) return result;

  // Sort to find the median
  allExpenses.sort((a, b) => a - b);
  const mid = Math.floor(allExpenses.length / 2);
  result =
    allExpenses.length % 2 === 0
      ? (allExpenses[mid - 1] + allExpenses[mid]) / 2
      : allExpenses[mid];
  return result;
}

// Optimized solution using Quickselect
function solution2(expenses) {
  let result = null;
  const allExpenses = [];

  for (const [yearMonth, days] of Object.entries(expenses)) {
    const [year, month] = yearMonth.split("-").map(Number);
    const firstSunday = locateInitialSunday(year, month);

    for (const [day, categories] of Object.entries(days)) {
      if (Number(day) <= firstSunday) {
        for (const category of Object.values(categories)) {
          allExpenses.push(...category);
        }
      }
    }
  }

  if (allExpenses.length === 0) return result;

  /* 
    Why quickselect?
    
    - Benefits: finds the median in O(n) average time, efficient for large datasets, avoids full sorting.
    - Drawbacks: worst-case complexity is O(n^2) (rare with good pivot selection, hence random pick of pivot).
   
*/

  const quickSelect = (arr, k) => {
    const pivot = arr[Math.floor(Math.random() * arr.length)];
    const left = [],
      equal = [],
      right = [];

    for (const num of arr) {
      if (num < pivot) left.push(num);
      else if (num === pivot) equal.push(num);
      else right.push(num);
    }

    if (k < left.length) {
      return quickSelect(left, k);
    } else if (k < left.length + equal.length) {
      return pivot;
    } else {
      return quickSelect(right, k - left.length - equal.length);
    }
  };

  const mid = Math.floor(allExpenses.length / 2);

  return allExpenses.length % 2 === 0
    ? (quickSelect(allExpenses, mid - 1) + quickSelect(allExpenses, mid)) / 2
    : quickSelect(allExpenses, mid);
}

console.log(solution1(expenses)); // Non-optimized solution
console.log(solution2(expenses)); // Optimized solution
