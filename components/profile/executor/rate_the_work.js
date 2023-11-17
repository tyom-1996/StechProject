import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, {PROVIDER_GOOGLE } from 'react-native-maps';
import {APP_URL} from '../../../env'

let Marker = MapView.Marker
import { LinearGradient } from 'expo-linear-gradient';



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
            searchInput: '',
            // catalogue_list: true,
            // catalogue_map: false,

            showUnplug: false,
            showUnplugIcon: false,



            confirmEndOfWorkPopup: false,

            Default_Rating: 0,
            Max_Rating: 5,
            review: '',

        };

        this.Star = require('../../../assets/images/star_rating_image.png');
        this.Star_With_Border = require('../../../assets/images/star_not_rating_img.png');


    }


    redirectToSignUp = () => {
        this.props.navigation.navigate("SignUp");

    }


    redirectToExecutorPersonalArea = () => {
        this.props.navigation.navigate("PersonalAreaExecutor");

    }

    redirectToExecutorChat = () => {
        this.props.navigation.navigate("ExecutorChat");

    }
    redirectToExecutorNotifications = () => {
        this.props.navigation.navigate("ExecutorNotifications");
    }



    redirectToExecutorCatalogueMainPage = () => {
        this.props.navigation.navigate("ExecutorCatalogueMainPage");

    }
    redirectToTimerConfirmWork = () => {
        this.props.navigation.navigate("TimerConfirmWork");

    }

    UpdateRating(key) {

        this.setState({ Default_Rating: key });
        //Keeping the Rating Selected in state

    }



    render() {

        let React_Native_Rating_Bar = [];
        //Array to hold the filled or empty Stars
        for (let i = 1; i <= this.state.Max_Rating; i++) {
            React_Native_Rating_Bar.push(
                <TouchableOpacity
                    activeOpacity={0.7}
                    key={i}
                    onPress={() => {
                        this.UpdateRating(i)
                    }}>
                    <Image
                        style={styles.StarImage}
                        source={
                            i <= this.state.Default_Rating
                                ?  this.Star
                                :  this.Star_With_Border
                        }
                    />
                </TouchableOpacity>
            );
        }






        return (
            <SafeAreaView  edges={['right', 'left', 'top']} style={styles.container} >
                <StatusBar style="dark" />

                    <View style={styles.rate_the_work_header}>
                        <TouchableOpacity style={styles.rate_the_work_header_back_btn} onPress={() => {this.redirectToTimerConfirmWork()}}>
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
                         <Text style={styles.rate_the_work_header_title}>Оцените работу</Text>
                    </View>

                    <KeyboardAwareScrollView
                        style={styles.rating_main_wrapper}
                        enableOnAndroid={true}
                        enableAutomaticScroll={(Platform.OS === 'ios')}
                    >
                       <View style={styles.rate_the_work_person_info_main_wrapper}>
                          <View style={styles.rate_the_work_person_info_img_box}>
                              <View style={styles.rate_the_work_person_img}>
                                  <Image style={styles.rate_the_work_person_img_child}  source= {require('../../../assets/images/rate_the_work_img.png')} />
                              </View>
                              <View style={styles.rate_the_work_person_info}>
                                  <Text style={styles.rate_the_work_person_name}>Алексей Смирнов</Text>
                                  <Text style={styles.rate_the_work_person_type_of_technology}>Тип техники - Трактор</Text>
                              </View>
                          </View>
                           <View style={styles.rate_the_work_person_working_hours_total_cost_info_box}>
                               <View style={styles.rate_the_work_person_working_hours_info_box}>
                                   <Text style={styles.rate_the_work_person_working_hours_info_title}>Время работы</Text>
                                   <Text style={styles.rate_the_work_person_working_hours_info}>3 часа</Text>
                               </View>
                                 <View style={styles.rate_the_work_line}></View>
                               <View style={styles.rate_the_work_person_total_cost_info_box}>
                                   <Text style={styles.rate_the_work_person_total_cost_info_title}>Общая стоимость</Text>
                                   <Text style={styles.rate_the_work_person_total_cost_info}>3000 руб.</Text>
                               </View>
                           </View>
                       </View>
                        <View style={styles.rating_review_main_wrapper}>

                            <View style={styles.rating_stars_wrapper}>
                                <View style={styles.rating_stars_childView}>{React_Native_Rating_Bar}</View>
                            </View>
                            <View style={styles.write_review_box}>
                                <Text style={styles.write_review_title}>Напишите отзыв</Text>
                                <TextInput
                                    style={styles.write_review_input_field}
                                    onChangeText={(val) => this.setState({review: val})}
                                    value={this.state.review}
                                    placeholder='Напишите отзыв!'
                                    placeholderTextColor='#333333'
                                    multiline={true}
                                />


                            </View>
                            <TouchableOpacity style={styles.send_review_btn}>
                                <Text style={styles.send_review_btn_text}>Отправить</Text>
                            </TouchableOpacity>
                        </View>

                    </KeyboardAwareScrollView>



                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.footer_btn} onPress={() => {this.redirectToExecutorNotifications()}}>
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
                        <TouchableOpacity style={styles.footer_btn} onPress={() => {this.redirectToExecutorChat()}}>
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
        paddingTop: 30,
        paddingBottom: 50,
        // position: 'absolute',
        // bottom: 0,
        // marginTop: 100
    },

    rating_main_wrapper:{
        flex: 1,
        width: '100%',


    },
    rate_the_work_header: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: 23,
        paddingHorizontal: 20,
        marginBottom: 30,
        width: '100%',
    },
    rate_the_work_header_back_btn: {
        position: 'absolute',
        left: 20,
        top: 15,
    },
    rate_the_work_header_title: {
        fontWeight: '700',
        fontSize: 17,
        color: '#333333',
        textAlign: 'center',
    },
    rate_the_work_person_info_main_wrapper: {
        width: '100%',
    },
    rate_the_work_person_info_img_box: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 20,
        paddingHorizontal: 25,
    },
    rate_the_work_person_img: {
        width: 70,
        height: 70,
        marginRight: 14,
    },
    rate_the_work_person_img_child: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        overflow: 'hidden',
        resizeMode: 'cover',
    },
    rate_the_work_person_name: {
        color:'#333333',
        fontWeight: '700',
        fontSize: 18,
        marginBottom: 3,
    },

    rate_the_work_person_type_of_technology: {
        color:'#333333',
        fontWeight: '300',
        fontSize: 12,
    },
    rate_the_work_person_working_hours_total_cost_info_box: {
        marginBottom: 17,
        paddingHorizontal: 77,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',

    },
    rate_the_work_person_working_hours_info_title: {
        color:'#333333',
        fontWeight: '300',
        fontSize: 14,
        marginBottom: 3,
    },
    rate_the_work_person_total_cost_info_title: {
        color:'#333333',
        fontWeight: '300',
        fontSize: 14,
        marginBottom: 3,
    },

    rate_the_work_person_working_hours_info: {
        color:'#FF6600',
        fontWeight: '700',
        fontSize: 15,
        textAlign: 'center',
    },
    rate_the_work_person_total_cost_info: {
        color:'#FF6600',
        fontWeight: '700',
        fontSize: 15,
        textAlign: 'center',
    },

    rate_the_work_person_working_hours_info_box: {
        marginRight: 14,
    },
    rate_the_work_line: {
        height: 40,
        width: 2,
        backgroundColor: '#C9C9C9',
        marginRight: 14,
    },
    rating_review_main_wrapper: {
        width: '100%',
        paddingTop: 25,
        paddingHorizontal: 20,
        paddingBottom: 110,
        backgroundColor: '#F4F4F4',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        // height: '100%',
    },
    rating_stars_wrapper: {
        width: '100%',
        backgroundColor: '#ffffff',
        marginBottom: 15,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 56,
    },
    rating_stars_childView: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        width: 224,

    },
    write_review_title: {
        color:'#333333',
        fontWeight: '700',
        fontSize: 17,
        marginBottom: 15,
        textAlign: 'center',
    },

    write_review_box: {
        marginBottom: 60,
    },

    write_review_input_field: {
        width: '100%',
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
        paddingTop: 12,
        paddingBottom: 100,
        color:'#000000',
        fontWeight: '400',
        fontSize: 13,
        textAlignVertical: 'top',
        borderRadius: 6
    },
    send_review_btn: {
        backgroundColor: '#FF6600',
        borderRadius: 8,
        width: 265,
        height: 50,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    send_review_btn_text: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 18,
    }

});
