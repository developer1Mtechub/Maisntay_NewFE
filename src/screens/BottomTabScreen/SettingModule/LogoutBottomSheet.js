import { BottomSheet } from "@rneui/themed";
import { Text, View } from "react-native";
import HorizontalDivider from "../../../components/DividerLine";
import fonts from "../../../theme/fonts";
import CustomButton from "../../../components/ButtonComponent";
import colors from "../../../theme/colors";
import useCustomTranslation from "../../../utilities/useCustomTranslation";

const LogoutBottomSheet = ({ isVisible, onClose, onLogoutPress }) => {
    const { t } = useCustomTranslation();
    return (
        <BottomSheet
            onBackdropPress={onClose}
            modalProps={{}} isVisible={isVisible}>
            <View
                style={{
                    backgroundColor: 'white',
                    width: "100%",
                    borderTopEndRadius: 40,
                    borderTopStartRadius: 40,
                    padding: 40,
                }}
            >
                <Text style={{
                    fontSize: 20,
                    fontFamily: fonts.fontsType.semiBold,
                    color: 'rgba(255, 72, 72, 1)',
                    alignSelf: 'center',
                    marginBottom: 15,
                    marginTop: -15
                }}>{t('logout')}</Text>
                <HorizontalDivider />
                <Text style={{
                    fontSize: 16,
                    fontFamily: fonts.fontsType.medium,
                    color: 'rgba(49, 40, 2, 1)',
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: 20
                }}>
                    {t('logoutDescription')}
                </Text>
                <CustomButton
                    onPress={onLogoutPress}
                    title={t('logoutBtnTitle')}
                    customStyle={{ width: '100%', marginBottom: -10 }}
                />
                <CustomButton
                    onPress={onClose}
                    title={t('cancel')}
                    customStyle={{
                        width: '100%',
                        marginBottom: -10,
                        backgroundColor: colors.transparent
                    }}
                    textCustomStyle={{ color: colors.primaryColor }}
                />
            </View>
        </BottomSheet>
    );
};

export default LogoutBottomSheet;
