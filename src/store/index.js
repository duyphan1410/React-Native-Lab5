import { createContext, useContext, useMemo, useReducer } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

// Create context
const MyContext = createContext();
MyContext.displayName = "ServiceAppContext";

// Define Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return { ...state, userLogin: action.value };
    case "LOGOUT":
      return { ...state, userLogin: null };
    case "LOAD_SERVICES":
      return { ...state, services: action.value };
    case "ADD_SERVICE":
      return { ...state, services: [...state.services, action.value] };
    case "UPDATE_SERVICE":
      return { 
        ...state, 
        services: state.services.map(service => 
          service.id === action.value.id ? action.value : service
        ) 
      };
    case "DELETE_SERVICE":
      return { 
        ...state, 
        services: state.services.filter(service => service.id !== action.value) 
      };
    default:
      throw new Error("Action not found");
  }
};

// Define MyContextControllerProvider
const MyContextControllerProvider = ({ children }) => {
  // Initial store state
  const initialState = {
    userLogin: null,
    services: []
  };
  
  // Create reducer
  const [controller, dispatch] = useReducer(reducer, initialState);
  
  // Use memo to optimize performance
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  
  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

// Hook to use the context
const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextControllerProvider");
  }
  return context;
};

export { MyContextControllerProvider, useMyContext };