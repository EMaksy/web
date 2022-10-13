import React from 'react';

import { render, screen } from '@testing-library/react';
import 'intersection-observer';
import '@testing-library/jest-dom';
import { withState } from '@lib/test-utils';

import HomeHealthSummary from '.';
import ComponentHealthSummary from  '.';
import HealthSummary from '.';

describe('HomeHealthSummary icons',() => {
    it('should have an clickable Pacemaker Cluster icon which links to the belonging cluster overview',
      () => {
        //need an example id to check if the link is correct
        const pacemakerId="HERE_IS_THE_TEST_ID"; // where should i grab the data.

        const [statefulHomeHealthSummary, store] = withState(
          <HomeHealthSummary/>);
          
        //store.dispatch((healthSummaryTableConfig()));
        //store.dispatch((GlobalHealth()));
        //store.dispatch(HealthSummary());
       
        //store.dispatch(healthSummaryTableConfig());

        store.dispatch(HealthSummary());
        render(statefulHomeHealthSummary);

        //console.log(render(statefulHomeHealthSummary));

        //expect(screen.getByRole('href')).toHaveTextContent(`/routes/${pacemakerId}`);
        expect(screen.getByText(`/routes/${pacemakerId}`)).toBeTruthy();
      });

      it('should have an clickable Database icon which links to the belonging Database overview',
      () => {
        //need an example id to check if the link is correct
        const databaseID="HERE_IS_THE_TEST_ID"; // where should i grab the data.

        const [statefulHomeHealthSummary, store] = withState(
          <HealthSummary/>);
          
        //store.dispatch((healthSummaryTableConfig()));
        //store.dispatch((GlobalHealth()));
        //store.dispatch(HealthSummary());
       
        //store.dispatch(healthSummaryTableConfig());

        store.dispatch(healthSummaryTableConfig());
        render(statefulHomeHealthSummary);

        //console.log(render(statefulHomeHealthSummary));

        expect(screen.getByText(`/databases/${databaseID}`)).toBeTruthy();
      });

      it('should have an clickable Sap Instance icon which links to the belonging SAP SYSTEMS overview',
      () => {
        //need an example id to check if the link is correct
        const sapInstanceId = "HERE_IS_THE_TEST_ID"; // where should i grab the data.

        const [statefulHomeHealthSummary, store] = withState(
          <HealthSummary/>);
          
        //store.dispatch((healthSummaryTableConfig()));
        //store.dispatch((GlobalHealth()));
        //store.dispatch(HealthSummary());
       
        //store.dispatch(healthSummaryTableConfig());

        store.dispatch(healthSummaryTableConfig());
        render(statefulHomeHealthSummary);

        //console.log(render(statefulHomeHealthSummary));
        expect(screen.getByText(`/sap_systems/${sapInstanceId}`)).toBeTruthy();
      });


      
    });
    