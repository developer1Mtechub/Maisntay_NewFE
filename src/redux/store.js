// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import emailVerificationReducer from "./authSlices/emailVerificationSlice";
import sendVerificationCodeReducer from "./authSlices/sendVerificationCodeSlice";
import resetPasswordReducer from "./authSlices/resetPasswordSlice";
import onboardingReducer from "./authSlices/onboardingSlice";
import signUpReducer from "./authSlices/signUpSlice";
import languageReducer from './coachSlices/fetchLanguagesSlice'
import coachingAreaReducer from "./coachSlices/coachingAreaSlices";
import countryReducer from './CoacheeSlices/CountrySlice'
import userRegisterReducer from './authSlices/signUpSlice'
import submitCoacheeProfileReducer from "./CoacheeSlices/submitCoacheeProfileSlice";
import userLoginReducer from "./authSlices/userLoginSlice";
import submitCoachProfileReducer from "./coachSlices/submitCoachProfileSlice";
import postAvailabilityReducer from "./coachSlices/postAvailabilitySlice";
import postSessionDurationsReducer from "./coachSlices/postSessionDurationsSlice";
import getAllCoachesReducer from "./DashboardSlices/getAllCoachesSlice";
import setCategoryIdReducer from "./DashboardSlices/setCategoryIdSlice";
import getCoachByCategoryReducer from "./DashboardSlices/getCoachByCategorySlice";
import getSingleCoachDetailReducer from "./DashboardSlices/getSingleCoachDetailSlice";
import getSectionByCoachReducer from "./DashboardSlices/getSectionByCoachSlice";
import getDurationReducer from "./DashboardSlices/getDurationSlice";
import postCoachDetailSessionReducer from "./DashboardSlices/postCoachDetailSessionSlice";
import getSessionListReducer from "./Sessions/getSessionListSlice";
import sessionAcceptRejectReducer from "./coachSlices/sessionAcceptRejectSlice";
import upcomingAndCompletedReducer from "./CoacheeSlices/upcomingAndCompletedSlice";
import coachHomeSessionReducer from "./coachSlices/coachHomeSessionSlice";
import getSessionByIdReducer from "./Sessions/getSessionByIdSlice";
import setSessionIdReducer from "./Sessions/setSessionIdSlice";
import getUserProfileReducer from "./authSlices/getUserProfileSlice";
import setAnyTypeDataReducer from "./setAnyTypeDataSlice";
import updateAvailabilityReducer from "./coachSlices/updateAvailabilitySlice";
import updateSessionDurationReducer from "./coachSlices/updateSessionDurationSlice";
import changePasswordReducer from "./authSlices/changePasswordSlice";
import myReviewsReducer from "./coachSlices/myReviewsSlice";
import getAverageRatingReducer from "./coachSlices/getAverageRatingSlice";
import getCoachBadgeReducer from "./coachSlices/getCoachBadgeSlice";
import setTokenReducer from "./setTokenSlice";
import setReceiverIdReducer from "./setReceiverIdSlice";
import reportChatUserReducer from "./reportChatUserSlice";
import networkReducer from "./networkSlice";
import createAccountLinkReducer from "./paymentMethod/createAccountLinkSlice";
import verifyAccountStatusReducer from "./paymentMethod/verifyAccountStatusSlice";
import getTransactionsReducer from "./paymentMethod/getTransactionsSlice";
import getGraphDataReducer from "./paymentMethod/getGraphDataSlice";
import createCustomerReducer from "./paymentMethod/createCustomerSlice";
import makePaymentReducer from "./paymentMethod/makePaymentSlice";
import getUserCardsReducer from "./paymentMethod/getUserCardsSlice";
import setCredentialsReducer from "./setCredentialsSlice";
import getWellcoinsReducer from "./CoacheeSlices/getWellcoinsSlice";
import withDrawAmountReducer from "./paymentMethod/withDrawAmountSlice";
import updateUpcomingSessionReducer from "./coachSlices/updateUpcomingSessionSlice";
import ratetheCoachReducer from "./CoacheeSlices/ratetheCoachSlice";
import getCoacheeBadgesReducer from "./CoacheeSlices/getCoacheeBadgesSlice";
import fetchContactListReducer from "./ChatModuleSlice/fetchContactListSlice";
import fetchAllmessagesReducer from "./ChatModuleSlice/fetchAllmessagesSlices";
import getRatingBySessionReducer from "./CoacheeSlices/getRatingBySessionSlice";
import deleteChatReducer from "./ChatModuleSlice/deleteChatSlice";
import getNotificationByUserReducer from "./NotificationModuleSlices/getNotificationByUserSlice";
import deleteCoachAccountReducer from "./DeleteAccount/deleteCoachAccountSlice";
import sessionEndedReducer from "./sessionEndedSlice";
import getNotificationCountReducer from "./NotificationModuleSlices/getNotificationCountSlice";
import updateNotificationStatusReducer from "./NotificationModuleSlices/updateNotificationStatusSlice";

