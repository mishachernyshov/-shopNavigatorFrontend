import React, {useEffect, useState} from "react";
import {Button, Card, Dropdown, DropdownButton, FormControl, Table} from "react-bootstrap";
import ShopProductRow from "./ShopProductRow";


const ShopProduct = (props) => {
    const [shopId, _] = useState(
        window.location.pathname.split('/').pop()
    );
    const [shopName, setShopName] = useState('');
    const [shopProducts, setShopProducts] = useState({});
    const [products, setProducts] = useState({});
    const [reloadNecessity, setReloadNecessity] = useState(true);
    const [firstLoading, setFirstLoading] = useState(true);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [exactPrice, setExactPrice] = useState(0);
    const [newShopProductData, setNewShopProductData] = useState({});

    useEffect(() => {
        getProductsMainInfo();
        setFirstLoading(false);
    }, [firstLoading])

    useEffect(() => {
        getShopProducts();
        setReloadNecessity(false);
    }, [reloadNecessity])

    const getShopProducts = (params = '') => {
        const url = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_SHOP_PRODUCTS_ENDPOINT + shopId + params;
        props.requestManager.makeGetRequest(url, {}, {})
            .then(res => {
                saveShopProductData(res.data);
            })
    }

    const saveShopProductData = (responseData) => {
        setShopName(responseData['name']);
        const shopProductData = {};
        for (let product of responseData['products']) {
            shopProductData[product['product_id']] = {
                'price': product['price'],
                'count': product['count'],
                'name': product['name'],
            }
        }

        setShopProducts(shopProductData);
    }

    const getProductsMainInfo = () => {
        const url = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_SHOP_PRODUCTS_MAIN_INFO_ENDPOINT;
        props.requestManager.makeGetRequest(url, {}, {})
            .then(res => {
                setProducts(res.data);
            })
    }

    const changeNewShopProductDataField = (event, field) => {
        const newProductNewValue = {...newShopProductData};
        newProductNewValue[field] = event.target.value;
        setNewShopProductData(newProductNewValue);
    }

    const makeTableBodyMarkup = () => {
        const markup = [];
        for (const [key, value] of Object.entries(shopProducts)) {
            markup.push(
                <ShopProductRow
                    id={key}
                    shopId={shopId}
                    data={value}
                    shopProducts={shopProducts}
                    setShopProducts={setShopProducts}
                    requestManager={props.requestManager} />
            )
        }
        return markup;
    }

    const makeProductsDropdownMarkup = () => {
        const markup = [];
        for (const [key, value] of Object.entries(products)) {
            markup.push(
                <Dropdown.Item
                    data-product-id={key}
                    onClick={event => {
                        changeProduct(event);
                    }}>
                    {value}
                </Dropdown.Item>
            )
        }
        return markup;
    }

    const changeProduct = (event) => {
        const productDropdown = document.getElementById('new-product-dropdown');
        productDropdown.innerText = event.target.innerText;

        const newProductNewValue = {...newShopProductData};
        newProductNewValue['id'] = event.target.getAttribute('data-product-id');
        setNewShopProductData(newProductNewValue);
    }

    const isNewShopProductDataComplete = () => {
        return newShopProductData.id
            && newShopProductData.price
            && newShopProductData.count
    }

    const createNewShopProduct = () => {
        const newShopProductUrl = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_SHOP_PRODUCTS_ENDPOINT;
        props.requestManager.makePostRequest(
            newShopProductUrl, {}, {
                'shop_id': shopId,
                'product_id': newShopProductData['id'],
                'price': newShopProductData['price'],
                'count': newShopProductData['count'],
            }
        )
            .then(_ => {
                setNewShopProductData({});
                setReloadNecessity(true);
                const productDropdown = document.getElementById('new-product-dropdown');
                productDropdown.innerText = 'Оберіть товар';
            })
    }

    const searchByPriceRange = () => {
        getShopProducts(
            `?min_price=${minPrice}&max_price=${maxPrice}`
        );
    }

    const searchByExactPrice = () => {
        getShopProducts(
            `?exact_price=${exactPrice}`
        );
    }

    return (
        <div id='page-wrapper'>
            <div className='table-title'>
                {shopName}
            </div>

            <div id='shop-products-info-wrapper'>
                <div className='output-table-wrapper'>
                    <div id='price-range'>
                        <div className='filter-subtitle'>
                            Ціна в діапазоні (грн)
                        </div>
                        <div id='price-range-wrapper'>
                            <div className='single-range-item'>
                                <div>
                                    Від
                                </div>
                                <FormControl
                                    value={minPrice}
                                    type='number'
                                    min='0'
                                    onChange={event =>
                                        setMinPrice(event.target.value)
                                    }/>
                            </div>
                            <div className='single-range-item'>
                                <div>
                                    До
                                </div>
                                <FormControl
                                    value={maxPrice}
                                    type='number'
                                    min='0'
                                    onChange={event =>
                                        setMaxPrice(event.target.value)
                                    }/>
                            </div>
                            <Button variant="success" className='filter-price-button'
                            onClick={() => {
                                searchByPriceRange();
                            }}>
                                Знайти
                            </Button>
                        </div>
                    </div>
                    <div id='exact-price'>
                        <div className='filter-subtitle'>
                            Точна ціна (грн)
                        </div>
                        <FormControl
                            id='exact-price-field'
                            value={exactPrice}
                            type='number'
                            min='0'
                            onChange={event =>
                                setExactPrice(event.target.value)
                            }/>
                        <Button variant="success" className='filter-price-button'
                        onClick={() => {
                            searchByExactPrice();
                        }}>
                            Знайти
                        </Button>
                    </div>
                </div>

                <div className='output-table-wrapper'>
                    <Table striped bordered hover className='output-table'>
                        <thead>
                        <tr>
                            <th className='shop-product-product-name'>
                                Товар
                            </th>
                            <th className='shop-product-product-price'>
                                Ціна (грн)
                            </th>
                            <th className='shop-product-product-count'>
                                Кількість
                            </th>
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
                        Новий товар у магазині
                    </div>
                    <div id='new-entity-card-wrapper'>
                        <Card>
                            <Card.Body>
                                <div id='new-shop-product-card-content'>
                                    <DropdownButton
                                        id='new-product-dropdown'
                                        className='shop-product-product-name'
                                        title='Оберіть товар'
                                    >
                                        {
                                            makeProductsDropdownMarkup()
                                        }
                                    </DropdownButton>

                                    <FormControl
                                        className='shop-product-product-price'
                                        value={newShopProductData['price'] ? newShopProductData['price'] : ''}
                                        placeholder='Ціна'
                                        type='number'
                                        min='0'
                                        onChange={event =>
                                            changeNewShopProductDataField(event, 'price')
                                        }
                                    />

                                    <FormControl
                                        className='shop-product-product-price'
                                        value={newShopProductData['count'] ? newShopProductData['count'] : ''}
                                        placeholder='Кількість'
                                        type='number'
                                        min='0'
                                        onChange={event =>
                                            changeNewShopProductDataField(event, 'count')
                                        }
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                        <div id='new-product-button-wrapper'>
                            <Button
                                disabled={!isNewShopProductDataComplete()}
                                variant="success"
                                onClick={_ => {
                                    createNewShopProduct();
                                }}
                            >
                                Додати
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )

}

export default ShopProduct;