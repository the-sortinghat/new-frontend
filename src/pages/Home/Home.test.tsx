import { System } from "@model/system";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import { Home } from "./Home";

describe("Home", () => {
  const systems: System[] = [
    {
      id: "1",
      name: "InterSCity",
      description: "Platform for smart cities",
      modules: [],
      services: [],
      databases: [],
      databasesUsages: [],
      syncOperations: [],
      asyncOperations: [],
    },
    {
      id: "2",
      name: "TrainTicket",
      description: "Benchmark",
      modules: [],
      services: [],
      databases: [],
      databasesUsages: [],
      syncOperations: [],
      asyncOperations: [],
    },
  ];

  beforeEach(() => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve(systems),
    } as Response);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderPage = async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await act(() => new Promise((resolve) => setTimeout(resolve, 500)));
  };

  it("should fetch all systems and display them on screen", async () => {
    await renderPage();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("should return the right system when searching is performed", async () => {
    await renderPage();

    const searchInput = screen.getByTestId("search-input");

    fireEvent.change(searchInput, { target: { value: "InterSCity" } });

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.queryByText("TrainTicket")).not.toBeInTheDocument();
  });
});
