import React, {useEffect, useState} from 'react';
import axios from "axios";
import DeleteButton from '../images/delete_button.png';
import SaveChangesButton from '../images/save_changes_button.png';
import {FormControl} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const ShopRow = (props) => {
    const [currentShopData, setCurrentShopData] = useState(props.data);

    const updateShop = (event, field, isAddress = false) => {
        const updatedProducts = {...currentShopData};
        if (isAddress) {
            updatedProducts['address'][field] = event.target.value;
        } else {
            updatedProducts[field] = event.target.value;
        }
        setCurrentShopData(updatedProducts);
    }

    const dataIsNotChanged = () => {
        return shopDataIsNotChanged() && shopAddressIsNotChanged();
    }

    const shopDataIsNotChanged = () => {
        for (const [key, value] of Object.entries(props.data)) {
            if (typeof(currentShopData[key]) !== 'object' || currentShopData[key] === null) {
                if (currentShopData[key] != value) {
                    return false;
                }
            }
        }
        return true;
    }

    const shopAddressIsNotChanged = () => {
        for (const [key, value] of Object.entries(props.data['address'])) {
            if (currentShopData['address'][key] != value) {
                return false;
            }
        }
        return true;
    }

    const checkObjectsEquality = (object1, object2) => {
        for (const [key, value] of Object.entries(object1)) {
            if (typeof(object2[key]) !== 'object' || object2[key] === null) {
                if (object2[key] != value) {
                    return false;
                }
            } else {
                checkObjectsEquality(value, object2[key]);
            }
        }
        return true;
    }

    const sendPatchRequest = () => {
        const updatedProducts = {...props.shops};
        updatedProducts[props.id] = currentShopData;
        props.setShops(updatedProducts);

        const changedShopValues = getChangedShopData();
        if (Object.entries(changedShopValues).length > 0) {
            sendShopPatchRequest(changedShopValues);
        }

        const changedShopAddressValues = getChangedShopAddressData();
        if (Object.entries(changedShopAddressValues).length > 0) {
            sendAddressPatchRequest(changedShopAddressValues);
        }
    }

    const sendShopPatchRequest = (data) => {
        let url = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_SHOP_ENDPOINT + props.id;
        props.requestManager.makePatchRequest(url, {}, data);
    }

    const sendAddressPatchRequest = (data) => {
        let url = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_ADDRESS_ENDPOINT + props.id;
        props.requestManager.makePatchRequest(url, {}, data);
    }

    const getChangedShopData = () => {
        const changedData = {};
        for (const [key, value] of Object.entries(props.data)) {
            if (typeof(value) !== 'object' && currentShopData[key] != value) {
                changedData[key] = currentShopData[key];
            }
        }
        return changedData;
    }

    const getChangedShopAddressData = () => {
        const changedData = {}
        for (const [key, value] of Object.entries(props.data['address'])) {
            if (currentShopData['address'][key] != value) {
                changedData[key] = currentShopData['address'][key];
            }
        }
        return changedData;
    }

    const deleteShop = () => {
        const updatedShops = {...props.shops};
        const addressId = currentShopData['address']['id'];
        delete updatedShops[props.id];
        props.setShops(updatedShops);
        sendDeleteRequest(addressId);
    }

    const sendDeleteRequest = (addressId) => {
        let shopUrl = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_SHOP_ENDPOINT + props.id;
        props.requestManager.makeDeleteRequest(shopUrl, {})
            .then(_ => {
                let addressUrl = process.env.REACT_APP_API_URL +
                    process.env.REACT_APP_ADDRESS_ENDPOINT + addressId;
                props.requestManager.makeDeleteRequest(addressUrl, {});
            })
    }

    useEffect(() => {
        setCurrentShopData(props.data);
    }, [props.id])

    return (
        <tr>
            <td>
                <NavLink to={`/shop/${props.id}`} className='shop-link'>
                    <div className='shop-id'>
                        {props.id}
                    </div>
                </NavLink>
            </td>
            <td>
                <NavLink to={`/shop/${props.id}`} className='header-link'>
                <FormControl
                    value={currentShopData.name}
                    className='shop-name'
                    onChange={event =>
                        updateShop(event, 'name')
                    } />
                </NavLink>
            </td>
            <td>
                <FormControl
                    className='shop-about'
                    as='textarea' value={currentShopData.about}
                    onChange={event =>
                        updateShop(event, 'about')
                    }/>
            </td>
            <td>
                <div className='shop-product-count'>
                    {currentShopData.product_count}
                </div>
            </td>
            <td>
                <div className='shop-average-price'>
                    {currentShopData.average_price
                        ? currentShopData.average_price.toFixed(2)
                        : '-'}
                </div>
            </td>
            <td>
                <div id='shop-address'>
                    <div className='shop-address-group'>
                        <FormControl
                            placeholder='Країна'
                            value={currentShopData.address.country}
                            className='shop-address-country'
                            onChange={event =>
                                updateShop(event, 'country', true)
                            } />
                        <FormControl
                            placeholder='Місто'
                            value={currentShopData.address.city}
                            className='shop-address-city'
                            onChange={event =>
                                updateShop(event, 'city', true)
                            } />
                    </div>
                    <div className='shop-address-group'>
                        <FormControl
                            placeholder='Вулиця'
                            value={currentShopData.address.street}
                            className='shop-address-street'
                            onChange={event =>
                                updateShop(event, 'street', true)
                            } />
                        <FormControl
                            placeholder='Будинок'
                            value={currentShopData.address.building}
                            className='shop-address-building'
                            onChange={event =>
                                updateShop(event, 'building', true)
                            } />
                    </div>
                </div>
            </td>
            <td>
                <img
                    className='delete-button'
                    src={
                        dataIsNotChanged() ? DeleteButton : SaveChangesButton
                    }
                    onClick={_ => {
                        dataIsNotChanged() ? deleteShop() : sendPatchRequest();
                    }}
                />
            </td>
        </tr>
    )
}

export default ShopRow;