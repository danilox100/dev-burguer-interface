import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { api } from "../../services/api"

import { CategoryButton, Container, ContainerItems, Tittle } from "./styles";
import { useNavigate } from "react-router-dom";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1280 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1280, min: 690 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 690, min: 0 },
    items: 2,
  },
};

export function CategoryCarousel() {
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadCategories() {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    }

    loadCategories();
  }, []);


    return (
        <Container>
            <Tittle>CATEGORIAS</Tittle>

            <Carousel
              responsive={responsive}
              infinite={true}
              partialVisibile={false}
              itemClass="carousel-item"
            > 
             {categories.map((category) => {
             return (
              <ContainerItems key={category.id} $imageUrl={category.url}>

              <CategoryButton
                onClick={() => {
                  navigate({
                    pathname: '/cardapio',
                    search: `?categoria=${category.id}`
                  }
                  
                  )
                }}
              >{category.name}</CategoryButton>
    
              </ContainerItems>
  );
              })}
            </Carousel>
        </Container>
    )
}