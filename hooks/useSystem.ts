import { useEffect, useState } from "react";
import { getSystemById, getSystemMetrics } from "@services/system_service";

const useSystem = (id: any) => {
  const [loading, setLoading] = useState(true);
  const [system, setSystem] = useState({});
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    if (!id) return;

    getSystemById(id)
      .then((sys) => {
        setSystem(sys);
        return getSystemMetrics(id);
      })
      .then((metrics) => setMetrics(metrics))
      .finally(() => setLoading(false));
  }, [id]);

  return { loading, system, metrics };
};

export default useSystem;
