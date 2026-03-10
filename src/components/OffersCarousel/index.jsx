import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { api } from "../../services/api"

import { Container, Tittle } from "./styles";
import { CardProduct } from "../CardProduct";
import { formatPrice } from "../../utils/formatPrice";

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

export function OffersCarousel() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await api.get("/products");

        const onlyOffers = data
        .filter(product => product.offer)
        .map((product) => {
          return {
            currencyValue: formatPrice(product.price),
            ...product
          }
        })
        setOffers(onlyOffers);
      } catch (error) {
        console.log(error);
      }
    }

    loadProducts();
  }, []);


    return (
        <Container>
            <Tittle>OFERTAS DO DIA</Tittle>

            <Carousel
              responsive={responsive}
              infinite={true}
              partialVisbile={false}
              itemClass="carousel-item"
            > 
             {offers.map((product) => {
             return (
            <CardProduct key={product.id} product={product} />
  );
              })}
            </Carousel>
        </Container>
    )
}