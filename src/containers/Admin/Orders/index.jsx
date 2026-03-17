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
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState([9]);

  useEffect(() => {
    async function loadOrders() {
      const { data } = await api.get('orders');

      setOrders(data);
      setFilteredOrders(data);
    }

    loadOrders();
  }, []);

  function createData(order) {
    return {
      name: order.user.name,
      orderId: order._id,
      date: order.createdAt,
      status: order.status,
      products: order.products,
    };
  }

  function handleStatus(status) {
    if (status.id === 0) {
      setFilteredOrders(orders);
    } else {
      const newOrders = orders.filter(
        (order) => order.status?.toLowerCase() === status.value.toLowerCase(),
      );

      setFilteredOrders(newOrders);
    }

    setActiveStatus(status.id);
  }

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
