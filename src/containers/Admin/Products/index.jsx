import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Container, EditButton, ProductImage } from './styles';
import { useNavigate } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { CheckCircle, Pencil, XCircle } from '@phosphor-icons/react';
import { formatPrice } from '../../../utils/formatPrice';

export function Products() {
  const [products, setProducts] = useState([]);

  const Navigate = useNavigate();

  useEffect(() => {
    async function loadProducts() {
      const { data } = await api.get('/products');
      console.log(data);
      setProducts(data);
    }

    loadProducts();
  }, []);

  function isOffer(offer) {
    return offer ? (
      <CheckCircle color="green" size={20} />
    ) : (
      <XCircle color="red" size={20} />
    );
  }

  function editProduct(product) {
    Navigate('/admin/editar-produto', { state: { product } });
  }

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Nome</TableCell>
              <TableCell align="center">Preço</TableCell>
              <TableCell align="center">Oferta</TableCell>
              <TableCell align="center">Imagem</TableCell>
              <TableCell align="center">Editar</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell align="center">{product.name}</TableCell>

                <TableCell align="center">
                  {formatPrice(product.price)}
                </TableCell>

                <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                  {isOffer(product.offer)}
                </TableCell>

                <TableCell align="center">
                  <ProductImage src={product.url} />
                </TableCell>

                <TableCell align="center">
                  <EditButton onClick={() => editProduct(product)}>
                    <Pencil size={20} />
                  </EditButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
