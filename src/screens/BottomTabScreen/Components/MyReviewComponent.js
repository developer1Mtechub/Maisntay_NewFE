import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import fonts from '../../../theme/fonts';
import { Rating } from 'react-native-ratings';
import colors from '../../../theme/colors';
import useCustomTranslation from '../../../utilities/useCustomTranslation';

const ReviewListItem = ({ profilePic, name, rating, comment }) => {
    const {t} = useCustomTranslation();

    const [showFullDescription, setShowFullDescription] = useState(false);
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <Image source={{ uri: profilePic }} style={styles.profilePic} />
                <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Rating
                        type='star'
                        readonly={true}
                        startingValue={rating}
                        imageSize={20}
                        minValue={0}
                        ratingCount={5}
                        style={{ alignSelf: 'flex-start' }}
                    />

                </View>

            </View>

            <Text style={styles.comment}>{
                showFullDescription
                    ? comment
                    : `${(comment?.length > 70 ? comment?.slice(0, 70)
                        : comment)}...`
            }</Text>
            {(
               comment?.length > 70 && <TouchableOpacity onPress={toggleDescription}>
                    <Text
                        style={{
                            color: colors.primaryColor,
                            fontFamily: fonts.fontsType.medium,
                            fontSize: 15,
                            alignSelf: 'flex-end',
                        }}>
                        {!showFullDescription ? t('seeMore') : t('seeLess')}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    mainContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        borderColor: 'rgba(0, 0, 0, 0.14)'

    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    detailsContainer: {
        alignItems: 'center'
    },
    name: {
        fontSize: 18,
        fontFamily: fonts.fontsType.semiBold,
        marginBottom: 5,
        // marginTop: 10,
        color: '#312802'
    },
    comment: {
        fontSize: 14,
        marginTop: 15,
        color: '#222222',
        fontFamily: fonts.fontsType.regular
    },
});

export default ReviewListItem;
