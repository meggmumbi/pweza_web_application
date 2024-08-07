import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import HistoryIcon from '@mui/icons-material/History';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupsIcon from '@mui/icons-material/Groups';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TimerIcon from '@mui/icons-material/Timer';
import { mainListItems, secondaryListItems } from './listItems';
import Chart from './Chart';
import Deposits from './Deposits';
import LatestOrders from './Orders';
import PieChart from './PieChart';
import OrderSummaryGraph from './OrderSummaryGraph';
import LatestProductsTable from './Products'

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const salesData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  thisYear: [15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000],
  lastYear: [12000, 18000, 22000, 28000, 32000, 36000, 42000, 48000, 52000, 58000, 62000, 68000]
};

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  orders: [65, 59, 80, 81, 56, 55, 40]
};

const pieChartData = {
  labels: ['Electronics', 'Books', 'Other'],
  values: [300, 150, 100]
};

const latestProductsData = [
  {
    id: 1,
    imageUrl: '/cisco.svg',
    description: 'Wireless Bluetooth Headphones',
    lastUpdated: '2024-06-01'
  },
  {
    id: 2,
    imageUrl: '/Huawei.svg',
    description: 'Compact Digital Camera',
    lastUpdated: '2024-05-25'
  },
  {
    id: 3,
    imageUrl: '/microsoft.svg',
    description: 'Smart Fitness Watch',
    lastUpdated: '2024-05-20'
  },
  {
    id: 4,
    imageUrl: '/oracle.svg',
    description: 'Portable Power Bank',
    lastUpdated: '2024-05-18'
  },
  {
    id: 5,
    imageUrl: '/school.svg',
    description: 'USB-C Charging Cable',
    lastUpdated: '2024-05-15'
  }
];

const latestOrdersData = [
  {
    orderNo: 'ORD001',
    customerName: 'John Doe',
    date: '2024-06-03',
    status: 'Delivered'
  },
  {
    orderNo: 'ORD002',
    customerName: 'Jane Smith',
    date: '2024-06-02',
    status: 'Pending'
  },
  {
    orderNo: 'ORD003',
    customerName: 'William Johnson',
    date: '2024-06-01',
    status: 'Refunded'
  },
  {
    orderNo: 'ORD004',
    customerName: 'Emma Wilson',
    date: '2024-05-31',
    status: 'Delivered'
  },
  {
    orderNo: 'ORD005',
    customerName: 'Olivia Brown',
    date: '2024-05-30',
    status: 'Pending'
  }
];

const cardsData = [
  { title: 'Active Orders', value: 'Ksh. 24,000', icon: ShoppingBagIcon, color: '#1976d2' },
  { title: 'Order History', value: '1,600', icon: HistoryIcon, color: '#dc004e' },
  { title: 'Average Delivery Time', value: '2 hrs', icon: TimerIcon, color: '#2e7d32' },
  { title: 'Total Spendings', value: 'Ksh. 35,000', icon: AttachMoneyIcon, color: '#ffa000' },
];



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container alignItems="stretch">
        <CssBaseline />
        <Toolbar />
        <Grid item md={12} style={{ display: "flex", marginLeft: "50px", marginRight: "50px", width: "100%" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
              {cardsData.map((card, index) => (
                <Deposits key={index} {...card} sx={{ flexGrow: 1, minWidth: '100%', maxWidth: '100%' }} /> // Adjusted styles for card
              ))}
            </Grid>
            <Grid item xs={12} md={6} lg={9}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 400,
                }}
              >
                <Chart data={salesData} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 400,
                }}
              >
                <OrderSummaryGraph data={data} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                {latestProductsData && latestProductsData.length > 0 ? (
                  <LatestProductsTable title="Latest Packages" products={latestProductsData} />
                ) : (
                  <Typography variant="body1">No Packages available.</Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                {latestOrdersData && latestOrdersData.length > 0 ? (
                  <LatestOrders title="Latest Orders" orders={latestOrdersData} />
                ) : (
                  <Typography variant="body1">No Packages available.</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
