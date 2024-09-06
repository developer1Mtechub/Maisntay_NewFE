import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CustomCalendar = ({ initialSelectedDate, highlightedDayNames, onSelectDate }) => {
  const [markedDates, setMarkedDates] = useState({});
  const [selected, setSelected] = useState('');
  // Function to get the full name of the day
  const getDayFullName = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  // Function to mark and disable dates
  const markDatesByDayNames = () => {
    let markedDatesObj = {};

    for (let i = 0; i < 365; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const dayFullName = getDayFullName(dateString);
      if (highlightedDayNames.includes(dayFullName)) {
        markedDatesObj[dateString] = { marked: true, dotColor: 'green' };
      } else {
        markedDatesObj[dateString] = { disabled: true };
      }
    }
    setMarkedDates(markedDatesObj);
  };

  useEffect(() => {
    markDatesByDayNames();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Call once on component mount

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        minDate={new Date().toISOString().split('T')[0]}
        markedDates={{...markedDates,[selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}}}
        onDayPress={(day) => {
          if (!day.disabled) {
            setSelected(day.dateString)
            onSelectDate(day.dateString, getDayFullName(day.dateString));
          }
        }}
        disableAllTouchEventsForDisabledDays={true} // Disable touch events for disabled days
      />
    </View>
  );
};

export default CustomCalendar;
