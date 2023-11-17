import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {AuthContext} from "../../AuthContext/context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import {APP_URL} from '../../../env'


import {
    Text,
    Alert,
    Button,
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    TextInput,
    Keyboard,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Dimensions,
    FlatList,
    KeyboardAvoidingView
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
import axios from "axios";



export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchInput: '',
            messageInput: '',
            confirmSelectionPerformerPopup: false,

            keyboardOffset: 92,
            keyboardOpen: false,
            message_error: false,
            message_error_text: '',

            user_id: null,
            all_messages: [],

            loading_message: false,
            receiver_name: '',
            sender_name: '',
            receiver_surname: '',
            sender_surname: '',
            receiver_photo: '',
            sender_photo: '',

            image_path: 'https://admin.stechapp.ru/uploads/',

            receiver_id: null,
            sender_id: null,

            user_name: '',
            user_image: '',
            file: '',

            numbers_are_forbidden: false,

            selectionPerformerInvitePopup: false,

            district: '',
            district_error: false,
            district_error_text: '',

            city: '',
            city_error: false,
            city_error_text: '',

            street: '',
            street_error: false,
            street_error_text: '',

            user_has_active_job_text: '',
            user_has_active_job: true,

            receiver_id_pic: null,
            show_chat_img: false,
            show_chat_img_item: '',

            show_sender_chat_img: false,
            show_sender_chat_img_item: '',
            inviteNotificationPopup: false,
            inviteNotificationPopupChild: false,
            invite: '',


            loaded_messages: false,

            catalog_header_height: 0,
            balance: 0,
            show_important_message: false,
            count_notification: '',
            count_message: '',


        };

    }

    static contextType = AuthContext;


    getAllFunctions = async () => {
        await this.getUserId();
        await this.getAllMessages();
        await this.updateMessages();
    }

    scrollToEnd = () => {
        this.scrollView.scrollToEnd({ animated: true });
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );




        const { navigation } = this.props;
        this.focusListener = navigation.addListener("focus", () => {

            this.setState({
                show_important_message: true
            })
            setTimeout(() => {
                this.setState({
                    show_important_message: false
                })
            }, 3000);

            this.getUserId();

            this.getAllMessages();
            this.getNotificationsCount();

            this.interval = setInterval(() => {
                this.getAllMessages();


            }, 3000)

            // this.scrollToEnd()

        });



        // AsyncStorage.clear();
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();

        // clearInterval(this.interval)
        if (this.focusListener) {
            this.focusListener();

        }

        clearInterval(this.interval)
    }



    updateMessages = async () => {
       this.interval =  setInterval(() =>{
           this.getAllMessages()
       }, 4000)


    }



    getUserId = async () => {
        let userData = await AsyncStorage.getItem('userData');
        let userData_json_parse = JSON.parse(userData);
        let user_name = this.props.user_name;
        let user_image = this.props.user_image;

       await this.setState({
            user_id: userData_json_parse.id,
            user_name: user_name,
            user_image: user_image,
        })

    }



    getAllMessages = async () => {

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let receiver_id = this.props.receiver_id;



        try {
            fetch(`${APP_URL}/OnePageMessage`, {
                method: 'POST',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receiver_id: receiver_id
                })

            }).then((response) => {
                return response.json()
            }).then(async (response) => {




                if (response.status === true && response.hasOwnProperty("invete")) {
                     this.setState({
                         invite: response.invete,
                     })
                }

                if (response.status === true && response.data.message.length > 0) {
                    this.setState({
                        all_messages: response.data.message,
                        receiver_id_pic: response.data.message[0].receiver_id,
                        // receiver_name: '',
                        // sender_name: '',
                        // receiver_surname: '',
                        // sender_surname: '',
                        // receiver_photo: '',
                        // sender_photo: '',
                        // receiver_id: '',
                    })

                }

                if (response.status === true) {
                        this.setState({
                            balance: parseFloat(response.data.balance[0].balance)
                        })
                }

                await this.scrollToEnd();

            })
        } catch (e) {
        }
    }




    _keyboardDidShow =(event) => {
        this.setState({
            keyboardOffset: event.endCoordinates.height,
            keyboardOpen:true
        })
    }

    _keyboardDidHide = (event) => {
        this.setState({
            keyboardOffset: 92,
            keyboardOpen:false

        })
    }



    createMessage = async () => {

        let {messageInput} = this.state;

        if (messageInput.length == 0) {
            return false;
        }

        await this.setState({
            loading_message: true,
        })
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let receiver_id = this.props.receiver_id;


            try {
                fetch(`${APP_URL}/createMessage`, {
                    method: 'POST',
                    headers: {
                        'Authorization': AuthStr,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        receiver_id: receiver_id,
                        message: messageInput,
                        file: ''
                    })

                }).then((response) => {
                    return response.json()
                }).then(async (response) => {


                    if (response.status === true) {
                         if (response.hasOwnProperty('data')) {
                              if (response.data.message == 'message created') {
                                    this.setState({
                                        messageInput: '',
                                        loading_message: false,
                                        // keyboardOffset: 92,
                                        // keyboardOpen:false,
                                    })
                                  Keyboard.dismiss();
                                  await this.getAllMessages();

                              }
                         }
                    }  else {
                        if (response.hasOwnProperty('message')) {
                            if (response.message == 'Message have  4 number') {
                                await this.setState({
                                    messageInput: '',
                                    loading_message: false,
                                    numbers_are_forbidden: true,
                                })

                                setTimeout(async () => {
                                    await this.setState({
                                        numbers_are_forbidden: false,
                                    })
                                }, 3000)

                            }
                        }
                    }



                })
            } catch (e) {
            }



    }


    addNewInvite = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let receiver_id = this.props.receiver_id;

        let {district, city, street} = this.state

        if (district.length == 0 || city.length == 0 || street.length == 0) {
                if (district.length == 0) {
                    this.setState({
                        district_error: true,
                        district_error_text: 'Поле Район обязательно.'
                    })
                } else {
                    this.setState({
                        district_error: false,
                        district_error_text: ''
                    })
                }

                if (city.length == 0) {
                    this.setState({
                        city_error: true,
                        city_error_text: 'Поле города обязательно.'
                    })
                }  else {
                    this.setState({
                        city_error: false,
                        city_error_text: ''
                    })
                }

                if (street.length == 0) {
                    this.setState({
                        street_error: true,
                        street_error_text: 'Поле улица обязательно.'
                    })
                } else {
                    this.setState({
                        street_error: false,
                        street_error_text: ''
                    })
                }
        } else {
            this.setState({
                district_error: false,
                district_error_text: '',
                city_error: false,
                city_error_text: '',
                street_error: false,
                street_error_text: ''
            })
            try {
                fetch(`${APP_URL}/addNewInvite`, {
                    method: 'POST',
                    headers: {
                        'Authorization': AuthStr,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        receiver_id: receiver_id,
                        City: city,
                        District: district,
                        Street: street,

                    })

                }).then((response) => {
                    return response.json()
                }).then(async (response) => {


                    if (response.hasOwnProperty('District')) {
                        if (response.District == 'The district format is invalid.') {
                            this.setState({
                                district_error: true,
                                district_error_text: 'Недопустимый формат района.'
                            })
                        } else {
                            this.setState({
                                district_error: false,
                                district_error_text: ''
                            })
                        }
                    }
                    if (response.hasOwnProperty('City')) {
                        if (response.City == 'The city format is invalid.') {
                            this.setState({
                                city_error: true,
                                city_error_text: 'Недопустимый формат города.'
                            })
                        } else {
                            this.setState({
                                city_error: false,
                                city_error_text: ''
                            })
                        }
                    }
                    if (response.hasOwnProperty('Street')) {
                        if (response.Street == 'The street format is invalid.') {
                            this.setState({
                                street_error: true,
                                street_error_text: 'Недопустимый формат улицы.'
                            })
                        } else {
                            this.setState({
                                street_error: false,
                                street_error_text: ''
                            })
                        }
                    }

                    if (response.status === true) {
                            this.setState({
                                district_error: false,
                                district_error_text: '',
                                city_error: false,
                                city_error_text: '',
                                street_error: false,
                                street_error_text: '',
                                selectionPerformerInvitePopup: false,
                            })

                    }
                })
            } catch (e) {
            }
        }



    }



    redirectToSignUp = () => {
        this.props.navigation.navigate("SignUp");

    }


    redirectToClientPersonalArea = () => {
        this.props.navigation.navigate("PersonalArea");

    }
    redirectToClientCatalogueMainPage = () => {
        this.props.navigation.navigate("ClientCatalogueMainPage");

    }

    redirectToClientCatalogueSinglePage = () => {
        this.props.navigation.navigate("CatalogueProductSinglePage", {
            params: this.state.receiver_id_pic,
            redirect_from: 'from chat single page'
        });
    }

    redirectToClientChat = () => {
        clearInterval(this.interval)
        this.props.navigation.navigate("ClientChat");
    }


    redirectToClientNotifications = () => {
        this.props.navigation.navigate("ClientNotifications");
    }

    selectImage = async () => {

        // No permissions request is necessary for launching the image library
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let receiver_id = this.props.receiver_id;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {

            this.setState({
                file:result.uri
            })

            let res = result.uri.split('.');
            let type = res[res.length - 1];


            let form = new FormData();
            form.append("file[]", {
                uri: result.uri,
                type: 'image/jpg',
                name: 'photo.jpg',
            });

            form.append("receiver_id", receiver_id);
            // form.append("message", '');

            if (type == 'jpg' ||  type == 'png' ||  type == 'jpeg') {



                try {

                    let config = {
                        method: 'POST',
                        url: `${APP_URL}/createMessage`,
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "multipart/form-data",
                            'Authorization': AuthStr,

                        },
                        data: form,
                    };

                    axios(config).then(async (response) => {
                        response = response.data;


                            if (response.status === true) {
                                // alert('hhhh')
                                await this.getAllMessages();
                            }

                    })
                } catch (e) {
                }


            } else {

                alert('Please use correct image format ')
            }

        }
    }

    openConfirmSelectionPerformerPopup = () => {
        this.setState({
            confirmSelectionPerformerPopup: true
        })
  }

    openImage = (img) => {
        this.setState({
            show_chat_img: true,
            show_chat_img_item: img
        })
    }

    openSenderImg = (img) => {
        this.setState({
            show_sender_chat_img: true,
            show_sender_chat_img_item: img
        })
    }


    paddingTopFunction = () => {
        let num = 0;

        if (this.state.invite == 'no invite'  && this.state.balance >= 0 && this.state.user_name != 'Admin') {
                num = 60
        } else if (this.state.invite == 'no invite'  && this.state.balance < 0) {
             num = 10
        } else {
            num = 10
        }
        return num
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


    render() {

        if (this.state.confirmSelectionPerformerPopup) {
            return (
                <ImageBackground resizeMode="cover" source={require('../../../assets/images/popup_img.png')} style={[styles.redirectToSingleProductPopup,{width: '100%', height: windowHeight,  zIndex: 99999999, }]}>
                    <View style={styles.single_product_popup_wrapper}>

                        <TouchableOpacity style={styles.single_product_popup_close_btn} onPress={() => {this.setState({confirmSelectionPerformerPopup: false})}}>
                            <Svg
                                width={30}
                                height={30}
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <Path
                                    d="M4.024 5.351a.938.938 0 111.327-1.327l9.65 9.65 9.648-9.65a.938.938 0 111.328 1.327L16.326 15l9.65 9.649a.937.937 0 01-.663 1.602.94.94 0 01-.664-.275L15 16.326l-9.649 9.65a.94.94 0 01-1.53-.304.938.938 0 01.203-1.023L13.674 15l-9.65-9.649z"
                                    fill="#888"
                                />
                            </Svg>
                        </TouchableOpacity>

                        <View style={styles.single_product_popup_img}>
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
                                <G clipPath="url(#clip0_314_4981)">
                                    <Path
                                        d="M33.937 40.112c0-.66.124-1.28.373-1.86a4.843 4.843 0 012.516-2.55 4.488 4.488 0 011.835-.378h7.229v3.196h-7.23a1.544 1.544 0 00-1.12.468c-.14.14-.249.308-.33.5-.08.194-.12.402-.12.624 0 .223.04.435.12.635.081.193.19.364.33.513.147.14.315.252.505.334.19.081.396.122.616.122h3.153c.652 0 1.263.126 1.834.379.58.245 1.08.586 1.506 1.024.432.431.769.94 1.01 1.526.25.58.374 1.2.374 1.86 0 .66-.125 1.28-.374 1.86a4.761 4.761 0 01-1.01 1.526c-.425.43-.927.772-1.506 1.024a4.489 4.489 0 01-1.834.379h-6.999v-3.196h6.999a1.546 1.546 0 001.11-.457 1.601 1.601 0 00.46-1.136c0-.223-.04-.43-.12-.624a1.478 1.478 0 00-.34-.5 1.456 1.456 0 00-.495-.346 1.546 1.546 0 00-.615-.123H38.66a4.49 4.49 0 01-1.835-.378 4.94 4.94 0 01-1.505-1.025 5.015 5.015 0 01-1.01-1.526 4.737 4.737 0 01-.374-1.87zm21.071 11.182h-3.142V38.52h-4.735v-3.196h12.602v3.196h-4.725v12.774zm17.194 0h-10.8v-15.97h10.8v3.196h-7.647v3.196h5.175v3.196h-5.175v3.186h7.647v3.196zm14.392-1.637a8.002 8.002 0 01-2.46 1.47 7.959 7.959 0 01-2.824.512 7.78 7.78 0 01-2.165-.3 8.211 8.211 0 01-1.944-.825 8.564 8.564 0 01-2.933-2.974 8.811 8.811 0 01-.825-1.97 8.385 8.385 0 01-.285-2.194c0-.758.095-1.49.285-2.194a8.532 8.532 0 01.824-1.972 8.422 8.422 0 011.286-1.681 8.157 8.157 0 013.592-2.127c.696-.2 1.418-.301 2.165-.301.974 0 1.915.17 2.823.512a7.722 7.722 0 012.46 1.47l-1.669 2.784a4.655 4.655 0 00-1.637-1.158 4.895 4.895 0 00-1.977-.412c-.696 0-1.348.134-1.956.401a5.093 5.093 0 00-2.67 2.706 4.958 4.958 0 00-.395 1.972c0 .698.132 1.355.395 1.97a5.206 5.206 0 001.077 1.605c.454.46.985.824 1.593 1.09.608.268 1.26.402 1.956.402a5.01 5.01 0 001.977-.401 4.78 4.78 0 001.637-1.17l1.67 2.785zm4.988 1.637h-3.153v-15.97h3.153v6.392h6.295v-6.392h3.153v15.97h-3.153v-6.382h-6.295v6.382z"
                                        fill="#333"
                                    />
                                </G>
                                <Defs>
                                    <ClipPath id="clip0_314_4981">
                                        <Path
                                            fill="#fff"
                                            transform="translate(33.75 35.1)"
                                            d="M0 0H67.5V16.65H0z"
                                        />
                                    </ClipPath>
                                </Defs>
                            </Svg>
                        </View>

                        <Text style={styles.single_product_popup_title}>
                            Подтвердите выбор
                            исполнителя
                        </Text>

                        <TouchableOpacity style={styles.go_to_single_product_btn}
                                onPress={() => {
                                    this.setState({
                                        confirmSelectionPerformerPopup: false,
                                        selectionPerformerInvitePopup: true
                                    })
                                }}
                        >
                            <Text style={styles.go_to_single_product_btn_text}>Подтвердить</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.not_go_to_single_product_btn} onPress={() => {this.setState({confirmSelectionPerformerPopup: false})}}>
                            <Text style={styles.not_go_to_single_product_btn_text}>Отменить</Text>
                        </TouchableOpacity>

                    </View>
                </ImageBackground>


            )

        }

        if(this.state.loaded_messages) {
            return (
                <View style={{backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: '100%',  height: '100%', }}>

                    <ActivityIndicator size="large" color="#FF6600" />

                </View>
            )

        }


        return (
            <SafeAreaView  edges={['right', 'left', 'top']} style={styles.container} >
                <StatusBar style="dark" />



                <View style={{ overflow: 'hidden', paddingBottom: 5, width: '100%' }}>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            width: '100%',
                            // width: 300,
                            // height: 60,
                            shadowColor: '#000',
                            shadowOffset: { width: 1, height: 1 },
                            shadowOpacity:  0.4,
                            shadowRadius: 3,
                            elevation: 5,
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                        }}
                    >

                        <View style={styles.client_chat_header}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Svg width={35} height={35} viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <Path d="M20.169 27.708a1.458 1.458 0 01-1.138-.54l-7.043-8.75a1.458 1.458 0 010-1.851l7.291-8.75a1.46 1.46 0 112.246 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.137 2.391z" fill="#000"/>
                                </Svg>
                            </TouchableOpacity>


                            <Text style={styles.client_chat_header_title}>
                                {this.state.user_name}
                            </Text>

                            <View style={styles.client_chat_header_img}>
                                {this.state.receiver_id_pic == 1 ?
                                    <View style={{width: 57, height: 47,}}>
                                        <Image style={styles.client_chat_header_img_child} source={require('../../../assets/images/chat_admin.png')}/>
                                    </View>

                                    :
                                    <TouchableOpacity style={{width: 40, height: 40}} onPress={() => this.redirectToClientCatalogueSinglePage()}>
                                        <Image style={[styles.client_chat_header_img_child, { borderRadius: 50,}]} source={{uri: this.state.image_path + this.state.user_image}}/>
                                    </TouchableOpacity>

                                }

                            </View>
                        </View>


                    </View>


                </View>


                {this.state.invite == 'no invite'  && this.state.balance >= 0 && this.state.user_name != 'Cлужба поддержки' &&
                    <View style={styles.single_product_page_write_message_btn_parent}>
                        <TouchableOpacity style={styles.single_product_page_write_message_btn} onPress={() => {this.openConfirmSelectionPerformerPopup()}}>
                            <Text style={styles.single_product_page_write_message_btn_text}>Выбрать исполнителем</Text>
                        </TouchableOpacity>
                    </View>
                }
                {this.state.show_important_message && this.state.user_name != 'Cлужба поддержки' &&
                <View style={styles.client_answer_popup}>
                    <View style={styles.client_answer_popup_wrapper}>
                        <Text style={styles.client_answer_popup_info}>Номера телефонов и адреса передавать запрещено</Text>
                    </View>
                </View>
                }





                <ScrollView
                    style={[
                        styles.client_chat_items_main_wrapper,
                        {marginBottom: Platform.OS === 'ios' ?  75 : 0,   }
                        ]}
                    // enableOnAndroid={true}
                    // enableAutomaticScroll={(Platform.OS === 'ios')}
                    ref={(scrollView) => { this.scrollView = scrollView; }}
                >


                    {this.state.all_messages.map((chat_item, index) => {

                        return (
                            <View key={index} style={styles.client_chat_messages_items_wrapper}>
                                {this.state.user_id == chat_item.receiver_id ?
                                    <View style={{alignItems: 'flex-start', width: '100%'}}>

                                        {chat_item.message &&
                                             <View  style={styles.client_chat_messages_item_get}>
                                            <Text  style={styles.client_chat_message}>{chat_item.message}</Text>
                                            <Svg
                                                style={{position: 'absolute', bottom: -1, left: -5   , zIndex: -5,  transform: [{ rotate: '10deg'}], }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={20}
                                                height={16}
                                                viewBox="0 0 14 16"
                                                fill="none"
                                            >
                                                <Path
                                                    d="M6.087 0c.106 5.478-.23 9.029-1.011 10.652-.725 1.507-2.265 2.963-4.619 4.37l-.359.21a.191.191 0 00-.07.266.2.2 0 00.153.095c4.974.47 9.058-.667 12.25-3.412L13.014 0H6.087z"
                                                    fill="#FFB482"
                                                />
                                            </Svg>
                                        </View>
                                        }

                                        {chat_item.file &&
                                            <TouchableOpacity  style={[styles.client_chat_messages_item_get, {width: 130}]}
                                                onPress={() => {this.openImage( this.state.image_path + chat_item.file)} }
                                            >
                                                <Image  style={{width: '100%', height: 63}}  source={{uri: this.state.image_path + chat_item.file}}/>
                                                <Svg
                                                    style={{position: 'absolute', bottom: -1, left: -5   , zIndex: -5,  transform: [{ rotate: '10deg'}], }}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={16}
                                                    viewBox="0 0 14 16"
                                                    fill="none"
                                                >
                                                    <Path
                                                        d="M6.087 0c.106 5.478-.23 9.029-1.011 10.652-.725 1.507-2.265 2.963-4.619 4.37l-.359.21a.191.191 0 00-.07.266.2.2 0 00.153.095c4.974.47 9.058-.667 12.25-3.412L13.014 0H6.087z"
                                                        fill="#FFB482"
                                                    />
                                                </Svg>
                                            </TouchableOpacity>
                                        }


                                    </View>

                                    :
                                    <View style={{alignItems: 'flex-end', width: '100%'}}>

                                        {chat_item.message  &&
                                         <View  style={styles.client_chat_messages_item_send}>
                                            <Text  style={styles.client_chat_message}>{chat_item.message}</Text>

                                            <Svg
                                                style={{position: 'absolute', bottom: -1, right: -5   , zIndex: -5,  transform: [{ rotate: '10deg'}], }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={20}
                                                height={16}
                                                viewBox="0 0 14 16"
                                                fill="none"
                                            >
                                                <Path
                                                    d="M7.912.185c-.106 5.478.23 9.029 1.011 10.652.726 1.507 2.265 2.963 4.619 4.37l.359.21a.191.191 0 01.07.266.2.2 0 01-.153.095c-4.974.47-9.058-.668-12.25-3.412L.985.185h6.927z"
                                                    fill="#DEDEDE"
                                                />
                                            </Svg>
                                        </View>

                                        }

                                        {chat_item.file &&
                                            <TouchableOpacity  style={[styles.client_chat_messages_item_send,]}
                                                onPress={() => this.openSenderImg(this.state.image_path + chat_item.file)}
                                            >
                                                    <Image style={{width: '100%', height: 63, resizeMode: 'cover'}} source={{uri: this.state.image_path + chat_item.file}}/>
                                                    <Svg
                                                        style={{position: 'absolute', bottom: -1, right: -5   , zIndex: -5,  transform: [{ rotate: '10deg'}], }}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={16}
                                                        viewBox="0 0 14 16"
                                                        fill="none"
                                                    >
                                                        <Path
                                                            d="M7.912.185c-.106 5.478.23 9.029 1.011 10.652.726 1.507 2.265 2.963 4.619 4.37l.359.21a.191.191 0 01.07.266.2.2 0 01-.153.095c-4.974.47-9.058-.668-12.25-3.412L.985.185h6.927z"
                                                            fill="#DEDEDE"
                                                        />
                                                    </Svg>
                                            </TouchableOpacity>
                                        }

                                    </View>

                                }



                            </View>



                        );
                    })}

                </ScrollView>

                {/*<View  style={[styles.chat_message_input_buttons_main_wrapper, this.state.keyboardOffset == 0 ? {} : {backgroundColor: '#ffffff',position: 'absolute', top: this.state.keyboardOffset }]}>*/}

                <KeyboardAvoidingView style={[styles.chat_message_input_buttons_main_wrapper, {bottom: Platform.OS === 'ios' ? this.state.keyboardOffset : 0},{position: Platform.OS === 'ios' ? 'absolute' : 'relative'}]}>



                    <TextInput
                        style={[styles.chat_message_input_field, { paddingBottom: Platform.OS === 'ios' ? 13 : 11, paddingTop: Platform.OS === 'ios' ? 15 : 11,}]}
                        onChangeText={(val) => this.setState({messageInput: val})}
                        value={this.state.messageInput}
                        placeholder='Сообщение'
                        placeholderTextColor='#000000'
                        editable= {this.state.loading_message  ? false : true}
                        multiline
                    />


                    <View style={styles.message_send_btn}>
                        {this.state.loading_message ?
                            <View style={{}}>
                                <ActivityIndicator size="small" color="#FF6600" />
                            </View>

                            :

                            <TouchableOpacity style={styles.chat_message_send_button} onPress={() => {this.createMessage()}}>
                                <Svg
                                    width={28}
                                    height={28}
                                    viewBox="0 0 28 28"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <G clipPath="url(#clip0_62_2557)">
                                        <Path
                                            d="M14 28a14 14 0 100-28 14 14 0 000 28zM7.875 14.875a.875.875 0 010-1.75h10.138L14.255 9.37a.876.876 0 011.24-1.24l5.25 5.25a.875.875 0 010 1.24l-5.25 5.25a.876.876 0 11-1.24-1.24l3.758-3.755H7.875z"
                                            fill="#000"
                                        />
                                    </G>
                                    <Defs>
                                        <ClipPath id="clip0_62_2557">
                                            <Path fill="#fff" transform="rotate(90 14 14)" d="M0 0H28V28H0z" />
                                        </ClipPath>
                                    </Defs>
                                </Svg>
                            </TouchableOpacity>


                        }
                    </View>
                    <TouchableOpacity style={styles.chat_image_upload_btn}
                                      onPress={() => {this.selectImage()}}
                    >
                        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                             width={32}
                             height={32}
                             fill="#000"
                        >
                            <Path d="M19 13a1 1 0 00-1 1v.38l-1.48-1.48a2.79 2.79 0 00-3.93 0l-.7.7-2.48-2.48a2.85 2.85 0 00-3.93 0L4 12.6V7a1 1 0 011-1h7a1 1 0 000-2H5a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3v-5a1 1 0 00-1-1zM5 20a1 1 0 01-1-1v-3.57l2.9-2.9a.79.79 0 011.09 0l3.17 3.17 4.3 4.3zm13-1a.89.89 0 01-.18.53L13.31 15l.7-.7a.77.77 0 011.1 0L18 17.21zm4.71-14.71l-3-3a1 1 0 00-.33-.21 1 1 0 00-.76 0 1 1 0 00-.33.21l-3 3a1 1 0 001.42 1.42L18 4.41V10a1 1 0 002 0V4.41l1.29 1.3a1 1 0 001.42 0 1 1 0 000-1.42z" />
                        </Svg>
                    </TouchableOpacity>


                </KeyboardAvoidingView>

                {this.state.keyboardOpen === false &&

                <View style={styles.footer}>
                    <TouchableOpacity style={[styles.footer_btn, {position: 'relative'}]} onPress={() => {this.redirectToClientNotifications()}}>
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
                    <TouchableOpacity style={[styles.footer_btn, {position: 'relative'}]} onPress={() => {this.redirectToClientChat()}}>
                        {this.state.count_message != '' &&
                            <View style={styles.notification_count_box}>
                                <Text style={styles.notification_count_text}>{this.state.count_message}</Text>
                            </View>
                        }
                        <Svg width={35} height={36} viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M9.15 10.706h16.556M9.15 15.297h11.474M9.149 19.888h6.39M29.57 4.5H5.431c-.38.001-.743.155-1.011.429-.269.273-.42.644-.421 1.03V31.5l5.31-5.414h20.258c.38-.001.743-.155 1.011-.429.269-.273.42-.644.421-1.03V5.959a1.478 1.478 0 00-.42-1.03 1.423 1.423 0 00-1.012-.429v0z" stroke="#FF6600" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                        </Svg>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.footer_btn, {position:'relative', top: 4}]} onPress={() => {this.redirectToClientCatalogueMainPage()}}>
                        <Svg width={41} height={32} viewBox="0 0 41 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M35 28.535l-4.857-4.855a8.314 8.314 0 10-1.464 1.465L33.536 30 35 28.535zm-11.393-3.714a6.214 6.214 0 116.214-6.214 6.221 6.221 0 01-6.214 6.214zM6 11.357h8.286v2.072H6v-2.072zM6 1h16.571v2.071H6V1zm0 5.179h16.571V8.25H6V6.179z" fill="#ffffff"/>
                        </Svg>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.footer_btn, {position:'relative', top: -2}]} onPress={() => this.redirectToClientPersonalArea()}>
                        <Svg width={38} height={38} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M19.1 36c-9.4 0-17-7.6-17-17s7.6-17 17-17 17 7.6 17 17-7.7 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.8-15-15-15z" fill="#ffffff"/>
                            <Path d="M9.3 31.3l-1.8-.8c.5-1.2 2.1-1.9 3.8-2.7 1.7-.8 3.8-1.7 3.8-2.8v-1.5c-.6-.5-1.6-1.6-1.8-3.2-.5-.5-1.3-1.4-1.3-2.6 0-.7.3-1.3.5-1.7-.2-.8-.4-2.3-.4-3.5 0-3.9 2.7-6.5 7-6.5 1.2 0 2.7.3 3.5 1.2 1.9.4 3.5 2.6 3.5 5.3 0 1.7-.3 3.1-.5 3.8.2.3.4.8.4 1.4 0 1.3-.7 2.2-1.3 2.6-.2 1.6-1.1 2.6-1.7 3.1V25c0 .9 1.8 1.6 3.4 2.2 1.9.7 3.9 1.5 4.6 3.1l-1.9.7c-.3-.8-1.9-1.4-3.4-1.9-2.2-.8-4.7-1.7-4.7-4v-2.6l.5-.3s1.2-.8 1.2-2.4v-.7l.6-.3c.1 0 .6-.3.6-1.1 0-.2-.2-.5-.3-.6l-.4-.4.2-.5s.5-1.6.5-3.6c0-1.9-1.1-3.3-2-3.3h-.6l-.3-.5c0-.4-.7-.8-1.9-.8-3.1 0-5 1.7-5 4.5 0 1.3.5 3.5.5 3.5l.1.5-.4.5c-.1 0-.3.3-.3.7 0 .5.6 1.1.9 1.3l.4.3v.5c0 1.5 1.3 2.3 1.3 2.4l.5.3v2.6c0 2.4-2.6 3.6-5 4.6-1.1.4-2.6 1.1-2.8 1.6z" fill="#ffffff"/>
                        </Svg>
                    </TouchableOpacity>
                </View>

                }

                {this.state.numbers_are_forbidden &&

                <View style={styles.client_answer_popup}>
                    <View style={styles.client_answer_popup_wrapper}>
                        <Text style={styles.client_answer_popup_info}>
                            Связь с заказчиком вне платформы запрещена.
                            В случае повтора данной ситуации, ваш аккаунт будет заблокирован.
                        </Text>
                    </View>
                </View>
                }

                {this.state.selectionPerformerInvitePopup &&
                   <View style={styles.selection_performer_invite_popup}>
                       <View style={styles.selection_performer_invite_popup_wrapper}>
                           <View style={[styles.selection_performer_invite_popup_header_wrapper]}>
                               <View style={styles.selection_performer_invite_popup_header_icon}>
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
                                       <G clipPath="url(#clip0_1157_4787)">
                                           <Path
                                               d="M33.937 40.112c0-.66.124-1.28.373-1.86a4.843 4.843 0 012.516-2.55 4.488 4.488 0 011.835-.378h7.229v3.196h-7.23a1.544 1.544 0 00-1.12.468c-.14.14-.249.308-.33.5-.08.194-.12.402-.12.624 0 .223.04.435.12.635.081.193.19.364.33.513.147.14.315.252.505.334.19.081.396.122.616.122h3.153c.652 0 1.263.126 1.834.379.58.245 1.08.586 1.506 1.024.432.431.769.94 1.01 1.526.25.58.374 1.2.374 1.86 0 .66-.125 1.28-.374 1.86a4.761 4.761 0 01-1.01 1.526c-.425.43-.927.772-1.506 1.024a4.489 4.489 0 01-1.834.379h-6.999v-3.196h6.999a1.546 1.546 0 001.11-.457 1.601 1.601 0 00.46-1.136c0-.223-.04-.43-.12-.624a1.478 1.478 0 00-.34-.5 1.456 1.456 0 00-.495-.346 1.546 1.546 0 00-.615-.123H38.66a4.49 4.49 0 01-1.835-.378 4.94 4.94 0 01-1.505-1.025 5.015 5.015 0 01-1.01-1.526 4.737 4.737 0 01-.374-1.87zm21.071 11.182h-3.142V38.52h-4.735v-3.196h12.602v3.196h-4.725v12.774zm17.194 0h-10.8v-15.97h10.8v3.196h-7.647v3.196h5.175v3.196h-5.175v3.186h7.647v3.196zm14.392-1.637a8.002 8.002 0 01-2.46 1.47 7.959 7.959 0 01-2.824.512 7.78 7.78 0 01-2.165-.3 8.211 8.211 0 01-1.944-.825 8.564 8.564 0 01-2.933-2.974 8.811 8.811 0 01-.825-1.97 8.385 8.385 0 01-.285-2.194c0-.758.095-1.49.285-2.194a8.532 8.532 0 01.824-1.972 8.422 8.422 0 011.286-1.681 8.157 8.157 0 013.592-2.127c.696-.2 1.418-.301 2.165-.301.974 0 1.915.17 2.823.512a7.722 7.722 0 012.46 1.47l-1.669 2.784a4.655 4.655 0 00-1.637-1.158 4.895 4.895 0 00-1.977-.412c-.696 0-1.348.134-1.956.401a5.093 5.093 0 00-2.67 2.706 4.958 4.958 0 00-.395 1.972c0 .698.132 1.355.395 1.97a5.206 5.206 0 001.077 1.605c.454.46.985.824 1.593 1.09.608.268 1.26.402 1.956.402a5.01 5.01 0 001.977-.401 4.78 4.78 0 001.637-1.17l1.67 2.785zm4.988 1.637h-3.153v-15.97h3.153v6.392h6.295v-6.392h3.153v15.97h-3.153v-6.382h-6.295v6.382z"
                                               fill="#fff"
                                           />
                                       </G>
                                       <Defs>
                                           <ClipPath id="clip0_1157_4787">
                                               <Path
                                                   fill="#fff"
                                                   transform="translate(33.75 35.1)"
                                                   d="M0 0H67.5V16.65H0z"
                                               />
                                           </ClipPath>
                                       </Defs>
                                   </Svg>
                               </View>
                               <TouchableOpacity style={styles.selection_performer_invite_popup_header_close_icon}
                                    onPress={() => {
                                        this.setState({
                                            street: '',
                                            street_error_text: '',
                                            street_error: false,
                                            city: '',
                                            city_error_text: '',
                                            city_error: false,
                                            district: '',
                                            district_error_text: '',
                                            district_error: false,
                                            user_has_active_job: false,
                                            user_has_active_job_text: '',
                                            selectionPerformerInvitePopup: false,

                                        })
                                    }}
                               >
                                   <Svg
                                       width={30}
                                       height={30}
                                       viewBox="0 0 30 30"
                                       fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                   >
                                       <Path
                                           d="M4.024 5.351a.938.938 0 111.327-1.327l9.65 9.65 9.648-9.65a.938.938 0 111.328 1.327L16.326 15l9.65 9.649a.937.937 0 01-.663 1.602.94.94 0 01-.664-.275L15 16.326l-9.649 9.65a.94.94 0 01-1.53-.304.938.938 0 01.203-1.023L13.674 15l-9.65-9.649z"
                                           fill="#fff"
                                       />
                                   </Svg>
                               </TouchableOpacity>
                           </View>
                           <Text style={styles.selection_info}>Введите местоположение заказа</Text>

                           <KeyboardAwareScrollView style={styles.selection_performer_invite_popup_wrapper_child}>
                               {this.state.user_has_active_job &&
                                     <Text style={[styles.error_text, {marginBottom: 10, fontSize: 14}]}>{this.state.user_has_active_job_text}</Text>
                               }


                               <View style={styles.selection_performer_invite_popup_wrapper_child_input_title_wrapper}>
                                   <Text style={styles.selection_performer_invite_popup_wrapper_child_input_title}>
                                       Город
                                   </Text>

                                   <TextInput
                                       style={styles.selection_performer_invite_popup_wrapper_child_input_field}
                                       onChangeText={(val) => this.setState({city: val})}
                                       value={this.state.city}

                                   />

                                   {this.state.city_error  &&
                                   <Text  style={styles.error_text}>{this.state.city_error_text}</Text>
                                   }


                               </View>

                               <View style={styles.selection_performer_invite_popup_wrapper_child_input_title_wrapper}>
                                   <Text style={styles.selection_performer_invite_popup_wrapper_child_input_title}>
                                       Район
                                   </Text>

                                   <TextInput
                                       style={styles.selection_performer_invite_popup_wrapper_child_input_field}
                                       onChangeText={(val) => this.setState({district: val})}
                                       value={this.state.district}

                                   />

                                   {this.state.district_error  &&
                                        <Text  style={styles.error_text}>{this.state.district_error_text}</Text>
                                   }


                               </View>
                               <View style={styles.selection_performer_invite_popup_wrapper_child_input_title_wrapper}>
                                   <Text style={styles.selection_performer_invite_popup_wrapper_child_input_title}>
                                       Улица
                                   </Text>

                                   <TextInput
                                       style={styles.selection_performer_invite_popup_wrapper_child_input_field}
                                       onChangeText={(val) => this.setState({street: val})}
                                       value={this.state.street}

                                   />

                                   {this.state.street_error  &&
                                   <Text style={styles.error_text}>{this.state.street_error_text}</Text>
                                   }
                                   <Text style={styles.selection_info2}>* номер дома вводить не нужно</Text>

                               </View>
                           </KeyboardAwareScrollView>
                           <View style={styles.selection_performer_invite_popup_confirm_btn_parent}>
                               <TouchableOpacity style={styles.selection_performer_invite_popup_confirm_btn}
                                    onPress={() => {
                                        {this.addNewInvite()}
                                    }}
                               >
                                   <Text style={styles.selection_performer_invite_popup_confirm_btn_text}>Подтвердить</Text>
                               </TouchableOpacity>
                           </View>
                       </View>
                   </View>
                }


                {this.state.show_chat_img &&
                    <View style={styles.client_answer_popup}>
                        <View style={styles.chat_img_popup_wrapper}>
                            <TouchableOpacity style={{position: 'absolute', right: 15, top: 15, zIndex: 9}}
                                   onPress={() => this.setState({show_chat_img: false})}
                            >
                                <Svg
                                    width={25}
                                    height={25}
                                    viewBox="0 0 30 30"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <Path
                                        d="M4.024 5.351a.938.938 0 111.327-1.327l9.65 9.65 9.648-9.65a.938.938 0 111.328 1.327L16.326 15l9.65 9.649a.937.937 0 01-.663 1.602.94.94 0 01-.664-.275L15 16.326l-9.649 9.65a.94.94 0 01-1.53-.304.938.938 0 01.203-1.023L13.674 15l-9.65-9.649z"
                                        fill="#fff"
                                    />
                                </Svg>
                            </TouchableOpacity>
                            <Image  style={{width: '100%', height: '100%'}}  source={{uri: this.state.show_chat_img_item}}/>
                            <Svg
                                style={{position: 'absolute', bottom: -1, left: -5   , zIndex: -5,  transform: [{ rotate: '10deg'}], }}
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={16}
                                viewBox="0 0 14 16"
                                fill="none"
                            >
                                <Path
                                    d="M6.087 0c.106 5.478-.23 9.029-1.011 10.652-.725 1.507-2.265 2.963-4.619 4.37l-.359.21a.191.191 0 00-.07.266.2.2 0 00.153.095c4.974.47 9.058-.667 12.25-3.412L13.014 0H6.087z"
                                    fill="#FFB482"
                                />
                            </Svg>
                        </View>

                    </View>

                }

                {this.state.show_sender_chat_img &&
                <View style={styles.client_answer_popup}>
                    <View style={[styles.chat_img_popup_wrapper, {backgroundColor: '#DEDEDE'}]}>
                        <TouchableOpacity style={{position: 'absolute', right: 15, top: 15, zIndex: 9}}
                                          onPress={() => this.setState({show_sender_chat_img: false})}
                        >
                            <Svg
                                width={25}
                                height={25}
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <Path
                                    d="M4.024 5.351a.938.938 0 111.327-1.327l9.65 9.65 9.648-9.65a.938.938 0 111.328 1.327L16.326 15l9.65 9.649a.937.937 0 01-.663 1.602.94.94 0 01-.664-.275L15 16.326l-9.649 9.65a.94.94 0 01-1.53-.304.938.938 0 01.203-1.023L13.674 15l-9.65-9.649z"
                                    fill="#fff"
                                />
                            </Svg>
                        </TouchableOpacity>
                        <Image  style={{width: '100%', height: '100%'}}  source={{uri: this.state.show_sender_chat_img_item}}/>
                        <Svg
                            style={{position: 'absolute', bottom: -1, right: -5   , zIndex: -5,  transform: [{ rotate: '10deg'}], }}
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={16}
                            viewBox="0 0 14 16"
                            fill="none"
                        >
                            <Path
                                d="M7.912.185c-.106 5.478.23 9.029 1.011 10.652.726 1.507 2.265 2.963 4.619 4.37l.359.21a.191.191 0 01.07.266.2.2 0 01-.153.095c-4.974.47-9.058-.668-12.25-3.412L.985.185h6.927z"
                                fill="#DEDEDE"
                            />
                        </Svg>
                    </View>

                </View>

                }

                {this.state.inviteNotificationPopup  &&
                     <View style={styles.client_answer_popup}>
                    <View style={styles.client_answer_popup_wrapper}>
                        <Text style={styles.client_answer_popup_info}>
                            Запрос успешно отправлен
                        </Text>
                    </View>
                </View>
                }


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
        // position: 'absolute',
        // bottom: 0,
        // marginTop: 100
    },
    client_chat_header: {
        width: '100%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#ffffff',
        // shadowOffset: {
        //     width: 0,
        //     height: -2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius:20,
        //
        // elevation: 5,
        paddingTop: 13,
        paddingBottom: 13,
        paddingHorizontal: 20,
        position: 'relative',
        // top: -50,
        // zIndex: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    client_chat_header_title: {
         fontWeight: '500',
        fontSize: 18,
        color: '#333333',
    },
    // client_chat_header_img: {
    //      width: 40,
    //     height: 40,
    // },
    client_chat_header_img_child: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        overflow: 'hidden',
        resizeMode: 'cover'

    },
    client_chat_items_main_wrapper: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        // paddingBottom: 50,
        height: '100%',
        // paddingBottom: 90



    },
    select_executor_button: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#FF6600',
        borderRadius: 10,
        width: 205,
        height: 35,
        marginBottom: 5,
        marginTop: 3

    },
    select_executor_button_text: {

        color: '#ffffff',
        fontWeight: '400',
        fontSize: 15,
    },
    client_chat_hour_info_line_box: {
        marginTop: 50,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    client_chat_hour_info: {
        color: '#000000',
        // fontWeight: '300',
        fontSize: 17,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    client_chat_hour_info_line: {
        width: 66,
        borderBottomWidth: 1,
        borderBottomColor: '#FF6600',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    client_chat_messages_item_send: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        alignSelf: 'flex-end',
        backgroundColor: '#DEDEDE',
        borderRadius: 20,
        maxWidth: '80%',
        marginBottom: 15,
        position: 'relative',
        zIndex: 1,
        // flex: 1,
    },
    client_chat_messages_item_get: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#FFB482',
        borderRadius: 20,
        marginBottom: 15,
        // flex: 1,
        maxWidth: '80%',
        position: 'relative',
        zIndex: 1,
    },
    client_chat_message: {
        fontWeight: '400',
        fontSize: 17,
        color: '#000000',
    },

    chat_message_input_buttons_main_wrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        // position:'absolute',
        // zIndex: 99,
        // elevation: 10,
        backgroundColor: '#ffffff',


    },
    chat_message_input_field: {
        // marginLeft: 13,
        // marginRight: 7,
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        paddingHorizontal: 16,
        fontWeight: '400',
        fontSize: 14,
        color: '#000000',
        // maxWidth: 270,
        width: '75%',
        maxHeight: 120,
        // marginHorizontal: 7

    },
    message_send_btn: {
        height: 38,
        alignItems: 'center',
    },

    redirectToSingleProductPopup: {
        backgroundColor:  '#ffffff40',
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
    single_product_popup_wrapper: {
        position: 'relative',
        paddingTop: 22,
        paddingBottom: 61,
        paddingHorizontal: 35,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        width: 335,
    },
    single_product_popup_img: {
        marginBottom: 24,
        paddingTop: 78,
    },
    single_product_popup_title: {
        color: '#333333',
        fontSize: 22,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 38,
    },
    go_to_single_product_btn: {
        marginBottom: 20,
        width: '100%',
        backgroundColor: '#FF6600',
        borderRadius: 8,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    go_to_single_product_btn_text: {
        fontWeight: '700',
        fontSize: 18,
        color: '#ffffff',
    },
    not_go_to_single_product_btn: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#FF6600',
        borderRadius: 8,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    not_go_to_single_product_btn_text: {
        fontWeight: '700',
        fontSize: 18,
        color: '#333333',
    },
    single_product_popup_close_btn: {
        position: 'absolute',
        right: 22,
        top: 22,
    },
    client_chat_messages_item_img: {
        width: 66,
        height: 63,
        marginRight: 15,

    },
    client_chat_messages_item_img_child: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        resizeMode: 'cover'
    },


    chat_image_upload_btn: {
        height: 41,
        alignItems: 'center',
    },
    client_answer_popup: {
        backgroundColor:  'rgba(0, 0, 0, 0.60)',
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
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: 100,
    },
    client_answer_popup_wrapper: {
        width: '80%',
        height: 100,
        borderRadius: 10,
        backgroundColor: '#FF6600',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    client_answer_popup_info: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
    },
    single_product_page_write_message_btn: {
        width: 205,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#FF6600',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',

    },
    single_product_page_write_message_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 15,
    },
    single_product_page_write_message_btn_parent: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 110,
        zIndex: 999,
        // marginBottom: 50,
    },
    selection_performer_invite_popup: {
        backgroundColor:  '#ffffff40',
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
    selection_performer_invite_popup_wrapper: {
        width: '100%',
        height: '100%',
        backgroundColor: '#5E5E5E',
        paddingTop: 50,
        paddingHorizontal: 25,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    selection_performer_invite_popup_header_wrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 48,
    },
    selection_performer_invite_popup_wrapper_child: {
        flex: 1,
        width: '100%',
        height: '100%'

    },
    selection_performer_invite_popup_wrapper_child_input_title_wrapper: {
        width: '100%',
        marginBottom: 15,
    },
    selection_performer_invite_popup_wrapper_child_input_title: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '400',
        marginBottom: 12,
    },
    selection_performer_invite_popup_wrapper_child_input_field: {
        width: '100%',
        paddingHorizontal: 14,
        color: '#333333',
        fontSize: 15,
        fontWeight: '400',
        backgroundColor: '#F1F1F1',
        borderRadius: 6,
        height: 50,
    },
    selection_performer_invite_popup_confirm_btn_parent: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    selection_performer_invite_popup_confirm_btn: {
        width: 265,
        height: 50,
        backgroundColor: '#FF6600',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selection_performer_invite_popup_confirm_btn_text: {
        fontWeight: '700',
        fontSize: 18,
        color: '#ffffff',
  },

    error_text: {
        fontWeight: '500',
        fontSize: 12,
        color: 'red',
        marginTop: 10,
    },

    chat_img_popup_wrapper: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: 50,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFB482',
        borderRadius: 20,
        width: '90%',
        height: 350,
        position: 'relative',
        zIndex: 1,
        marginTop: 100
    },
    client_chat_messages_items_wrapper: {
        width: '100%',
        flex: 1,
        height: '100%',


    },

    // client_chat_messages_items_child: {
    //     width: '100%',
    //     alignItems: 'flex-start',
    //     justifyContent: 'center',
    //     flex: 1,
    //     backgroundColor: 'red'
    // },


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
    },
    selection_info: {
        fontWeight: '700',
        fontSize: 25,
        color: '#ffffff',
        textAlign: 'center',
        // marginTop: 20,
        marginBottom: 20,
    },
    selection_info2: {
        fontWeight: '700',
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'right',
        marginTop: 20,

    }
});
