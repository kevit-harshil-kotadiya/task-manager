const {calculateTip,fahrenheitToCelsius,celsiusToFahrenheit} = require('../src/math');

test('Should calculate total with tip',()=>{
    const total  = calculateTip(10,0.3);

    expect(total).toBe(13)

    // if(total!==13){
    //     throw new Error('Total tip should be 13. Got ' + total);
    // }

})

test('Should calculate total with default tip',()=>{
    const total = calculateTip(10)
    expect(total).toBe(12);
})

test('Should convert 32 F to 0 C',()=>{
    const celcius = fahrenheitToCelsius(32)
    expect(celcius).toBe(0);
})

test('Should convert 0 C to 32 F',()=>{
    const fahrenheit = celsiusToFahrenheit(0)
    expect(fahrenheit).toBe(32);
})

test('Async test demo',(done)=>{
    setTimeout(() => {
          expect(1).toBe(1);
          done();
    }, 2000);
    
})