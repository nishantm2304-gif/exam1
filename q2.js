// given two array,find and print all common values.
let arr1=[10,20,30,40,50];
let arr2=[30,40,60,70,50];

for (let i = 0; i < arr1.length; i++) {
  for (let j = 0; j < arr2.length; j++) {
    if (arr1[i] === arr2[j]) {
      console.log(arr1[i]);
      break;
    }
  }
}