const rootReducer = combineReducers({
  userLogin: userLoginReducer,
  emailVerification: emailVerificationReducer,
  sendVerificationCode: sendVerificationCodeReducer,
  resetPassword: resetPasswordReducer,
  onboarding: onboardingReducer,
  signup: signUpReducer,
  languages: languageReducer,
  coachingAreas: coachingAreaReducer,
  countries: countryReducer,
  registerUser: userRegisterReducer,
  coacheeProfile: submitCoacheeProfileReducer,
  coachProfile: submitCoachProfileReducer,
  availability: postAvailabilityReducer,
  sessionDurations: postSessionDurationsReducer,
  getAllCoaches: getAllCoachesReducer,
  categoryId: setCategoryIdReducer,
  getCoachByArea: getCoachByCategoryReducer,
  getCoachDetail: getSingleCoachDetailReducer,
  coachSection: getSectionByCoachReducer,
  durations: getDurationReducer,
  postSessionDetail: postCoachDetailSessionReducer,
  sessionList: getSessionListReducer,
  sessionAcceptORReject: sessionAcceptRejectReducer,
  coacheeUpcomingAndCompleted: upcomingAndCompletedReducer,
  coachHomeSessions: coachHomeSessionReducer,
  sessionDetailById: getSessionByIdReducer,
  setSessionId: setSessionIdReducer,
  getUserProfile: getUserProfileReducer,
  anyData: setAnyTypeDataReducer,
  updateAvailabilitySection: updateAvailabilityReducer,
  updateSessionDurations: updateSessionDurationReducer,
  changePassword: changePasswordReducer,
  myReviews: myReviewsReducer,
  averageRating: getAverageRatingReducer,
  coachBadgeDetail: getCoachBadgeReducer,
  setToken: setTokenReducer,
  setReceiverId: setReceiverIdReducer,
  reportChatUser: reportChatUserReducer,
  network: networkReducer,
  createAccountLink: createAccountLinkReducer,
  verifyStripeAccount: verifyAccountStatusReducer,
  transactions: getTransactionsReducer,
  graphData: getGraphDataReducer,
  createCustomer: createCustomerReducer,
  makePayment: makePaymentReducer,
  userSavedCard: getUserCardsReducer,
  credentials: setCredentialsReducer,
  coacheeWellcoins: getWellcoinsReducer,
  withDrawAmount: withDrawAmountReducer,
  updateUpcomingSession: updateUpcomingSessionReducer,
  rateTheCoach: ratetheCoachReducer,
  fetchCoacheeBadges: getCoacheeBadgesReducer,
  contactsList: fetchContactListReducer,
  messages: fetchAllmessagesReducer,
  ratingBySession: getRatingBySessionReducer,
  deleteChat: deleteChatReducer,
  fetchNotification: getNotificationByUserReducer,
  deleteCoachAccount: deleteCoachAccountReducer,
  sessionEnded: sessionEndedReducer,
  notificationCount: getNotificationCountReducer,
  updateNotification: updateNotificationStatusReducer

  // add more slices if needed
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});


// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     // Add other reducers here
//   },
// });

export default store;
