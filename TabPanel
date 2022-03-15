import * as React from 'react';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import{ Tabs } from '@material-ui/core';
import { Tab } from '@material-ui/core';
import {Typography} from '@material-ui/core';
import LoginForm from '../../screens/auth/LoginForm';
import RegistrationForm from '../../screens/auth/RegistrationForm';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
          <Typography component='div' >{children}</Typography>
        
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <Tabs value={value} onChange={handleChange} aria-label="Authentication modal" centered>
        <Tab label="Login" {...a11yProps(0)} />
        <Tab label="Register" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <LoginForm {...props} />
      </TabPanel>
      <TabPanel value={value} index={1}>
       
        <RegistrationForm {...props} />
      </TabPanel>
    </Fragment>
  );
}

