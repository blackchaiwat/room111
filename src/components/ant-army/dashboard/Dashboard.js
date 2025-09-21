import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap'
import { BoxCriteriaDate, BoxCustomDate, BoxCustomType, BoxHeader } from '../../ant-army/criteria/Criteria';
import DashboardTotal from './BoxTotal';
import BoxChartPie from './BoxChartPie';
import BoxTopSpender from './BoxTopSpender';
import BoxOrder from './BoxOrder';
import BoxRepeat from './BoxRepect';
import BoxCustomer from './BoxCustomer';
import BoxCountry from './BoxCountry';
import { getFilterDate } from '../../../util/helpper';
import { mock_dashboard } from './mock_data';
import BoxChannel from './BoxChannel';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isHealth, setIsHealth] = useState(true);

  const [criteria, setCriteria] = useState({
    customType: '',
    startDate: '',
    endDate: '',
  })

  const fetch = async (_criteria) => {
    const filterDate = getFilterDate(_criteria);
    
    const formValue = {
      datebegin: filterDate?.startDate || '',
      dateend: filterDate?.endDate || '',
    }

    console.log(formValue);

    // const res = await getDashboard({ ...formValue });
    // setData({ ...res });
    setData({ ...mock_dashboard });
  }

  useEffect(() => {
      fetch(criteria);
  }, [criteria])

  const onChangeCriteria = (name, value) => {
    if (name === 'startDate' || name === 'endDate') {
      setCriteria({
          ...criteria,
          [name]: value,
      })
    } else if (name === 'customType') {
        setCriteria({
            ...criteria,
            [name]: criteria[name] === value ? '' : value,
            startDate: '',
            endDate: ''
        })
    } else {
        setCriteria({
            ...criteria,
            [name]: value
        })
    }
  }

  const onClearDate = () => {
    setCriteria({
        ...criteria,
        startDate: '',
        endDate: ''
    })
  }

  return (
    <Fragment>
      <Container fluid={true} style={{ paddingTop: '10px' }}>
        <Row style={{ marginBottom: '10px' }}>
          <Col md="12">
            <BoxHeader 
              menu={`${isHealth ? 'HEALTH' : 'PETS'} Dashboard`}
              isHealth={isHealth}
              setIsHealth={setIsHealth}
            />
          </Col>
        </Row>

        <Row style={{ marginBottom: '40px', marginTop: '30px' }}>
          <Col lg="12">
            <BoxCriteriaDate 
              type={criteria.customType}
              startDate={criteria.startDate}
              endDate={criteria.endDate}
              onChange={onChangeCriteria}
              onClear={onClearDate}
            />
          </Col>
        </Row>

        <DashboardTotal data={data} />

        <Row>
          <Col>
            <Card style={{ boxShadow: 'none' }}>
              <CardBody>
                <Row className='g-5'>
                  <Col lg="12">
                    <BoxCustomer data={data} height={320} />
                  </Col>

                  <Col lg="12" xl="5">
                    <BoxChartPie
                      title="Channel (คำสั่งซื้อ)"
                      id="channel-chart"
                      height={270} 
                      labels={['Lazada', 'Facebook', 'Shopee']}   
                      data={data?.dashboard_gender?.stat || []}   
                    />
                  </Col>

                  <Col lg="12" xl="7">
                    <BoxChannel data={data} height={270} />
                  </Col>

                  <Col lg="12" xl="5">
                    <BoxChartPie
                      title="Top-selling Category"
                      id="channel-chart"
                      height={270} 
                      labels={['ทรายแมว', 'ของเล่นแมว', 'อาหารแมว']}   
                      data={data?.dashboard_hearaboutus?.stat || []}   
                    />
                  </Col>
        
                  <Col lg="12" xl="7">
                    <BoxOrder data={data} height={300} />
                  </Col>

                  <Col lg="12" xl="6">
                    <BoxCountry data={data} />
                  </Col>

                  <Col lg="12" xl="6">
                    <BoxRepeat data={data} height={480} />
                  </Col>

                  <Col lg="12" xl="12">
                    <BoxTopSpender data={data} />
                  </Col>

                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
