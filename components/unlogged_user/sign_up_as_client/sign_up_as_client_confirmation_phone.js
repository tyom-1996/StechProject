import React, { Component } from 'react';
import Svg, { Path, Rect, Circle, Defs, Stop, ClipPath, G } from "react-native-svg";
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StatusBar } from 'expo-status-bar';


import {
    Text,
    Alert,
    Button,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
} from 'react-native';

import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    initialWindowMetrics,
} from 'react-native-safe-area-context';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {

            code1: null,
            code1_field_error: false,
            code1_field_valid: false,

            code2: null,
            code2_field_error: false,
            code2_field_valid: false,

            code3: null,
            code3_field_error: false,
            code3_field_valid: false,

            code4: null,
            code4_field_error: false,
            code4_field_valid: false,


            code5: null,
            code5_field_error: false,
            code5_field_valid: false,

            code6: null,
            code6_field_error: false,
            code6_field_valid: false,

            email: this.props.email,

            code_main_error:false,
            code_main_error_text: '',
            new_code_sent: false,
        };


    }


    changeFirstCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code1:  value
            })

            if (value.length == 1) {
                this.setState({
                    code1_field_error: false,
                    code1_field_valid: true,
                })
                this.refs.secondInput.focus();
            } else {
                this.setState({
                    code1_field_error: false,
                    code1_field_valid: false,
                })
            }
        }
    }

    changeSecondCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code2:  value
            })

            if (value.length == 1) {
                this.setState({
                    code2_field_error: false,
                    code2_field_valid: true,
                })
                this.refs.thirdInput.focus();
            }

            if (value.length == 0) {
                this.setState({
                    code2_field_error: false,
                    code2_field_valid: false,
                })
                this.refs.firstInput.focus();
            }
        }
    }

    changeThirdCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code3:  value
            })

            if (value.length == 1) {
                this.setState({
                    code3_field_error: false,
                    code3_field_valid: true,
                })
                this.refs.fourthInput.focus();
            }

            if (value.length == 0) {
                this.setState({
                    code3_field_error: false,
                    code3_field_valid: false,
                })
                this.refs.secondInput.focus();
            }
        }
    }

    changeFourthCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code4:  value
            })

            if (value.length == 1) {
                this.setState({
                    code4_field_error: false,
                    code4_field_valid: true,
                })
                this.refs.fifthInput.focus();
            }

            if (value.length == 0) {
                this.setState({
                    code4_field_error: false,
                    code4_field_valid: false,
                })
                this.refs.thirdInput.focus();
            }
        }
    }

    changeFifthCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code5:  value
            })

            if (value.length == 1) {
                this.setState({
                    code5_field_error: false,
                    code5_field_valid: true,
                })
                this.refs.sixthInput.focus();
            }

            if (value.length == 0) {
                this.setState({
                    code5_field_error: false,
                    code5_field_valid: false,
                })
                this.refs.fourthInput.focus();
            }
        }
    }

    changeSixthCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code6:  value
            })

            if (value.length == 1) {
                this.setState({
                    code6_field_error: false,
                    code6_field_valid: true,
                })
            }

            if (value.length == 0) {
                this.setState({
                    code6_field_error: false,
                    code6_field_valid: false,
                })
                this.refs.fifthInput.focus();
            }
        }
    }







    redirectToSignUpAsClient = () => {
        this.props.navigation.navigate("SignUpAsClient");
    }
    redirectToSignUpAsClientProfile = () => {
        this.props.navigation.navigate("SignUpAsClientProfile");
    }
    render() {

        return (
            <SafeAreaView style={styles.container} >
                <StatusBar style="dark" />

                <View style={styles.recovery_account_code_header}>
                    <View style={styles.back_to_recovery_email_btn_wrapper}>
                        <TouchableOpacity style={styles.back_recovery_email_btn}  onPress={() => this.redirectToSignUpAsClient()}>
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={35}
                                height={35}
                                viewBox="0 0 35 35"
                                fill="none"

                            >
                                <Path
                                    d="M20.169 27.708a1.458 1.458 0 01-1.138-.54l-7.043-8.75a1.458 1.458 0 010-1.851l7.291-8.75a1.46 1.46 0 112.246 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.137 2.391z"
                                    fill="#000"
                                />
                            </Svg>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.recovery_account_code_main_title}>
                        Подтверждение
                        Номера
                    </Text>
                </View>

                <ScrollView style={styles.recovery_account_code_main_wrapper}>


                    <Text style={styles.recovery_account_code_second_title}>
                        На ваш номер отправлен код подтверждения,введите его ниже чтобы закончить регистрацию
                    </Text>

                    {this.state.code_main_error &&

                    <Text style={styles.error_text}>
                        {this.state.code_main_error_text}
                    </Text>

                    }

                    {this.state.email_error &&

                    <Text style={styles.error_text}>
                        {this.state.email_error_text}
                    </Text>

                    }
                    {this.state.new_code_sent &&

                    <Text style={styles.success_text}>
                        Новый код отправлен!
                    </Text>

                    }


                    <View style={styles.recovery_account_code_inputs_wrapper}>
                        <TextInput
                            ref='firstInput'
                            style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code1_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                            onChangeText={(value) => {this.changeFirstCodeInput(value)}}
                            value={this.state.code1}
                            placeholderTextColor="#000000"
                            keyboardType="numeric"

                        />
                        <TextInput
                            ref='secondInput'
                            style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code2_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                            onChangeText={(value) => {this.changeSecondCodeInput(value)}}

                            value={this.state.code2}
                            keyboardType="numeric"
                        />
                        <TextInput
                            ref='thirdInput'
                            style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code3_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                            onChangeText={(value) => {this.changeThirdCodeInput(value)}}
                            value={this.state.code3}
                            keyboardType="numeric"
                        />
                        <TextInput
                            ref='fourthInput'
                            style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code4_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                            onChangeText={(value) => {this.changeFourthCodeInput(value)}}
                            value={this.state.code4}
                            keyboardType="numeric"
                        />
                        <TextInput
                            ref='fifthInput'
                            style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code5_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                            onChangeText={(value) => {this.changeFifthCodeInput(value)}}
                            value={this.state.code5}
                            keyboardType="numeric"
                        />
                        <TextInput
                            ref='sixthInput'
                            style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code6_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                            onChangeText={(value) => {this.changeSixthCodeInput(value)}}
                            value={this.state.code6}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.send_code_again_btn_wrapper}>
                        <TouchableOpacity style={styles.send_code_again_btn}>
                            <Text style={styles.send_code_again_btn_text}>Отправить код повторно</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={styles.recovery_account_confirm_code_btn_wrapper}>
                        <TouchableOpacity style={styles.recovery_account_confirm_code_btn} onPress={() => this.redirectToSignUpAsClientProfile()}>
                            <Text style={styles.recovery_account_confirm_code_btn_text}>Продолжить</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>




            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
        width: "100%",
        height: "100%",

    },
    recovery_account_code_header: {
        marginBottom: 39,
        paddingHorizontal: 15,
        paddingTop: 20,
    },

    back_to_recovery_email_btn_wrapper: {
        marginBottom: 31,
    },
    recovery_account_code_main_wrapper: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 28,

    },

    recovery_account_code_main_title: {
        color: "#333333",
        fontSize: 36,
        fontWeight: 'bold',
        lineHeight: 36,
        textAlign: "center",
    },

    recovery_account_code_second_title: {
        color: '#545454',
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 27,
        lineHeight: 16,
        textAlign: 'center'
    },



    recovery_account_confirm_code_btn: {
        backgroundColor: '#FF6600',
        borderRadius: 8,
        width: "100%",
        maxWidth: 265,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },

    recovery_account_confirm_code_btn_text: {
        color: '#ffffff',
        fontWeight:'bold',
        fontSize: 18,
        lineHeight: 21,
    },

    code_input_field: {
        maxWidth: 45,
        width: '100%',
        height: 60,
        backgroundColor: '#F1F1F1',
        fontSize:15,
        color:'#000000',
        borderRadius:8,
        fontWeight: "bold",
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",

    },


    recovery_account_code_inputs_wrapper: {
        flexDirection: 'row',
        justifyContent: "space-between",
        // alignItems: 'center',
        marginBottom: 10,
    },
    send_code_again_btn_wrapper: {
        marginBottom: 39,
    },
    send_code_again_btn: {
        alignSelf: "center",
    },
    send_code_again_btn_text: {
        color: "#333333",
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline'
    },
    error_text: {
        fontSize: 12,
        color: "red",
        fontWeight: "bold",
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 20
    },

    success_text: {
        fontSize: 12,
        color: "green",
        fontWeight: "bold",
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 20
    }

});