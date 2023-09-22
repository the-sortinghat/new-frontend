import { useEffect, useState } from "react";
import { System } from "@model/system";

export const useSystems = () => {
  const [allSystems, setAllSystems] = useState<System[]>([]);
  const [filteredSystems, setFilteredSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);

  const searchSystem = (query: string) => {
    const searchResult = allSystems.filter(
      ({ name, description }) =>
        name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
        description.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    );

    setFilteredSystems(searchResult);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch("http://ec2-3-239-58-239.compute-1.amazonaws.com:8080/systems", {
      signal,
    })
      .then((response) => response.json())
      .then((systems: System[]) => {
        setAllSystems(systems);
        setFilteredSystems(systems);
      })
      .catch((error) => {
        console.log("error while fetching: " + error);
      })
      .finally(() => setLoading(false));

    return () => {
      abortController.abort();
    };
  }, []);

  return {
    loading,
    systems: filteredSystems,
    onSearch: searchSystem,
  };
};
