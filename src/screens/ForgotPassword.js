import { View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { useState } from "react";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const hasErrorEmail = () => !email.includes("@");

    const handleResetPassword = () => {
        if (hasErrorEmail()) {
            Alert.alert("Email không hợp lệ");
            return;
        }

        auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                Alert.alert("Thành công", "Vui lòng kiểm tra email để đặt lại mật khẩu");
                navigation.goBack();
            })
            .catch(e => {
                Alert.alert("Lỗi", "Không tìm thấy tài khoản với email này");
            });
    };

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 20
            }}>Quên mật khẩu</Text>
            
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <HelperText type="error" visible={hasErrorEmail()}>
                Địa chỉ email không hợp lệ
            </HelperText>
            
            <Button 
                mode="contained" 
                onPress={handleResetPassword}
                style={{ marginTop: 20 }}
            >
                Gửi yêu cầu đặt lại mật khẩu
            </Button>
            
            <Button 
                onPress={() => navigation.goBack()}
                style={{ marginTop: 10 }}
            >
                Quay lại đăng nhập
            </Button>
        </View>
    );
};

export default ForgotPassword;