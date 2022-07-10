const boo = () => {
    return 'helo';
    
  }
  async function f1() {
    const x = await new Promise(resolve => {
      setTimeout(() => resolve(boo()), 1000)
    })
    return x
  }
  async function f2() {
    const res = 2
    return res
  }
  async function f3() {
    const res = 3
    return res
  }
  
  async function go() {
    let a = await f1();
    console.log(a);
    let b = await f2();
    console.log(b);
    let c = await f3();
    console.log(c);
  }
  
  go()