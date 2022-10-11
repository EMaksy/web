import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeHealthSummary from './HomeHealthSummary';
import { withState } from '@lib/test-utils';

describe('HomeHealthSummary icons'),
  () => {
    it(
      'should have an clickacble Pacemaker Cluster icon which links to the belonging cluster overview'
    ),
      () => {
        // load data from the state
        const [statefulHomeHealthSummary, store] = withState(
          <HomeHealthSummary />
        );
        console.log(statefulHomeHealthSummary, store);

        render(statefulHomeHealthSummary);
        // grab cluster id from

        // simulate user clicking the icon?

        // assert/expect the response route is like the expected
      };
  };
