import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BackArrow from "../assets/svgs/backArrow.svg";
import fonts from "../theme/fonts";
import { resetNavigation } from "../utilities/resetNavigation";
import { useDispatch } from "react-redux";
import { resetState } from "../redux/DashboardSlices/getCoachByCategorySlice";
import colors from "../theme/colors";
import useCustomTranslation from "../utilities/useCustomTranslation";


const HeaderComponent = ({
  navigation,
  headerTitle,
  navigateTo,
  customContainerStyle,
  customTextStyle,
  params = {},
  icon,
  isStatusReset,
  isBackBtn = true
}) => {
  const { t } = useCustomTranslation();
  const dispatch = useDispatch()

  return (
    <View style={[styles.itemConatiner, customContainerStyle]}>
      {!icon && <TouchableOpacity onPress={() => {
        isStatusReset && dispatch(resetState({ status: 'idle', currentPage: 1, coaches: [] }))
        navigation && resetNavigation(navigation, navigateTo, params && params);
      }} style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center', }}>
        {isBackBtn && <BackArrow
          height={32}
          width={32}
          style={{ alignSelf: "center", }}
        />}
      </TouchableOpacity>}
      <Text style={[styles.headerTitleStyle, customTextStyle]}>{headerTitle}</Text>
      {icon && <View style={{
        top: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 10
      }}>
        {icon}
        <Text style={{
          fontFamily: fonts.fontsType.semiBold,
          fontSize: 13,
          color: colors.primaryColor,
          marginBottom: 20

        }}>{t('requests')}</Text>
      </View>}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  headerTitleStyle: {
    alignSelf: "center",
    marginStart: 38,
    color: "rgba(49, 40, 2, 1)",
    fontSize: 20,
    flex: 1,
    fontFamily: fonts.fontsType.semiBold

  },
  itemConatiner: {
    flexDirection: "row",
    marginTop: 10,
  },
});

//make this component available to the app
export default HeaderComponent;
