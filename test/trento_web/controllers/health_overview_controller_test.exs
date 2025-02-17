defmodule TrentoWeb.HealthOverviewControllerTest do
  use TrentoWeb.ConnCase, async: true

  import OpenApiSpex.TestAssertions

  alias TrentoWeb.OpenApi.ApiSpec

  import Trento.Factory
  require Trento.Domain.Enums.Health, as: Health
  require Trento.Domain.Enums.ClusterType, as: ClusterType

  test "should return the expected overview", %{conn: conn} do
    %Trento.ClusterReadModel{id: cluster_id} =
      insert(:cluster, type: ClusterType.hana_scale_up(), health: Health.passing())

    %Trento.HostReadModel{id: host_1_id} =
      insert(:host, cluster_id: cluster_id, heartbeat: :unknown)

    %Trento.SapSystemReadModel{
      id: sap_system_id,
      sid: sid
    } = insert(:sap_system, health: Health.critical())

    insert(
      :database_instance_without_host,
      sap_system_id: sap_system_id,
      sid: "HDD",
      host_id: host_1_id,
      health: Health.warning()
    )

    insert(
      :application_instance_without_host,
      sap_system_id: sap_system_id,
      sid: sid,
      host_id: host_1_id,
      health: Health.critical()
    )

    conn = get(conn, "/api/sap_systems/health")

    assert 200 == conn.status

    api_spec = ApiSpec.spec()

    assert_schema(json_response(conn, 200), "HealthOverview", api_spec)
  end
end
