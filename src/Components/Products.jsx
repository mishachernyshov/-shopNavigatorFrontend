import React, {useEffect, useState} from 'react';
import {FormControl, Table, Card, Button} from 'react-bootstrap';
import axios from "axios";
import ProductRow from "./ProductRow";

const Products = (props) => {
    const [products, setProducts] = useState({});
    const [reloadNecessity, setReloadNecessity] = useState(true);
    const [newProductData, setNewProductData] = useState({});

    useEffect(() => {
        getProductList();
        setReloadNecessity(false);
    }, [reloadNecessity])

    const getProductList = () => {
        let url = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_PRODUCT_ENDPOINT;
        props.requestManager.makeGetRequest(url, {}, {})
            .then(res => {
                saveProductList(res.data);
            })
    }

    const saveProductList = (productData) => {
        const productMap = {};
        for (let product of productData) {
            productMap[product.id] = {...product};
            delete productMap[product.id]['id'];
        }
        setProducts(productMap);
    }

    const makeTableBodyMarkup = () => {
        const markup = [];
        for (const [key, value] of Object.entries(products)) {
            markup.push(
                <ProductRow
                    id={key}
                    data={value}
                    products={products}
                    setProducts={setProducts}
                    requestManager={props.requestManager} />
            )
        }
        return markup;
    }

    const isNewProductDataComplete = () => {
        return newProductData.name
            && newProductData.description
            && newProductData.rating
    }

    const changeNewProductDataField = (event, field) => {
        const newProductNewValue = {...newProductData};
        newProductNewValue[field] = event.target.value;
        setNewProductData(newProductNewValue);
    }

    const addNewProduct = () => {
        axios(
            {
                method: 'post',
                url: process.env.REACT_APP_API_URL +
                    process.env.REACT_APP_PRODUCT_ENDPOINT,
                data: newProductData
            }
        )
            .then(_ => {
                setNewProductData({});
                setReloadNecessity(true);
            })
    }

    return (
        <div id='page-wrapper'>
            <div className='table-title'>
                Наявні товари
            </div>
            <div className='output-table-wrapper'>
                <Table striped bordered hover className='output-table'>
                    <thead>
                        <tr>
                            <th className='product-id'>Id</th>
                            <th className='product-name'>Назва</th>
                            <th className='product-description'>Опис</th>
                            <th className='product-rating'>Рейтинг</th>
                            <th className='product-label'>Мітка</th>
                            <th className='delete-button'></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        makeTableBodyMarkup()
                    }
                    </tbody>
                </Table>
            </div>

            <div>
                <div className='table-title'>
                    Новий товар
                </div>
                <div id='new-entity-card-wrapper'>
                    <Card>
                        <Card.Body>
                            <div id='new-product-card-content'>
                                <FormControl
                                    value={newProductData['name']
                                        ? newProductData['name']
                                        : ''}
                                    className='product-name'
                                    placeholder='Назва'
                                    onChange={(event) => {
                                        changeNewProductDataField(event, 'name');
                                    }}
                                />
                                <FormControl
                                    value={newProductData['description']
                                        ? newProductData['description']
                                        : ''}
                                    as='textarea'
                                    className='product-description'
                                    placeholder='Опис'
                                    onChange={(event) => {
                                        changeNewProductDataField(event, 'description');
                                    }} />
                                <FormControl
                                    value={newProductData['rating']
                                        ? newProductData['rating']
                                        : ''}
                                    type='number'
                                    min='0'
                                    max='10'
                                    className='new-product-rating'
                                    placeholder='Рейтинг'
                                    onChange={(event) => {
                                        changeNewProductDataField(event, 'rating');
                                    }} />
                                <FormControl
                                    value={newProductData['label']
                                        ? newProductData['label']
                                        : ''}
                                    className='product-label'
                                    placeholder='Мітка'
                                    onChange={(event) => {
                                        changeNewProductDataField(event, 'label');
                                    }}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                    <div id='new-product-button-wrapper'>
                        <Button
                            variant="success" disabled={!isNewProductDataComplete()}
                            onClick={() => addNewProduct()} >
                            Додати
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products;