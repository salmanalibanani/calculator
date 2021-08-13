import { render, screen } from '@testing-library/react';
import { Results } from './components/Results';

test('Render Results', () => {
  render(<Results CurrencyPair='USDGBP'  ClientBuyCurrency="USD" ClientSellCurrency = "GBP" Amount={100} Rate={10}/>);
  const buyCurrency = screen.getByTestId('targetCurrency');
  expect(buyCurrency).toBeInTheDocument();
  expect(buyCurrency).toHaveTextContent('Target currency: USD');

  const baseRate = screen.getByTestId('baseRate');
  expect(baseRate).toBeInTheDocument();
  expect(baseRate).toHaveTextContent('Base Rate: 10');

});
