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

            catalogue_list_items: [],
            selected_subcategories: [],
            selected_products: [],

            is_pressed_category: false,
            show_product: false,

            main_title: '',
            catalog_header_height: 0,
            transport_categories: [],
            transport_sub_categories: [],


            show_categories: true,
            show_sub_categories: false,

            category_id: '',
            category_name: '',

            count_notification: '',
            count_message: '',


        };

    }



    static contextType = AuthContext;

    componentDidMount() {
        const { navigation } = this.props;

        this.getCategories();
        this.getNotificationsCount();
        this.focusListener = navigation.addListener("focus", () => {
            this.getCategories();
            this.getNotificationsCount();

        });



        // AsyncStorage.clear();
    }
    componentWillUnmount() {
        if (this.focusListener) {
            this.focusListener();
        }
    }

    getCategories = async () => {
        try {
            fetch(`${APP_URL}/getCategory`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

            }).then((response) => {
                return response.json()
            }).then((response) => {


                this.setState({
                    transport_categories: response.message.category,
                    show_categories: true,
                    show_sub_categories: false,
                })
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

    getSubCategoriesTransports = async (item) => {

        let category_id = item.id;
        let category_name = item.category_name;

        this.setState({
            category_id: category_id,
            category_name: category_name
        })


        try {
            fetch(`${APP_URL}/getSubcategory/category_id=` + category_id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

            }).then((response) => {
                return response.json()
            }).then((response) => {


                if (response.data.length > 0) {
                    this.setState({
                        transport_sub_categories: response.data,
                        show_categories: false,
                        show_sub_categories: true,
                    })

                } else {

                    this.props.navigation.navigate("CreateAnOrderForm", {
                        params: category_id,
                        params2: category_name,
                        params3: null,
                        params4: null,
                    });

                }


            })
        } catch (e) {
        }


    }



    openSingleProduct = () => {

        this.setState({
            redirectToSingleProductPopup: true
        })

    }

    redirectToProductSingle = () => {
        this.setState({
            redirectToSingleProductPopup: false
        })
        this.props.navigation.navigate("CatalogueProductSinglePage");
    }


    redirectToClientChat = () => {
        this.props.navigation.navigate("ClientChat");
    }

    redirectToClientNotifications = () => {
        this.props.navigation.navigate("ClientNotifications");
    }

    redirectToCreateAnOrder = (item) => {
        let {category_id, category_name} = this.state;

        let sub_category_id = item.id;
        let sub_category_name = item.sub_category_name;

        this.props.navigation.navigate("CreateAnOrderForm", {
            params: category_id,
            params2: category_name,
            params3: sub_category_id,
            params4: sub_category_name,
        });
    }

    redirectToClientCatalogueMainPage = () => {
        this.props.navigation.navigate("ClientCatalogueMainPage");

    }

    redirectToCatalogueMainPage = () => {
        this.props.navigation.navigate("ClientCatalogueMainPage");

    }

    getCategoriesImg = (item) => {
        let id = item.id;
        let image = {}
        if (id == 10) {
            image = require('../../../assets/images/category_pic1.png')
        } else if (id == 1) {
            image = require('../../../assets/images/category_pic2.png')
        } else if (id == 2) {
            image = require('../../../assets/images/category_pic3.png')
        } else if (id == 3) {
            image = require('../../../assets/images/category_pic4.png')
        } else if (id == 4) {
            image = require('../../../assets/images/category_pic5.png')
        } else if (id == 5) {
            image = require('../../../assets/images/category_pic6.png')
        } else if (id == 6) {
            image = require('../../../assets/images/category_pic7.png')
        } else if (id == 7) {
            image = require('../../../assets/images/category_pic8.png')
        } else if (id == 8) {
            image = require('../../../assets/images/category_pic9.png')
        } else if (id == 9) {
            image = require('../../../assets/images/category_pic10.png')
        }
        return image;
    }
    getSubCategoriesImg = (item) => {
        let id = item.id;
        let image = {}
        if (id == 17) {
            image = require('../../../assets/images/subcategory_pic1.png')
        } else if (id == 18) {
            image = require('../../../assets/images/subcategory_pic2.png')
        } else if (id == 19) {
            image = require('../../../assets/images/subcategory_pic3.png')
        } else if (id == 20) {
            image = require('../../../assets/images/subcategory_pic4.png')
        } else if (id == 21) {
            image = require('../../../assets/images/subcategory_pic5.png')
        } else if (id == 1) {
            image = require('../../../assets/images/subcategory_pic6.png')
        }  else if (id == 2) {
            image = require('../../../assets/images/subcategory_pic7.png')
        }  else if (id == 3) {
            image = require('../../../assets/images/subcategory_pic8.png')
        }  else if (id == 4) {
            image = require('../../../assets/images/subcategory_pic9.png')
        }  else if (id == 5) {
            image = require('../../../assets/images/subcategory_pic10.png')
        }  else if (id == 6) {
            image = require('../../../assets/images/subcategory_pic11.png')
        }  else if (id == 7) {
            image = require('../../../assets/images/subcategory_pic12.png')
        }  else if (id == 8) {
            image = require('../../../assets/images/subcategory_pic13.png')
        }  else if (id == 9) {
            image = require('../../../assets/images/subcategory_pic14.png')
        }  else if (id == 10) {
            image = require('../../../assets/images/subcategory_pic15.png')
        }  else if (id == 11) {
            image = require('../../../assets/images/subcategory_pic16.png')
        }  else if (id == 12) {
            image = require('../../../assets/images/subcategory_pic17.png')
        }  else if (id == 13) {
            image = require('../../../assets/images/subcategory_pic18.png')
        }  else if (id == 14) {
            image = require('../../../assets/images/subcategory_pic19.png')
        }  else if (id == 16) {
            image = require('../../../assets/images/subcategory_pic20.png')
        }  else if (id == 22) {
            image = require('../../../assets/images/subcategory_pic21.png')
        }   else if (id == 23) {
            image = require('../../../assets/images/subcategory_pic22.png')
        }   else if (id == 24) {
            image = require('../../../assets/images/subcategory_pic23.png')
        }   else if (id == 25) {
            image = require('../../../assets/images/subcategory_pic24.png')
        }

        return image;
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




        return (
            <SafeAreaView  edges={['right', 'left', 'top']} style={styles.container} >
                <StatusBar style="dark" />

                {/*<ImageBackground resizeMode="cover" source={require('../../../assets/images/catalogue_img.png')} style={[{width: '100%', height: '100%',  zIndex: 99999999, }]}>*/}


                {/*</ImageBackground>*/}


                <View style={{width: '100%', height: '100%'}}>

                    <View style={styles.catalogue_header}
                          onLayout={(event) => {
                              let {x, y, width, height} = event.nativeEvent.layout;

                              this.setState({
                                  catalog_header_height: parseInt(height)
                              })
                          }}
                    >

                        <Text style={styles.catalogue_header_title}>Создание заказа</Text>
                    </View>

                    <View style={[styles.catalogue_main_wrapper]} >

                        {this.state.show_categories &&

                            <View style={[styles.catalogue_lists_items_wrapper, ]}>
                                <Text style={[styles.catalogue_lists_item_title, {paddingHorizontal: 20}]}>Категории</Text>

                                <FlatList
                                    data={this.state.transport_categories}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={styles.catalogue_lists_item}
                                            onPress={() => {this.getSubCategoriesTransports(item)}}>

                                            <View style={styles.catalogue_list_img}>
                                                <Image style={styles.catalogue_list_img_child}  source={this.getCategoriesImg(item)} />
                                            </View>
                                            <Text style={styles.catalogue_list_title}>
                                                {item.category_name}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    //Setting the number of column
                                    numColumns={3}
                                    columnWrapperStyle={{flex: 1, width: '100%', justifyContent: "flex-start", paddingHorizontal: 20}}
                                    keyExtractor={(item, index) => index.toString()}
                                />



                            </View>

                        }



                        {this.state.show_sub_categories &&

                            <View style={styles.catalogue_lists_items_wrapper}>
                            <TouchableOpacity style={{marginBottom: 10, flexDirection:'row', paddingHorizontal: 15}} onPress={() => {this.setState({show_sub_categories: false, show_categories: true})}}>

                                <Svg width={30} height={30} viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <Path  d="M20.168 27.708a1.458 1.458 0 01-1.137-.54l-7.044-8.75a1.458 1.458 0 010-1.851l7.292-8.75a1.46 1.46 0 112.245 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.138 2.391z"  fill="#000"/>
                                </Svg>

                                <Text style={{position:'relative', top: 4, fontWeight: '500', fontSize: 18, color: '#000000',}}>Назад</Text>
                            </TouchableOpacity>
                            <Text style={[styles.catalogue_lists_item_title, {paddingHorizontal: 20}]}>Подкатегории</Text>


                            <FlatList
                                data={this.state.transport_sub_categories}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.catalogue_lists_item}
                                        onPress={() => {this.redirectToCreateAnOrder(item)}}
                                    >

                                        <View style={styles.catalogue_list_img}>
                                            <Image style={styles.catalogue_list_img_child}  source={this.getSubCategoriesImg(item)} />
                                        </View>
                                        <Text style={styles.catalogue_list_title}>
                                            {item.sub_category_name}
                                        </Text>
                                    </TouchableOpacity>

                                )}
                                //Setting the number of column
                                numColumns={3}
                                columnWrapperStyle={{flex: 1, justifyContent: "flex-start", paddingHorizontal: 20, width: '100%'}}
                                keyExtractor={(item, index) => index.toString()}
                            />

                        </View>

                        }


                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity style={[styles.footer_btn, {position: 'relative'}]} onPress={() => {this.redirectToClientNotifications()}}>
                            {this.state.count_notification != '' &&
                            <View style={styles.notification_count_box}>
                                <Text style={styles.notification_count_text}>{this.state.count_notification}</Text>
                            </View>
                            }
                            <Svg width={35} height={36} viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg"
                            >
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
                                <Path d="M9.15 10.706h16.556M9.15 15.297h11.474M9.149 19.888h6.39M29.57 4.5H5.431c-.38.001-.743.155-1.011.429-.269.273-.42.644-.421 1.03V31.5l5.31-5.414h20.258c.38-.001.743-.155 1.011-.429.269-.273.42-.644.421-1.03V5.959a1.478 1.478 0 00-.42-1.03 1.423 1.423 0 00-1.012-.429v0z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
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
        position: 'absolute',
        bottom: 0,
        zIndex:999
        // marginTop: 100
    },

    catalogue_main_wrapper:{
        flex: 1,
        width: '100%',
        // paddingBottom: 20,
        // marginTop: 30,
        // paddingHorizontal: 20,
        // backgroundColor:'red'
        marginBottom: 30,
        position: 'relative',
        top: -5
    },

    catalogue_header: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 50,
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
        top: -30,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    catalogue_header_back_btn: {
      position: 'absolute',
        left: 15,
        top: 65,
    },
    catalogue_header_title: {
        fontWeight: '700',
        fontSize: 22,
        color: '#000000',
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
        flex:1
    },
    catalogue_list_img: {
        marginBottom: 13,
        width: 89,
        height: 58,
    },
    catalogue_list_img_child: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'

    },
    catalogue_list_title: {
        fontSize: 10,
        fontWeight: '700',
        color: '#333333',
        textAlign: 'center'
    },
    selected_product_info_main_wrapper: {
        width: '100%',
        marginBottom: 15,
        backgroundColor: '#F1F1F1',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    product_owner_info_rating_info_main_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
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
        fontWeight: '500',
        fontSize: 16,
        color: '#333333',
        marginBottom: 3,
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
