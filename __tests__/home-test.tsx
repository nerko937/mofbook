import { render, screen } from '@testing-library/react-native';
import Home from '../src/navigation/home';

describe('Home', () => {
  it('shows a welcome message', () => {
    render(<Home />);
    expect(screen.getByText('chleb')).toBeTruthy();
    expect(screen.getByText('masło')).toBeTruthy();
    expect(screen.getByText('mleko')).toBeTruthy();
  });
});
