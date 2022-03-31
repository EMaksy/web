import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import axios from 'axios';
import Table from './Table';
import Tags from './Tags';
import { addTagToCluster, removeTagFromCluster } from '@state/clusters';

import { EOS_EDIT, EOS_RUN_CIRCLE, EOS_MORE_HORIZ } from 'eos-icons-react';

import { logError } from '@lib/log';

import HealthIcon from '@components/Health';
import Spinner from '@components/Spinner';

const getClusterTypeLabel = (type) => {
  switch (type) {
    case 'hana_scale_up':
      return 'HANA Scale Up';
    case 'hana_scale_out':
      return 'HANA Scale Out';
    default:
      return 'Unknown';
  }
};

const getClusterLink = (cluster, text) => {
  if (cluster.hasDetails) {
    return (
      <Link
        className="text-jungle-green-500 hover:opacity-75"
        to={`/clusters/${cluster.id}`}
      >
        {text || cluster.name}
      </Link>
    );
  }

  return cluster.name;
};

const addTag = (tag, clusterId) => {
  axios
    .post(`/api/clusters/${clusterId}/tags`, {
      value: tag,
    })
    .catch((error) => {
      logError('Error posting tag: ', error);
    });
};

const removeTag = (tag, clusterId) => {
  axios.delete(`/api/clusters/${clusterId}/tags/${tag}`).catch((error) => {
    logError('Error deleting tag: ', error);
  });
};

const ClustersList = () => {
  const clusters = useSelector((state) => state.clustersList.clusters);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const config = {
    columns: [
      {
        title: 'Health',
        key: 'health',
        filter: true,
        render: (content, { checks_execution }) => {
          if (checks_execution === 'not_running') {
            return (
              <div className="ml-4">
                <HealthIcon health={content} />
              </div>
            );
          } else {
            return (
              <div className="ml-4">
                <Spinner></Spinner>
              </div>
            );
          }
        },
      },
      {
        title: 'Name',
        key: 'name',
        filter: true,
        render: (content, item) => getClusterLink(item),
      },
      {
        title: 'ID',
        key: 'id',
        render: (content, item) => getClusterLink(item, content),
      },
      {
        title: 'SID',
        key: 'sid',
        filter: true,
      },
      {
        title: 'Type',
        key: 'type',
        render: (content, item) => (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 truncate">
            {getClusterTypeLabel(item.type)}
          </span>
        ),
      },
      {
        title: 'Tags',
        key: 'tags',
        render: (content, item) => (
          <Tags
            tags={content}
            onChange={() => {}}
            onAdd={(tag) => {
              addTag(tag, item.id);
              dispatch(
                addTagToCluster({ tags: [{ value: tag }], id: item.id })
              );
            }}
            onRemove={(tag) => {
              removeTag(tag, item.id);
              dispatch(
                removeTagFromCluster({ tags: [{ value: tag }], id: item.id })
              );
            }}
          />
        ),
      },
      {
        title: 'Actions',
        key: 'check_results',
        render: (content, item) => {
          if (item.type == 'hana_scale_up') {
            return (
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                    <EOS_MORE_HORIZ />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute z-10 right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-jungle-green-500 text-white'
                                : 'text-gray-900'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() =>
                              navigate(`/clusters/${item.id}/checks`)
                            }
                          >
                            <span className="pr-1">
                              {active ? (
                                <EOS_EDIT color="white" />
                              ) : (
                                <EOS_EDIT color="black" />
                              )}
                            </span>
                            Edit checks
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                    {item.selected_checks?.length > 0 && (
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? 'bg-jungle-green-500 text-white'
                                  : 'text-gray-900'
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                              onClick={() => {
                                dispatch({
                                  type: 'REQUEST_CHECKS_EXECUTION',
                                  payload: {
                                    clusterID: item.id,
                                  },
                                });
                                navigate(`/clusters/${item.id}/checks/results`);
                              }}
                            >
                              <span className="pr-1">
                                {active ? (
                                  <EOS_RUN_CIRCLE color="white" />
                                ) : (
                                  <EOS_RUN_CIRCLE color="black" />
                                )}
                              </span>
                              Start execution
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    )}
                  </Menu.Items>
                </Transition>
              </Menu>
            );
          }
        },
      },
    ],
  };

  const data = clusters.map((cluster) => {
    return {
      health: cluster.health,
      name: cluster.name,
      id: cluster.id,
      sid: cluster.sid,
      type: cluster.type,
      hasDetails: cluster.details != null,
      checks_execution: cluster.checks_execution,
      selected_checks: cluster.selected_checks,
      tags: (cluster.tags && cluster.tags.map((tag) => tag.value)) || [],
    };
  });

  return <Table config={config} data={data} />;
};

export default ClustersList;
