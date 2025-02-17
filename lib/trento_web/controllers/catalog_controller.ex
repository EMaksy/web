defmodule TrentoWeb.CatalogController do
  use TrentoWeb, :controller

  alias Trento.Integration.Checks

  alias TrentoWeb.OpenApi.Schema.{ChecksCatalog, Provider}

  use OpenApiSpex.ControllerSpecs

  operation :checks_catalog,
    summary: "Checks Catalog",
    tags: ["Checks"],
    description:
      "The list of the available checks that can be configured to run on the target SAP infrastructure",
    parameters: [
      flat: [
        in: :query,
        type: :string,
        description:
          "Whether to output a flat catalog or not. Just provide the flag, not the value. eg /api/checks/catalog?flat"
      ],
      provider: [
        in: :query,
        type: Provider.FilterableProviders,
        description: "Whether to filter by a specific provider"
      ]
    ],
    responses: [
      ok: {"A Collection of the available Checks", "application/json", ChecksCatalog.Catalog},
      bad_request: {"Bad Request", "application/json", ChecksCatalog.UnableToLoadCatalog}
    ]

  @spec checks_catalog(Plug.Conn.t(), map) :: Plug.Conn.t()
  def checks_catalog(conn, params) do
    case get_catalog(params) do
      {:ok, content} ->
        filtered_content = filter_by_provider(content, params)
        json(conn, filtered_content)

      {:error, reason} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: reason})
    end
  end

  defp get_catalog(%{"flat" => ""}) do
    case Checks.get_catalog() do
      {:ok, catalog} ->
        {:ok, catalog.checks}

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp get_catalog(_) do
    case Checks.get_catalog_grouped_by_provider() do
      {:ok, catalog} ->
        {:ok, catalog.providers}

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp get_provider("azure"), do: "azure"
  defp get_provider("gcp"), do: "gcp"
  defp get_provider("aws"), do: "aws"
  defp get_provider(_), do: "default"

  defp filter_by_provider(catalog, %{"provider" => provider}) do
    provider = get_provider(provider)

    Enum.filter(catalog, fn x -> Atom.to_string(x.provider) == provider end)
  end

  defp filter_by_provider(catalog, _), do: catalog
end
