import './App.css';
import React, {useState, useEffect} from 'react';

import { CurrencyDropdown } from './components/CurrencyDropdown';
import { useFormik } from 'formik';
import { Button, FormLabel, TextField } from '@material-ui/core';
import * as Yup from 'yup'
import { Results } from './components/Results';
import axios from 'axios';

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

    //console.log('clientBuyCurrency');
    //console.log(clientBuyCurrency);

    //console.log('clientSellCurrency');
    //console.log(clientSellCurrency);

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
  const [rates, setRates] = React.useState<RateRequestResult>({rate: 0, currencyPair:'', showResults:false});
  const [timerList, setTimerList] = React.useState(timers);
  const [isMounted, setIsMounted] = React.useState(false)
  const [makeCalls, setMakeCalls] = React.useState(false);

  var timer1: number = 0;

  async function updateRates() {
    try {
      console.log('Inside updateRates');
      console.log('makeCalls');
      console.log(makeCalls);
      console.log('formik.values.clientBuyCurrency');
      console.log(formik.values.clientBuyCurrency);
      if (formik.values.clientBuyCurrency == '')
      {
        console.log('Not making the network call');
      }
      else
      {
        const result = await getRates(formik.values.clientBuyCurrency, formik.values.clientSellCurrency, formik.values.amount);
        setRates(result);
      }
    }
    catch(e) {
      console.log('updateRates failed');
    }

    if (makeCalls) {
      timer1 = window.setTimeout(updateRates, 5000);
      console.log("I am here 78");
      console.log('timer1 is');
      console.log(timer1);
      var t = timerList;
      t.push(timer1);
      setTimerList(t);
      console.log('timerList is');
      console.log(timerList);
      console.log('**************');
    }    
    // console.log('timer');
    // console.log(timer);
    // console.log('I am here 79');
  };
  
  const validationSchema = Yup.object().shape({
    clientBuyCurrency: Yup.string().required('Buy currency is required.'),
    clientSellCurrency: Yup.string().required('Sell currency is required.'),
    amount: Yup.number().min(1, "Minimum amount is 1.").required('Amount is required.'),
  });
  
  useEffect(() => {
    
    if (!isMounted) {
      setIsMounted(true);
    }
    
    if (rates.showResults) {
          formik.values.showResults = true;
          formik.values.rate = rates.rate;
          formik.values.currencyPair = rates.currencyPair;
        }
    }, [rates]);
  
  useEffect(() => {
    console.log("I am here abc");
    if (makeCalls) {
      console.log("makeCalls is true");
      updateRates();
    }
    else {
      console.log('setting calls to false');
    }
  }, [makeCalls]);

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
        setMakeCalls(true);
      }
      catch (e)
      {
        console.log("There was some error");
        console.log(e);
      }
    }
  });
  
  function StopCalls() {
    console.log('StopCalls called');
    setMakeCalls(false);
    // var highestTimeoutId = setTimeout(";");
    // console.log('highestTimeoutId');
    // console.log(highestTimeoutId);

    // for (var i = highestTimeoutId + 100 ; i > 0; i--) {
    //   window.clearTimeout(i); 
    // }
    
    // console.log("Calls stopped. timer list is");
    // console.log(timerList);
    // timerList.forEach((item) =>  window.clearTimeout(item));
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
          onChange={formik.handleChange}
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
          onChange={formik.handleChange}
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
        <Button onClick={StopCalls} variant="contained">
          Stop
        </Button>
      </div>

      { formik.values.showResults && <Results ClientBuyCurrency={formik.values.clientBuyCurrency} ClientSellCurrency={formik.values.clientSellCurrency} CurrencyPair={formik.values.currencyPair} Amount={formik.values.amount} Rate={formik.values.rate} />   }

    </form>
    </div>
  );
};

export default App;
