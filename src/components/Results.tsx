import '../App.css';
import MarkupService from '../services/MarkupService';

export interface IResults {
  CurrencyPair: string;
  ClientBuyCurrency: string;
  ClientSellCurrency: string;
  Amount: number;
  Rate: number;
}

export const Results : React.FC<IResults> = (props) => {

  const markupService = new MarkupService(0.005, props.Amount, props.Rate, props.CurrencyPair, props.ClientBuyCurrency, props.ClientSellCurrency);

  return (
    <div className="Results">
      <div>You are selling: {props.ClientSellCurrency} {props.Amount}</div>
      <div data-testid='targetCurrency'>Target currency: {props.ClientBuyCurrency}</div>
      <div data-testid='baseRate'>Paytron base rate: {props.Rate}</div>
      <div>Amount @ base rate: {(markupService.BaseAmount()).toFixed(2) }</div> 
      <div>Paytron rate: { (markupService.EffectiveRate()).toFixed(4) } </div>
      <div>Paytron markup: {props.ClientBuyCurrency} { (markupService.PaytronMarkup()).toFixed(4) } </div>
      <div>Final amount: {props.ClientBuyCurrency} { (markupService.FinalAmount()).toFixed(4) } </div>
    </div>

  );
} 