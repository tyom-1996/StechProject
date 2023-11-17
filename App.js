import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { useEffect } from 'react';


import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import * as Notifications from 'expo-notifications';

import {AuthContext} from "./components/AuthContext/context";
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_URL} from './env'


import DashboardComponent from './components/unlogged_user/dashboard';
import SignInComponent from './components/unlogged_user/sign_in';
import SignUpComponent from './components/unlogged_user/sign_up';
import RecoveryPasswordEmailComponent from './components/unlogged_user/recovery_password_email';
import RecoveryPasswordEmailCodeComponent from './components/unlogged_user/recovery_password_email_code';
import NewPasswordComponent from './components/unlogged_user/new_password';
import SignUpAsClientComponent from './components/unlogged_user/sign_up_as_client/sign_up_as_client';
import SignUpAsExecutorComponent from './components/unlogged_user/sign_up_as_executor/sign_up_as_executor';
import SignUpAsClientConfirmationPhoneComponent from './components/unlogged_user/sign_up_as_client/sign_up_as_client_confirmation_phone';
import SignUpAsExecutorConfirmationPhoneComponent from './components/unlogged_user/sign_up_as_executor/sign_up_as_executor_confirmation_phone';
import SignUpAsClientProfileComponent from './components/unlogged_user/sign_up_as_client/sign_up_as_client_profile';
import SignUpAsExecutorProfileComponent from './components/unlogged_user/sign_up_as_executor/sign_up_as_executor_profile';
import SignUpAsExecutorRegistrationTransportComponent from './components/unlogged_user/sign_up_as_executor/sign_up_as_executor_registration_transport';
import PersonalAreaComponent from './components/profile/client/personal_area';
import PersonalAreaExecutorComponent from './components/profile/executor/personal_area_executor';
import EditClientPersonalAreaComponent from './components/profile/client/edit_client_personal_area';
import EditExecutorPersonalAreaComponent from './components/profile/executor/edit_executor_personal_area';
import ClientCatalogueMainPageComponent from './components/profile/client/client_catalogue_main_page';
import ExecutorCatalogueMainPageComponent from './components/profile/executor/executor_catalogue_main_page';
import CatalogueProductSinglePageComponent from './components/profile/client/catalogue_product_single_page';
import ClientChatComponent from './components/profile/client/client_chat';
import ClientTendersChatComponent from './components/profile/client/client_tenders_chat';
import ExecutorTendersChatComponent from './components/profile/executor/executor_tenders_chat';
import ExecutorChatComponent from './components/profile/executor/executor_chat';
import ClientChatSinglePageComponent from './components/profile/client/client_chat_single_page';
import ClientTenderChatSinglePageComponent from './components/profile/client/client_tender_chat_single_page';
import ExecutorChatSinglePageComponent from './components/profile/executor/executor_chat_single_page';
import ExecutorTenderChatSinglePageComponent from './components/profile/executor/executor_tender_chat_single_page';
import ClientNotificationsComponent from './components/profile/client/client_notifications';
import ExecutorNotificationsComponent from './components/profile/executor/executor_notifications';
import TimerGetStartedComponent from './components/profile/executor/timer_get_started';
import TimerFinishWorkComponent from './components/profile/executor/timer_finish_work';
import TimerConfirmWorkComponent from './components/profile/executor/timer_confirm_work';
import CreateAnOrderCategoryComponent from './components/profile/client/create_an_order_category';
import CreateAnOrderFormComponent from './components/profile/client/create_an_order_form';
import JobTenderComponent from './components/profile/executor/job_tender';
import MyJobTenderComponent from './components/profile/client/my_job_tender';
import RateTheWorkComponent from './components/profile/executor/rate_the_work';
import ExecutorsListsComponent from './components/profile/client/executors_lists';
import JobRequestComponent from "./components/includes/JobRequest";
import JobTimerComponent from "./components/includes/JobTimer";
import RateWorkComponent from "./components/includes/RateWork";
import JobVoyageComponent from "./components/includes/JobVoyage";
import ExecutorsListsWithoutCategoryComponent from "./components/profile/client/executors_lists_without_category";



function DashboardScreen({ navigation }) {
  return (
      <DashboardComponent navigation={navigation}  />
  );
}

function SignInScreen({ navigation }) {
  return (
      <SignInComponent navigation={navigation}  />
  );
}

