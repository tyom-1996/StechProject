import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-gesture-handler';
import {APP_URL} from '../../../env'


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
    Dimensions, FlatList
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    initialWindowMetrics,
} from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";



export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showTariffValidInfo: false,
            showPlusSign: false,

            tariffPlusPopup: false,
            successTariffPlusPopup: false,
            user_image: '',

            name_input_disabled: false,
            editName: "",
            edit_name_error: false,
            edit_name_error_text: "",

            surname_input_disabled: false,
            editSurName: '',
            edit_surname_error: false,
            edit_surname_error_text: "",

            region_input_disabled: false,
            editRegion: '',
            edit_region_error: false,
            edit_region_error_text: "",


            city_input_disabled: false,
            editCity: '',
            edit_city_error: false,
            edit_city_error_text: "",


            area_input_disabled: false,
            editArea: '',
            edit_area_error: false,
            edit_area_error_text: "",


            edit_phone_error: false,
            edit_phone_error_text: "",

            edit_mail_error: false,
            edit_mail_error_text: "",

            edit_password_error: false,
            edit_password_error_text: '',

            changeNumberOldPopup: false,
            changeNumberNewPopup: false,
            changeNumberCodePopup: false,

            editOldPhoneNumber: '',
            editNewPhoneNumber: '',



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

            changeNumberSuccessPopup: false,

            changeEmailOldPopup: false,
            editOldEmail: '',

            changeEmailNewPopup: false,
            editNewEmail: '',

            changeEmailCodePopup: false,


            changePasswordPopup: false,

            editOldPassword: '',
            editNewPassword: '',
            confirmNewPassword: '',

            changePasswordSuccessPopup: false,

            passport_image1: '',
            passport_image2: '',
            technology_image1: '',
            technology_image2: '',
            technology_image3: '',
            technology_image4: '',
            technology_image5: '',



            technology_images: ['plus'],


            name: '',
            surname: '',
            phone: '',
            editEmail: '',

            image_path: 'https://admin.stechapp.ru/uploads/',





            editOldPassword_error: false,
            editOldPassword_error_text: '',

            editNewPassword_error: false,
            editNewPassword_error_text: '',

            confirmNewPassword_error: false,
            confirmNewPassword_error_text: '',

            user_tex_passport: [],

            user_transport_images: [],

            loaded_personal_info: true,

            old_password_security: true,
            new_password_security: true,
            repeat_password_security: true,

            count_notification: '',
            count_message: '',
        };

    }


    componentDidMount() {
        const { navigation } = this.props;
        this.getPersonalAreaInfo();
        this.getNotificationsCount();
        this.focusListener = navigation.addListener("focus", () => {
            this.getPersonalAreaInfo();
            this.getNotificationsCount();



        });

    }

    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener) {
            this.focusListener();
        }

    }


    getPersonalAreaInfo = async () => {
        // await AsyncStorage.clear();

        this.setState({
            loaded_personal_info: true
        })
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;


        try {
            fetch(`${APP_URL}/RoleId2MyProfile`, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


            }).then((response) => {
                return response.json()
            }).then( async (response) => {


                await this.setState({
                    loaded_personal_info: false,
                    // personal_area_info: response.message.user,
                    name:  response.message.user[0].name,
                    surName:  response.message.user[0].surname,
                    phone: response.message.user[0].phone,
                    editEmail: response.message.user[0].email,
                    user_image: response.message.user[0].photo,
                    user_tex_passport: response.message.user[0].user_transport[0].tex_passport,
                    user_transport_images: response.message.user[0].user_transport[0].transpor_photo,
                })

                // await this.getRegions();



            })
        } catch (e) {
        }

    }

    getNotificationsCount = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;


        try {
            fetch(`${APP_URL}/GetNotificationCount`, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

            }).then((response) => {
                return response.json()
            }).then( async (response) => {

                console.log(response, 'notiCount')
                if (response?.status === true) {
                    this.setState({
                        count_notification: response.count_notification,
                        count_message: response.count_message,
                    })
                }

            })
        } catch (e) {
        }
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



    redirectToSignUp = () => {
        this.props.navigation.navigate("SignUp");

    }

    redirectToSignIn = () => {
        this.props.navigation.navigate("SignIn");

    }


    redirectToPersonalAreaExecutor = () => {
        this.props.navigation.navigate("PersonalAreaExecutor");
    }


    makeAbleToWriteName = () => {
        this.setState({
            name_input_disabled: true,
        })

    }
    makeAbleToWriteSurName = () => {
        this.setState({
            surname_input_disabled: true,
        })

    }
    makeAbleToWriteRegion = () => {
        this.setState({
            region_input_disabled: true,
        })

    }
    makeAbleToWriteCity = () => {
        this.setState({
            city_input_disabled: true,
        })

    }
    makeAbleToWriteArea = () => {
        this.setState({
            area_input_disabled: true,
        })

    }


    selectImage = async () => {
        // No permissions request is necessary for launching the image library
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;


        // alert('hu')

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {

            this.setState({
                user_image:result.uri
            })

            let res = result.uri.split('.');
            let type = res[res.length - 1];


            let form = new FormData();
            form.append("avatar", {
                uri: result.uri,
                type: 'image/jpg',
                name: 'photo.jpg',
            });




            if (type == 'jpg' ||  type == 'png' ||  type == 'jpeg') {


                if (Platform.OS === 'ios') {
                    try {
                        fetch(`${APP_URL}/RoleId3UpdateProfilePhoto`, {
                            method: 'POST',
                            headers: {
                                'Authorization': AuthStr,
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: form

                        }).then((response) => {
                            return response.json()
                        }).then((response) => {


                            // alert('hello')
                            if (response.hasOwnProperty('status') ) {
                                if (response.status === true) {
                                    this.getPersonalAreaInfo();
                                }
                            }





                        })
                    } catch (e) {
                    }
                } else {
                    try {

                        let config = {
                            method: 'POST',
                            url: `${APP_URL}/RoleId3UpdateProfilePhoto`,
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "multipart/form-data",
                                'Authorization': AuthStr,

                            },
                            data: form,
                        };



                        axios(config).then(async (response) => {



                            response = response.data;



                            if (response.hasOwnProperty('status') ) {
                                if (response.status === true) {
                                    this.getPersonalAreaInfo();
                                }
                            }



                        })
                    } catch (e) {
                    }

                }

            } else {

                alert('Please use correct image format ')
            }



        }
    }



    deletePassport1Img = () => {
        this.setState({
            passport_image1: '',

        })
    }

    deletePassport2Img = () => {
        this.setState({
            passport_image2: '',

        })
    }

    selectPassportImage1 = async () => {
        // No permissions request is necessary for launching the image library
        // let userToken = await AsyncStorage.getItem('userToken');
        // let AuthStr = 'Bearer ' + userToken;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {



            let res = result.uri.split('.');
            let type = res[res.length - 1];


            let form = new FormData();
            form.append("photo", {
                uri: result.uri,
                type: 'image/jpg',
                name: 'photo.jpg',
            });




            if (type == 'jpg' ||  type == 'png' ||  type == 'jpeg') {


                this.setState({
                    passport_image1:result.uri
                })
            } else {

                alert('Please use correct image format ')
            }



        }
    }



    selectPassportImage2 = async () => {
        // No permissions request is necessary for launching the image library
        // let userToken = await AsyncStorage.getItem('userToken');
        // let AuthStr = 'Bearer ' + userToken;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {



            let res = result.uri.split('.');
            let type = res[res.length - 1];


            let form = new FormData();
            form.append("photo", {
                uri: result.uri,
                type: 'image/jpg',
                name: 'photo.jpg',
            });


            if (type == 'jpg' ||  type == 'png' ||  type == 'jpeg') {

                this.setState({
                    passport_image2:result.uri
                })

            } else {

                alert('Please use correct image format ')
            }



        }
    }


    deleteTechnologyImg = (item) => {


        let {technology_images}  = this.state
        let new_technology_image = [];

        for (let i = 0; i < technology_images.length ; i++) {

            if (technology_images[i] !== item && technology_images[i] !== 'plus') {

                new_technology_image.push(technology_images[i]);

            }

        }

        new_technology_image.push('plus')
        this.setState({
            technology_images:new_technology_image
        })


    }

    selectTechnologyImage = async () => {

        let {technology_images} = this.state
        // No permissions request is necessary for launching the image library
        // let userToken = await AsyncStorage.getItem('userToken');
        // let AuthStr = 'Bearer ' + userToken;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {

            let res = result.uri.split('.');
            let type = res[res.length - 1];

            let form = new FormData();

            form.append("photo", {
                uri: result.uri,
                type: 'image/jpg',
                name: 'photo.jpg',
            });




            if (type == 'jpg' ||  type == 'png' ||  type == 'jpeg') {

                let new_technology_image = [];
                for (let i = 0; i < technology_images.length ; i++) {
                    if (technology_images[i] !== 'plus') {

                        new_technology_image.push(technology_images[i])
                    }

                }

                new_technology_image.push(result.uri)
                new_technology_image.push('plus')
                this.setState({
                    technology_images:new_technology_image
                })

            } else {
                alert('Не верный формат картинки!')
            }



        }
    }




    redirectToExecutorCatalogueMainPage = () => {
        this.props.navigation.navigate("ExecutorCatalogueMainPage");

    }

    redirectToExecutorChat = () => {
        this.props.navigation.navigate("ExecutorChat");

    }

    redirectToExecutorNotifications = () => {
        this.props.navigation.navigate("ExecutorNotifications");
    }

    changePassword = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;

        let {editOldPassword, editNewPassword, confirmNewPassword} = this.state;

        if (editOldPassword.length == 0 || editNewPassword.length == 0 || confirmNewPassword.length == 0) {
            if (editOldPassword.length == 0) {
                this.setState({
                    editOldPassword_error: true,
                    editOldPassword_error_text: 'Поле является обязательным.',
                })
            } else {
                this.setState({
                    editOldPassword_error: false,
                    editOldPassword_error_text: '',
                })
            }

            if (editNewPassword.length == 0) {
                this.setState({
                    editNewPassword_error: true,
                    editNewPassword_error_text: 'Поле является обязательным.',
                })
            } else {
                this.setState({
                    editNewPassword_error: false,
                    editNewPassword_error_text: '',
                })
            }
            if (confirmNewPassword.length == 0) {
                this.setState({
                    confirmNewPassword_error: true,
                    confirmNewPassword_error_text: 'Поле является обязательным.',
                })
            } else {
                this.setState({
                    confirmNewPassword_error: false,
                    confirmNewPassword_error_text: '',
                })
            }
        } else {

            this.setState({
                editOldPassword_error: false,
                editOldPassword_error_text: '',
                editNewPassword_error: false,
                editNewPassword_error_text: '',
                confirmNewPassword_error: false,
                confirmNewPassword_error_text: '',
            })

            try {
                fetch(`${APP_URL}/userUpdatePassword`, {
                    method: 'POST',
                    headers: {
                        'Authorization': AuthStr,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        old_password: editOldPassword,
                        password: editNewPassword,
                        password_confirmation: confirmNewPassword,
                    })

                }).then((response) => {
                    return response.json()
                }).then((response) => {

                    if (response.hasOwnProperty('status')) {
                        if (response.status === true) {
                            this.setState({
                                changePasswordPopup: false,
                                changePasswordSuccessPopup: true,

                            })
                        }  else {
                            if (response.hasOwnProperty('message')) {
                                if (response.message.message == 'wrong password') {
                                    this.setState({
                                        password_error: false,
                                        password_error_text: '',
                                        editOldPassword_error: true,
                                        editOldPassword_error_text: 'Неправильный пароль',
                                    })
                                } else {
                                    this.setState({
                                        password_error: false,
                                        password_error_text: '',
                                        editOldPassword_error: false,
                                        editOldPassword_error_text: '',
                                    })
                                }
                            }
                        }
                    } else {
                        if (response.hasOwnProperty('password')) {

                            let password_error_text = '';

                            if (response.password[0] == 'The password must be at least 6 characters.') {
                                password_error_text = 'Пароль должен быть не менее 6 символов.';
                            }

                            if (response.password[0] == 'The password confirmation does not match.') {
                                password_error_text = 'Пароли не совпадают';
                            }

                            this.setState({
                                password_error: true,
                                password_error_text: password_error_text,
                            })
                        } else {
                            this.setState({
                                password_error: false,
                                password_error_text: '',
                            })
                        }
                    }












                })
            } catch (e) {
            }
        }


    }


    render() {



        /*edit password*/

        if (this.state.changePasswordPopup) {
            return (

                <SafeAreaView style={styles.change_number_old_popup}>
                    <View style={styles.change_number_old_popup_wrapper}>
                        <TouchableOpacity style={styles.change_number_old_popup_close_btn} onPress={() =>
                            this.setState({
                                changePasswordPopup: false,
                                editOldPassword: '',
                                editNewPassword: '',
                                confirmNewPassword: '',
                                editOldPassword_error: false,
                                editOldPassword_error_text: '',
                                editNewPassword_error: false,
                                editNewPassword_error_text: '',
                                confirmNewPassword_error: false,
                                confirmNewPassword_error_text: '',
                                old_password_security: true,
                                new_password_security: true,
                                repeat_password_security: true,

                            })
                        }>
                            <Svg width={35} height={35} viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M17.499 17.78L9.141 9.36m-.063 16.779l8.421-8.358-8.421 8.358zm8.421-8.358l8.421-8.359L17.5 17.78zm0 0l8.358 8.42-8.358-8.42z" stroke="#000" strokeWidth={2} strokeLinecap="round"/>
                            </Svg>
                        </TouchableOpacity>

                        <View style={styles.change_number_old_popup_header}>
                            <View style={styles.change_number_old_popup_img}>
                                <Svg
                                    width={108}
                                    height={88}
                                    viewBox="0 0 108 88"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <Mask id="a" fill="#fff">
                                        <Path d="M38.803.263C39.815.17 40.866.073 41.14.045c1.796-.183 7.953.222 10.403.685 1.205.228 1.447.461 1.337 1.292-.042.313-.09 1.838-.108 3.39l-.032 2.822 1.484.463c3.37 1.05 6.012 2.248 8.7 3.941l.677.426 1.313-1.218c.722-.67 1.856-1.73 2.52-2.354.742-.697 1.331-1.138 1.525-1.142.71-.014 5.418 4.19 7.711 6.885 1.201 1.412 2.87 3.627 3.215 4.268.256.476.255.488-.059.913-.178.242-.245.43-.152.43.091 0 2.636.35 5.654.777 7.963 1.127 16.304 2.286 19.488 2.707 1.525.201 2.956.411 3.18.466.225.055-9.438.082-21.472.061l-21.88-.038-1.128-1.078c-4.12-3.938-9.07-6.39-14.915-7.387-1.972-.337-6.433-.339-8.385-.004-4 .686-7.58 2.055-10.775 4.122-3.125 2.021-6.206 5.112-8.24 8.264-2.045 3.17-3.559 7.287-4.099 11.148-.267 1.911-.237 5.824.06 7.743.74 4.78 2.618 9.142 5.572 12.931 1 1.285 3.406 3.695 4.69 4.7 3.535 2.766 7.767 4.632 12.437 5.485 2.16.394 6.6.426 8.74.063 5.998-1.018 10.9-3.495 15.188-7.674l1.259-1.226 21.767.017c19.328.017 21.609.04 20.347.218l-14.925 2.11c-7.426 1.05-13.863 1.95-14.305 2.001-1.267.147-1.279.204-.253 1.258 1.197 1.23 1.285 1.47.797 2.166-.78 1.112-2.436 3.01-4.047 4.636-2.45 2.474-6.631 5.779-7.311 5.779-.155 0-.877-.643-1.716-1.527-.797-.84-1.872-1.97-2.39-2.51l-.94-.981-1.066.575c-2.385 1.285-5.673 2.597-7.884 3.145-.986.244-1.578.37-1.89.392-.048.003-.09.004-.125.003l-.324.009v.68c.023.527.022 1.422.001 2.837-.043 2.992-.083 3.508-.284 3.71-.668.667-8.495.94-12.274.429-2.576-.35-3.654-.591-3.856-.867-.13-.178-.152-1.096-.09-3.705.078-3.345.072-3.469-.19-3.47-.485-.004-3.963-1.238-5.698-2.021a41.164 41.164 0 01-3.3-1.715c-.966-.572-1.676-.908-1.784-.844-.099.058-1.18 1.065-2.404 2.237-1.224 1.172-2.38 2.19-2.57 2.262-.423.16-.915-.142-2.732-1.68-1.48-1.253-2.597-2.305-2.96-2.77l-.427-.4c-.933-.653-5.188-6.068-5.188-6.693 0-.27.47-.754 3.96-4.087l1.045-.998-.854-1.626c-1.348-2.564-3.005-7.092-3.25-8.884l-.081-.59-.857-.089c-.472-.049-2.002-.09-3.401-.09-3.23 0-3.1.09-3.393-2.346-.31-2.575-.245-7.507.137-10.51.357-2.807.502-3.43.836-3.605.14-.072 1.704-.089 3.638-.037 2.22.058 3.405.04 3.426-.053.018-.078.24-.813.496-1.633a36.593 36.593 0 013.696-8.181l.574-.944-.452-.517a129.71 129.71 0 00-2.346-2.492c-1.377-1.437-1.894-2.071-1.894-2.324 0-.542 2.025-3.045 4.403-5.444 2.348-2.367 6.547-5.655 7.252-5.677.117-.004 1.305 1.123 2.639 2.505l2.426 2.511 1.34-.718c2.562-1.371 5.979-2.66 8.606-3.243l1.153-.257.09-1.484c.05-.816.091-2.34.091-3.386 0-2.533-.033-2.497 2.496-2.725z" />
                                        <Path d="M29.058 22.661c3.55-2.507 8.145-4.236 12.333-4.64 3.691-.356 7.11.024 10.774 1.198 1.816.582 2.106.802.471.358-1.388-.377-4.092-.72-5.681-.72-5.017 0-10.341 1.677-14.338 4.515-1.581 1.122-4.331 3.776-5.481 5.289-6.665 8.764-6.657 21.076.019 29.86 1.132 1.49 3.89 4.148 5.462 5.263 4.286 3.044 10.008 4.723 15.203 4.462 1.945-.098 3.912-.381 5.096-.734.418-.125.789-.198.824-.163.107.107-3.128 1.095-4.52 1.38-5.745 1.177-11.638.375-16.89-2.297-2.637-1.341-4.288-2.55-6.47-4.735-2.535-2.538-4.2-4.972-5.495-8.032-3.534-8.35-2.537-17.516 2.722-25.037 1.187-1.697 4.225-4.733 5.971-5.967z" />
                                    </Mask>
                                    <Path
                                        d="M38.803.263C39.815.17 40.866.073 41.14.045c1.796-.183 7.953.222 10.403.685 1.205.228 1.447.461 1.337 1.292-.042.313-.09 1.838-.108 3.39l-.032 2.822 1.484.463c3.37 1.05 6.012 2.248 8.7 3.941l.677.426 1.313-1.218c.722-.67 1.856-1.73 2.52-2.354.742-.697 1.331-1.138 1.525-1.142.71-.014 5.418 4.19 7.711 6.885 1.201 1.412 2.87 3.627 3.215 4.268.256.476.255.488-.059.913-.178.242-.245.43-.152.43.091 0 2.636.35 5.654.777 7.963 1.127 16.304 2.286 19.488 2.707 1.525.201 2.956.411 3.18.466.225.055-9.438.082-21.472.061l-21.88-.038-1.128-1.078c-4.12-3.938-9.07-6.39-14.915-7.387-1.972-.337-6.433-.339-8.385-.004-4 .686-7.58 2.055-10.775 4.122-3.125 2.021-6.206 5.112-8.24 8.264-2.045 3.17-3.559 7.287-4.099 11.148-.267 1.911-.237 5.824.06 7.743.74 4.78 2.618 9.142 5.572 12.931 1 1.285 3.406 3.695 4.69 4.7 3.535 2.766 7.767 4.632 12.437 5.485 2.16.394 6.6.426 8.74.063 5.998-1.018 10.9-3.495 15.188-7.674l1.259-1.226 21.767.017c19.328.017 21.609.04 20.347.218l-14.925 2.11c-7.426 1.05-13.863 1.95-14.305 2.001-1.267.147-1.279.204-.253 1.258 1.197 1.23 1.285 1.47.797 2.166-.78 1.112-2.436 3.01-4.047 4.636-2.45 2.474-6.631 5.779-7.311 5.779-.155 0-.877-.643-1.716-1.527-.797-.84-1.872-1.97-2.39-2.51l-.94-.981-1.066.575c-2.385 1.285-5.673 2.597-7.884 3.145-.986.244-1.578.37-1.89.392-.048.003-.09.004-.125.003l-.324.009v.68c.023.527.022 1.422.001 2.837-.043 2.992-.083 3.508-.284 3.71-.668.667-8.495.94-12.274.429-2.576-.35-3.654-.591-3.856-.867-.13-.178-.152-1.096-.09-3.705.078-3.345.072-3.469-.19-3.47-.485-.004-3.963-1.238-5.698-2.021a41.164 41.164 0 01-3.3-1.715c-.966-.572-1.676-.908-1.784-.844-.099.058-1.18 1.065-2.404 2.237-1.224 1.172-2.38 2.19-2.57 2.262-.423.16-.915-.142-2.732-1.68-1.48-1.253-2.597-2.305-2.96-2.77l-.427-.4c-.933-.653-5.188-6.068-5.188-6.693 0-.27.47-.754 3.96-4.087l1.045-.998-.854-1.626c-1.348-2.564-3.005-7.092-3.25-8.884l-.081-.59-.857-.089c-.472-.049-2.002-.09-3.401-.09-3.23 0-3.1.09-3.393-2.346-.31-2.575-.245-7.507.137-10.51.357-2.807.502-3.43.836-3.605.14-.072 1.704-.089 3.638-.037 2.22.058 3.405.04 3.426-.053.018-.078.24-.813.496-1.633a36.593 36.593 0 013.696-8.181l.574-.944-.452-.517a129.71 129.71 0 00-2.346-2.492c-1.377-1.437-1.894-2.071-1.894-2.324 0-.542 2.025-3.045 4.403-5.444 2.348-2.367 6.547-5.655 7.252-5.677.117-.004 1.305 1.123 2.639 2.505l2.426 2.511 1.34-.718c2.562-1.371 5.979-2.66 8.606-3.243l1.153-.257.09-1.484c.05-.816.091-2.34.091-3.386 0-2.533-.033-2.497 2.496-2.725z"
                                        fill="#F60"
                                    />
                                    <Path
                                        d="M29.058 22.661c3.55-2.507 8.145-4.236 12.333-4.64 3.691-.356 7.11.024 10.774 1.198 1.816.582 2.106.802.471.358-1.388-.377-4.092-.72-5.681-.72-5.017 0-10.341 1.677-14.338 4.515-1.581 1.122-4.331 3.776-5.481 5.289-6.665 8.764-6.657 21.076.019 29.86 1.132 1.49 3.89 4.148 5.462 5.263 4.286 3.044 10.008 4.723 15.203 4.462 1.945-.098 3.912-.381 5.096-.734.418-.125.789-.198.824-.163.107.107-3.128 1.095-4.52 1.38-5.745 1.177-11.638.375-16.89-2.297-2.637-1.341-4.288-2.55-6.47-4.735-2.535-2.538-4.2-4.972-5.495-8.032-3.534-8.35-2.537-17.516 2.722-25.037 1.187-1.697 4.225-4.733 5.971-5.967z"
                                        fill="#F60"
                                    />
                                    <Path
                                        d="M11.903 73.17l.18-.467-.18.467zm.478.765h.5v-1.207l-.854.853.354.354zm.154.09l-.176-.468.176.468zm38.048 5.454l-.467.18.467-.18zm-.189-.013l-.335.37.335-.37zm-.192-.49l.468.176-.468-.176zm-.14-.05l-.316-.387.315.388zm-.16-.141l.49.105-.49-.105zm1.18-.03l-.493-.086v.001l.493.085zm.173.232l.29-.406-.29.406zm-.06.056l-.152.476.153-.476zM44.15.483l-.336.37.336-.37zm.362.133l.354.354-.354-.354zm-.107-.23l-.263.425.263-.426zm.919-.124l.002-.5-.002.5zm.924.135l.267.422-.267-.422zm.032.131l-.004.5.004-.5zm.285-.123l.467.177-.467-.177zm.97.017l.077-.494-.076.494zm1.18.155l.026-.499-.026.5zm-.072.265l.305.396-.304-.396zm-.53.253l.007.5-.007-.5zm.07-.205l.302.399-.301-.399zm-.496.221l.03-.499-.03.5zm-.277.151l-.138-.48.138.48zm-.626-.006l.354-.353-.354.353zm-.395-.01l-.236-.44.236.44zm-.725.035l-.102.49.102-.49zm-.473-.1l-.11-.487.007.977.103-.49zm.426-.095l.11.488-.11-.488zm.96-.113l-.016-.5.016.5zM47.5.656l-.02-.5.02.5zm.124-.085l.124-.485-.124.485zm-.569.076l.217.45-.217-.45zm-1.97.357l-.082-.493.081.493zm-.143-.008l.162.473-.162-.473zm-.213-.265l-.102-.49.102.49zm-.746-.199l.309-.393-.31.393zM43.758.25l-.012-.5.012.5zm1.752.375l.188-.463-.188.463zm.356 0L45.679.16l.187.464zm-40.97 34.31l-.105-.49.104.49zm.356.048l-.034-.5.034.5zm1.066.087l.283-.412-.283.412zm-.072.077l.117-.486-.117.486zm-1.28.048l-.057-.497.057.497zm.569.1l-.005-.5.005.5zm1.826.404l-.467-.18.467.18zm.461.194l-.08-.493.08.493zm1.124 1.293l-.32.385.32-.385zm.211.337l.5.007-.5-.007zm-.14-.053l.42-.271-.42.271zm-.409-.268l-.396.305.396-.305zm-.35-.195l.425.263-.425-.263zm.872.855l.085.493-.085-.493zm.342 1.078l.45.218-.45-.218zm-.228 1.618l-.353-.354.353.354zm.195-.841l-.495-.071.495.07zm.109-.755l.5.001-.995-.073.495.072zm-.492 1.965l-.499.033.5-.033zm-.052-.793l-.499.031.5-.031zm.05-.817l-.495-.07.495.07zm.003-.22l.486.117-.486-.118zm-.334-.483l.471-.166-.471.166zm-.484-.998l-.37.335.37-.335zm-.431-.623l.179.467-.18-.467zm-.127-.146l.466.179-.466-.18zm-1.004-.664l.425.263-.425-.263zm-.523-.476l.263.425-.263-.425zm.106.312l.307-.394-.307.394zm.01.12l-.164.473.163-.472zm-.98-.09l-.32-.384-1.062.884H5.29v-.5zm.336-.28l-.32-.383.32.384zm.078-.283l.01-.5-.01.5zm-.18.12l-.426.262.426-.263zm-1.75.192l.072-.495-.072.495zm-.193-.328l-.023-.5.023.5zm.047-.09l.184-.466-.184.465zm-.387.176l-.404-.296.404.296zm-.51.1l-.217.45.217-.45zm.06-.165l.012.5-.013-.5zm.869-.31l-.026-.5.026.5zm.06-.082l-.126.483.126-.483zm-1.324.747l.108.488h.001l-.109-.488zm.047.025l-.243-.437.243.437zm.44.197l-.287-.409.288.41zm.662-.152l-.185.465.185-.465zm.284.113l.02.5.165-.964-.185.464zm-.284.011l.02.5-.02-.5zm-.71.233l-.232-.443.231.444zm-.57-.013l.429-.258-.428.258zm-.429.022l-.498.035.498-.035zm.052.729l-.223.448.784.39-.062-.874-.499.036zm-.443-.221l-.223.447.223-.447zm-.131-.36l-.204-.457.204.456zm-.036-.216l-.207-.455.207.455zm-.281.6l-.495.075.495-.074zm-.069.159l-.452.214.452-.214zm-.14-.071l.5.011-.5-.011zm.214.568l.426-.261-.426.261zm.141.107l-.478.146.478-.146zm.39-.47L2 36.929l-.467.179zm-.144.121l.18-.467-.18.467zm-.138.185l-.477.149.477-.149zm-.038.465l.424.266-.424-.266zm-.277-.071l-.432.25v.001l.432-.251zm-.182.587l-.5.011.5-.012zm.01.426l-.477.15.977-.162-.5.012zm-.135-.427l.477-.15-.477.15zm.022-1.33l.493.085-.493-.085zm.868-1.35l.265.424-.265-.424zm3.376-.952l.067-.495-.067.495zm.498.067l.105.489-.038-.985-.067.496zm-1.235.75l.186-.464-.186.464zm.272-.011l.354.353-.354-.353zm-.186-.075l-.02-.5.02.5zm3.413.837l-.353-.354.353.354zM3.433 38.79l-.409-.287.41.288zm-.024-.167l.48.137h.001l-.481-.137zm-.062-.24l.263.426-.263-.426zm-.389.573l-.294-.403.294.403zm-.079.655l.477-.149-.477.15zm.267 1.197l.493-.08-.493.08zm.612.75l-.04.499.04-.499zm.306-.088l.278-.416-.278.416zm.245-.193l-.073-.494.073.494zm.281.124l-.384-.32.384.32zm.314.082l-.498-.043.498.043zm.055-.567l.497.05-.497-.05zm-.08-.382l.262.425h.001l-.263-.425zm.503-.516l.32-.385-.32.385zm.006.538l-.444-.23.444.23zm-.116.5l.425-.264-.425.263zm-.151.378l-.37-.336.37.336zm-2.376-.795l-.464.187.464-.187zM2.59 39.6l.5.006-.5-.006zm.008-.64l.5.007-.995-.082.495.076zm-.12.775l-.493-.075.494.075zm.083 1.062l.41-.287-.41.287zm.2.433l.5.002-.5-.002zm-.254-.28l.43-.256-.43.256zm-.225-1.208l-.5-.018.5.018zm.443-1.377l.487-.115-.487.114zm.262.089l.32.385-.32-.385zm.841-.686l-.122-.485.122.485zm.348-.295l.236.441-.236-.44zm-.462.093l.176-.468-.176.468zm.145-.189l-.183-.465.183.465zm1.817.234l-.425.263.425-.263zm-1.697.345l-.148-.478.148.478zm-.42.26l.263-.425-.263.425zm3.814 1.047l-.458.2.458-.2zm-.193-.444l.458-.2-.958.193.5.007zm.06 1.918l-.493-.084.493.084zm-.262.57l-.006-.5.006.5zm.048.14l.271-.42-.27.42zm-.04.585l.436.246-.436-.246zm-.193.507l.353-.353v-.001l-.353.354zm.647-1.044l-.492.087.492-.087zm-.004-.66l.5.016-.5-.016zm.176-.443l-.262.426.262-.426zm-.474 2.123l-.398-.303.398.303zm-.514.482l.47-.172-.47.172zm-.273.203l-.187.463.187-.463zm.016.083l.034.499-.034-.5zm-.497-.28l.328-.378-.328.377zm-.336-.292l.133-.482-.461.859.328-.377zm.32.088l-.133.482.133-.482zm.791-.825l-.179-.467.18.467zm.23-.415l-.5.01.5-.01zm.126-.94l.489.106-.489-.106zm-.048-.684l.18-.467-.18.467zm-.138-.534l-.498-.047.498.047zm-.1-.666l-.407.29.408-.29zm-.064.044l-.476.152.476-.152zm-.378.025l-.4.3.4-.3zm-.255-.34v-.5h-1l.6.8.4-.3zm.87-.178l.5.013-.5-.013zM.713 39.671l.5-.02-.5.02zm-.206.755l.499.026-.5-.026zm.142.626l.44-.236-.44.236zm-.036.223l.177-.468-.177.468zm-.223.55l-.5-.023.5.024zm.106.542l.263.425-.263-.425zm.602-1.189l-.434.25.434-.25zm.299.934l-.179-.466.179.466zm.675.335l-.325.38.325-.38zm.647.415l.017-.5-.017.5zm.39.229l.354-.353-.353.353zm.58.06l.424.264-.425-.263zm1.023-.013l-.354-.354.354.354zm1.286.303l-.01.5.01-.5zm-1.315.561l-.006-.5.006.5zm-.99.052l.04.498-.04-.498zm-1.568-.334l-.425-.263.425.263zm-.996-1.172l-.48-.136.48.136zm-.059-.106l.41.286-.41-.286zm-.151-.178l-.5.003.5-.003zm.189-.61l-.467.18.467-.18zm-.329.412l.488.11-.488-.11zm.2.793l.342-.364-.343.364zm.83.575l-.483.126.484-.126zm-.975-.474l.327-.379-.327.38zm-.58-.499l-.5-.01-.004.235.179.154.326-.379zm.022-1.04l-.5-.01.5.01zm.252-2.673l.455-.208-.455.208zm8.669 2.982l-.466-.183.466.183zm.094.041l.5-.022-.5.022zm-.202.335l-.178-.467.178.467zm-.324.53L8.5 42.21l.263.426zm-6.344.551l-.354.354.354-.353zm.154.28l-.093-.492.093.491zm10.777 30.905l-.491-.094.49.094zm-.059.293l.485.122v-.002l-.485-.12zm-.16-.048l-.263.425.263-.425zm.018-.293l-.385-.32.385.32zm37.483 4.3l-.186.464.186-.464zm-.128.344l-.328-.378.328.378zm.242.001l.309.394-.31-.394zm.117-.355l-.179.467.18-.467zm-.32-.075l-.057-.496.058.496zm.105 4.232l-.5-.011.5.01zm-.128.303l.476-.152-.476.152zm-4.13 3.414l.236.441-.236-.44zm-.737.013l-.139.48.139-.48zm-.463-.133l-.027-.5-.112.98.139-.48zm5.259-4.288l.425-.263-.425.263zm.168 1.731l-.464-.186.464.186zm-.086-.086l-.5.02v.001l.5-.02zm.575-4.537l-.018.5h.031l-.013-.5zm-38.902-6.194c-.011-.019.01.01.025.07a.477.477 0 01-.417.572.373.373 0 01-.092-.003c-.022-.004-.025-.007.003.004l.358-.934a1.032 1.032 0 00-.192-.056.635.635 0 00-.156-.007.532.532 0 00-.475.662c.024.097.07.175.096.218l.85-.526zm-.481.643a.878.878 0 00.445.05.675.675 0 00.477-.303l-.85-.526a.366.366 0 01.134-.13.266.266 0 01.085-.03.125.125 0 01.067.005l-.358.934zm.157.298a.572.572 0 00.287.507.643.643 0 00.34.082c.07-.002.127-.014.137-.016l-.004.001a.48.48 0 01-.194-.005.502.502 0 01-.257-.826c.043-.048.086-.075.097-.082a.49.49 0 01.071-.038c.012-.005.03-.012.001-.001l.352.936.014-.005.009-.004.021-.008a.448.448 0 00.073-.039c.01-.007.054-.034.098-.082a.5.5 0 00-.443-.833l-.014.002-.01.002c-.009.002.004-.001.022-.002.007 0 .09-.005.188.052a.43.43 0 01.212.359h-1zm38.781 4.803a.592.592 0 00-.574.41.763.763 0 00.028.51l.934-.358c-.01-.028.027.044-.012.162a.409.409 0 01-.376.276v-1zm-.546.92c.023.06.023.067.02.052a.461.461 0 01.003-.19.489.489 0 01.712-.317c.013.008.016.011.004.002a3.216 3.216 0 01-.125-.11l-.671.742c.062.056.121.108.17.148.024.019.057.044.094.067.017.01.117.076.256.086a.511.511 0 00.535-.396c.028-.125.002-.232-.002-.25a1.444 1.444 0 00-.063-.192l-.933.358zm.614-.563a.275.275 0 01-.047-.056l-.002-.004-.001-.001v.001l.002.005a.223.223 0 01-.012.112l-.937-.351c-.16.426.094.826.326 1.035l.67-.741zm-.06.057c.018-.049.044-.12.058-.187a.593.593 0 00.01-.2.514.514 0 00-.339-.42c-.186-.065-.342-.002-.374.01a.71.71 0 00-.123.066 1.987 1.987 0 00-.156.118l.63.776.053-.042.02-.015-.011.007a.361.361 0 01-.041.02c-.013.004-.154.066-.33.004a.486.486 0 01-.321-.393c-.01-.078.003-.135.003-.137.004-.015.004-.01-.016.042l.937.35zm-.924-.613c-.052.042-.062.047-.052.04.003-.001.05-.028.121-.042a.475.475 0 01.557.444v.016s0-.008.004-.029l.016-.078-.978-.21c-.015.07-.032.152-.038.224a.72.72 0 00.002.163.525.525 0 00.62.454.618.618 0 00.195-.074c.068-.04.135-.093.183-.132l-.63-.776zm.646.35c.015-.072.031-.148.04-.211a.737.737 0 00.006-.145.513.513 0 00-.799-.403.7.7 0 00-.118.1 2.694 2.694 0 00-.14.16l.774.634c.05-.061.073-.087.082-.097.008-.007-.013.016-.053.042a.49.49 0 01-.744-.371c-.002-.04.002-.064 0-.053-.002.017-.009.055-.026.135l.978.21zm-.05-.212a2.72 2.72 0 01.286.276l.01.014-.006-.01a.421.421 0 01-.04-.111.47.47 0 01-.003-.177l.985.173a.548.548 0 00-.038-.309.752.752 0 00-.066-.121 1.484 1.484 0 00-.133-.167 3.695 3.695 0 00-.35-.334l-.644.766zm.247-.007a.587.587 0 00.04.326.787.787 0 00.096.166c.065.087.149.167.239.232l.582-.813c-.014-.01-.022-.02-.02-.017.001.001.013.017.026.047a.435.435 0 01.023.229l-.986-.17zm.375.724c.034.024.036.028.026.018a.369.369 0 01-.073-.092.495.495 0 01.438-.741.387.387 0 01.055.006l-.014-.004a1.48 1.48 0 01-.047-.014l-.306.952c.05.016.104.033.154.043a.539.539 0 00.239.007.505.505 0 00.342-.758.586.586 0 00-.105-.129 1.279 1.279 0 00-.127-.101l-.582.813zm.385-.827a.824.824 0 00-.453-.022.611.611 0 00-.29.166.57.57 0 00-.159.396h1a.43.43 0 01-.12.297.39.39 0 01-.182.11c-.075.018-.113.002-.102.005l.306-.952zM43.815.853c.108.098.238.184.375.235.068.025.16.05.266.05a.582.582 0 00.41-.168l-.707-.707a.42.42 0 01.29-.126c.055 0 .087.012.089.013.006.002-.018-.007-.053-.039l-.67.742zm1.05.117a.59.59 0 00.11-.674.8.8 0 00-.307-.336l-.526.85s-.04-.022-.073-.092a.381.381 0 01-.032-.192.423.423 0 01.122-.263l.707.707zm-.197-1.01a.465.465 0 01.185.25.483.483 0 01-.177.529.396.396 0 01-.08.044l-.027.009.036-.006c.117-.016.35-.026.716-.024l.005-1a6.905 6.905 0 00-.855.033c-.05.007-.103.016-.156.03a.667.667 0 00-.216.097.517.517 0 00-.203.58c.061.198.217.29.246.309l.526-.85zm.653.802c.366.002.6.015.717.032l.037.006a.388.388 0 01-.101-.051.476.476 0 01.006-.775l.535.845c.03-.02.19-.118.245-.326a.524.524 0 00-.209-.56.674.674 0 00-.212-.097 1.321 1.321 0 00-.156-.032 6.84 6.84 0 00-.857-.042l-.005 1zm.66-.788c-.044.028-.102.065-.15.107a.618.618 0 00-.112.121.52.52 0 00.207.765c.07.033.135.044.165.049.065.01.135.012.185.012l.01-1c-.05 0-.055-.002-.04 0 .004 0 .048.007.105.033a.481.481 0 01.193.707c-.033.048-.065.074-.067.076l.038-.025-.535-.845zm.295 1.054a.957.957 0 00.384-.076.676.676 0 00.372-.37l-.935-.354a.38.38 0 01.11-.158.235.235 0 01.056-.036c.015-.006.02-.006.022-.006l-.009 1zm.756-.446a.47.47 0 01-.243.26c-.04.017-.065.02-.058.018a.883.883 0 01.124-.003 4.8 4.8 0 01.605.059l.152-.988a5.767 5.767 0 00-.74-.071 1.768 1.768 0 00-.296.015.759.759 0 00-.18.05.544.544 0 00-.299.306l.935.354zm.428.334c.5.077 1.058.152 1.228.16l.053-.998c-.11-.006-.613-.071-1.13-.15l-.151.988zm1.228.16c.061.004.04.007-.006-.007a.446.446 0 01-.205-.144.478.478 0 01-.092-.422c.025-.092.07-.146.076-.153.01-.014.016-.018.006-.009-.02.019-.058.05-.128.104l.61.793a3.07 3.07 0 00.194-.159.93.93 0 00.093-.098.593.593 0 00.115-.219.524.524 0 00-.1-.47.555.555 0 00-.26-.175c-.097-.03-.2-.036-.25-.039l-.053.999zm-.35-.63a1.185 1.185 0 01-.272.152c-.02.007-.003-.002.04-.003l.014 1c.173-.002.345-.075.449-.124.126-.06.26-.142.38-.233l-.61-.793zm-.233.15l.028.002a.471.471 0 01.36.615c-.036.103-.097.152-.075.13a.847.847 0 01.067-.054L47.883.49a1.728 1.728 0 00-.161.135.677.677 0 00-.174.26.53.53 0 00.265.647c.132.065.265.063.307.062l-.014-1zm.38.693c.057-.043.115-.09.165-.136a.828.828 0 00.084-.093.588.588 0 00.099-.19.525.525 0 00-.312-.642.736.736 0 00-.274-.047v1c.037 0-.02.007-.1-.026a.475.475 0 01-.272-.573.415.415 0 01.067-.133l.017-.02c-.007.007-.03.026-.077.062l.604.798zM48.248.18a1.15 1.15 0 00-.455.108 1.731 1.731 0 00-.345.204c-.05.039-.102.084-.149.134a.733.733 0 00-.147.225.546.546 0 00.088.56.588.588 0 00.416.198l.063-.998c.002 0 .156.005.281.15.16.188.107.395.082.46a.34.34 0 01-.05.086l.025-.021a.732.732 0 01.141-.084c.06-.026.075-.022.05-.022v-1zm-.592 1.43a.488.488 0 01-.267-.843c.034-.03.06-.045.062-.046.001 0-.05.023-.178.06l.276.961c.137-.04.28-.088.382-.143a.658.658 0 00.119-.082.513.513 0 00.18-.392.512.512 0 00-.329-.475.603.603 0 00-.182-.039l-.063.998zm-.383-.83a.993.993 0 01-.254.049c-.016 0-.01-.002.012.005a.275.275 0 01.108.068l-.707.707a.81.81 0 00.577.22 1.93 1.93 0 00.54-.087l-.276-.961zm-.134.122c-.314-.314-.725-.237-.985-.098l.472.882c.028-.015.017-.002-.026-.003a.257.257 0 01-.168-.074l.707-.707zm-.985-.098c.024-.013.03-.01.001-.005a1.17 1.17 0 01-.387-.009l-.205.98c.176.036.365.048.535.04.15-.007.358-.033.528-.124l-.472-.882zm-.386-.013l-.474-.1-.205.979.474.1.205-.98zm-.467.877l.427-.095-.22-.976-.426.096.22.975zm.427-.095c.198-.045.597-.093.865-.101l-.031-1a6.69 6.69 0 00-1.053.125l.219.976zm.865-.101a2.04 2.04 0 00.504-.074.936.936 0 00.247-.11.571.571 0 00.266-.475h-1c0-.125.05-.218.09-.272a.378.378 0 01.093-.089c.031-.02.044-.02.018-.013a1.07 1.07 0 01-.25.033l.032 1zM47.61.814c0 .18-.1.285-.135.316a.285.285 0 01-.047.035l-.015.008.009-.003a.515.515 0 01.1-.014l-.042-1c-.15.007-.307.035-.443.09a.786.786 0 00-.23.14.577.577 0 00-.197.428h1zm-.088.341c.073-.003.142-.007.201-.014a.939.939 0 00.103-.018c.022-.005.108-.025.194-.084A.512.512 0 0048.18.38a.52.52 0 00-.234-.224 1.012 1.012 0 00-.198-.07l-.248.969c.046.012.032.012-.002-.006a.48.48 0 01-.2-.198.493.493 0 01.254-.688.368.368 0 01.042-.013c.013-.003.017-.003.007-.002a1.72 1.72 0 01-.122.008l.042 1zm.227-1.069A1.262 1.262 0 0047.28.07c-.142.02-.3.06-.441.127l.433.902a.518.518 0 01.215-.043c.021 0 .024.003.013 0l.248-.969zm-.91.11c-.028.014-.132.05-.306.09-.16.036-.345.07-.511.089l.117.993c.205-.024.425-.064.618-.108.18-.041.38-.097.516-.162L46.84.196zm-.817.179c-.373.044-.83.105-1.018.136l.163.986c.164-.027.602-.086.972-.13L46.02.376zM45.003.51c-.099.016-.104.011-.066.013a.487.487 0 01.229.075c.09.058.254.215.228.471-.02.189-.137.295-.158.315a.47.47 0 01-.12.08l-.012.004-.324-.946a.858.858 0 00-.07.028.504.504 0 00.174.972c.09.005.204-.013.282-.026l-.163-.986zm.1.958a.83.83 0 00.414-.283.58.58 0 00-.015-.71.72.72 0 00-.44-.246 1.153 1.153 0 00-.435.011l.203.98c.046-.01.064-.006.056-.007a.188.188 0 01-.048-.017.347.347 0 01-.116-.095.42.42 0 01-.016-.502c.062-.086.123-.093.074-.077l.324.946zM44.628.241c-.103.022-.19.013-.335-.102l-.619.786c.343.27.725.385 1.157.295l-.203-.979zM44.292.14a1.467 1.467 0 01-.095-.08c-.025-.024-.035-.036-.035-.036l.005.007a.418.418 0 01.062.161.481.481 0 01-.459.558l-.024-1a.519.519 0 00-.504.604c.015.092.05.16.07.193a.78.78 0 00.066.098c.076.096.185.194.295.281l.619-.786zm-.522.61a.38.38 0 01-.1-.01L43.643.73c-.002-.001.008.003.029.015a.947.947 0 01.142.107l.671-.742a1.944 1.944 0 00-.302-.225c-.05-.03-.108-.06-.167-.083a.686.686 0 00-.27-.054l.024 1zm1.553.339a.99.99 0 00.365.066c.107 0 .24-.015.365-.066L45.678.16a.166.166 0 01.02-.007l.004-.001a.097.097 0 01-.028 0l.004.001c.004 0 .01.003.02.007l-.375.927zm.73 0a.648.648 0 00.124-.066.511.511 0 00.103-.768.543.543 0 00-.206-.144.787.787 0 00-.208-.049 1.668 1.668 0 00-.178-.008v1c.037 0 .06.001.07.002.02.003-.01.002-.058-.018a.488.488 0 01-.088-.84.358.358 0 01.067-.037l.373.928zM45.688.053c-.061 0-.122.002-.178.008a.788.788 0 00-.208.049.544.544 0 00-.205.144.511.511 0 00.102.768.65.65 0 00.125.066l.373-.927a.47.47 0 01.24.261.489.489 0 01-.09.492.457.457 0 01-.17.123c-.05.02-.08.02-.059.018a.699.699 0 01.07-.002v-1zM4.791 34.445c-.084.018-.179.04-.248.065a.525.525 0 00-.198.122.505.505 0 00.156.827c.067.028.126.036.143.038.08.011.183.008.263.005.098-.003.224-.01.379-.021l-.068-.998c-.151.01-.266.017-.348.02-.099.004-.113 0-.092.003a.491.491 0 01.405.575.495.495 0 01-.296.368c-.007.002.02-.006.113-.026l-.21-.978zm.495 1.036c.212-.015.424-.013.59 0 .084.008.147.017.19.025.06.013.027.015-.031-.025l.565-.825a.922.922 0 00-.33-.128 2.564 2.564 0 00-.312-.043 5.114 5.114 0 00-.74-.002l.068.998zm.749 0c.042.03.05.037.044.031a.435.435 0 01-.073-.088.494.494 0 01.395-.747.316.316 0 01.047.002h.001a.452.452 0 01-.024-.005 2.365 2.365 0 01-.062-.014l-.234.972c.058.014.121.028.176.037.025.003.07.01.123.008a.513.513 0 00.37-.163.506.506 0 00.057-.619.601.601 0 00-.112-.13c-.045-.04-.1-.079-.142-.108l-.566.824zm.327-.821a1.487 1.487 0 00-.292-.031 5.397 5.397 0 00-.336.003c-.246.01-.54.032-.825.065l.115.993c.262-.03.53-.05.747-.058a4.46 4.46 0 01.272-.003c.083.002.102.007.086.003l.233-.972zm-1.454.037c-.233.027-.417.05-.533.066a1.378 1.378 0 00-.177.035.561.561 0 00-.22.126.502.502 0 00.16.827c.054.022.1.03.114.032.062.011.138.014.188.015l.246.002c.2 0 .483-.003.854-.006l-.01-1a91.555 91.555 0 01-1.064.004c-.065-.002-.065-.004-.04 0 .005.001.044.008.092.028a.498.498 0 01.041.9c-.04.02-.074.03-.079.032-.021.006-.02.004.04-.005.098-.015.265-.035.504-.063l-.116-.993zm.632 1.096c.834-.008 1.26.01 1.462.054.114.025.023.032-.055-.082-.102-.15-.038-.285-.053-.246l.934.358c.052-.136.125-.41-.052-.672-.152-.225-.403-.3-.558-.335-.337-.074-.891-.085-1.688-.076l.01 1zm1.354-.274a.662.662 0 00-.01.467.628.628 0 00.35.36c.22.093.476.072.67.04l-.163-.987a.85.85 0 01-.145.014c-.032 0-.015-.005.028.013.05.02.15.083.198.216a.342.342 0 01.006.235l-.934-.358zm1.009.867a.428.428 0 01-.245-.032l.015.01.041.032c.07.056.163.142.258.241s.18.198.239.275c.03.04.045.065.05.075l-.007-.018a.384.384 0 01-.021-.13h1c0-.16-.071-.29-.095-.333a1.675 1.675 0 00-.126-.192 4.081 4.081 0 00-.319-.37 3.893 3.893 0 00-.354-.33 1.465 1.465 0 00-.19-.13.764.764 0 00-.135-.061.57.57 0 00-.272-.024l.161.987zm.33.453c0 .186.082.345.137.434.065.105.153.21.257.297l.639-.77a.204.204 0 01-.045-.052.2.2 0 01.005.024.32.32 0 01.007.067h-1zm.394.73a.21.21 0 01.045.053c.006.009.005.01.001 0a.34.34 0 01-.016-.106l1 .012a.825.825 0 00-.137-.436 1.243 1.243 0 00-.254-.292l-.64.77zm.03-.054c0-.009-.002-.146.112-.276a.478.478 0 01.523-.134c.09.034.137.086.14.089.012.011.012.015.005.004l-.84.542c.031.048.068.098.112.145a.626.626 0 00.23.155.522.522 0 00.584-.144.567.567 0 00.134-.367l-1-.014zm.78-.317a1.043 1.043 0 00-.105-.138.661.661 0 00-.191-.148.527.527 0 00-.767.467l1 .038a.473.473 0 01-.678.391c-.067-.033-.1-.072-.101-.073-.007-.007-.006-.007.002.005l.84-.542zm-1.063.18a.48.48 0 01.485-.452.44.44 0 01.232.07c.007.006-.025-.02-.087-.1l-.792.61c.082.107.181.218.284.295.028.02.067.046.114.069a.56.56 0 00.233.056.519.519 0 00.53-.509l-.998-.038zm.63-.482a1.251 1.251 0 00-.365-.333.662.662 0 00-.342-.088.564.564 0 00-.464.268l.85.526a.435.435 0 01-.353.205c-.104.004-.17-.033-.177-.037-.02-.012.005-.001.059.069l.792-.61zm-1.171-.153a.62.62 0 00-.07.471c.025.107.072.2.113.27.084.141.203.28.322.397.12.118.262.234.406.321.072.044.156.087.247.118.084.028.215.06.364.034l-.17-.986a.316.316 0 01.125.004s-.016-.006-.048-.025a1.326 1.326 0 01-.224-.18 1.075 1.075 0 01-.162-.194c-.014-.023-.006-.017.001.014a.382.382 0 01-.054.282l-.85-.526zm1.382 1.61c-.161.029-.25-.067-.25-.067-.003-.002.02.027.042.098.021.066.034.142.033.212a.323.323 0 01-.019.126l.901.434c.17-.353.133-.777.039-1.074a1.273 1.273 0 00-.253-.464c-.122-.136-.353-.303-.664-.25l.171.986zm-.194.37a2.617 2.617 0 00-.161.523c-.043.193-.081.41-.11.611a4.848 4.848 0 00-.05.543.993.993 0 00.026.272.52.52 0 00.272.34c.316.159.56-.061.6-.101l-.707-.707a.483.483 0 01.8.204c.013.05.007.07.008.01.002-.088.016-.24.042-.422.025-.178.058-.37.095-.533a3.289 3.289 0 01.075-.279.492.492 0 01.008-.02l.002-.006v-.001l-.9-.435zm.577 2.188c.075-.075.112-.16.122-.182.017-.038.03-.077.042-.11.022-.068.043-.148.062-.232.04-.168.078-.38.11-.6l-.99-.142a6.52 6.52 0 01-.094.517c-.016.069-.03.118-.04.148-.004.015-.005.017-.002.01a.437.437 0 01.083-.116l.707.707zm.336-1.124l.109-.755-.99-.142-.109.755.99.142zm-.886-.828L9.045 40l1 .002.003-1.039-1-.003zm-.205 2.152c.01.056.002.075.007.056a.307.307 0 01.064-.117.43.43 0 01.328-.15v1a.571.571 0 00.439-.208c.08-.095.117-.2.136-.273.04-.152.037-.317.014-.464l-.988.156zm.399-.211a.44.44 0 01.229.063c.05.03.08.063.093.08.027.033.032.052.026.035a.692.692 0 01-.035-.186l-.998.068c.012.168.045.339.101.483.028.07.07.158.137.239.058.07.206.218.447.218v-1zm-.186.026l.5-.033v-.002l-.001-.005-.002-.02a282.87 282.87 0 01-.05-.765l-.998.063a227.625 227.625 0 00.046.696l.005.072.001.02v.007l.5-.033zm.447-.824c-.008-.13.01-.46.046-.717l-.99-.138c-.04.29-.068.694-.054.917l.998-.062zm.046-.716c.018-.132.033-.256.035-.333 0-.013 0-.032-.002-.053a.504.504 0 00-.598-.466.503.503 0 00-.341.246c-.034.06-.05.117-.053.126a1.369 1.369 0 00-.02.072l.973.234.005-.018-.006.016c-.002.005-.011.031-.03.064a.498.498 0 01-.905-.093c-.02-.06-.022-.108-.023-.113v-.029l-.005.052-.02.155.99.14zm-.978-.408v-.004l.004-.01a.453.453 0 01.277-.259.467.467 0 01.482.116.264.264 0 01.02.025c.004.005-.012-.018-.045-.097a5.327 5.327 0 01-.115-.302l-.943.332c.09.256.182.493.281.636a.66.66 0 00.16.165.533.533 0 00.785-.19.742.742 0 00.066-.177l-.972-.235zm.623-.531a6.555 6.555 0 00-.274-.659c-.086-.177-.197-.384-.31-.509l-.742.672c-.005-.006.01.01.045.07.03.053.068.122.107.204.08.164.164.363.231.554l.943-.332zm-.585-1.168a.467.467 0 01-.087-.16c-.004-.012 0-.003 0 .024h-1c0 .168.057.329.11.443.056.123.137.254.236.364l.741-.67zm-.087-.136c0-.134-.031-.395-.269-.561-.24-.168-.498-.105-.625-.057l.359.934a.25.25 0 01-.087.013.387.387 0 01-.22-.071.384.384 0 01-.14-.178c-.018-.047-.018-.078-.018-.08h1zm-.893-.618c-.023.009 0-.003.047-.006a.445.445 0 01.365.156c.13.15.11.31.108.33-.004.034-.012.046-.002.02l-.933-.359a.925.925 0 00-.058.221.568.568 0 00.129.443.556.556 0 00.467.186.841.841 0 00.235-.057l-.358-.934zm.518.5c.038-.098.152-.434-.109-.704a.655.655 0 00-.327-.18 1.122 1.122 0 00-.251-.024v1c.038 0 .042.003.026-.001a.35.35 0 01-.167-.1.404.404 0 01-.114-.275c0-.06.015-.09.009-.075l.933.359zm-.687-.908a.78.78 0 01-.343-.091c-.048-.027-.042-.034-.019-.003a.336.336 0 01.06.148.404.404 0 01-.056.274l-.85-.526c-.179.29-.055.569.044.702.096.128.227.219.336.28.224.124.529.216.828.216v-1zm-.357.328a.68.68 0 00.028-.638 1.073 1.073 0 00-.26-.351 1.106 1.106 0 00-.369-.226.707.707 0 00-.61.05l.525.851a.34.34 0 01-.175.052.217.217 0 01-.072-.01c-.01-.003.005 0 .028.022.024.022.026.033.018.016a.25.25 0 01-.019-.091.36.36 0 01.055-.2l.85.525zM5.89 35.28a.645.645 0 00-.246.267.588.588 0 00-.026.447c.04.116.107.203.158.259.054.06.116.113.176.16l.614-.79a.687.687 0 01-.049-.041l.004.005a.324.324 0 01.045.087.412.412 0 01-.021.307.36.36 0 01-.13.15l-.525-.85zm.061 1.133c.065.05.103.08.124.098.012.01.007.007-.004-.005a.417.417 0 01-.042-.053c-.01-.016-.069-.101-.08-.23a.495.495 0 01.259-.475c.115-.063.22-.06.239-.06.035.001.06.006.068.007l.012.003h.004l-.007-.001a1.89 1.89 0 01-.092-.031l-.327.945c.056.02.12.041.172.055.017.005.08.021.151.023.027 0 .137.002.256-.062a.505.505 0 00.263-.485c-.011-.132-.071-.222-.086-.244a.585.585 0 00-.06-.076.954.954 0 00-.076-.071 5.072 5.072 0 00-.159-.127l-.615.788zm.481-.747a2.773 2.773 0 00-.783-.118v1c.158 0 .379.036.456.063l.327-.945zm-.783-.118h-.36v1h.36v-1zm-.04.884l.336-.279-.64-.768-.336.28.64.767zm.336-.279c.073-.06.142-.12.196-.173a.996.996 0 00.09-.1.609.609 0 00.107-.21.527.527 0 00-.365-.651c-.103-.032-.212-.033-.26-.034l-.019 1c.063 0 .036.005-.015-.01a.474.474 0 01-.304-.57c.022-.083.061-.132.065-.137.009-.011.012-.013 0-.002a2.506 2.506 0 01-.135.119l.64.768zm-.233-1.168a.78.78 0 00-.444.116.56.56 0 00-.17.766l.85-.525a.44.44 0 01-.127.593c-.09.059-.153.05-.127.05l.018-1zm-.614.883a.472.472 0 01-.03-.437.434.434 0 01.148-.183c.043-.03.066-.031.02-.018-.07.02-.2.044-.375.064-.35.038-.764.045-1.016.008l-.145.99c.37.054.877.039 1.27-.004.197-.022.393-.054.545-.097a.934.934 0 00.269-.12.568.568 0 00.199-.238.528.528 0 00-.035-.492l-.85.527zm-1.253-.566a.629.629 0 01-.156-.04c-.043-.019.026-.002.085.098a.432.432 0 01-.123.57c-.081.056-.129.042-.049.038l-.045-.999a.906.906 0 00-.473.137.568.568 0 00-.172.762.797.797 0 00.37.308c.123.055.266.093.418.115l.145-.989zm-.243.666c.051-.002.112-.006.17-.016a.647.647 0 00.128-.036.51.51 0 00.228-.784.56.56 0 00-.153-.139 1.001 1.001 0 00-.164-.08l-.367.93c.033.013.022.012-.003-.005a.485.485 0 01-.155-.63c.085-.16.226-.214.243-.22.039-.016.068-.02.07-.021.008-.002-.001 0-.042.002l.045 1zm.21-1.055a.754.754 0 00-.588.03.998.998 0 00-.388.316l.807.59c0 .002 0 0 .001 0l-.006.003a.165.165 0 01-.051.013.305.305 0 01-.143-.022l.367-.93zm-.976.347a.555.555 0 01-.028.035c-.005.006-.005.005.002 0a.297.297 0 01.12-.055c.059-.012.098-.001.098-.001l-.005-.002a.997.997 0 01-.076-.033l-.434.901c.128.062.355.166.61.116.277-.054.437-.257.52-.371l-.807-.59zm.11-.056a3.587 3.587 0 01-.15-.075c-.015-.008.008.003.04.03a.49.49 0 01-.195.83c-.03.009-.045.009-.026.007l.187-.007-.025-1c-.089.003-.176.005-.242.01a.838.838 0 00-.138.021.514.514 0 00-.336.75.54.54 0 00.119.145.76.76 0 00.126.086c.056.032.133.069.207.104l.434-.9zm-.144.785c.15-.003.304-.03.437-.072.066-.021.14-.05.209-.091a.677.677 0 00.237-.225l-.85-.526a.373.373 0 01.108-.113c.01-.006.008-.003-.011.003a.642.642 0 01-.155.025l.025 1zm.883-.388a.35.35 0 01-.086.095c-.01.007-.012.006-.001.002a.27.27 0 01.088-.02l-.053-.998c-.141.008-.282.04-.404.088a.808.808 0 00-.394.307l.85.526zm0 .078c.063-.004.126-.008.18-.015a.568.568 0 00.205-.058.505.505 0 00.1-.849c-.069-.056-.139-.084-.157-.091a1.452 1.452 0 00-.168-.052l-.251.968c.048.012.057.016.047.012a.44.44 0 01-.11-.067.495.495 0 01.17-.848c.026-.006.04-.007.033-.006a1.517 1.517 0 01-.101.007l.052.999zm.16-1.065c-.209-.055-.445-.019-.609.016a3.636 3.636 0 00-1.088.44c-.073.048-.156.11-.226.186a.645.645 0 00-.18.434h1a.403.403 0 01-.045.186.266.266 0 01-.039.057c-.007.008.002-.003.04-.028a2.65 2.65 0 01.748-.296c.147-.032.182-.019.147-.028l.253-.967zM1.743 35.69c0 .16.054.338.19.476a.614.614 0 00.572.167l-.216-.976a.386.386 0 01.354.104c.081.082.1.173.1.229h-1zm.763.643l-.017.002a.399.399 0 01-.062 0c-.019-.002-.099-.008-.188-.056a.494.494 0 01-.26-.468c.01-.174.108-.279.126-.299a.433.433 0 01.071-.063l.025-.016.487.874c.02-.012.092-.05.155-.12a.511.511 0 00.051-.622.507.507 0 00-.392-.227.597.597 0 00-.094 0 .878.878 0 00-.12.019l.218.976zm-.305-.9a.684.684 0 00-.298.363 1.023 1.023 0 00-.062.308.88.88 0 00.045.335c.034.095.177.394.537.394v-1c.133 0 .241.058.311.127.06.06.085.118.093.142.017.045.012.065.013.05 0-.011.002-.014-.001-.004a.23.23 0 01-.028.051.37.37 0 01-.123.108l-.487-.873zm.222 1.4c.09 0 .163-.025.184-.032a.902.902 0 00.087-.035c.048-.022.1-.05.148-.078.1-.057.216-.132.33-.212l-.575-.818a3.478 3.478 0 01-.32.2l.01-.005a.451.451 0 01.135-.02v1zm.75-.357a.563.563 0 01.178-.094c.011-.003.014-.002.012-.002H3.36l.37-.93c-.42-.167-.813-.018-1.134.208l.575.818zm.188-.096l.284.113.37-.93-.284-.112-.37.929zm.45-.851l-.284.01.038 1 .285-.011-.039-1zm-.284.01c-.15.006-.323.052-.463.098-.15.05-.315.117-.46.192l.463.887a2.16 2.16 0 01.445-.167c.041-.01.057-.01.053-.01l-.038-1zm-.923.29c-.099.052-.156.08-.194.095l-.014.006a.268.268 0 01.069-.007.365.365 0 01.234.095c.017.016.024.026.02.021a.663.663 0 01-.024-.038l-.856.517c.032.053.09.148.173.227a.64.64 0 00.43.178.866.866 0 00.348-.074c.085-.034.18-.083.277-.133l-.463-.887zm.091.172a7.177 7.177 0 00-.282-.442 1.25 1.25 0 00-.142-.17.66.66 0 00-.13-.098.546.546 0 00-.298-.074c-.35.017-.464.32-.485.383a.901.901 0 00-.038.241c-.004.125.006.292.019.475l.997-.07a4.105 4.105 0 01-.016-.368c.001-.038.004-.016-.01.029a.43.43 0 01-.091.154.473.473 0 01-.576.096c-.04-.022-.062-.044-.067-.049-.01-.009-.002-.004.025.034a6.4 6.4 0 01.238.376L2.694 36zm-1.356.315l.052.73.997-.072-.052-.729-.997.071zm.773.246l-.443-.22-.446.894.443.222.446-.895zm-.443-.22a4.158 4.158 0 01-.216-.112c-.018-.011-.013-.01.002.003.007.006.078.063.118.175a.466.466 0 01-.046.41c-.05.078-.109.113-.11.113-.004.003.011-.006.101-.046l-.407-.913c-.062.028-.161.07-.238.12a.62.62 0 00-.184.18.535.535 0 00-.056.477.59.59 0 00.179.25c.047.04.096.07.134.092.074.044.174.094.277.145l.446-.894zm-.15.543c.12-.054.238-.124.334-.203a.905.905 0 00.15-.153.596.596 0 00.124-.357h-1a.435.435 0 01.076-.244c.016-.021.025-.027.015-.019a.512.512 0 01-.107.063l.407.913zm.608-.713a.53.53 0 00-.367-.507.671.671 0 00-.294-.026 1.377 1.377 0 00-.394.119l.414.91c.07-.031.104-.037.098-.036-.004 0-.017.002-.038 0a.456.456 0 01-.308-.159.47.47 0 01-.11-.301h1zm-1.055-.414c-.158.072-.392.193-.514.455-.112.24-.082.496-.055.675l.99-.148a1.57 1.57 0 01-.015-.145c0-.017.003.005-.015.043a.221.221 0 01-.052.069l.016-.01a.809.809 0 01.06-.03l-.415-.91zm-.569 1.13c.013.088.02.145.024.18l.001.01c0-.004 0-.018.003-.04a.491.491 0 01.88-.22c.006.01-.002-.001-.03-.06l-.903.428c.026.055.06.127.098.183.006.01.066.107.177.175a.507.507 0 00.73-.233c.048-.11.045-.214.045-.228 0-.038-.002-.077-.005-.108a4.488 4.488 0 00-.03-.236l-.99.149zm.878-.13a1.54 1.54 0 00-.09-.167.762.762 0 00-.07-.093.566.566 0 00-.168-.133.516.516 0 00-.715.268.714.714 0 00-.048.256l1 .023c0-.03.004.026-.028.104a.484.484 0 01-.662.24.433.433 0 01-.147-.12l-.005-.007.008.014c.006.01.013.025.021.043l.904-.428zm-1.091.131c-.004.16.05.33.092.442.049.13.116.273.194.4l.853-.524a1.384 1.384 0 01-.138-.313c-.006-.024 0-.015-.002.018l-1-.023zm.286.841c.035.057.07.11.104.156a.79.79 0 00.153.16.513.513 0 00.717-.09.515.515 0 00.1-.23.576.576 0 00-.003-.196.868.868 0 00-.025-.102l-.956.295-.003-.016c0-.004-.013-.064 0-.144a.493.493 0 01.772-.315c.05.037.068.068.047.041a1.172 1.172 0 01-.053-.081l-.853.523zm1.046-.301a.268.268 0 01-.01-.118c.005-.035.014-.03-.01-.002a.348.348 0 01-.354.094c-.177-.048-.205-.18-.181-.117l.933-.358c-.063-.166-.202-.413-.492-.49-.32-.087-.563.096-.675.231-.222.268-.281.682-.167 1.053l.956-.293zm-.555-.143c.006.017-.007-.012-.01-.066a.446.446 0 01.161-.36.432.432 0 01.32-.104c.038.004.053.013.032.004l-.359.934a.884.884 0 00.223.057.57.57 0 00.429-.126.555.555 0 00.192-.457.792.792 0 00-.054-.24l-.934.358zm.502-.526a.852.852 0 00-.249-.059.557.557 0 00-.594.636c.008.083.03.162.049.224l.955-.298c-.013-.04-.01-.043-.009-.024a.439.439 0 01-.086.28.444.444 0 01-.377.18c-.052-.003-.076-.016-.047-.005l.358-.934zm-.794.801l.002.017a.244.244 0 01-.004.067l.003-.006a.197.197 0 01.015-.028l.847.532a.994.994 0 00.136-.442c.011-.135.002-.29-.044-.438l-.955.298zm.016.05c-.02.03-.007.003.035-.032a.445.445 0 01.535-.01c.026.02.04.038.043.04.003.005-.007-.007-.034-.055l-.865.503c.035.06.078.13.13.192.042.05.148.17.326.216a.565.565 0 00.507-.12.851.851 0 00.17-.202L.79 37.61zm.579-.056a1.617 1.617 0 00-.084-.132.722.722 0 00-.156-.162.53.53 0 00-.568-.043c-.195.105-.252.291-.264.33a1.426 1.426 0 00-.046.37c-.004.128-.002.29.003.486l1-.023a9.38 9.38 0 01-.004-.437c.003-.12.012-.13.002-.098a.464.464 0 01-.215.25.47.47 0 01-.5-.029c-.051-.037-.073-.072-.064-.06a.68.68 0 01.031.05l.865-.502zm-1.115.85l.01.426 1-.024-.01-.427-1 .024zm.986.263l-.134-.426-.954.301.135.427.953-.302zm-.134-.426c-.05-.158-.063-.515.038-1.095l-.985-.171c-.106.605-.134 1.166-.007 1.568l.954-.302zm.038-1.095c.082-.472.116-.586.161-.657.04-.06.108-.122.48-.354l-.531-.848c-.316.198-.605.374-.79.662-.179.278-.236.624-.305 1.026l.985.171zm.64-1.011c.365-.229.983-.475 1.614-.653.31-.087.61-.154.87-.194.269-.041.458-.047.56-.034l.134-.99c-.246-.034-.548-.01-.846.035a8.481 8.481 0 00-.99.221c-.672.19-1.393.466-1.872.767l.53.848zm3.045-.88l.497.067.134-.992-.498-.067-.133.991zm.46-.918l-.498.107.21.977.497-.106-.21-.978zm2.23.87a.758.758 0 00-.604-.365.718.718 0 00-.65.344l.85.527a.282.282 0 01-.252.128.243.243 0 01-.195-.108l.85-.526zm-3.547.833a.89.89 0 00.364.063.67.67 0 00.448-.184l-.707-.708c.06-.06.12-.084.15-.094a.25.25 0 01.067-.013c.021 0 .035.002.05.008l-.372.928zm.812-.121a.53.53 0 00-.187-.876.923.923 0 00-.373-.052l.04.999c.054-.002.027.008-.039-.018-.015-.006-.179-.069-.252-.267a.47.47 0 01.104-.494l.707.707zm-.56-.928a1.16 1.16 0 00-.175.019.67.67 0 00-.114.032.548.548 0 00-.192.123.513.513 0 00.014.743.68.68 0 00.216.132l.37-.928c-.019-.008.038.01.1.069a.487.487 0 01-.15.794c-.027.01-.047.015-.052.016-.01.002-.005 0 .024-.001l-.042-1zm2.133 1.17c.099.377.426.594.676.683.235.084.668.146.978-.164l-.707-.707a.193.193 0 01.11-.06l-.009-.001a.228.228 0 01-.097-.044c-.011-.01.006 0 .016.04l-.967.253zm1.654.52a.695.695 0 00.15-.216.544.544 0 00-.372-.749.832.832 0 00-.218-.027v1c.013 0-.007.002-.045-.008a.457.457 0 01-.284-.61.366.366 0 01.043-.075c.01-.014.017-.021.019-.023l.707.707zm-.591-.235c-.007.093-.01.19 0 .277a.71.71 0 00.039.176.523.523 0 00.81.242.633.633 0 00.147-.16c.05-.078.09-.17.123-.253l-.934-.358c-.024.062-.034.075-.026.063.002-.002.03-.046.088-.091a.477.477 0 01.474-.054c.187.08.246.237.254.261a.355.355 0 01.019.072v-.024c0-.019 0-.044.003-.076l-.997-.075zm-1.033 1.47a.756.756 0 00-.449-.319 1.551 1.551 0 00-.418-.05 3.98 3.98 0 00-.891.122 4.902 4.902 0 00-.893.305c-.249.116-.542.286-.712.528l.818.575c-.002.003.016-.02.078-.064.058-.04.138-.085.238-.132.2-.093.452-.178.706-.24.256-.062.49-.093.658-.094a.61.61 0 01.144.012c.025.008-.062-.008-.13-.118l.85-.526zm-3.363.586l.005-.007a.293.293 0 01.018-.02.486.486 0 01.666-.016c.134.12.153.265.156.286.01.07-.002.115.003.088a.835.835 0 01.018-.074l-.962-.273a1.782 1.782 0 00-.041.172.732.732 0 00-.008.23.51.51 0 00.714.402.558.558 0 00.18-.127.763.763 0 00.07-.086l-.819-.575zm.866.257c.02-.069.036-.14.046-.208a.724.724 0 00-.01-.284.53.53 0 00-.47-.405.606.606 0 00-.372.095l.526.85a.437.437 0 01-.246.05.469.469 0 01-.406-.341c-.02-.08-.008-.131-.011-.11a.72.72 0 01-.02.08l.963.273zm-.806-.802a.86.86 0 00-.272.273.768.768 0 00-.122.403h1c0 .046-.01.079-.015.095a.163.163 0 01-.016.034.143.143 0 01-.05.046l-.525-.851zm-.394.676a.361.361 0 01.023-.127c.006-.012.008-.014.002-.006a.232.232 0 01-.051.052l.59.807c.107-.078.202-.176.274-.277a.793.793 0 00.162-.45h-1zm-.027-.081c-.146.107-.324.279-.36.572-.026.218.04.447.099.635l.954-.298a1.964 1.964 0 01-.054-.198c-.008-.043-.003-.042-.006-.018a.23.23 0 01-.043.107c-.017.025-.028.028 0 .007l-.59-.807zm-.261 1.207c.074.238.19.752.25 1.128l.987-.16c-.065-.406-.19-.969-.283-1.266l-.954.298zm.25 1.128c.027.166.053.318.084.443.03.12.08.276.19.41.125.153.281.226.423.263.121.032.258.044.37.053l.08-.997a1.439 1.439 0 01-.196-.023s.053.016.098.072c.03.037.024.054.005-.023a4.694 4.694 0 01-.067-.358l-.987.16zm1.066 1.169c.09.007.175.011.25.01.062 0 .16-.003.255-.03a.563.563 0 00.24-.14.519.519 0 00.14-.488.553.553 0 00-.147-.261.746.746 0 00-.114-.094l-.556.831-.01-.008a.448.448 0 01-.145-.239.48.48 0 01.128-.45c.083-.082.168-.107.186-.112.044-.013.063-.008.017-.008-.035 0-.088-.002-.164-.008l-.08.997zm.623-1.003c-.003-.002.009.005.026.021a.405.405 0 01.087.127.464.464 0 01-.13.547c-.066.052-.118.058-.08.048a1.32 1.32 0 01.138-.025l-.146-.99a2.26 2.26 0 00-.247.049.779.779 0 00-.283.132.536.536 0 00-.164.649c.071.159.203.246.244.274l.555-.832zm.04.718c.084-.012.134-.017.162-.019h-.001c-.008-.001-.055-.005-.116-.032a.464.464 0 01-.256-.555c.016-.053.037-.085.04-.088.004-.008.004-.007-.004.004l.769.639c.03-.037.112-.135.152-.264a.536.536 0 00-.297-.65c-.14-.063-.285-.055-.336-.053a2.755 2.755 0 00-.258.029l.145.989zm-.176-.69a.994.994 0 00-.124.184.568.568 0 00-.028.467c.094.238.305.31.382.33a.908.908 0 00.23.026v-1c-.032 0-.014-.003.025.007.028.008.21.06.292.268.076.192-.003.342-.008.352-.014.027-.022.032 0 .005l-.769-.64zm.46 1.007c.12 0 .25-.022.368-.074a.675.675 0 00.203-.137.567.567 0 00.167-.353l-.997-.085a.434.434 0 01.124-.27.327.327 0 01.097-.069c.032-.014.044-.012.038-.012v1zm.738-.564c.004-.055.028-.305.053-.56l-.995-.098c-.025.252-.05.51-.055.573l.997.085zm.053-.56c.015-.15.017-.314-.013-.454a.655.655 0 00-.148-.306.535.535 0 00-.68-.096l.527.85a.465.465 0 01-.664-.202.241.241 0 01-.013-.04c0-.001.006.048-.004.15l.995.098zm-.84-.857a.447.447 0 01.395-.033.418.418 0 01.213.178c.039.068.03.102.03.062h-1c0 .122.018.287.102.434a.583.583 0 00.293.258c.186.072.366.03.492-.047l-.525-.852zm.637.207c0-.007.001.006-.011.027a.147.147 0 01-.064.056.148.148 0 01-.085.014c-.025-.004-.034-.013-.03-.01l.639-.77a.887.887 0 00-.95-.138.889.889 0 00-.499.82h1zm-.19.088l.017.014s-.009-.009-.02-.026a.302.302 0 01-.05-.165c0-.049.012-.07.002-.044-.01.026-.029.069-.068.144l.888.46a2.37 2.37 0 00.116-.252.879.879 0 00.062-.318c-.003-.31-.2-.493-.308-.583l-.639.77zm-.119-.077c-.07.136-.126.282-.157.417a1.085 1.085 0 00-.03.226.642.642 0 00.09.35l.85-.527a.406.406 0 01.06.193c0 .013-.002.008.004-.015a.842.842 0 01.07-.184l-.887-.46zm-.097.992a.391.391 0 01-.061-.236c.003-.035.01-.053.01-.05a.267.267 0 01-.046.066l.741.671c.098-.108.18-.235.233-.365a.833.833 0 00.058-.239.61.61 0 00-.085-.373l-.85.526zm-.097-.22c.006-.007-.05.045-.245.08-.174.033-.39.04-.603.019a1.645 1.645 0 01-.5-.116c-.152-.07.003-.055.003.138h-1c0 .449.38.678.577.77.242.112.54.176.823.203.288.028.6.022.88-.03.26-.048.588-.151.806-.393l-.74-.671zm-1.345.121a1.54 1.54 0 00-.065-.378 3.776 3.776 0 00-.132-.388l-.927.373a2.787 2.787 0 01.121.388c.006.032.003.03.003.005h1zm-.197-.766a1.839 1.839 0 01-.08-.357 3.268 3.268 0 01-.037-.49l-1-.012c-.002.207.017.439.048.648.03.202.076.42.142.584l.927-.373zm-.117-.847l.008-.64-1-.011-.008.64 1 .01zm-.987-.721l-.118.775.988.151.119-.774-.989-.152zm-.118.775c-.09.59-.111 1.027.167 1.424l.819-.574c-.03-.041-.089-.107.002-.699l-.988-.151zm.167 1.424a1.163 1.163 0 01.117.218l-.002-.01a.324.324 0 01-.005-.064l1 .004a.769.769 0 00-.04-.232 1.435 1.435 0 00-.065-.167 2.162 2.162 0 00-.186-.323l-.82.574zm.11.144c0-.017-.003-.173.124-.313a.49.49 0 01.51-.137c.083.027.134.07.14.075.016.013.023.021.021.02a1.362 1.362 0 01-.12-.179l-.86.512c.077.127.16.25.24.338a.816.816 0 00.082.08.574.574 0 00.188.105.513.513 0 00.675-.497l-1-.004zm.675-.534c-.105-.176-.173-.44-.155-.934l-1-.036c-.02.583.05 1.07.296 1.482l.859-.512zm-.155-.933c.014-.393.092-.802.17-1.047.02-.06.036-.1.047-.122.017-.035.007 0-.044.046a.464.464 0 01-.589.014.403.403 0 01-.116-.143c-.01-.024-.013-.037-.011-.03l.973-.23a.847.847 0 00-.055-.163.597.597 0 00-.168-.216.536.536 0 00-.424-.11.563.563 0 00-.287.143.843.843 0 00-.181.258 2.004 2.004 0 00-.096.247c-.11.338-.2.84-.218 1.316l.999.037zm-.543-1.282c.014.062.037.148.08.23.04.08.136.232.334.3.2.067.37.005.451-.035.084-.04.154-.095.202-.135l-.637-.77c-.032.026-.028.019-.002.005a.412.412 0 01.309-.012.41.41 0 01.234.195c.013.026.012.033.002-.007l-.973.23zm1.068.36c.106-.088.193-.197.255-.304a.87.87 0 00.127-.427h-1a.294.294 0 01.01-.08l-.002.004a.197.197 0 01-.029.037l.639.77zm.382-.731c0 .11-.04.188-.063.225a.298.298 0 01-.05.063c-.01.009-.004 0 .035-.02a1.6 1.6 0 01.34-.123l-.245-.97a2.58 2.58 0 00-.564.21 1.177 1.177 0 00-.24.163.617.617 0 00-.213.452h1zm.261.145c.2-.05.393-.117.546-.19a1.25 1.25 0 00.23-.139.701.701 0 00.131-.132.555.555 0 00.11-.33h-1c0-.14.061-.232.086-.265.027-.037.052-.056.056-.06.008-.006-.003.004-.045.024-.08.038-.206.084-.358.122l.244.97zm1.018-.791a.567.567 0 00-.181-.422.573.573 0 00-.413-.146 1.041 1.041 0 00-.434.139l.472.881a.542.542 0 01.062-.03c.012-.004-.013.007-.061.01a.427.427 0 01-.301-.116.434.434 0 01-.144-.316h1zm-1.028-.43a.42.42 0 01-.118.043l-.023.003.024.002a.32.32 0 01.067.018l-.353.935c.184.07.376.043.48.022.13-.026.269-.074.395-.14l-.472-.883zm-.05.066c.028.01.184.073.252.266a.453.453 0 01-.063.426.337.337 0 01-.07.068c-.002 0 .008-.006.033-.015l-.367-.93a.905.905 0 00-.388.266.548.548 0 00-.088.518.563.563 0 00.339.336l.352-.935zm.152.745l.007-.003a2.586 2.586 0 01.329-.047 6.1 6.1 0 01.63-.008c.225.007.44.025.614.05.2.03.27.06.26.054l.496-.868c-.174-.1-.419-.147-.611-.175a6.737 6.737 0 00-.724-.06 7.157 7.157 0 00-.738.01c-.21.015-.45.046-.63.116l.367.93zm.62.208c.122.032.258.043.374.043.117 0 .253-.011.376-.043l-.253-.968a.571.571 0 01-.123.01.571.571 0 01-.122-.01l-.253.968zm.589-.177a.79.79 0 00.329.287.9.9 0 00.389.092v-1c.018 0 .03.003.034.004l.014.005a.13.13 0 01.025.016c.011.01.035.031.06.07l-.851.526zm.718.38a.246.246 0 01-.14-.048.377.377 0 01-.155-.31h1a.624.624 0 00-.276-.512.755.755 0 00-.43-.13v1zm.334-1.075a5.02 5.02 0 00-.3-.128 1.037 1.037 0 00-.299-.073.554.554 0 00-.345.094.526.526 0 00-.228.45.613.613 0 00.055.231c.02.047.045.088.065.121l.85-.526c-.008-.013-.006-.011 0 0 .001.004.028.06.03.146a.474.474 0 01-.481.483c-.053-.003-.069-.016 0 .01.054.02.13.053.239.102l.414-.91zm-2.472.3a2.112 2.112 0 00-.47.2.72.72 0 00-.24.23.532.532 0 00.175.733l.526-.852a.468.468 0 01.08.728l-.014.011c.025-.015.104-.054.239-.095l-.296-.956zm-.535 1.162c.178.11.37.109.486.094a.968.968 0 00.392-.14l-.535-.845a.035.035 0 01.018-.007.163.163 0 01.041.001.32.32 0 01.124.047l-.526.85zm1.956-.746c0-.026 0-.079-.01-.138a.581.581 0 00-.114-.263.595.595 0 00-.528-.214 1.828 1.828 0 00-.325.066c-.116.032-.262.076-.444.132l.296.956c.183-.057.315-.097.413-.124.107-.03.14-.034.138-.033-.002 0-.045.004-.105-.012a.44.44 0 01-.317-.342c-.005-.027-.004-.044-.004-.028h1zm3.417.299c-.004.152.014.307.053.444.019.068.046.143.086.216a.666.666 0 00.23.248l.525-.85a.381.381 0 01.121.12c.007.012.005.012 0-.005a.578.578 0 01-.016-.148l-1-.025zm-3.216-.384a.178.178 0 01.02-.007h.004a.09.09 0 01-.028 0h.004a.17.17 0 01.02.007l-.375.927c.126.05.258.066.365.066.106 0 .239-.015.365-.066l-.375-.927zm1.642 1.363c0 .141.03.28.077.401.041.102.128.273.302.38l.526-.85a.345.345 0 01.09.082c.01.013.012.02.01.017a.09.09 0 01-.005-.03h-1zm.38.781a.18.18 0 01-.063-.058.188.188 0 01-.018-.04.305.305 0 01-.015-.097h1a.749.749 0 00-.116-.39.823.823 0 00-.263-.265l-.526.85zm-.096-.195c0-.003-.002-.08.051-.175a.453.453 0 01.383-.23c.124-.003.204.045.217.053.022.014.029.022.02.014a1.285 1.285 0 01-.218-.357l-.917.4c.115.263.274.513.435.67a.9.9 0 00.162.129.606.606 0 00.33.091.543.543 0 00.459-.277.642.642 0 00.078-.318h-1zm.453-.695l-.194-.445-.917.4.194.444.917-.4zm-1.152-.252l-.006.415 1 .013.006-.415-1-.013zm.807.856a.59.59 0 00-.457.234 1.049 1.049 0 00-.136.234 2.288 2.288 0 00-.147.517l.986.167c.02-.126.052-.227.077-.285.014-.031.017-.029.002-.01a.34.34 0 01-.075.068.442.442 0 01-.25.075v-1zm-.74.985c-.021.123-.053.222-.078.278-.014.03-.017.027 0 .008a.335.335 0 01.074-.064.434.434 0 01.23-.068l.012 1a.6.6 0 00.447-.223c.065-.077.112-.164.146-.237.07-.151.123-.337.155-.527l-.986-.167zm.224.154a.579.579 0 00-.344.114.522.522 0 00-.178.59.615.615 0 00.161.243.981.981 0 00.146.113l.541-.84c-.013-.01-.01-.009.003.003.002.002.06.054.095.155a.47.47 0 01-.163.532c-.123.093-.243.09-.247.09l-.014-1zm-.215 1.06l.014.01a.353.353 0 01-.11-.274c.003-.028.008-.044.008-.045 0 0-.002.008-.011.028a2.751 2.751 0 01-.106.2l.87.492c.057-.1.109-.195.148-.281a.957.957 0 00.09-.326.645.645 0 00-.13-.438.882.882 0 00-.232-.207l-.541.84zm-.205-.081a3.1 3.1 0 00-.193.401 1.217 1.217 0 00-.06.2.66.66 0 00-.012.155.53.53 0 00.154.352l.705-.71a.48.48 0 01.14.31c.002.047-.004.078-.005.082-.002.011-.001.002.012-.032.024-.063.07-.159.13-.266l-.87-.492zm-.112 1.107c.193.193.43.157.533.123a.601.601 0 00.188-.106c.064-.053.12-.117.159-.165a4.646 4.646 0 00.493-.794c.031-.065.062-.135.085-.204a.898.898 0 00.033-.123c.007-.04.02-.12.002-.216l-.984.174c-.014-.077-.003-.132-.002-.14.003-.015.006-.021.003-.014a.903.903 0 01-.038.09 3.661 3.661 0 01-.37.598c-.027.034-.031.034-.014.02.004-.003.05-.042.126-.068a.486.486 0 01.493.118l-.707.707zm1.493-1.485c.004.022.003.023 0-.022a11.076 11.076 0 01.003-.536l-.999-.03c-.005.154-.007.309-.006.435 0 .103.003.243.018.327l.984-.174zm.004-.558c.002-.079.007-.137.013-.178.006-.044.01-.05.004-.033a.431.431 0 01-.603.179l.525-.851a.57.57 0 00-.555-.032.62.62 0 00-.296.333c-.065.163-.082.368-.088.551l1 .031zm-.586-.032a.275.275 0 01-.114-.125c-.004-.01.003.003.006.05.005.093-.008.241-.05.427-.083.375-.256.785-.452 1.041l.795.608c.307-.402.528-.957.634-1.43a2.62 2.62 0 00.07-.706 1.171 1.171 0 00-.07-.352.731.731 0 00-.294-.364l-.525.85zm-.61 1.394c-.118.155-.222.27-.288.332-.039.037-.039.03-.008.013.007-.003.088-.05.21-.046a.479.479 0 01.44.314l-.94.344a.52.52 0 00.477.341c.14.004.246-.05.282-.07a1.08 1.08 0 00.223-.166 3.86 3.86 0 00.4-.456l-.796-.606zm.353.613a.675.675 0 00-.354-.376.866.866 0 00-.365-.078.79.79 0 00-.386.097.607.607 0 00-.314.53h1c0 .08-.025.16-.07.225a.37.37 0 01-.122.115c-.06.033-.1.033-.106.033-.008 0-.029-.001-.06-.016a.327.327 0 01-.162-.186l.94-.344zm-1.42.173c0 .208.106.362.177.444.082.092.19.172.314.221l.375-.927a.16.16 0 01.062.045c.01.01.025.03.039.06.014.03.034.084.034.157h-1zm.491.666c.018.007.01.005-.012-.008a.477.477 0 01-.202-.306.49.49 0 01.305-.547c.055-.02.093-.02.077-.019l.07.998a.72.72 0 00.193-.038.51.51 0 00.193-.852.597.597 0 00-.107-.085.93.93 0 00-.143-.07l-.374.927zm.169-.88a.357.357 0 01.098.006l.02.005a1.296 1.296 0 01-.254-.17l-.656.755c.117.1.246.192.368.26.06.035.127.068.195.093a.72.72 0 00.297.049l-.068-.998zm-.135-.159l-.336-.292-.656.755.336.292.656-.755zm-.797.568l.32.088.266-.964-.32-.088-.266.964zm.32.088c.132.036.297.062.46.029a.633.633 0 00.307-.152.571.571 0 00.186-.423h-1c0-.118.05-.233.137-.313a.369.369 0 01.175-.093c.05-.01.056.003 0-.012l-.265.964zm.953-.546a.647.647 0 00-.643-.651v1a.353.353 0 01-.357-.349h1zm-.643-.651c.036 0 .121.004.216.057a.475.475 0 01.23.517.352.352 0 01-.028.078c-.012.023-.004.002.057-.059.119-.117.26-.214.318-.236l-.358-.934c-.247.095-.505.303-.664.46a1.324 1.324 0 00-.24.307.65.65 0 00-.055.142.525.525 0 00.254.6c.108.06.211.068.27.068v-1zm.793.357a.84.84 0 00.424-.384c.08-.147.13-.325.127-.51l-1 .022v-.002l-.001.004-.001.001.003-.004a.232.232 0 01.09-.061l.358.934zm.55-.893a5.07 5.07 0 01.116-.823l-.977-.212c-.076.348-.143.817-.138 1.056l1-.02zm.116-.823c.05-.23.088-.452.075-.638a.762.762 0 00-.108-.353.655.655 0 00-.324-.266l-.36.934a.354.354 0 01-.166-.139c-.038-.064-.04-.112-.04-.106.001.006.002.034-.007.1a3.377 3.377 0 01-.047.257l.977.21zm-.357-1.257a.349.349 0 01.165.128c.02.03.022.046.02.036a.607.607 0 01-.005-.185l-.996-.093c-.016.178-.01.363.033.528.034.134.134.408.424.52l.359-.934zm.18-.02c.016-.171.01-.35-.015-.508a1.172 1.172 0 00-.175-.495l-.814.58c-.024-.033-.026-.05-.018-.026a1.163 1.163 0 01.027.355l.995.093zm-.19-1.002a1.711 1.711 0 00-.097-.127.522.522 0 00-.26-.174.505.505 0 00-.651.512.672.672 0 00.016.12c.011.05.028.105.044.154l.953-.305a2.133 2.133 0 01-.016-.051l-.005-.018.002.014a.468.468 0 01-.008.173.493.493 0 01-.816.245l-.013-.014c-.002-.001.008.01.036.05l.815-.58zm-.948.485c.023.07.005.054.015-.01a.395.395 0 01.1-.202.434.434 0 01.29-.142.362.362 0 01.168.026c.024.01.033.019.027.014a.642.642 0 01-.102-.113l-.8.6c.088.117.185.222.289.303a.725.725 0 00.485.168.566.566 0 00.384-.185.606.606 0 00.147-.316.992.992 0 00-.05-.448l-.953.305zm.499-.427l-.256-.34-.8.6.255.34.8-.6zm-.656.46h.433v-1H6.02v1zm.433 0c.168 0 .345-.025.5-.088.106-.043.428-.201.438-.577l-1-.026A.398.398 0 016.504 38a.285.285 0 01.071-.051c.003-.001-.007.003-.031.007a.563.563 0 01-.092.007v1zm.938-.666a.421.421 0 01-.062.205.469.469 0 01-.337.222.432.432 0 01-.275-.053c-.003-.002.01.008.041.039a2.164 2.164 0 01.292.4c.024.046.04.08.048.102.01.029-.001.01-.001-.04h1a.899.899 0 00-.061-.308 1.79 1.79 0 00-.11-.236 3.16 3.16 0 00-.288-.428 1.833 1.833 0 00-.346-.348.736.736 0 00-.144-.08.568.568 0 00-.294-.038.53.53 0 00-.383.254.58.58 0 00-.08.285l1 .024zm.989.286c.045.073.1.143.162.201.03.03.072.064.124.095a.561.561 0 00.29.084v-1a.46.46 0 01.227.06.27.27 0 01.046.034c.007.007.005.006.001 0l-.85.526zm.576.38c.173 0 .3-.083.37-.151a.595.595 0 00.131-.19.754.754 0 00.061-.301h-1a.25.25 0 01.024-.102.405.405 0 01.091-.128.465.465 0 01.323-.128v1zm-8.743.727c.013.335.076.799.155 1.052l.954-.297a4.04 4.04 0 01-.11-.794l-.999.038zm.865.573a2.663 2.663 0 00-.047-.174.683.683 0 00-.052-.124.522.522 0 00-.36-.258.504.504 0 00-.32.051c-.156.082-.215.216-.227.241a.563.563 0 00-.035.105.856.856 0 00-.017.105c-.005.052-.01.12-.013.191l.999.05c.004-.073.006-.115.009-.137.001-.013 0-.002-.004.019a.437.437 0 01-.028.08c-.009.02-.065.15-.218.23a.497.497 0 01-.538-.048c-.077-.061-.115-.13-.122-.143-.022-.04-.03-.069-.026-.058l.026.105.973-.235zm-1.07.137c-.008.151.014.315.046.456.032.14.083.297.154.43l.882-.471a.803.803 0 01-.06-.181.776.776 0 01-.024-.183l-.999-.05zm.2.887c.03.055.043.083.047.094.002.005-.003-.006-.008-.027a.417.417 0 01-.004-.16.475.475 0 01.469-.397c.074.001.117.023.078.009l-.354.935c.04.015.141.054.257.056a.526.526 0 00.538-.445c.015-.1 0-.182-.01-.224a.822.822 0 00-.039-.121 2.033 2.033 0 00-.092-.192l-.882.472zm.582-.481a.61.61 0 00-.494.02.646.646 0 00-.304.342c-.071.177-.091.411-.102.634l1 .046a2.8 2.8 0 01.019-.243c.008-.061.015-.074.01-.061-.003.007-.044.11-.173.175a.392.392 0 01-.31.022l.354-.935zm-.9.995c-.009.2-.004.394.026.547a.744.744 0 00.13.31.536.536 0 00.712.133l-.524-.85a.464.464 0 01.606.108c.06.077.064.14.057.106a1.515 1.515 0 01-.008-.307l-.999-.046zm.87.99a.66.66 0 00.23-.254c.038-.071.065-.146.084-.213.038-.135.058-.29.058-.443h-1c0 .068-.01.132-.021.173-.006.02-.009.023-.003.012a.39.39 0 01.125-.125l.526.85zm.372-.91c0 .002 0-.007.005-.028a.857.857 0 01.107-.241c.038-.059.047-.053.01-.028a.394.394 0 01-.244.057.439.439 0 01-.346-.215l.867-.498a.561.561 0 00-.445-.284.608.608 0 00-.376.1 1.095 1.095 0 00-.3.317c-.131.197-.278.515-.278.82h1zm-.468-.454c.168.29.234.422.252.474.004.009-.002-.005-.006-.033a.414.414 0 01.023-.196.46.46 0 01.23-.256.417.417 0 01.181-.044v1a.585.585 0 00.258-.058.54.54 0 00.271-.301.588.588 0 00.027-.282.835.835 0 00-.041-.164c-.055-.156-.174-.371-.328-.64l-.867.5zm.68-.055c-.397 0-.643.34-.643.658h1a.35.35 0 01-.357.342v-1zm-.643.658c0 .244.143.457.365.55.19.08.378.05.51-.002l-.359-.933a.317.317 0 01.234.012.407.407 0 01.25.373h-1zm.875.549a.377.377 0 01-.175.023c-.006 0-.01-.002-.01-.002l.017.006a1.508 1.508 0 01.34.22l.649-.76a2.499 2.499 0 00-.499-.335 1.329 1.329 0 00-.267-.102.691.691 0 00-.413.016l.358.934zm.171.247c.147.126.304.243.442.331.069.044.14.086.209.12.046.022.165.079.304.084l.034-1c.058.002.096.016.1.017a1.077 1.077 0 01-.106-.062 3.199 3.199 0 01-.333-.25l-.65.76zm.954.535a.314.314 0 01-.062-.008l-.017-.005.008.003a.555.555 0 01.127.093l.706-.708a1.56 1.56 0 00-.308-.237.925.925 0 00-.419-.138l-.035 1zm.055.082a.93.93 0 00.36.236c.07.023.263.07.458-.049a.543.543 0 00.259-.469h-1c0-.066.023-.265.223-.386a.445.445 0 01.363-.048c.075.023.088.054.044.01l-.707.706zm1.077-.282c0 .172-.102.27-.152.305a.224.224 0 01-.127.043v-1a.778.778 0 00-.439.132.632.632 0 00-.282.52h1zm-.279.348c-.003 0-.122.002-.233-.116a.43.43 0 01-.116-.275.404.404 0 01.058-.23l.85.526a.596.596 0 00.091-.34.57.57 0 00-.155-.366.673.673 0 00-.495-.2v1zm-.291-.621a.548.548 0 00.038.642.66.66 0 00.32.207c.149.046.324.056.466.054.153-.002.321-.019.475-.054.124-.028.345-.09.503-.247l-.707-.707c.04-.04.068-.048.053-.041a.453.453 0 01-.07.02 1.366 1.366 0 01-.384.025c-.034-.003-.045-.007-.04-.005a.398.398 0 01.16.117.452.452 0 01.036.515l-.85-.526zm1.802.602c-.056.056-.107.071-.107.071-.006.002.004-.002.032-.004a.997.997 0 01.409.061c.015.008-.005.001-.036-.029a.398.398 0 01-.114-.285h1a.603.603 0 00-.189-.432.864.864 0 00-.235-.158 1.989 1.989 0 00-.917-.153c-.078.006-.165.02-.251.047a.728.728 0 00-.299.175l.707.707zm.184-.186c0 .312.231.477.334.533.128.07.272.1.405.103l.02-1 .011.002a.175.175 0 01.043.017c.019.01.059.035.098.085.042.053.09.142.09.26h-1zm.74.636l-.02-.002a.47.47 0 01-.37-.337.468.468 0 01.113-.452.205.205 0 01.017-.014c0-.001-.02.014-.073.041-.049.025-.11.055-.183.086a4.472 4.472 0 01-.475.17c-.17.05-.28.069-.32.069l.01 1c.187-.002.407-.055.592-.11.198-.057.406-.133.585-.21.164-.07.352-.16.475-.255a.694.694 0 00.133-.133.532.532 0 00.09-.461.53.53 0 00-.35-.36.71.71 0 00-.206-.032l-.019 1zm-1.312-.439c-.25.003-.707.027-1.026.053l.082.997c.303-.025.736-.047.956-.05l-.012-1zm-1.026.053a3.524 3.524 0 01-.915-.075 1.536 1.536 0 01-.288-.083c-.029-.014.01-.002.06.052a.457.457 0 01.043.534l-.852-.526a.543.543 0 00.067.663.81.81 0 00.26.183c.143.067.325.117.502.155a4.5 4.5 0 001.205.094l-.082-.997zm-1.101.428a.626.626 0 00.078-.44.93.93 0 00-.095-.268 2.209 2.209 0 00-.667-.717c-.115-.077-.314-.19-.543-.19v1c-.051 0-.076-.013-.066-.009a.369.369 0 01.056.032 1.216 1.216 0 01.335.348c.01.02.001.01-.004-.023a.376.376 0 01.056-.26l.85.527zm-1.227-1.615c-.041 0-.03-.004.005.006a.384.384 0 01.214.17c.061.101.055.188.055.196-.001.01-.001-.004.014-.056l-.963-.271c-.02.074-.043.165-.05.258a.617.617 0 00.448.662c.104.03.206.035.277.035v-1zm.288.316c.018-.065.035-.13.046-.184a.58.58 0 00.013-.207.507.507 0 00-.719-.411c-.099.044-.161.112-.174.126a1.307 1.307 0 00-.116.147l.819.573c.029-.041.033-.043.02-.03a.456.456 0 01-.134.093.49.49 0 01-.633-.21.479.479 0 01-.06-.25c.002-.022.005-.034.003-.026-.003.015-.01.047-.028.108l.963.27zm-.95-.53c-.03.044-.02.02.021-.013a.478.478 0 01.649.07c.064.075.084.148.087.16.006.021.006.032.005.023a1.496 1.496 0 01-.004-.133l-1 .006c0 .082.002.164.01.236.004.035.011.083.025.132.01.041.04.135.116.224a.522.522 0 00.451.182c.15-.016.251-.091.29-.122a.932.932 0 00.169-.19l-.82-.574zm.758.107a.53.53 0 01.005-.077c.003-.022.006-.032.006-.032s-.002.007-.008.017a.299.299 0 01-.035.053.431.431 0 01-.333.151v-1a.57.57 0 00-.439.213.769.769 0 00-.13.238 1.356 1.356 0 00-.066.443l1-.006zm-.365.112a.567.567 0 00.558-.445.766.766 0 00-.038-.453l-.933.358a.151.151 0 01-.008-.036.304.304 0 01.008-.107.433.433 0 01.413-.317v1zm.52-.898a1.225 1.225 0 00-.07-.153.685.685 0 00-.149-.19.544.544 0 00-.794.082 1.074 1.074 0 00-.166.342c-.035.11-.069.245-.104.4l.976.22c.033-.145.06-.248.081-.318a.66.66 0 01.023-.061c.005-.012-.003.008-.028.04a.456.456 0 01-.698-.008.228.228 0 01-.016-.024l.012.028.934-.358zm-1.283.481c-.047.21-.091.452-.03.693.065.26.229.437.375.575l.685-.73c-.115-.107-.098-.118-.09-.088.002.01-.002.004.001-.033.003-.04.013-.1.035-.197l-.976-.22zm.345 1.267c.118.111.256.21.388.281.11.06.295.148.49.148v-1c.048 0 .07.01.053.005a.945.945 0 01-.247-.162l-.684.728zm.877.429a.285.285 0 01-.12-.025.168.168 0 01-.045-.03.072.072 0 01-.022-.037l.968-.253a.929.929 0 00-.257-.435.768.768 0 00-.524-.22v1zm-.187-.092c.007.028.003.021.002-.006 0-.014-.003-.139.098-.263a.444.444 0 01.376-.162c.066.005.1.026.082.017a1.7 1.7 0 01-.232-.16c-.127-.096-.288-.23-.491-.405l-.653.758c.209.18.387.327.535.441.142.109.28.205.405.266.059.028.154.069.268.079a.557.557 0 00.612-.59.983.983 0 00-.034-.228l-.968.253zm-.165-.979l-.58-.499-.652.758.58.5.652-.759zm-.406-.11l.021-1.04-1-.02-.021 1.04 1 .02zm.021-1.04c.03-1.424.05-2.162.081-2.5a1.18 1.18 0 01.017-.131c.002-.006-.003.018-.02.053a.479.479 0 01-.684.175c-.07-.046-.105-.097-.109-.102-.012-.017-.009-.018.013.03l.91-.416a1.208 1.208 0 00-.105-.19.599.599 0 00-.156-.154.521.521 0 00-.766.213.744.744 0 00-.055.157 2 2 0 00-.04.27c-.037.386-.057 1.173-.086 2.575l1 .02zm-.702-2.475c.052.115.128.46.139.734l1-.038c-.014-.35-.104-.837-.23-1.112l-.91.416zm6.312-.35c0 .354.288.642.642.642v-1c.198 0 .358.16.358.358h-1zm.642-.642a.642.642 0 00-.642.642h1c0 .198-.16.358-.358.358v-1zm-5.98.987a.645.645 0 00-.066-.124.511.511 0 00-.768-.103c-.09.08-.13.171-.144.206a.786.786 0 00-.049.208 1.664 1.664 0 00-.008.178h1c0-.036.001-.06.002-.07.003-.02.002.01-.018.058a.487.487 0 01-.84.088.356.356 0 01-.036-.067l.927-.374zm1.633.206c-.007.02.01-.038.07-.1a.486.486 0 01.794.15c.01.028.014.048.015.053.002.01 0 .005 0-.024l-1 .041c.002.054.007.115.019.175a.68.68 0 00.032.114.548.548 0 00.124.192.514.514 0 00.742-.014.68.68 0 00.133-.215l-.929-.372zm3.295 1.642c-.002-.054.008-.026-.018.04-.007.015-.069.179-.267.252a.47.47 0 01-.494-.104l.707-.708a.53.53 0 00-.875.188.922.922 0 00-.052.373l.999-.04zm3.686 1.114c.016-.04.018-.04.01-.025-.003.003-.029.05-.083.1a.49.49 0 01-.8-.252l.003.057.999-.044a1.559 1.559 0 00-.015-.17.653.653 0 00-.034-.13c-.008-.022-.073-.204-.277-.294a.51.51 0 00-.548.092.58.58 0 00-.112.142 1.206 1.206 0 00-.074.158l.931.366zm-.87-.12a.132.132 0 01.016-.077.142.142 0 01.027-.032.238.238 0 01.076-.045l.357.934a.808.808 0 00.397-.34.87.87 0 00.126-.484l-1 .044zm.118-.154a.862.862 0 00-.364.271.764.764 0 00-.17.467h1c0 .05-.01.087-.02.107a.178.178 0 01-.024.044.14.14 0 01-.063.045l-.359-.934zm-.534.738c0-.022.004-.034.008-.044a.192.192 0 01.023-.038.34.34 0 01.095-.085l.525.851a.723.723 0 00.275-.331.9.9 0 00.074-.353h-1zm.126-.167a.47.47 0 01.496.006c.136.087.174.209.176.215.012.034.003.027 0-.074a9.06 9.06 0 01.044-.94l-.996-.083c-.039.46-.056.818-.048 1.058.004.107.014.248.056.369.017.049.073.199.23.299.22.14.444.077.568 0l-.526-.85zm-.038-.594c.034.093.069.179.105.254a.973.973 0 00.154.237c.056.06.28.272.597.157a.556.556 0 00.255-.192.684.684 0 00.087-.16l-.93-.364a.323.323 0 01.042-.074.444.444 0 01.204-.15.448.448 0 01.48.105c.03.032.031.047.012.007a1.783 1.783 0 01-.065-.16l-.94.34zm-7.479.755c0 .112.037.198.051.23.019.042.04.077.057.103.033.051.073.101.109.144.075.089.169.187.262.277.092.09.194.18.285.252.045.036.096.073.148.105a.787.787 0 00.103.053.567.567 0 00.22.046v-1a.452.452 0 01.196.046l-.004-.002-.01-.007a2.947 2.947 0 01-.243-.212 2.93 2.93 0 01-.218-.234l-.01-.013.005.008a.324.324 0 01.033.08.458.458 0 01.016.123h-1zm1.235 1.21a.354.354 0 01-.109-.016l-.027-.01c-.003-.002-.007-.004-.017-.014l.708-.707a.94.94 0 00-.224-.164.723.723 0 00-.331-.09v1zm-.153-.04a.391.391 0 01-.091-.151.46.46 0 01.266-.572.343.343 0 01.12-.024v1a.659.659 0 00.231-.04.553.553 0 00.291-.248c.186-.334-.047-.61-.11-.672l-.707.707zm.295-.747a.698.698 0 00-.414.134.608.608 0 00-.252.488h1c0 .164-.092.27-.155.316a.302.302 0 01-.18.062v-1zm-.666.622c0 .269.181.42.283.477.099.056.2.076.263.084.137.018.288.007.427-.02l-.188-.982a.622.622 0 01-.08.01c-.023.002-.032 0-.029 0l.026.006a.342.342 0 01.075.032.452.452 0 01.223.393h-1zm.973.541l.38-.072-.188-.982-.38.072.188.982zM5.82 42.18a.596.596 0 00-.09.34.57.57 0 00.155.366c.159.169.369.199.494.199v-1c.004 0 .123-.003.234.115a.43.43 0 01.116.276.404.404 0 01-.058.23l-.85-.526zm.56.905a.238.238 0 01-.144-.051.353.353 0 01-.135-.284h1a.647.647 0 00-.266-.517.762.762 0 00-.456-.148v1zm-.279-.335c0 .052.005.111.02.174a.59.59 0 00.114.237.528.528 0 00.794.034l-.707-.707a.472.472 0 01.688.042c.06.072.078.14.083.164a.25.25 0 01.008.056h-1zm1.99.175a.475.475 0 01.133-.33c.023-.022.038-.03.033-.028a.436.436 0 01-.066.031l.358.934c.086-.033.172-.075.246-.121a.79.79 0 00.128-.1.525.525 0 00.167-.386h-1zm-3.104 1.002a1.06 1.06 0 00.432-.073.705.705 0 00.234-.154.577.577 0 00.169-.405h-1c0-.146.07-.247.118-.297a.298.298 0 01.097-.068c.022-.009.015-.002-.02-.003l-.03 1zm.835-.632a.887.887 0 00-.028-.227.585.585 0 00-.085-.185.512.512 0 00-.556-.202l.267.964a.49.49 0 01-.529-.187c-.045-.064-.06-.12-.063-.13-.008-.032-.006-.044-.006-.033h1zm-.408.924a.807.807 0 00.39-.101.799.799 0 00.298-.276l-.85-.526a.252.252 0 01.047-.057.151.151 0 01.058-.032.243.243 0 01.07-.008l-.013 1zm-.324.104a.92.92 0 00.23-.076c.027-.014.172-.087.247-.262a.511.511 0 00-.11-.566.588.588 0 00-.181-.121.926.926 0 00-.11-.04 2.627 2.627 0 00-.217-.052l-.2.98.132.03c.01.004.006.003-.007-.002-.002-.002-.063-.026-.125-.088a.481.481 0 01-.101-.534c.07-.165.204-.228.211-.232.048-.025.074-.026.024-.015l.207.978zm-1.791-1.1c-.124 0-.246.006-.347.02a.988.988 0 00-.173.038.593.593 0 00-.149.073.514.514 0 00-.225.423h1a.49.49 0 01-.208.401c-.052.035-.096.05-.104.052-.023.008-.029.007-.005.004a1.59 1.59 0 01.206-.01l.005-1zm9.56 31.056a25.792 25.792 0 01-.048.248l-.004.019.97.24c.01-.04.04-.19.065-.319l-.982-.188zm-.052.264a.489.489 0 01.437-.366c.08-.005.135.012.141.014.026.008.028.012.01.001l-.525.851c.063.04.142.08.226.105a.6.6 0 00.212.027c.085-.006.386-.06.469-.387l-.97-.245zm.588-.35c.021.012.068.046.108.11a.39.39 0 01.056.226.305.305 0 01-.03.12c-.007.013-.008.012.005-.004l-.769-.64a.814.814 0 00-.204.465.626.626 0 00.308.573l.526-.85zm.14.452c.052-.064.079-.092.087-.1.006-.005-.011.013-.047.033-.018.01-.152.09-.338.046a.476.476 0 01-.361-.4.284.284 0 01-.002-.034c0-.006 0 .016-.014.09l.982.188c.014-.078.03-.17.032-.255a.64.64 0 00-.028-.208.523.523 0 00-.772-.292.746.746 0 00-.134.101 2.125 2.125 0 00-.175.192l.77.639zm36.205 4.005c.045.072.1.142.163.2.03.03.072.065.123.096a.562.562 0 00.29.083v-1a.46.46 0 01.227.06.266.266 0 01.046.035c.007.006.005.005.002 0l-.85.526zm.576.379c.174 0 .3-.082.371-.151a.596.596 0 00.13-.19.755.755 0 00.062-.301h-1a.25.25 0 01.024-.102.408.408 0 01.09-.128.465.465 0 01.323-.128v1zm.563-.642a.647.647 0 00-.65-.642v1a.353.353 0 01-.35-.358h1zm-.65-.642a.58.58 0 00-.539.34.607.607 0 00.05.565l.85-.526c.021.033.097.179.015.364a.422.422 0 01-.377.257v-1zm.218 1.344c-.01-.004-.107-.042-.177-.16a.423.423 0 01-.036-.36c.02-.056.045-.078.029-.059a.963.963 0 01-.086.081l.655.756c.065-.056.127-.115.18-.176a.823.823 0 00.159-.252.577.577 0 00-.04-.5.626.626 0 00-.312-.258l-.372.928zm-.27-.498a1.742 1.742 0 00-.276.287.678.678 0 00-.063.107.549.549 0 00-.052.224.514.514 0 00.518.524.665.665 0 00.254-.054c.054-.022.108-.05.157-.08.1-.058.216-.138.34-.236l-.617-.786a2.067 2.067 0 01-.225.158l-.036.02a.4.4 0 01.133-.021.485.485 0 01.435.674.315.315 0 01-.028.047c-.005.008.02-.026.115-.108l-.655-.756zm.879.772c.074-.058.147-.117.206-.175a.751.751 0 00.196-.296.56.56 0 00-.148-.585.796.796 0 00-.267-.159l-.358.934c.014.005.014.006.006.002-.006-.003-.035-.019-.07-.052a.44.44 0 01-.113-.453.352.352 0 01.052-.101c.008-.012.011-.014.003-.005-.02.018-.056.05-.125.104l.618.786zm-.012-1.215a1.976 1.976 0 00-.378-.1.725.725 0 00-.18-.004l.117.993a.355.355 0 01-.058.002h-.012a1.01 1.01 0 01.152.044l.359-.935zm-.557-.104a.512.512 0 00-.301.887c.09.087.205.136.261.158l.372-.928c-.044-.018 0-.009.059.048a.49.49 0 01-.275.828l-.116-.993zm-7.424 2.04c-.005-.013 0-.003.005.024.001.01.02.121-.047.252a.473.473 0 01-.45.254c-.106-.008-.17-.05-.172-.051l.526-.851a.625.625 0 00-.282-.096.533.533 0 00-.565.637c.01.072.032.137.052.19l.933-.359zm6.957 1.876c.02.038.057.149.088.321.029.163.044.337.04.48l1 .022a3.56 3.56 0 00-.056-.676 2.236 2.236 0 00-.184-.608l-.888.46zm.129.801a6.888 6.888 0 01-.016.35c-.003.017 0-.018.022-.069a.491.491 0 01.809-.13.41.41 0 01.05.07c.014.024.009.021-.017-.06l-.952.306c.02.065.053.165.098.244a.52.52 0 00.331.263.509.509 0 00.602-.305.721.721 0 00.047-.175c.006-.043.01-.088.013-.132.006-.09.01-.204.013-.34l-1-.022zm.848.162a1.194 1.194 0 00-.11-.26.515.515 0 00-.929.084 1.118 1.118 0 00-.057.304 8.44 8.44 0 00-.018.362l1 .034a7.337 7.337 0 01.022-.383c.003-.018 0 .007-.014.046a.488.488 0 01-.852.083c-.023-.036-.02-.048.006.035l.952-.305zm-3.915 3.22a3.272 3.272 0 01-.436.089.762.762 0 01-.098.007c-.005 0 .01 0 .038.006a.46.46 0 01.21.12l-.707.706a.563.563 0 00.273.149.804.804 0 00.152.018c.081.003.169-.004.251-.013.168-.02.372-.061.577-.117l-.26-.965zm-.286.221c.04.04.149.17.127.373a.46.46 0 01-.212.342.34.34 0 01-.112.046c-.014.003-.019.002-.01.002v-1a.77.77 0 00-.405.102.54.54 0 00-.255.399.543.543 0 00.16.443l.707-.707zm-.208.763a.83.83 0 00.425-.113.621.621 0 00.312-.529h-1c0-.207.138-.307.173-.328a.175.175 0 01.09-.03v1zm.737-.642a.685.685 0 00-.096-.366.572.572 0 00-.498-.268.875.875 0 00-.316.072 2.82 2.82 0 00-.26.126l.472.881c.08-.043.132-.067.164-.08.043-.018.015 0-.05.001a.435.435 0 01-.36-.202.383.383 0 01-.052-.13c-.004-.024-.004-.037-.004-.034h1zm-1.17-.436c-.014.007-.118.043-.363-.027l-.277.96c.36.105.768.132 1.111-.052l-.471-.882zm-.363-.027l-.463-.134-.277.96.463.135.277-.961zm-.575.846l.427-.023-.053-.998-.427.022.053.999zm5.17-4.145c.165 0 .42-.074.538-.34a.607.607 0 00-.05-.565l-.85.526a.396.396 0 01-.015-.365.422.422 0 01.377-.256v1zm.488-.905a1.006 1.006 0 00-.163-.201.733.733 0 00-.123-.095.562.562 0 00-.29-.083v1a.456.456 0 01-.227-.061c-.028-.017-.043-.031-.046-.034-.007-.007-.005-.006-.002 0l.85-.526zm-.721 1.809c-.008.019.01-.038.07-.1a.487.487 0 01.794.15c.01.028.014.048.015.053.002.01 0 .005-.001-.024l-1 .041c.003.054.008.115.02.175a.548.548 0 00.156.306.514.514 0 00.741-.014.68.68 0 00.133-.216l-.928-.371zm.878.079c-.003-.054.008-.026-.018.04-.007.015-.069.178-.267.251a.47.47 0 01-.494-.103l.707-.708a.53.53 0 00-.875.188.924.924 0 00-.053.373l1-.041zm-.779.188a.38.38 0 01-.094-.15.248.248 0 01-.013-.068.11.11 0 01.008-.05l.928.372a.889.889 0 00.063-.363.67.67 0 00-.185-.449l-.707.708zM11.928 74.29a.93.93 0 00.233.123c.069.023.348.1.573-.125l-.707-.707a.463.463 0 01.296-.135.405.405 0 01.156.019c.04.013.052.026.023.006l-.574.82zm.43-.733a.53.53 0 00-.34.448.607.607 0 00.05.295c.045.106.117.207.18.287l.788-.615c-.053-.068-.057-.085-.049-.065.002.004.037.08.026.191a.468.468 0 01-.301.395l-.353-.936zm38.924 6.299a4.11 4.11 0 00-.053-.566.916.916 0 00-.082-.248.549.549 0 00-.485-.304v1a.467.467 0 01-.298-.107.419.419 0 01-.103-.126c-.021-.04-.021-.06-.014-.024.012.064.026.192.036.419l1-.044zm-.835-.749a.558.558 0 00.308.501.784.784 0 00.334.08l.037-1c-.033 0 .017-.005.09.033a.442.442 0 01.231.386h-1zm.673.581l.125-.003-.027-1-.124.003.026 1zM41.14.045l-.102-.995.102.995zm-2.337.218l.09.996-.09-.996zm-2.587 6.111l.999.061-.999-.06zm-.09 1.484l.217.977.735-.164.046-.751-.998-.062zm-1.153.257l-.217-.976.217.976zm-8.606 3.243l-.472-.882.472.882zm-1.34.718l-.72.695.526.543.666-.356-.472-.882zM22.6 9.565l-.72.694.72-.694zM19.96 7.06l-.03-1h-.001l.032 1zm-7.251 5.677l-.71-.704.71.704zM10.2 20.505l-.721.692.721-.692zm2.346 2.492l.754-.657-.754.657zm.452.517l.854.52.38-.626-.48-.551-.754.657zm-.574.944l.855.52-.855-.52zm-3.696 8.18l.955.297-.955-.296zm-.496 1.634l-.975-.221.975.221zm-3.426.053l-.026 1 .026-1zm-3.638.037l-.464-.885.464.886zm-.836 3.604l-.992-.126.992.126zM.196 48.477l-.993.12.993-.12zm6.794 2.436l.104-.994-.104.994zm.857.09l.99-.136-.106-.777-.78-.082-.104.995zm.08.59l-.99.135.99-.136zm3.25 8.883l-.885.466.886-.466zm.855 1.626l.69.723.546-.52-.35-.668-.886.465zm-1.046.998l-.69-.723.69.723zm4.616 13.95l.647-.763-.646.763zm2.732 1.68l-.354-.935.354.935zm4.974-4.499l.508.861-.508-.861zm1.785.844l-.51.86h.001l.509-.86zm3.3 1.715l-.412.91.411-.91zm5.698 2.02l.007-1-.007 1zm.188 3.471l1 .024-1-.024zm.091 3.705l-.807.59.807-.59zm3.856.867l.134-.991-.134.99zm12.274-.43l.707.708-.707-.707zm.284-3.709l1 .015-1-.015zm2.338-3.921l.24.97-.24-.97zm7.884-3.145l-.475-.88.475.88zm1.066-.575l.723-.692-.527-.55-.67.361.474.88zm.94.981l.723-.691-.722.691zm2.39 2.51l-.726.688.726-.688zm9.027-4.252l.71.704-.71-.704zm4.047-4.636l-.819-.574.82.574zm-.797-2.166l.717-.697-.717.697zm.253-1.258l-.114-.993.114.993zm14.305-2.002l-.14-.99.14.99zm14.925-2.109l.139.99-.139-.99zm-20.347-.218v1-1zm-21.767-.017v-1h-.407l-.291.283.698.717zm-1.259 1.226l.698.716-.698-.716zm-15.187 7.673l-.167-.985.167.986zm-8.741-.063l.18-.983-.18.984zm-12.437-5.485l-.616.788.616-.788zm-4.69-4.699l-.79.615.79-.615zm-5.572-12.93l.988-.154-.988.153zm-.06-7.744l-.99-.138.99.138zm4.099-11.148l-.84-.542.84.542zm8.24-8.264l.543.84-.543-.84zm10.775-4.122l.169.985-.169-.985zm8.385.004l-.168.985.168-.985zm14.915 7.387l-.69.723.69-.723zm1.128 1.078l-.691.722.289.277h.4l.002-1zm21.88.038l-.002 1 .002-1zm21.472-.061l.238-.971-.238.97zm-3.18-.466l.132-.992h-.001l-.131.992zm-19.488-2.707l.14-.99-.14.99zm-5.502-1.207l.804.595-.804-.595zm.06-.913l.88-.474-.88.474zm-3.216-4.268l.762-.648-.762.648zM68.959 8.35l-.02-1 .02 1zm-1.524 1.142l.685.728-.685-.728zm-2.521 2.354l-.68-.733.68.733zM63.6 13.064l-.533.847.65.41.563-.524-.68-.733zm-.677-.426l-.533.846.533-.846zm-8.7-3.941l.298-.955-.298.955zm-1.484-.463l-1-.011-.008.744.71.222.298-.955zm.032-2.822l1 .012-1-.012zm.108-3.39l.99.132-.99-.132zM51.542.73l.186-.983-.186.983zM41.39 18.02l-.096-.995.096.995zm-12.333 4.64l.577.817-.577-.817zm-5.971 5.967l.82.573-.82-.573zm-2.722 25.037l-.92.39.92-.39zm5.494 8.032l.708-.707-.708.707zm6.471 4.735l-.453.891.453-.89zm16.89 2.297l.201.98-.2-.98zm4.52-1.38l.707-.707-.707.707zm-.824.163l-.286-.959.286.959zm-5.096.734l.05.999-.05-.999zm-15.203-4.462l-.58.816.58-.816zm-5.462-5.263l-.796.605.796-.605zm-.02-29.86l.797.605-.796-.605zm5.482-5.289l-.58-.815.58.815zm20.02-3.795l.261-.966-.262.966zm-.472-.358l-.305.952.305-.952zM12.215 73.88l.683-.731-.051-.048-.058-.04-.574.819zm.427.398l.788-.615-.048-.062-.058-.054-.682.731zm38.14 5.599h-1v.022l.002.022.999-.044zm0-.681l-.026-1-.973.025v.975h1zm.325-.009l.037-1h-.062l.025 1zm.124-.003l.073.997-.073-.997zM41.038-.95c-.266.028-1.312.125-2.325.217l.18 1.991c1.01-.09 2.068-.19 2.349-.218l-.204-1.99zm-2.325.217c-.605.054-1.142.1-1.557.18-.413.08-.91.229-1.286.639-.377.41-.48.92-.523 1.338-.043.42-.04.958-.04 1.564h2c0-.66 0-1.068.03-1.36.03-.295.076-.266.007-.191-.068.074-.1.03.193-.027.29-.056.697-.092 1.356-.151l-.18-1.992zm-3.406 3.72c0 1.032-.04 2.535-.089 3.326l1.997.122a69.05 69.05 0 00.092-3.447h-2zm-.089 3.326l-.09 1.484 1.996.123.09-1.485-1.996-.122zm.69.57l-1.152.256.434 1.952 1.153-.256-.434-1.953zm-1.152.256c-2.723.605-6.225 1.926-8.86 3.337l.943 1.764c2.488-1.332 5.82-2.586 8.35-3.15l-.433-1.951zm-8.86 3.338l-1.341.717.944 1.764 1.34-.718-.944-1.763zm-.15.904L23.32 8.87l-1.439 1.39 2.426 2.51 1.439-1.389zM23.32 8.87a61.76 61.76 0 00-1.807-1.802 16.88 16.88 0 00-.628-.574 3.882 3.882 0 00-.249-.197 1.56 1.56 0 00-.163-.104 1.038 1.038 0 00-.543-.133l.063 2a.962.962 0 01-.474-.109c-.037-.02-.055-.034-.047-.028.012.009.049.037.115.093.129.11.315.28.55.502a59.764 59.764 0 011.744 1.741l1.439-1.39zm-3.39-2.81a1.56 1.56 0 00-.487.103 3.222 3.222 0 00-.358.162c-.231.12-.495.28-.773.463-.561.37-1.25.874-1.977 1.444-1.454 1.138-3.124 2.58-4.335 3.801l1.42 1.409c1.136-1.146 2.74-2.532 4.148-3.635a29.258 29.258 0 011.843-1.348c.25-.165.45-.284.592-.358.072-.037.115-.055.134-.062.033-.012-.028.017-.144.02L19.93 6.06zM12 12.033a48.768 48.768 0 00-3.161 3.493c-.412.51-.763.978-1.017 1.367-.125.193-.24.385-.325.564-.067.14-.19.414-.19.724h2c0 .174-.06.252-.007.142.034-.071.097-.183.198-.338.2-.308.505-.717.896-1.2a46.78 46.78 0 013.026-3.344L12 12.034zm-4.693 6.148c0 .35.158.638.243.78.106.178.25.37.412.57.33.403.827.946 1.518 1.666l1.443-1.385c-.687-.716-1.137-1.21-1.41-1.545a3.086 3.086 0 01-.245-.33c-.056-.094.039.02.039.244h-2zm2.173 3.016a131.053 131.053 0 012.314 2.458l1.507-1.315c-.267-.306-1.342-1.447-2.378-2.528L9.48 21.197zm2.314 2.458l.451.517 1.507-1.315-.451-.517-1.507 1.315zm.35-.66l-.573.943 1.709 1.04.573-.944-1.709-1.04zm-.573.943a37.592 37.592 0 00-3.797 8.404l1.91.593a35.588 35.588 0 013.596-7.958l-1.71-1.039zm-3.797 8.404c-.245.788-.487 1.58-.516 1.709l1.95.443c-.001.006.043-.147.141-.47.09-.294.208-.68.335-1.089l-1.91-.593zm-.516 1.71c.106-.468.482-.643.508-.656.09-.046.162-.062.172-.065.032-.007.031-.004-.03.001-.109.01-.297.02-.578.023-.556.009-1.39 0-2.496-.03l-.053 2c1.114.029 1.981.04 2.579.03.295-.004.546-.014.734-.031a2.26 2.26 0 00.31-.048 1.2 1.2 0 00.261-.094c.047-.023.435-.21.544-.689l-1.951-.441zm-2.424-.727a71.95 71.95 0 00-2.53-.028c-.33.004-.617.011-.836.023a4.819 4.819 0 00-.303.025c-.045.006-.101.014-.159.026-.034.007-.163.033-.301.106l.928 1.771a.897.897 0 01-.216.08l-.01.002a3.02 3.02 0 01.173-.013c.175-.01.427-.017.745-.02.635-.007 1.497.002 2.456.027l.053-2zm-4.13.152c-.609.32-.8.964-.919 1.475-.136.587-.267 1.497-.444 2.888l1.984.252c.18-1.414.3-2.218.409-2.688.126-.545.175-.3-.1-.156l-.93-1.771zM-.658 37.84c-.39 3.072-.458 8.088-.138 10.757l1.986-.239c-.298-2.481-.237-7.33.136-10.266l-1.984-.252zm-.138 10.757c.068.566.123 1.1.22 1.506.103.434.298.938.8 1.284.443.307.98.38 1.448.41.49.033 1.136.027 1.918.027v-2c-.833 0-1.382.005-1.786-.022-.426-.028-.48-.085-.443-.06.092.064.064.133.008-.101-.062-.263-.1-.63-.18-1.283l-1.985.239zm4.386 3.227c1.407 0 2.886.041 3.297.084l.207-1.99c-.531-.055-2.113-.094-3.504-.094v2zm3.297.084l.857.09.208-1.99-.857-.09-.208 1.99zm-.03-.77l.08.59 1.982-.271-.08-.59-1.982.272zm.08.59c.14 1.012.65 2.68 1.264 4.36.622 1.701 1.39 3.519 2.092 4.854l1.77-.93c-.646-1.23-1.38-2.96-1.984-4.611-.612-1.674-1.053-3.165-1.16-3.945l-1.981.272zm3.356 9.214l.855 1.625 1.77-.93-.854-1.626-1.77.93zm1.05.437l-1.046.998 1.381 1.446 1.046-.998-1.382-1.446zm-1.046.998c-1.74 1.66-2.746 2.63-3.316 3.22-.28.288-.49.521-.633.718-.136.186-.32.481-.32.872h2c0 .255-.125.389-.063.305a5.62 5.62 0 01.452-.504c.537-.554 1.51-1.493 3.261-3.165l-1.381-1.446zm4.66 15.437c.897.759 1.532 1.27 2.01 1.565.49.3 1.07.533 1.723.286l-.71-1.87c.23-.087.352.075.036-.12-.328-.201-.847-.61-1.766-1.388l-1.293 1.526zm3.732 1.851c.16-.06.295-.158.34-.19.074-.052.157-.116.242-.184.17-.138.384-.32.622-.529a57.446 57.446 0 001.704-1.572l-1.384-1.444a55.446 55.446 0 01-1.642 1.515c-.227.2-.415.36-.553.47-.07.056-.117.093-.147.114-.06.042-.002-.008.11-.05l.708 1.87zm2.908-2.475a161.48 161.48 0 011.613-1.526 43.698 43.698 0 01.667-.608c.066-.056.02-.01-.06.036L22.8 73.37c-.105.061-.207.151-.223.165l-.183.162c-.14.126-.328.298-.548.503-.44.41-1.02.957-1.634 1.546l1.384 1.444zm2.22-2.098a.938.938 0 01-.571.125c-.054-.007-.079-.017-.057-.01.038.012.123.045.263.112.274.129.664.339 1.133.616l1.018-1.721a16.718 16.718 0 00-1.296-.704 4.376 4.376 0 00-.501-.206 1.698 1.698 0 00-.298-.07c-.054-.007-.38-.057-.708.136l1.017 1.722zm.768.843c.914.541 2.431 1.33 3.397 1.766l.823-1.823a40.209 40.209 0 01-3.202-1.664l-1.018 1.721zm3.397 1.766c.903.408 2.235.923 3.395 1.334.582.207 1.131.39 1.572.525.22.067.422.124.591.166.136.033.35.083.545.084l.013-2c.073 0 .074.011-.08-.026a9.665 9.665 0 01-.486-.137 36.708 36.708 0 01-1.486-.497c-1.135-.402-2.41-.896-3.24-1.272l-.824 1.823zm6.103 2.11l-.02-.001a.842.842 0 01-.261-.06.874.874 0 01-.433-.377c-.062-.11-.072-.19-.069-.17.002.009.008.05.013.143.022.4.006 1.213-.034 2.911l2 .048c.038-1.647.058-2.568.031-3.067a3.235 3.235 0 00-.04-.385 1.45 1.45 0 00-.158-.46 1.127 1.127 0 00-.561-.497c-.213-.086-.406-.085-.454-.086l-.014 2zm-.804 2.446c-.031 1.304-.042 2.208-.027 2.813.008.3.022.553.048.756.013.101.031.212.061.32.026.096.08.265.2.43l1.616-1.18c.088.12.113.222.113.223.004.014 0 .004-.006-.047a5.88 5.88 0 01-.032-.551c-.014-.551-.005-1.41.026-2.716l-2-.048zm.283 4.32c.229.312.568.464.766.542.239.094.53.175.86.249.661.148 1.612.3 2.903.476l.268-1.982c-1.285-.174-2.161-.317-2.733-.446a4.133 4.133 0 01-.565-.158c-.142-.055-.013-.037.115.138l-1.614 1.18zm4.529 1.267c1.97.267 4.936.325 7.473.236 1.273-.045 2.464-.127 3.392-.244.46-.058.88-.127 1.218-.21.17-.042.34-.093.495-.156.134-.054.353-.155.537-.34l-1.414-1.414c.101-.1.18-.121.125-.099a1.761 1.761 0 01-.221.067 9.144 9.144 0 01-.99.168c-.846.106-1.973.186-3.212.229-2.489.087-5.326.026-7.135-.22l-.268 1.983zm13.115-.713c.213-.213.321-.462.383-.695.057-.214.087-.465.108-.744.044-.566.065-1.478.086-2.963l-2-.03c-.021 1.507-.042 2.35-.08 2.84a2.545 2.545 0 01-.047.385c-.004.013.024-.095.136-.208l1.414 1.415zm2.155-7.367c2.306-.572 5.673-1.918 8.118-3.236l-.949-1.76c-2.324 1.253-5.534 2.53-7.65 3.054l.481 1.942zm8.118-3.236l1.067-.575-.949-1.76-1.067.575.95 1.76zm-.13-.764l.94.982 1.445-1.383-.94-.982-1.445 1.383zm.94.982c.516.538 1.59 1.666 2.386 2.506l1.451-1.377c-.797-.84-1.874-1.97-2.392-2.512l-1.445 1.383zm2.386 2.506c.433.456.844.859 1.175 1.154.164.145.324.279.466.381.069.05.154.107.246.157.047.025.267.147.555.147v-2a.895.895 0 01.387.088c.02.01.016.01-.017-.013a4.269 4.269 0 01-.307-.254 18.547 18.547 0 01-1.054-1.037l-1.45 1.377zm2.442 1.839c.215 0 .4-.06.507-.098.123-.044.246-.102.36-.16.23-.12.493-.28.77-.464.558-.37 1.245-.878 1.975-1.455 1.46-1.154 3.15-2.626 4.41-3.898l-1.421-1.407c-1.19 1.2-2.816 2.618-4.23 3.736a28.884 28.884 0 01-1.839 1.357 6.668 6.668 0 01-.583.353c-.07.037-.109.053-.122.058-.031.01.042-.022.173-.022v2zm8.022-6.075c1.628-1.644 3.328-3.587 4.155-4.766l-1.638-1.148c-.733 1.045-2.344 2.896-3.938 4.507l1.42 1.407zm4.155-4.766c.133-.189.299-.445.389-.747.105-.35.092-.706-.036-1.055-.113-.307-.305-.577-.497-.812a13.61 13.61 0 00-.755-.823l-1.434 1.394c.298.306.502.526.641.696.145.177.17.242.168.236a.37.37 0 01-.004-.208c.007-.023.002.013-.11.17l1.638 1.15zm-.9-3.437a8.626 8.626 0 01-.503-.544c-.043-.054-.034-.052-.014-.009.018.037.1.22.048.479a.862.862 0 01-.159.352.795.795 0 01-.196.184c-.089.058-.147.066-.105.055.03-.007.09-.02.196-.035.103-.016.228-.031.385-.05l-.23-1.986a6.738 6.738 0 00-.855.136 1.636 1.636 0 00-.483.204c-.198.13-.437.368-.513.744-.069.34.033.62.104.772.075.158.173.293.254.395.16.204.39.443.638.697l1.433-1.394zm-.348.433c.458-.053 6.917-.957 14.33-2.006l-.28-1.98c-7.44 1.052-13.855 1.95-14.28 2l.23 1.986zm14.33-2.006c7.427-1.05 14.143-1.999 14.924-2.108l-.278-1.981c-.783.11-7.5 1.059-14.925 2.11l.28 1.98zm14.924-2.108c.085-.012.175-.026.255-.043.039-.008.095-.02.155-.04.011-.003.204-.056.381-.207a1.006 1.006 0 00-.044-1.569c-.195-.149-.403-.188-.414-.19a2.285 2.285 0 00-.32-.045c-.381-.031-1.192-.051-2.594-.066-2.834-.03-8.243-.04-17.904-.049l-.002 2c9.667.008 15.063.019 17.885.049 1.426.015 2.157.035 2.453.06.082.006.076.01.032-.001-.015-.004-.051-.012-.096-.029a.992.992 0 01-.065-1.827.8.8 0 01.09-.034c.031-.01.047-.012.038-.01-.016.003-.056.01-.128.02l.278 1.98zm-20.485-2.209l-21.768-.017-.001 2 21.767.017.002-2zm-22.466.266l-1.258 1.226 1.395 1.433 1.259-1.226-1.396-1.433zm-1.258 1.226c-4.142 4.036-8.858 6.42-14.657 7.405l.334 1.971c6.194-1.05 11.282-3.62 15.718-7.943l-1.395-1.433zM48.434 69.82c-.985.167-2.562.25-4.19.238-1.626-.012-3.209-.117-4.205-.3l-.359 1.968c1.164.213 2.881.32 4.55.332 1.669.012 3.382-.07 4.538-.267l-.334-1.971zm-8.395-.061c-4.52-.826-8.6-2.629-12-5.29l-1.232 1.576c3.67 2.872 8.053 4.801 12.873 5.681l.36-1.967zm-12-5.29c-1.22-.953-3.567-3.305-4.518-4.525l-1.577 1.23c1.05 1.348 3.515 3.816 4.863 4.871l1.232-1.575zm-4.518-4.525c-2.848-3.655-4.659-7.857-5.372-12.47l-1.976.306c.765 4.947 2.712 9.468 5.77 13.393l1.578-1.23zm-5.372-12.47c-.282-1.823-.31-5.637-.057-7.451l-1.981-.277c-.28 2.008-.25 6.02.062 8.034l1.976-.306zm-.057-7.451c.52-3.723 1.985-7.701 3.948-10.744l-1.68-1.085c-2.127 3.296-3.69 7.552-4.249 11.552l1.98.277zm3.948-10.744c1.958-3.035 4.939-6.024 7.943-7.967l-1.086-1.68c-3.245 2.1-6.427 5.291-8.537 8.562l1.68 1.085zm7.943-7.967c3.074-1.989 6.525-3.312 10.401-3.977l-.338-1.97c-4.125.707-7.833 2.122-11.15 4.268l1.087 1.679zm10.401-3.977c.89-.152 2.424-.236 4.015-.235 1.59 0 3.132.086 4.033.24l.336-1.972c-1.07-.183-2.747-.267-4.368-.268-1.62 0-3.292.082-4.354.264l.338 1.971zm8.048.004c5.657.966 10.422 3.33 14.392 7.125l1.382-1.446c-4.27-4.082-9.404-6.62-15.438-7.65l-.336 1.971zm14.392 7.125l1.128 1.077 1.382-1.445-1.128-1.078-1.382 1.446zm1.817 1.355l21.88.038.004-2-21.88-.038-.004 2zm21.88.038c6.018.01 11.444.01 15.338-.002 1.946-.006 3.512-.014 4.577-.024.532-.005.944-.01 1.217-.016.134-.003.245-.007.322-.01a1.782 1.782 0 00.242-.03 1.003 1.003 0 00.775-.862 1.001 1.001 0 00-.759-1.088l-.475 1.942a.974.974 0 01-.371-.179.998.998 0 01.464-1.778c.035-.005.053-.005.02-.003-.045.003-.131.005-.263.008-.259.006-.66.012-1.19.017-1.059.01-2.62.017-4.565.023-3.89.011-9.312.013-15.328.002l-.004 2zm21.712-2.032a20.152 20.152 0 00-1.195-.197c-.582-.085-1.325-.188-2.091-.29l-.263 1.983c.759.1 1.493.203 2.064.286a52.407 52.407 0 01.933.146c.062.011.082.016.077.014l.475-1.942zm-3.287-.487c-3.179-.42-11.516-1.578-19.479-2.705l-.28 1.98c7.963 1.128 16.308 2.287 19.497 2.708l.262-1.983zm-19.479-2.705a1053.875 1053.875 0 00-5.165-.716 46.22 46.22 0 00-.475-.06s-.08-.01-.154-.01v2c-.062 0-.111-.008-.063-.002l.086.01.343.044 1.227.166c1.023.141 2.413.335 3.921.549l.28-1.98zm-5.794-.786a.959.959 0 01.947 1.088.693.693 0 01-.03.12c-.02.057-.024.041.04-.044l-1.609-1.19a2.255 2.255 0 00-.317.567c-.027.077-.11.318-.054.61a1.04 1.04 0 001.023.849v-2zm.956 1.164c.069-.093.163-.22.236-.342a1.4 1.4 0 00.202-.626 1.415 1.415 0 00-.116-.64c-.055-.13-.13-.27-.186-.374l-1.761.949a7.767 7.767 0 01.1.193c.003.006-.044-.098-.033-.257a.688.688 0 01.07-.26c0-.001 0 .002-.006.01a7.032 7.032 0 01-.114.158l1.608 1.189zm.136-1.982c-.216-.4-.77-1.176-1.369-1.972a56.78 56.78 0 00-1.965-2.47l-1.524 1.296A54.83 54.83 0 0177.8 18.26c.621.825 1.075 1.477 1.205 1.718l1.76-.949zm-3.334-4.442c-1.187-1.395-2.973-3.153-4.545-4.556a35.08 35.08 0 00-2.145-1.789 9.437 9.437 0 00-.834-.571 3.147 3.147 0 00-.388-.2 1.457 1.457 0 00-.581-.12l.04 2c-.168.002-.264-.048-.224-.031.014.006.058.026.136.073.156.091.373.24.649.447.546.411 1.25 1 2.015 1.683 1.533 1.368 3.247 3.059 4.353 4.36l1.524-1.296zM68.939 7.35c-.19.003-.344.055-.428.087a1.955 1.955 0 00-.257.122c-.148.083-.301.188-.452.301-.303.228-.665.539-1.052.902l1.37 1.457c.354-.333.657-.59.882-.758a2.33 2.33 0 01.23-.158c.021-.011.017-.007-.007.002-.012.005-.105.041-.247.044l-.04-2zM66.75 8.763c-.663.623-1.796 1.68-2.517 2.35l1.361 1.466c.724-.672 1.86-1.733 2.526-2.359l-1.37-1.457zm-2.517 2.35l-1.313 1.219 1.361 1.465 1.313-1.219-1.36-1.465zm-.1 1.105l-.676-.426-1.066 1.692.677.427 1.066-1.693zm-.676-.426c-2.77-1.745-5.492-2.976-8.935-4.05l-.595 1.91c3.295 1.027 5.857 2.19 8.464 3.832l1.066-1.692zm-8.935-4.05l-1.484-.462-.595 1.909 1.484.463.595-1.91zm-.782.504l.032-2.822-2-.023-.032 2.822 2 .023zm.032-2.822c.009-.77.025-1.533.044-2.14a43.839 43.839 0 01.045-1.02 3.52 3.52 0 01.009-.102v-.006-.002l-1.982-.264c-.051.388-.099 1.99-.116 3.511l2 .023zm.099-3.27c.062-.467.094-1.177-.471-1.723a2.14 2.14 0 00-.793-.464 6.14 6.14 0 00-.878-.22l-.372 1.965c.285.054.468.1.587.142.122.043.111.06.066.015a.398.398 0 01-.107-.188c-.002-.01.008.04-.015.21l1.983.263zM51.729-.253c-1.288-.243-3.49-.463-5.567-.6-2.059-.135-4.13-.198-5.124-.097l.204 1.99c.801-.082 2.707-.034 4.789.103 2.063.136 4.164.35 5.326.57l.372-1.966zM41.295 17.026c-4.367.42-9.127 2.214-12.814 4.819l1.154 1.633c3.412-2.41 7.843-4.075 11.852-4.462l-.192-1.99zm-12.814 4.819c-.941.665-2.184 1.778-3.325 2.919-1.14 1.139-2.245 2.37-2.889 3.291l1.64 1.146c.543-.777 1.55-1.911 2.663-3.023 1.11-1.11 2.26-2.131 3.065-2.7l-1.154-1.633zm-6.214 6.21c-5.453 7.798-6.493 17.328-2.823 26l1.842-.78c-3.398-8.028-2.444-16.831 2.62-24.073l-1.639-1.147zm-2.823 26c1.349 3.187 3.09 5.727 5.708 8.348l1.415-1.413c-2.45-2.454-4.04-4.782-5.281-7.714l-1.842.779zm5.708 8.348c2.254 2.257 3.99 3.529 6.724 4.92l.907-1.782c-2.539-1.292-4.105-2.437-6.216-4.551l-1.415 1.413zm6.724 4.92c5.453 2.775 11.577 3.608 17.545 2.386l-.401-1.96c-5.522 1.132-11.185.362-16.237-2.208l-.907 1.782zm17.545 2.386c.743-.152 1.936-.482 2.913-.78.492-.15.948-.299 1.28-.42.162-.057.32-.118.443-.176.05-.023.154-.073.253-.146a1.013 1.013 0 00.137-1.545l-1.415 1.413a.992.992 0 01-.15-1.208c.105-.174.236-.265.251-.277.064-.046.107-.063.077-.049a3.894 3.894 0 01-.276.108c-.287.104-.706.241-1.184.387-.96.293-2.081.6-2.73.734l.401 1.959zm5.026-3.068a1.022 1.022 0 00-.658-.297 1.367 1.367 0 00-.218.001c-.1.009-.204.026-.294.044a7.37 7.37 0 00-.647.164l.572 1.917a5.4 5.4 0 01.463-.119c.06-.011.081-.013.074-.013l-.029.002c-.014 0-.04 0-.076-.002a.905.905 0 01-.352-.1.984.984 0 01-.25-.182l1.415-1.415zm-1.817-.088c-1.076.322-2.955.599-4.86.694l.1 1.998c1.985-.1 4.04-.39 5.332-.775l-.572-1.917zm-4.86.694c-4.969.25-10.469-1.363-14.575-4.278l-1.157 1.63c4.468 3.173 10.41 4.918 15.832 4.646l-.1-1.998zM33.195 62.97c-1.49-1.059-4.175-3.647-5.244-5.053l-1.592 1.21c1.195 1.573 4.028 4.301 5.679 5.474l1.158-1.631zm-5.244-5.053c-6.405-8.427-6.411-20.245-.02-28.65l-1.591-1.21c-6.938 9.122-6.928 21.93.019 31.07l1.592-1.21zm-.02-28.65c1.088-1.43 3.765-4.014 5.265-5.079l-1.158-1.63c-1.662 1.18-4.486 3.903-5.698 5.498l1.592 1.21zm5.265-5.079c3.823-2.714 8.945-4.33 13.759-4.33v-2c-5.219 0-10.747 1.739-14.917 4.7l1.158 1.63zm13.759-4.33c1.51 0 4.125.334 5.42.685l.523-1.93c-1.481-.403-4.275-.754-5.944-.754v2zm5.42.685c.413.112.733.19.948.23.076.015.244.046.408.039a1.01 1.01 0 00.569-1.825c-.134-.101-.293-.17-.357-.198a7.195 7.195 0 00-.36-.143c-.276-.102-.65-.23-1.113-.378l-.61 1.904c.446.143.789.26 1.027.35.12.043.204.077.257.1.09.04.032.023-.054-.042a.99.99 0 01.548-1.766c.102-.005.153.013.054-.006a11.9 11.9 0 01-.794-.195l-.524 1.93zm.095-2.276c-3.788-1.213-7.344-1.61-11.175-1.24l.192 1.99c3.55-.342 6.834.022 10.373 1.155l.61-1.904zM6.027 67.186c0 .257.091.475.127.561.053.123.119.25.187.372.139.245.326.536.54.85.43.629 1.004 1.403 1.602 2.169.598.767 1.23 1.54 1.774 2.165.271.313.527.595.75.825.208.214.433.43.635.572l1.147-1.638-.008-.007a5.972 5.972 0 01-.339-.32 19.073 19.073 0 01-.676-.744 52.416 52.416 0 01-1.706-2.083 43.003 43.003 0 01-1.527-2.067 10.55 10.55 0 01-.45-.706 1.83 1.83 0 01-.087-.167c-.026-.062.031.04.031.219h-2zm5.826 7.708c.438.561 1.638 1.679 3.103 2.92l1.293-1.527c-1.495-1.265-2.53-2.252-2.819-2.623l-1.577 1.23zm-.32-.283l.426.399 1.365-1.462-.426-.398-1.365 1.461zm40.251 8.117c.02-1.41.022-2.334-.002-2.894l-1.998.088c.021.492.02 1.357 0 2.778l2 .028zm-.001-2.85v-.681h-2v.68h2zm-.712.31c.081.002.16 0 .233-.006l-.145-1.994a.693.693 0 01-.02 0h.005l-.073 2zm.233-.006c.415-.03 1.097-.18 2.058-.418l-.48-1.942c-1.01.25-1.513.35-1.723.366l.145 1.994zm-.495.014l.324-.008-.052-2-.325.009.053 2z"
                                        fill="#F60"
                                        mask="url(#a)"
                                    />
                                    <G clipPath="url(#clip0_159_3202)">
                                        <Path
                                            d="M33.936 40.112c0-.66.125-1.28.374-1.86a4.843 4.843 0 012.516-2.55 4.487 4.487 0 011.834-.378h7.23v3.196h-7.23a1.544 1.544 0 00-1.12.468c-.14.14-.25.308-.33.5-.08.194-.12.402-.12.624 0 .223.04.435.12.635.08.193.19.364.33.513.146.14.315.252.505.334.19.081.396.122.615.122h3.154a4.49 4.49 0 011.834.379c.579.245 1.08.586 1.505 1.024.432.431.77.94 1.011 1.526.25.58.374 1.2.374 1.86 0 .66-.125 1.28-.374 1.86a4.761 4.761 0 01-1.01 1.526c-.426.43-.927.772-1.506 1.024a4.49 4.49 0 01-1.835.379h-6.998v-3.196h6.998a1.545 1.545 0 001.11-.457 1.601 1.601 0 00.462-1.136c0-.223-.04-.43-.121-.624a1.478 1.478 0 00-.34-.5 1.457 1.457 0 00-.495-.346 1.545 1.545 0 00-.616-.123H38.66a4.489 4.489 0 01-1.834-.378 4.94 4.94 0 01-1.505-1.025 5.015 5.015 0 01-1.011-1.526 4.739 4.739 0 01-.374-1.87zm21.072 11.182h-3.142V38.52h-4.735v-3.196h12.601v3.196h-4.724v12.774zm17.194 0h-10.8v-15.97h10.8v3.196h-7.647v3.196h5.175v3.196h-5.175v3.186h7.647v3.196zm14.392-1.637a8.002 8.002 0 01-2.461 1.47 7.96 7.96 0 01-2.824.512 7.78 7.78 0 01-2.164-.3 8.21 8.21 0 01-1.945-.825 8.56 8.56 0 01-2.933-2.974 8.811 8.811 0 01-.824-1.97 8.385 8.385 0 01-.285-2.194c0-.758.095-1.49.285-2.194a8.532 8.532 0 01.824-1.972 8.419 8.419 0 011.285-1.681 8.155 8.155 0 013.593-2.127c.696-.2 1.417-.301 2.164-.301.974 0 1.916.17 2.824.512a7.722 7.722 0 012.46 1.47l-1.67 2.784a4.654 4.654 0 00-1.636-1.158 4.895 4.895 0 00-1.978-.412c-.695 0-1.347.134-1.955.401a5.093 5.093 0 00-2.67 2.706 4.958 4.958 0 00-.395 1.972c0 .698.131 1.355.395 1.97a5.206 5.206 0 001.077 1.605c.454.46.985.824 1.593 1.09.608.268 1.26.402 1.955.402.689 0 1.348-.134 1.978-.401a4.78 4.78 0 001.637-1.17l1.67 2.785zm4.988 1.637h-3.153v-15.97h3.153v6.392h6.295v-6.392h3.153v15.97h-3.153v-6.382h-6.295v6.382z"
                                            fill="#333"
                                        />
                                    </G>
                                    <Defs>
                                        <ClipPath id="clip0_159_3202">
                                            <Path
                                                fill="#fff"
                                                transform="translate(33.75 35.1)"
                                                d="M0 0H67.5V16.65H0z"
                                            />
                                        </ClipPath>
                                    </Defs>
                                </Svg>
                            </View>
                            <Text style={styles.change_number_old_popup_title}>
                                Изменение пароля
                            </Text>
                        </View>
                        <KeyboardAwareScrollView style={styles.change_number_old_popup_scroll}>

                            <View style={styles.change_number_old_popup_input_field_title_box2}>
                                <Text style={styles.change_number_old_popup_input_title}>Старый пароль</Text>
                                <TextInput
                                    style={styles.change_number_old_popup_input_field}
                                    onChangeText={(val) => this.setState({editOldPassword: val})}
                                    value={this.state.editOldPassword}
                                    // keyboardType='numeric'
                                    secureTextEntry={this.state.old_password_security}
                                />
                                {this.state.editOldPassword_error &&
                                <Text style={styles.error_text}>{this.state.editOldPassword_error_text}</Text>
                                }
                                {this.state.old_password_error &&
                                <Text style={styles.error_text}>{this.state.old_password_error_text}</Text>
                                }

                                {this.state.old_password_security &&
                                <TouchableOpacity style={{position: 'absolute', zIndex: 9, right: 15, top: 45}} onPress={() => {this.setState({old_password_security: false})}}>
                                    <Svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <Path
                                            d="M4.912 3.375a.558.558 0 00-.825.75l1.95 2.156C2.55 8.334 1.05 11.625.984 11.775a.534.534 0 000 .45c.038.075.816 1.81 2.56 3.544C5.287 17.503 7.93 19.312 12 19.312c1.701.01 3.384-.351 4.931-1.059l2.156 2.372a.552.552 0 00.413.187c.14.001.274-.053.375-.15a.545.545 0 00.037-.787l-15-16.5zm4.566 6.684l4.219 4.64a3.188 3.188 0 01-4.219-4.64zM12 18.187c-2.944 0-5.513-1.068-7.631-3.178A12.552 12.552 0 012.128 12c.403-.768 1.884-3.3 4.688-4.865l1.893 2.081a4.312 4.312 0 005.747 6.329l1.669 1.837c-1.308.541-2.71.815-4.125.806zm11.015-5.962c-.037.094-.974 2.156-3.084 4.05a.563.563 0 01-.605.09.563.563 0 01-.145-.934c1.09-.978 2-2.14 2.69-3.431a12.553 12.553 0 00-2.24-3.01C17.512 6.881 14.944 5.812 12 5.812a10.913 10.913 0 00-1.847.15.562.562 0 01-.188-1.106c.673-.113 1.353-.17 2.035-.169 4.069 0 6.844 1.922 8.456 3.544 1.613 1.622 2.522 3.469 2.56 3.544a.535.535 0 010 .45zM12.6 8.869a.562.562 0 11.206-1.107 4.331 4.331 0 013.488 3.835.563.563 0 01-.507.61h-.056a.553.553 0 01-.553-.507A3.197 3.197 0 0012.6 8.869z"
                                            fill="#000"
                                        />
                                    </Svg>
                                </TouchableOpacity>

                                }

                                {!this.state.old_password_security &&
                                <TouchableOpacity style={{position: 'absolute', zIndex: 9, right: 15, top: 45}}  onPress={() => {this.setState({old_password_security: true})}}>
                                    <Svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <Path
                                            d="M23.015 11.775c-.037-.075-.815-1.81-2.559-3.544C18.712 6.497 16.07 4.688 12 4.688S5.156 6.609 3.544 8.23C1.93 9.853 1.022 11.7.984 11.775a.534.534 0 000 .45c.038.075.816 1.81 2.56 3.544C5.287 17.503 7.93 19.312 12 19.312s6.844-1.921 8.456-3.543c1.613-1.622 2.522-3.469 2.56-3.544a.535.535 0 000-.45zM12 18.187c-2.944 0-5.513-1.068-7.631-3.178A12.553 12.553 0 012.128 12a12.553 12.553 0 012.24-3.01C6.489 6.882 9.057 5.813 12 5.813s5.512 1.07 7.631 3.179c.893.885 1.649 1.9 2.24 3.009-.6 1.144-3.59 6.188-9.871 6.188zm0-10.5a4.312 4.312 0 100 8.625 4.312 4.312 0 000-8.625zm0 7.5A3.187 3.187 0 1115.187 12 3.197 3.197 0 0112 15.188z"
                                            fill="#000"
                                        />
                                    </Svg>
                                </TouchableOpacity>

                                }
                            </View>

                            <View style={styles.change_number_old_popup_input_field_title_box2}>

                                <Text style={styles.change_number_old_popup_input_title}>
                                    Новый пароль
                                </Text>
                                <TextInput
                                    style={styles.change_number_old_popup_input_field}
                                    onChangeText={(val) => {
                                        this.setState({editNewPassword: val})
                                    }}
                                    value={this.state.editNewPassword}
                                    // keyboardType='numeric'
                                    secureTextEntry={this.state.new_password_security}
                                />

                                {this.state.editNewPassword_error &&
                                <Text style={styles.error_text}>{this.state.editNewPassword_error_text}</Text>
                                }
                                {this.state.password_error &&
                                <Text style={styles.error_text}>{this.state.password_error_text}</Text>
                                }

                                {this.state.new_password_security &&
                                <TouchableOpacity style={{position: 'absolute', zIndex: 9, right: 15, top: 45}} onPress={() => {this.setState({new_password_security: false})}}>
                                    <Svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <Path
                                            d="M4.912 3.375a.558.558 0 00-.825.75l1.95 2.156C2.55 8.334 1.05 11.625.984 11.775a.534.534 0 000 .45c.038.075.816 1.81 2.56 3.544C5.287 17.503 7.93 19.312 12 19.312c1.701.01 3.384-.351 4.931-1.059l2.156 2.372a.552.552 0 00.413.187c.14.001.274-.053.375-.15a.545.545 0 00.037-.787l-15-16.5zm4.566 6.684l4.219 4.64a3.188 3.188 0 01-4.219-4.64zM12 18.187c-2.944 0-5.513-1.068-7.631-3.178A12.552 12.552 0 012.128 12c.403-.768 1.884-3.3 4.688-4.865l1.893 2.081a4.312 4.312 0 005.747 6.329l1.669 1.837c-1.308.541-2.71.815-4.125.806zm11.015-5.962c-.037.094-.974 2.156-3.084 4.05a.563.563 0 01-.605.09.563.563 0 01-.145-.934c1.09-.978 2-2.14 2.69-3.431a12.553 12.553 0 00-2.24-3.01C17.512 6.881 14.944 5.812 12 5.812a10.913 10.913 0 00-1.847.15.562.562 0 01-.188-1.106c.673-.113 1.353-.17 2.035-.169 4.069 0 6.844 1.922 8.456 3.544 1.613 1.622 2.522 3.469 2.56 3.544a.535.535 0 010 .45zM12.6 8.869a.562.562 0 11.206-1.107 4.331 4.331 0 013.488 3.835.563.563 0 01-.507.61h-.056a.553.553 0 01-.553-.507A3.197 3.197 0 0012.6 8.869z"
                                            fill="#000"
                                        />
                                    </Svg>
                                </TouchableOpacity>

                                }

                                {!this.state.new_password_security &&
                                <TouchableOpacity style={{position: 'absolute', zIndex: 9, right: 15, top: 45}}  onPress={() => {this.setState({new_password_security: true})}}>
                                    <Svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <Path
                                            d="M23.015 11.775c-.037-.075-.815-1.81-2.559-3.544C18.712 6.497 16.07 4.688 12 4.688S5.156 6.609 3.544 8.23C1.93 9.853 1.022 11.7.984 11.775a.534.534 0 000 .45c.038.075.816 1.81 2.56 3.544C5.287 17.503 7.93 19.312 12 19.312s6.844-1.921 8.456-3.543c1.613-1.622 2.522-3.469 2.56-3.544a.535.535 0 000-.45zM12 18.187c-2.944 0-5.513-1.068-7.631-3.178A12.553 12.553 0 012.128 12a12.553 12.553 0 012.24-3.01C6.489 6.882 9.057 5.813 12 5.813s5.512 1.07 7.631 3.179c.893.885 1.649 1.9 2.24 3.009-.6 1.144-3.59 6.188-9.871 6.188zm0-10.5a4.312 4.312 0 100 8.625 4.312 4.312 0 000-8.625zm0 7.5A3.187 3.187 0 1115.187 12 3.197 3.197 0 0112 15.188z"
                                            fill="#000"
                                        />
                                    </Svg>
                                </TouchableOpacity>

                                }
                            </View>

                            <View style={[styles.change_number_old_popup_input_field_title_box2, {marginBottom: 99}]}>
                                <Text style={styles.change_number_old_popup_input_title}>
                                    Повтор нового пароля
                                </Text>
                                <TextInput
                                    style={styles.change_number_old_popup_input_field}
                                    onChangeText={(val) => this.setState({confirmNewPassword: val})}
                                    value={this.state.confirmNewPassword}
                                    // keyboardType='numeric'
                                    secureTextEntry={this.state.repeat_password_security}
                                />
                                {this.state.repeat_password_security &&
                                <TouchableOpacity style={{position: 'absolute', zIndex: 9, right: 15, top: 45}} onPress={() => {this.setState({repeat_password_security: false})}}>
                                    <Svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <Path
                                            d="M4.912 3.375a.558.558 0 00-.825.75l1.95 2.156C2.55 8.334 1.05 11.625.984 11.775a.534.534 0 000 .45c.038.075.816 1.81 2.56 3.544C5.287 17.503 7.93 19.312 12 19.312c1.701.01 3.384-.351 4.931-1.059l2.156 2.372a.552.552 0 00.413.187c.14.001.274-.053.375-.15a.545.545 0 00.037-.787l-15-16.5zm4.566 6.684l4.219 4.64a3.188 3.188 0 01-4.219-4.64zM12 18.187c-2.944 0-5.513-1.068-7.631-3.178A12.552 12.552 0 012.128 12c.403-.768 1.884-3.3 4.688-4.865l1.893 2.081a4.312 4.312 0 005.747 6.329l1.669 1.837c-1.308.541-2.71.815-4.125.806zm11.015-5.962c-.037.094-.974 2.156-3.084 4.05a.563.563 0 01-.605.09.563.563 0 01-.145-.934c1.09-.978 2-2.14 2.69-3.431a12.553 12.553 0 00-2.24-3.01C17.512 6.881 14.944 5.812 12 5.812a10.913 10.913 0 00-1.847.15.562.562 0 01-.188-1.106c.673-.113 1.353-.17 2.035-.169 4.069 0 6.844 1.922 8.456 3.544 1.613 1.622 2.522 3.469 2.56 3.544a.535.535 0 010 .45zM12.6 8.869a.562.562 0 11.206-1.107 4.331 4.331 0 013.488 3.835.563.563 0 01-.507.61h-.056a.553.553 0 01-.553-.507A3.197 3.197 0 0012.6 8.869z"
                                            fill="#000"
                                        />
                                    </Svg>
                                </TouchableOpacity>

                                }

                                {!this.state.repeat_password_security &&
                                <TouchableOpacity style={{position: 'absolute', zIndex: 9, right: 15, top: 45}}  onPress={() => {this.setState({repeat_password_security: true})}}>
                                    <Svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <Path
                                            d="M23.015 11.775c-.037-.075-.815-1.81-2.559-3.544C18.712 6.497 16.07 4.688 12 4.688S5.156 6.609 3.544 8.23C1.93 9.853 1.022 11.7.984 11.775a.534.534 0 000 .45c.038.075.816 1.81 2.56 3.544C5.287 17.503 7.93 19.312 12 19.312s6.844-1.921 8.456-3.543c1.613-1.622 2.522-3.469 2.56-3.544a.535.535 0 000-.45zM12 18.187c-2.944 0-5.513-1.068-7.631-3.178A12.553 12.553 0 012.128 12a12.553 12.553 0 012.24-3.01C6.489 6.882 9.057 5.813 12 5.813s5.512 1.07 7.631 3.179c.893.885 1.649 1.9 2.24 3.009-.6 1.144-3.59 6.188-9.871 6.188zm0-10.5a4.312 4.312 0 100 8.625 4.312 4.312 0 000-8.625zm0 7.5A3.187 3.187 0 1115.187 12 3.197 3.197 0 0112 15.188z"
                                            fill="#000"
                                        />
                                    </Svg>
                                </TouchableOpacity>

                                }
                                {this.state.confirmNewPassword_error &&
                                <Text style={styles.error_text}>{this.state.confirmNewPassword_error_text}</Text>
                                }
                            </View>

                        </KeyboardAwareScrollView>
                        <View style={{width: '100%', height: 100}}>

                            <TouchableOpacity style={styles.change_number_old_popup_confirm_btn} onPress={() => this.changePassword()}>
                                <Text style={styles.change_number_old_popup_confirm_btn_text}>Подтвердить</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>

            )

        }

        if (this.state.changePasswordSuccessPopup) {
            return (

                <SafeAreaView style={styles.change_number_old_popup}>
                    <View style={styles.change_number_old_popup_wrapper}>


                        <TouchableOpacity
                            style={{ position: 'absolute', right: 20, top: 10, zIndex: 999}}
                            onPress={() => {
                                this.setState({changePasswordSuccessPopup: false})
                            }}
                        >
                            <Svg
                                width={35}
                                height={35}
                                viewBox="0 0 35 35"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <Path
                                    d="M17.499 17.78L9.141 9.36m-.063 16.779l8.421-8.358-8.421 8.358zm8.421-8.358l8.421-8.359L17.5 17.78zm0 0l8.358 8.42-8.358-8.42z"
                                    stroke="#000"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                />
                            </Svg>
                        </TouchableOpacity>

                        <ScrollView style={styles.change_number_old_popup_scroll}>

                            <View style={styles.change_number_success_popup_img}>
                                <Svg
                                    width={230}
                                    height={185}
                                    viewBox="0 0 230 185"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <Mask id="a" fill="#fff">
                                        <Path d="M82.4.558c2.148-.195 4.381-.403 4.962-.462 3.814-.39 16.89.47 22.092 1.454 2.559.483 3.072.98 2.838 2.744-.088.664-.191 3.903-.228 7.2l-.068 5.992 3.152.982c7.154 2.231 12.765 4.773 18.473 8.37l1.438.905 2.788-2.588c1.534-1.424 3.943-3.673 5.354-4.999 1.574-1.479 2.824-2.416 3.236-2.424 1.509-.03 11.507 8.896 16.375 14.62 2.551 2.998 6.094 7.703 6.828 9.064.544 1.01.542 1.036-.125 1.938-.38.513-.522.915-.324.915.194 0 5.597.742 12.007 1.65 16.91 2.393 34.623 4.853 41.384 5.746 3.238.428 6.276.874 6.753.99.476.117-20.043.175-45.598.13l-46.463-.082-2.394-2.288c-8.749-8.363-19.261-13.57-31.673-15.687-4.19-.715-13.662-.72-17.807-.009-8.495 1.457-16.096 4.365-22.881 8.755-6.635 4.292-13.178 10.854-17.498 17.55-4.342 6.729-7.557 15.473-8.703 23.672-.568 4.058-.504 12.368.126 16.443 1.57 10.15 5.56 19.412 11.831 27.459 2.126 2.728 7.235 7.846 9.96 9.979 7.508 5.874 16.493 9.837 26.41 11.648 4.587.837 14.017.905 18.563.134 12.735-2.162 23.144-7.422 32.252-16.296l2.671-2.604 46.225.038c41.043.034 45.887.086 43.207.463-1.66.233-15.922 2.248-31.693 4.478-15.77 2.23-29.44 4.144-30.377 4.252-2.691.311-2.716.433-.539 2.67 2.542 2.612 2.73 3.123 1.693 4.6-1.656 2.362-5.172 6.39-8.594 9.846-5.201 5.252-14.081 12.27-15.526 12.27-.328 0-1.861-1.365-3.644-3.243a1975.103 1975.103 0 00-5.073-5.328l-1.996-2.085-2.265 1.221c-5.064 2.731-12.047 5.516-16.742 6.679-2.093.519-3.352.785-4.015.833a2.772 2.772 0 01-.263.007l-.69.018v1.446c.049 1.118.047 3.018.003 6.023-.091 6.354-.175 7.45-.603 7.877-1.418 1.417-18.04 1.999-26.064.912-5.47-.741-7.76-1.256-8.188-1.841-.276-.378-.324-2.326-.193-7.868.168-7.102.153-7.366-.401-7.37-1.03-.007-8.416-2.626-12.1-4.291-1.979-.894-5.132-2.533-7.007-3.642-2.053-1.214-3.561-1.927-3.79-1.791-.21.123-2.508 2.261-5.106 4.75s-5.053 4.651-5.457 4.804c-.898.341-1.944-.302-5.8-3.567-3.143-2.661-5.516-4.895-6.288-5.885l-.905-.846c-1.981-1.388-11.017-12.888-11.017-14.215 0-.573.996-1.601 8.407-8.678l2.22-2.12-1.814-3.452c-2.863-5.446-6.38-15.061-6.902-18.865l-.171-1.252-1.82-.19c-1-.105-4.25-.19-7.222-.19-6.86 0-6.583.191-7.205-4.983-.656-5.469-.52-15.942.292-22.32.758-5.96 1.064-7.281 1.775-7.654.295-.154 3.618-.19 7.725-.08 4.715.125 7.231.086 7.276-.111.037-.166.51-1.727 1.051-3.47a77.705 77.705 0 017.85-17.372l1.218-2.003-.958-1.098c-.527-.604-2.769-2.986-4.982-5.294-2.925-3.05-4.024-4.397-4.024-4.934 0-1.15 4.301-6.467 9.351-11.56 4.985-5.027 13.903-12.009 15.4-12.056.248-.008 2.77 2.386 5.604 5.319l5.151 5.333 2.847-1.524c5.44-2.913 12.695-5.648 18.274-6.888l2.448-.544.193-3.152c.106-1.733.193-4.97.193-7.191 0-5.378-.07-5.302 5.3-5.787z" />
                                        <Path d="M61.707 48.123c7.537-5.325 17.296-8.997 26.189-9.854 7.838-.756 15.099.051 22.878 2.543 3.858 1.236 4.473 1.703 1.001.76-2.947-.8-8.69-1.527-12.065-1.527-10.652 0-21.96 3.56-30.447 9.587-3.357 2.383-9.197 8.018-11.64 11.23-14.151 18.611-14.134 44.757.041 63.409 2.405 3.164 8.263 8.809 11.599 11.178 9.103 6.463 21.252 10.028 32.285 9.475 4.129-.208 8.307-.81 10.821-1.56.887-.265 1.675-.421 1.75-.346.228.228-6.642 2.326-9.597 2.932-12.2 2.498-24.716.796-35.868-4.878-5.6-2.849-9.105-5.415-13.74-10.056-5.382-5.388-8.919-10.558-11.668-17.055-7.504-17.733-5.388-37.198 5.78-53.167 2.52-3.605 8.972-10.052 12.68-12.671z" />
                                    </Mask>
                                    <Path
                                        d="M82.4.558c2.148-.195 4.381-.403 4.962-.462 3.814-.39 16.89.47 22.092 1.454 2.559.483 3.072.98 2.838 2.744-.088.664-.191 3.903-.228 7.2l-.068 5.992 3.152.982c7.154 2.231 12.765 4.773 18.473 8.37l1.438.905 2.788-2.588c1.534-1.424 3.943-3.673 5.354-4.999 1.574-1.479 2.824-2.416 3.236-2.424 1.509-.03 11.507 8.896 16.375 14.62 2.551 2.998 6.094 7.703 6.828 9.064.544 1.01.542 1.036-.125 1.938-.38.513-.522.915-.324.915.194 0 5.597.742 12.007 1.65 16.91 2.393 34.623 4.853 41.384 5.746 3.238.428 6.276.874 6.753.99.476.117-20.043.175-45.598.13l-46.463-.082-2.394-2.288c-8.749-8.363-19.261-13.57-31.673-15.687-4.19-.715-13.662-.72-17.807-.009-8.495 1.457-16.096 4.365-22.881 8.755-6.635 4.292-13.178 10.854-17.498 17.55-4.342 6.729-7.557 15.473-8.703 23.672-.568 4.058-.504 12.368.126 16.443 1.57 10.15 5.56 19.412 11.831 27.459 2.126 2.728 7.235 7.846 9.96 9.979 7.508 5.874 16.493 9.837 26.41 11.648 4.587.837 14.017.905 18.563.134 12.735-2.162 23.144-7.422 32.252-16.296l2.671-2.604 46.225.038c41.043.034 45.887.086 43.207.463-1.66.233-15.922 2.248-31.693 4.478-15.77 2.23-29.44 4.144-30.377 4.252-2.691.311-2.716.433-.539 2.67 2.542 2.612 2.73 3.123 1.693 4.6-1.656 2.362-5.172 6.39-8.594 9.846-5.201 5.252-14.081 12.27-15.526 12.27-.328 0-1.861-1.365-3.644-3.243a1975.103 1975.103 0 00-5.073-5.328l-1.996-2.085-2.265 1.221c-5.064 2.731-12.047 5.516-16.742 6.679-2.093.519-3.352.785-4.015.833a2.772 2.772 0 01-.263.007l-.69.018v1.446c.049 1.118.047 3.018.003 6.023-.091 6.354-.175 7.45-.603 7.877-1.418 1.417-18.04 1.999-26.064.912-5.47-.741-7.76-1.256-8.188-1.841-.276-.378-.324-2.326-.193-7.868.168-7.102.153-7.366-.401-7.37-1.03-.007-8.416-2.626-12.1-4.291-1.979-.894-5.132-2.533-7.007-3.642-2.053-1.214-3.561-1.927-3.79-1.791-.21.123-2.508 2.261-5.106 4.75s-5.053 4.651-5.457 4.804c-.898.341-1.944-.302-5.8-3.567-3.143-2.661-5.516-4.895-6.288-5.885l-.905-.846c-1.981-1.388-11.017-12.888-11.017-14.215 0-.573.996-1.601 8.407-8.678l2.22-2.12-1.814-3.452c-2.863-5.446-6.38-15.061-6.902-18.865l-.171-1.252-1.82-.19c-1-.105-4.25-.19-7.222-.19-6.86 0-6.583.191-7.205-4.983-.656-5.469-.52-15.942.292-22.32.758-5.96 1.064-7.281 1.775-7.654.295-.154 3.618-.19 7.725-.08 4.715.125 7.231.086 7.276-.111.037-.166.51-1.727 1.051-3.47a77.705 77.705 0 017.85-17.372l1.218-2.003-.958-1.098c-.527-.604-2.769-2.986-4.982-5.294-2.925-3.05-4.024-4.397-4.024-4.934 0-1.15 4.301-6.467 9.351-11.56 4.985-5.027 13.903-12.009 15.4-12.056.248-.008 2.77 2.386 5.604 5.319l5.151 5.333 2.847-1.524c5.44-2.913 12.695-5.648 18.274-6.888l2.448-.544.193-3.152c.106-1.733.193-4.97.193-7.191 0-5.378-.07-5.302 5.3-5.787z"
                                        fill="#F60"
                                    />
                                    <Path
                                        d="M61.707 48.123c7.537-5.325 17.296-8.997 26.189-9.854 7.838-.756 15.099.051 22.878 2.543 3.858 1.236 4.473 1.703 1.001.76-2.947-.8-8.69-1.527-12.065-1.527-10.652 0-21.96 3.56-30.447 9.587-3.357 2.383-9.197 8.018-11.64 11.23-14.151 18.611-14.134 44.757.041 63.409 2.405 3.164 8.263 8.809 11.599 11.178 9.103 6.463 21.252 10.028 32.285 9.475 4.129-.208 8.307-.81 10.821-1.56.887-.265 1.675-.421 1.75-.346.228.228-6.642 2.326-9.597 2.932-12.2 2.498-24.716.796-35.868-4.878-5.6-2.849-9.105-5.415-13.74-10.056-5.382-5.388-8.919-10.558-11.668-17.055-7.504-17.733-5.388-37.198 5.78-53.167 2.52-3.605 8.972-10.052 12.68-12.671z"
                                        fill="#F60"
                                    />
                                    <Path
                                        d="M25.277 155.379l.18-.466h-.001l-.18.466zm1.014 1.625h.5v-1.207l-.854.853.354.354zm.328.191l-.176-.468v.001l.176.467zm80.796 11.582l-.467.179.467-.179zm-.401-.028l-.335.37v.001l.335-.371zm-.409-1.039l.469.175-.469-.175zm-.298-.106l-.315-.388.315.388zm-.336-.301l.489.105-.489-.105zm2.503-.063l-.492-.086-.001.002.493.084zm.368.493l.291-.407-.291.407zm-.125.119l-.153.475v.001l.153-.476zM93.754 1.024l-.336.37.336-.37zm.77.285l.353.353-.353-.353zm-.228-.49l-.264.425.264-.425zm1.95-.263l.004-.5-.003.5zm1.963.287l.267.422-.267-.422zm.07.278l-.005.5.005-.5zm.603-.26l.468.177v-.001L98.882.86zm2.063.035l.076-.494h-.001l-.075.494zm2.502.33l.027-.5-.027.5zm-.15.561l-.305-.396.305.396zm-1.127.54l.007.5v-.001l-.007-.5zm.151-.437l.301.399-.301-.4zm-1.057.47l.032-.5h-.001l-.031.5zm-.587.32l-.138-.48.138.48zm-1.329-.012l.354-.354-.354.354zm-.84-.022l-.235-.441.236.44zm-1.538.074l-.102.49.102-.49zm-1.006-.21l-.11-.489.008.978.102-.49zm.906-.204l.11.488-.11-.488zm2.037-.24l-.016-.5.016.5zm1.962-.673l-.021-.5.021.5zm.262-.181l.125-.484h-.001l-.124.484zm-1.207.162l.217.45-.217-.45zm-2.073.476l.059.497-.059-.497zm-2.113.282l.082.493-.082-.493zm-.302-.016l.162.473-.162-.473zm-.453-.564l-.101-.49.102.49zM93.4 1.13l.31-.393-.31.393zm-.477-.6l-.011-.5.011.5zm3.722.796l.187-.464-.187.464zm.754 0l-.186-.464h-.001l.187.464zM10.396 74.183l-.105-.489.104.49zm.756.102l-.034-.498.034.498zm2.264.185l.283-.412-.283.412zm-.153.164l.117-.486-.117.486zm-2.717.102l-.057-.497.057.496zm1.208.211l-.005-.5.005.5zm3.878.859l-.467-.18.467.18zm.98.413l-.082-.493.081.493zm2.386 2.745l-.32.385.32-.385zm.448.715l.5.008v-.001l-.5-.007zM18.28 79l-.397.304.397-.305zm-.744-.414l.426.263-.425-.263zm1.852 1.815l.085.492-.085-.492zm.725 2.29l.45.217-.45-.218zm-.482 3.435l-.354-.354.354.354zm.413-1.787l-.495-.07.495.07zm.232-1.603l.5.001-.995-.072.495.071zm-1.044 4.173l-.5.033v.001l.5-.034zm-.11-1.684l-.5.031.5-.031zm.104-1.735l-.495-.07v.001l.495.07zm.007-.468l.486.117-.486-.117zm-.71-1.025l.472-.166-.472.166zm-1.028-2.12l-.37.336.37-.335zm-.915-1.322l.179.467-.18-.467zm-.27-.311l.467.18v-.001l-.467-.179zm-2.13-1.409l.425.263-.426-.263zm-1.111-1.011l.262.425-.262-.425zm.224.663l.307-.395-.307.395zm.02.256l-.163.472.164-.472zm-2.079-.192l-.32-.384-1.062.884h1.382v-.5zm.713-.593l-.32-.384.32.384zm.166-.604l.01-.5-.01.5zm-.383.254l-.425.263.425-.263zm-3.716.409l.072-.495-.072.495zm-.41-.696l-.023-.5.023.5zm.101-.193l.184-.465-.184.465zm-.823.375l-.404-.295.404.295zm-1.083.213l-.217.45.217-.45zm.127-.351l.012.5-.012-.5zm.998-.322l-.425-.263.425.263zm.848-.337l-.026-.5.026.5zm.129-.174l-.127.484.127-.484zm-2.813 1.587l.108.489h.001l-.109-.489zm.1.054l-.242-.437h-.001l.244.437zm.935.418l-.287-.409.287.409zm1.405-.323l-.185.465.185-.465zm.604.24l.019.5.166-.964-.185.465zm-.604.024l.02.5-.02-.5zm-1.51.495l-.23-.443.23.443zM4.813 77l.428-.259-.428.259zm-.913.044l-.498.036.498-.035zm.11 1.55l-.222.447.784.39-.062-.873-.5.035zm-.94-.47l-.224.447.223-.447zm-.28-.766l-.203-.457.204.457zm-.075-.457l-.207-.456.207.456zm-.597 1.275l-.495.075.495-.075zm-.146.336l-.452.214.452-.214zm-.297-.15l.5.01-.5-.01zm.453 1.206l.426-.261-.426.261zm.3.226l-.478.147.478-.147zm.828-.996l.467-.179-.467.18zm-.304.257l.179-.467-.18.467zm-.294.392l-.477.149.477-.149zm-.08.987l.423.266-.424-.266zm-.588-.15l-.433.25.433-.25zM1.6 81.527l-.5.012.5-.012zm.022.905l-.477.151.977-.163-.5.012zm-.287-.905l.477-.15-.477.15zm.048-2.826l.492.086-.492-.086zm1.842-2.866l.266.424-.266-.424zm7.17-2.022l.067-.495-.066.495zm1.057.143l.105.489-.038-.985-.067.496zM8.83 75.55l.186-.465-.186.465zm.578-.024l-.353-.354.353.354zm-.396-.159l-.02-.5.02.5zm7.249 1.777l.353.353-.353-.353zm-8.97 5.23l-.41-.288.41.287zm-.052-.355l.481.136-.481-.136zm-.131-.51l.262.425-.262-.426zm-.826 1.217l-.295-.404.295.404zm-.168 1.39l.477-.148-.477.148zm.566 2.541l.494-.08-.494.08zm1.3 1.594l-.04.498.04-.498zm.65-.188l.277-.416-.278.416zm.52-.409l-.072-.495.072.495zm.597.263l-.384-.32.384.32zm.668.173l.498.042-.498-.042zm.115-1.203l.498.05-.498-.05zm-.17-.811l.263.425-.263-.425zm1.07-1.097l.32-.385h-.001l-.32.385zm.011 1.144l-.443-.23.443.23zm-.246 1.06l.425-.264-.425.263zm-.32.803l-.371-.336.37.336zm-5.047-1.687l-.464.187.464-.187zm-.326-2.206l.5.005-.5-.005zm.016-1.358l.5.006-.994-.082.494.076zm-.252 1.645l-.494-.076.494.076zm.175 2.254l.41-.287-.41.287zm.426.92l.5.002-.5-.002zm-.54-.595l.43-.256-.43.256zm-.478-2.565l-.5-.018.5.018zm.94-2.925l.487-.115-.486.115zm.557.19l.319.384-.319-.385zm1.786-1.457l-.122-.485.122.485zm.738-.626l.235.441-.235-.44zm-.981.196l.176-.468-.176.468zm.308-.4l-.184-.465.184.466zm3.859.497l-.426.263.425-.263zm-3.604.732l-.148-.477.148.477zm-.891.552l.263-.425h-.001l-.262.425zm8.871 2.789l.263-.426-.263.426zm-.773-.564l-.458.2.458-.2zm-.41-.945l.458-.2-.959.194.5.006zm.127 4.073l-.493-.083.493.083zm-.555 1.212l-.006-.5h-.001l.007.5zm.102.295l.27-.42-.27.42zm-.085 1.243l.435.246-.435-.245zm-.412 1.078l.354-.353v-.001l-.354.354zm1.375-2.218l-.492.087.492-.087zm-.008-1.401l.5.015-.5-.015zm.374-.94l-.263.425.263-.425zm-1.007 4.508l-.398-.304.398.304zm-1.092 1.023l.47-.172-.47.172zm-.579.431l-.187.464.187-.464zm.034.176l.034.499-.034-.5zm-1.057-.596l.328-.377-.328.377zm-.712-.619l.133-.482-.461.86.328-.378zm.679.187l-.133.482.133-.482zm1.68-1.752l-.178-.466.178.466zm.489-.882l-.5.01v.001l.5-.01zm.268-1.994l.489.105-.49-.105zm-.102-1.454l.18-.466h-.001l-.18.466zm-.293-1.134l-.498-.046.498.046zm-.212-1.413l-.407.29.407-.29zm-.136.092l-.476.153.476-.153zm-.803.054l-.4.3.4-.3zm-.542-.723v-.5h-1l.6.8.4-.3zm1.849-.377l.5.013-.5-.013zM1.074 85.847l.5.025-.5-.025zm.302 1.328l.44-.236-.44.236zm-.076.473l.177-.467-.177.467zM.826 88.82l-.5-.023.5.023zm.226 1.149l.263.425-.263-.425zm1.277-2.524l-.434.249.434-.25zm.635 1.984l-.178-.467h-.001l.18.467zm1.434.71l-.325.38.325-.38zm1.373.881l.018-.5h-.001l-.017.5zm.83.487l.354-.354-.354.354zm1.229.13l.425.262-.425-.263zm2.173-.031l-.353-.354.353.354zm2.732.644l-.01.5.01-.5zM9.943 93.44l-.006-.5.006.5zm-2.105.11l.041.498-.04-.498zM4.51 92.84l-.425-.263.425.263zm-2.114-2.488l-.48-.136h-.001l.481.136zm-.126-.226l.41.287-.41-.287zm-.321-.377l-.5.002.5-.002zm.401-1.296l-.467.18.467-.18zm-.698.876l.488.11-.488-.11zm.423 1.683l.342-.365-.342.365zm1.766 1.22l-.484.127.484-.127zM1.77 91.228l.326-.379-.326.38zm-1.231-1.06l-.5-.01-.005.235.179.154.326-.379zm.045-2.208l-.5-.01.5.01zm.536-5.678l.455-.207-.455.207zm18.408 6.333l-.465-.182.465.182zm.2.088l.5-.022-.5.022zm-.429.711l-.178-.467.178.467zm-.689 1.125l-.262-.426.262.426zM5.138 91.71l-.353.354.353-.353zm.329.592l-.094-.49.094.49zm22.884 65.631l-.491-.094.49.094zm-.124.621l.484.123.001-.003-.485-.12zm-.34-.102l-.263.425.263-.425zm.037-.621l-.385-.32.385.32zm79.598 9.131l-.186.464.186-.464zm-.273.73l-.327-.378.327.378zm.514.003l.309.393-.309-.393zm.25-.754l-.18.467h.001l.179-.467zm-.679-.16l-.058-.496.058.496zm.221 8.987l-.5-.011.5.011zm-.272.644l.476-.153-.476.153zm-8.66 7.735l-.354.353.353-.353zm-.11-.485l.236.441-.236-.441zm-1.565.027l-.139.481.139-.481zm-.984-.284l-.026-.499-.112.98.138-.481zm11.168-9.105l.425-.263-.425.263zm.357 3.677l-.464-.186.464.186zm-.182-.182l-.5.02.5-.02zm.158-.396l-.353.353.353-.353zm1.064-9.239l-.019.499.016.001.016-.001-.013-.499zm-83.088-12.859c-.033-.053-.024-.051-.015-.012a.391.391 0 010 .172.449.449 0 01-.18.273.403.403 0 01-.205.076c-.02.002-.034.001-.043.001l-.013-.002.008.002.023.007c.02.006.048.015.082.028l.358-.933a1.57 1.57 0 00-.302-.089.753.753 0 00-.192-.01.576.576 0 00-.292.103c-.278.195-.242.5-.215.609.029.118.088.224.135.301l.85-.526zm-.343.545c.213.082.444.108.657.075.198-.031.464-.13.621-.383l-.85-.526a.212.212 0 01.076-.077c.013-.007.014-.005 0-.002a.257.257 0 01-.063 0 .36.36 0 01-.083-.02l-.358.933zm.693 1.158a.658.658 0 00.33.59c.167.096.34.101.425.099.098-.003.18-.019.202-.023.022-.004-.01.002-.041.005a.357.357 0 01-.041.002c-.013 0-.056 0-.11-.013a.495.495 0 01-.354-.672.513.513 0 01.097-.154c.043-.047.086-.074.097-.082.017-.011.032-.018.04-.022l.03-.015-.023.008.352.936a1.058 1.058 0 00.102-.042.498.498 0 00.235-.259.501.501 0 00-.355-.673c-.054-.012-.097-.012-.11-.012l-.043.001-.048.007-.014.002a.242.242 0 01-.042.006c-.023.001.029-.007.102.035a.347.347 0 01.128.132c.035.061.04.116.04.144h-1zm81.793 10.762a.73.73 0 00-.416.123.694.694 0 00-.27.361c-.082.249-.026.508.05.706l.934-.358a.35.35 0 01-.024-.084c-.002-.012.003.009-.01.05a.314.314 0 01-.119.153.272.272 0 01-.145.049v-1zm-.636 1.19l.049.134.013.04.004.014-.001-.008a.437.437 0 01.007-.149.476.476 0 01.635-.336c.02.009.032.016.032.017l-.011-.008-.035-.027a8.071 8.071 0 01-.291-.255l-.671.742c.133.12.247.221.336.293.045.035.094.073.145.104.03.019.14.089.287.099a.523.523 0 00.548-.406.64.64 0 00-.005-.284 2.516 2.516 0 00-.109-.328l-.933.358zm.402-.578c-.297-.269-.282-.476-.276-.493l-.937-.351c-.219.586.12 1.204.542 1.585l.671-.741zm-.276-.493c.039-.105.079-.218.1-.315a.717.717 0 00.012-.234.53.53 0 00-.747-.422.882.882 0 00-.162.087 3.614 3.614 0 00-.285.215l.63.777c.104-.084.166-.132.202-.155.02-.013.012-.006-.013.004a.442.442 0 01-.306.001.477.477 0 01-.311-.377.395.395 0 01-.002-.082l.002-.016.001-.003v-.002.001l-.001.003-.003.011a2.226 2.226 0 01-.054.156l.937.351zm-1.082-.669a1.913 1.913 0 01-.184.139c-.013.007.019-.014.08-.026a.449.449 0 01.515.359c.004.029.001.039.004.013.004-.051.02-.14.053-.293l-.978-.21c-.032.151-.06.294-.071.411a.982.982 0 00.002.216c.009.07.042.23.184.358a.55.55 0 00.474.129.756.756 0 00.235-.09c.101-.058.212-.145.316-.229l-.63-.777zm.468.192c.034-.158.063-.299.077-.406a.988.988 0 00.01-.198.588.588 0 00-.036-.172.523.523 0 00-.613-.327.609.609 0 00-.181.079.94.94 0 00-.155.132 4.741 4.741 0 00-.263.305l.773.634c.104-.127.167-.201.206-.241.023-.023.014-.011-.016.008a.4.4 0 01-.132.056.477.477 0 01-.555-.294.424.424 0 01-.026-.115c-.002-.027.002-.034-.003 0a4.741 4.741 0 01-.064.329l.978.21zm.806-.764c.24.202.449.403.592.56.072.08.118.139.141.174.013.018.01.017.003.001-.003-.009-.012-.03-.019-.062a.444.444 0 01-.001-.163l.985.173a.61.61 0 00-.044-.339 1.104 1.104 0 00-.092-.166 2.77 2.77 0 00-.232-.289 7.314 7.314 0 00-.689-.654l-.644.765zm.715.512c-.028.162.017.3.05.379.036.087.086.167.136.233.1.135.235.265.384.372l.582-.814a.762.762 0 01-.165-.156c-.016-.022-.018-.03-.014-.02.002.006.009.022.013.048.005.025.01.07 0 .127l-.986-.169zm.57.984a1.753 1.753 0 01.113.086l-.003-.003-.009-.01a.466.466 0 01-.106-.264.489.489 0 01.39-.514c.047-.009.082-.008.095-.008.027.001.038.005.021.001a2.093 2.093 0 01-.182-.053l-.306.953c.102.032.197.06.275.078a.868.868 0 00.15.02.53.53 0 00.396-.142.513.513 0 00.085-.64c-.044-.074-.099-.126-.123-.149a2.388 2.388 0 00-.214-.169l-.582.814zm.319-.764a1.188 1.188 0 00-.651-.039.737.737 0 00-.349.199.645.645 0 00-.181.452h1a.35.35 0 01-.098.24.282.282 0 01-.122.078c-.025.006.007-.007.095.021l.306-.951zM93.419 1.395c.189.17.405.31.616.388.105.039.23.07.365.07a.674.674 0 00.477-.19L94.17.954a.33.33 0 01.223-.102c.026 0 .025.005-.01-.008a.996.996 0 01-.294-.192l-.67.742zm1.458.267c.258-.258.218-.591.122-.797a1.14 1.14 0 00-.44-.472l-.526.85c.064.04.07.067.06.044a.25.25 0 01-.019-.124.336.336 0 01.096-.208l.707.707zM94.56.393a.427.427 0 01.152.216.463.463 0 01-.028.339.429.429 0 01-.135.161c-.052.037-.084.04-.046.03.026-.007.072-.017.143-.026.291-.04.821-.06 1.6-.057l.004-1c-.78-.004-1.37.016-1.737.066a2.227 2.227 0 00-.264.05.857.857 0 00-.277.12.573.573 0 00-.185.214.537.537 0 00-.032.395c.064.209.23.313.278.343l.527-.85zm1.685.663c.778.004 1.308.031 1.602.074.071.01.118.02.145.028.037.01.009.008-.04-.026a.45.45 0 01-.062-.667.287.287 0 01.052-.045l.535.845a.617.617 0 00.277-.36c.082-.313-.124-.52-.224-.59a.875.875 0 00-.274-.122 2.252 2.252 0 00-.265-.052c-.368-.054-.96-.081-1.74-.085l-.006 1zM97.942.42a2.38 2.38 0 00-.257.18.755.755 0 00-.135.147.543.543 0 00-.084.44.54.54 0 00.299.357.73.73 0 00.198.058c.094.015.206.018.31.02l.01-1a1.481 1.481 0 01-.165-.008c-.01-.001.023.002.072.025a.46.46 0 01.246.306.457.457 0 01-.062.368c-.027.04-.05.058-.042.05a1.57 1.57 0 01.144-.098L97.942.42zm.332 1.201c.206.002.412-.04.588-.116.15-.065.387-.203.488-.467l-.935-.355a.25.25 0 01.067-.103c.007-.006.004-.001-.017.008a.475.475 0 01-.182.033l-.009 1zm1.076-.584c-.067.178-.21.233-.212.234-.022.01-.025.007.011.001a2.29 2.29 0 01.36-.015c.339.006.817.05 1.36.133l.151-.988a11.677 11.677 0 00-1.495-.145 3.214 3.214 0 00-.53.027c-.074.012-.164.03-.25.068a.595.595 0 00-.33.331l.935.354zm1.519.353c1.071.165 2.224.318 2.552.335l.053-.998c-.268-.014-1.366-.158-2.453-.325l-.152.988zm2.551.335c.054.003.092.006.119.01.03.003.029.005.013 0-.006-.002-.096-.029-.175-.125a.444.444 0 01-.087-.397c.012-.044.029-.075.037-.09l.017-.025a.072.072 0 01-.01.01l-.032.032a5.23 5.23 0 01-.31.25l.609.794a5.79 5.79 0 00.376-.307c.048-.044.099-.094.143-.148a.696.696 0 00.136-.256.553.553 0 00-.105-.496.614.614 0 00-.291-.193 1.578 1.578 0 00-.386-.057l-.054.998zm-.428-.334c-.161.124-.353.24-.528.323a1.786 1.786 0 01-.223.091c-.067.022-.09.021-.079.021l.015 1c.236-.004.507-.108.719-.21.234-.112.486-.264.705-.432l-.609-.793zm-.83.435h-.025a.3.3 0 01.091.03.446.446 0 01.219.535c-.01.028-.021.049-.027.06a.116.116 0 01-.014.02l.021-.021c.037-.036.099-.088.195-.161l-.603-.798c-.11.084-.209.164-.288.241a.878.878 0 00-.229.331.561.561 0 00.007.397c.065.16.185.248.274.292a.862.862 0 00.394.074l-.015-1zm.46.463c.116-.088.219-.17.299-.248.041-.038.084-.083.122-.133a.687.687 0 00.117-.221.55.55 0 00-.048-.437.572.572 0 00-.285-.245 1.013 1.013 0 00-.373-.058v1c.031 0 .047.001.052.002.009 0-.015 0-.054-.016a.427.427 0 01-.207-.185.44.44 0 01-.042-.349c.019-.066.049-.102.049-.102l-.021.02a2.526 2.526 0 01-.212.174l.603.798zm-.168-1.342c-.258 0-.522.085-.737.18-.224.1-.442.23-.619.366a2.066 2.066 0 00-.247.221c-.067.072-.15.176-.201.303a.6.6 0 00.092.618.688.688 0 00.491.224l.062-.998c-.036-.002.094-.008.207.124.147.173.094.36.077.402-.016.04-.028.043.004.009.026-.028.067-.066.124-.11.115-.087.264-.178.415-.244a.937.937 0 01.332-.095v-1zm-1.221 1.912c.013 0-.026 0-.085-.022a.476.476 0 01-.147-.787c.027-.023.043-.03.03-.023-.054.03-.215.094-.492.173l.276.961c.286-.082.538-.17.696-.257a.859.859 0 00.151-.103.568.568 0 00.104-.12.521.521 0 00-.253-.775.717.717 0 00-.217-.045l-.063.998zm-.694-.659c-.317.091-.546.126-.7.124-.16-.001-.167-.04-.137-.01l-.707.708c.234.234.551.3.835.302.29.003.623-.058.985-.163l-.276-.96zm-.837.114c-.418-.418-.988-.345-1.43-.109l.472.882a.49.49 0 01.24-.071h.005v.001l.006.005.707-.708zm-1.43-.109c-.045.025-.2.068-.46.08-.24.012-.509-.006-.74-.054l-.204.978c.322.068.676.091.993.076.299-.015.636-.066.883-.198l-.471-.882zm-1.2.026l-1.005-.211-.205.979 1.006.21.205-.978zm-.998.766l.906-.203-.22-.976-.905.203.219.976zm.906-.203c.46-.104 1.346-.209 1.943-.228l-.032-1c-.647.021-1.596.132-2.13.252l.219.976zm1.943-.228c.342-.01.67-.057.927-.134.124-.037.26-.09.375-.165.088-.058.314-.23.314-.538h-1a.4.4 0 01.078-.24c.03-.04.057-.057.058-.057 0 0-.03.018-.111.042a2.804 2.804 0 01-.672.093l.031 1zm1.616-.837a.344.344 0 01-.1.252c-.017.015-.013.006.032-.012.086-.034.234-.069.419-.077l-.042-.999a2.317 2.317 0 00-.753.15 1.11 1.11 0 00-.324.194.663.663 0 00-.232.492h1zm.351.163c.15-.006.279-.015.382-.027a1.42 1.42 0 00.156-.027.652.652 0 00.223-.095.523.523 0 00.194-.246.51.51 0 00-.028-.425.541.541 0 00-.253-.24 1.607 1.607 0 00-.308-.104l-.249.968c.1.026.122.037.109.03a.45.45 0 01-.18-.183.486.486 0 01.148-.623.374.374 0 01.107-.053l.006-.002-.011.002-.035.005a4.16 4.16 0 01-.303.021l.042 1zm.365-1.164a2.125 2.125 0 00-.779-.024 2.623 2.623 0 00-.769.22l.434.9c.118-.056.288-.105.468-.129a1.18 1.18 0 01.399.001l.247-.968zm-1.547.195c-.122.059-.396.145-.769.23-.36.083-.772.157-1.146.2l.117.994c.413-.049.862-.129 1.253-.219.38-.087.748-.193.978-.303l-.434-.902zm-1.915.43c-.79.094-1.75.222-2.136.286l.163.986c.362-.06 1.303-.185 2.09-.278l-.117-.993zm-2.136.286c-.198.032-.27.035-.26.035.006 0 .025.002.05.007a.495.495 0 01.389.534c-.019.188-.135.293-.155.311a.432.432 0 01-.079.058l-.024.012.02-.007-.323-.946a1.24 1.24 0 00-.104.04c-.018.008-.095.04-.165.105a.505.505 0 00.25.875c.036.007.067.009.087.01.118.006.3-.018.477-.048l-.163-.986zm-.059.95c.227-.078.458-.2.603-.4a.67.67 0 00-.014-.828c-.16-.198-.397-.285-.595-.32a1.89 1.89 0 00-.71.021l.203.98a.906.906 0 01.331-.017c.033.006.047.012.047.012s-.007-.003-.016-.01a.231.231 0 01-.04-.04.331.331 0 01-.016-.384c.02-.027.03-.03.01-.016a.628.628 0 01-.126.056l.323.946zm-.716-1.527c-.405.084-.755.005-1.174-.325l-.619.786c.617.485 1.262.671 1.996.519l-.203-.98zM93.708.737a2.468 2.468 0 01-.368-.34c-.012-.014-.013-.017-.009-.01 0 .002.025.042.036.11a.46.46 0 01-.433.532l-.024-1a.54.54 0 00-.53.63c.017.1.056.178.082.223.029.05.062.097.094.137.121.153.313.33.534.504l.618-.786zm-.774.292c-.065.002-.09-.016-.046.001.03.012.077.035.138.071.12.072.264.177.392.293l.672-.741a3.56 3.56 0 00-.553-.411 2.048 2.048 0 00-.277-.14.899.899 0 00-.35-.073l.024 1zm3.522.76c.181.073.386.1.565.1.179 0 .384-.027.565-.1L97.21.862a.574.574 0 01-.19.027.576.576 0 01-.19-.027l-.375.927zm1.129 0a.814.814 0 00.156-.081.563.563 0 00.213-.266.524.524 0 00-.099-.531.592.592 0 00-.225-.156c-.1-.04-.208-.057-.292-.066a2.984 2.984 0 00-.317-.015v1c.091 0 .16.003.209.009.058.006.057.011.026 0-.01-.005-.083-.033-.152-.112a.471.471 0 01-.087-.48c.05-.135.144-.198.16-.208.026-.019.042-.024.034-.021l.374.928zM97.02.675c-.116 0-.224.004-.317.015-.084.009-.193.026-.292.066a.592.592 0 00-.225.156.524.524 0 00-.099.53.563.563 0 00.213.267.812.812 0 00.156.081l.374-.927c-.008-.003.008.002.035.02.015.011.109.074.16.21a.477.477 0 01-.088.479c-.07.079-.142.107-.152.111-.03.012-.032.007.026 0 .048-.005.118-.008.209-.008v-1zm-86.73 73.02c-.184.04-.346.078-.45.116a.73.73 0 00-.118.055.512.512 0 00-.254.357.506.506 0 00.308.56c.07.029.135.038.16.042.112.015.281.012.463.005.198-.007.46-.022.786-.045l-.068-.998c-.322.023-.573.037-.756.044a5.345 5.345 0 01-.216.005c-.058 0-.078-.003-.074-.002l.024.004a.48.48 0 01.236.14.494.494 0 01-.104.751c-.03.017-.05.023-.043.021a3.3 3.3 0 01.315-.077l-.21-.978zm.895 1.09a9.313 9.313 0 011.338.003c.193.016.352.037.471.063.139.029.164.05.138.033l.566-.825a1.416 1.416 0 00-.498-.187 4.935 4.935 0 00-.595-.08c-.437-.037-.966-.04-1.488-.004l.068.997zm1.947.099c.09.062.134.095.149.108.013.012-.018-.012-.05-.064a.486.486 0 01.286-.714.403.403 0 01.09-.013c.024 0 .031.002.008-.002a3.028 3.028 0 01-.236-.05l-.234.972c.123.03.235.055.325.068a.965.965 0 00.164.011.527.527 0 00.39-.168.514.514 0 00.055-.633.716.716 0 00-.134-.154 2.627 2.627 0 00-.247-.186l-.566.825zm.247-.735a2.642 2.642 0 00-.505-.05 10.912 10.912 0 00-.678.007 22.58 22.58 0 00-1.708.134l.115.993c.569-.066 1.152-.11 1.63-.128.24-.01.449-.011.614-.007.178.005.27.017.298.023l.233-.972zm-2.892.09c-.499.06-.88.105-1.116.14-.108.015-.22.034-.299.057a.521.521 0 00-.234.132.505.505 0 00.163.832.605.605 0 00.125.035c.083.015.201.02.316.023.129.003.298.004.509.004.42 0 1.019-.005 1.807-.014l-.01-1c-.79.009-1.383.014-1.797.014-.208 0-.368-.001-.484-.004-.13-.003-.171-.008-.168-.008l.024.005c.01.003.03.009.057.02a.496.496 0 01-.007.914l-.019.006s.042-.01.162-.027a44.84 44.84 0 011.087-.135l-.116-.993zm1.27 1.21c1.751-.019 2.728.014 3.232.126.265.058.264.112.229.06-.06-.088-.002-.144-.054-.008l.934.359c.09-.234.167-.586-.052-.91-.194-.288-.534-.41-.84-.478-.64-.141-1.745-.167-3.459-.15l.01 1zm3.407.178a.846.846 0 00-.021.599c.085.231.265.369.438.442.307.13.713.11 1.11.045l-.162-.986a2.354 2.354 0 01-.41.037.775.775 0 01-.114-.01c-.026-.004-.037-.008-.035-.008a.239.239 0 01.112.135c.032.087.004.137.016.105l-.934-.359zm1.527 1.086c-.096.016-.161-.007-.166-.008-.012-.005-.01-.005.012.007.04.023.106.068.194.138.174.14.39.34.603.562.212.22.41.449.551.638.071.095.12.17.15.224.043.078.009.047.009-.044h1a.937.937 0 00-.132-.437c-.06-.11-.14-.227-.226-.342a8.131 8.131 0 00-.632-.733 7.703 7.703 0 00-.698-.649 2.585 2.585 0 00-.327-.228 1.082 1.082 0 00-.188-.086.655.655 0 00-.312-.029l.162.987zm1.353 1.517c0 .239.11.467.207.626.108.176.257.353.426.493l.639-.769a1.057 1.057 0 01-.213-.248.636.636 0 01-.055-.107c-.01-.029-.004-.025-.004.005h-1zm.633 1.12c.081.067.16.158.214.245a.59.59 0 01.052.1c.01.026.001.017.002-.021l1 .013c.003-.24-.11-.47-.206-.623a2.076 2.076 0 00-.423-.484l-.639.77zm.268.323c0-.004 0-.027.01-.06a.41.41 0 01.088-.165.454.454 0 01.49-.128c.076.029.106.068.09.052a.552.552 0 01-.055-.075l-.84.543c.052.08.11.157.172.223a.771.771 0 00.279.193.546.546 0 00.618-.15.643.643 0 00.148-.418l-1-.015zm.622-.376a1.653 1.653 0 00-.165-.219.847.847 0 00-.242-.189.557.557 0 00-.603.058.6.6 0 00-.213.451l1 .038c-.001.011-.003.046-.02.093a.437.437 0 01-.139.196.444.444 0 01-.47.06c-.052-.026-.068-.05-.05-.03.011.012.033.04.063.085l.84-.543zm-1.223.101a.427.427 0 01.1-.251.459.459 0 01.36-.17c.087.002.144.03.155.035.017.008.021.012.011.005a1.87 1.87 0 01-.295-.323l-.793.61c.163.212.336.4.493.517.042.03.093.064.15.092a.63.63 0 00.262.065.541.541 0 00.43-.198.573.573 0 00.126-.344l-.999-.038zm.33-.704c-.178-.233-.386-.439-.602-.559a.847.847 0 00-.436-.117.636.636 0 00-.526.305l.85.525a.36.36 0 01-.29.17c-.078.002-.112-.024-.084-.01.049.028.158.117.296.296l.793-.61zm-1.564-.371a.757.757 0 00-.078.576c.034.15.103.29.175.413.146.246.364.503.594.73.233.227.5.445.76.603.13.078.27.15.412.197.135.046.312.084.5.052l-.172-.986c.044-.007.049.006-.009-.014a1.131 1.131 0 01-.212-.105 3.363 3.363 0 01-.579-.462 2.81 2.81 0 01-.434-.526.554.554 0 01-.062-.13c-.004-.017.023.07-.044.177l-.85-.525zm2.362 2.57c-.077.014-.088-.04-.02.035.067.074.147.214.21.413.13.411.127.869 0 1.132l.9.434c.278-.574.228-1.316.054-1.868a2.144 2.144 0 00-.42-.779c-.19-.212-.5-.42-.895-.352l.171.986zm.19 1.58c-.115.239-.217.613-.3.991-.088.394-.167.84-.225 1.254-.057.409-.097.803-.102 1.085-.003.126 0 .287.036.42.01.037.029.093.063.151.032.056.1.152.225.215.323.163.574-.06.624-.11l-.707-.707a.463.463 0 01.533-.076c.113.057.169.14.191.179a.365.365 0 01.036.084c.005.02-.004-.011-.001-.138.004-.222.037-.57.092-.964.055-.391.13-.812.21-1.176.084-.378.166-.65.226-.773l-.901-.435zm.321 4.007a.73.73 0 00.144-.219c.025-.056.047-.117.067-.178.04-.122.08-.275.12-.444.078-.34.16-.776.224-1.228l-.99-.143c-.061.43-.137.837-.209 1.145a4.596 4.596 0 01-.096.36.871.871 0 01-.028.079c-.012.026.004-.023.061-.08l.707.707zm.555-2.07l.231-1.603-.99-.142-.23 1.603.99.143zm-.763-1.675l-.006 2.206 1 .003.006-2.207-1-.002zm-.442 4.479a.94.94 0 01.002.348c-.007.03-.008.009.023-.029a.35.35 0 01.266-.118v1a.65.65 0 00.501-.24.922.922 0 00.178-.361c.059-.227.06-.495.018-.757l-.988.157zm.291.201c.087 0 .154.028.194.053a.24.24 0 01.06.049c.004.005-.013-.015-.038-.08a1.999 1.999 0 01-.11-.561l-.998.067c.021.315.083.619.177.859.046.118.11.245.199.353.08.097.252.26.516.26v-1zm-.393-.506l.498-.033v-.004-.01l-.003-.043-.01-.153-.033-.492-.064-.98-.998.063a508.437 508.437 0 00.107 1.628l.003.043v.014l.5-.033zm.388-1.715c-.02-.327.023-1.07.102-1.635l-.99-.138c-.084.598-.136 1.415-.11 1.835l.998-.062zm.102-1.634a6.29 6.29 0 00.067-.636.87.87 0 00-.001-.068.51.51 0 00-.135-.324.502.502 0 00-.812.098c-.036.063-.055.13-.062.151l-.032.124.972.234c.008-.036.014-.058.018-.07.008-.026 0 .008-.026.055a.495.495 0 01-.9-.094c-.019-.058-.02-.103-.021-.105v-.015c-.001.048-.017.215-.059.51l.99.14zm-.975-.656c-.008.034-.01.028.003.004.007-.015.07-.13.227-.182a.43.43 0 01.383.05c.045.032.058.058.043.036-.07-.1-.201-.392-.408-.98l-.944.331c.198.56.37.988.53 1.219.042.06.107.144.2.21.1.07.289.157.514.082a.601.601 0 00.335-.292c.045-.084.072-.171.089-.243l-.972-.235zm.248-1.073a13.35 13.35 0 00-.558-1.34c-.185-.38-.39-.75-.571-.95l-.741.672c.072.08.224.328.412.715.178.367.365.81.515 1.235l.943-.332zm-1.129-2.289a1.546 1.546 0 01-.24-.377.873.873 0 01-.09-.29h-1c0 .24.084.497.18.707.1.22.242.447.409.631l.741-.67zm-.33-.667c0-.217-.053-.535-.332-.73-.281-.198-.6-.135-.803-.056l.358.933c.035-.013.038-.009.016-.009a.26.26 0 01-.144-.05.256.256 0 01-.094-.114c-.007-.018-.001-.014-.001.026h1zm-1.135-.786c-.066.025-.079.023-.058.02a.385.385 0 01.307.14c.06.07.083.141.092.188.008.044.005.074.005.078-.001.006.002-.02.03-.092l-.934-.358a1.413 1.413 0 00-.09.334.646.646 0 00.141.505.62.62 0 00.525.203c.123-.01.242-.047.34-.085l-.358-.933zm.376.334c.073-.191.19-.591-.111-.903a.83.83 0 00-.418-.223c-.13-.03-.27-.039-.407-.039v1c.102 0 .157.007.182.013.027.007-.02.002-.076-.056a.31.31 0 01-.069-.108.257.257 0 01-.016-.087c0-.016.002-.02 0-.01a.449.449 0 01-.019.055l.934.358zm-.936-1.165c-.344 0-.732-.115-1-.263a.756.756 0 01-.218-.162c-.015-.02.078.109-.018.265l-.851-.526c-.208.337-.073.671.067.859.136.183.338.329.535.438.4.223.955.389 1.485.389v-1zm-1.236-.16c.187-.304.115-.628.024-.833a1.72 1.72 0 00-.416-.556 1.788 1.788 0 00-.592-.366c-.21-.074-.526-.123-.815.055l.525.851c-.08.05-.12.01-.042.037a.8.8 0 01.25.162c.093.084.152.167.175.222.029.064-.021.001.04-.097l.85.525zm-1.8-1.7a.81.81 0 00-.31.332.688.688 0 00-.03.525c.05.145.137.263.219.354.085.094.189.185.302.273l.614-.79a1.411 1.411 0 01-.175-.154c-.035-.04-.025-.04-.012-.003a.324.324 0 01-.018.23c-.035.072-.08.094-.064.084l-.525-.85zm.18 1.483c.135.105.226.177.283.226.03.025.038.034.036.032 0 0-.015-.016-.032-.04-.008-.013-.065-.095-.075-.222a.49.49 0 01.255-.47c.113-.062.215-.058.23-.058.05.001.076.011.047.003a4.326 4.326 0 01-.252-.082l-.327.945c.124.043.239.082.325.105a.818.818 0 00.189.03c.03 0 .144.001.264-.064a.51.51 0 00.176-.743.686.686 0 00-.07-.088 1.464 1.464 0 00-.116-.108 9.737 9.737 0 00-.318-.255l-.615.79zm.492-.61c-.37-.129-1.02-.22-1.48-.22v1c.38 0 .915.082 1.153.164l.327-.945zm-1.48-.22h-.763v1h.763v-1zm-.443.884l.713-.593-.64-.768-.713.593.64.768zm.712-.593c.155-.129.286-.241.384-.337.048-.048.098-.1.141-.156a.73.73 0 00.13-.25.557.557 0 00-.094-.49.608.608 0 00-.306-.207 1.5 1.5 0 00-.399-.047l-.018 1c.053 0 .09.002.117.005.029.002.025.004.005-.002-.01-.003-.11-.032-.192-.14a.449.449 0 01-.078-.384c.02-.071.051-.107.043-.096a.594.594 0 01-.05.053 5.762 5.762 0 01-.322.282l.64.77zm-.144-1.487c-.195-.004-.432.026-.623.153a.644.644 0 00-.272.37.627.627 0 00.078.493l.85-.525a.375.375 0 01.038.29.357.357 0 01-.141.206c-.033.021-.05.022-.033.018a.389.389 0 01.085-.006l.018-1zm-.817 1.017a.44.44 0 01-.027-.406c.045-.103.114-.15.119-.153.015-.01-.01.009-.118.04-.196.056-.51.112-.893.154-.768.085-1.7.103-2.3.015l-.145.99c.719.105 1.744.078 2.554-.01a6.735 6.735 0 001.062-.189c.128-.037.284-.09.408-.177a.643.643 0 00.228-.268.56.56 0 00-.038-.523l-.85.527zm-3.219-.35a1.869 1.869 0 01-.478-.127.535.535 0 01-.098-.053c-.018-.013 0-.005.022.033a.357.357 0 01.035.261.341.341 0 01-.131.202c-.027.018-.032.013.007.004.036-.009.095-.018.183-.022l-.045-.999c-.246.011-.511.055-.711.193a.661.661 0 00-.276.39.644.644 0 00.077.479c.124.211.345.343.53.426.204.091.456.16.74.203l.145-.99zm-.46.298c.102-.005.203-.012.288-.027.04-.007.1-.02.161-.044a.55.55 0 00.285-.25.522.522 0 00-.045-.558.631.631 0 00-.171-.155 1.574 1.574 0 00-.255-.123l-.368.93c.075.03.095.042.088.038a.416.416 0 01-.097-.094.482.482 0 01-.036-.506c.083-.158.219-.207.228-.21.031-.013.049-.015.038-.013-.02.004-.069.009-.16.013l.044 1zm.263-1.157c-.292-.115-.593-.048-.809.05a1.559 1.559 0 00-.602.495l.807.59a.56.56 0 01.21-.174.232.232 0 01.065-.021c.01-.001-.007.003-.038-.01l.367-.93zm-1.411.545c-.155.211-.187.186-.146.178.017-.004.01.003-.045-.01a1.653 1.653 0 01-.271-.111l-.434.901c.276.133.603.268.943.2.362-.07.591-.337.76-.568l-.807-.59zm-.462.057a7.813 7.813 0 01-.353-.176c-.037-.02-.03-.02-.008 0 .01.008.052.045.09.111a.479.479 0 01-.181.646c-.047.026-.084.036-.09.037-.015.004-.01.001.036-.003.086-.006.22-.01.428-.015l-.025-1c-.195.005-.363.01-.483.019-.057.004-.13.012-.2.03a.63.63 0 00-.155.06.521.521 0 00-.204.712c.044.08.1.132.128.157.06.052.128.092.174.118.1.056.245.126.409.205l.434-.9zm-.078.6c.27-.007.54-.054.77-.127.114-.037.229-.085.332-.145a.879.879 0 00.31-.287l-.85-.526c.036-.06.069-.07.036-.05a.714.714 0 01-.135.056 1.81 1.81 0 01-.488.08l.025.999zm1.412-.56c-.026.041-.045.048-.02.032a.575.575 0 01.105-.053c.104-.041.237-.072.364-.079l-.053-.998a2.202 2.202 0 00-.68.148c-.177.07-.427.199-.567.425l.85.526zm.449-.1a4.62 4.62 0 00.336-.027c.043-.005.097-.014.15-.029a.533.533 0 00.305-.203.51.51 0 00-.091-.703.69.69 0 00-.184-.106 2.563 2.563 0 00-.289-.089l-.251.968c.104.027.153.043.169.05.017.007-.028-.008-.083-.053a.489.489 0 01.093-.803.357.357 0 01.063-.024c.013-.004.013-.003-.013 0-.048.007-.13.014-.258.02l.053 1zm.228-1.157c-.308-.08-.697-.03-1.034.041a7.169 7.169 0 00-1.126.352c-.365.146-.721.32-.995.501-.135.09-.269.192-.374.307-.091.099-.237.287-.237.541h1c0 .132-.07.183-.027.136.028-.031.088-.082.189-.149.199-.131.489-.277.816-.408.325-.13.667-.238.963-.302.32-.069.51-.067.572-.05l.253-.969zM4.26 75.79c0 .218.073.446.242.615.176.178.431.26.693.203l-.216-.977a.254.254 0 01.232.069.187.187 0 01.043.065.104.104 0 01.006.025h-1zm.936.817c.033-.007.045-.008.041-.007h-.043c-.015-.002-.09-.007-.178-.054a.487.487 0 01-.257-.462c.011-.172.107-.275.122-.292.048-.052.088-.07.064-.056l.486.874a.746.746 0 00.188-.143.509.509 0 00-.131-.803.553.553 0 00-.22-.062.723.723 0 00-.113 0c-.059.006-.12.017-.177.03l.218.975zm-.252-.87c-.221.123-.329.338-.38.477a1.613 1.613 0 00-.097.482c-.007.151.005.331.063.495.05.138.217.464.611.464v-1a.389.389 0 01.268.108c.048.047.062.089.063.09.002.006-.002-.001-.004-.025a.62.62 0 01.031-.262c.008-.02.012-.025.008-.02a.228.228 0 01-.075.064l-.488-.873zm.197 1.918a.67.67 0 00.212-.038c.046-.015.09-.034.13-.053.081-.037.174-.086.27-.141.193-.111.426-.26.657-.423l-.575-.818c-.21.148-.418.28-.58.374-.082.047-.146.08-.19.1l-.03.013.021-.006a.395.395 0 01.085-.008v1zm1.269-.655c.482-.339.747-.341.932-.267l.37-.93c-.637-.253-1.268-.05-1.877.379l.575.818zm.932-.267l.604.24.37-.929-.604-.24-.37.929zm.77-.724l-.604.023.038 1 .604-.024-.038-.999zm-.604.023c-.238.01-.545.087-.83.18a6.129 6.129 0 00-.891.372l.462.887c.222-.116.49-.227.742-.309.262-.086.461-.127.555-.13l-.038-1zm-1.721.552c-.209.109-.352.18-.459.224-.113.046-.134.04-.11.04a.212.212 0 01.125.047s-.009-.008-.029-.036a1.878 1.878 0 01-.075-.118l-.857.517c.069.113.158.254.274.364.139.13.318.22.54.226a1.29 1.29 0 00.512-.115c.154-.064.335-.155.541-.262l-.462-.887zm-.548.157a14.815 14.815 0 00-.574-.902 2.122 2.122 0 00-.235-.283.847.847 0 00-.165-.127.598.598 0 00-.327-.082c-.367.018-.493.334-.523.424a1.365 1.365 0 00-.053.36c-.008.232.01.556.038.949l.997-.071a18.941 18.941 0 01-.03-.507 4.367 4.367 0 01-.005-.334.981.981 0 01.006-.085c.002-.02.004-.019 0-.005a.35.35 0 01-.076.124.435.435 0 01-.305.144.404.404 0 01-.22-.05c-.03-.017-.04-.03-.032-.021.016.016.054.059.117.147.125.174.296.447.53.836l.857-.517zm-1.84.339l.111 1.549.998-.071-.11-1.55-.998.072zm.833 1.066l-.942-.47-.446.895.942.47.446-.895zm-.942-.47a9.26 9.26 0 01-.492-.255 1.082 1.082 0 01-.073-.048l.007.007a.368.368 0 01.078.127.426.426 0 01-.042.373.327.327 0 01-.056.066c-.01.01-.016.012-.01.009a.98.98 0 01.093-.05 7.81 7.81 0 01.198-.09l-.408-.913c-.148.066-.311.138-.428.214a.757.757 0 00-.227.218.575.575 0 00-.06.514.694.694 0 00.212.29c.065.056.139.103.208.144.139.081.33.177.554.29l.446-.895zm-.298.139c.218-.097.423-.221.583-.352.079-.065.16-.142.225-.23a.707.707 0 00.152-.42h-1a.362.362 0 01.048-.18l-.015.017a.607.607 0 01-.045.04 1.623 1.623 0 01-.355.212l.407.913zm.96-1.002a.565.565 0 00-.397-.543.87.87 0 00-.378-.03c-.204.024-.44.1-.67.206l.413.91c.177-.08.31-.116.374-.123.04-.005.007.007-.06-.016a.435.435 0 01-.281-.403h1zm-1.446-.367c-.319.145-.647.333-.816.694-.159.338-.126.727-.069 1.11l.989-.148c-.059-.39-.032-.5-.015-.538.007-.014.036-.076.326-.208l-.415-.91zm-.885 1.805a8.1 8.1 0 01.054.412c.005.046.006.07.005.079l.002-.018a.481.481 0 01.314-.373.484.484 0 01.412.042c.06.036.093.075.1.084.012.013.017.022.016.02a2.164 2.164 0 01-.102-.2l-.904.43c.057.12.116.237.171.32.015.022.082.129.199.2a.516.516 0 00.743-.237c.05-.116.05-.232.05-.263 0-.056-.004-.117-.01-.176a8.976 8.976 0 00-.061-.469l-.989.149zm.8.047a2.724 2.724 0 00-.156-.292 1.066 1.066 0 00-.096-.13.644.644 0 00-.19-.15.534.534 0 00-.745.283.962.962 0 00-.06.341l1 .023c0-.071.009-.043-.016.018a.466.466 0 01-.632.226c-.07-.035-.106-.078-.108-.08-.007-.009-.006-.009.004.007.02.032.052.09.096.182l.904-.428zm-1.248.052c-.005.226.076.5.16.728.093.246.221.515.367.752l.852-.523a3.5 3.5 0 01-.282-.58 2.178 2.178 0 01-.078-.247.872.872 0 01-.016-.081l-.003-.026-1-.023zm.527 1.48c.068.111.133.209.191.288.05.066.124.16.213.227a.528.528 0 00.39.111.514.514 0 00.452-.435.664.664 0 00-.005-.225 1.296 1.296 0 00-.037-.149l-.956.295.01.032a.399.399 0 01.002-.115.486.486 0 01.662-.36c.043.018.071.038.084.047.035.027.033.036-.012-.025a3.03 3.03 0 01-.142-.214l-.852.523zm1.204-.182a1.128 1.128 0 01-.04-.502.606.606 0 01.103-.277c.035-.042-.028.056-.173.016-.114-.03-.08-.097-.007.093l.934-.359c-.113-.292-.314-.604-.667-.7-.385-.103-.69.111-.856.31-.328.395-.448 1.069-.25 1.712l.956-.293zm-.117-.67c.022.056.016.061.015.032a.387.387 0 01.144-.305.397.397 0 01.178-.087.274.274 0 01.08-.005c.01.001-.01 0-.075-.025l-.359.933c.1.038.213.074.33.087.104.01.31.013.49-.138a.616.616 0 00.21-.512 1.125 1.125 0 00-.08-.339l-.933.359zm.342-.39a1.256 1.256 0 00-.363-.09.62.62 0 00-.548.24.701.701 0 00-.12.495c.011.119.044.244.08.363l.955-.298a.982.982 0 01-.04-.163c-.001-.007.001.01-.004.04a.407.407 0 01-.263.302.324.324 0 01-.123.02c-.023-.002-.009-.005.068.025l.358-.934zm-.95 1.008a.938.938 0 01-.027.572L3 80.7c.13-.207.187-.463.205-.686a1.93 1.93 0 00-.07-.716l-.955.298zm-.027.572a.796.796 0 01-.045.066c-.01.013-.009.009.004-.002a.316.316 0 01.11-.057.383.383 0 01.206-.005c.061.016.1.043.114.054.015.011.016.015.005.002a1.558 1.558 0 01-.126-.194l-.865.503c.07.12.144.236.222.33.07.083.2.222.4.273a.64.64 0 00.576-.14c.107-.09.188-.206.246-.298l-.847-.532zm.268-.136a2.876 2.876 0 00-.149-.234.975.975 0 00-.206-.218.565.565 0 00-.607-.051.63.63 0 00-.292.375c-.052.167-.067.396-.073.633-.007.256-.004.59.006 1.004l1-.024c-.01-.412-.013-.724-.007-.954.003-.115.008-.203.015-.268.007-.07.014-.094.013-.093a.269.269 0 01-.028.06.422.422 0 01-.158.146.437.437 0 01-.46-.022c-.038-.027-.042-.043-.014-.003.023.031.054.08.095.151l.865-.502zm-1.32 1.51l.021.904 1-.024-.022-.905-1 .024zm.998.741l-.287-.905-.953.302.286.905.954-.302zm-.287-.905c-.15-.47-.153-1.344.063-2.59l-.985-.17c-.22 1.27-.258 2.347-.031 3.062l.953-.302zm.063-2.59c.168-.963.253-1.335.424-1.602.165-.257.435-.451 1.192-.925l-.53-.848c-.702.44-1.193.75-1.503 1.232-.305.474-.413 1.08-.568 1.972l.985.171zm1.616-2.528c.84-.525 2.21-1.065 3.572-1.449.676-.19 1.337-.34 1.915-.428.587-.09 1.052-.112 1.35-.072l.134-.991c-.442-.06-1.02-.02-1.636.075-.626.096-1.328.254-2.035.454-1.403.395-2.876.966-3.83 1.564l.53.847zm6.838-1.95l1.056.143.134-.99-1.057-.143-.133.99zm1.018-.841l-1.056.226.21.978 1.056-.226-.21-.978zm4.14 1.594a1.048 1.048 0 00-.831-.51.963.963 0 00-.874.465l.85.527.003-.004a.046.046 0 01-.03.011c-.006 0-.005-.002 0 .002a.104.104 0 01.032.035l.85-.526zm-6.843.952c.175.07.365.1.54.093.152-.006.396-.046.578-.228l-.707-.707a.294.294 0 01.095-.063c.01-.004.009-.001-.008 0a.33.33 0 01-.127-.023l-.371.928zm1.118-.135a.563.563 0 00.14-.595.601.601 0 00-.35-.344 1.41 1.41 0 00-.56-.072l.04.999c.138-.006.177.012.15.001a.33.33 0 01-.082-.048.434.434 0 01-.136-.19.438.438 0 01.09-.458l.708.707zm-.77-1.011c-.101.004-.2.013-.286.03a.895.895 0 00-.15.041.604.604 0 00-.21.135.529.529 0 00.018.772c.095.09.211.14.28.168l.371-.929c-.05-.02-.016-.014.036.034a.471.471 0 01.002.662c-.064.063-.125.087-.137.092l-.019.006c.018-.003.06-.01.136-.012l-.041-1zm5.05 1.781c.145.55.644.907 1.083 1.065.424.151 1.064.209 1.49-.217l-.707-.707c-.013.012-.154.087-.446-.018-.275-.098-.424-.27-.452-.376l-.967.253zm2.572.848a.92.92 0 00.2-.281.593.593 0 00-.037-.556.647.647 0 00-.384-.271 1.215 1.215 0 00-.317-.037v1c.055 0 .067.005.053.001-.002 0-.115-.028-.197-.159a.408.408 0 01-.037-.372c.02-.049.04-.06.013-.032l.706.707zm-.297-.058a2.863 2.863 0 00-.003.49c.007.065.02.15.05.233a.548.548 0 00.856.262.787.787 0 00.182-.2c.075-.114.143-.265.206-.43l-.934-.357a1.48 1.48 0 01-.11.24c-.01.016.007-.015.056-.052a.452.452 0 01.447-.048c.18.076.231.225.235.235.011.03.01.04.006.013a1.95 1.95 0 01.006-.311l-.997-.075zm-3.232 3.374c-.157-.253-.417-.372-.628-.431a2.743 2.743 0 00-.734-.085c-.519.001-1.145.095-1.762.244-.619.15-1.253.361-1.79.61-.514.24-1.02.55-1.29.935l.818.575c.11-.156.405-.375.894-.603a8.862 8.862 0 011.603-.545c.57-.138 1.114-.215 1.528-.216.21 0 .362.02.461.047.11.031.085.052.049-.005l.85-.526zM6.88 82.086c-.01.015-.011.014-.003.005 0 0 .043-.048.124-.083a.482.482 0 01.509.083c.13.116.147.256.148.269.008.054-.002.07.01.007.008-.047.024-.118.051-.212l-.962-.273a3.264 3.264 0 00-.074.31 1.003 1.003 0 00-.014.311.55.55 0 00.175.334c.2.179.437.14.56.086a.62.62 0 00.198-.143c.038-.04.07-.081.096-.12l-.818-.574zm.839.069c.038-.133.067-.258.083-.37a.983.983 0 00-.009-.382.603.603 0 00-.153-.275.565.565 0 00-.351-.166.726.726 0 00-.445.121l.526.85c.009-.005.002 0-.02.008a.364.364 0 01-.154.017.435.435 0 01-.267-.127.399.399 0 01-.104-.179c-.015-.056-.003-.076-.012-.01-.008.05-.025.13-.056.24l.962.273zm-.875-1.072a1.265 1.265 0 00-.397.401c-.09.144-.175.341-.175.557h1c0 .022-.004.03 0 .019a.333.333 0 01.097-.126l-.525-.851zm-.572.958c0-.05.014-.068.003-.045a.522.522 0 01-.053.09c-.059.081-.144.17-.236.236l.59.807a2.1 2.1 0 00.459-.461c.102-.144.237-.374.237-.627h-1zm-.286.281c-.254.186-.49.428-.538.83-.04.325.058.698.187 1.114l.955-.299c-.138-.44-.16-.614-.15-.695.001-.006-.016-.031.137-.143l-.59-.807zm-.35 1.943c.167.539.418 1.657.55 2.472l.987-.16c-.137-.844-.397-2.012-.583-2.61l-.955.298zm.55 2.472c.058.358.108.657.168.893.059.233.14.465.295.654.17.208.383.313.604.37.202.054.44.075.687.095l.08-.997a3.294 3.294 0 01-.513-.064.303.303 0 01-.072-.027.034.034 0 01-.012-.01c-.014-.017-.052-.077-.1-.266-.047-.186-.09-.44-.15-.808l-.987.16zm1.754 2.012c.184.015.346.023.48.022.124 0 .267-.008.39-.044a.63.63 0 00.271-.154.54.54 0 00.147-.51.613.613 0 00-.165-.29 1.014 1.014 0 00-.157-.126l-.556.831c.02.014.016.013.003 0-.006-.006-.07-.069-.098-.186a.46.46 0 01.123-.43c.076-.075.151-.095.155-.096.016-.004-.011.004-.118.005-.095 0-.226-.005-.395-.019l-.08.997zm.966-1.102l-.023-.016c.003.002.035.033.063.094a.423.423 0 01-.113.49c-.044.034-.057.025.036 0 .077-.02.192-.043.353-.066l-.146-.99a4.286 4.286 0 00-.463.09c-.114.03-.271.08-.398.18a.577.577 0 00-.182.706c.081.18.237.29.318.344l.555-.832zm.316.502a4.43 4.43 0 01.397-.045.62.62 0 01.073 0c.013 0-.018 0-.067-.022a.424.424 0 01-.215-.224.414.414 0 01-.018-.278c.012-.04.025-.057.017-.043a.71.71 0 01-.047.06l.769.64c.065-.079.17-.21.217-.366a.588.588 0 00-.016-.4.577.577 0 00-.304-.304 1.03 1.03 0 00-.458-.062 5.401 5.401 0 00-.493.054l.145.99zm.14-.551c-.07.084-.144.182-.196.284a.647.647 0 00-.039.533c.1.254.329.337.433.365.116.03.24.036.345.036v-1c-.081 0-.101-.006-.09-.003.001 0 .165.04.241.233.036.09.033.168.024.216-.007.044-.02.07-.02.07a1.265 1.265 0 01.072-.096l-.77-.638zm.543 1.218c.191 0 .387-.035.554-.11a.869.869 0 00.261-.174.641.641 0 00.192-.4l-.996-.084a.36.36 0 01.099-.224c.028-.029.047-.035.038-.03a.409.409 0 01-.148.022v1zm1.007-.684c.01-.12.062-.657.115-1.196l-.995-.098c-.053.536-.106 1.081-.116 1.21l.996.084zm.115-1.196a2.75 2.75 0 00-.019-.793.834.834 0 00-.182-.39.573.573 0 00-.343-.185.575.575 0 00-.387.083l.527.85a.426.426 0 01-.285.056.426.426 0 01-.254-.133c-.066-.073-.066-.129-.054-.075.016.076.026.245.002.49l.995.097zm-.93-1.286c.071-.044.2-.08.34-.026a.33.33 0 01.168.135c.013.023-.012-.017-.012-.15h-1c0 .215.034.454.144.646.055.096.159.232.338.3a.612.612 0 00.547-.054l-.525-.85zm.496-.04c0-.207.093-.298.162-.33.068-.033.197-.047.355.084l.638-.77c-.427-.353-.966-.433-1.42-.219-.453.214-.735.68-.735 1.235h1zm.517-.246c.077.064.1.093.103.1 0 0-.004-.006-.008-.02a.111.111 0 01-.005-.028c0-.005.001.023-.032.11a3.597 3.597 0 01-.171.366l.887.461c.09-.172.166-.33.22-.475.054-.143.098-.303.096-.472-.004-.398-.249-.643-.452-.812l-.638.77zm-.114.529c-.13.25-.23.518-.285.755a1.747 1.747 0 00-.049.36c-.001.1.007.277.107.438l.85-.527c.054.088.043.149.043.105 0-.025.006-.075.023-.15.034-.147.103-.336.2-.521l-.889-.46zm-.227 1.552a.323.323 0 01-.044-.113c-.005-.026-.004-.042-.004-.045 0-.005 0 .014-.017.056a1.095 1.095 0 01-.201.307l.74.672c.17-.186.306-.4.39-.608a1.21 1.21 0 00.085-.344.735.735 0 00-.099-.45l-.85.525zm-.266.206c-.114.125-.386.263-.837.346a5.36 5.36 0 01-1.436.045c-.498-.048-.94-.155-1.243-.295-.348-.161-.318-.266-.318-.216h-1c0 .592.504.94.898 1.123.438.203 1.002.329 1.567.384.57.055 1.176.041 1.713-.057.516-.095 1.058-.285 1.397-.66l-.741-.67zm-3.834-.12c0-.18-.057-.432-.119-.653a7.456 7.456 0 00-.259-.765l-.928.373c.087.216.167.453.224.66a3.633 3.633 0 01.079.353l.003.032h1zm-.378-1.418c-.072-.179-.149-.498-.206-.885a7.497 7.497 0 01-.084-1.13l-1-.011a8.49 8.49 0 00.095 1.287c.061.413.151.824.267 1.112l.928-.373zm-.29-2.015l.016-1.357-1-.012-.015 1.358 1 .011zm-.978-1.439l-.252 1.645.988.152.252-1.645-.988-.152zm-.252 1.645c-.193 1.254-.191 1.974.26 2.617l.818-.574c-.201-.287-.282-.636-.09-1.891l-.988-.152zm.26 2.617c.1.143.192.305.256.445.033.07.055.128.069.17.016.052.01.051.01.016l1 .004c0-.12-.03-.237-.057-.322a2.493 2.493 0 00-.114-.288 4.033 4.033 0 00-.345-.599l-.82.574zm.335.631c0-.006-.005-.155.118-.29a.473.473 0 01.58-.095.26.26 0 01.028.02l-.015-.016a3.28 3.28 0 01-.322-.468l-.859.511c.155.26.31.484.44.629.034.037.074.078.118.114a.66.66 0 00.214.122.527.527 0 00.557-.145.561.561 0 00.14-.378l-1-.004zm.39-.85c-.302-.505-.449-1.192-.409-2.29l-.999-.036c-.044 1.188.107 2.097.548 2.839l.86-.512zm-.409-2.29c.033-.88.205-1.801.39-2.373a2.73 2.73 0 01.125-.33c.044-.09.06-.096.034-.072a.368.368 0 01-.187.087.425.425 0 01-.333-.085.353.353 0 01-.087-.102c-.002-.004.004.008.013.047l.973-.23a1.243 1.243 0 00-.08-.24.707.707 0 00-.196-.257.576.576 0 00-.458-.12.636.636 0 00-.322.164 1.24 1.24 0 00-.259.377 3.693 3.693 0 00-.176.455c-.214.665-.4 1.678-.436 2.643l1 .037zm-.045-2.828c.028.118.065.248.123.362.056.111.17.283.392.358a.694.694 0 00.53-.046c.116-.056.224-.137.317-.215l-.638-.77a1.344 1.344 0 01-.115.085l.015-.006a.359.359 0 01.39.142l-.012-.035a1.372 1.372 0 01-.029-.105l-.973.23zm1.362.459c.169-.14.312-.318.415-.495.096-.166.193-.392.193-.624h-1c0-.02.004-.017-.006.013a.895.895 0 01-.24.336l.638.77zm.608-1.12c0 .175-.108.243-.056.196.026-.024.086-.067.19-.122.204-.109.504-.224.847-.31l-.244-.97a4.923 4.923 0 00-1.072.397 1.956 1.956 0 00-.394.265c-.086.079-.27.266-.27.545h1zm.98-.236c.399-.1.771-.23 1.054-.366.139-.066.275-.143.385-.23a.923.923 0 00.172-.173.617.617 0 00.126-.366h-1c0-.128.055-.208.07-.228.018-.025.028-.03.014-.018a1.163 1.163 0 01-.199.113c-.21.1-.516.21-.865.298l.244.97zm1.737-1.135a.642.642 0 00-.202-.48.656.656 0 00-.475-.165c-.228.01-.47.116-.68.228l.473.882c.088-.047.155-.077.204-.095.052-.02.062-.016.042-.015a.348.348 0 01-.24-.098.361.361 0 01-.122-.257h1zm-1.356-.417a1.535 1.535 0 01-.406.145.848.848 0 01-.154.019c-.042 0-.039-.006-.009.005l-.353.936c.236.089.512.06.711.021a2.54 2.54 0 00.682-.244l-.471-.882zm-.569.17s.14.049.203.226a.4.4 0 01-.049.374c-.024.032-.036.032.002.008a1.05 1.05 0 01.16-.075l-.368-.93c-.202.08-.442.2-.585.386a.602.602 0 00-.102.57.635.635 0 00.386.376l.353-.936zm.315.533c.142-.056.443-.111.877-.143.418-.03.91-.036 1.4-.02.491.017.97.057 1.364.114.42.062.667.135.75.182l.496-.868c-.266-.152-.688-.242-1.1-.303-.44-.064-.958-.106-1.476-.124a14.535 14.535 0 00-1.506.022c-.443.032-.876.093-1.172.21l.367.93zm1.662.42c.2.053.438.074.655.074.218 0 .455-.02.655-.073l-.253-.968c-.09.024-.236.041-.402.041-.165 0-.31-.017-.401-.04l-.254.967zm1.588-.126c.119.191.304.32.467.4.169.082.373.139.58.139v-1a.361.361 0 01-.2-.073c-.011-.01-.007-.009.004.008l-.85.526zm1.047.539c.03 0 .036.009.022-.001a.242.242 0 01-.087-.198h1a.763.763 0 00-.343-.624 1.042 1.042 0 00-.592-.177v1zm.477-1.209a10.164 10.164 0 00-.601-.256 1.666 1.666 0 00-.468-.12.615.615 0 00-.385.1.555.555 0 00-.24.48c.004.12.043.22.069.278.029.065.065.13.101.188l.85-.526a.633.633 0 01-.037-.067c-.007-.016.015.025.017.098a.445.445 0 01-.195.375c-.12.082-.231.073-.235.073-.017-.001.023.001.17.057.13.049.307.125.54.23l.414-.91zm-4.85.662a3.95 3.95 0 00-.868.366.972.972 0 00-.325.303.576.576 0 00-.076.416c.04.194.167.31.264.37l.524-.852c.055.034.159.121.192.281a.424.424 0 01-.05.305c-.04.066-.073.07-.002.027.11-.068.329-.166.637-.261l-.296-.955zm-1.006 1.454c.22.137.478.144.664.12.203-.025.416-.097.603-.215l-.535-.845a.494.494 0 01-.193.068.245.245 0 01-.058.002c-.01-.002.01-.001.045.02l-.526.85zm3.296-1.106c0-.05-.002-.123-.014-.2a.673.673 0 00-.131-.306c-.199-.253-.494-.252-.635-.241-.16.013-.358.06-.585.122-.235.065-.539.157-.925.277l.295.955c.389-.12.678-.208.896-.268.226-.062.342-.085.398-.09.076-.005-.1.031-.232-.138a.33.33 0 01-.067-.144c-.002-.01 0-.006 0 .033h1zm8.378.648c-.007.27.027.545.092.777.032.116.076.233.135.34.053.097.144.23.29.32l.526-.85c.063.039.076.076.06.047a.638.638 0 01-.048-.128 1.688 1.688 0 01-.056-.48l-1-.026zm-7.18-.308a.574.574 0 01-.19.026.576.576 0 01-.19-.026l-.374.927c.181.073.386.1.565.1.179 0 .384-.027.565-.1l-.375-.927zm3.838 2.375c0 .223.048.45.125.642.07.174.196.403.414.538l.526-.85c.033.02.04.035.029.02a.404.404 0 01-.04-.08.765.765 0 01-.054-.27h-1zm.54 1.18l.005.004a.193.193 0 01.045.054.17.17 0 01.016.033c.002.006-.002-.004-.002-.028h1a1.03 1.03 0 00-.164-.53 1.185 1.185 0 00-.375-.384l-.526.851zm.064.063c0 .033-.008-.018.036-.094a.41.41 0 01.34-.203.343.343 0 01.145.026l.008.005-.017-.013a.632.632 0 01-.043-.039c-.157-.153-.393-.493-.585-.934l-.917.4c.226.517.526.978.802 1.249.071.07.153.138.242.192.08.05.22.118.395.113a.59.59 0 00.5-.304.804.804 0 00.094-.398h-1zm-.116-1.252l-.411-.944-.917.399.41.944.918-.399zm-1.37-.751l-.011.88 1 .014.011-.881-1-.013zm1.154 2.372c-.29 0-.468.204-.532.284a1.68 1.68 0 00-.214.371 4.302 4.302 0 00-.273.969l.986.167c.05-.302.128-.563.204-.736a.744.744 0 01.079-.148c.005-.006-.006.01-.037.031a.38.38 0 01-.213.062v-1zm-1.02 1.624c-.05.299-.13.557-.208.729a.713.713 0 01-.083.146c-.03.035.045-.078.224-.08l.012 1c.276-.004.453-.186.528-.275.093-.11.168-.243.228-.375a4.05 4.05 0 00.286-.978l-.986-.167zm-.068.795a.669.669 0 00-.4.126.548.548 0 00-.185.624c.048.14.14.239.198.292.066.064.144.122.225.174l.542-.841a.576.576 0 01-.078-.057c-.018-.017.028.019.058.106a.452.452 0 01-.154.498.397.397 0 01-.192.078l-.014-1zm-.162 1.216c.09.058.101.076.093.065a.194.194 0 01-.037-.115c0-.003-.004.037-.057.156a6.25 6.25 0 01-.248.47l.87.492c.12-.21.218-.393.29-.55.068-.153.13-.324.143-.5a.809.809 0 00-.163-.555 1.323 1.323 0 00-.35-.304l-.54.84zm-.25.576a6.034 6.034 0 00-.374.777 2.04 2.04 0 00-.1.328.843.843 0 00-.015.198.563.563 0 00.16.376l.706-.71c.127.127.132.272.133.287.001.035-.004.052-.001.039.004-.022.019-.075.051-.16a5.04 5.04 0 01.311-.642l-.87-.493zm-.33 1.678a.538.538 0 00.557.126.719.719 0 00.222-.128c.091-.074.18-.174.256-.269.16-.197.344-.467.515-.743.172-.277.34-.576.463-.832.06-.127.116-.255.154-.37.02-.056.038-.12.05-.184a.73.73 0 00.005-.259l-.985.174a.335.335 0 01-.004-.092v-.004.003a8.318 8.318 0 01-.533 1.037c-.16.258-.32.49-.443.641a1.704 1.704 0 01-.111.124l.004-.003.013-.009a.36.36 0 01.075-.034.462.462 0 01.47.115l-.707.707zm2.222-2.659c0 .004-.004-.03-.008-.121a9.555 9.555 0 01-.006-.31c-.001-.248.003-.557.012-.868l-.999-.031c-.01.322-.014.644-.013.904.002.238.008.48.029.6l.985-.174zm-.001-1.299c.005-.18.017-.325.032-.437a.964.964 0 01.044-.203c.015-.04-.008.052-.13.113a.356.356 0 01-.335-.003l.526-.85a.648.648 0 00-.634-.043.758.758 0 00-.356.413c-.098.245-.135.593-.147.98l1 .03zm-.388-.53c-.04-.024-.033-.043-.013.01a.96.96 0 01.049.276c.016.27-.022.64-.117 1.063-.19.852-.584 1.804-1.062 2.43l.795.607c.589-.77 1.03-1.868 1.243-2.818.107-.477.162-.947.139-1.342a1.932 1.932 0 00-.115-.578.993.993 0 00-.394-.498l-.525.85zm-1.143 3.78a6.703 6.703 0 01-.674.774c-.042.04-.076.069-.102.09-.029.021-.04.027-.035.025a.397.397 0 01.17-.034.456.456 0 01.416.3l-.939.343a.543.543 0 00.499.357.66.66 0 00.322-.083c.124-.065.247-.169.353-.268.225-.212.503-.528.785-.898l-.795-.607zm-.225 1.154a.872.872 0 00-.463-.482 1.274 1.274 0 00-.535-.114c-.168 0-.367.033-.543.133a.729.729 0 00-.384.637h1a.294.294 0 01-.05.162.226.226 0 01-.072.07c-.012.007-.014.006-.001.003a.281.281 0 01.163.015c.021.01-.026-.005-.054-.08l.94-.344zm-1.925.174c0 .248.128.448.236.57.117.135.275.25.454.323l.375-.927a.212.212 0 01-.079-.056c-.009-.01-.008-.012-.004-.003.004.007.018.04.018.093h-1zm.69.893c.05.02.066.03.062.027a.453.453 0 01-.175-.279.478.478 0 01.124-.419.43.43 0 01.162-.107c.042-.015.058-.012.013-.009l.07.998a.965.965 0 00.258-.05.57.57 0 00.219-.14.522.522 0 00.137-.46.547.547 0 00-.152-.283.71.71 0 00-.127-.1 1.42 1.42 0 00-.217-.106l-.374.928zm.187-.787c.06-.004.077.012.018-.01a1.386 1.386 0 01-.191-.092c-.16-.09-.35-.223-.522-.372l-.656.755c.22.191.464.363.687.488.11.063.225.119.334.16.096.034.242.08.398.069l-.069-.998zm-.695-.474l-.712-.62-.656.755.712.62.656-.755zm-1.173.24l.679.187.266-.964-.68-.187-.265.964zm.68.187c.236.066.49.098.718.053a.783.783 0 00.381-.186.652.652 0 00.212-.484h-1a.342.342 0 01.185-.302.184.184 0 01.02-.007l.007-.002-.02.002c-.013 0-.03 0-.054-.002a1.061 1.061 0 01-.184-.036l-.266.964zm1.31-.617c0-.422-.329-.822-.8-.822v1a.188.188 0 01-.2-.178h1zm-.8-.822c.022 0 .097.003.184.051a.447.447 0 01.213.273.398.398 0 01.005.2c-.008.029-.016.044-.014.04a1.45 1.45 0 01.224-.264c.274-.272.64-.54.87-.628l-.359-.933c-.417.16-.9.539-1.216.852a2.27 2.27 0 00-.406.511.822.822 0 00-.07.179.605.605 0 00.001.305c.04.145.135.267.267.34a.617.617 0 00.3.074v-1zm1.481-.328c.284-.108.486-.34.61-.563.127-.23.206-.511.2-.796l-1 .021a.598.598 0 01-.075.29c-.053.097-.1.117-.092.114l.357.934zm.81-1.359c-.007-.319.103-1.17.256-1.879l-.977-.211c-.157.728-.289 1.672-.28 2.11l1-.02zm.256-1.879c.107-.492.17-.891.149-1.196a1.06 1.06 0 00-.146-.492.827.827 0 00-.414-.337l-.359.933a.175.175 0 01-.076-.067c-.018-.03-.007-.033-.003.033.01.146-.02.417-.128.915l.977.211zm-.411-2.025c.064.024.088.062.086.058a.348.348 0 01-.035-.094 1.8 1.8 0 01-.025-.586l-.996-.092c-.031.335-.017.658.053.928.061.239.207.584.559.72l.358-.934zm.026-.621a4.03 4.03 0 00-.028-.943c-.04-.27-.119-.588-.274-.807l-.815.58c-.001-.002.017.026.04.103.023.07.044.163.06.272.033.219.042.473.02.701l.996.094zm-.302-1.75a3.11 3.11 0 00-.172-.225.784.784 0 00-.121-.115.511.511 0 00-.83.442.874.874 0 00.022.153c.018.078.047.175.08.28l.953-.305a2.689 2.689 0 01-.057-.195c-.005-.019 0-.005.001.026 0 .014.002.06-.012.117a.486.486 0 01-.614.353.453.453 0 01-.141-.07c-.033-.025-.048-.044-.036-.03.017.02.052.064.112.149l.815-.58zm-1.02.535c.026.082.04.144.046.188.006.045.003.058.005.047a.28.28 0 01.072-.138.36.36 0 01.24-.117c.065-.005.1.013.094.01a.36.36 0 01-.064-.042 1.864 1.864 0 01-.32-.347l-.8.6c.167.222.338.405.507.537.147.114.38.257.65.24a.64.64 0 00.435-.21.726.726 0 00.174-.379c.034-.22-.013-.464-.087-.695l-.952.306zm.073-.399l-.542-.723-.8.6.542.723.8-.6zm-.942.077h.92v-1h-.92v1zm.92 0c.307 0 .606-.046.848-.144.195-.079.57-.287.58-.72l-1-.026a.286.286 0 01.076-.192c.016-.016.013-.007-.031.012-.09.036-.252.07-.474.07v1zm1.429-.865c0 .004-.001.074-.052.16a.435.435 0 01-.31.204.358.358 0 01-.184-.019c-.017-.007-.019-.01-.001.002.08.057.232.207.41.432.173.216.342.465.466.69.062.113.108.212.137.291.033.088.033.12.033.113h1c0-.165-.046-.327-.095-.46a3.232 3.232 0 00-.199-.425 6.14 6.14 0 00-.559-.832c-.193-.243-.416-.485-.618-.627a1 1 0 00-.195-.109.646.646 0 00-.334-.046.566.566 0 00-.409.271.671.671 0 00-.09.33l1 .025zm3.14.326c.072.117.16.227.252.314a1 1 0 00.168.13c.052.03.17.095.324.095v-1a.409.409 0 01.192.048c.015.009.015.011.003 0a.599.599 0 01-.089-.113l-.85.526zm.744.54a.574.574 0 00.399-.165.701.701 0 00.153-.223 1.04 1.04 0 00.081-.415h-1c0 .03-.006.034.004.012a.303.303 0 01.068-.094.427.427 0 01.295-.116v1zM1.011 84.262c.027.687.156 1.617.304 2.09l.954-.297c-.11-.357-.234-1.191-.258-1.832l-1 .039zm.729 1.372a5.164 5.164 0 00-.088-.331.895.895 0 00-.066-.16.511.511 0 00-.692-.216c-.157.082-.218.218-.23.246a.636.636 0 00-.04.118c-.013.053-.02.108-.024.154-.01.094-.018.223-.026.376l1 .05c.007-.155.013-.258.02-.322.004-.034.006-.04.003-.03 0 .004-.007.031-.023.068-.008.016-.063.144-.213.224a.493.493 0 01-.533-.048c-.076-.06-.11-.125-.116-.135-.018-.032-.021-.049-.012-.02.014.043.035.125.068.26l.972-.234zm-1.166.187c-.012.253.026.547.086.814.061.268.154.55.275.775l.881-.472a2.232 2.232 0 01-.18-.524 2.163 2.163 0 01-.063-.543l-.999-.05zm.36 1.589c.066.122.105.203.126.255l.01.026c0-.001-.013-.05-.001-.123a.446.446 0 01.43-.37c.034 0 .051.006.039.002a.685.685 0 01-.06-.02l-.355.935c.083.031.218.08.357.082a.554.554 0 00.577-.472.679.679 0 00-.013-.26 1.188 1.188 0 00-.056-.174 3.789 3.789 0 00-.172-.353l-.881.472zm.543-.23a.734.734 0 00-.598.017.812.812 0 00-.377.437c-.11.275-.153.679-.176 1.16l1 .047c.01-.237.026-.423.046-.567.02-.148.042-.228.057-.264.017-.042 0 .03-.1.08a.312.312 0 01-.19.03l-.016-.005.354-.935zm-1.15 1.615c-.02.405-.008.765.044 1.026.023.116.066.286.172.424a.577.577 0 00.771.147l-.525-.85a.423.423 0 01.548.095c.041.054.032.078.015-.01-.028-.144-.044-.41-.027-.786l-.999-.046zm.988 1.597a.844.844 0 00.29-.326c.056-.106.1-.224.132-.34.066-.234.104-.512.104-.788h-1c0 .192-.028.379-.067.518a.727.727 0 01-.05.138c-.02.035-.006-.009.065-.053l.526.851zm.526-1.454c0-.219.136-.59.329-.882a1.4 1.4 0 01.166-.207l.018-.014-.01.005a.333.333 0 01-.16.027.37.37 0 01-.289-.175l.867-.499a.63.63 0 00-.5-.323.731.731 0 00-.452.126c-.19.123-.352.323-.475.509-.246.373-.494.939-.494 1.433h1zm.054-1.246c.348.604.519.931.579 1.1.013.038.014.049.012.04 0-.004-.01-.064.02-.147a.416.416 0 01.207-.23c.075-.037.134-.036.14-.036v1c.07 0 .183-.009.3-.066a.584.584 0 00.294-.328.687.687 0 00.03-.329 1.217 1.217 0 00-.06-.238c-.098-.272-.32-.683-.655-1.265l-.867.499zm.957.727c-.486 0-.804.419-.804.834h1a.15.15 0 01-.041.1.21.21 0 01-.155.066v-1zm-.804.834c0 .293.167.54.43.65.23.096.473.065.666-.01l-.36-.933c-.035.014 0-.013.08.02a.306.306 0 01.184.273h-1zm1.095.64c-.09.035-.13.007-.056.026.054.013.139.044.249.099.218.108.485.283.737.499l.65-.76a4.754 4.754 0 00-.944-.635 2.277 2.277 0 00-.453-.174.91.91 0 00-.54.012l.357.934zm.93.624c.295.252.608.485.878.658.134.086.265.163.384.22.095.046.255.117.42.123l.033-1c.066.003.075.022-.018-.023a2.837 2.837 0 01-.279-.161 7.35 7.35 0 01-.768-.577l-.65.76zm1.68 1.001c-.028-.001-.027-.007.014.01a.997.997 0 01.142.07c.116.068.24.162.339.26l.706-.707a2.756 2.756 0 00-.54-.416c-.164-.096-.397-.208-.625-.216l-.036.999zm.494.34c.148.148.336.299.537.363a.62.62 0 00.513-.05.592.592 0 00.278-.516h-1a.41.41 0 01.204-.339c.16-.097.3-.05.309-.048.024.008.02.011-.013-.012a.983.983 0 01-.12-.105l-.708.707zm1.328-.203c0 .125-.074.181-.078.184-.008.006.008-.007.049-.007v-1c-.218 0-.437.06-.615.183a.781.781 0 00-.356.64h1zm-.03.177c.024 0 .026.004.013 0a.247.247 0 01-.099-.068.353.353 0 01-.093-.225.298.298 0 01.039-.168l.85.526a.705.705 0 00.11-.402.647.647 0 00-.178-.417c-.186-.198-.447-.246-.641-.246v1zm-.14-.461a.603.603 0 00.04.714.842.842 0 00.408.257c.234.072.536.094.817.09.29-.004.608-.037.89-.1.254-.058.584-.162.797-.375l-.707-.707c.003-.004-.076.053-.31.106a3.458 3.458 0 01-.684.076 1.871 1.871 0 01-.506-.046c-.055-.017.005-.012.07.068a.398.398 0 01.035.443l-.85-.526zm2.952.586c-.031.031-.045.027 0 .012a.913.913 0 01.19-.032c.176-.015.398-.003.62.032.223.037.414.093.535.15.062.029.08.046.077.042a.289.289 0 01-.073-.201h1a.72.72 0 00-.23-.516 1.281 1.281 0 00-.348-.23 3.11 3.11 0 00-.802-.232 3.67 3.67 0 00-.86-.042 1.897 1.897 0 00-.41.076.992.992 0 00-.406.234l.707.707zm1.35.003c0 .352.262.554.415.638.179.097.393.145.603.15l.02-1a.35.35 0 01-.144-.028c-.006-.004.013.005.038.037a.327.327 0 01.067.203h-1zm1.018.788c.037 0 .021.004-.019-.009a.438.438 0 01-.276-.301c-.06-.214.052-.361.061-.373.023-.03.036-.038.015-.021-.09.069-.324.195-.667.342-.328.14-.712.28-1.069.385-.37.109-.665.166-.833.168l.012 1c.313-.004.719-.096 1.103-.209.397-.116.819-.27 1.18-.424.347-.148.686-.317.885-.47a.914.914 0 00.176-.174.568.568 0 00.1-.493.564.564 0 00-.376-.38.944.944 0 00-.273-.041l-.019 1zm-2.788.191c-.513.006-1.472.056-2.14.112l.083.996a36.3 36.3 0 012.069-.108l-.012-1zm-2.14.112c-.612.05-1.448-.031-2.107-.171a3.721 3.721 0 01-.73-.218c-.082-.037-.08-.05-.054-.02a.356.356 0 01.081.17.41.41 0 01-.052.291l-.85-.525a.59.59 0 00-.08.426c.028.141.1.244.16.308.11.122.257.203.372.257.247.115.586.212.945.289.723.154 1.66.25 2.397.19l-.082-.997zm-2.862.053c.12-.195.116-.401.091-.544a1.417 1.417 0 00-.146-.404 3.402 3.402 0 00-.529-.714 4.14 4.14 0 00-.702-.602c-.225-.15-.53-.31-.842-.31v1c-.01 0 .013 0 .074.024.058.024.13.063.216.12.17.113.358.275.526.453.17.181.3.358.371.493a.479.479 0 01.047.114c.002.012-.014-.063.044-.157l.85.527zm-2.128-2.573c-.048 0-.085-.002-.111-.005-.027-.002-.037-.005-.036-.005.002 0 .022.006.05.025a.292.292 0 01.116.174c.002.015 0 .017.002 0a.665.665 0 01.013-.084c.008-.04.02-.089.037-.149l-.963-.27a2.207 2.207 0 00-.085.435c-.01.138 0 .325.107.501a.749.749 0 00.442.328c.142.041.293.05.428.05v-1zm.07-.043c.039-.136.07-.254.088-.348.01-.046.019-.101.022-.157a.546.546 0 00-.067-.32.514.514 0 00-.67-.216c-.104.048-.174.121-.196.145-.064.067-.131.158-.193.247l.819.573a2.768 2.768 0 01.091-.122l.007-.008-.02.018a.477.477 0 01-.391.088.486.486 0 01-.377-.409.333.333 0 01-.001-.055c0-.01 0-.006-.005.022-.01.053-.032.14-.069.27l.963.272zm-1.016-.65c-.064.092-.08.102-.062.087.008-.006.081-.068.207-.08a.456.456 0 01.39.154.385.385 0 01.071.125c.002.005-.001-.005-.005-.04a3.61 3.61 0 01-.013-.338l-1 .005c0 .17.005.321.019.443.007.061.017.129.035.195.016.057.05.162.132.258a.547.547 0 00.474.192.608.608 0 00.318-.136c.103-.083.19-.2.253-.29l-.819-.574zm.588-.092a1.345 1.345 0 01.055-.42c.015-.044.022-.044.005-.024a.356.356 0 01-.272.117v-1a.648.648 0 00-.5.247A1.077 1.077 0 001.56 89a2.322 2.322 0 00-.11.753l1-.005zm-.212-.327a.643.643 0 00.436-.168.694.694 0 00.203-.35 1.068 1.068 0 00-.06-.627l-.933.359c.027.07.01.078.022.03a.308.308 0 01.094-.15.358.358 0 01.238-.094v1zm.58-1.145a2.065 2.065 0 00-.115-.255.9.9 0 00-.193-.248.594.594 0 00-.88.097c-.117.147-.196.356-.256.547-.067.21-.136.48-.209.804l.976.22c.07-.315.132-.552.186-.722.06-.19.094-.237.085-.226-.006.008-.075.096-.22.122a.408.408 0 01-.337-.086c-.038-.032-.044-.054-.028-.025.013.024.032.065.057.13l.934-.358zm-1.653.945c-.1.445-.161.84-.068 1.21.098.39.344.673.637.947l.684-.728c-.26-.246-.326-.362-.351-.462-.03-.119-.026-.305.074-.747l-.976-.22zm.569 2.157c.214.202.468.382.709.514.219.12.506.244.77.244v-1c.002 0-.097-.016-.29-.121a2.571 2.571 0 01-.505-.365l-.684.728zm1.478.758c-.037 0-.018-.014.036.038a.41.41 0 01.11.187l.968-.253a1.41 1.41 0 00-.389-.659c-.174-.165-.427-.313-.725-.313v1zm.147.225a1.011 1.011 0 01.022.11v.008l.001-.011a.363.363 0 01.08-.178.381.381 0 01.316-.144c.038.004.037.012-.023-.017-.114-.055-.303-.178-.59-.398-.281-.216-.634-.507-1.068-.88l-.653.757c.44.38.81.684 1.112.916.296.227.552.403.762.505.102.05.232.101.373.113.156.014.38-.02.543-.218a.701.701 0 00.147-.465 1.536 1.536 0 00-.055-.351l-.968.253zm-1.262-1.51l-1.23-1.06-.653.757 1.23 1.06.653-.758zm-1.057-.671l.045-2.209-1-.02-.045 2.208 1 .02zm.045-2.209c.063-3.012.105-4.607.175-5.353a2.84 2.84 0 01.05-.356c.007-.03.008-.026-.003-.004-.004.009-.057.121-.202.187a.455.455 0 01-.436-.033.362.362 0 01-.076-.068l-.004-.005.006.01.018.032c.015.028.032.065.053.11l.91-.415a2.024 2.024 0 00-.17-.313.706.706 0 00-.183-.184.545.545 0 00-.527-.047.59.59 0 00-.285.282c-.036.074-.059.15-.074.214-.031.13-.054.298-.073.496-.074.793-.117 2.437-.178 5.427l1 .02zm-.419-5.48c.153.335.322 1.147.346 1.773l1-.039c-.027-.701-.21-1.655-.436-2.15l-.91.416zm13.456-.51c0 .443.36.802.802.802v-1c.11 0 .198.088.198.199h-1zm.802-.8a.803.803 0 00-.802.8h1c0 .111-.088.2-.198.2v-1zm-13.22 1.745a.812.812 0 00-.083-.156.563.563 0 00-.266-.212.524.524 0 00-.53.098.591.591 0 00-.157.225c-.04.1-.057.208-.066.292-.01.094-.015.201-.015.317h1c0-.091.004-.16.01-.209.006-.058.011-.056-.001-.026-.004.01-.033.084-.112.153a.472.472 0 01-.478.087c-.136-.05-.2-.144-.21-.16-.018-.026-.023-.043-.02-.035l.927-.374zm4.51.435c-.02.051-.014.016.035-.035a.471.471 0 01.662-.001c.063.062.086.123.09.135.008.02.009.028.007.019a1.002 1.002 0 01-.012-.135l-1 .041c.005.1.014.199.03.286a.888.888 0 00.043.149.604.604 0 00.134.211.529.529 0 00.772-.018.886.886 0 00.168-.28l-.928-.372zm5.913 3.302c-.005-.138.013-.177.002-.149a.328.328 0 01-.049.082c-.03.037-.09.099-.19.135a.438.438 0 01-.457-.09l.707-.707a.563.563 0 00-.595-.141.602.602 0 00-.345.35c-.068.17-.08.38-.072.56l1-.04zm7.867 2.136a2.194 2.194 0 01.055-.127l-.012.018a.477.477 0 01-.81-.115c-.012-.031-.014-.049-.011-.034.004.026.01.082.014.185l.999-.044a2.773 2.773 0 00-.026-.298.825.825 0 00-.041-.164c-.012-.03-.08-.218-.288-.309a.523.523 0 00-.562.096.678.678 0 00-.129.165 2.028 2.028 0 00-.12.262l.931.365zm-.764-.073a.289.289 0 01-.045.15c-.036.06-.068.074-.063.072l.357.934c.254-.097.443-.29.562-.49.122-.2.2-.45.188-.71l-1 .044zm-.109.222a1.268 1.268 0 00-.533.399 1.06 1.06 0 00-.24.644h1c0 .02-.005.026 0 .017a.273.273 0 01.133-.127l-.36-.933zm-.773 1.043a.368.368 0 01-.045.161c-.003.004.01-.016.046-.038l.525.851a.977.977 0 00.363-.448c.067-.156.11-.34.11-.526h-1zm0 .123a.435.435 0 01.578.13.226.226 0 01.024.046s-.007-.023-.015-.085a2.666 2.666 0 01-.017-.238c-.015-.41.015-1.089.097-2.06l-.997-.084c-.081.976-.117 1.705-.1 2.18.008.224.029.447.088.617.026.073.092.24.26.347.231.146.47.084.608-.002l-.526-.85zm.154-1.931c.068.188.134.351.199.486.061.127.137.263.234.368.08.087.327.308.664.185a.619.619 0 00.283-.215.888.888 0 00.113-.208l-.932-.365c-.005.014-.002 0 .017-.025a.383.383 0 01.177-.127.422.422 0 01.309.007c.067.03.1.066.104.07.005.005-.02-.023-.068-.124a4.326 4.326 0 01-.16-.392l-.94.34zM2.65 89.976c0 .12.04.216.06.259.023.053.052.102.079.142.052.082.12.168.19.252.142.168.328.363.516.545.189.182.39.361.564.499.086.068.175.133.258.183.041.025.09.052.144.075a.648.648 0 00.25.053v-1a.402.402 0 01.137.025c.008.003.005.003-.012-.008a1.732 1.732 0 01-.158-.114 6.836 6.836 0 01-.487-.432 6.731 6.731 0 01-.447-.47 1.678 1.678 0 01-.117-.152c-.01-.016-.01-.018-.005-.008l.014.04a.41.41 0 01.015.11h-1zm2.06 2.008a.259.259 0 01-.047-.004l-.01-.002a.468.468 0 01.131.086l.707-.707a1.44 1.44 0 00-.339-.248.978.978 0 00-.442-.125v1zm.074.08a.274.274 0 01-.06-.105.414.414 0 01.231-.508c.042-.016.066-.014.057-.014v1a.838.838 0 00.294-.05.613.613 0 00.325-.274c.198-.355-.044-.66-.14-.756l-.707.707zm.228-.627a.921.921 0 00-.546.174.73.73 0 00-.306.585h1c0 .127-.071.198-.1.22a.125.125 0 01-.035.018.047.047 0 01-.013.003v-1zm-.852.76c0 .287.193.453.316.523a.98.98 0 00.355.11c.215.029.472.013.728-.037l-.187-.982a1.41 1.41 0 01-.41.028c-.044-.006-.03-.01.008.012a.357.357 0 01.11.1c.047.065.08.15.08.246h-1zm1.4.596l.805-.153-.187-.983-.806.154.187.982zm7.277-2.93a.704.704 0 00-.11.403.647.647 0 00.177.416c.187.198.448.246.642.246v-1c-.023 0-.025-.003-.012.001.011.004.053.02.098.068.05.053.09.132.094.224a.299.299 0 01-.039.169l-.85-.526zm.709 1.065c.03 0 .041.01.033.004a.193.193 0 01-.063-.152h1a.813.813 0 00-.338-.649 1.057 1.057 0 00-.632-.203v1zm-.03-.148c0 .077.007.159.026.24a.69.69 0 00.133.278.56.56 0 00.464.21.596.596 0 00.39-.18l-.708-.707a.406.406 0 01.266-.112.44.44 0 01.364.158.314.314 0 01.065.123c.002.012 0 .01 0-.01h-1zm4.226.37a.447.447 0 01.113-.297c.01-.01.008-.005-.02.012a1.436 1.436 0 01-.24.117l.358.933c.153-.059.302-.131.42-.207.058-.036.124-.083.182-.14a.677.677 0 00.102-.127.552.552 0 00.085-.29h-1zm-7.136 1.567c.24.008.483-.028.685-.111a.937.937 0 00.312-.203c.099-.1.197-.26.197-.466h-1c0-.124.06-.205.09-.236.028-.027.042-.029.02-.02a.717.717 0 01-.274.037l-.03 1zm1.194-.78c0-.111-.01-.23-.04-.337a.685.685 0 00-.097-.216c-.05-.07-.249-.3-.572-.21l.267.964a.48.48 0 01-.513-.178.367.367 0 01-.05-.1c-.001-.005.005.022.005.077h1zm-.298 1.4c.205.003.4-.062.554-.146.153-.083.315-.212.424-.388l-.85-.526c.004-.007.004-.005-.007.005a.25.25 0 01-.096.052c-.015.004-.02.003-.012.003l-.013 1zm-.81.234c.103-.022.237-.054.346-.11.037-.02.19-.1.267-.28a.524.524 0 00-.117-.584.689.689 0 00-.212-.14 1.436 1.436 0 00-.167-.06 5.037 5.037 0 00-.413-.098l-.2.98a4.129 4.129 0 01.366.089l.013.005-.005-.003-.016-.008a.458.458 0 01-.187-.25.477.477 0 01.14-.492.371.371 0 01.07-.047c.025-.013.013-.003-.092.02l.207.978zm-3.69-1.225a4.854 4.854 0 00-.657.037c-.087.012-.183.029-.268.057a.69.69 0 00-.174.085.53.53 0 00-.234.435h1a.47.47 0 01-.257.421.206.206 0 01-.02.008c-.001 0 .025-.007.089-.016.12-.016.303-.028.515-.027l.006-1zM27.86 157.84a52.46 52.46 0 01-.078.396c-.01.056-.02.103-.028.14l-.01.044a.353.353 0 01-.003.015l.971.24c.017-.068.076-.365.13-.647l-.982-.188zm-.118.593a.473.473 0 01.419-.356.331.331 0 01.08.003l.02.005-.008-.003-.026-.012a.676.676 0 01-.078-.043l-.525.851c.11.068.232.129.349.164.051.016.144.04.252.033.094-.006.402-.063.486-.397l-.969-.245zm.408-.405c-.008-.005.018.009.044.052.03.049.042.105.039.151-.003.039-.013.051-.003.031a.665.665 0 01.079-.111l-.77-.639c-.137.166-.289.392-.304.66-.02.337.173.573.389.706l.526-.85zm.159.123c.114-.137.189-.219.235-.263.025-.023.023-.018.002-.005a.392.392 0 01-.088.036.441.441 0 01-.217.001.45.45 0 01-.326-.294c-.018-.057-.013-.091-.014-.068 0 .038-.011.124-.041.282l.982.188a2.87 2.87 0 00.059-.447.798.798 0 00-.033-.259.549.549 0 00-.824-.304.994.994 0 00-.182.139c-.096.09-.205.214-.323.355l.77.639zm77.794 8.569c.072.116.161.226.253.314.046.043.102.09.167.129a.64.64 0 00.325.096v-1c.065 0 .114.014.14.023a.28.28 0 01.052.025c.014.008.015.011.003-.001a.557.557 0 01-.089-.112l-.851.526zm.745.539a.574.574 0 00.399-.164.707.707 0 00.153-.223c.058-.132.081-.279.081-.415h-1c0 .03-.006.034.004.011a.292.292 0 01.068-.093.426.426 0 01.295-.116v1zm.633-.802c0-.469-.395-.802-.819-.802v1a.189.189 0 01-.181-.198h1zm-.819-.802c-.212 0-.498.092-.629.387-.117.266-.026.523.07.678l.851-.526a.16.16 0 01.02.063.338.338 0 01-.026.189.335.335 0 01-.286.209v-1zm.674 1.772c.027.01-.045-.01-.102-.106a.356.356 0 01-.05-.171.285.285 0 01.016-.109c.009-.026.01-.012-.044.049-.049.056-.124.13-.234.225l.655.756c.127-.111.239-.217.33-.319.085-.098.177-.219.23-.362a.665.665 0 00-.043-.579.778.778 0 00-.386-.313l-.372.929zm-.414-.112a3.173 3.173 0 00-.496.509.75.75 0 00-.082.139.597.597 0 00-.06.248.534.534 0 00.542.542.843.843 0 00.322-.072 2.21 2.21 0 00.266-.134c.185-.108.409-.262.658-.458l-.618-.786a4.867 4.867 0 01-.543.379.99.99 0 01-.144.074c-.044.019-.01-.003.065-.003a.468.468 0 01.452.472.387.387 0 01-.034.16c-.008.018-.014.025-.008.016.03-.042.126-.149.335-.33l-.655-.756zm1.15.774c.155-.121.289-.232.392-.333.09-.088.217-.224.276-.402a.63.63 0 00-.168-.66 1.164 1.164 0 00-.38-.219l-.358.934a.936.936 0 01.074.031c.013.008-.001.002-.025-.02a.366.366 0 01-.096-.165.372.372 0 01.003-.215c.014-.042.031-.061.025-.053a.46.46 0 01-.05.054 4.23 4.23 0 01-.311.262l.618.786zm.12-1.614a3.603 3.603 0 00-.461-.142 2.247 2.247 0 00-.215-.041.967.967 0 00-.24-.006l.116.993c-.035.004-.045-.001-.008.004a2.542 2.542 0 01.449.126l.359-.934zm-.916-.189a.608.608 0 00-.184.05.525.525 0 00-.132.87c.109.104.263.175.376.221l.372-.928a.667.667 0 01-.081-.038c-.021-.011-.004-.005.025.023a.444.444 0 01.087.122.48.48 0 01-.228.638c-.059.027-.106.033-.119.035l-.116-.993zm-16.353 3.977c-.02-.051-.023-.072-.023-.07 0 .002.003.019.001.048a.387.387 0 01-.043.147.441.441 0 01-.417.237c-.09-.006-.133-.041-.11-.026l.526-.851a.77.77 0 00-.344-.12.572.572 0 00-.3.06.553.553 0 00-.244.242.673.673 0 00-.058.408c.014.097.044.194.078.283l.934-.358zm15.795 3.522c.081.157.173.459.241.844.067.375.103.783.096 1.129l1 .021a7.007 7.007 0 00-.111-1.325c-.074-.418-.187-.838-.338-1.129l-.888.46zm.337 1.973a15.33 15.33 0 01-.024.65 2.172 2.172 0 01-.016.162c-.006.044-.008.029.008-.01.007-.016.038-.088.115-.156a.48.48 0 01.665.034c.026.029.038.052.039.053.002.004-.006-.01-.023-.057a3.184 3.184 0 01-.06-.174l-.952.305c.047.148.101.306.163.415a.67.67 0 00.085.122.543.543 0 00.27.167.517.517 0 00.473-.114.557.557 0 00.147-.206.959.959 0 00.06-.236c.01-.07.018-.15.024-.237.012-.175.019-.408.026-.697l-1-.021zm.704.502a1.993 1.993 0 00-.174-.424.643.643 0 00-.114-.137.523.523 0 00-.751.042.602.602 0 00-.107.18 1.863 1.863 0 00-.086.486c-.015.188-.026.436-.037.743l1 .034c.01-.304.021-.533.034-.697.007-.082.013-.141.02-.182.007-.048.01-.047.001-.022a.394.394 0 01-.073.118.477.477 0 01-.669.041c-.042-.037-.063-.071-.067-.076-.005-.009.019.036.071.199l.952-.305zm-7.632 7.209a7.471 7.471 0 01-1.005.204 1.985 1.985 0 01-.294.019c-.031-.001-.037-.003-.026-.001.006.002.026.006.052.018a.424.424 0 01.121.085l-.706.707c.114.115.25.151.31.165.074.017.15.023.215.026a3.14 3.14 0 00.447-.026c.325-.039.73-.119 1.146-.231l-.26-.966zm-1.151.325c.026.027.129.143.108.334a.418.418 0 01-.187.309c-.042.026-.067.028-.05.024a.52.52 0 01.085-.006v-1c-.163 0-.383.021-.562.132a.586.586 0 00-.28.432.59.59 0 00.179.482l.706-.707zm-.044.661c.215 0 .432-.051.613-.159.17-.102.39-.313.39-.642h-1c0-.078.028-.137.053-.172a.146.146 0 01.043-.044c0-.001-.007.004-.027.009a.285.285 0 01-.072.008v1zm1.004-.801a.9.9 0 00-.119-.48.654.654 0 00-.575-.305 1.326 1.326 0 00-.466.111 5.494 5.494 0 00-.5.242l.473.882c.176-.095.307-.158.403-.197.106-.043.127-.038.1-.038a.355.355 0 01-.282-.165.24.24 0 01-.036-.083c0-.004.002.004.002.033h1zm-1.659-.432c-.215.115-.606.156-1.19-.012l-.278.961c.7.202 1.395.224 1.94-.067l-.472-.882zm-1.19-.012l-.984-.284-.277.961.983.284.278-.961zm-1.096.696l.906-.049-.054-.998-.905.048.053.999zM107 175.102c.212 0 .498-.092.628-.387.118-.266.026-.523-.07-.678l-.85.526a.17.17 0 01-.021-.063.331.331 0 01.027-.189.335.335 0 01.286-.209v1zm.558-1.065a1.637 1.637 0 00-.252-.314 1.015 1.015 0 00-.168-.129.625.625 0 00-.324-.096v1a.417.417 0 01-.14-.023.25.25 0 01-.052-.025c-.015-.008-.015-.011-.003.001a.594.594 0 01.089.112l.85-.526zm-.532 3.754c-.02.051-.014.016.034-.035a.448.448 0 01.26-.133.475.475 0 01.402.131.385.385 0 01.091.137c.007.018.008.027.007.018a.898.898 0 01-.012-.135l-1 .041c.005.101.013.199.03.286a.98.98 0 00.042.149.609.609 0 00.135.211.527.527 0 00.453.151.549.549 0 00.318-.169.858.858 0 00.168-.28l-.928-.372zm.782-.017c-.006-.138.012-.176.001-.148-.005.011-.019.043-.049.081a.432.432 0 01-.19.136.436.436 0 01-.457-.091l.707-.707a.565.565 0 00-.595-.141.599.599 0 00-.344.35c-.069.171-.08.381-.073.561l1-.041zm-.695-.022a.29.29 0 01-.063-.095c-.004-.011-.002-.009-.001.007a.277.277 0 01-.023.127l.928.372c.07-.175.101-.365.094-.54-.006-.153-.047-.396-.228-.578l-.707.707zm-81.46-20.454c.103.072.224.146.351.189.1.033.402.11.641-.13l-.707-.707a.42.42 0 01.269-.123.29.29 0 01.115.012c.01.003-.019-.007-.094-.06l-.574.819zm.79-.57a.558.558 0 00-.363.477.731.731 0 00.063.353c.066.154.182.322.309.484l.788-.615a1.53 1.53 0 01-.177-.261c-.009-.021.022.035.013.132a.427.427 0 01-.083.215.432.432 0 01-.197.15l-.353-.935zm81.897 12.874c-.022-.492-.054-.863-.104-1.119a1.383 1.383 0 00-.12-.374c-.052-.099-.21-.343-.531-.343v1a.429.429 0 01-.274-.098c-.053-.044-.076-.087-.081-.095-.007-.014.006.007.024.101.035.179.065.487.087.972l.999-.044zm-.65-1.614a.621.621 0 00.351.565c.155.081.33.101.47.106l.037-.999a.645.645 0 01-.076-.007c-.012-.002.002-.001.03.013a.377.377 0 01.188.322h-1zm.853.671l.263-.006-.026-1-.264.007.027.999zM87.362.096l-.101-.995.101.995zM82.4.558l.09.996-.09-.996zm-5.493 12.978l.998.061-.998-.06zm-.193 3.152l.217.976.735-.164.046-.751-.998-.061zm-2.448.544l-.217-.976.217.976zM55.992 24.12l-.472-.881.472.881zm-2.847 1.525l-.719.695.525.543.666-.357-.472-.881zm-5.151-5.333l-.72.695.72-.695zm-5.605-5.319l-.031-1 .032 1zM26.99 27.048l-.71-.704.71.704zm-5.327 16.494l-.722.692.722-.692zm4.982 5.294l.754-.658-.754.658zm.958 1.098l.855.519.38-.626-.481-.55-.754.657zm-1.218 2.003l.855.52-.854-.52zm-7.85 17.373l.956.296-.956-.296zm-1.051 3.469l-.976-.222v.001l.976.221zm-7.276.11l-.027 1 .027-1zm-7.725.081l-.465-.885.465.885zM.708 80.623l-.992-.126.992.126zm-.292 22.321l-.993.119.993-.119zm14.427 5.173l.104-.995-.104.995zm1.82.19l.99-.136-.106-.777-.78-.082-.104.995zm.171 1.252l-.99.135.99-.135zm6.902 18.865l-.885.466.885-.466zm1.814 3.452l.691.723.546-.521-.351-.667-.886.465zm-2.22 2.12l-.69-.724v.001l.69.723zm9.803 29.624l.646-.764-.646.764zm5.8 3.567l-.355-.935.355.935zm5.457-4.804l-.692-.722.692.722zm5.105-4.75l.508.861-.508-.861zm3.79 1.791l-.508.861.509-.861zm7.008 3.642l-.412.911.412-.911zm12.1 4.291l.007-1-.007 1zm.4 7.37l1 .024-1-.024zm.194 7.868l-.808.59v.001l.808-.591zm8.188 1.841l.134-.991-.134.991zm26.064-.912l.707.707-.707-.707zm.603-7.877l1 .015-1-.015zm4.965-8.327l.24.971-.24-.971zm16.742-6.679l-.475-.88.475.88zm2.265-1.221l.722-.692-.527-.55-.67.362.475.88zm1.996 2.085l.722-.692-.722.692zm5.073 5.328l-.725.688.725-.688zm19.17-9.027l.711.703-.711-.703zm8.594-9.846l-.818-.574.818.574zm-1.693-4.6l.717-.697-.717.697zm.539-2.67l-.115-.993.115.993zm30.377-4.252l.14.99-.14-.99zm31.693-4.478l.139.99-.139-.99zm-43.207-.463l-.001 1 .001-1zm-46.225-.038l.001-1h-.407l-.292.284.698.716zm-2.671 2.604l.697.716-.697-.716zm-32.252 16.296l-.167-.986.167.986zm-18.562-.134l.18-.984-.18.984zm-26.41-11.648l-.617.788.617-.788zm-9.96-9.979l-.79.615.79-.615zm-11.832-27.459l.989-.153-.989.153zm-.126-16.443l-.99-.138.99.138zm8.703-23.673l-.84-.542.84.542zm17.498-17.55l.543.84-.543-.84zM85.4 34.72l.17.986-.17-.986zm17.807.009l-.169.986.169-.986zm31.673 15.687l-.691.723.691-.723zm2.394 2.288l-.691.723.289.276.4.001.002-1zm46.463.082l-.001 1 .001-1zm38.845-1.12l.131-.991-.131.991zm-41.384-5.747l.14-.99-.14.99zm-11.683-2.564l.804.595-.804-.595zm.125-1.938l.88-.474-.88.474zm-6.828-9.064l.762-.648-.762.648zm-16.375-14.62l-.02-1 .02 1zm-3.236 2.424l.685.729-.685-.729zm-5.354 4.999l-.68-.733.68.733zm-2.788 2.588l-.533.846.65.41.563-.523-.68-.733zm-1.438-.905l-.533.846.533-.847zm-18.473-8.37l.298-.954-.298.954zm-3.152-.982l-1-.012-.008.745.711.221.297-.954zm.068-5.993l1 .011-1-.01zm.228-7.2l.991.132-.991-.131zm-2.838-2.743l.185-.983-.185.983zM87.896 38.269l-.096-.996.096.995zm-26.19 9.854l.578.816-.577-.816zm-12.68 12.67l.82.574-.82-.573zm-5.78 53.168l-.92.389.92-.389zm11.667 17.055l.708-.707-.708.707zm13.741 10.056l-.453.891.453-.891zm35.868 4.878l.201.979-.201-.979zm9.597-2.932l.707-.707-.707.707zm-1.75.346l-.286-.958.286.958zm-10.821 1.56l.05.998h.001l-.051-.998zm-32.285-9.475l-.58.815.58-.815zm-11.599-11.178l-.796.605.796-.605zm-.04-63.409l.796.605-.796-.605zm11.639-11.23l-.58-.816.58.816zm42.512-8.06l.262-.965-.262.965zm-1.001-.76l-.305.952.305-.952zM25.94 156.89l.682-.731-.05-.048-.058-.04-.574.819zm.905.846l.789-.615-.049-.062-.057-.054-.683.731zm80.994 11.889h-1v.022l.001.022.999-.044zm0-1.446l-.026-1-.974.026v.974h1zm.69-.018l.036-1-.031-.001-.032.001.027 1zm.263-.007l.073.997-.073-.997zM87.26-.899c-.574.059-2.8.266-4.95.46l.18 1.993c2.147-.195 4.386-.403 4.974-.463L87.26-.9zm-4.95.46c-1.315.12-2.382.21-3.194.368C78.307.086 77.548.342 77 .94c-.55.6-.737 1.379-.82 2.198-.085.82-.079 1.889-.079 3.206h2c0-1.371-.003-2.31.068-3.003.07-.695.201-.936.306-1.05.105-.114.335-.266 1.023-.4.686-.133 1.624-.215 2.993-.338l-.18-1.992zM76.1 6.346c0 2.207-.087 5.422-.191 7.13l1.996.122c.108-1.758.195-5.015.195-7.252h-2zm-.191 7.13l-.193 3.152 1.996.122.193-3.152-1.996-.122zm.588 2.237l-2.448.544.434 1.952 2.448-.544-.434-1.952zm-2.448.544c-5.674 1.261-13.015 4.03-18.529 6.982L56.464 25c5.366-2.873 12.536-5.574 18.02-6.793l-.435-1.952zM55.52 23.238l-2.847 1.524.944 1.764L56.464 25l-.944-1.763zm-1.656 1.711l-5.151-5.333-1.439 1.39 5.152 5.333 1.438-1.39zm-5.151-5.333a130.052 130.052 0 00-3.802-3.793c-.513-.487-.955-.89-1.29-1.177a7.136 7.136 0 00-.453-.361 2.212 2.212 0 00-.229-.146 1.312 1.312 0 00-.18-.081 1.08 1.08 0 00-.401-.066l.063 2a.918.918 0 01-.435-.095c-.02-.01-.017-.01.017.014.065.046.17.13.32.257.296.252.708.629 1.211 1.106 1.003.951 2.331 2.272 3.74 3.732l1.439-1.39zm-6.355-5.623a2.2 2.2 0 00-.68.149c-.2.074-.415.173-.635.287-.44.228-.963.545-1.54.924-1.155.76-2.59 1.813-4.121 3.012-3.063 2.398-6.572 5.428-9.102 7.98l1.42 1.408c2.455-2.476 5.897-5.45 8.915-7.813 1.508-1.18 2.895-2.197 3.988-2.916.548-.36 1.006-.636 1.359-.818.177-.092.312-.152.41-.188.112-.042.115-.029.05-.027l-.064-1.998zM26.28 26.343c-2.545 2.567-4.906 5.194-6.636 7.334-.864 1.067-1.583 2.029-2.091 2.808a9.84 9.84 0 00-.62 1.07c-.135.28-.294.665-.294 1.052h2c0 .098-.024.065.096-.185.102-.212.264-.493.493-.845.456-.7 1.128-1.601 1.97-2.643 1.683-2.079 3.997-4.656 6.502-7.183l-1.42-1.408zm-9.64 12.264c0 .422.195.806.358 1.08.185.31.449.668.781 1.076.668.82 1.698 1.943 3.162 3.47l1.444-1.384c-1.461-1.524-2.443-2.598-3.056-3.35a7.553 7.553 0 01-.613-.836c-.135-.225-.077-.21-.077-.056h-2zm4.301 5.626c2.22 2.314 4.443 4.677 4.95 5.26l1.508-1.316c-.546-.625-2.807-3.026-5.014-5.328l-1.444 1.384zm4.95 5.26l.959 1.097 1.507-1.315-.958-1.098-1.507 1.315zm.858-.08l-1.218 2.004 1.71 1.038 1.217-2.003-1.71-1.039zm-1.218 2.004a78.702 78.702 0 00-7.95 17.595l1.91.593a76.702 76.702 0 017.75-17.15l-1.71-1.038zm-7.95 17.595c-.531 1.71-1.023 3.329-1.072 3.544l1.95.444.02-.074.068-.232.23-.77c.19-.626.444-1.45.714-2.319l-1.91-.593zm-1.073 3.545c.105-.461.475-.63.489-.637a.685.685 0 01.115-.046l.007-.002-.015.003-.046.007c-.04.006-.092.012-.16.018-.276.026-.71.045-1.316.054-1.203.019-2.994-.003-5.348-.065l-.053 2c2.362.062 4.186.084 5.431.065.619-.01 1.116-.03 1.472-.062.171-.016.348-.038.5-.075a1.44 1.44 0 00.312-.11c.058-.03.453-.222.563-.708l-1.95-.442zm-6.273-.668a151.492 151.492 0 00-5.33-.059c-.696.007-1.285.023-1.724.048a9.07 9.07 0 00-.571.046c-.08.01-.163.022-.243.039a1.353 1.353 0 00-.349.12l.929 1.772a.786.786 0 01-.149.062l.054-.008a7.16 7.16 0 01.44-.034c.396-.023.95-.038 1.634-.045 1.366-.014 3.21.004 5.255.058l.054-1.999zm-8.217.195c-.797.418-1.123 1.286-1.38 2.391-.273 1.18-.545 3.053-.922 6.02l1.984.253c.38-2.99.64-4.758.887-5.821.264-1.139.447-1.118.36-1.072l-.929-1.771zm-2.302 8.412c-.82 6.447-.96 17.004-.293 22.566l1.986-.238C.764 97.45.897 87.06 1.7 80.749l-1.983-.252zm-.293 22.566c.15 1.251.258 2.292.444 3.073.192.81.514 1.557 1.244 2.062.673.466 1.543.611 2.512.675.991.066 2.308.054 3.998.054v-2c-1.74 0-2.96.011-3.866-.049-.928-.062-1.314-.192-1.507-.325-.136-.094-.29-.269-.435-.879-.152-.638-.243-1.513-.404-2.849l-1.986.238zm8.198 5.864c2.98 0 6.177.086 7.118.184l.208-1.989c-1.061-.111-4.363-.195-7.326-.195v2zm7.118.184l1.82.19.208-1.989-1.82-.19-.208 1.989zm.933-.668l.171 1.251 1.982-.271-.172-1.252-1.981.272zm.171 1.251c.277 2.019 1.322 5.462 2.625 9.025 1.312 3.585 2.924 7.395 4.383 10.171l1.77-.931c-1.403-2.671-2.981-6.392-4.274-9.927-1.302-3.557-2.277-6.824-2.522-8.609l-1.982.271zm7.008 19.196l1.814 3.451 1.77-.93-1.814-3.452-1.77.931zm2.009 2.263l-2.22 2.119 1.381 1.447 2.22-2.12-1.381-1.446zm-2.22 2.12c-3.7 3.533-5.819 5.575-7.01 6.805-.592.61-.99 1.057-1.244 1.405-.246.339-.463.725-.463 1.191h2c0 .179-.092.222.08-.014.165-.226.478-.587 1.063-1.19 1.158-1.196 3.244-3.207 6.955-6.751l-1.381-1.446zm9.846 31.11c1.917 1.623 3.2 2.651 4.132 3.224.943.58 1.78.852 2.67.515l-.71-1.87c-.008.003-.143.124-.912-.348-.78-.48-1.947-1.405-3.887-3.048l-1.293 1.527zm6.801 3.739c.186-.071.365-.195.468-.268a9.9 9.9 0 00.462-.353c.344-.276.782-.65 1.282-1.09a120.49 120.49 0 003.583-3.306l-1.384-1.444a118.07 118.07 0 01-3.52 3.249c-.49.431-.903.782-1.214 1.032a9.066 9.066 0 01-.366.281c-.118.084-.105.061-.02.029l.71 1.87zm5.795-5.017a342.49 342.49 0 013.438-3.252c.46-.429.844-.781 1.123-1.032.14-.126.25-.223.329-.29.112-.097.097-.076.031-.037l-1.016-1.723c-.118.07-.251.185-.314.239-.098.083-.222.193-.367.324-.292.262-.684.623-1.149 1.055-.93.865-2.157 2.025-3.459 3.272l1.384 1.444zm4.922-4.611a.866.866 0 01-.372.12.503.503 0 01-.123-.002c-.019-.002.002-.001.078.024.147.048.377.141.693.291.624.295 1.485.759 2.497 1.358l1.018-1.721c-1.04-.616-1.96-1.115-2.66-1.446a8.386 8.386 0 00-.93-.384 2.466 2.466 0 00-.434-.104c-.09-.012-.442-.061-.784.142l1.017 1.722zm2.773 1.791c1.907 1.127 5.092 2.783 7.104 3.692l.823-1.822c-1.945-.879-5.065-2.501-6.91-3.592l-1.017 1.722zm7.104 3.692c1.878.849 4.675 1.931 7.123 2.799a79.51 79.51 0 003.29 1.098c.457.139.863.255 1.196.336.298.073.634.145.896.147l.014-2c.004 0-.116-.011-.433-.089-.283-.07-.651-.173-1.09-.307a77.456 77.456 0 01-3.205-1.07c-2.423-.86-5.161-1.92-6.968-2.736l-.823 1.822zm12.505 4.38c.054 0-.05.008-.185-.046a.735.735 0 01-.36-.309c-.041-.074-.035-.102-.018-.009.015.084.03.222.043.442.049.904.013 2.691-.072 6.269l2 .047c.083-3.525.123-5.421.069-6.425a5.792 5.792 0 00-.07-.683 1.962 1.962 0 00-.209-.622 1.274 1.274 0 00-.633-.565c-.241-.097-.466-.098-.55-.099l-.015 2zm-.592 6.347c-.065 2.769-.087 4.664-.056 5.918.015.625.044 1.117.092 1.491.024.186.055.365.1.527.04.148.11.355.25.545l1.614-1.18c.07.096.079.159.064.107a2.017 2.017 0 01-.044-.253 13.452 13.452 0 01-.077-1.286c-.03-1.2-.009-3.051.056-5.822l-1.999-.047zm.386 8.482c.285.39.742.617 1.13.77.43.169.985.325 1.66.477 1.355.304 3.332.623 6.07.994l.269-1.982c-2.732-.37-4.636-.679-5.9-.964-.634-.142-1.074-.271-1.365-.386-.332-.131-.322-.188-.25-.09l-1.614 1.181zm8.86 2.241c4.094.554 10.32.679 15.68.492 2.684-.094 5.178-.267 7.102-.509.959-.121 1.799-.262 2.459-.424.329-.081.634-.173.896-.28.241-.097.538-.243.769-.475l-1.414-1.414c.054-.054.055-.03-.107.036a4.567 4.567 0 01-.623.191c-.552.136-1.306.265-2.23.381-1.842.232-4.271.402-6.922.495-5.312.186-11.41.057-15.341-.475l-.269 1.982zm26.906-1.196c.27-.269.423-.596.522-.969.093-.352.152-.802.196-1.378.089-1.159.133-3.056.178-6.222l-2-.029c-.046 3.187-.089 5.015-.172 6.099-.042.545-.09.847-.136 1.019-.04.151-.058.122-.002.066l1.414 1.414zm5.101-15.94c4.79-1.187 11.852-4.006 16.976-6.769l-.949-1.761c-5.003 2.698-11.908 5.449-16.508 6.589l.481 1.941zm16.976-6.769l2.265-1.222-.949-1.76-2.265 1.221.949 1.761zm1.069-1.41l1.996 2.084 1.444-1.383-1.996-2.085-1.444 1.384zm1.996 2.084c1.096 1.146 3.378 3.542 5.07 5.325l1.451-1.376a2128.199 2128.199 0 00-5.077-5.332l-1.444 1.383zm5.07 5.325a41.937 41.937 0 002.428 2.385c.334.298.641.553.898.738.127.092.262.181.394.252.088.047.339.18.649.18v-2c.228 0 .359.091.293.056a1.584 1.584 0 01-.165-.109 10.355 10.355 0 01-.74-.611 40.53 40.53 0 01-2.306-2.267l-1.451 1.376zm4.369 3.555c.263 0 .512-.073.695-.139.201-.073.415-.172.633-.284a17.13 17.13 0 001.528-.922c1.149-.761 2.581-1.821 4.118-3.036 3.074-2.429 6.627-5.524 9.263-8.186l-1.421-1.407c-2.566 2.59-6.054 5.631-9.082 8.024-1.513 1.196-2.897 2.219-3.982 2.938-.545.361-.997.633-1.343.812-.173.09-.303.147-.394.18-.108.039-.098.02-.015.02v2zm16.237-12.567c3.439-3.472 6.999-7.546 8.702-9.974l-1.637-1.149c-1.61 2.295-5.081 6.277-8.486 9.716l1.421 1.407zm8.702-9.974c.27-.385.533-.804.67-1.264a2.356 2.356 0 00-.055-1.531c-.175-.476-.488-.933-.871-1.4-.388-.475-.902-1.023-1.539-1.677l-1.433 1.395c.634.651 1.096 1.146 1.425 1.549.335.409.481.661.541.824.044.121.041.183.015.269-.04.133-.142.332-.39.686l1.637 1.149zm-1.795-5.872c-.553-.569-.921-.958-1.145-1.241a1.615 1.615 0 01-.164-.235c-.013-.028.059.102.016.314a.666.666 0 01-.266.419c-.039.025-.027.007.107-.028.266-.069.697-.129 1.389-.209l-.23-1.986c-.654.075-1.235.148-1.662.259-.214.056-.468.14-.696.288a1.34 1.34 0 00-.602.861 1.49 1.49 0 00.136.936c.105.223.253.433.403.622.3.379.745.845 1.281 1.395l1.433-1.395zm-.063-.98c.953-.11 14.645-2.026 30.402-4.255l-.28-1.98c-15.783 2.232-29.432 4.142-30.352 4.249l.23 1.986zm30.402-4.255a97237.54 97237.54 0 0131.692-4.478l-.279-1.981c-1.66.234-15.922 2.249-31.693 4.479l.28 1.98zm31.692-4.478c.173-.025.337-.05.471-.078.065-.014.143-.032.22-.056.028-.008.233-.066.416-.223a1.016 1.016 0 00-.045-1.583c-.201-.153-.422-.198-.451-.204a3.653 3.653 0 00-.518-.069c-.762-.062-2.438-.105-5.429-.137-6.012-.064-17.49-.086-38.009-.103l-.002 2c20.524.017 31.99.039 37.99.103 3.015.032 4.612.075 5.288.13.177.014.235.026.229.024a.862.862 0 01-.309-.153.982.982 0 01.173-1.667.618.618 0 01.07-.026c.013-.005.007-.002-.029.005-.07.015-.182.034-.344.056l.279 1.981zm-43.345-2.453l-46.225-.038-.001 2 46.224.038.002-2zm-46.924.246l-2.671 2.604 1.395 1.432 2.672-2.604-1.396-1.432zm-2.671 2.603c-8.96 8.731-19.183 13.899-31.721 16.027l.335 1.971c12.931-2.194 23.526-7.546 32.781-16.565l-1.395-1.433zm-31.721 16.027c-2.187.371-5.613.547-9.092.522-3.477-.025-6.915-.25-9.124-.654l-.359 1.968c2.377.434 5.949.661 9.469.686 3.52.026 7.082-.15 9.441-.551l-.335-1.971zm-18.216-.132c-9.767-1.783-18.6-5.683-25.973-11.452l-1.233 1.576c7.643 5.979 16.78 10.005 26.847 11.844l.36-1.968zm-25.973-11.452c-2.661-2.082-7.712-7.142-9.788-9.805l-1.577 1.229c2.175 2.792 7.343 7.969 10.132 10.152l1.233-1.576zm-9.788-9.805c-6.166-7.913-10.088-17.015-11.631-26.998l-1.977.305c1.595 10.318 5.654 19.739 12.03 27.922l1.578-1.229zm-11.631-26.998c-.616-3.98-.679-12.19-.125-16.152l-1.98-.276c-.582 4.155-.517 12.562.128 16.733l1.977-.305zm-.125-16.151c1.127-8.06 4.292-16.666 8.553-23.27l-1.68-1.084c-4.424 6.856-7.688 15.738-8.854 24.077l1.98.276zm8.553-23.27c4.244-6.577 10.686-13.037 17.201-17.252l-1.086-1.679c-6.755 4.37-13.399 11.034-17.795 17.847l1.68 1.084zm17.201-17.252c6.665-4.31 14.137-7.172 22.507-8.608l-.338-1.971c-8.619 1.478-16.349 4.432-23.255 8.9l1.086 1.68zm22.507-8.608c1.986-.34 5.322-.518 8.717-.516 3.395.002 6.743.182 8.752.525l.337-1.972c-2.18-.372-5.663-.551-9.088-.553-3.424-.002-6.897.175-9.056.545l.338 1.97zm17.469.009c12.225 2.085 22.552 7.204 31.151 15.424l1.382-1.446c-8.9-8.507-19.595-13.8-32.196-15.95l-.337 1.972zm31.151 15.424l2.394 2.288 1.382-1.446-2.394-2.288-1.382 1.446zm3.083 2.565l46.464.082.003-2-46.464-.082-.003 2zm46.464.082c12.778.023 24.298.02 32.565-.004 4.133-.012 7.454-.029 9.713-.05 1.129-.01 1.997-.022 2.569-.035.283-.006.505-.013.651-.021.063-.003.148-.008.221-.018a1.2 1.2 0 00.204-.048 1 1 0 00-.087-1.925l-.475 1.943a1.006 1.006 0 01-.367-.177 1 1 0 01.452-1.775c.021-.003.015 0-.052.003-.115.006-.31.012-.592.018-.559.013-1.415.024-2.543.035-2.252.021-5.568.038-9.7.05-8.263.023-19.779.027-32.556.004l-.003 2zm45.836-2.101c-.297-.073-1.237-.22-2.433-.396-1.229-.18-2.803-.4-4.426-.614l-.262 1.983c1.615.213 3.179.431 4.398.61 1.251.183 2.068.316 2.248.36l.475-1.943zm-6.859-1.01c-6.756-.893-24.465-3.352-41.375-5.746l-.28 1.98c16.91 2.394 34.627 4.854 41.393 5.749l.262-1.983zm-41.375-5.746c-3.206-.454-6.16-.866-8.338-1.165-1.089-.15-1.985-.271-2.621-.356a90.58 90.58 0 00-.983-.124c-.028-.003-.125-.014-.205-.014v2c-.055 0-.087-.006-.012.002l.198.024c.175.021.424.053.74.095.631.084 1.523.204 2.611.354 2.174.299 5.126.711 8.33 1.164l.28-1.98zm-12.147-1.66c.145 0 .373.04.583.215.209.175.287.39.314.53a.767.767 0 01-.005.31l-.004.014.004-.009.011-.025a2.74 2.74 0 01.225-.354l-1.608-1.19c-.216.292-.412.613-.517.911-.043.12-.131.397-.072.713.035.185.132.436.369.635.239.2.506.25.7.25v-2zm1.128.68c.157-.211.317-.428.435-.627.125-.213.253-.489.275-.83.022-.34-.068-.63-.162-.857-.089-.214-.219-.454-.347-.692l-1.761.949c.144.266.219.409.261.511.038.09.007.053.013-.04.007-.097.043-.134-.002-.057-.054.09-.143.216-.32.455l1.608 1.189zm.201-3.006c-.409-.76-1.528-2.339-2.814-4.045a119.647 119.647 0 00-4.132-5.193l-1.524 1.295c1.26 1.481 2.771 3.391 4.059 5.1 1.307 1.736 2.326 3.19 2.65 3.792l1.761-.949zm-6.946-9.238c-2.474-2.91-6.227-6.605-9.543-9.566-1.66-1.481-3.226-2.793-4.482-3.738a18.818 18.818 0 00-1.667-1.144 5.49 5.49 0 00-.684-.351c-.192-.08-.475-.178-.781-.172l.039 2c-.117.001-.145-.031-.023.02.098.04.241.112.432.225.382.226.882.57 1.481 1.02 1.195.9 2.716 2.17 4.353 3.632 3.277 2.926 6.957 6.555 9.351 9.37l1.524-1.296zm-17.157-14.971a1.581 1.581 0 00-.53.111 3.08 3.08 0 00-.398.19 7.994 7.994 0 00-.834.558c-.6.45-1.336 1.081-2.139 1.835l1.37 1.458c.771-.724 1.447-1.302 1.968-1.692a6.13 6.13 0 01.614-.415c.074-.04.117-.06.133-.066.028-.01-.031.018-.145.02l-.039-2zm-3.901 2.694a1440.914 1440.914 0 01-5.349 4.995l1.36 1.466c1.535-1.425 3.946-3.676 5.359-5.003l-1.37-1.458zm-5.349 4.995l-2.789 2.588 1.361 1.466 2.788-2.588-1.36-1.466zm-1.575 2.475l-1.438-.906-1.066 1.693 1.438.905 1.066-1.692zm-1.438-.906c-5.789-3.647-11.481-6.224-18.708-8.477l-.596 1.91c7.08 2.207 12.611 4.714 18.238 8.26l1.066-1.693zm-18.708-8.477l-3.152-.983-.595 1.91 3.151.982.596-1.91zm-2.45-.017l.068-5.992-2-.023-.068 5.992 2 .023zm.068-5.993c.038-3.326.141-6.49.219-7.079l-1.982-.263c-.098.74-.2 4.055-.237 7.32l2 .022zm.219-7.079c.124-.933.12-1.942-.667-2.703-.355-.342-.801-.565-1.275-.731-.475-.167-1.046-.3-1.702-.424l-.371 1.965c.624.118 1.077.229 1.41.346.336.118.483.22.547.282.051.05.186.171.076 1.002l1.982.263zM109.639.567C106.976.063 102.356-.4 97.953-.69c-4.385-.288-8.689-.414-10.692-.209l.203 1.99c1.81-.185 5.95-.075 10.358.215 4.389.288 8.908.746 11.446 1.226l.371-1.965zm-21.84 36.706c-9.07.875-18.995 4.611-26.67 10.033l1.155 1.633c7.4-5.227 16.994-8.835 25.708-9.675l-.192-1.99zM61.13 47.306c-1.922 1.358-4.508 3.67-6.915 6.075-2.406 2.404-4.697 4.965-6.008 6.84l1.64 1.146c1.21-1.731 3.404-4.195 5.782-6.571 2.376-2.375 4.87-4.595 6.656-5.857l-1.154-1.633zM48.207 60.22c-11.362 16.247-13.52 36.075-5.88 54.129l1.841-.779c-7.368-17.411-5.295-36.513 5.678-52.204l-1.639-1.146zm-5.88 54.129c2.803 6.625 6.415 11.901 11.88 17.372l1.415-1.413c-5.298-5.304-8.759-10.369-11.454-16.738l-1.842.779zm11.88 17.372c4.706 4.713 8.297 7.342 13.995 10.241l.907-1.783c-5.502-2.799-8.923-5.301-13.487-9.871l-1.415 1.413zM68.2 141.963c11.353 5.776 24.098 7.511 36.522 4.966l-.402-1.959c-11.977 2.453-24.262.783-35.213-4.79l-.907 1.783zm36.522 4.966c1.524-.312 4.016-.999 6.083-1.63a59.2 59.2 0 002.665-.872c.335-.121.631-.236.846-.337a2.1 2.1 0 00.352-.2c.044-.031.194-.141.308-.331a1.02 1.02 0 00-.151-1.248l-1.415 1.414a.98.98 0 01-.149-1.195c.101-.168.225-.253.23-.257.044-.031.053-.03-.023.006-.129.06-.356.151-.679.268-.635.23-1.546.527-2.568.839-2.05.626-4.47 1.291-5.901 1.584l.402 1.959zm10.103-4.618a1.06 1.06 0 00-.69-.307 1.698 1.698 0 00-.281.003 4.62 4.62 0 00-.5.076c-.356.07-.806.184-1.272.323l.572 1.916c.421-.125.808-.222 1.088-.277a2.77 2.77 0 01.279-.045c.026-.002.006.001-.041-.002a.96.96 0 01-.569-.273l1.414-1.414zm-2.743.095c-2.406.718-6.496 1.313-10.585 1.519l.101 1.997c4.168-.209 8.435-.818 11.056-1.6l-.572-1.916zm-10.585 1.519c-10.806.542-22.734-2.957-31.656-9.292l-1.158 1.631c9.284 6.592 21.655 10.224 32.914 9.658l-.1-1.997zm-31.656-9.292c-3.256-2.311-9.04-7.886-11.381-10.967l-1.593 1.21c2.468 3.247 8.4 8.963 11.816 11.388l1.158-1.631zM58.46 123.666c-13.905-18.295-13.92-43.946-.041-62.199l-1.592-1.21c-14.425 18.97-14.407 45.61.04 64.619l1.593-1.21zm-.041-62.199c2.38-3.13 8.146-8.694 11.422-11.02l-1.158-1.63c-3.438 2.44-9.351 8.145-11.856 11.44l1.592 1.21zm11.422-11.02c8.314-5.903 19.418-9.402 29.868-9.402v-2c-10.854 0-22.365 3.622-31.026 9.771l1.158 1.631zm29.868-9.402c3.295 0 8.95.718 11.803 1.492l.524-1.93c-3.04-.826-8.873-1.562-12.327-1.562v2zm11.803 1.492c.873.237 1.517.393 1.929.47.173.033.407.073.606.063a1.15 1.15 0 00.308-.056 1.016 1.016 0 00.501-1.57 1.117 1.117 0 00-.229-.232 2.68 2.68 0 00-.527-.285 14.677 14.677 0 00-.706-.28 56.179 56.179 0 00-2.316-.787l-.61 1.904a53.83 53.83 0 012.229.758c.264.098.465.178.605.239.175.076.175.09.116.044a.847.847 0 01-.175-.18.977.977 0 01-.134-.895.976.976 0 01.614-.613c.118-.04.211-.043.231-.044.067-.004.053.006-.144-.031-.33-.062-.911-.2-1.774-.435l-.524 1.93zm-.434-2.677c-7.903-2.532-15.301-3.356-23.279-2.587l.192 1.99c7.697-.741 14.822.05 22.477 2.501l.61-1.904zM13.923 142.674c0 .3.11.583.181.753.087.206.206.435.34.674.271.479.65 1.069 1.096 1.723.894 1.31 2.1 2.933 3.36 4.55a114.561 114.561 0 003.728 4.551c.57.655 1.098 1.238 1.552 1.706.439.452.854.844 1.186 1.077l1.148-1.638c-.163-.114-.464-.385-.899-.832-.42-.433-.922-.986-1.478-1.625a113.156 113.156 0 01-3.66-4.469c-1.246-1.598-2.423-3.185-3.285-4.448a23.242 23.242 0 01-1.006-1.579 4.922 4.922 0 01-.24-.47c-.062-.145-.023-.107-.023.027h-2zm12.134 15.676c.846 1.085 3.301 3.384 6.43 6.033l1.292-1.527c-3.158-2.673-5.448-4.842-6.145-5.736l-1.577 1.23zm-.8-.73l.905.846 1.366-1.462-.906-.846-1.365 1.462zm83.585 18.042c.044-3.001.047-4.93-.004-6.082l-1.998.088c.048 1.084.046 2.954.002 5.965l2 .029zm-.003-6.038v-1.446h-2v1.446h2zm-.347-.465c.121.004.246 0 .373-.009l-.145-1.995a1.397 1.397 0 01-.155.005l-.073 1.999zm.373-.009c.765-.056 2.113-.347 4.182-.859l-.48-1.941c-2.118.524-3.287.765-3.847.805l.145 1.995zm-1 .027l.69-.018-.053-1.999-.689.018.052 1.999z"
                                        fill="#F60"
                                        mask="url(#a)"
                                    />
                                    <Path
                                        d="M127.626 66L90.36 110.366 74.542 90.669 70 96.02l10.246 12.068L90.36 120l10.049-11.836L132 70.954 127.626 66z"
                                        fill="#333"
                                    />
                                </Svg>
                            </View>
                            <Text style={styles.change_number_success_popup_title}>
                                Ваш пароль
                                успешно изменён
                            </Text>


                            {/*<TouchableOpacity style={styles.change_number_old_popup_confirm_btn} onPress={() => this.redirectToSignIn()}>*/}
                            {/*    <Text style={styles.change_number_old_popup_confirm_btn_text}>Войти</Text>*/}
                            {/*</TouchableOpacity>*/}
                        </ScrollView>
                    </View>
                </SafeAreaView>

            )

        }


        return (
            <SafeAreaView edges={['right', 'left', 'top']} style={styles.container} >
                <StatusBar style="dark" backgroundColor='#EFEFEF'/>

                <View style={styles.personal_area_header}>
                    <View style={styles.personal_area_header_btn_title_box}>
                        <TouchableOpacity style={styles.personal_area_header_btn} onPress={() => this.redirectToPersonalAreaExecutor()}>
                            <Svg
                                width={35}
                                height={35}
                                viewBox="0 0 35 35"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <Path
                                    d="M20.169 27.708a1.458 1.458 0 01-1.138-.54l-7.043-8.75a1.458 1.458 0 010-1.851l7.291-8.75a1.46 1.46 0 112.246 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.137 2.391z"
                                    fill="#000"
                                />
                            </Svg>
                        </TouchableOpacity>
                        <Text style={styles.personal_area_header_title}>Изменить профиль</Text>
                    </View>

                </View>

                {this.state.loaded_personal_info &&
                <View style={{backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: '100%', flex: 1, height: 667, position: 'absolute', top: 100, zIndex: 99999999999999999999999999999999999999999999999}}>

                    <ActivityIndicator size="large" color="#FF6600" />

                </View>
                }



                <View style={styles.avatar_img_edit_btn_wrapper}>
                    <View style={styles.avatar_img_wrapper}>
                        <Image style={styles.avatar_img} source={this.state.user_image ? {uri: this.state.image_path + this.state.user_image} : require('../../../assets/images/avatar.png')}/>

                    </View>
                    <TouchableOpacity style={styles.personal_area_edit_button} onPress={() => {
                        this.selectImage()
                    }}>
                        <Svg
                            width={50}
                            height={50}
                            viewBox="0 0 50 50"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <Rect width={50} height={50} rx={25} fill="#F0F0F0" />
                            <Path
                                d="M30.533 18.084l2.383 2.382m-.85-4.48l-6.443 6.443c-.333.332-.56.756-.653 1.217l-.595 2.979 2.979-.596a2.38 2.38 0 001.217-.652l6.443-6.442a2.086 2.086 0 00-2.949-2.95v0z"
                                stroke="#000"
                                strokeWidth={1.3}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <Path
                                d="M33.375 28.875v3.375a2.25 2.25 0 01-2.25 2.25H18.75a2.25 2.25 0 01-2.25-2.25V19.875a2.25 2.25 0 012.25-2.25h3.375"
                                stroke="#000"
                                strokeWidth={1.3}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    </TouchableOpacity>

                </View>




                <ScrollView
                    style={styles.personal_area_main_wrapper}>
                    <View style={styles.personal_area_executor_title_info}>
                        <Text  style={styles.personal_area_executor_title}>Имя</Text>
                        <Text  style={styles.personal_area_executor_info}>{this.state.name}</Text>
                    </View>
                    <View style={styles.personal_area_executor_title_info}>
                        <Text  style={styles.personal_area_executor_title}>Фамилия</Text>
                        <Text  style={styles.personal_area_executor_info}>{this.state.surName}</Text>
                    </View>
                    <View style={styles.personal_area_executor_title_info}>
                        <Text  style={styles.personal_area_executor_title}>Номер</Text>
                        <Text  style={styles.personal_area_executor_info}>{this.state.phone}</Text>
                    </View>
                    <View style={styles.personal_area_executor_title_info}>
                        <Text  style={styles.personal_area_executor_title}>Эл. почта</Text>
                        <Text  style={styles.personal_area_executor_info}>{this.state.editEmail}</Text>
                    </View>

                    <View style={styles.personal_area_input_title_box_password}>
                        <Text style={styles.personal_area_input_field_name}>Пароль</Text>
                        <TouchableOpacity style={styles.personal_area_change_password_btn} onPress={() => this.setState({changePasswordPopup: true})}>
                            <Text style={styles.personal_area_change_password_btn_text}>Изменить пароль</Text>
                        </TouchableOpacity>


                        {this.state.edit_password_error &&
                            <Text style={styles.error_text}>{this.state.edit_password_error_text}</Text>
                        }

                    </View>


                    <View style={styles.sign_up_img_title_wrapper}>
                        <Text style={styles.sign_up_img_title}>Фотография тех. паспорта</Text>

                        {this.state.user_tex_passport.length > 0 &&

                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {this.state.user_tex_passport.map((image, index) => {
                                    return(

                                        <View key={index} style={[styles.tex_passport_img_parent, {marginRight: 20, marginBottom: 20}]} >
                                            <Image style={styles.tex_passport_img} source={{uri: this.state.image_path + image.photo}}/>

                                        </View>

                                    )

                                })}
                            </View>
                        }




                    </View>

                    <View style={styles.photos_of_technology_wrapper}>
                        <Text style={styles.sign_up_img_title}>Фотографии техники</Text>
                        <View style={styles.photos_of_technology_items_wrapper}>
                            {/*user_transport_images*/}

                            {this.state.user_transport_images.map((image, index) => {
                                return(
                                    <View style={[styles.tex_passport_img_parent, {marginRight: 20, marginBottom: 20}]} key={index}>
                                        <Image style={styles.tex_passport_img} source={ {uri: this.state.image_path + image.photo}}/>

                                    </View>

                                )

                            })}



                        </View>

                    </View>



                    {/*<TouchableOpacity style={styles.log_out_btn}>*/}
                    {/*    <Text style={styles.log_out_btn_text}>Сохранить</Text>*/}
                    {/*</TouchableOpacity>*/}

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={[styles.footer_btn, {position: 'relative'}]} onPress={() => {this.redirectToExecutorNotifications()}}>
                        {this.state.count_notification != '' &&
                        <View style={styles.notification_count_box}>
                            <Text style={styles.notification_count_text}>{this.state.count_notification}</Text>
                        </View>
                        }
                        <Svg width={35} height={36} viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <G clipPath="url(#clip0_486_3554)" fill="#fff">
                                <Path d="M31.67 25.514a13.877 13.877 0 01-2.444-2.813 12 12 0 01-1.313-4.618v-4.742a10.298 10.298 0 00-2.615-6.874 10.564 10.564 0 00-6.572-3.447V1.782c0-.34-.137-.666-.38-.907a1.308 1.308 0 00-1.838 0c-.243.24-.38.567-.38.907v1.257A10.561 10.561 0 009.63 6.51a10.297 10.297 0 00-2.582 6.83v4.743a12.002 12.002 0 01-1.313 4.618 13.872 13.872 0 01-2.404 2.813.961.961 0 00-.331.72v1.306c0 .255.103.499.285.679a.98.98 0 00.688.281h27.054a.98.98 0 00.688-.281.953.953 0 00.285-.68v-1.305a.95.95 0 00-.33-.72zM5.023 26.58A15.568 15.568 0 007.4 23.7a13.532 13.532 0 001.605-5.617v-4.742a8.29 8.29 0 01.563-3.297 8.377 8.377 0 011.823-2.82 8.51 8.51 0 012.794-1.892 8.605 8.605 0 016.642 0c1.05.44 2 1.083 2.794 1.893a8.377 8.377 0 011.823 2.819c.41 1.05.601 2.172.562 3.297v4.742a13.53 13.53 0 001.606 5.617 15.562 15.562 0 002.375 2.88H5.024zM17.547 32.5c.6-.02 1.174-.331 1.623-.88.449-.549.743-1.3.83-2.12h-5c.09.842.398 1.611.866 2.163.469.552 1.066.849 1.681.837z" />
                            </G>
                            <Defs>
                                <ClipPath id="clip0_486_3554">
                                    <Path fill="#fff" transform="translate(0 .5)" d="M0 0H35V35H0z" />
                                </ClipPath>
                            </Defs>
                        </Svg>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.footer_btn, {position: 'relative'}]} onPress={() => {this.redirectToExecutorChat()}}>
                        {this.state.count_message != '' &&
                            <View style={styles.notification_count_box}>
                                <Text style={styles.notification_count_text}>{this.state.count_message}</Text>
                            </View>
                        }
                        <Svg width={35} height={36} viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M9.15 10.706h16.556M9.15 15.297h11.474M9.149 19.888h6.39M29.57 4.5H5.431c-.38.001-.743.155-1.011.429-.269.273-.42.644-.421 1.03V31.5l5.31-5.414h20.258c.38-.001.743-.155 1.011-.429.269-.273.42-.644.421-1.03V5.959a1.478 1.478 0 00-.42-1.03 1.423 1.423 0 00-1.012-.429v0z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                        </Svg>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.footer_btn, {position:'relative', top: 4}]} onPress={() => this.redirectToExecutorCatalogueMainPage()}>
                        <Svg width={41} height={32} viewBox="0 0 41 32" fill="none" xmlns="http://www.w3.org/2000/svg"
                        >
                            <G clipPath="url(#clip0_788_2223)" fill="#fff">
                                <Path d="M27.124 22.4l-1.233 2.32 6.038-.988c-1.219-.611-2.868-1.048-4.805-1.332zm-15.555.506C8.772 23.643 7 24.852 7 26.647c.001.387.086.768.248 1.12l9.69-1.585-5.37-3.276zM33.973 25.6l-13.488 2.198 3.557 4.047c5.841-.523 10.158-2.389 10.158-5.198 0-.374-.08-.722-.227-1.047zm-15.767 2.578l-9.114 1.49C11.502 31.16 15.753 32 20.6 32c.294 0 .58-.008.87-.014l-3.264-3.808zM20.602 0c-5.216 0-9.497 4.266-9.497 9.47 0 2.017.646 3.896 1.735 5.435l-.033-.05 6.163 10.652.026.035c.243.317.48.567.759.751.278.184.624.295.963.26.677-.067 1.093-.546 1.487-1.08l.02-.028 6.796-11.564.004-.008c.16-.288.277-.58.377-.866a9.36 9.36 0 00.694-3.537c0-5.204-4.278-9.47-9.494-9.47zm0 1.328c4.492 0 8.166 3.666 8.166 8.142a8.018 8.018 0 01-.6 3.05l-.008.017-.006.016a4.4 4.4 0 01-.291.677l-6.738 11.466c-.31.414-.538.536-.54.537 0 0-.004.014-.097-.048-.09-.059-.243-.205-.422-.435l-6.125-10.587-.017-.024a8.054 8.054 0 01-1.49-4.668c0-4.477 3.675-8.143 8.168-8.143zm0 2.799a5.341 5.341 0 00-5.358 5.343 5.341 5.341 0 005.358 5.344 5.34 5.34 0 005.356-5.344 5.34 5.34 0 00-5.356-5.343zm0 1.328c2.262 0 4.028 1.762 4.028 4.015 0 2.254-1.766 4.016-4.028 4.016-2.264 0-4.03-1.763-4.03-4.016s1.766-4.015 4.03-4.015z" />
                            </G>
                            <Defs>
                                <ClipPath id="clip0_788_2223">
                                    <Path fill="#fff" d="M0 0H41V32H0z" />
                                </ClipPath>
                            </Defs>
                        </Svg>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.footer_btn, {position:'relative', top: -2}]}>
                        <Svg width={38} height={38} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M19.1 36c-9.4 0-17-7.6-17-17s7.6-17 17-17 17 7.6 17 17-7.7 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.8-15-15-15z" fill="#F60"/>
                            <Path d="M9.3 31.3l-1.8-.8c.5-1.2 2.1-1.9 3.8-2.7 1.7-.8 3.8-1.7 3.8-2.8v-1.5c-.6-.5-1.6-1.6-1.8-3.2-.5-.5-1.3-1.4-1.3-2.6 0-.7.3-1.3.5-1.7-.2-.8-.4-2.3-.4-3.5 0-3.9 2.7-6.5 7-6.5 1.2 0 2.7.3 3.5 1.2 1.9.4 3.5 2.6 3.5 5.3 0 1.7-.3 3.1-.5 3.8.2.3.4.8.4 1.4 0 1.3-.7 2.2-1.3 2.6-.2 1.6-1.1 2.6-1.7 3.1V25c0 .9 1.8 1.6 3.4 2.2 1.9.7 3.9 1.5 4.6 3.1l-1.9.7c-.3-.8-1.9-1.4-3.4-1.9-2.2-.8-4.7-1.7-4.7-4v-2.6l.5-.3s1.2-.8 1.2-2.4v-.7l.6-.3c.1 0 .6-.3.6-1.1 0-.2-.2-.5-.3-.6l-.4-.4.2-.5s.5-1.6.5-3.6c0-1.9-1.1-3.3-2-3.3h-.6l-.3-.5c0-.4-.7-.8-1.9-.8-3.1 0-5 1.7-5 4.5 0 1.3.5 3.5.5 3.5l.1.5-.4.5c-.1 0-.3.3-.3.7 0 .5.6 1.1.9 1.3l.4.3v.5c0 1.5 1.3 2.3 1.3 2.4l.5.3v2.6c0 2.4-2.6 3.6-5 4.6-1.1.4-2.6 1.1-2.8 1.6z" fill="#F60"/>
                        </Svg>
                    </TouchableOpacity>
                </View>




            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        width: "100%",
        height: "100%"
    },

    personal_area_header: {
        paddingTop: 70,
        marginBottom: 27,
        paddingHorizontal: 15,
        width: '100%',
        position: 'relative',
        backgroundColor: '#EFEFEF',
        height: 180,
        zIndex: 999,
        top: -50,

    },

    personal_area_header_btn_title_box: {
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        position: 'relative',
    },
    personal_area_header_btn: {
        position: 'absolute',
        left:0,
        // top: 15


    },
    personal_area_header_title: {
        textAlign: 'center',
        color: "#333333",
        fontSize: 17,
        fontWeight: '700',
    },
    personal_area_info_main_box: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 23,
        paddingHorizontal: 30,

    },
    personal_area_img_box: {
        marginRight: 14,
    },

    personal_area_img: {
        width: 70,
        height: 70,
        borderRadius: 100,
    },
    personal_area_info_name: {
        color: '#333333',
        fontSize: 18,
        fontWeight: '400',
        marginBottom: 10,
    },


    personal_area_info_phone: {
        color: '#333333',
        fontSize: 13,
        fontWeight: '400',
        backgroundColor: '#DCDCDC',
        borderRadius: 3,
        paddingHorizontal: 6,
        paddingVertical: 3,
        width: 150,

    },
    footer_box: {
        backgroundColor: '#F4F4F4',
        width: '100%',
    },
    buy_rate_btn: {
        borderRadius: 25,
        width: 350,
        height: 110,
        marginBottom: 22,
        alignItems: 'center',
        alignSelf: 'center',
    },
    blurContainer: {
        borderRadius: 25,
        width: 350,
        height: 110,
        paddingHorizontal: 23,
        paddingVertical: 22,
        flexDirection: 'row',
        alignItems: 'center',
    },
    blurContainer2: {
        width: 82,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 11,
    },
    rate_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 18,
        marginRight: 33,
        width: 190,
    },
    rate_btn_info1: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginRight: 5,
    },
    personal_area_main_wrapper:{
        flex: 1,
        width: '100%',
        // paddingBottom: 100,
        // backgroundColor: '#ffffff',
        paddingHorizontal: 25,
        paddingTop: 30,
        // marginTop: 40,
        marginBottom: 94,
        // position: 'relative',
        // zIndex: -1

    },
    footer: {
        backgroundColor: '#535353',
        shadowColor: "#00000040",
        shadowOffset: {
            width: 0,
            height: -1,
        },
        shadowOpacity: 24,
        shadowRadius:1,

        elevation: 5,
        borderRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 90,
        paddingHorizontal: 53,
        paddingVertical: 30,
        position: 'absolute',
        bottom: 0,
        // marginTop: 100
    },
    personal_area_info_main_box2: {
        backgroundColor: '#F4F4F4',
        paddingHorizontal: 13,
        paddingVertical: 13,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        height: '100%',
    },


    personal_area_items_box: {
        paddingHorizontal: 25,
        marginBottom: 35
    },
    personal_area_info_item_title: {
        fontSize: 15,
        fontWeight: '400',
        color: '#000000',
        marginBottom: 8,
    },
    personal_area_info_item: {
        marginBottom: 16,
    },
    personal_area_info_item_text: {
        backgroundColor: '#ffffff',
        borderRadius: 6,
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    edit_btn: {
        borderRadius: 8,
        backgroundColor: '#FF6600',
        width: 265,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 50
    },
    edit_btn_text: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },

    tariffPlusPopup: {
        backgroundColor:  'rgba(255, 255, 255, 0.25)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 999,
        zIndex: 999999,
        width: '100%',
        height: windowHeight + 40,
        position: 'absolute',
        left: 0,
        top: 0,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',

    },
    successTariffPlusPopup: {
        backgroundColor:  'rgba(255, 255, 255, 0.25)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 999,
        zIndex: 999999,
        width: '100%',
        height: windowHeight + 40,
        position: 'absolute',
        left: 0,
        top: 0,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',

    },
    tariffPlusPopup_wrapper: {
        backgroundColor: '#FFFFFF',
        width: 335,
        paddingTop: 78,
        paddingBottom: 31,
        paddingHorizontal: 43,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 10
    },
    successTariffPlusPopup_wrapper: {
        backgroundColor: '#FFFFFF',
        width: 335,
        paddingTop: 78,
        paddingBottom: 31,
        paddingHorizontal: 24,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 10
    },


    tariffPlusPopup_close_btn: {
        position: 'absolute',
        right: 20,
        top:21,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successTariffPlusPopup_close_btn: {
        position: 'absolute',
        right: 20,
        top:21,
        justifyContent: 'center',
        alignItems: 'center',
    },

    tariffPlusPopup_img_parent: {
        marginBottom: 24,
        // width: 230,
        // height: 185,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    successTariffPlusPopup_img_parent: {
        marginBottom: 24,
        // width: 230,
        // height: 185,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },

    tariffPlusPopup_img: {
        width: '100%',
    },
    successTariffPlusPopup_img: {
        width: '100%',
    },


    successTariffPlusPopup_title: {
        color: '#333333',
        fontSize: 26,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 70,
        width: 287,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',


    },
    tariffPlusPopup_title: {
        color: '#333333',
        fontSize: 26,
        fontWeight: '400',
        textAlign: 'center',
        width: 249,
        marginBottom: 36,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',

    },

    tariffPlusPopup_title_bold: {
        fontWeight: '700',
    },

    tariffPlusPopup_buy_btn: {
        backgroundColor: '#FF6600',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 265,

    },
    successTariffPlusPopup_buy_btn: {
        backgroundColor: '#FF6600',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
        width: 265,

    },

    tariffPlusPopup_buy_btn_text: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
    successTariffPlusPopup_buy_btn_text: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
    tariffPlusPopup_cancel_btn: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#FF6600',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 265,
    },
    tariffPlusPopup_cancel_btn_text: {
        color: '#333333',
        fontSize: 18,
        fontWeight: '700',
    },
    successTariffPlusPopup_scroll: {
        width: '100%',
    },
    tariffPlusPopup_scroll: {
        width: '100%'
    },


    avatar_img_edit_btn_wrapper: {
        position: 'absolute',
        // bottom: 0,
        top: 120,
        alignSelf: 'center',
        zIndex: 9999,
        // elevation: 10,
    },
    avatar_img_wrapper: {
        width: 120,
        height: 120,
        position: 'relative',
    },
    avatar_img: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        objectFit: 'cover',
    },
    personal_area_edit_button: {
        position: 'absolute',
        right: -12,
        bottom: -2,
    },
    personal_area_input_title_box: {
        marginBottom: 16,
        width: '100%',

    },
    personal_area_input_field_name: {
        fontWeight: '500',
        fontSize: 15,
        color: '#000000',
        marginBottom: 8,
    },

    personal_area_input_field_edit_btn_box: {
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        // paddingVertical: 15,

        height: 50,
        position: 'relative',
    },

    personal_area_input_field: {
        paddingVertical: 15,
        width: '90%',
        // backgroundColor: 'red',
    },
    save_btn: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    edit_input_btn: {
        position: 'absolute',
        right: 15,
        top: 12,
    },
    personal_area_number_input_title_btn: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,

    },
    personal_area_input_phone_number: {
        fontSize: 16,
        fontWeight: '300',
        color: '#333333',
    },
    personal_area_input_title_box_number: {
        marginBottom: 21,
    },
    personal_area_change_password_btn_text: {
        color: '#FF6600',
        fontSize: 15,
        fontWeight: '500',
    },
    personal_area_input_title_box_password: {
        marginBottom: 45,
    },
    log_out_btn: {
        backgroundColor: '#FF6600',
        borderRadius: 8,
        height: 50,
        width: 265,
        marginBottom: 200,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    log_out_btn_text: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 18,
    },
    change_number_old_popup: {
        height: windowHeight + 40,
        width: '100%',
        backgroundColor: '#ffffff',

    },
    change_number_old_popup_wrapper: {
        width: '100%',
        backgroundColor: '#ffffff',
        height: '100%',
        position: 'relative',
        paddingTop: 50,
    },
    change_number_old_popup_close_btn: {
        position: 'absolute',
        right: 20,
        top: 10,
        zIndex: 9999,
    },
    change_number_old_popup_img: {
        marginBottom: 16,
        // paddingTop: 30,
    },
    change_number_old_popup_header: {
        width: '100%',
        marginBottom: 37,
        paddingHorizontal: 90,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    change_number_old_popup_title: {
        color: '#333333',
        fontSize: 36,
        fontWeight: '700',
        textAlign: 'center',
    },
    change_number_old_popup_scroll: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 25,
    },
    change_number_old_popup_info1: {
        fontWeight: '400',
        fontSize: 14,
        color: '#545454',
        marginBottom: 25,
    },
    change_number_old_popup_input_title: {
        fontWeight: '400',
        fontSize: 15,
        color: '#000000',
        marginBottom: 11,
    },
    change_number_old_popup_input_field: {
        backgroundColor: '#F1F1F1',
        borderRadius: 6,
        height: 50,
        width: '100%',
        paddingHorizontal: 15,
    },

    change_number_old_popup_input_field_title_box: {
        marginBottom: 60,
    },
    change_number_old_popup_input_field_title_box2: {
        marginBottom: 14
    },

    change_number_old_popup_confirm_btn: {
        backgroundColor: '#FF6600',
        borderRadius: 8,
        height: 50,
        width: 265,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',

    },
    change_number_old_popup_confirm_btn_text: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700'
    },
    recovery_account_code_inputs_wrapper: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10,
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

    change_number_old_popup_info2: {
        fontWeight: '400',
        fontSize: 14,
        color: '#545454',
        marginBottom: 27,
        textAlign: 'center',
        width: 320,
        alignSelf: 'center'
    },
    send_code_again_btn_wrapper: {
        marginBottom: 39,
    },
    send_code_again_btn_text: {
        color: "#333333",
        fontSize: 14,
        fontWeight: '400',
        textDecorationLine: 'underline',

    },
    send_code_again_btn: {
        alignSelf: 'center'
    },
    change_number_success_popup_img: {
        marginBottom: 25,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 70,
        paddingHorizontal: 50,
    },

    change_number_success_popup_title: {
        marginBottom: 140,
        color: '#333333',
        fontWeight: '300',
        fontSize: 30,
        textAlign: 'center',
        paddingHorizontal: 50,
    },
    personal_area_executor_title_info: {
        marginBottom: 23,
    },
    personal_area_executor_title: {
        fontWeight: '500',
        fontSize: 15,
        color: '#000000',
        marginBottom: 8,
    },
    personal_area_executor_info: {
        color: '#333333',
        fontSize: 16,
        fontWeight: '300',
    },
    user_image_box: {
        width:100,
        height: 100,
        // overflow: 'hidden',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },

    user_image_child: {
        width: '85%',
        height: '85%',
        resizeMode: 'cover',
        borderRadius: 8,

    },
    user_img_edit_btn: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    sign_up_img_title: {
        marginBottom: 12,
        fontWeight: '400',
        fontSize: 15,
        color: '#000000',
    },
    sign_up_img_title_wrapper: {
      marginBottom: 12,
    },

    photos_of_technology_items_wrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },

    photo_of_technology: {
        marginBottom: 16,
        marginRight: 18,
    },
    photos_of_technology_wrapper: {
        marginBottom: 70,
    },
    sign_up_img_btn: {
        marginRight: 18,
        width:100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

    error_text: {
        fontSize: 14,
        color: 'red',
        fontWeight: '500',
        marginVertical: 10
    },
    tex_passport_img_parent: {
        width: 91,
        height: 91,
        borderRadius: 8,
    },
    tex_passport_img: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 8,
    },
    notification_count_box: {
        backgroundColor: '#FF6600',
        width: 14,
        height: 14,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        position:'absolute',
        right: -1,
        zIndex: 999

    },
    notification_count_text: {
        fontWeight: '700',
        fontSize: 9,
        color: '#ffffff',
        // position: 'absolute',
        // zIndex: 9,
        // top: -1
    }



});
