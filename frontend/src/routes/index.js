import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import LoginView from "../views/login_view";
import HomePageView from "../views/home_view";
import { useSelector } from "react-redux";
// imports for home page outlets
import MerchantComponent from "../components/merchants/merchant_component";
import MenuItemsComponent from "../components/menu_items/menu_items_component";
import NewMerchantForm from "../components/merchants/new_merchant_form_component";
import MerchantDetailsConfigure from "../components/merchants/configuration/merchant_details_configure";
import PaymentConfiguration from "../components/merchants/configuration/payment_type_configure";
import ModifyPayment from "../components/merchants/modify_payment/payment_selection";

const PrivateRoute = function ({view}) {
    const storeToken = useSelector((store)=> store.user.token);
    const localToken = localStorage.getItem("token");
    const token = storeToken || localToken;
    
    return token ? view : <Navigate to="/login" replace/>;
}
const RoutingIndex =  function () {

    return (
        <Routes>
            <Route path="/" element = {<Navigate to= '/login' />} />
            <Route path="/login" element = {<LoginView />} />
            <Route path="/home" element= {<PrivateRoute view = {<HomePageView/>} />} >
                <Route path="merchants" element={<MerchantComponent />} />
                <Route path="merchants/newMerchant" element={<NewMerchantForm />} />
                <Route path="merchants/:id/update-details" element={<MerchantDetailsConfigure />} />
                <Route path="merchants/:id/add-payment" element={<PaymentConfiguration />} />
                <Route path="merchants/:id/modify-payment" element={<ModifyPayment />} />
                <Route path="menu-items" element={<MenuItemsComponent />} />
            </Route>
        </Routes>
    )
}

export default RoutingIndex;