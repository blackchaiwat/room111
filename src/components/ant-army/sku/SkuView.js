import { Fragment, useState } from 'react';
import BreadCrumb from '../../../layout/Breadcrumb'
import { Container } from 'reactstrap'
import SkuResult from './SkuResult';
import SkuForm from './SkuForm';

const SkuView = () => {
    const [isResult, setIsResult] = useState(false);

    return (
        <Fragment>
            <BreadCrumb 
                parent="Home"
                subparent="Dashboard"
                title="SKU"
                isResult={isResult}
                setIsResult={setIsResult}
            />

            <Container fluid={true} style={{ marginTop: '30px' }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid black', marginBottom: '20px' }}>
                    <h4>Stock Keeping Unit SKU Generator</h4>
                    <p style={{ color: '#8E8E8E' }}>Generate SKUs for your products and variants in minutes.</p>
                </div>

                {!isResult && (
                    <SkuForm />
                )}
                {isResult && (
                    <SkuResult />
                )}
            </Container>
        </Fragment>
    );
};

export default SkuView;
