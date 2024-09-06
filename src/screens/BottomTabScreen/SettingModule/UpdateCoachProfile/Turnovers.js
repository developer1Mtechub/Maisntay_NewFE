import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import HeaderComponent from '../../../../components/HeaderComponent';
import CustomDropdown from '../../../../components/CustomDropdown';
import { heightPercentageToDP as hp, widthPercentageToDP } from 'react-native-responsive-screen';
import ArrowDown from '../../../../assets/svgs/arrow_down.svg'
import CancleIcon from "../../../../assets/svgs/cross_icon.svg";
import fonts from '../../../../theme/fonts';
import { BottomSheet } from '@rneui/themed';
import HorizontalDivider from '../../../../components/DividerLine';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGraphData } from '../../../../redux/paymentMethod/getGraphDataSlice';
import colors from '../../../../theme/colors';
import { resetNavigation } from '../../../../utilities/resetNavigation';
import useBackHandler from '../../../../components/useBackHandler';
import useCustomTranslation from '../../../../utilities/useCustomTranslation';

const Turnovers = ({ navigation }) => {
    const { t } = useCustomTranslation()
    const dispatch = useDispatch();
    const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(t('monthly'));
    const [endPoint, setEndPoint] = useState('/payments/monthlyTransactions/');
    const { data, status } = useSelector((state) => state.graphData)
    const { user_id } = useSelector((state) => state.anyData);
    const [chartData, setChartData] = useState([]);


    const handleBackPress = () => {
        resetNavigation(navigation, "Dashboard", { screen: "Setting" })
        return true;
    };

    useBackHandler(handleBackPress)

    function getMonthAbbreviation(month) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[parseInt(month) - 1];
    }

    function transformResponseToChartData(response) {
        return response?.map(item => ({
            value: parseFloat(item.total_amount),
            label: selectedOption === 'Monthly' ? getMonthAbbreviation(item?.month) : item?.year,
            labelWidth: 15,
            spacing: 25,
            labelTextStyle: {
                color: '#3E4954',
                fontFamily: fonts.fontsType.regular,
                fontSize: 14
            },
        }));
    }


    useEffect(() => {
        // Fetch graph data from API
        dispatch(fetchGraphData({ end_point: endPoint, coach_id: user_id })).then((result) => {
            // Transform response to chart data
            const transformedData = transformResponseToChartData(result?.payload?.result);
            setChartData(transformedData);

        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, selectedOption, endPoint, user_id]);


    const renderBottomSheet = () => {
        return (
            <BottomSheet
                onBackdropPress={() =>
                    setPhotoSheetVisible(false)

                }
                modalProps={{}} isVisible={photoSheetVisible}>
                <View
                    style={{
                        backgroundColor: "#fff",
                        width: '100%',
                        height: hp('25%'),
                        borderTopEndRadius: 30,
                        borderTopStartRadius: 30,
                        padding: 10,
                    }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: 10
                    }}>
                        <Text
                            style={{
                                fontSize: 20,
                                color: "black",
                                fontFamily: fonts.fontsType.bold,
                            }}>
                            {t('turnoverChart')}
                        </Text>
                        <CancleIcon
                            onPress={() => {
                                setPhotoSheetVisible(false);
                            }}
                        />
                    </View>

                    <View style={{ marginTop: 10, }}>

                        <TouchableOpacity
                            onPress={() => {

                                setSelectedOption(t('monthly'));
                                setEndPoint('/payments/monthlyTransactions/')
                                setPhotoSheetVisible(false);
                            }}>
                            <Text style={{
                                fontFamily: fonts.fontsType.regular,
                                color: '#646464',
                                fontSize: 19,
                                marginStart: 35,
                                marginTop: 20,
                            }}>{t('monthly')}</Text>
                        </TouchableOpacity>

                        <HorizontalDivider height={1}
                            customStyle={{
                                width: widthPercentageToDP('90%'),
                                marginTop: 20,
                                alignSelf: 'center'
                            }} />

                        <TouchableOpacity onPress={() => {
                            setSelectedOption(t('yearly'));
                            setEndPoint('/payments/yearlyTransactions/')
                            setPhotoSheetVisible(false);
                        }}>
                            <Text style={{
                                fontFamily: fonts.fontsType.regular,
                                color: '#646464',
                                fontSize: 19,
                                marginStart: 35,
                                marginTop: 20,
                            }}>{t('yearly')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent
                headerTitle={t('myTurnOver')}
                navigation={navigation}
                navigateTo={'Dashboard'}
                params={{ screen: 'Setting' }}
            />
            <View style={{ flexDirection: 'row', marginTop: hp('2%') }}>
                <Text style={{
                    flex: 1,
                    marginHorizontal: 20,
                    alignSelf: 'center',
                    color: '#312802',
                    fontSize: 18,
                    fontFamily: fonts.fontsType.semiBold
                }}>{t('turnoverChart')}</Text>
                <TouchableOpacity style={{
                    width: 110,
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderRadius: 8,
                    height: 35,
                    marginEnd: 20,
                    flexDirection: 'row'
                }}
                    onPress={() => {
                        setPhotoSheetVisible(true);
                    }}>
                    <Text style={{
                        marginStart: 10,
                        flex: 1,
                        alignSelf: 'center',
                        color: '#A8A8A8',
                        fontSize: 14,
                        fontFamily: fonts.fontsType.semiBold
                    }}>{selectedOption}</Text>
                    <ArrowDown style={{ marginEnd: 10, alignSelf: 'center' }} />
                </TouchableOpacity>
            </View>
            {

                status == 'loading' ? <View style={{
                    width: 350,
                    height: 220,
                    borderRadius: 16,
                    shadowOpacity: 0.2,
                    elevation: 4,
                    marginVertical: hp('5%'),
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                }}>
                    <ActivityIndicator
                        size={'large'}
                        color={colors.primaryColor} />
                </View>

                    :

                    chartData?.length > 0 ? (

                        <View style={{
                            width: 370,
                            height: 250,
                            borderRadius: 16,
                            shadowOpacity: 0.2,
                            elevation: 4,
                            marginVertical: hp('5%'),
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'white',
                        }}>

                            <BarChart
                                width={300}
                                data={chartData}
                                barWidth={10}
                                roundedTop
                                //barBorderRadius={10}
                                dashGap={0}
                                isAnimated
                                frontColor={colors.primaryColor} />

                        </View>

                    ) : <View style={{
                        width: 350,
                        height: 220,
                        borderRadius: 16,
                        shadowOpacity: 0.2,
                        elevation: 4,
                        marginVertical: hp('5%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white',
                    }}>
                        <Text style={{
                            fontFamily: fonts.fontsType.medium,
                            fontSize: 16,
                            color: colors.primaryColor,
                        }}>No Data Available</Text>
                    </View>


            }
            {renderBottomSheet()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

export default Turnovers;
