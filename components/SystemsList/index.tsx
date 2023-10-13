import Link from "next/link";
import { Card, CardDescription, CardTitle, ListWrapper } from "./styled";

const SystemsList = ({ systems }: any) => {
  const getSystemUrl = (id: any) => `/systems/${id}`;

  return (
    <ListWrapper>
      {systems.length > 0 ? (
        systems.map(({ id, name, description }: any) => (
          <Link key={name} href={getSystemUrl(id)}>
            <Card>
              <CardTitle>{name} &rarr;</CardTitle>
              <CardDescription>{description}</CardDescription>
            </Card>
          </Link>
        ))
      ) : (
        <>System not found!</>
      )}
    </ListWrapper>
  );
};

export default SystemsList;
