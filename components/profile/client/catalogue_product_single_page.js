import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {AuthContext} from "../../AuthContext/context";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Dimensions,
    FlatList, Keyboard
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
            searchInput: '',
            catalogue_list: true,
            catalogue_map: false,

            selected_subcategories: [],
            selected_products: [],

            is_pressed_category: false,
            show_product: false,

            main_title: '',

            redirectToSingleProductPopup: false,

            reviews: [],
            showMoreReviews: false,
            user_info: [],

            user_transport_images: [],
            user_transport_additional: [],

            image_path: 'https://admin.stechapp.ru/uploads/',
            user_photo: '',
            user_name: '',
            loaded_page: false,
            user_type: '',
            count_notification: '',
            count_message: '',

        };

    }

    static contextType = AuthContext;


    componentDidMount() {
        const { navigation } = this.props;

         this.getExecutorInfo();
         this.getNotificationsCount();
        this.focusListener = navigation.addListener("focus", () => {
            this.getExecutorInfo();
            this.getNotificationsCount();
        });



        // AsyncStorage.clear();
    }
    componentWillUnmount() {
        if (this.focusListener) {
            this.focusListener();
        }
    }


    getExecutorInfo = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let id = this.props.id;
        await this.setState({
            loaded_page: true
        })
        try {
            fetch(`${APP_URL}/OnePageRoleId3`, {
                method: 'POST',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                   user_id: id

                })


            }).then((response) => {
                return response.json()
            }).then( async (response) => {

                console.log(response, 'executor info')
                    if (response.status === true) {
                        await this.setState({
                            loaded_page: false,
                             user_info: response.message.user,
                             user_photo: response.message.user.photo,
                             user_name: response.message.user.name,
                             receiver_id: response.message.user.id,
                            user_transport_images: response.message.user.user_transport[0].transpor_photo,
                            user_transport_additional: response.message.user.user_transport[0].transport_additional,
                            reviews: response.message.user.role_id3_reviews,
                            user_type: response.message.user_type_job
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
    redirectToClientCatalogueMainPage = () => {
        let redirect_from = this.props.redirect_from;
        if (redirect_from == 'from map') {
            this.props.navigation.navigate("ClientCatalogueMainPage");
        } else if (redirect_from == 'from executors list') {
            this.props.navigation.navigate("ExecutorsLists");
        } else  if (redirect_from == 'from chat single page') {
            this.props.navigation.navigate("ClientChatSinglePage", {
                params1: this.state.receiver_id,
                params2: this.state.user_name,
                params3: this.state.user_photo,
            });
        } else  if (redirect_from == 'from chat tender single page') {
            this.props.navigation.navigate("ClientTenderChatSinglePage", {
                params1: this.state.receiver_id,
                params2: this.props.tender_id,
                params3: this.state.user_name,
                params4: this.state.user_photo,
            });
        }

    }
    redirectToClientChat = () => {
        this.props.navigation.navigate("ClientChat");

    }


    redirectToClientNotifications = () => {
        this.props.navigation.navigate("ClientNotifications");
    }

    redirectToClientChatSinglePage = async () => {

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let receiver_id = this.state.receiver_id;
        let user_name =  this.state.user_name;
        // let user_image = this.state.user_photo;
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
            }).then((response) => {


                if (response.status === true) {
                    this.props.navigation.navigate("ClientChatSinglePage",{
                        params1: receiver_id,
                        params2: user_name,
                        params3: this.state.user_photo,
                    });
                }

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


    render() {

        if (this.state.loaded_page) {
            return (
                <View style={{backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: '100%',  height: '100%', }}>

                    <ActivityIndicator size="large" color="#FF6600" />

                </View>
            )
        }

        return (
            <SafeAreaView  edges={['right', 'left', 'top']} style={styles.container} >
                <StatusBar style="dark" />


                <View style={styles.product_single_page_header}>


                        <TouchableOpacity  style={styles.product_single_page_back_btn} onPress={() => {this.props.navigation.goBack()}}>
                            <Svg
                                width={35}
                                height={35}
                                viewBox="0 0 35 35"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <Path
                                    d="M20.168 27.708a1.458 1.458 0 01-1.137-.54l-7.044-8.75a1.458 1.458 0 010-1.851l7.292-8.75a1.46 1.46 0 112.245 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.138 2.391z"
                                    fill="#000"
                                />
                            </Svg>
                        </TouchableOpacity>
                        <Text style={styles.product_single_page_title}>Профиль исполнителя</Text>
                        {/*<TouchableOpacity style={styles.product_single_page_chat_btn} onPress={() => {this.redirectToClientChatSinglePage()}}>*/}
                        {/*    <Svg*/}
                        {/*        width={35}*/}
                        {/*        height={35}*/}
                        {/*        viewBox="0 0 35 35"*/}
                        {/*        fill="none"*/}
                        {/*        xmlns="http://www.w3.org/2000/svg"*/}
                        {/*    >*/}
                        {/*        <Path*/}
                        {/*            d="M9.15 10.206h16.556M9.15 14.797h11.474M9.149 19.388h6.39M29.57 4H5.431c-.38.001-.743.155-1.011.429-.269.273-.42.644-.421 1.03V31l5.31-5.414h20.258c.38-.001.743-.155 1.011-.429.269-.273.42-.644.421-1.03V5.459a1.478 1.478 0 00-.42-1.03A1.423 1.423 0 0029.567 4v0z"*/}
                        {/*            stroke="#F60"*/}
                        {/*            strokeWidth={2}*/}
                        {/*            strokeLinecap="round"*/}
                        {/*            strokeLinejoin="round"*/}
                        {/*        />*/}
                        {/*    </Svg>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                <View style={styles.product_single_page_img_rating_price_info_main_wrapper}>

                    <View style={styles.product_single_page_img_info_box}>
                        <View style={styles.product_single_page_img}>
                            <Image style={styles.product_single_page_img_child} source={{uri: this.state.image_path + this.state.user_photo}}/>

                        </View>
                        <View style={styles.product_single_page_info_box}>
                            <Text style={styles.product_single_page_info1}>{this.state.user_info.name} {this.state.user_info.surname}</Text>
                            <Text style={styles.product_single_page_info2}>Выполнено работ</Text>
                            {this.state.user_type == 'time' &&
                               <Text style={styles.product_single_page_info3}>{this.state.user_info.user_history_sum_time ? this.state.user_info.user_history_sum_time : 0} часов</Text>
                            }
                            {this.state.user_type == 'raice' &&
                                <Text style={styles.product_single_page_info3}>{this.state.user_info.user_history_sum_raice ? this.state.user_info.user_history_sum_raice : 0} рейсов</Text>
                            }
                        </View>
                    </View>

                    <View style={styles.product_single_page_rating_price_main_info}>
                        <View style={styles.product_single_page_rating_box}>
                            <Text style={styles.product_single_page_rating_info}>
                                {this.state.user_info.role_id3_reviews_avg_grade ? parseFloat(this.state.user_info.role_id3_reviews_avg_grade).toFixed(1) : 5.0}
                            </Text>
                        </View>
                        <Text style={styles.product_single_page_price_info}>{this.state.user_info.priceJob ? this.state.user_info.priceJob : 0} руб/{this.state.user_type == 'raice' ? 'рейс' :  this.state.user_type == 'time' ? 'час' : ''} </Text>
                    </View>
                </View>
                <ScrollView style={styles.product_single_page_scroll}>
                     <View style={styles.product_single_page_reviews_slider_main_wrapper}>

                         <ScrollView horizontal={true} nestedScrollEnabled = {true}  style={{width: '100%', marginBottom: 15, overflow:'hidden', borderRadius: 8}}>
                             {this.state.user_transport_images.map((transport_img, index) => {
                                 return (
                                     <View key={index} style={styles.product_single_page_slider_img}>
                                         <Image style={styles.product_single_page_slider_img_child}  source= {{uri: this.state.image_path + transport_img.photo}} />
                                     </View>
                                 )
                             })}



                             {/*<View style={styles.product_single_page_slider_img}>*/}
                             {/*    <Image style={styles.product_single_page_slider_img_child}  source= {require('../../../assets/images/product_img3.png')} />*/}
                             {/*</View>*/}

                             {/*<View style={styles.product_single_page_slider_img}>*/}
                             {/*    <Image style={styles.product_single_page_slider_img_child}  source= {require('../../../assets/images/product_img2.png')} />*/}
                             {/*</View>*/}

                         </ScrollView>

                         {this.state.user_transport_additional.length > 0 &&

                                 <View style={styles.optional_equipment_info_box}>

                                     <Text style={styles.optional_equipment_info_box_title}>
                                         Дополнительная информация
                                     </Text>


                                     <View style={styles.optional_equipment_info_box_child}>
                                         {this.state.user_transport_additional.map((item, index) => {
                                             if(this.state.user_transport_additional.length == index + 1) {
                                                 return (
                                                     <View key={index}>
                                                         {item.additional_name !== null &&
                                                         <Text   style={styles.optional_equipment_info_box_child_info}>{item.additional_name}</Text>
                                                         }
                                                     </View>
                                                 )

                                             } else {
                                                 return (
                                                     <View key={index}>
                                                         {item.additional_name !== null &&
                                                         <Text   style={styles.optional_equipment_info_box_child_info}>{item.additional_name}, </Text>
                                                         }
                                                     </View>
                                                 )

                                             }


                                         })}
                                     </View>




                                 </View>
                         }



                         <View style={styles.product_single_page_reviews_wrapper}>
                              <Text style={styles.product_single_page_reviews_title}>Отзывы</Text>

                             {this.state.reviews.length == 0 ?
                                 <View style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'center', paddingTop: 30}}>
                                     <Text style={{
                                         fontSize: 16,
                                         fontWeight: '500',
                                         color: '#000000',
                                     }}>
                                         Еще нет отзыва
                                     </Text>
                                 </View>
                                 :
                                 <View>
                                     {this.state.showMoreReviews === false && this.state.reviews.length > 0 &&
                                     <View style={{width: '100%'}}>
                                         <View style={styles.product_single_page_reviews_box}>
                                             <View
                                                 style={styles.product_single_page_reviews_box_title_rating_info_main_wrapper}>
                                                 <View style={styles.product_single_page_reviews_rating_box}>
                                                     <Text style={styles.product_single_page_reviews_rating_info}>{this.state.reviews[0].grade}</Text>
                                                 </View>
                                                 <Text style={styles.product_single_page_reviews_box_title_rating_info_main_title}>Оценка</Text>

                                             </View>
                                             <Text style={styles.product_single_page_reviews_rating_box_text}>
                                                 {this.state.reviews[0].message}
                                             </Text>
                                         </View>
                                         <TouchableOpacity style={styles.show_more_reviews_btn} onPress={() => {this.setState({showMoreReviews: true})}}>
                                             <Text style={styles.show_more_reviews_btn_text}>Больше отзывов</Text>
                                         </TouchableOpacity>
                                     </View>

                                     }

                                     {this.state.showMoreReviews === true && this.state.reviews.length > 0 &&
                                     <View>
                                         {this.state.showMoreReviews && this.state.reviews.map((review, index) => {
                                             return (
                                                 <View key={index} style={styles.product_single_page_reviews_box}>
                                                     <View
                                                         style={styles.product_single_page_reviews_box_title_rating_info_main_wrapper}>
                                                         <View style={styles.product_single_page_reviews_rating_box}>
                                                             <Text
                                                                 style={styles.product_single_page_reviews_rating_info}>{review.grade}</Text>
                                                         </View>
                                                         <Text
                                                             style={styles.product_single_page_reviews_box_title_rating_info_main_title}>Оценка</Text>

                                                     </View>
                                                     <Text style={styles.product_single_page_reviews_rating_box_text}>
                                                         {review.message}
                                                     </Text>
                                                 </View>

                                             )

                                         })}
                                         <TouchableOpacity style={styles.show_more_reviews_btn} onPress={() => {
                                             this.setState({showMoreReviews: false})
                                         }}>
                                             <Text style={styles.show_more_reviews_btn_text}>Свернуть</Text>
                                         </TouchableOpacity>
                                     </View>

                                     }
                                 </View>
                             }



                         </View>
                         <TouchableOpacity style={styles.single_product_page_write_message_btn} onPress={() => {this.redirectToClientChatSinglePage()}}>
                             <Text style={styles.single_product_page_write_message_btn_text}>Написать сообщение</Text>
                         </TouchableOpacity>
                     </View>
                </ScrollView>
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
                        <TouchableOpacity style={[styles.footer_btn, {position: 'relative'}]} onPress={() => this.redirectToClientChat()}>
                            {this.state.count_message != '' &&
                            <View style={styles.notification_count_box}>
                                <Text style={styles.notification_count_text}>{this.state.count_message}</Text>
                            </View>
                            }
                            <Svg width={35} height={36} viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M9.15 10.706h16.556M9.15 15.297h11.474M9.149 19.888h6.39M29.57 4.5H5.431c-.38.001-.743.155-1.011.429-.269.273-.42.644-.421 1.03V31.5l5.31-5.414h20.258c.38-.001.743-.155 1.011-.429.269-.273.42-.644.421-1.03V5.959a1.478 1.478 0 00-.42-1.03 1.423 1.423 0 00-1.012-.429v0z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                            </Svg>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.footer_btn, {position:'relative', top: 4}]}>
                            <Svg width={41} height={32} viewBox="0 0 41 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M35 28.535l-4.857-4.855a8.314 8.314 0 10-1.464 1.465L33.536 30 35 28.535zm-11.393-3.714a6.214 6.214 0 116.214-6.214 6.221 6.221 0 01-6.214 6.214zM6 11.357h8.286v2.072H6v-2.072zM6 1h16.571v2.071H6V1zm0 5.179h16.571V8.25H6V6.179z" fill="#F60"/>
                            </Svg>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.footer_btn, {position:'relative', top: -2}]} onPress={() => this.redirectToClientPersonalArea()}>
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

    product_single_page_header: {
       width: '100%',
        marginBottom: 20,
        paddingTop: 23,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        position: 'relative'
    },

    product_single_page_title: {
        fontWeight: '700',
        color: '#333333',
        fontSize: 17,
    },
    product_single_page_img_rating_price_info_main_wrapper: {
       paddingHorizontal: 15,
        marginBottom: 23,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    product_single_page_rating_price_main_info: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flex: 1,
    },
    product_single_page_img_info_box: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1

    },
    product_single_page_rating_box:{
        width: 45,
        height: 32,
        borderWidth: 1,
        borderColor: '#FF6600',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 6,
        marginBottom: 5,
    },
    product_single_page_price_info: {
        fontWeight: '700',
        fontSize: 12,
        color: '#333333',
        position: 'relative',
        top: 5
    },
    product_single_page_rating_info: {
       fontWeight: '400',
       fontSize: 17,
        color: '#FF6600',
    },
    product_single_page_info1: {
       fontWeight: '700',
        fontSize: 16,
        color: '#333333',
        marginBottom: 2,
    },
    product_single_page_info2: {
        fontWeight: '300',
        fontSize: 12,
        color: '#333333',
        marginBottom: 2,
    },
    product_single_page_info3: {
        fontWeight: '700',
        fontSize: 14,
        color: '#FF6600',
    },
    product_single_page_img: {
         width: 70,
         height: 70,
         marginRight: 14,
    },
    product_single_page_img_child: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 100,
        overflow: 'hidden',

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

    product_single_page_slider_img: {
        width: 200,
        height: 128,
        marginRight: 10,
    },
    product_single_page_scroll: {
       width: '100%',
       flex: 1,
        backgroundColor: '#F0F0F0',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },

    product_single_page_slider_img_child: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 8,
        overflow: 'hidden',
    },

    product_single_page_reviews_slider_main_wrapper: {
        width: '100%',
        paddingTop: 22,
        paddingBottom: 50,
        paddingLeft: 20,
        paddingRight: 20,
        height: '100%',
        flex: 1,
    },
    optional_equipment_info_box: {
        width: '100%',
        marginBottom: 22,
        // paddingRight: 25,
        // paddingLeft: 5,

    },
    optional_equipment_info_box_title: {
        marginBottom: 12,
        fontWeight: '400',
        fontSize: 15,
        color: '#000000',
    },
    optional_equipment_info_box_child: {
        borderRadius: 6,
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: '100%',
        height: 87,
        flexDirection: 'row',
        flexWrap: 'wrap'
        // alignItems: 'center'
    },
    optional_equipment_info_box_child_info: {
        fontWeight: '400',
        fontSize: 15,
        color: '#000000',
    },

    product_single_page_reviews_wrapper: {
        marginBottom: 50,
        // paddingLeft: 5,
        // paddingRight: 25,
    },

    product_single_page_reviews_title: {
        marginBottom: 10,
        fontWeight: '400',
        fontSize: 15,
        color: '#000000',
    },
    product_single_page_reviews_box: {
        backgroundColor: '#ffffff',
        borderRadius: 6,
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 15,
        marginBottom: 10,
    },
    product_single_page_reviews_box_title_rating_info_main_wrapper: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    product_single_page_reviews_box_title_rating_info_main_title: {
        fontWeight: '700',
        fontSize: 15,
        color: '#000000',
        marginLeft: 6
    },
    product_single_page_reviews_rating_box: {
        width: 38,
        height: 27,
        backgroundColor: '#FF6600',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,

    },
    product_single_page_reviews_rating_info: {
        fontWeight: '400',
        fontSize: 17,
        color: '#ffffff',
    },
    show_more_product_single_review_btn: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    show_more_product_single_review_btn_text: {
        fontWeight: '400',
        fontSize: 15,
        color: '#000000',
        textDecorationLine: 'underline'
    },
    single_product_page_write_message_btn: {
        width: 265,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#FF6600',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 30

    },
    single_product_page_write_message_btn_text: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 18,
    },
    show_more_reviews_btn_text: {
        textDecorationLine: 'underline',
        color: '#FF6600',
        fontWeight: '400',
        fontSize: 15,
    },
    show_more_reviews_btn: {
        alignItems: 'flex-end',
        // marginBottom: 50,

    },
    product_single_page_back_btn: {
        position: 'absolute',
        left: 15,
        top: 17,
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
