"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const { data: session } = useSession();
  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    phone: "",
    address: null, // { city, district, street, house, apartment }
    deliveryMethod: "courier", // 'courier', 'pickup'
    paymentMethod: "payme", // 'payme', 'click', 'cash'
    passportFile: null,
    passportPreview: null,
    notes: ""
  });

  const [steps, setSteps] = useState({
    personalInfo: false,
    address: false,
    delivery: false,
    payment: false,
    review: false
  });

  // Initial load from session or profile
  useEffect(() => {
    if (session?.user) {
      setCheckoutData(prev => ({
        ...prev,
        fullName: session.user.name || prev.fullName,
        phone: session.user.phone || prev.phone
      }));
    }
  }, [session]);

  const updateCheckoutData = (newData) => {
    setCheckoutData(prev => ({ ...prev, ...newData }));
  };

  const markStepComplete = (stepKey, isComplete = true) => {
    setSteps(prev => ({ ...prev, [stepKey]: isComplete }));
  };

  return (
    <CheckoutContext.Provider
      value={{
        checkoutData,
        updateCheckoutData,
        steps,
        markStepComplete
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
