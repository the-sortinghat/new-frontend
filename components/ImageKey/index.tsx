import Image from "next/image";
import {
  ImageKeyContainer,
  ImageKeyTitle,
  ImageKeyWrapper,
  ImageLabel,
} from "./styled";

const ImageKey = () => {
  const data = [
    { img: "/assets/service.svg", label: "Service" },
    { img: "/assets/database.svg", label: "Database" },
    { img: "/assets/operation.svg", label: "Operation" },
    {
      img: "/assets/db_usage.svg",
      label: "Service accesses database",
    },
    {
      img: "/assets/service_operation.svg",
      label: "Service exposes operation",
    },
    {
      img: "/assets/operation_consumed.svg",
      label: "An operation is consumed by a service",
    },
    {
      img: "/assets/sync_operation.svg",
      label: "Service A consumes an operation that Service B exposes",
    },
    {
      img: "/assets/async_operation.svg",
      label: "Service A publishes a message that Service B consumes",
    },
  ];
  return (
    <>
      <ImageKeyTitle>Image key</ImageKeyTitle>
      <ImageKeyContainer>
        {data.map(({ img, label }) => (
          <ImageKeyWrapper key={label}>
            <Image src={img} alt={label} width={30} height={30} />
            <ImageLabel>{label}</ImageLabel>
          </ImageKeyWrapper>
        ))}
      </ImageKeyContainer>
    </>
  );
};

export default ImageKey;
