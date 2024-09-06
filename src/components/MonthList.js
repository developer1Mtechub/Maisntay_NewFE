import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../theme/fonts';
import colors from '../theme/colors';
import PreviousButton from '../assets/svgs/previous_button.svg'
import NextButton from '../assets/svgs/next_button.svg'

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const MonthList = () => {
    const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDayIndex, setSelectedDayIndex] = useState(-1); // Initially no item selected
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const flatListRef = useRef(null);

    useEffect(() => {
        // Select the current day by default
        const currentDate = new Date();
        if (currentDate.getMonth() === currentMonthIndex && currentDate.getFullYear() === currentYear) {
            setSelectedDayIndex(currentDate.getDate() - 1); // Index starts from 0
            scrollToSelectedDay(currentDate.getDate() - 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMonthIndex, currentYear]);

    const getCurrentMonthDays = () => {
        const totalDays = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
        return Array.from({ length: totalDays }, (_, index) => index + 1);
    };

    const getCurrentMonthFirstLetters = () => {
        const startDate = new Date(currentYear, currentMonthIndex, 1);
        const endDate = new Date(currentYear, currentMonthIndex + 1, 0);
        const result = [];

        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            const dayFirstLetter = days[(date.getDay() + 6) % 7]; // Adjust index to start from Monday
            const dayOfMonth = date.getDate();
            result.push({ dayFirstLetter, dayOfMonth });
        }

        return result;
    };

    const handleNextMonth = () => {
        if (currentMonthIndex === 11) {
            setCurrentMonthIndex(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonthIndex(currentMonthIndex + 1);
        }
    };

    const handlePreviousMonth = () => {
        if (currentMonthIndex === 0) {
            setCurrentMonthIndex(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonthIndex(currentMonthIndex - 1);
        }
    };

    const handleDayPress = (index,item) => {
        console.log(item.dayOfMonth)
        setSelectedDayIndex(index);
        scrollToSelectedDay(index);
    };

    const scrollToSelectedDay = (index) => {
        if (flatListRef.current && index >= 0) {
          flatListRef.current.scrollToIndex({ animated: true, index });
        }
      };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handlePreviousMonth}>
                    <PreviousButton />
                </TouchableOpacity>
                <Text style={styles.monthYear}>{months[currentMonthIndex]} {currentYear}</Text>
                <TouchableOpacity onPress={handleNextMonth}>
                    <NextButton />
                </TouchableOpacity>
            </View>
            {/* <FlatList
        horizontal
        data={days}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.dayContainer}>
            <Text style={styles.day}>{item}</Text>
          </View>
        )}
      /> */}
           <View style={{marginHorizontal:20}}>
           <FlatList
                ref={flatListRef}
                horizontal
                data={getCurrentMonthFirstLetters()}
                keyExtractor={(item, index) => index.toString() + item}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => handleDayPress(index,item)}>
                        <LinearGradient
                            colors={selectedDayIndex === index ? ['#073937', '#0F6D6A'] : ['transparent', 'transparent']}
                            style={[styles.linearGradient, { backgroundColor: selectedDayIndex !== index ? '#F5F5F5' : 'transparent' }]}>
                            <View style={styles.dayContainer}>
                                <Text style={[styles.day, selectedDayIndex === index && styles.selectedDay]}>
                                    {item.dayFirstLetter}
                                </Text>
                                <Text style={[styles.date, selectedDayIndex === index && styles.selectedDate]}>{item.dayOfMonth}</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                onScrollToIndexFailed={info => {
                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                        flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                    });
                  }}
            />
           </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        marginTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 10,
    },
    button: {
        fontSize: 20,
        paddingHorizontal: 10,
    },
    monthYear: {
        fontSize: 19,
        fontFamily: fonts.fontsType.semiBold,
        marginHorizontal: 10,
        color: colors.primaryColor
    },
    dayContainer: {
        flexDirection: 'column',
        //padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        borderColor: 'black',
        width: 32,
        height: 55,
        margin: 5,
        borderRadius: 100,
    },
    day: {
        fontSize: 13,
        fontFamily: fonts.fontsType.semiBold,
        color: '#8E8E8E',
        marginTop:8
    },
    date: {
        fontSize: 13,
        fontFamily: fonts.fontsType.semiBold,
        color: '#263238',
        marginVertical: 8,
    },
    selectedDate: {
        fontSize: 13,
        fontFamily: fonts.fontsType.semiBold,
        color: 'white',
       
    },
    selectedDay: {
        fontSize: 13,
        fontFamily: fonts.fontsType.semiBold,
        color: 'white',
    },
    linearGradient: {
        // flex: 1,
        borderRadius: 100,
        margin: 5
    },
});

export default MonthList;