function SignUpScreen({ navigation }) {
  return (
      <SignUpComponent navigation={navigation}  />
  );
}

function SignUpAsClientScreen({ navigation }) {
  return (
      <SignUpAsClientComponent navigation={navigation}  />
  );
}
function SignUpAsExecutorScreen({ navigation }) {
  return (
      <SignUpAsExecutorComponent navigation={navigation}  />
  );
}
function SignUpAsClientConfirmationPhoneScreen({ navigation }) {
  return (
      <SignUpAsClientConfirmationPhoneComponent navigation={navigation}  />
  );
}
function SignUpAsExecutorConfirmationPhoneScreen({ navigation }) {
  return (
      <SignUpAsExecutorConfirmationPhoneComponent navigation={navigation}  />
  );
}
function SignUpAsClientProfileScreen({ navigation }) {
  return (
      <SignUpAsClientProfileComponent navigation={navigation}  />
  );
}
function SignUpAsExecutorProfileScreen({ navigation }) {
  return (
      <SignUpAsExecutorProfileComponent navigation={navigation}  />
  );
}
function SignUpAsExecutorRegistrationTransportScreen({ navigation }) {
  return (
      <SignUpAsExecutorRegistrationTransportComponent navigation={navigation}  />
  );
}


function RecoveryPasswordEmailScreen({ navigation }) {
  return (
      <RecoveryPasswordEmailComponent navigation={navigation}  />
  );
}


function RecoveryPasswordEmailCodeScreen({ navigation }) {
  return (
      <RecoveryPasswordEmailCodeComponent navigation={navigation}  />
  );
}


function NewPasswordScreen({ navigation }) {
  return (
      <NewPasswordComponent navigation={navigation}  />
  );
}

function PersonalAreaScreen({ navigation }) {
  return (
      <PersonalAreaComponent navigation={navigation}  />
  );
}
function PersonalAreaExecutorScreen({ navigation }) {
  return (
      <PersonalAreaExecutorComponent navigation={navigation}  />
  );
}
function EditClientPersonalAreaScreen({ navigation }) {
  return (
      <EditClientPersonalAreaComponent navigation={navigation}  />
  );
}
function EditExecutorPersonalAreaScreen({ navigation }) {
  return (
      <EditExecutorPersonalAreaComponent navigation={navigation}  />
  );
}
function ClientCatalogueMainPageScreen({ navigation }) {
  return (
      <ClientCatalogueMainPageComponent navigation={navigation}  />
  );
}

function ExecutorCatalogueMainPageScreen({ navigation }) {
  return (
      <ExecutorCatalogueMainPageComponent navigation={navigation}  />
  );
}
function CatalogueProductSinglePageScreen({route, navigation }) {
    const {params, redirect_from, params2} = route.params
  return (
      <CatalogueProductSinglePageComponent   id={params} redirect_from={redirect_from}  tender={params2}  navigation={navigation}  />
  );
}

function ClientChatScreen({ navigation }) {
  return (
      <ClientChatComponent navigation={navigation}  />
  );
}
function ClientTendersChatScreen({ navigation }) {
  return (
      <ClientTendersChatComponent navigation={navigation}  />
  );
}

function ExecutorTendersChatScreen({ navigation }) {
    return (
        <ExecutorTendersChatComponent navigation={navigation}  />
    );
}

function ExecutorChatScreen({ navigation }) {
  return (
      <ExecutorChatComponent navigation={navigation}  />
  );
}


function ClientChatSinglePageScreen({ route, navigation }) {
    const {params1, params2, params3 } = route.params
  return (
      <ClientChatSinglePageComponent receiver_id={params1} user_name={params2} user_image={params3} navigation={navigation}  />
  );
}

function ClientTenderChatSinglePageScreen({ route, navigation }) {
    const {params1, params2, params3, params4} = route.params
    return (
        <ClientTenderChatSinglePageComponent receiver_id={params1} tender_id={params2} user_name={params3} user_image={params4} navigation={navigation}  />
    );
}



function ExecutorChatSinglePageScreen({route, navigation }) {
    const {params1, params2, params3, params4, redirect_from_type} = route.params;
    const  redirect_from_timer = route.params.hasOwnProperty('redirect_from_timer') ? route.params.redirect_from_timer : 'false';
  return (
      <ExecutorChatSinglePageComponent  redirect_from_timer={redirect_from_timer} redirect_from_type={redirect_from_type} receiver_id={params1} tender_id={params2} user_image={params3} user_name={params4} navigation={navigation}  />
  );
}

