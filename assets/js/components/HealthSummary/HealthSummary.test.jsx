import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeHealthSummary from './HomeHealthSummary';
import { withState } from '@lib/test-utils';

describe('HomeHealthSummary icons',() => {
    it('should have an clickacble Pacemaker Cluster icon which links to the belonging cluster overview',
      () => {
        // load component
        const [statefulHomeHealthSummary, store] = withState(
          <HomeHealthSummary />);
          
        store.dispatch((healthSummaryTableConfig()));
        store.dispatch((GlobalHealth()));
        store.dispatch((HomeHealthSummary()));
        render(statefulHomeHealthSummary);
        expect(screen.getByRole('a href')).toHaveTextContent('/routes/');
      });
    });
    