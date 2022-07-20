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
      img: "/assets/operation_consumed.svg",
      label: "An operation is consumed by a service",
    },
    {
      img: "/assets/db_usage.svg",
      label: "Service accesses database",
    },
    {
      img: "/assets/async_operation.svg",
      label: "Service A publishes a message that Service B consumes",
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
