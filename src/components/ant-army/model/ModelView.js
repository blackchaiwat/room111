import { Fragment, useEffect, useState } from 'react';
import BreadCrumb from '../../../layout/Breadcrumb'
import { Container } from 'reactstrap'
import ModelResult from './ModelResult';
import ModelForm from './ModelForm';

const ModelView = () => {
    const [isResult, setIsResult] = useState(false);

    const [dataEdit, setDataEdit] = useState(null);

    useEffect(() => {
        if (dataEdit) {
            setIsResult(false);
        }
    }, [dataEdit])

    return (
        <Fragment>
            <BreadCrumb 
                parent="Home"
                subparent="Dashboard"
                title="Model"
                isResult={isResult}
                setIsResult={setIsResult}
                type="model"
            />

            <Container fluid={true} style={{ marginTop: '30px' }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid black', marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: "20px" }}>Model</h4>
                </div>

                {!isResult && (
                    <ModelForm dataEdit={dataEdit} setDataEdit={setDataEdit} />
                )}
                {isResult && (
                    <ModelResult setDataEdit={setDataEdit} />
                )}
            </Container>
        </Fragment>
    );
};

export default ModelView;
