import styled from "styled-components";

export const Container = styled.div`
  padding: 0 2rem;
`;

export const Header = styled.header`
  display: flex;
  margin-top: 1rem;
  padding: 0.5rem;
`;

export const TitleWrapper = styled.div`
  margin: 0 auto;
`;

export const Title = styled.h1`
  margin: 0;
  line-height: 1.15;
  font-size: 2rem;
  font-weight: 500;
  text-align: center;
`;

export const LogoWrapper = styled.div`
  text-align: center;
`;

export const Logo = styled.img`
  width: 100px;
  height: 100px;
`;

export const RegisterButtonWrapper = styled.nav`
  width: 200px;
  position: absolute;
  top: 0;
  right: 0;
  margin: 1rem;
`;

export const MainContentWrapper = styled.main`
  padding: 1rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const SearchInput = styled.input`
  margin: 4rem auto;
  padding: 0.75rem;
  width: 60%;
  background-color: #dedede;
  border: none;
  outline: none;
  font-size: 1rem;
`;
