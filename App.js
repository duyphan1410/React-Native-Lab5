import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Router from "./src/routers/Router";
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';
import { MyContextControllerProvider } from './src/store';

const App = () => {
    const USERS = firestore().collection("USERS");
    const admin = {
        fullName: "Admin",
        email: "admin@example.com",
        password: "123456",
        phone: "0913131732",
        address: "Binh Duong",
        role: "admin"
    };

    useEffect(() => {
        // Đăng ký tài khoản admin
        USERS.doc(admin.email)
            .onSnapshot(u => {
                if (!u.exists) {
                    auth().createUserWithEmailAndPassword(admin.email, admin.password)
                        .then(response => {
                            USERS.doc(admin.email).set(admin);
                            console.log("Add new account admin");
                        });
                }
            });
    }, []);

    return (
        <MyContextControllerProvider>
            <PaperProvider theme={theme}>
                <NavigationContainer>
                    <Router />
                </NavigationContainer>
            </PaperProvider>
        </MyContextControllerProvider>
    );
};

export default App;