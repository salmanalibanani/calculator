import { render, screen } from '@testing-library/react';
import { Results } from './components/Results';
import MarkupService from './services/MarkupService';
import MarksupService from './services/MarkupService';

test('Render Results', () => {
  render(<Results CurrencyPair='USDGBP'  ClientBuyCurrency="USD" ClientSellCurrency = "GBP" Amount={100} Rate={10}/>);
  const buyCurrency = screen.getByTestId('targetCurrency');
  expect(buyCurrency).toBeInTheDocument();
  expect(buyCurrency).toHaveTextContent('Target currency: USD');
  const baseRate = screen.getByTestId('baseRate');
  expect(baseRate).toBeInTheDocument();
  expect(baseRate).toHaveTextContent('Paytron base rate: 10');

});

test('Marksup Service: base amount is correct', () => {
  const service:MarkupService  = new MarksupService(0.005, 1000, 0.75, 'AUDUSD', 'USD', 'AUD');
  var x = service.BaseAmount();
  expect(x).toEqual(750);
});

test('Marksup Service: markup amount is correct', () => {
  const service:MarkupService  = new MarksupService(0.005, 1000, 0.75, 'AUDUSD', 'USD', 'AUD');
  expect(service.PaytronMarkup()).toEqual(3.75);
});

test('Marksup Service: final amount is correct', () => {
  const service:MarkupService  = new MarksupService(0.005, 1000, 0.75, 'AUDUSD', 'USD', 'AUD');
  expect(service.FinalAmount()).toEqual(746.25);
});

test('Marksup Service: effective rate is correct', () => {
  const service:MarkupService  = new MarksupService(0.005, 1000, 0.75, 'AUDUSD', 'USD', 'AUD');
  expect(service.EffectiveRate()).toEqual(0.74625);
})