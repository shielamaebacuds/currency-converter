// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`
import { useEffect, useState } from "react";

export default function App() {
  const [inputValue, setInputValue] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [output, setOutput] = useState();
  const [isLoading, setIsLoading] = useState(false);

  function handleInputValue(e) {
    const currentInput = e.target.value;
    if (!isNaN(Number(currentInput)) && currentInput !== "")
      setInputValue(currentInput);
    else setInputValue(1);
  }

  function handleFromCurrency(e) {
    setFromCurrency(e.target.value);
  }

  function handleToCurrency(e) {
    setToCurrency(e.target.value);
  }

  useEffect(
    function () {
      const controller = new AbortController();

      async function convert() {
        try {
          if (fromCurrency !== toCurrency) {
            setIsLoading(() => true);

            if (isLoading) {
              setOutput(() => "Computing ");
            }

            const res = await fetch(
              `https://api.frankfurter.app/latest?amount=${inputValue}&from=${fromCurrency}&to=${toCurrency}`,
              { signal: controller.signal }
            );

            const data = await res.json();
            setOutput(() => data.rates[toCurrency]);
          } else setOutput(() => inputValue);
        } catch (e) {
          if (e.name !== "AbortError")
            setOutput(() => "😞 Error fetching data");
        } finally {
          setIsLoading(() => false);
        }
      }
      convert();

      //cleanup function
      return function () {
        controller.abort();
      };
    },
    [inputValue, fromCurrency, toCurrency]
  );
  return (
    <div>
      <input type="text" onChange={handleInputValue} value={inputValue} />
      <select onChange={handleFromCurrency} value={fromCurrency}>
        <option value="PHP">PHP</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select onChange={handleToCurrency} value={toCurrency}>
        <option value="PHP">PHP</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>

        {inputValue} {fromCurrency} = {output} {toCurrency}
      </p>
    </div>
  );
}
