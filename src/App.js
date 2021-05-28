import logo from './logo.svg';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import Header from "./Components/Header";
import Products from "./Components/Products";
import Shops from "./Components/Shops";
import ShopProduct from "./Components/ShopProduct";
import 'dotenv';
import RequestManager from "./AuxiliaryTools/RequestManager";

function App() {
    const requestManager = new RequestManager();

    return (
        <div className="App">
            <BrowserRouter>
                <Route
                    component={() =>
                        <Header/>
                    } path='/'/>
                <Route
                    component={() =>
                        <Products requestManager={requestManager} />
                    } path='/product'
                />
                <Route
                    component={() =>
                        <Shops requestManager={requestManager} />
                    } exact path='/shop'
                />
                <Route
                    component={() =>
                        <ShopProduct requestManager={requestManager} />
                    } exact path='/shop/:id'
                />
            </BrowserRouter>
        </div>
    );
}

export default App;
