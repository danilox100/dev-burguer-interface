import { useEffect, useState } from "react";
import { CardProduct } from "../../components/CardProduct";
import { api } from "../../services/api";
import { formatPrice } from "../../utils/formatPrice";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";

import { Banner, CategoryButton, CategoryMenu, Container, ProductsContainer } from "./styles";
import { ButtonBack } from "../../components/ButtonBack";


export function Menu() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
 
  const navigate = useNavigate();
  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);

  const categoryId = queryParams.get('categoria');

  const [activeCategory, setActiveCategory] = useState(() => {
    const categoryId = +queryParams.get('categoria');

    if(categoryId){
      return categoryId
    }

    return 0;
  });


  console.log(categoryId)


  useEffect(() => {
    async function loadCategories() {
      try {
        const { data } = await api.get("/categories");

        const newCategories = [{id: 0, name: 'Todas'}, ...data]

        setCategories(newCategories);
      } catch (error) {
        console.log(error);
      }
    }

      async function loadProducts() {
          try {
            const { data } = await api.get("/products");
    
            const newProducts = data
            .map((product) => {
              return {
                currencyValue: formatPrice(product.price),
                ...product
              }
            })
            setProducts(newProducts);
          } catch (error) {
            console.log(error);
          }
        }
    
        loadCategories();
        loadProducts();
  }, []);

  useEffect(() => {
    if(activeCategory === 0) {
      setFilteredProducts(products);
    } else {
      const newFilteredProducts = products.filter(
        (product) => product.category_id === activeCategory
      );
      
      setFilteredProducts(newFilteredProducts);
    }
  }, [products, activeCategory])


  return (
        <Container>
        
            <Banner>
                <h1>O MELHHOR
                    <br />
                    HAMBURGUER
                    <br />
                    ESTÁ AQUI
                    <br />
                    <span>Este cardápio está irresistivel</span>
                </h1>
             
            </Banner>

            <CategoryMenu>
               {categories.map((category)=> (
                <CategoryButton 
                key={category.id}
                $isActiveCategory={category.id === activeCategory}
                onClick={() => {
                  navigate(
                    {
                      pathname: '/cardapio',
                      search:`?categoria=${category.id}` 
                    },
                    {
                      replace: true,
                    },                    
                  )
                  setActiveCategory(category.id)
                }}

                >{category.name}</CategoryButton>
               ))}
            </CategoryMenu>

            <ProductsContainer>
              {filteredProducts.map(product => (
                <CardProduct product={product} key={product.id} />
              ))}

            </ProductsContainer>

            <ButtonBack />
        </Container>
    )
}