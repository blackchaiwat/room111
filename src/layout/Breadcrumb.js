import React, { useState } from 'react'
import {Row, Col, Container,Breadcrumb,BreadcrumbItem} from 'reactstrap'
import {Link} from 'react-router-dom'
import { BoxHeader, BoxHeader2 } from '../components/ant-army/criteria/Criteria';
const Breadcrumbs = (props) => {
    const [breadcrumb, setBreadcrumb] = useState(props);

    return (
        <Container fluid={true} style={{ background: 'white', marginLeft: '-20px', width: '104%' }}>
            <div className="page-header" style={{ padding: '10px 20px 20px' }}>
                <Row>
                    <Col lg='6'>
                        <h2 style={{ fontWeight: 600 }}>{breadcrumb.title}</h2>
                        <Breadcrumb>
                        <BreadcrumbItem><Link to={`${process.env.PUBLIC_URL}/dashboard/default`}>{breadcrumb.parent}</Link></BreadcrumbItem>
                        <BreadcrumbItem>{breadcrumb.subparent}</BreadcrumbItem>
                        <BreadcrumbItem active>{breadcrumb.title}</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                    {props.isHealth !=  null && (
                        <Col lg='6'>
                            <BoxHeader2
                                isHealth={props.isHealth}
                                setIsHealth={props.setIsHealth}
                            />
                        </Col>
                    )}
                </Row>
            </div>
        </Container>
    )
}

export default Breadcrumbs
