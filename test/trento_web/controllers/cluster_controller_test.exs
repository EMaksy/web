defmodule TrentoWeb.ClusterControllerTest do
  use TrentoWeb.ConnCase, async: true

  import OpenApiSpex.TestAssertions

  alias TrentoWeb.OpenApi.ApiSpec

  import Trento.Factory

  import Mox

  setup [:set_mox_from_context, :verify_on_exit!]

  describe "list" do
    test "should list all clusters", %{conn: conn} do
      insert_list(2, :cluster)

      api_spec = ApiSpec.spec()

      conn
      |> get("/api/clusters")
      |> json_response(200)
      |> assert_schema("PacemakerClustersCollection", api_spec)
    end
  end

  describe "runner_callback" do
    test "should return 400 when the request is invalid", %{conn: conn} do
      resp =
        conn
        |> post("/api/runner/callback", %{
          "invalid" => "not valid?"
        })
        |> json_response(400)

      assert %{"error" => "runner callback failed"} = resp
    end
  end

  describe "select_checks" do
    test "should return bad request when the request is malformed", %{conn: conn} do
      cluster_id = UUID.uuid4()

      expect(
        Trento.Commanded.Mock,
        :dispatch,
        fn _ ->
          {:error, "the reason is you"}
        end
      )

      resp =
        conn
        |> post("/api/clusters/#{cluster_id}/checks", %{
          "cluster_id" => cluster_id,
          "checks" => []
        })
        |> json_response(400)

      assert %{"error" => "the reason is you"} = resp
    end
  end

  describe "request check executions" do
    test "should return 400 when the request is invalid", %{conn: conn} do
      cluster_id = UUID.uuid4()

      expect(
        Trento.Commanded.Mock,
        :dispatch,
        fn _ ->
          {:error, "the reason is us"}
        end
      )

      resp =
        conn
        |> post("/api/clusters/#{cluster_id}/checks/request_execution", %{
          "cluster_id" => cluster_id
        })
        |> json_response(400)

      assert %{"error" => "the reason is us"} = resp
    end
  end

  describe "Connection Settings Management for the Hosts of a Cluster" do
    setup do
      cluster_id = Faker.UUID.v4()
      insert(:cluster, id: cluster_id)

      %{
        cluster_id: cluster_id,
        hosts: [
          insert(:host, hostname: "A-01", cluster_id: cluster_id),
          insert(:host, hostname: "B-01", cluster_id: cluster_id)
        ]
      }
    end

    test "should retrieve connection settings for a given cluster", %{
      conn: conn,
      cluster_id: cluster_id,
      hosts: [
        %{id: a_host_id, cluster_id: cluster_id},
        %{id: another_host_id, cluster_id: cluster_id}
      ]
    } do
      resp =
        conn
        |> get("/api/clusters/#{cluster_id}/connection_settings")
        |> json_response(200)

      assert [
               %{
                 "default_user" => "root",
                 "host_id" => ^a_host_id,
                 "user" => nil
               },
               %{
                 "default_user" => "root",
                 "host_id" => ^another_host_id,
                 "user" => nil
               }
             ] = resp
    end

    test "should apply desired connection settings for the hosts of a given cluster", %{
      conn: conn,
      cluster_id: cluster_id,
      hosts: [
        %{id: a_host_id, cluster_id: cluster_id},
        %{id: another_host_id, cluster_id: cluster_id}
      ]
    } do
      connection_user = "cloudadmin"

      resp =
        conn
        |> put(
          "/api/clusters/#{cluster_id}/connection_settings",
          %{
            "settings" => [
              %{
                "host_id" => a_host_id,
                "user" => connection_user
              },
              %{
                "host_id" => another_host_id,
                "user" => connection_user
              }
            ]
          }
        )
        |> json_response(200)

      assert [
               %{
                 "host_id" => ^a_host_id,
                 "user" => ^connection_user
               },
               %{
                 "host_id" => ^another_host_id,
                 "user" => ^connection_user
               }
             ] = resp
    end
  end
end
