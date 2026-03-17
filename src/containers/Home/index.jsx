import { CategoryCarousel, OffersCarousel } from "../../components";
import { Banner, Container } from "./styles";
import { useUser } from "../../hooks/UserContext";

export function Home() {
    
    return (
        <main>
            <Banner>
                <h1>Bem-Vindo(a)!</h1>
            </Banner>

            <Container>
                <div>
                    <CategoryCarousel />
                    <OffersCarousel />
                </div>
            </Container>
        </main>
    )
}