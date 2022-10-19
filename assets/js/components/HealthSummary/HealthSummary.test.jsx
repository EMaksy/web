import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'intersection-observer';
import '@testing-library/jest-dom';
import { withState } from '@lib/test-utils';
import {BrowserRouter, MemoryRouter} from 'react-router-dom';


import { HomeHealthSummary } from './HomeHealthSummary';
import { setHealthSummary, stopHealthSummaryLoading } from '@state/healthSummary';
import App from '@testing-library/trento.jsx';

describe('HomeHealthSummary icons',() => {
    it('should have an clickable Pacemaker Cluster icon which links to the belonging cluster overview',
      () => {
        const [statefulHomeHealthSummary, store] = withState(<HomeHealthSummary/>);
        //const user = userEvent.setup()
        console.log('Current directory: ' + process.cwd());
        store.dispatch(setHealthSummary([{
          id: 'string',
          sid: 'string',
          clusterId: "string",
          clustersHealth: "string",
          databaseHealth: "string",
          databaseId: "string",
          hostsHealth: "string",
          id: "string",
          sapsystemHealth: "string",
          sid: "string"
        }]));
      
        store.dispatch(stopHealthSummaryLoading());

        render(<App />, {wrapper: BrowserRouter});
        render(statefulHomeHealthSummary);

        console.log(screen);
        //expect(screen.getByRole('href')).toHaveTextContent(`/routes/${pacemakerId}`);
        //console.log(statefulHomeHealthSummary)
        expect(screen.getByText(`/routes/string`)).toBeTruthy();
      });


      
    });
    