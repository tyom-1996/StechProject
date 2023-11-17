import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, {PROVIDER_GOOGLE } from 'react-native-maps';
let Marker = MapView.Marker
import { LinearGradient } from 'expo-linear-gradient';
import {APP_URL} from '../../env'



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
import RateStarActive from '../../assets/rate_star_active';


import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    initialWindowMetrics,
} from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";



export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchInput: '',
            // catalogue_list: true,
            // catalogue_map: false,

            showUnplug: false,
            showUnplugIcon: false,



            confirmBeginningOfWorkPopup: false,
            confirmEndOfWorkPopup: false,
            executor_main_page_info: [],

            image_path: 'https://admin.stechapp.ru/uploads/',
            start_job: false,
            end_job: false,
            confirm_job_result: false,

            job_id: null,
            user_job_result: [],
            feedback: '',
            Default_Rating: 0,
            Max_Rating: 5,
            feedback_info: null,
            feedback_info_user: null,
            receiver_id: null,
            loaded: false,
            job_time: '00:00:00',
            job_raice_count: 0,
            job_raice_price: 0,
            jobTimerType: false,
            jobRaiceType: false,
            rating_error: false,
            rating_error_text: ''

        };

        this.Star = require('../../assets/images/rate_star_active.png');
        this.Star_With_Border = require('../../assets/images/rate_star_non_active.png');

    }


    componentDidMount() {
        const { navigation } = this.props;
        this.rateWork()
        this.getPersonalAreaInfo();
        this.focusListener = navigation.addListener("focus", () => {
            this.getPersonalAreaInfo();
            this.rateWork()


        });

    }

    componentWillUnmount() {
        if (this.focusListener) {
            this.focusListener();
        }

    }



    getPersonalAreaInfo = async () => {
        // await AsyncStorage.clear();

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
            }).then((response) => {


                this.setState({
                    executor_main_page_info: response.message.user[0],

                })

            })
        } catch (e) {
        }

    }
    rateWork = async () => {


        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;

        try {
            fetch(`${APP_URL}/GetMyNoReview`, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


            }).then((response) => {
                return response.json()
            }).then( async (response) => {


                if (response.status === true) {
                    if (response.data.jobTime !== null) {
                        let total_time = response.data.jobTime.split(':');

                        for (const value in total_time) {
                            if (total_time[value] < 10) {
                                total_time[value] = `0${total_time[value]}`
                            } else {
                                total_time[value] = total_time[value];
                            }
                        }

                        let job_time = total_time.join(':');
                        await this.setState({
                            jobTimerType: true,
                            feedback_info: response,
                            job_time: job_time,
                            receiver_id: response.data.user.id
                        })

                    }
                    if (response.data.jobRaice !== null) {
                        await this.setState({
                            jobRaiceType: true,
                            feedback_info: response,
                            receiver_id: response.data.user.id,
                            job_raice_count: parseInt(response.data.jobRaice),
                            job_raice_price: response.data.jobPrice,
                        })
                    }
                }

            })
        } catch (e) {
        }

    }



    rateWork2 = async () => {
        await this.setState({
            loaded: false,
        })


        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;

        try {
            fetch(`${APP_URL}/GetMyNoReview`, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


            }).then((response) => {
                return response.json()
            }).then( async (response) => {




                if (response.hasOwnProperty('message')) {

                    if (response.message == 'no rewiev') {

                        this.setState({
                            loaded: true,
                        })

                    }
                }  else {
                    if (response.status === true) {
                        await this.setState({
                            feedback_info: response,
                            receiver_id: response.data.user.id
                        })

                    }

                }



            })
        } catch (e) {
        }

    }
    UpdateRating(key) {

        this.setState({ Default_Rating: key });
        //Keeping the Rating Selected in state
        // if (key == 4 || key == 5) {
        //     this.props.navigation.navigate("HighRating");
        // }
        // else{
        //     if (key == 2 || key == 3) {
        //         this.props.navigation.navigate("LowRating");
        //     }
        // }


    }


    writeFeedback = async () => {

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let feedback = this.state.feedback;
        let receiver_id = this.state.receiver_id;
        let Default_Rating = this.state.Default_Rating;

        if (Default_Rating == 0) {
             this.setState({
                 rating_error: true,
                 rating_error_text: 'Оценка обязательна.'
             })
        } else {
            this.setState({
                rating_error: false,
                rating_error_text: ''
            })


            try {
                fetch(`${APP_URL}/AddRoleId3Reviews`, {
                    method: 'POST',
                    headers: {
                        'Authorization': AuthStr,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },body: JSON.stringify({
                        grade: Default_Rating,
                        receiver_id: receiver_id,
                        message: feedback,
                    })


                }).then((response) => {
                    return response.json()
                }).then( async (response) => {


                    if (response.hasOwnProperty('status')) {
                        if (response.status === true) {
                            this.setState({
                                feedback: '',
                                Default_Rating: 0
                            })
                            this.rateWork2()
                        }
                    }







                })
            } catch (e) {
            }
        }



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


      if (this.state.loaded) {
          return (
                  <View style={{backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: '100%',  height: '100%', position:'absolute', }}>
                      <ActivityIndicator size="large" color="#FF6600" />

                  </View>
          )

      }


        return (
            <SafeAreaView  edges={['right', 'left', 'top']} style={styles.container} >
                <StatusBar style="dark" />



                <View style={styles.rate_work_header}>
                    <Text style={styles.rate_work_header_title}>Оцените работу</Text>
                </View>

                <ScrollView style={styles.rate_work_main_wrapper}>

                    {this.state.feedback_info &&
                        <View style={styles.rate_work_executor_img_name_wrapper}>
                            <View style={styles.rate_work_executor_img}>
                                <Image style={styles.rate_work_executor_img_child}  source={{uri: this.state.image_path + this.state.feedback_info.data.user.photo}} />

                            </View>

                            <View style={styles.rate_work_executor_name_tecnique_info_wrapper}>

                                <Text style={styles.rate_work_executor_name}>{this.state.feedback_info.data.user.name} {this.state.feedback_info.data.user.surname}</Text>
                                <Text style={styles.rate_work_executor_name_tecnique_info}>{this.state.feedback_info.category_name} - {this.state.feedback_info.sub_category_name}</Text>

                            </View>

                        </View>
                    }


                    {this.state.feedback_info &&
                        <View style={styles.rate_work_executor_working_hours_total_cost_info_wrapper}>
                            <View style={styles.rate_work_executor_working_hours_total_cost_info_item}>
                                {this.state.jobTimerType &&
                                        <View>
                                            <Text style={styles.rate_work_executor_working_hours_total_cost_info_title}>Время работы</Text>
                                            <Text style={styles.rate_work_executor_working_hours_total_cost_info_text}> {this.state.job_time}</Text>
                                        </View>
                                }

                                {this.state.jobRaiceType &&
                                    <View>
                                        <Text style={styles.rate_work_executor_working_hours_total_cost_info_title}>Количество рейсов</Text>
                                        <Text style={styles.rate_work_executor_working_hours_total_cost_info_text}> {this.state.job_raice_count}</Text>
                                    </View>
                                }
                            </View>
                            <View style={styles.rate_work_executor_working_hours_total_cost_info_line}></View>
                            <View style={styles.rate_work_executor_working_hours_total_cost_info_item}>
                                <Text style={styles.rate_work_executor_working_hours_total_cost_info_title}>Общая
                                    стоимость</Text>
                                {this.state.jobTimerType &&
                                        <Text style={styles.rate_work_executor_working_hours_total_cost_info_text}>{this.state.feedback_info.data.jobPrice} руб.</Text>
                                }

                                {this.state.jobRaiceType &&
                                <Text style={styles.rate_work_executor_working_hours_total_cost_info_text}>{this.state.job_raice_price} руб.</Text>
                                }

                            </View>
                        </View>
                    }
                    <View style={styles.feedback_wrapper}>
                        {this.state.rating_error &&
                        <Text style={{color: 'red', fontSize: 14, fontWeight: '500', marginBottom: 5}}>{this.state.rating_error_text}</Text>
                        }
                        <View style={styles.rating_work_stars_wrapper}>
                            <View style={styles.childView}>{React_Native_Rating_Bar}</View>
                        </View>



                        <View style={styles.write_feedback_wrapper}>
                            <View style={styles.write_feedback_title_input_field}>
                                <Text style={styles.write_feedback_title}>Напишите отзыв</Text>
                                <TextInput
                                    style={styles.write_feedback_input_field}
                                    onChangeText={(val) => this.setState({feedback: val})}
                                    value={this.state.feedback}
                                    multiline={true}
                                />
                            </View>


                            <TouchableOpacity style={styles.write_feedback_send_btn} onPress={() => {this.writeFeedback()}}>
                                <Text style={styles.write_feedback_send_btn_text}>Отправить</Text>
                            </TouchableOpacity>


                        </View>
                    </View>

                </ScrollView>


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

    rate_work_header: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingTop: 30,
        marginBottom: 27,
    },
    rate_work_header_title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#333333',

    },


    rate_work_main_wrapper: {
        flex: 1,
        width: '100%',
        height: '100%'
    },

    rate_work_executor_img_name_wrapper: {
        width: '100%',
        paddingHorizontal: 25,
        marginBottom: 18,
        flexDirection: 'row',
        alignItems: 'center'
    },

    rate_work_executor_name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333333',
    },
    rate_work_executor_name_tecnique_info: {
        fontSize: 12,
        fontWeight: '300',
        color: '#333333',
    },
    rate_work_executor_img: {
        marginRight: 14,
        width: 70,
        height: 70,

    },
    rate_work_executor_img_child: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 100,
        resizeMode: 'cover'
    },
    rate_work_executor_working_hours_total_cost_info_wrapper: {
        width: 222,
        justifyContent: 'space-between',
        // alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        marginBottom: 14
    },
    rate_work_executor_working_hours_total_cost_info_line: {
        width: 1,
        height: 46,
        backgroundColor: '#C9C9C9',
        marginLeft: 14,
        marginRight: 10,
        marginBottom: 17,
    },
    feedback_wrapper: {
        width: '100%',
        backgroundColor: '#F4F4F4',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 90
    },
    rating_work_stars_wrapper: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 15

    },
    childView: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 15,
        width: 224,
        justifyContent: 'space-between'

    },
    StarImage: {
        width: 40,
        height: 40,

    },
    write_feedback_title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 15,
        alignItems: 'center',
        alignSelf: 'center',
        textAlign: 'center'
    },
    write_feedback_input_field: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingTop: 12,
        paddingBottom: 60,
    },
    write_feedback_title_input_field: {
        marginBottom: 60,
        width: '100%'
    },
    write_feedback_send_btn: {
        width: 265,
        height: 50,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#FF6600',
        marginBottom: 90,
    },
    write_feedback_send_btn_text: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
    },
    rate_work_executor_working_hours_total_cost_info_title: {
        fontSize: 14,
        fontWeight: '300',
        color: '#333333',
    },
    rate_work_executor_working_hours_total_cost_info_text: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FF6600',
        textAlign: 'center'
    },
    rate_work_executor_working_hours_total_cost_info_item: {
       paddingTop: 5
    },

});
