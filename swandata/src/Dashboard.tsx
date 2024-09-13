import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import BetsTable from './tables/BetsTable'
import IndividualFixturesTable from './tables/IndividualFixturesTable'
import MarketsTable from './tables/MarketsTable'
import {useState} from 'react'
import ModelTable from './tables/ModelTable'
import TraderTable from './tables/TraderTable'
import ParticipantFixturesTable from './tables/ParticipantFixturesTable'

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
  
  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
  
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  
  const Dashboard = () => {
    const [value, setValue] = useState(0);
  
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
  
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Traders" {...a11yProps(0)} />
            <Tab label="Individual Fixtures" {...a11yProps(1)} />
            <Tab label="Participant Fixtures" {...a11yProps(2)} />
            <Tab label="Markets" {...a11yProps(3)} />
            <Tab label="Bets" {...a11yProps(4)} />
            <Tab label="Model" {...a11yProps(5)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <TraderTable />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <IndividualFixturesTable />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ParticipantFixturesTable/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <MarketsTable />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <BetsTable />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={5}>
          <ModelTable/>
        </CustomTabPanel>

      </Box>
    );
  }

  export default Dashboard
  