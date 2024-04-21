
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Collapse } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

function HoldingRow({ holding }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{holding.name}</TableCell>
        <TableCell>{holding.ticker}</TableCell>
        <TableCell>{holding.avg_price}</TableCell>
        <TableCell>{holding.market_price}</TableCell>
        <TableCell>{holding.latest_chg_pct}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Typography variant="h6" gutterBottom component="div">
              Asset Class: {holding.asset_class}
            </Typography>
            <Typography variant="body2" gutterBottom component="div">
              Market Value in Base CCY: {holding.market_value_ccy}
            </Typography>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function App() {
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchHoldings = async () => {
      try {
        const response = await axios.get('https://canopy-frontend-task.now.sh/api/holdings');
        setHoldings(response.data.payload);
      } catch (error) {
        console.error('Error fetching holdings:', error);
      }
    };

    fetchHoldings();
  }, []);

  const groupedHoldings = holdings.reduce((acc, holding) => {
    const existingGroup = acc.find(group => group.asset_class === holding.asset_class);
    if (existingGroup) {
      existingGroup.holdings.push(holding);
    } else {
      acc.push({ asset_class: holding.asset_class, holdings: [holding] });
    }
    return acc;
  }, []);

  return (
    <div>
      <h1>REAL ESTATE</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>NAME OF THE HOLDING</TableCell>
              <TableCell>TICKER</TableCell>
              <TableCell>AVERAGE PRICE</TableCell>
              <TableCell>MARKET PRICE</TableCell>
              <TableCell>LATEST CHANGES PERCENTAGE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedHoldings.map((group, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell colSpan={6} style={{ fontWeight: 'bold' }}>
                    {group.asset_class}
                  </TableCell>
                </TableRow>
                {group.holdings.map((holding, index) => (
                  <HoldingRow key={index} holding={holding} />
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;


