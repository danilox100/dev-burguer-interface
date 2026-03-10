import Cart from "../../assets/cart.png";
import { ContainerButton } from "./styles";

export function CardButton({ onClick }) {
  return (
    <ContainerButton onClick={onClick}>
      <img src={Cart} alt="carrinho-compras" />
    </ContainerButton>
  );
}