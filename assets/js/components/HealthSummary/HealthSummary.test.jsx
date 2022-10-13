import React from 'react';

import { render, screen } from '@testing-library/react';
import 'intersection-observer';
import '@testing-library/jest-dom';
import { withState } from '@lib/test-utils';

import { HomeHealthSummary } from './HomeHealthSummary';

import { setHealthSummary, stopHealthSummaryLoading } from '@state/healthSummary';

describe('HomeHealthSummary icons',() => {
    it('should have an clickable Pacemaker Cluster icon which links to the belonging cluster overview',
      () => {
        //need an example id to check if the link is correct
        const pacemakerId="HERE_IS_THE_TEST_ID"; // where should i grab the data.
        const [statefulHomeHealthSummary, store] = withState(<HomeHealthSummary/>);


        store.dispatch(setHealthSummary([{
          id: 'blabla',
          sid: 'blabla',
          
        }]));
        store.dispatch(stopHealthSummaryLoading());
        
        render(statefulHomeHealthSummary);

        //expect(screen.getByRole('href')).toHaveTextContent(`/routes/${pacemakerId}`);
        expect(screen.getByText(`/routes/blabla`)).toBeTruthy();
      });


      
    });
    