import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import fonts from '../theme/fonts';

const CountdownTimer = ({ initialTime, onTimeExpired, onResendCode, isCodeSent }) => {
    const [timer, setTimer] = useState(initialTime);
    const timerRef = useRef(null);

    const startTimer = () => {
        setTimer(initialTime);
        timerRef.current = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer === 0) {
                    clearInterval(timerRef.current);
                    // Timer expired, notify parent component
                    onTimeExpired();
                } else {
                    return prevTimer - 1;
                }
            });
        }, 1000);
    };

    useEffect(() => {
        startTimer();
        return () => {
            // Clear the timer when the component unmounts
            clearInterval(timerRef.current);
        };
    }, [initialTime]);

    const handleResendCode = () => {
        // Notify parent component to resend the code
        onResendCode();
        // Restart the timer after resending the code
        startTimer();
    };

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
            <Text style={{ alignSelf: 'center', fontFamily:fonts.fontsType.semiBold, color: 'rgba(15, 109, 106, 1)', fontSize: 15 }}>Resend Code in </Text>
            <Text style={{ alignSelf: 'center', color: 'rgba(76, 76, 76, 1)', fontSize: 15, fontFamily:fonts.fontsType.regular }}>{timer < 10 ? `00:0${timer <= 0 ? '0' : timer}` : `00:${timer}`}</Text>
            {/* <TouchableOpacity onPress={handleResendCode}>
        <Text>Resend Code</Text>
      </TouchableOpacity> */}
        </View>
    );
};

export default CountdownTimer;
