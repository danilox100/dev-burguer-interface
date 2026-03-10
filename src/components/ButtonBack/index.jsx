import { useNavigate } from "react-router-dom";
import { ContainerButton } from "./styles";

export function ButtonBack() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/');
  };

  return (
    <ContainerButton onClick={onClick}>
      Voltar
    </ContainerButton>
  );
}