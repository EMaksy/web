import React from 'react';
import ListView from '@components/ListView';
import Table from '@components/Table';
import Pill from '@components/Pill/Pill';
import {
  EOS_APPLICATION_OUTLINED,
  EOS_DATABASE_OUTLINED,
} from 'eos-icons-react';
import { APPLICATION_TYPE } from '@lib/model';
import {
  systemHostsTableConfiguration,
  systemInstancesTableConfiguration,
} from './tableConfigs';

export function GenericSystemDetails({ title, type, system }) {
  if (!system) {
    return <div>Not Found</div>;
  }

  const renderType = (t) =>
    t === APPLICATION_TYPE ? 'Application server' : 'HANA Database';

  const getUniqueHosts = (hosts) =>
    Array.from(
      hosts
        .reduce((hostsMap, host) => {
          if (!hostsMap.has(host.id)) hostsMap.set(host.id, host);
          return hostsMap;
        }, new Map())
        .values()
    );

  return (
    <div>
      <div className="flex">
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      <div className="mt-4 bg-white shadow rounded-lg py-4 px-8">
        <ListView
          orientation="vertical"
          data={[
            { title: 'Name', content: system.sid },
            {
              title: 'Type',
              content: renderType(type),
            },
            {
              title: '',
              content: type,
              render: (content) => (
                <div className="float-right">
                  {content === APPLICATION_TYPE ? (
                    <EOS_APPLICATION_OUTLINED
                      size={25}
                      className="fill-blue-500"
                    />
                  ) : (
                    <EOS_DATABASE_OUTLINED
                      size={25}
                      className="fill-blue-500"
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>

      <div className="mt-16">
        <div className="flex flex-direction-row">
          <h2 className="text-2xl font-bold self-center">Layout</h2>
        </div>
        <Table
          config={systemInstancesTableConfiguration}
          data={system.instances}
        />
      </div>

      <div className="mt-8">
        <div>
          <h2 className="text-2xl font-bold">Hosts</h2>
        </div>
        <Table
          config={systemHostsTableConfiguration}
          data={getUniqueHosts(system.hosts)}
        />
      </div>
    </div>
  );
}

export function InstanceStatus({ health = undefined }) {
  let cssClass;
  let instanceStatus;

  switch (health) {
    case 'passing':
      cssClass = 'bg-jungle-green-500';
      instanceStatus = 'SAPControl-GREEN';
      break;
    case 'warning':
      cssClass = 'bg-yellow-500';
      instanceStatus = 'SAPControl-YELLOW';
      break;
    case 'critical':
      cssClass = 'bg-red-500';
      instanceStatus = 'SAPControl-RED';
      break;
    default:
      cssClass = 'bg-gray-500';
      instanceStatus = 'SAPControl-GRAY';
      break;
  }

  return (
    <Pill roundedMode="rounded" className={`${cssClass} text-gray-50`}>
      {instanceStatus}
    </Pill>
  );
}

export function Features({ features }) {
  return (
    <div>
      {features.split('|').map((feature) => (
        <Pill key={feature}>{feature}</Pill>
      ))}
    </div>
  );
}
