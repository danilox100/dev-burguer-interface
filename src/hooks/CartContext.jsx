import { useContext, createContext, useState, useEffect } from "react";

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState([]);

  const putProductInCart = (product) => {
     const cartIndex = cartProducts.findIndex((prd) => prd.id === product.id);
     
     let newProductsInCart = [];

     if(cartIndex >= 0) {
       newProductsInCart = cartProducts;

       newProductsInCart[cartIndex].quantity = newProductsInCart[cartIndex].quantity + 1;

       setCartProducts(newProductsInCart);

     } else {
        product.quantity = 1
        newProductsInCart = [...cartProducts, product];
        setCartProducts(newProductsInCart);
     }

     updateLocalStorage(newProductsInCart)
  };

  const clearCart = () => {};

  const deletProduct = (productId) => {
    const newCart = cartProducts.filter((prd) => prd.id !== productId)

    setCartProducts(newCart)
    updateLocalStorage(newCart)
  };

  const increaseProduct = (productId) => {
    const newCart = cartProducts.map( prd => {
        return prd.id === productId ? { ...prd, quantity: prd.quantity + 1} : prd
    });

    setCartProducts(newCart)
    updateLocalStorage(newCart)
  };

  const decreaseProduct = (productId) => {
    const cartIndex = cartProducts.findIndex((prd) => prd.id === productId);

    if(cartProducts[cartIndex].quatity > 1){
        const newCart = cartProducts.map( prd => {
        return prd.id === productId ? { ...prd, quantity: prd.quantity - 1} : prd;
    });

    setCartProducts(newCart);
    updateLocalStorage(newCart)
    } else {
        deletProduct(productId)
    }    
  };

  const updateLocalStorage = (products) => {
    localStorage.setItem('devburguer:cartInfo', JSON.stringify(products))
  };

  useEffect(() => {
    const loadProducts = () => {
        const clientCartData = localStorage.getItem('devburguer:cartInfo');

        if(clientCartData) {
            setCartProducts(JSON.parse(clientCartData))
        }
    }
  }, [])


  return (
    <CartContext.Provider
      value={{
        cartProducts,
        putProductInCart,
        clearCart,
        deletProduct,
        increaseProduct,
        decreaseProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a context");
  }

  return context;
};