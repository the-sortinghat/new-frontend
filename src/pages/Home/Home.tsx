import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@components/Button";
import { SystemsList } from "@components/SystemsList";
import { useSystems } from "./hook";
import {
  Container,
  MainContentWrapper,
  RegisterButtonWrapper,
  Logo,
  LogoWrapper,
  Title,
  SearchInput,
  Header,
  TitleWrapper,
} from "./styled";
import sortingHatLogo from "@assets/img/sortinghat.png";

export const Home = () => {
  const { loading, systems, onSearch } = useSystems();

  return (
    <Container data-testid="home-wrapper">
      <Header>
        <TitleWrapper>
          <LogoWrapper>
            <Logo src={sortingHatLogo} alt="Sorting Hat Logo" />
          </LogoWrapper>

          <Title>Welcome to Sorting Hat!</Title>
        </TitleWrapper>
        <RegisterButtonWrapper>
          <Link to="/systems/register" data-testid="register-button">
            <Button>Register new system</Button>
          </Link>
        </RegisterButtonWrapper>
      </Header>

      <MainContentWrapper>
        <SearchInput
          data-testid="search-input"
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
        />

        {loading ? <p>Loading...</p> : <SystemsList systems={systems} />}
      </MainContentWrapper>
    </Container>
  );
};
