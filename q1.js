let arr = [20, 40, 2, 5, 90];

let lowest = arr[0];

for (let i = 1; i < arr.length; i++) {
  if (arr[i] < lowest) {
    lowest = arr[i];
  }
}

console.log(lowest);
