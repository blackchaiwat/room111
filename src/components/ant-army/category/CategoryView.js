import { Fragment, useEffect, useState } from 'react';
import BreadCrumb from '../../../layout/Breadcrumb'
import { Container } from 'reactstrap'
import CategoryResult from './CategoryResult';
import CategoryForm from './CategoryForm';

const CategoryView = () => {
    const [isResult, setIsResult] = useState(true);

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
                title="Category"
                isResult={isResult}
                setIsResult={setIsResult}
                type="category"
            />

            <Container fluid={true} style={{ marginTop: '30px' }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid black', marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: "20px" }}>Category</h4>
                </div>

                {!isResult && (
                    <CategoryForm dataEdit={dataEdit} setDataEdit={setDataEdit} />
                )}
                {isResult && (
                    <CategoryResult setDataEdit={setDataEdit} />
                )}
            </Container>
        </Fragment>
    );
};

export default CategoryView;
