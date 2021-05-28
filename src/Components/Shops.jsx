import React, {useEffect, useState} from 'react';
import {FormControl, Table, Card, Button} from 'react-bootstrap';
import ShopRow from "./ShopRow";

const Shops = (props) => {
    const [shops, setShops] = useState({});
    const [reloadNecessity, setReloadNecessity] = useState(true);
    const [newShopData, setNewShopData] = useState({
        'address': {}
    });

    useEffect(() => {
        getAggregatedShopList();
        setReloadNecessity(false);
    }, [reloadNecessity])

    const getAggregatedShopList = () => {
        let url = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_AGGREGATED_SHOP_ENDPOINT;
        props.requestManager.makeGetRequest(url, {}, {})
            .then(res => {
                saveShopList(res.data);
            })
    }

    const saveShopList = (shopData) => {
        const shopMap = {};
        for (let shop of shopData) {
            shopMap[shop.id] = {...shop};
            delete shopMap[shop.id]['id'];
        }
        setShops(shopMap);
    }

    const makeTableBodyMarkup = () => {
        const markup = [];
        for (const [key, value] of Object.entries(shops)) {
            markup.push(
                <ShopRow
                    id={key}
                    data={value}
                    shops={shops}
                    setShops={setShops}
                    requestManager={props.requestManager} />
            )
        }
        return markup;
    }

    const changeNewShopDataField = (event, field) => {
        const newProductNewValue = {...newShopData};
        newProductNewValue[field] = event.target.value;
        setNewShopData(newProductNewValue);
    }

    const changeNewShopAddressDataField = (event, field) => {
        const newProductNewValue = {...newShopData};
        newProductNewValue['address'][field] = event.target.value;
        setNewShopData(newProductNewValue);
    }

    const isNewShopDataComplete = () => {
        return newShopData.name
            && newShopData.about
            && newShopData.address.country
            && newShopData.address.city
            && newShopData.address.street
            && newShopData.address.building
    }

    const createNewShop = () => {
        const newAddressUrl = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_ADDRESS_ENDPOINT;
        props.requestManager.makePostRequest(
            newAddressUrl, {}, newShopData['address']
        )
            .then(res => {
                const newAddressId = res.data['id'];
                const newShopUrl = process.env.REACT_APP_API_URL +
                    process.env.REACT_APP_SHOP_ENDPOINT;
                const puttedShopData = {...newShopData};
                puttedShopData['address_id'] = newAddressId;
                delete puttedShopData['address'];
                return props.requestManager.makePostRequest(
                    newShopUrl, {}, puttedShopData
                )
            }).then(_ => {
                setReloadNecessity(true);
                setNewShopData({
                    'address': {}
                });
            })
    }

    return (
        <div id='page-wrapper'>
            <div className='table-title'>
                Магазини
            </div>
            <div className='output-table-wrapper'>
                <Table striped bordered hover className='output-table'>
                    <thead>
                        <tr>
                            <th className='shop-id'>Id</th>
                            <th className='shop-name'>Назва</th>
                            <th className='shop-about'>Про магазин</th>
                            <th className='shop-product-count'>Кількість видів товарів</th>
                            <th className='shop-avg-price'>Середня ціна</th>
                            <th className='shop-address'>Адреса</th>
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
                    Новий Магазин
                </div>
                <div id='new-entity-card-wrapper'>
                    <Card>
                        <Card.Body>
                            <div id='new-shop-card-content'>
                                <FormControl
                                    id='new-shop-name'
                                    value={newShopData['name'] ? newShopData['name'] : ''}
                                    placeholder='Назва'
                                    className='shop-name'
                                    onChange={event =>
                                        changeNewShopDataField(event, 'name')
                                    } />
                                <FormControl
                                    id='new-shop-about'
                                    value={newShopData['about'] ? newShopData['about'] : ''}
                                    placeholder='Про магазин'
                                    className='shop-about'
                                    as='textarea'
                                    onChange={event =>
                                        changeNewShopDataField(event, 'about')
                                    }/>
                                <FormControl
                                    id='new-shop-address-country'
                                    value={newShopData['address']['country'] ? newShopData['address']['country'] : ''}
                                    placeholder='Країна'
                                    className='shop-address-country'
                                    onChange={event =>
                                        changeNewShopAddressDataField(event, 'country')
                                    } />
                                <FormControl
                                    id='new-shop-address-city'
                                    value={newShopData['address']['city'] ? newShopData['address']['city'] : ''}
                                    placeholder='Місто'
                                    className='shop-address-country'
                                    onChange={event =>
                                        changeNewShopAddressDataField(event, 'city')
                                    } />
                                <FormControl
                                    id='new-shop-address-street'
                                    value={newShopData['address']['street'] ? newShopData['address']['street'] : ''}
                                    placeholder='Вулиця'
                                    className='shop-address-country'
                                    onChange={event =>
                                        changeNewShopAddressDataField(event, 'street')
                                    } />
                                <FormControl
                                    id='new-shop-address-building'
                                    value={newShopData['address']['building'] ? newShopData['address']['building'] : ''}
                                    placeholder='Будинок'
                                    className='shop-address-country'
                                    onChange={event =>
                                        changeNewShopAddressDataField(event, 'building')
                                    } />
                            </div>
                        </Card.Body>
                    </Card>
                    <div id='new-product-button-wrapper'>
                        <Button disabled={!isNewShopDataComplete()}
                            variant="success" onClick={_ => {
                            createNewShop();
                        }}>
                            Додати
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shops;