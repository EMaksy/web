import React from 'react';
import { render, screen } from '@testing-library/react';
import 'intersection-observer';
import '@testing-library/jest-dom';
import { withState } from '@lib/test-utils';
import {BrowserRouter, MemoryRouter} from 'react-router-dom';


import { HomeHealthSummary } from './HomeHealthSummary';
import { setHealthSummary, stopHealthSummaryLoading } from '@state/healthSummary';
//import App from '@testing-library/trento.jsx';

describe('HomeHealthSummary icons',() => {
    it('should have an clickable Pacemaker Cluster icon which links to the belonging cluster overview',
      () => {
        const [statefulHomeHealthSummary, store] = withState(<HomeHealthSummary/>);
        //const user = userEvent.setup()
        //console.log('Current directory: ' + process.cwd());
        console.log(statefulHomeHealthSummary);
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
        //console.log(screen.getAllByText('/databases/string'));
        //render(<App />, {wrapper: BrowserRouter});
        render(statefulHomeHealthSummary,{wrapper: BrowserRouter});
        console.log("This is the whole screen");
        //console.log(screen);
        console.log(document);
        //console.log(screen.getByText(`/clusters/string`));
        //console.log(screen);
        //expect(screen.getByRole('href')).toHaveTextContent(`/routes/${pacemakerId}`);
        //console.log(statefulHomeHealthSummary)
        console.log(/cluster/id);
        console.log(/databases/id);
        console.log((/sap_systems/id));

        const asserted_string  = /cluster/id;
        expect(screen.getByText(asserted_string)).toBeTruthy();
        //expect(screen.getByText('a href="/clusters/string">')).toBeTruthy();
        //expect(screen.getByRole('a', href: '/clusters/string'))
       // expect(screen.toHaveAttribute('href', '/clusters/string').toBeTruthy());
      });


      
    });
    