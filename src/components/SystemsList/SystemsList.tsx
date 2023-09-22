import React from "react";
import { Link } from "react-router-dom";
import { System } from "@model/system";
import { Card, CardDescription, CardTitle, ListWrapper } from "./styled";

interface Props {
  systems: System[];
}

export const SystemsList = ({ systems }: Props) => {
  const SystemNotFound = () => <>There are no systems.</>;

  const List = () => {
    const getSystemUrl = (id: string) => `/systems/${id}`;

    return (
      <>
        {systems.map(({ id, name, description }) => (
          <Link key={id} to={getSystemUrl(id)}>
            <Card>
              <CardTitle>{name} &rarr;</CardTitle>
              <CardDescription>{description}</CardDescription>
            </Card>
          </Link>
        ))}
      </>
    );
  };

  const ListContent = () =>
    systems.length > 0 ? <List /> : <SystemNotFound />;

  return (
    <ListWrapper>
      <ListContent />
    </ListWrapper>
  );
};
