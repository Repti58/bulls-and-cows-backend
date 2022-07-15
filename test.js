// const boo = () => {
//     return 'helo';

//   }
//   async function f1() {
//     const x = await new Promise(resolve => {
//       setTimeout(() => resolve(boo()), 1000)
//     })
//     return x
//   }
//   async function f2() {
//     const res = 2
//     return res
//   }
//   async function f3() {
//     const res = 3
//     return res
//   }

//   async function go() {
//     let a = await f1();
//     console.log(a);
//     let b = await f2();
//     console.log(b);
//     let c = await f3();
//     console.log(c);
//   }

//   go()




// const accessDataBestResults = async () => {    

//     const data = await accessDataBestResults3;
//     bestResults.push(data);
//     const data_1 = await accessDataBestResults4;
//     bestResults.push(data_1);
//     const data_2 = await accessDataBestResults5;
//     bestResults.push(data_2);
// }


// const accessDataBestResults2 = () => {

//     return accessDataBestResults3.then((data) => {
//         bestResults.push(data)
//     })
//         .then(() => {
//             return accessDataBestResults4.then((data) => {
//                 bestResults.push(data)
//             })
//         })

//         .then(() => {
//             return accessDataBestResults5.then((data) => {
//                 bestResults.push(data)
//             })
//         })
// }

const foo = () => {
const boo = []
if (boo === []) console.log('пустой массив');
}

foo()