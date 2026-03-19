import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Row } from './row';
import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { orderStatusOptions } from './orderStatus';
import { Filter, FilterOption } from './styles';

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState(0);

  useEffect(() => {
    async function loadOrders() {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
      }
    }

    loadOrders();
  }, []);

  function createData(order) {
    return {
      _id: order._id,
      name: order.user.name,
      orderId: order._id,
      date: order.createdAt,
      status: order.status,
      products: order.products,
    };
  }

  function handleStatus(status) {
    setActiveStatus(status.id);
  }

  const filteredOrders = orders.filter((order) => {
    if (activeStatus === 0) return true;

    const statusSelected = orderStatusOptions.find(
      (item) => item.id === activeStatus,
    );

    if (!statusSelected) return true;

    return order.status?.toLowerCase() === statusSelected.value.toLowerCase();
  });

  const rows = filteredOrders.map(createData);

  return (
    <>
      <Filter>
        {orderStatusOptions.map((status) => (
          <FilterOption
            key={status.id}
            onClick={() => handleStatus(status)}
            $isActiveStatus={activeStatus === status.id}
          >
            {status.label}
          </FilterOption>
        ))}
      </Filter>

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Produto</TableCell>
              <TableCell align="right">Cliente</TableCell>
              <TableCell align="right">Pedido</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <Row
                key={row.orderId}
                row={row}
                orders={orders}
                setOrders={setOrders}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
