import Image from "next/image";
import styles from "./styles.module.css";

const ImageKey = () => {
  const data = [
    { img: "/assets/service.svg", label: "Service" },
    { img: "/assets/database.svg", label: "Database" },
    { img: "/assets/operation.svg", label: "Operation" },
    {
      img: "/assets/service_operation.svg",
      label: "Service exposes operation",
    },
    {
      img: "/assets/db_usage.svg",
      label: "Service accesses database",
    },
    {
      img: "/assets/sync_operation.svg",
      label: "Service consumes operation of another service",
    },
    {
      img: "/assets/async_operation.svg",
      label: "Service publishes a message that another service consume",
    },
  ];
  return (
    <>
      <h2>Image key</h2>
      <div className={styles.imageKeyContainer}>
        {data.map(({ img, label }) => (
          <div key={label} className={styles.imageKey}>
            <Image src={img} alt={label} width={30} height={30} />
            <p className={styles.imageLabel}>{label}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ImageKey;
