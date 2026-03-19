import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { formatDate } from '../../../utils/formatDate';
import { ProductImage, SelectStatus } from './styles';
import { orderStatusOptions } from './orderStatus';
import { api } from '../../../services/api';

export function Row({ row, setOrders, orders }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function newStatusOrder(id, newStatus) {
    try {
      setLoading(true);

      await api.put(`orders/${id}`, { status: newStatus });

      // 🔥 atualização correta do estado global
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>{row.orderId}</TableCell>

        <TableCell align="right">{row.name}</TableCell>

        <TableCell align="right">{formatDate(row.date)}</TableCell>

        <TableCell align="right">
          <SelectStatus
            value={row.status || ''}
            onChange={(event) => {
              const newStatus = event.target.value;
              newStatusOrder(row._id, newStatus); // 🔥 usa _id
            }}
            size="small"
            disabled={loading}
            MenuProps={{
              PaperProps: {
                style: { zIndex: 9999 },
              },
            }}
          >
            {orderStatusOptions.map((option) => (
              <MenuItem key={option.id} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </SelectStatus>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={5} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 2 }}>
              <Typography variant="h6" gutterBottom>
                Pedido
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Qtd</TableCell>
                    <TableCell>Produto</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <ProductImage src={product.url} alt={product.name} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  orders: PropTypes.array.isRequired,
  setOrders: PropTypes.func.isRequired, // ✅ corrigido
  row: PropTypes.shape({
    _id: PropTypes.string, // 🔥 essencial
    orderId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    status: PropTypes.string,
    products: PropTypes.array.isRequired,
  }).isRequired,
};
