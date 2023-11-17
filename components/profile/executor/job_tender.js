import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, {PROVIDER_GOOGLE } from 'react-native-maps';
import {APP_URL} from '../../../env'

let Marker = MapView.Marker;
import {AuthContext} from "../../AuthContext/context";
import AsyncStorage from '@react-native-async-storage/async-storage';



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
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Dimensions,
    FlatList
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




export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            job_tender_info: [],
            image_path: 'https://admin.stechapp.ru/uploads/',
            loaded_tender: false,
            balance: '',
            count_notification: '',
            count_message: '',

        };

    }

    static contextType = AuthContext;


    getJobTenderInfo = async () => {

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;

        await  this.setState({
            loaded_tender: true,
        })

        try {
            fetch(`${APP_URL}/getAllTenderForRoleId3`, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


            }).then((response) => {
                return response.json()
            }).then(async (response) => {


                await this.setState({
                    loaded_tender: false,
                })


                if (response.status === true) {
                    this.setState({
                        job_tender_info: response.data.tender.data,
                        balance: response.data.balance

                    })
                } else {
                    this.setState({
                        job_tender_info: [],

                    })
                }




            })
        } catch (e) {
        }
    }


    componentDidMount() {
        const { navigation } = this.props;
        this.getJobTenderInfo();
        this.getNotificationsCount();
        this.focusListener = navigation.addListener("focus", () => {
            this.getJobTenderInfo();
            this.getNotificationsCount();



        });

    }

    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener) {
            this.focusListener();
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


    redirectToSignUp = () => {
        this.props.navigation.navigate("SignUp");

    }


    redirectToClientPersonalArea = () => {
        this.props.navigation.navigate("PersonalArea");

    }

    redirectToCreateAnOrderCategory = () => {
        this.props.navigation.navigate("CreateAnOrderCategory");
    }

    redirectToClientChat = () => {
        this.props.navigation.navigate("ClientChat");
    }

    redirectToClientNotifications = () => {
        this.props.navigation.navigate("ClientNotifications");
    }

    redirectToExecutorNotifications = () => {
        this.props.navigation.navigate("ExecutorNotifications");
    }

    redirectToExecutorChat = () => {
        this.props.navigation.navigate("ExecutorChat");

    }

    redirectToExecutorCatalogueMainPage = () => {
        this.props.navigation.navigate("ExecutorCatalogueMainPage");

    }

    redirectToExecutorPersonalArea = () => {
        this.props.navigation.navigate("PersonalAreaExecutor");

    }

    responceToTender = async (tender) => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;



        let receiver_id = tender.author_tender.id;
        let tender_id = tender.id;
        let user_image = tender.author_tender.photo;
        let user_name = tender.author_tender.name;


        try {
            fetch(`${APP_URL}/StartChat`, {
                method: 'POST',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receiver_id: receiver_id,
                    tender_id: tender_id,
                })



            }).then((response) => {
                return response.json()
            }).then((response) => {


                if (response.status === true) {
                    this.props.navigation.navigate('ExecutorTenderChatSinglePage',{
                        params1: receiver_id,
                        params2: tender_id,
                        params3: user_image,
                        params4: user_name,
                    })

                }


            })
        } catch (e) {
        }
    }

    render() {

        if (this.state.loaded_tender) {
            return (
                <View style={{backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: '100%',  height: '100%', }}>

                    <ActivityIndicator size="large" color="#FF6600" />

                </View>
            )
        }


        return (
            <SafeAreaView  edges={['right', 'left', 'top']} style={styles.container} >
                <StatusBar style="dark" />


                    <View style={styles.job_tender_header}>

                        <TouchableOpacity
                            style={styles.job_tender_header_back_btn}
                            onPress={() => {this.props.navigation.navigate('ExecutorCatalogueMainPage')}}
                        >
                            <Svg  width={35}  height={35}  viewBox="0 0 35 35"  fill="none"  xmlns="http://www.w3.org/2000/svg">
                                <Path
                                    d="M20.168 27.708a1.46 1.46 0 01-1.137-.54l-7.044-8.75a1.458 1.458 0 010-1.851l7.292-8.75a1.46 1.46 0 112.245 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.138 2.391z" fill="#000"
                                />
                            </Svg>
                        </TouchableOpacity>

                        <Text style={styles.job_tender_header_title}>Тендер на работу</Text>

                    </View>

                    <ScrollView style={styles.catalogue_main_wrapper} >

                        <View style={styles.catalogue_lists_items_wrapper}>

                            {/*{this.state.job_tender_info.length == 0 &&*/}
                            {/*  <View style={styles.tender_not_found_title_wrapper}>*/}
                            {/*      <Text style={styles.tender_not_found_title}>Tender Not Found</Text>*/}
                            {/*  </View>*/}

                            {/*}*/}
                            {this.state.job_tender_info.length > 0 ?
                                <View style={{width: '100%'}}>
                                    {this.state.job_tender_info.map((selected_product, index) => {

                                        return (

                                            <View
                                                key={index}
                                                style={styles.selected_product_info_main_wrapper}
                                            >

                                                <View style={styles.product_owner_info_rating_info_main_wrapper}>
                                                    <View style={styles.product_owner_info_wrapper}>
                                                        <View style={styles.product_owner_img}>
                                                            <Image style={styles.product_owner_img_child}  source={{uri: this.state.image_path + selected_product.author_tender.photo }} />

                                                        </View>
                                                        <View style={styles.product_owner_name_box}>
                                                            <Text style={styles.product_owner_name}>{selected_product.author_tender.name} {selected_product.author_tender.surname}</Text>
                                                        </View>

                                                    </View>

                                                    <View style={styles.product_owner_beginning_work_hour_title_info_box}>
                                                        <Text style={styles.product_owner_beginning_work_hour_title}>Начало работы</Text>
                                                        <View style={styles.product_owner_beginning_work_hour_date_info_box}>
                                                            <Text style={styles.product_owner_beginning_work_hour_date_info}>{selected_product.date_time}</Text>

                                                        </View>

                                                    </View>
                                                </View>

                                                <Text style={styles.product_main_info}  numberOfLines={5} ellipsizeMode='tail'>
                                                    {selected_product.description}
                                                </Text>

                                                <ScrollView horizontal={true} nestedScrollEnabled = {true} style={{width: '100%', marginBottom: 15}}>

                                                    {selected_product.tender.map((product_img, index) => {
                                                        return (
                                                            <View key={index} style={[styles.product_img, {width: 140, height: 90, marginRight: 10}]}>
                                                                <Image style={[styles.product_img_child, {width: '100%', height: '100%'}]}  source={{uri: this.state.image_path + product_img.photo }} />
                                                            </View>
                                                        )
                                                    })}
                                                </ScrollView>

                                                <View style={styles.product_city_street_info_btn_wrapper}>
                                                    <View style={styles.product_city_street_info_box}>
                                                        <Text style={styles.product_city_info}>Г. {selected_product.city_name}</Text>
                                                        <Text style={styles.product_street_info}>ул. {selected_product.street}</Text>
                                                    </View>

                                                    {selected_product.tender_order_message_key.length > 0

                                                        ?
                                                        <View style={styles.product_responce_btn}>
                                                            <Text style={styles.product_responce_btn_text}>Вы откликнулись</Text>
                                                        </View>
                                                        :
                                                        <View>
                                                            {this.state.balance < 0 ?
                                                                <TouchableOpacity style={[styles.product_responce_btn, {opacity: 0.6}]} disabled={true}>
                                                                    <Text style={styles.product_responce_btn_text}>Откликнутся</Text>
                                                                </TouchableOpacity>
                                                                :
                                                                <TouchableOpacity style={styles.product_responce_btn} onPress={() => {this.responceToTender(selected_product)}}>
                                                                    <Text style={styles.product_responce_btn_text}>Откликнутся</Text>
                                                                </TouchableOpacity>
                                                            }


                                                        </View>



                                                    }

                                                </View>
                                            </View>



                                        );
                                    })}
                                </View>
                                :
                                <View style={{justifyContent: 'center', alignSelf: 'center', alignItems: 'center', paddingTop: 100}}>
                                    <Text style={{fontWeight: '700',fontSize: 20, color: '#000000',}}>Ничего не найдено</Text>
                                </View>
                            }






                        </View>


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
                        <TouchableOpacity style={[styles.footer_btn, {position:'relative', top: 4}]} onPress={() => {this.redirectToExecutorCatalogueMainPage()}}>
                            <Svg width={41} height={32} viewBox="0 0 41 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <G clipPath="url(#clip0_788_2223)" fill="#ffffff">
                                    <Path d="M27.124 22.4l-1.233 2.32 6.038-.988c-1.219-.611-2.868-1.048-4.805-1.332zm-15.555.506C8.772 23.643 7 24.852 7 26.647c.001.387.086.768.248 1.12l9.69-1.585-5.37-3.276zM33.973 25.6l-13.488 2.198 3.557 4.047c5.841-.523 10.158-2.389 10.158-5.198 0-.374-.08-.722-.227-1.047zm-15.767 2.578l-9.114 1.49C11.502 31.16 15.753 32 20.6 32c.294 0 .58-.008.87-.014l-3.264-3.808zM20.602 0c-5.216 0-9.497 4.266-9.497 9.47 0 2.017.646 3.896 1.735 5.435l-.033-.05 6.163 10.652.026.035c.243.317.48.567.759.751.278.184.624.295.963.26.677-.067 1.093-.546 1.487-1.08l.02-.028 6.796-11.564.004-.008c.16-.288.277-.58.377-.866a9.36 9.36 0 00.694-3.537c0-5.204-4.278-9.47-9.494-9.47zm0 1.328c4.492 0 8.166 3.666 8.166 8.142a8.018 8.018 0 01-.6 3.05l-.008.017-.006.016a4.4 4.4 0 01-.291.677l-6.738 11.466c-.31.414-.538.536-.54.537 0 0-.004.014-.097-.048-.09-.059-.243-.205-.422-.435l-6.125-10.587-.017-.024a8.054 8.054 0 01-1.49-4.668c0-4.477 3.675-8.143 8.168-8.143zm0 2.799a5.341 5.341 0 00-5.358 5.343 5.341 5.341 0 005.358 5.344 5.34 5.34 0 005.356-5.344 5.34 5.34 0 00-5.356-5.343zm0 1.328c2.262 0 4.028 1.762 4.028 4.015 0 2.254-1.766 4.016-4.028 4.016-2.264 0-4.03-1.763-4.03-4.016s1.766-4.015 4.03-4.015z" />
                                </G>
                                <Defs>
                                    <ClipPath id="clip0_788_2223">
                                        <Path fill="#ffffff" d="M0 0H41V32H0z" />
                                    </ClipPath>
                                </Defs>
                            </Svg>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.footer_btn, {position:'relative', top: -2}]} onPress={() => this.redirectToExecutorPersonalArea()}>
                            <Svg width={38} height={38} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M19.1 36c-9.4 0-17-7.6-17-17s7.6-17 17-17 17 7.6 17 17-7.7 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.8-15-15-15z" fill="#ffffff"/>
                                <Path d="M9.3 31.3l-1.8-.8c.5-1.2 2.1-1.9 3.8-2.7 1.7-.8 3.8-1.7 3.8-2.8v-1.5c-.6-.5-1.6-1.6-1.8-3.2-.5-.5-1.3-1.4-1.3-2.6 0-.7.3-1.3.5-1.7-.2-.8-.4-2.3-.4-3.5 0-3.9 2.7-6.5 7-6.5 1.2 0 2.7.3 3.5 1.2 1.9.4 3.5 2.6 3.5 5.3 0 1.7-.3 3.1-.5 3.8.2.3.4.8.4 1.4 0 1.3-.7 2.2-1.3 2.6-.2 1.6-1.1 2.6-1.7 3.1V25c0 .9 1.8 1.6 3.4 2.2 1.9.7 3.9 1.5 4.6 3.1l-1.9.7c-.3-.8-1.9-1.4-3.4-1.9-2.2-.8-4.7-1.7-4.7-4v-2.6l.5-.3s1.2-.8 1.2-2.4v-.7l.6-.3c.1 0 .6-.3.6-1.1 0-.2-.2-.5-.3-.6l-.4-.4.2-.5s.5-1.6.5-3.6c0-1.9-1.1-3.3-2-3.3h-.6l-.3-.5c0-.4-.7-.8-1.9-.8-3.1 0-5 1.7-5 4.5 0 1.3.5 3.5.5 3.5l.1.5-.4.5c-.1 0-.3.3-.3.7 0 .5.6 1.1.9 1.3l.4.3v.5c0 1.5 1.3 2.3 1.3 2.4l.5.3v2.6c0 2.4-2.6 3.6-5 4.6-1.1.4-2.6 1.1-2.8 1.6z" fill="#ffffff"/>
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

    catalogue_main_wrapper:{
        flex: 1,
        width: '100%',
        paddingBottom: 50,
        paddingHorizontal: 20,
    },

    job_tender_header: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 70,
        paddingBottom: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#ffffff',
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius:20,

        elevation: 5,
        position: 'relative',
        zIndex: 999,
        top: -50,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    job_tender_header_back_btn: {
        position: 'absolute',
        left: 20,
        top: 65,
    },
    job_tender_header_title: {
        fontWeight: '700',
        fontSize: 22,
        color: '#000000',
        position:'relative',
        top: -4
    },
    catalogue_logo_img: {
        marginBottom: 11,
    },
    catalogue_search_input_btn_filter_btn_wrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
        padding: 5,
    },
    catalogue_search_input_filter_btn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filter_btn: {
        marginRight: 10,
    },

    search_input_field: {
        width: '65%',
        fontSize: 14,
        fontWeight: '400',
        color: '#999999',

    },
    catalogue_list_map_buttons_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    catalogue_list_map_button: {
        borderWidth: 2,
        borderColor: '#F0F0F0',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48.5%',
    },
    catalogue_list_map_button_svg: {
        marginRight: 6,
    },


    catalogue_list_map_button_text: {
        fontSize: 15,
        fontWeight: '400',
        color: '#333333',
    },
    activeBackground: {
        backgroundColor: '#F0F0F0'
    },
    create_order_btn: {
        backgroundColor: '#FF6600',
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent:'center',
        flexDirection: 'row',
        paddingVertical: 14,
        width: 222,
        marginBottom: 50,

    },
    create_order_btn_text: {
        fontSize: 17,
        fontWeight: '700',
        color: '#ffffff',
        marginLeft: 6
    },

    catalogue_lists_item_title: {
        fontWeight: '700',
        fontSize: 22,
        color: '#000000',
        marginBottom: 20,
    },
    catalogue_lists_item: {
        backgroundColor: '#ECECEC',
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 10,
        height: 136,
        // maxWidth: 107,
        width: '32%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        marginRight: 7,
    },
    catalogue_lists_items_wrapper: {
        width: '100%',
        marginBottom: 50,
    },
    catalogue_list_img: {
        marginBottom: 13,
        width: 89,
        height: 58,
    },
    catalogue_list_img_child: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'

    },
    catalogue_list_title: {
        fontSize: 12,
        fontWeight: '700',
        color: '#333333',
        textAlign: 'center'
    },
    selected_product_info_main_wrapper: {
        width: '100%',
        marginBottom: 15,
        backgroundColor: '#F1F1F1',
        borderRadius: 10,
        paddingHorizontal: 11,
        paddingTop: 11,
        paddingBottom: 17,
    },
    product_owner_info_rating_info_main_wrapper: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        marginBottom: 11,
        width: '100%',
    },
    product_owner_info_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    product_owner_img: {
        marginRight: 8,
        width: 40,
        height: 40,

    },

    product_owner_img_child: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        overflow: 'hidden',
        resizeMode: 'cover',
    },
    product_owner_name: {
        fontWeight: '400',
        fontSize: 16,
        color: '#333333',
    },
    product_type_name: {
        fontWeight: '400',
        fontSize: 12,
        color: '#333333',
    },

    product_rating_box: {
        width: 45,
        height: 32,
        backgroundColor: '#FF6600',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',

    },
    product_rating_info: {
        fontWeight: '400',
        fontSize: 17,
        color: '#ffffff',
    },
    product_distance_price_info_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    product_distance_svg_info_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    product_distance_info: {
        marginLeft: 2,
        fontWeight: '300',
        fontSize: 16,
        color: '#000000',
    },

    product_price_info: {
        fontWeight: '400',
        fontSize: 20,
        color: '#FF6600',
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
    redirectToSingleProductPopup: {
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
    filterPopup: {
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
        alignSelf: 'flex-start',
        // alignItems: 'center',
        justifyContent: 'flex-start',
    },


    single_product_popup_close_btn: {
        position: 'absolute',
        right: 22,
        top: 22,
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
    map_buttons_wrapper: {
        width: '100%',
        position: 'absolute',
        zIndex: 999,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        bottom: 0,
        paddingHorizontal: 10,
    },
    filter_popup_wrapper: {
        backgroundColor:'#5E5E5E',
        width: '85%',
        height: '100%',
        paddingTop: 70,
        paddingBottom: 64,
        paddingHorizontal: 20,
    },
    filter_popup_img_close_btn_wrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
        width: '100%',
        justifyContent: 'space-between',
    },
    filter_popup_title: {
        marginBottom: 35,
        fontWeight: '400',
        fontSize: 20,
        color: '#FF6600',
    },
    sign_up_input_title_wrapper: {
        marginBottom: 13,
        width: '100%',
    },
    sign_up_input_title: {
        marginBottom: 8,
        fontWeight: '400',
        fontSize: 16,
        color: '#ffffff',
    },
    apply_button: {
        backgroundColor: '#FF6600',
        borderRadius: 6,
        width: 265,
        height: 50,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 40,
        position: 'relative',
        zIndex: -1,
    },
    apply_button_text: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 18,
    },
    product_owner_beginning_work_hour_title: {
        fontWeight: '300',
        fontSize: 10,
        color: '#333333',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end'
    },
    product_owner_beginning_work_hour_date_info_box: {
        // flexDirection: 'row',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end'
    },
    product_owner_beginning_work_hour_date_info: {
        fontWeight: '400',
        fontSize: 13,
        color: '#333333',
        // marginRight: 6,
    },
    product_owner_beginning_work_hour_info: {
        fontWeight: '400',
        fontSize: 13,
        color: '#333333',
    },

    product_main_info: {
        marginBottom: 15,
        fontWeight: '400',
        fontSize: 13,
        color: '#000000',
    },
    product_city_street_info_btn_wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    product_city_info: {
        marginBottom: 2,
        fontWeight: '400',
        fontSize: 14,
        color: '#333333',
    },
    product_street_info: {
        fontWeight: '300',
        fontSize: 12,
        color: '#333333',
    },
    product_responce_btn: {
        backgroundColor: '#FF6600',
        borderRadius: 8,
        width: 163,
        height: 32,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    product_responce_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },
    product_owner_beginning_work_hour_title_info_box: {
        // position:'relative',
        // top: 5,
        // right: 10,
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
    },
    tender_not_found_title_wrapper: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        paddingTop: 100,

    },
    tender_not_found_title: {
        fontSize: 20,
        fontWeight: '500',
        color: '#333333',
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
