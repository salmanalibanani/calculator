import React, {useState, useEffect, useRef} from 'react';
import { CurrencyDropdown } from './components/CurrencyDropdown';
import { useFormik } from 'formik';
import { Button, TextField } from '@material-ui/core';
import * as Yup from 'yup'
import { Results } from './components/Results';
import axios from 'axios';
import './App.css';

interface RateRequest {
  clientBuyCurrency: string;
  clientSellCurrency: string;
  currencyPair: string;
  amount: number;
  showResults: boolean;
  rate: number;
}

interface RateRequestResult {
  rate: number;
  currencyPair: string;
  showResults: boolean;
}


async function getRates(clientBuyCurrency: string, clientSellCurrency:string, amount:number) : Promise<RateRequestResult> {

  const result: RateRequestResult = {
      showResults: false,
      rate: 0,
      currencyPair: ''
    }

    var r = await axios.get(`https://wnvgqqihv6.execute-api.ap-southeast-2.amazonaws.com/Public/public/rates?Buy=${clientBuyCurrency}&Sell=${clientSellCurrency}&Amount=${amount}&Fixed=sell`);

    if (r.data.clientRate) {
      result.showResults = true;
      result.rate = r.data.midMarketRate;
      result.currencyPair = r.data.currencyPair;
    }
    
  return result;
}

function App() {

  const timers: number[] = [];
  const [rates, setRates] = useState<RateRequestResult>({rate: 0, currencyPair:'', showResults:false});
  const makeCalls = React.useRef(false);
  const timerList = useRef(timers);

  var timer1: number = 0;

  async function updateRates() {
    try {
      if (formik.values.clientBuyCurrency != '')
      {
        const result = await getRates(formik.values.clientBuyCurrency, formik.values.clientSellCurrency, formik.values.amount);
        setRates(result);
      }
    }
    catch(e) {
      console.log('updateRates failed');
    }

    if (makeCalls.current) {
      timer1 = window.setTimeout(updateRates, 5000);
      timerList.current.push(timer1);
    }    
  };
  
  const validationSchema = Yup.object().shape({
    clientBuyCurrency: Yup.string().required('Buy currency is required.'),
    clientSellCurrency: Yup.string().required('Sell currency is required.'),
    amount: Yup.number().min(1, "Minimum amount is 1.").required('Amount is required.'),
  });
  
  useEffect(() => {
    
    if (rates.showResults) {
          formik.values.showResults = true;
          formik.values.rate = rates.rate;
          formik.values.currencyPair = rates.currencyPair;
        }
    }, [rates]);
  
  const formik = useFormik<RateRequest>({
    initialValues: {
      clientBuyCurrency: '', 
      clientSellCurrency: '',
      currencyPair: '',
      amount: 0,
      showResults: false,
      rate: 0,
    },
    validationSchema: validationSchema, 
    
    onSubmit: async (values) => {
      try {
        console.log('onSubmit');
        StopCalls();
        makeCalls.current = true;
        formik.values.showResults = false;
        updateRates();
      }
      catch (e)
      {
        console.log("There was some error");
        console.log(e);
      }
    }
  });
  
  function handleDropdownChange(e: any)
  {
    formik.values.showResults = false;
    StopCalls();
    formik.handleChange(e);
  }

  function StopCalls() {
    makeCalls.current = false;
    timerList.current.forEach((item) =>  window.clearTimeout(item));
    timerList.current = [];
    
  }

  return (
    <div className="App">
    <form onSubmit={formik.handleSubmit}>
        <div>
        <TextField 
          id="amount"
          name="amount"
          value={formik.values.amount}
          onChange={formik.handleChange}
          error={formik.touched.amount && Boolean(formik.errors.amount)}
          style={{ width: 300 }}
          label="Amount"
          /> 
        <br />
        <div className="ErrorMessage">
        { formik.touched.amount && formik.errors.amount }
        </div>
        </div>
        <div>
        <CurrencyDropdown 
          id="clientSellCurrency"
          name="clientSellCurrency"
          value={formik.values.clientSellCurrency}
          onChange={handleDropdownChange}
          error={formik.touched.clientSellCurrency && Boolean(formik.errors.clientSellCurrency)}
          style={{ width: 300 }}
          label="Sell"
        />
        <br />
        <div className="ErrorMessage">
        { formik.touched.clientSellCurrency && formik.errors.clientSellCurrency }
        </div>
        </div>
        <div>
        <CurrencyDropdown
          id="clientBuyCurrency"
          name="clientBuyCurrency"
          value={formik.values.clientBuyCurrency}
          onChange={handleDropdownChange}
          error={formik.touched.clientBuyCurrency && Boolean(formik.errors.clientBuyCurrency)}
          style={{ width: 300 }}
          label="Buy"
        />
        <br />
        <div className="ErrorMessage">
        { formik.touched.clientBuyCurrency && formik.errors.clientBuyCurrency }
        </div>
        </div>
      <div>
        <br />
        <Button type="submit" variant="contained">
          Convert
        </Button>
      </div>

      { formik.values.showResults && <Results ClientBuyCurrency={formik.values.clientBuyCurrency} ClientSellCurrency={formik.values.clientSellCurrency} CurrencyPair={formik.values.currencyPair} Amount={formik.values.amount} Rate={formik.values.rate} />   }

    </form>
    </div>
  );
};

export default App;
