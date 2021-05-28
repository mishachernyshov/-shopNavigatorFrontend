import React, {useEffect, useState} from 'react';
import axios from "axios";
import DeleteButton from '../images/delete_button.png';
import SaveChangesButton from '../images/save_changes_button.png';
import {FormControl} from 'react-bootstrap';


const ProductRow = (props) => {
    const [currentProductData, setCurrentProductData] = useState(props.data);

    const updateProducts = (event, field) => {
        const updatedProducts = {...currentProductData};
        updatedProducts[field] = event.target.value;
        setCurrentProductData(updatedProducts);
    }

    const dataIsNotChanged = () => {
        for (const [key, value] of Object.entries(props.data)) {
            if (currentProductData[key] != value) {
                return false;
            }
        }
        return true;
    }

    const sendPatchRequest = () => {
        const updatedProducts = {...props.products};
        updatedProducts[props.id] = currentProductData;
        props.setProducts(updatedProducts);
        const changedValues = getChangedValues();
        let url = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_PRODUCT_ENDPOINT + props.id;
        props.requestManager.makePatchRequest(url, {}, changedValues);
    }

    const getChangedValues = () => {
        const changedValues = {}
        for (const [key, value] of Object.entries(props.data)) {
            if (currentProductData[key] != value) {
                changedValues[key] = currentProductData[key];
            }
        }
        return changedValues;
    }

    const deleteProduct = () => {
        const updatedProducts = {...props.products};
        delete updatedProducts[props.id];
        props.setProducts(updatedProducts);
        sendDeleteRequest();
    }

    const sendDeleteRequest = () => {
        let url = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_PRODUCT_ENDPOINT + props.id;
        props.requestManager.makeDeleteRequest(url, {});
    }

    useEffect(() => {
        setCurrentProductData(props.data);
    }, [props.id])

    return (
        <tr>
            <td>
                <div className='product-id'>
                    {props.id}
                </div>
            </td>
            <td>
                <FormControl
                    value={currentProductData.name}
                    className='product-name'
                    onChange={event =>
                        updateProducts(event, 'name')
                    } />
            </td>
            <td>
                <FormControl
                    className='product-description'
                    as='textarea' value={currentProductData.description}
                    onChange={event =>
                        updateProducts(event, 'description')
                    }/>
            </td>
            <td>
                <FormControl
                    value={currentProductData.rating}
                    type='number'
                    min='0'
                    max='10'
                    className='product-rating'
                    onChange={event =>
                        updateProducts(event, 'rating')
                    }/>
            </td>
            <td>
                <FormControl
                    value={currentProductData.label}
                    className='product-label'
                    onChange={event =>
                        updateProducts(event, 'label')
                    } />
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
    );
}

export default ProductRow;