function ExecutorTenderChatSinglePageScreen({route, navigation }) {
    const {params1, params2, params3, params4, redirect_from_type} = route.params;
    const  redirect_from_timer = route.params.hasOwnProperty('redirect_from_timer') ? route.params.redirect_from_timer : 'false';
    return (
        <ExecutorTenderChatSinglePageComponent  redirect_from_timer={redirect_from_timer}  redirect_from_type={redirect_from_type} receiver_id={params1} tender_id={params2} user_image={params3} user_name={params4} navigation={navigation}  />
    );
}



function ClientNotificationsScreen({ navigation }) {
  return (
      <ClientNotificationsComponent navigation={navigation}  />
  );
}
function ExecutorNotificationsScreen({ navigation }) {
  return (
      <ExecutorNotificationsComponent navigation={navigation}  />
  );
}

function TimerGetStartedScreen({ navigation }) {
  return (
      <TimerGetStartedComponent navigation={navigation}  />
  );
}

function TimerFinishWorkScreen({ navigation }) {
  return (
      <TimerFinishWorkComponent navigation={navigation}  />
  );
}

function TimerConfirmWorkScreen({ navigation }) {
  return (
      <TimerConfirmWorkComponent navigation={navigation}  />
  );
}


function ExecutorsListsScreen({ navigation }) {
  return (
      <ExecutorsListsComponent navigation={navigation}  />
  );
}

function ExecutorsListsWithoutCategoryScreen({ route, navigation }  ) {
    const {params1, params2} = route.params

    return (
        <ExecutorsListsWithoutCategoryComponent  subcategory_id={params1} category_id={params2}  navigation={navigation}  />
    );
}
function CreateAnOrderCategoryScreen({ route, navigation }) {



  return (
      <CreateAnOrderCategoryComponent navigation={navigation}  />
  );
}

function CreateAnOrderFormScreen({route, navigation }) {
    const {params, params2, params3, params4} = route.params;
  return (
      <CreateAnOrderFormComponent  category_id={params}  category_name={params2} sub_category_id={params3} sub_category_name={params4} navigation={navigation}  />
  );
}
function JobTenderScreen({ navigation }) {
  return (
      <JobTenderComponent navigation={navigation}  />
  );
}
function MyJobTenderScreen({ navigation }) {
  return (
      <MyJobTenderComponent navigation={navigation}  />
  );
}




function RateTheWorkScreen({ navigation }) {
  return (
      <RateTheWorkComponent navigation={navigation}  />
  );
}
function JobRequestScreen ({ navigation }) {
  return (
      <JobRequestComponent navigation={navigation}  />
  );
}

function JobTimerScreen ({ navigation }) {
  return (
      <JobTimerComponent navigation={navigation}  />
  );
}
function RateWorkScreen ({ navigation }) {
  return (
      <RateWorkComponent navigation={navigation}  />
  );
}


function JobVoyageScreen ({ navigation }) {
    return (
        <JobVoyageComponent navigation={navigation}  />
    );
}


