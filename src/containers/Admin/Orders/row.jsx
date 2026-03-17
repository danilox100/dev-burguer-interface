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

export function Row({ row, setOrders, Orders }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(row.status || '');

  async function newStatusOrder(id, status) {
    try {
      setLoading(true);
      await api.put(`orders/${id}`, { status });

      const newOrders = orders.map((order) =>
        order._id === id ? { ...order, status } : order,
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row">
          {row.orderId}
        </TableCell>

        <TableCell align="right">{row.name}</TableCell>

        <TableCell align="right">{formatDate(row.date)}</TableCell>

        <TableCell align="right">
          <SelectStatus
            value={status}
            onChange={(event) => {
              const newStatus = event.target.value;
              setStatus(newStatus);
              newStatusOrder(row.orderId, newStatus);
            }}
            displayEmpty
            size="small"
            renderValue={(selected) => {
              if (!selected) {
                return 'Status';
              }
              return selected;
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Pedido
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Qtd</TableCell>
                    <TableCell>Produto</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell component="th" scope="row">
                        {product.quantity}
                      </TableCell>

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
  setOrders: PropTypes.function,
  row: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    status: PropTypes.string,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        category: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        url: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
};
