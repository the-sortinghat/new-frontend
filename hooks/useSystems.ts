import { useEffect, useState } from "react";
import { getAllSystems } from "@services/system_service";

const useSystems = () => {
  const [allSystems, setAllSystems] = useState([]);
  const [filteredSystems, setFilteredSystems] = useState(allSystems);
  const [loading, setLoading] = useState(true);

  const searchSystem = (query: string) => {
    const searchResult = allSystems.filter(
      ({ name, description }: { name: string; description: string }) =>
        name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
        description.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    );

    setFilteredSystems(searchResult);
  };

  useEffect(() => {
    getAllSystems()
      .then((systems) => {
        setAllSystems(systems);
        setFilteredSystems(systems);
      })
      .finally(() => setLoading(false));
  }, []);

  return { loading, systems: filteredSystems, onSearch: searchSystem };
};

export default useSystems;