export default function App() {
    const popAction = StackActions.pop(1);
    const [isLoading, setIsLoading] = React.useState(true);
    const [userToken, setUserToken] = React.useState(null);
    const [role_id, setRoleId] = React.useState(null);
    const [job_request, setJobRequest] = React.useState(false);
    const [active_job, setActiveJob] = React.useState(false);
    const [sender_id, setSenderId] = React.useState('');
    const [rate_work, setRateWork] = React.useState(false);
    const [type, setType] = React.useState(null);
    const [black_list_users, setBlackListUsers] = React.useState(false);

    // useEffect(() => {
    //     Notifications.setNotificationHandler({
    //         handleNotification: async () => ({
    //             shouldShowAlert: true,
    //             shouldPlaySound: true,
    //             shouldSetBadge: true,
    //         }),
    //     });
    // }, [])



    const initialLoginState = {
        isLoading: true,
        userToken: null,
        role_id: null,
    };

    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case 'RETRIEVE_TOKEN':
                return {
                    ...prevState,
                    userToken: action.token,
                    role_id: action.role_id,
                    isLoading: false,
                };
            case 'LOGIN':
                return {
                    ...prevState,
                    userToken: action.token,
                    role_id: action.role_id,
                    isLoading: false,
                };
            case 'LOGOUT':
                return {
                    ...prevState,
                    userName: null,
                    userToken: null,
                    role_id: null,
                    isLoading: false,
                };
            case 'REGISTER':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    role_id: action.role_id,
                    isLoading: false,
                };
        }
    };

    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

    const authContext = React.useMemo(() => ({
        signIn: async (foundUser, callback) => {
            // setIsLoading(true);
            const userToken = String(foundUser.token);
            const userData = foundUser.user_data;
            const role_id = foundUser.role_id;

            // const userEmail = foundUser.email;
            // const userId = String(foundUser.user_id);
            // setUserToken(userToken);

            //  console.log('AuthUser', foundUser);
            try {
                await AsyncStorage.setItem('userToken', userToken);
                await AsyncStorage.setItem('userData', userData);
                await AsyncStorage.setItem('role_id', role_id);
            } catch (e) {
                console.log(e);
            }
            dispatch({type: 'LOGIN',  token: userToken, role_id: role_id});
            callback();
        },
        signOut: async (callback) => {
            try {
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('userData');
                await AsyncStorage.removeItem('role_id');
                setIsLoading(false);

            } catch (e) {
                console.log(e);
            }
            dispatch({type: 'LOGOUT'});
            callback();
        },
        signUp: () => {
            // setIsLoading(false);
        }
    }), []);


    // Проверка при входе в приложение.


    let intervalID;

    React.useEffect(() => {




        clearInterval(intervalID);

        intervalID = setInterval(async () => {


            // let userToken = await AsyncStorage.getItem('userToken');
            // let AuthStr = 'Bearer ' + userToken;
            //
            //
            // try {
            //     fetch(`https://steach.justcode.am/api/getRoleId3Invitee`, {
            //         method: 'POST',
            //         headers: {
            //             'Authorization': AuthStr,
            //             'Accept': 'application/json',
            //             'Content-Type': 'application/json',
            //         },
            //
            //
            //     }).then((response) => {
            //         return response.json()
            //     }).then((response) => {
            //
            //         console.log(response, 'request')
            //
            //     })
            // } catch (e) {
            //     console.log(e)
            // }

            let myHeaders = new Headers();
            let userToken = await AsyncStorage.getItem('userToken');
            let role_id = await AsyncStorage.getItem('role_id');
            let AuthStr = 'Bearer ' + userToken;

            myHeaders.append("Authorization", AuthStr );

                if (!userToken) {
                    userToken = null
                }

                if (!role_id) {
                    role_id = null
                }

                if (userToken !== null  && role_id == 3) {

                    let requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    fetch( `${APP_URL}/getRoleId3Invite`, requestOptions)
                        .then(response => response.json())
                        .then(response => {


                            console.log(response, 'general ')

                            if (response.hasOwnProperty('status')) {
                                if (response.status === false) {

                                    if (response.message == 'no invite') {
                                        setJobRequest(false)
                                        setActiveJob(false)
                                        setRateWork(false)
                                        setType(null)
                                    }

                                } else {


                                    if (response.message == 'You Have Active Job') {
                                        if (response.data.type == 'time') {
                                            setJobRequest(false)
                                            setActiveJob(true)
                                            setRateWork(false)
                                            setType('time')
                                        } else if (response.data.type == 'raice') {
                                            setJobRequest(false)
                                            setActiveJob(false)
                                            setRateWork(false)
                                            setType('raice')
                                        }

                                    }

                                    if (response.message == 'You have Invite') {
                                        setJobRequest(true)
                                        setActiveJob(false)
                                        setRateWork(false)
                                        setType(null)

                                    }

                                    // if (response.status === true) {
                                    //     setSenderId(response.data.sender_id)
                                    //     setJobRequest(true)
                                    // }
                                }
                            }


                            if (response.hasOwnProperty('user')) {
                                if (response.user.black_list == '2') {
                                    AsyncStorage.clear()
                                    dispatch({type: 'LOGOUT'});
                                }
                            }


                        })
                        .catch(error => console.log('error', error));
                } else if (userToken !== null  && role_id == 2) {

                    let userToken = await AsyncStorage.getItem('userToken');
                    let AuthStr = 'Bearer ' + userToken;


                    // console.log(AuthStr)

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
                        }).then(async (response) => {

                            // console.log(response, 'feedback')

                            if (response.hasOwnProperty('message')) {

                                if (response.message == 'no rewiev') {
                                    setJobRequest(false)
                                    setActiveJob(false)
                                    setRateWork(false)
                                }
                            } else {
                                if (response.status === true) {
                                    setJobRequest(false)
                                    setActiveJob(false)
                                    setRateWork(true)



                                }
                            }



                        if (response.hasOwnProperty('user')) {
                                if (response.user.black_list == '2') {
                                    AsyncStorage.clear()
                                    dispatch({type: 'LOGOUT'});
                                }
                        }


                        })
                    } catch (e) {
                        console.log(e)
                    }
                }



        }, 5000)

        setTimeout(async () => {

            // await AsyncStorage.clear();

            let userToken,userData, role_id;
            userToken = null;
            userData = [];
            role_id = null;

            try {

                userToken = await AsyncStorage.getItem('userToken');
                role_id  = await AsyncStorage.getItem('role_id');

                // console.log(role_id, 'role_idrole_idrole_idrole_id')
                setIsLoading(false);

            } catch (e) {
                console.log(e);
            }

            dispatch({type: 'RETRIEVE_TOKEN', token: userToken, role_id: role_id});

        }, 1000);
    }, []);

    return (



        <AuthContext.Provider value={authContext}>
            <NavigationContainer>


                {job_request === false && active_job === false && loginState.role_id == 3 && rate_work === false &&  type == 'raice' &&
                (
                    <Stack.Navigator
                        initialRouteName='JobVoyage'
                        screenOptions={{
                            headerShown: false,
                            animationEnabled: true,
                            detachPreviousScreen: true,
                            presentation: 'transparentModal'
                        }}

                    >
                        <Stack.Screen name="JobVoyage" component={JobVoyageScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                        <Stack.Screen name="ExecutorChatSinglePage" component={ExecutorChatSinglePageScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                        <Stack.Screen name="ExecutorTenderChatSinglePage" component={ExecutorTenderChatSinglePageScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                    </Stack.Navigator>
                )

                }


                {job_request === true && loginState.role_id == 3 && active_job === false && rate_work === false && type === null &&
                (
                            <Stack.Navigator
                                initialRouteName='JobRequest'
                                screenOptions={{
                                    headerShown: false,
                                    animationEnabled: true,
                                    detachPreviousScreen: true,
                                    presentation: 'transparentModal'
                                }}

                            >
                                    <Stack.Screen name="JobRequest" component={JobRequestScreen}
                                                  options={({route}) => ({
                                                      tabBarButton: () => null,
                                                      tabBarStyle: {display: 'none'},
                                                  })}
                                    />

                            </Stack.Navigator>
                    )

                }
                {job_request === false && active_job === false && loginState.role_id == 2  && rate_work === true && type === null &&
                (
                    <Stack.Navigator
                        initialRouteName='RateWork'
                        screenOptions={{
                            headerShown: false,
                            animationEnabled: true,
                            detachPreviousScreen: true,
                            presentation: 'transparentModal'
                        }}

                    >
                        <Stack.Screen name="RateWork" component={RateWorkScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                    </Stack.Navigator>
                )

                }
                { job_request === false && active_job === true && loginState.role_id == 3 && rate_work === false &&  type == 'time' &&
                (
                    <Stack.Navigator
                        initialRouteName='JobTimer'
                        screenOptions={{
                            headerShown: false,
                            animationEnabled: true,
                            detachPreviousScreen: true,
                            presentation: 'transparentModal'
                        }}

                    >
                        <Stack.Screen name="JobTimer" component={JobTimerScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                        <Stack.Screen name="ExecutorChatSinglePage" component={ExecutorChatSinglePageScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                        <Stack.Screen name="ExecutorTenderChatSinglePage" component={ExecutorTenderChatSinglePageScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                    </Stack.Navigator>
                )

                }

                { type === null && job_request === false && active_job === false && loginState.userToken !== null  && loginState.role_id == 3  && rate_work === false && // исполнитель executor
                    (
                        <Stack.Navigator
                            initialRouteName='ExecutorCatalogueMainPage'
                            screenOptions={{
                                headerShown: false,
                                animationEnabled: true,
                                detachPreviousScreen: true,
                                presentation: 'transparentModal'
                            }}

                        >

                            <Stack.Screen name="ExecutorCatalogueMainPage" component={ExecutorCatalogueMainPageScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="ExecutorChat" component={ExecutorChatScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />




                            <Stack.Screen name="PersonalAreaExecutor" component={PersonalAreaExecutorScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />



                            <Stack.Screen name="EditExecutorPersonalArea" component={EditExecutorPersonalAreaScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />





                            <Stack.Screen name="ExecutorTendersChat" component={ExecutorTendersChatScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />




                            <Stack.Screen name="ExecutorChatSinglePage" component={ExecutorChatSinglePageScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="ExecutorTenderChatSinglePage" component={ExecutorTenderChatSinglePageScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />






                            <Stack.Screen name="ExecutorNotifications" component={ExecutorNotificationsScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />


                            <Stack.Screen name="TimerGetStarted" component={TimerGetStartedScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />


                            <Stack.Screen name="TimerFinishWork" component={TimerFinishWorkScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />


                            <Stack.Screen name="TimerConfirmWork" component={TimerConfirmWorkScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />



                            <Stack.Screen name="JobTender" component={JobTenderScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />


                            <Stack.Screen name="RateTheWork" component={RateTheWorkScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />


                        </Stack.Navigator>
                    )

                }



                { type === null && job_request === false && active_job === false && loginState.userToken !== null  && loginState.role_id == 2  && rate_work === false && // Заказчик
                    (
                        <Stack.Navigator
                            initialRouteName='ClientCatalogueMainPage'
                            screenOptions={{
                                headerShown: false,
                                animationEnabled: true,
                                detachPreviousScreen: true,
                                presentation: 'transparentModal'
                            }}

                        >

                            <Stack.Screen name="ClientCatalogueMainPage" component={ClientCatalogueMainPageScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />


                            <Stack.Screen name="PersonalArea" component={PersonalAreaScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />


                            <Stack.Screen name="EditClientPersonalArea" component={EditClientPersonalAreaScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />





                            <Stack.Screen name="CatalogueProductSinglePage" component={CatalogueProductSinglePageScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />


                            <Stack.Screen name="ClientChat" component={ClientChatScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="ClientTendersChat" component={ClientTendersChatScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />



                            <Stack.Screen name="ClientChatSinglePage" component={ClientChatSinglePageScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="ClientTenderChatSinglePage" component={ClientTenderChatSinglePageScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />



                            <Stack.Screen name="ClientNotifications" component={ClientNotificationsScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />


                            <Stack.Screen name="CreateAnOrderCategory" component={CreateAnOrderCategoryScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />


                            <Stack.Screen name="CreateAnOrderForm" component={CreateAnOrderFormScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="MyJobTender" component={MyJobTenderScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="ExecutorsLists" component={ExecutorsListsScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="ExecutorsListsWithoutCategory" component={ExecutorsListsWithoutCategoryScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />


                        </Stack.Navigator>
                    )

                }



                {type === null && job_request === false && active_job === false && loginState.userToken === null && rate_work === false &&

                    <Stack.Navigator
                        initialRouteName='Login'
                        screenOptions={{
                            headerShown: false
                        }}

                    >



                        <Stack.Screen name="Dashboard" component={DashboardScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                        <Stack.Screen name="SignIn" component={SignInScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                        <Stack.Screen name="SignUp" component={SignUpScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                        <Stack.Screen name="RecoveryPasswordEmail" component={RecoveryPasswordEmailScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                        <Stack.Screen name="RecoveryPasswordEmailCode" component={RecoveryPasswordEmailCodeScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                        <Stack.Screen name="NewPassword" component={NewPasswordScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                        <Stack.Screen name="SignUpAsClient" component={SignUpAsClientScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />


                        <Stack.Screen name="SignUpAsExecutor" component={SignUpAsExecutorScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />


                    </Stack.Navigator>

                }


            </NavigationContainer>
        </AuthContext.Provider>



    );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },



});


