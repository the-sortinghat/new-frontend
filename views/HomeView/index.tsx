import Image from "next/image";
import Link from "next/link";
import Button from "@components/Button";
import Header from "@components/Header";
import SystemsList from "@components/SystemsList";
import useSystems from "@hooks/useSystems";
import {
  Container,
  LogoWrapper,
  MainContentWrapper,
  RegisterButtonWrapper,
  SearchInput,
  Title,
} from "./styled";

const HomeView = () => {
  const { loading, systems, onSearch } = useSystems();

  return (
    <Container>
      <Header title="Sorting Hat" />

      <MainContentWrapper>
        <RegisterButtonWrapper>
          <Link href="/systems/register">
            <Button text={"Register new system"} />
          </Link>
        </RegisterButtonWrapper>

        <LogoWrapper>
          <Image
            src="/sortinghat.png"
            alt="Sorting Hat Logo"
            width={100}
            height={100}
          />
        </LogoWrapper>

        <Title>Welcome to Sorting Hat!</Title>

        <SearchInput
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
        />

        {loading ? "Loading..." : <SystemsList systems={systems} />}
      </MainContentWrapper>
    </Container>
  );
};

export default HomeView;
