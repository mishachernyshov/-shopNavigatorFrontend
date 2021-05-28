import React, {useState, useEffect} from "react";
import {DropdownButton, Dropdown, FormControl} from 'react-bootstrap';
import DeleteButton from "../images/delete_button.png";
import SaveChangesButton from "../images/save_changes_button.png";


const ShopProductRow = (props) => {
    const [currentShopProductData, setCurrentShopProductData] =
        useState(props.data);

    const dataIsNotChanged = () => {
        for (const [key, value] of Object.entries(props.data)) {
            if (currentShopProductData[key] != value) {
                return false;
            }
        }
        return true;
    }

    const updateShopProducts = (event, field) => {
        const updatedProducts = {...currentShopProductData};
        updatedProducts[field] = event.target.value;
        setCurrentShopProductData(updatedProducts);
    }

    const deleteProduct = () => {
        const updatedProducts = {...props.shopProducts};
        delete updatedProducts[props.id];
        props.setShopProducts(updatedProducts);
        sendDeleteRequest();
    }

    const sendDeleteRequest = () => {
        let url = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_SHOP_PRODUCTS_ENDPOINT +
            props.shopId + `?product_id=${props.id}`;
        props.requestManager.makeDeleteRequest(url, {});
    }

    const sendPatchRequest = () => {
        const updatedProducts = {...props.shopProducts};
        updatedProducts[props.id] = currentShopProductData;
        props.setShopProducts(updatedProducts);
        const changedValues = getChangedValues();
        let url = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_SHOP_PRODUCTS_ENDPOINT +
            props.shopId + `?product_id=${props.id}`;
        props.requestManager.makePatchRequest(url, {}, changedValues);
    }

    const getChangedValues = () => {
        const changedData = {};
        for (const [key, value] of Object.entries(props.data)) {
            if (key != 'name' && value != currentShopProductData[key]) {
                changedData[key] = currentShopProductData[key];
            }
        }
        return changedData;
    }

    useEffect(() => {
        setCurrentShopProductData(props.data);
    }, [props.id])

    return (
        <tr>
            <td>
                <div className='shop-product-product-name'>
                    {currentShopProductData['name']}
                </div>
            </td>
            <td>
                <FormControl
                    className='shop-product-product-price'
                    value={currentShopProductData['price']}
                    type='number'
                    min='0'
                    onChange={event =>
                        updateShopProducts(event, 'price')
                    }
                />
            </td>
            <td>
                <FormControl
                    className='shop-product-product-count'
                    value={currentShopProductData['count']}
                    type='number'
                    min='0'
                    onChange={event =>
                        updateShopProducts(event, 'count')
                    }
                />
            </td>
            <td>
                <img
                    className='delete-button'
                    src={
                        dataIsNotChanged() ? DeleteButton : SaveChangesButton
                    }
                    onClick={_ => {
                        dataIsNotChanged() ? deleteProduct() : sendPatchRequest();
                    }}
                />
            </td>
        </tr>
    )
}

export default ShopProductRow;