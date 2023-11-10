import { Timer } from './photobooth';

export interface Account {
  businessProfile: AccountBusinessProfile;
  businessType: string;
  capabilities: AccountCapabilities;
  chargesEnabled: boolean;
  company: AccountCompany;
  controller: AccountController;
  country: string;
  created: string;
  defaultCurrency: string;
  deleted: boolean;
  detailsSubmitted: boolean;
  email: string;
  externalAccounts: IExternalAccount[];
  futureRequirements: AccountFutureRequirements;
  id: string;
  individual: Person;
  metadata: Record<string, string>;
  object: string;
  payoutsEnabled: boolean;
  requirements: AccountRequirements;
  settings: AccountSettings;
  stripeResponse: StripeResponse;
  tosAcceptance: AccountTosAcceptance;
  type: string;
}
export interface AccountBusinessProfile {
  mcc: string;
  name: string;
  productDescription: string;
  stripeResponse: StripeResponse;
  supportAddress: Address;
  supportEmail: string;
  supportPhone: string;
  supportUrl: string;
  url: string;
}
export interface AccountCapabilities {
  acssDebitPayments: string;
  afterpayClearpayPayments: string;
  auBecsDebitPayments: string;
  bacsDebitPayments: string;
  bancontactPayments: string;
  boletoPayments: string;
  cardIssuing: string;
  cardPayments: string;
  cartesBancairesPayments: string;
  epsPayments: string;
  fpxPayments: string;
  giropayPayments: string;
  grabpayPayments: string;
  idealPayments: string;
  jcbPayments: string;
  klarnaPayments: string;
  konbiniPayments: string;
  legacyPayments: string;
  oxxoPayments: string;
  p24Payments: string;
  paynowPayments: string;
  sepaDebitPayments: string;
  sofortPayments: string;
  stripeResponse: StripeResponse;
  taxReportingUs1099K: string;
  taxReportingUs1099Misc: string;
  transfers: string;
  usBankAccountAchPayments: string;
}
export interface AccountCompany {
  address: Address;
  addressKana: AddressJapan;
  addressKanji: AddressJapan;
  directorsProvided: boolean;
  executivesProvided: boolean;
  name: string;
  nameKana: string;
  nameKanji: string;
  ownershipDeclaration: AccountCompanyOwnershipDeclaration;
  ownersProvided: boolean;
  phone: string;
  stripeResponse: StripeResponse;
  structure: string;
  taxIdProvided: boolean;
  taxIdRegistrar: string;
  vatIdProvided: boolean;
  verification: AccountCompanyVerification;
}
export interface AccountCompanyOwnershipDeclaration {
  date: string;
  ip: string;
  stripeResponse: StripeResponse;
  userAgent: string;
}
export interface AccountCompanyVerification {
  document: AccountCompanyVerificationDocument;
  stripeResponse: StripeResponse;
}
export interface AccountCompanyVerificationDocument {
  back: File;
  backId: string;
  details: string;
  detailsCode: string;
  front: File;
  frontId: string;
  stripeResponse: StripeResponse;
}
export interface AccountController {
  isController: boolean;
  stripeResponse: StripeResponse;
  type: string;
}
export interface AccountFutureRequirements {
  alternatives: AccountFutureRequirementsAlternative[];
  currentDeadline: string;
  currentlyDue: string[];
  disabledReason: string;
  errors: AccountFutureRequirementsError[];
  eventuallyDue: string[];
  pastDue: string[];
  pendingVerification: string[];
  stripeResponse: StripeResponse;
}
export interface AccountFutureRequirementsAlternative {
  alternativeFieldsDue: string[];
  originalFieldsDue: string[];
  stripeResponse: StripeResponse;
}
export interface AccountFutureRequirementsError {
  code: string;
  reason: string;
  requirement: string;
  stripeResponse: StripeResponse;
}
export interface AccountRequirements {
  alternatives: AccountRequirementsAlternative[];
  currentDeadline: string;
  currentlyDue: string[];
  disabledReason: string;
  errors: AccountRequirementsError[];
  eventuallyDue: string[];
  pastDue: string[];
  pendingVerification: string[];
  stripeResponse: StripeResponse;
}
export interface AccountRequirementsAlternative {
  alternativeFieldsDue: string[];
  originalFieldsDue: string[];
  stripeResponse: StripeResponse;
}
export interface AccountRequirementsError {
  code: string;
  reason: string;
  requirement: string;
  stripeResponse: StripeResponse;
}
export interface AccountSettings {
  bacsDebitPayments: AccountSettingsBacsDebitPayments;
  branding: AccountSettingsBranding;
  cardIssuing: AccountSettingsCardIssuing;
  cardPayments: AccountSettingsCardPayments;
  dashboard: AccountSettingsDashboard;
  payments: AccountSettingsPayments;
  payouts: AccountSettingsPayouts;
  sepaDebitPayments: AccountSettingsSepaDebitPayments;
  stripeResponse: StripeResponse;
}
export interface AccountSettingsBacsDebitPayments {
  displayName: string;
  stripeResponse: StripeResponse;
}
export interface AccountSettingsBranding {
  icon: File;
  iconId: string;
  logo: File;
  logoId: string;
  primaryColor: string;
  secondaryColor: string;
  stripeResponse: StripeResponse;
}
export interface AccountSettingsCardIssuing {
  stripeResponse: StripeResponse;
  tosAcceptance: AccountSettingsCardIssuingTosAcceptance;
}
export interface AccountSettingsCardIssuingTosAcceptance {
  date: number;
  ip: string;
  stripeResponse: StripeResponse;
  userAgent: string;
}
export interface AccountSettingsCardPayments {
  declineOn: AccountSettingsDeclineOn;
  statementDescriptorPrefix: string;
  stripeResponse: StripeResponse;
}
export interface AccountSettingsDashboard {
  displayName: string;
  stripeResponse: StripeResponse;
  timezone: string;
}
export interface AccountSettingsDeclineOn {
  avsFailure: boolean;
  cvcFailure: boolean;
  stripeResponse: StripeResponse;
}
export interface AccountSettingsPayments {
  statementDescriptor: string;
  statementDescriptorKana: string;
  statementDescriptorKanji: string;
  stripeResponse: StripeResponse;
}
export interface AccountSettingsPayouts {
  debitNegativeBalances: boolean;
  schedule: AccountSettingsPayoutsSchedule;
  statementDescriptor: string;
  stripeResponse: StripeResponse;
}
export interface AccountSettingsPayoutsSchedule {
  delayDays: number;
  interval: string;
  monthlyAnchor: number;
  stripeResponse: StripeResponse;
  weeklyAnchor: string;
}
export interface AccountSettingsSepaDebitPayments {
  creditorId: string;
  stripeResponse: StripeResponse;
}
export interface AccountTosAcceptance {
  date: string;
  ip: string;
  serviceAgreement: string;
  stripeResponse: StripeResponse;
  userAgent: string;
}
export interface Address {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postalCode: string;
  state: string;
  stripeResponse: StripeResponse;
}
export interface AddressJapan {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postalCode: string;
  state: string;
  stripeResponse: StripeResponse;
  town: string;
}
export interface Attendee {
  accessCode: string;
  address: DomainAddress;
  attendeeGroup: AttendeeGroup;
  attendeeGroupId: number;
  checkInDate: string;
  checkIns: AttendeeCheckIn[];
  checkOutDate: string;
  checkOuts: AttendeeCheckOut[];
  clientId: string;
  company: string;
  contactCardFirstName: string;
  contactCardLastName: string;
  contactCardPhotoUrl: string;
  createdByUser: number;
  createdDate: string;
  customRegistrationAnswers: CustomRegistrationAnswer[];
  customUrl: string;
  dateOfBirth: string;
  devices: AttendeeDevice[];
  displayName: string;
  email: string;
  event: Event;
  eventBrightAttendeeId: string;
  eventBrightBarcode: string;
  eventId: number;
  firstName: string;
  healthScreening: AttendeeHealthScreening;
  id: number;
  identificationCardPhotoBlobId: number;
  instagram: string;
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  isDeleted: boolean;
  isRegistered: boolean;
  jobTitle: string;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  lastName: string;
  leadNfcAttendeeId: string;
  linkedin: string;
  phoneNumber: string;
  profilePhotoBlobId: number;
  publicEmail: string;
  publicId: string;
  registrationDate: string;
  source: string;
  status: AttendeeStatus;
  statusId: number;
  statusLastModifiedBy: User;
  statusLastModifiedByUser: number;
  statusLastModifiedDate: string;
  statusNote: string;
  tenantId: number;
  ticketOrders: TicketOrder[];
  tickets: Ticket[];
  twitter: string;
  user: User;
  userId: number;
  xmin: number;
}
export interface AttendeeCheckIn {
  attendee: Attendee;
  attendeeId: number;
  checkInDate: string;
  checkInMethod: string;
  gate: EventAreaGate;
  gateId: number;
  id: number;
  scannerId: string;
  tenantId: number;
}
export interface AttendeeCheckOut {
  attendee: Attendee;
  attendeeId: number;
  checkOutDate: string;
  checkOutMethod: string;
  gate: EventAreaGate;
  gateId: number;
  id: number;
  scannerId: string;
  tenantId: number;
}
export interface AttendeeDevice {
  attendeeId: number;
  deviceUuid: string;
  isDeleted: boolean;
  metadata: string;
}
export interface AttendeeDeviceDto {
  deviceUuid: string;
  metadata: string;
}
export interface AttendeeDto {
  address: DomainAddress;
  attendeeGroupId: number;
  checkInCount: number;
  company: string;
  contactCardFirstName: string;
  contactCardLastName: string;
  contactCardPhotoUrl: string;
  createdDate: string;
  customRegistrationAnswers: CustomRegistrationAnswerDto[];
  customUrl: string;
  dateOfBirth: string;
  displayName: string;
  email: string;
  eventBrightAttendeeId: string;
  eventBrightBarcode: string;
  eventId: number;
  firstName: string;
  healthScreening: AttendeeHealthScreeningDto;
  id: number;
  identificationCardPhotoBlobId: number;
  instagram: string;
  isCheckedIn: boolean;
  isRegistered: boolean;
  jobTitle: string;
  lastName: string;
  linkedin: string;
  phoneNumber: string;
  profilePhotoBlobId: number;
  publicEmail: string;
  publicId: string;
  registrationDate: string;
  source: string;
  statusId: number;
  statusNote: string;
  tickets: TicketDto[];
  twitter: string;
  xmin: number;
}
export interface AttendeeGroup {
  color: string;
  createdByUser: number;
  createdDate: string;
  eventAreas: EventAreaAttendeeGroup[];
  eventId: number;
  id: number;
  isDefault: boolean;
  isDeleted: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  name: string;
  order: number;
  publicAccessCode: string;
  tenantId: number;
  ticketTypes: TicketType[];
  xmin: number;
}
export interface AttendeeGroupDto {
  color: string;
  id: number;
  isDefault: boolean;
  name: string;
  order: number;
  publicAccessCode: string;
}
export interface AttendeeHealthScreening {
  attendeeId: number;
  covid19VaccinationRecord: AttendeeVaccinationRecord;
  hasAcceptedWaiver: boolean;
  id: number;
  negativeTestAdditional2BlobId: number;
  negativeTestAdditionalBlobId: number;
  negativeTestBackBlobId: number;
  negativeTestFrontBlobId: number;
  proofType: AttendeeHealthScreeningProofType;
  proofTypeId: number;
  screeningAnswers: AttendeeHealthScreeningAnswer[];
  tenantId: number;
  testOnSite: boolean;
  useAutomaticProofValidation: boolean;
  vaccinationAdditional2BlobId: number;
  vaccinationAdditionalBlobId: number;
  vaccinationBackBlobId: number;
  vaccinationFrontBlobId: number;
}
export interface AttendeeHealthScreeningAnswer {
  givenAnswer: boolean;
  healthScreeningId: number;
  id: number;
  question: EventHealthScreeningQuestion;
  questionId: number;
  tenantId: number;
}
export interface AttendeeHealthScreeningAnswerDto {
  givenAnswer: boolean;
  id: number;
  questionId: number;
}
export interface AttendeeHealthScreeningDto {
  covid19VaccinationRecord: AttendeeVaccinationRecord;
  hasAcceptedWaiver: boolean;
  negativeTestAdditional2BlobId: number;
  negativeTestAdditionalBlobId: number;
  negativeTestBackBlobId: number;
  negativeTestFrontBlobId: number;
  proofTypeId: number;
  screeningAnswers: AttendeeHealthScreeningAnswerDto[];
  testOnSite: boolean;
  useAutomaticProofValidation: boolean;
  vaccinationAdditional2BlobId: number;
  vaccinationAdditionalBlobId: number;
  vaccinationBackBlobId: number;
  vaccinationFrontBlobId: number;
}
export interface AttendeeHealthScreeningProofCategory {
  id: number;
  name: string;
}
export interface AttendeeHealthScreeningProofType {
  category: AttendeeHealthScreeningProofCategory;
  categoryId: number;
  id: number;
  name: string;
}
export interface AttendeeStatus {
  id: number;
  name: string;
}
export interface AttendeeVaccinationRecord {
  firstDoseDate: string;
  firstName: string;
  lastName: string;
  secondDoseDate: string;
  state: string;
  vaccineType: string;
}
export interface Auth0UserDto {
  email: string;
}
export interface Blob {
  container: string;
  contentType: string;
  createdByUser: number;
  createdDate: string;
  expiresAt: string;
  fileName: string;
  fileSize: number;
  id: number;
  isDeleted: boolean;
  isPublicAccess: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  path: string;
  referenceKey: string;
  tenantId: number;
  xmin: number;
}
export interface BlobDto {
  contentType: string;
  fileName: string;
  fileSize: number;
  id: number;
  referenceKey: string;
}
export interface Company {
  createdByUser: number;
  createdDate: string;
  defaultLogoBlob: Blob;
  defaultLogoBlobId: number;
  defaultPageBackgroundBlob: Blob;
  defaultPageBackgroundBlobId: number;
  email: string;
  extraRegistrations: number;
  fees: CompanyTicketTypeFee[];
  hasPremiumSupport: boolean;
  id: number;
  isDeleted: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  leadNfcHostId: string;
  name: string;
  phoneNumber: string;
  profileCompleted: boolean;
  stripeAccountLinkCreatedOn: string;
  stripeAccountLinkExpiresAt: string;
  stripeAccountLinkUrl: string;
  stripeAccountStatus: string;
  stripeChargesEnabled: boolean;
  stripeConnectAccountId: string;
  stripeCustomerId: string;
  stripePayoutsEnabled: boolean;
  subscriptions: CompanySubscriptionPlan[];
  tenantId: number;
  xmin: number;
}
export interface CompanyDto {
  defaultLogoBlobId: number;
  defaultPageBackgroundBlobId: number;
  email: string;
  extraRegistrations: number;
  hasActiveSubscription: boolean;
  hostCreatedTicketTypeFees: PublicCompanyTicketTypeFee[];
  id: number;
  name: string;
  phoneNumber: string;
  profileCompleted: boolean;
  stripeAccountStatus: string;
  stripeChargesEnabled: boolean;
  stripeConnectAccountId: string;
  stripePayoutsEnabled: boolean;
  subscription: CompanySubscriptionPlanDto;
}
export interface CompanyExistsModel {
  exists: boolean;
}
export interface CompanySubscriptionPlan {
  cancelledDate: string;
  company: Company;
  companyId: number;
  costPerExtraRegistration: number;
  createdByUser: number;
  createdDate: string;
  expiresAt: string;
  id: number;
  isAnnualPlan: boolean;
  isDeleted: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  nextUsageDate: string;
  numberOfAdminUsers: number;
  numberOfRegistrationsThisMonth: number;
  numberOfUsedAdminSeats: number;
  planName: string;
  planPrice: number;
  registrationsPerMonth: number;
  stripeProductId: string;
  stripeSubscriptionId: string;
  stripeUsageSubscriptionId: string;
  subscriptionDate: string;
  subscriptionDayInMonth: number;
  subscriptionProduct: SubscriptionProduct;
  subscriptionProductId: number;
  tenantId: number;
  totalNumberOfExtraRegistrations: number;
  totalNumberOfRegistrations: number;
  xmin: number;
}
export interface CompanySubscriptionPlanDto {
  costPerExtraRegistration: number;
  expiresAt: string;
  isAnnualPlan: boolean;
  numberOfAdminUsers: number;
  numberOfRegistrationsThisMonth: number;
  numberOfUsedAdminSeats: number;
  planName: string;
  planPrice: number;
  registrationsPerMonth: number;
  stripeProductId: string;
  stripeSubscriptionId: string;
  stripeUsageSubscriptionId: string;
  subscriptionProductId: number;
}
export interface CompanyTicketTypeFee {
  company: Company;
  companyId: number;
  createdByUser: number;
  createdDate: string;
  description: string;
  feeAmount: number;
  feeType: FeeType;
  id: number;
  isDeleted: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  name: string;
  publicId: string;
  ticketTypes: HostTicketTypeFees[];
  xmin: number;
}
export interface CompanyTopUpExtraRegistrationDto {
  companyId: number;
  quantity: number;
}
export interface CompleteAttendeeTicketPaymentCheckoutResult {}
export interface CompleteAttendeeTicketingCheckoutDto {
  checkoutSessionId: string;
  ticketOrderPublicId: string;
}
export interface CompleteCompanyProfileDto {
  email: string;
  name: string;
  phoneNumber: string;
}
export interface Coupon {
  applyToAllTickets: boolean;
  code: string;
  createdByUser: number;
  createdDate: string;
  enableFixedDiscount: boolean;
  enableLimitedDateTimeRedeemCode: boolean;
  enableLimitedNumberOfTimesToUse: boolean;
  enablePercentageDiscount: boolean;
  eventTicketing: EventTicketing;
  eventTicketingId: number;
  fixedDiscountPrice: number;
  id: number;
  isDeleted: boolean;
  isEnabled: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  limitedDateTimeRedeemCode: string;
  name: string;
  numberOfTimesToUse: number;
  percentageDiscount: number;
  publicId: string;
  tenantId: number;
  tickets: TicketTypeCoupon[];
  xmin: number;
}
export interface CouponDto {
  applyToAllTickets: boolean;
  code: string;
  enableFixedDiscount: boolean;
  enableLimitedDateTimeRedeemCode: boolean;
  enableLimitedNumberOfTimesToUse: boolean;
  enablePercentageDiscount: boolean;
  fixedDiscountPrice: number;
  id: number;
  isEnabled: boolean;
  limitedDateTimeRedeemCode: string;
  name: string;
  numberOfTimesToUse: number;
  percentageDiscount: number;
  publicId: string;
}
export interface CreateAttendeeGroupDto {
  color: string;
  name: string;
  order: number;
}
export interface CreateAttendeeTicketingCheckoutDto {
  eventPublicId: string;
  lineItems: TicketingLineItemsDto[];
}
export interface CreateAttendeeWithTicketDto {
  email: string;
  firstName: string;
  inviteToRegister: boolean;
  lastName: string;
  phoneNumber: string;
  ticketTypeId: number;
}
export interface CreateCheckoutSessionResult {
  redirectUrl: string;
}
export interface CreateCompanyTicketTypeFeeDto {
  description: string;
  feeAmount: number;
  feeType: FeeType;
  name: string;
}
export interface CreateEventAreaDto {
  maxCheckInsPerAttendee: number;
  name: string;
}
export interface CreateEventAttendeeDto {
  attendeeGroupId: number;
  company: string;
  contactCardFirstName: string;
  contactCardLastName: string;
  contactCardPhotoUrl: string;
  customUrl: string;
  displayName: string;
  email: string;
  eventBrightAttendeeId: string;
  eventBrightBarcode: string;
  firstName: string;
  identificationCardPhotoBlobId: number;
  instagram: string;
  inviteToRegister: boolean;
  jobTitle: string;
  lastName: string;
  linkedin: string;
  phoneNumber: string;
  profilePhotoBlobId: number;
  publicEmail: string;
  twitter: string;
}
export interface CreateEventDto {
  address: DomainAddress;
  addressName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  endDate: string;
  hideDate: boolean;
  registrationLink: string;
  startDate: string;
  title: string;
}
export interface CreatePortalSessionResult {
  portalUrl: string;
}
export interface CreateSpeakerDto {
  description: string;
  firstName: string;
  jobTitle: string;
  lastName: string;
  speakerLinkList: CreateSpeakerLinkDto[];
}
export interface CreateSpeakerLinkDto {
  linkName: string;
  linkURL: string;
}
export interface CreateSuperAdminDto {
  email: string;
  firstName: string;
  lastName: string;
}
export interface CreateTeammateDto {
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
}
export interface CreateTicketTypeDto {
  attendeeGroupPublicAccessCode: string;
  description: string;
  enableHostFees: boolean;
  enableIsOnSale: boolean;
  enableLimitQuantityPerAttendee: boolean;
  enableShowTicketDescriptionOnEventName: boolean;
  enableTransferable: boolean;
  hostFeePublicIds: string[];
  name: string;
  price: number;
  priceIncludesPlatformFees: boolean;
  quantityAvailable: number;
  quantityLimitPerAttendee: number;
}
export interface CreateTicketingCheckoutSessionResult {
  redirectUrl: string;
}
export interface CustomRegistrationAnswer {
  attendeeId: number;
  givenAnswer: string;
  id: number;
  question: CustomRegistrationQuestion;
  questionId: number;
  tenantId: number;
}
export interface CustomRegistrationAnswerDto {
  givenAnswer: string;
  id: number;
  questionId: number;
}
export interface CustomRegistrationQuestion {
  eventId: number;
  id: number;
  isRequired: boolean;
  name: string;
  order: number;
  tenantId: number;
  valueType: string;
}
export interface CustomRegistrationQuestionDto {
  id: number;
  isRequired: boolean;
  name: string;
  valueType: string;
}
export interface DeleteEventAreaRequest {
  areaIds: number[];
}
export interface DeleteEventAttendeesRequest {
  attendeeIds: number[];
}
export interface Dob {
  day: number;
  month: number;
  stripeResponse: StripeResponse;
  year: number;
}
export interface DomainAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  state: string;
  zip: string;
}
export interface EnterpriseEventsDashboardQueryResult {
  activeEvents: number;
  data: any;
  message: string;
  numberOfAttendees: number;
  status: FeatureResultStatus;
  totalItemCount: number;
}
export interface Event {
  about: string;
  address: DomainAddress;
  addressName: string;
  approvalAttendeeIdPrefix: string;
  approvalInstructions: string;
  attendeeGroups: AttendeeGroup[];
  attendees: Attendee[];
  checkInAuthorizationCode: string;
  clientId: string;
  companyName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  createdByUser: number;
  createdByUserEntity: User;
  createdDate: string;
  currentSetupStep: number;
  customRegistrationQuestions: CustomRegistrationQuestion[];
  dateProcessed: string;
  endDate: string;
  eventAreas: EventArea[];
  eventBlobs: EventBlob[];
  eventHeaderTextColor: string;
  eventTabs: EventTab[];
  facebookURL: string;
  featureImageBlob: Blob;
  featureImageBlobId: number;
  healthScreening: EventHealthScreening;
  hideDate: boolean;
  hideQrCode: boolean;
  id: number;
  instagramURL: string;
  invitationFooter: string;
  invitationText: string;
  isAtCapacity: boolean;
  isDeleted: boolean;
  isProcessed: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  leadNfcEventId: string;
  linkdinURL: string;
  logoBlob: Blob;
  logoBlobId: number;
  ogDescription: string;
  ogImageBlob: Blob;
  ogImageBlobId: number;
  ogTitle: string;
  pageBackgroundBlob: Blob;
  pageBackgroundBlobId: number;
  publicId: string;
  publicRegistrationCode: string;
  registrationCapacity: number;
  registrationLink: string;
  registrationQuestionAddress: EventRegistrationQuestion;
  registrationQuestionDateOfBirth: EventRegistrationQuestion;
  registrationQuestionPhoneNumber: EventRegistrationQuestion;
  requiresNegativeTest: boolean;
  requiresVaccination: boolean;
  smartCredentials: EventSmartCredentials;
  speakers: Speaker[];
  startDate: string;
  status: EventStatus;
  statusId: number;
  submissionReceived: boolean;
  teammates: EventTeammate[];
  tenantId: number;
  ticketing: EventTicketing;
  timezoneOffset: number;
  title: string;
  twitterURL: string;
  videoURL: string;
  xmin: number;
}
export interface EventArea {
  attendeeGroups: EventAreaAttendeeGroup[];
  createdByUser: number;
  createdDate: string;
  eventId: number;
  gates: EventAreaGate[];
  id: number;
  isDefault: boolean;
  isDeleted: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  maxCheckInsPerAttendee: number;
  name: string;
  tenantId: number;
  xmin: number;
}
export interface EventAreaAttendeeGroup {
  attendeeGroupId: number;
  eventAreaId: number;
}
export interface EventAreaDto {
  attendeeGroups: AttendeeGroupDto[];
  eventAreaGates: EventAreaGateDto[];
  id: number;
  isDefault: boolean;
  maxCheckInsPerAttendee: number;
  name: string;
}
export interface EventAreaGate {
  createdByUser: number;
  createdDate: string;
  eventAreaId: number;
  id: number;
  isDefault: boolean;
  isDeleted: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  name: string;
  order: number;
  tenantId: number;
  ticketScans: TicketScan[];
  xmin: number;
}
export interface EventAreaGateDto {
  checkInsCount: number;
  id: number;
  isDefault: boolean;
  lastCheckInUtcDate: string;
  name: string;
  order: number;
}
export interface EventAreaVisitDto {
  areaId: number;
  attendeeId: number;
  checkInDate: string;
  checkInMethod: string;
  checkOutDate: string;
  checkOutMethod: string;
  firstName: string;
  gateId: number;
  gateName: string;
  lastName: string;
  scannerId: string;
}
export interface EventAreasDashboardQueryResult {
  data: any;
  message: string;
  status: FeatureResultStatus;
  totalItemCount: number;
  totalUniqueVisits: number;
}
export interface EventAttendeeDto {
  address: DomainAddress;
  attendeeGroupId: number;
  company: string;
  contactCardFirstName: string;
  contactCardLastName: string;
  contactCardPhotoUrl: string;
  createdDate: string;
  customRegistrationAnswers: CustomRegistrationAnswerDto[];
  customUrl: string;
  dateOfBirth: string;
  displayName: string;
  email: string;
  event: EventDto;
  eventBrightAttendeeId: string;
  eventBrightBarcode: string;
  eventId: number;
  firstName: string;
  healthScreening: AttendeeHealthScreeningDto;
  id: number;
  identificationCardPhotoBlobId: number;
  instagram: string;
  isCheckedIn: boolean;
  isRegistered: boolean;
  jobTitle: string;
  lastName: string;
  linkedin: string;
  phoneNumber: string;
  profilePhotoBlobId: number;
  publicEmail: string;
  publicId: string;
  registrationDate: string;
  source: string;
  statusId: number;
  statusNote: string;
  tickets: TicketDto[];
  twitter: string;
  xmin: number;
}
export interface EventAttendeesDashboardQueryResult {
  checkedIn: number;
  data: any;
  message: string;
  notRegistered: number;
  registered: number;
  status: FeatureResultStatus;
  total: number;
  totalItemCount: number;
}
export interface EventBlob {
  container: string;
  contentType: string;
  createdByUser: number;
  createdDate: string;
  eventId: number;
  expiresAt: string;
  fileName: string;
  fileSize: number;
  id: number;
  isDeleted: boolean;
  isPublicAccess: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  path: string;
  referenceKey: string;
  tenantId: number;
  xmin: number;
}
export interface EventBlobDto {
  blobId: number;
  container: string;
  contentType: string;
  filebyte: string;
  fileName: string;
  path: string;
  referenceKey: string;
}
export interface EventDashboardModel {
  attendeesCheckedIn: number;
  attendeesRegistered: number;
  healthFormSubmissions: number;
  numberOfAttendees: number;
  pageViews: number;
  submissionsByDate: EventDashboardSubmissionsByDateModel[];
}
export interface EventDashboardSubmissionsByDateModel {
  numberOfSubmissions: number;
  submissionDate: string;
}
export interface EventDto {
  about: string;
  address: DomainAddress;
  addressName: string;
  attendeeGroups: AttendeeGroupDto[];
  companyName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  currentSetupStep: number;
  customRegistrationQuestions: CustomRegistrationQuestionDto[];
  endDate: string;
  eventHeaderTextColor: string;
  eventTabs: GetEventTabDto[];
  facebookURL: string;
  featureImageBlobId: number;
  featureImageReferenceKey: string;
  healthScreening: EventHealthScreeningDto;
  hideDate: boolean;
  id: number;
  instagramURL: string;
  invitationFooter: string;
  invitationText: string;
  isProcessed: boolean;
  linkdinURL: string;
  logoBlobId: number;
  logoBlobReferenceKey: string;
  ogDescription: string;
  ogImageBlobId: number;
  ogTitle: string;
  pageBackgroundBlobId: number;
  pageBackgroundReferenceKey: string;
  publicId: string;
  publicRegistrationCode: string;
  registrationCapacity: number;
  registrationLink: string;
  registrationQuestionAddress: EventRegistrationQuestion;
  registrationQuestionDateOfBirth: EventRegistrationQuestion;
  registrationQuestionPhoneNumber: EventRegistrationQuestion;
  smartCredentials: EventSmartCredentialsDto;
  speakers: GetAllSpeakerByEventDto[];
  startDate: string;
  statusId: number;
  submissionReceived: boolean;
  ticketing: EventTicketingDto;
  title: string;
  twitterURL: string;
  useLogoAndBackgroundInAllEvents: boolean;
  videoURL: string;
}
export interface EventHealthScreening {
  additionalNote: string;
  enableCovidClearance: boolean;
  enableScreeningQuestions: boolean;
  eventId: number;
  hasOwnWaiver: boolean;
  id: number;
  ownWaiverBlobId: number;
  proof: EventHealthScreeningProof;
  screeningQuestions: EventHealthScreeningQuestion[];
  tenantId: number;
}
export interface EventHealthScreeningDashboardQueryResult {
  approved: number;
  data: any;
  message: string;
  pending: number;
  rejected: number;
  status: FeatureResultStatus;
  submissions: number;
  totalItemCount: number;
}
export interface EventHealthScreeningDto {
  additionalNote: string;
  enableCovidClearance: boolean;
  enableScreeningQuestions: boolean;
  hasOwnWaiver: boolean;
  ownWaiverBlobId: number;
  ownWaiverBlobReferenceKey: string;
  proof: EventHealthScreeningProof;
  screeningQuestions: EventHealthScreeningQuestionDto[];
}
export interface EventHealthScreeningProof {
  customClearanceRequirements: string;
  hasProofRequirements: boolean;
  offerOnSiteTesting: boolean;
  pcrNegativeTestWithinHours: number;
  proofTypeId: number;
  rapidNegativeTestWithinHours: number;
  vaccinationNumberOfDoses: number;
}
export interface EventHealthScreeningProofType {
  category: AttendeeHealthScreeningProofCategory;
  categoryId: number;
  id: number;
  name: string;
}
export interface EventHealthScreeningQuestion {
  correctAnswer: boolean;
  healthScreeningId: number;
  id: number;
  question: string;
  tenantId: number;
}
export interface EventHealthScreeningQuestionDto {
  correctAnswer: boolean;
  id: number;
  question: string;
}
export interface EventIdListQueryRequest {
  eventId: number;
  filteringData: FilteringData;
  pagingData: PagingData;
  sortingData: SortingData;
}
export interface EventRegistrationQuestion {
  isAvailable: boolean;
  isRequired: boolean;
  order: number;
}
export interface EventSmartCredentials {
  enableSmartCredentials: boolean;
  event: Event;
  eventId: number;
  id: number;
  tenantId: number;
  useEventBrightForCheckin: boolean;
}
export interface EventSmartCredentialsDto {
  enableSmartCredentials: boolean;
  useEventBrightForCheckin: boolean;
}
export interface EventStatus {
  id: number;
  name: string;
}
export interface EventTab {
  about: string;
  eventId: number;
  id: number;
}
export interface EventTabDto {
  about: string;
}
export interface EventTeammate {
  event: Event;
  eventId: number;
  teammate: Teammate;
  teammateId: number;
}
export interface EventTeammateDto {}
export interface EventTicketing {
  coupons: Coupon[];
  enableTicketing: boolean;
  event: Event;
  eventId: number;
  id: number;
  tenantId: number;
  ticketTypes: TicketType[];
}
export interface EventTicketingDto {
  coupons: CouponDto[];
  enableTicketing: boolean;
  ticketTypes: TicketTypeDto[];
}
export interface FeatureResultStatus {
  code: number;
}
export interface FeeDto {
  description: string;
  feeAmount: number;
  feeType: FeeType;
  id: number;
  name: string;
  publicId: string;
}
export type FeeType = 0 | 1;
export interface File {
  created: string;
  expiresAt: string;
  filename: string;
  id: string;
  links: FileLink[];
  object: string;
  purpose: string;
  size: number;
  stripeResponse: StripeResponse;
  title: string;
  type: string;
  url: string;
}
export interface FileLink {
  created: string;
  expired: boolean;
  expiresAt: string;
  file: File;
  fileId: string;
  id: string;
  livemode: boolean;
  metadata: Record<string, string>;
  object: string;
  stripeResponse: StripeResponse;
  url: string;
}
export interface FilteringData {
  filters: QueryFilter[];
}
export interface GetAllSpeakerByEventDto {
  description: string;
  firstName: string;
  id: number;
  jobTitle: string;
  lastName: string;
  speakerLinks: SpeakerLinkDto[];
}
export interface GetEventTabDto {
  about: string;
  id: number;
}
export interface HealthCheckModel {
  canConnect: boolean;
  randomInt: number;
  serverTime: string;
  utcTime: string;
}
export interface HostTicketTypeFees {
  companyTicketTypeFee: CompanyTicketTypeFee;
  companyTicketTypeFeeId: number;
  ticketType: TicketType;
  ticketTypeId: number;
}
export interface IExternalAccount {
  account: Account;
  accountId: string;
  id: string;
  object: string;
  stripeResponse: StripeResponse;
}
export interface InviteEventAttendeesRequest {
  attendeeIds: number[];
}
export interface ListQueryRequest {
  filteringData: FilteringData;
  pagingData: PagingData;
  sortingData: SortingData;
}
export interface LookupsModel {
  attendeeHealthScreeningProofTypes: AttendeeHealthScreeningProofType[];
  attendeeStatuses: AttendeeStatus[];
  eventHealthScreeningProofTypes: EventHealthScreeningProofType[];
  eventStatuses: EventStatus[];
  superAdminStatuses: SuperAdminStatus[];
  teammateRoles: TeammateRole[];
  teammateStatuses: TeammateStatus[];
  userTypes: UserType[];
}
export interface OrderItem {
  createdByUser: number;
  createdDate: string;
  currency: string;
  id: number;
  isDeleted: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  price: number;
  publicId: string;
  quantity: number;
  stripePriceId: string;
  stripeProductId: string;
  tenantId: number;
  ticketOrder: TicketOrder;
  ticketOrderId: number;
  tickets: Ticket[];
  ticketTypeId: number;
  xmin: number;
}
export interface OrderItemDto {
  currency: string;
  price: number;
  publicId: string;
  quantity: number;
  stripePriceId: string;
  stripeProductId: string;
  ticketOrderId: number;
  tickets: TicketDto[];
  ticketTypeId: number;
}
export interface PagingData {
  currentPage: number;
  pageSize: number;
}
export interface ParseAttendeesRequest {
  inviteToRegister: boolean;
  proceedWithoutEmails: boolean;
}
export interface PaymentPricingModel {
  products: PaymentPricingProductModel[];
}
export interface PaymentPricingProductModel {
  accessoryPrice: number;
  priceId: string;
  priceTiers: PaymentPricingProductTierModel[];
  productId: string;
  productType: string;
}
export interface PaymentPricingProductTierModel {
  price: number;
  upToQuantity: number;
}
export interface Person {
  account: string;
  address: Address;
  addressKana: AddressJapan;
  addressKanji: AddressJapan;
  created: string;
  deleted: boolean;
  dob: Dob;
  email: string;
  firstName: string;
  firstNameKana: string;
  firstNameKanji: string;
  fullNameAliases: string[];
  futureRequirements: PersonFutureRequirements;
  gender: string;
  id: string;
  idNumberProvided: boolean;
  lastName: string;
  lastNameKana: string;
  lastNameKanji: string;
  maidenName: string;
  metadata: Record<string, string>;
  nationality: string;
  object: string;
  phone: string;
  politicalExposure: string;
  relationship: PersonRelationship;
  requirements: PersonRequirements;
  ssnLast4Provided: boolean;
  stripeResponse: StripeResponse;
  verification: PersonVerification;
}
export interface PersonFutureRequirements {
  alternatives: PersonFutureRequirementsAlternative[];
  currentlyDue: string[];
  errors: PersonFutureRequirementsError[];
  eventuallyDue: string[];
  pastDue: string[];
  pendingVerification: string[];
  stripeResponse: StripeResponse;
}
export interface PersonFutureRequirementsAlternative {
  alternativeFieldsDue: string[];
  originalFieldsDue: string[];
  stripeResponse: StripeResponse;
}
export interface PersonFutureRequirementsError {
  code: string;
  reason: string;
  requirement: string;
  stripeResponse: StripeResponse;
}
export interface PersonRelationship {
  director: boolean;
  executive: boolean;
  owner: boolean;
  percentOwnership: number;
  representative: boolean;
  stripeResponse: StripeResponse;
  title: string;
}
export interface PersonRequirements {
  alternatives: PersonRequirementsAlternative[];
  currentlyDue: string[];
  errors: PersonRequirementsError[];
  eventuallyDue: string[];
  pastDue: string[];
  pendingVerification: string[];
  stripeResponse: StripeResponse;
}
export interface PersonRequirementsAlternative {
  alternativeFieldsDue: string[];
  originalFieldsDue: string[];
  stripeResponse: StripeResponse;
}
export interface PersonRequirementsError {
  code: string;
  reason: string;
  requirement: string;
  stripeResponse: StripeResponse;
}
export interface PersonVerification {
  additionalDocument: PersonVerificationAdditionalDocument;
  details: string;
  detailsCode: string;
  document: PersonVerificationDocument;
  status: string;
  stripeResponse: StripeResponse;
}
export interface PersonVerificationAdditionalDocument {
  back: File;
  backId: string;
  details: string;
  detailsCode: string;
  front: File;
  frontId: string;
  stripeResponse: StripeResponse;
}
export interface PersonVerificationDocument {
  back: File;
  backId: string;
  details: string;
  detailsCode: string;
  front: File;
  frontId: string;
  stripeResponse: StripeResponse;
}
export interface PlatformTicketTypeFee {
  createdByUser: number;
  createdDate: string;
  description: string;
  feeAmount: number;
  feeType: FeeType;
  id: number;
  isDefault: boolean;
  isDeleted: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  name: string;
  publicId: string;
  ticketTypes: TicketTypePlatformFees[];
  xmin: number;
}
export interface PublicCompanyTicketTypeFee {
  description: string;
  feeAmount: number;
  feeType: FeeType;
  id: number;
  name: string;
  publicId: string;
}
export interface PublicEventAttendeeDto {
  address: DomainAddress;
  attendeeGroupId: number;
  company: string;
  contactCardFirstName: string;
  contactCardLastName: string;
  contactCardPhotoUrl: string;
  createdDate: string;
  customRegistrationAnswers: CustomRegistrationAnswerDto[];
  customUrl: string;
  dateOfBirth: string;
  displayName: string;
  email: string;
  event: PublicEventDto;
  eventBrightAttendeeId: string;
  eventBrightBarcode: string;
  eventId: number;
  firstName: string;
  healthScreening: AttendeeHealthScreeningDto;
  id: number;
  identificationCardPhotoBlobId: number;
  instagram: string;
  isCheckedIn: boolean;
  isRegistered: boolean;
  jobTitle: string;
  lastName: string;
  linkedin: string;
  phoneNumber: string;
  profilePhotoBlobId: number;
  publicEmail: string;
  publicId: string;
  registrationDate: string;
  source: string;
  statusId: number;
  statusNote: string;
  tickets: TicketDto[];
  twitter: string;
  xmin: number;
}
export interface PublicEventDto {
  about: string;
  address: DomainAddress;
  addressName: string;
  companyName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  endDate: string;
  eventHeaderTextColor: string;
  eventTabs: GetEventTabDto[];
  facebookURL: string;
  featureImageBlobId: number;
  featureImageReferenceKey: string;
  hideDate: boolean;
  instagramURL: string;
  isAtCapacity: boolean;
  linkdinURL: string;
  logoBlobReferenceKey: string;
  ogDescription: string;
  ogImageBlobId: number;
  ogTitle: string;
  pageBackgroundReferenceKey: string;
  publicId: string;
  publicRegistrationCode: string;
  registrationLink: string;
  smartCredentials: PublicEventSmartCredentialsDto;
  speakers: GetAllSpeakerByEventDto[];
  startDate: string;
  statusId: number;
  ticketing: PublicEventTicketingDto;
  title: string;
  twitterURL: string;
  videoURL: string;
}
export interface PublicEventSmartCredentialsDto {
  enableSmartCredentials: boolean;
  useEventBrightForCheckin: boolean;
}
export interface PublicEventTicketingDto {
  enableTicketing: boolean;
  ticketTypes: PublicTicketTypeDto[];
}
export interface PublicFeeDto {
  description: string;
  feeAmount: number;
  feeType: FeeType;
  name: string;
  publicId: string;
}
export interface PublicTicketOrderAttendeeDto {
  ticketOrder: PublicTicketOrderDto;
}
export interface PublicTicketOrderDto {}
export interface PublicTicketTypeDto {
  attendeeGroupPublicAccessCode: string;
  description: string;
  enableLimitQuantityPerAttendee: boolean;
  enableShowTicketDescriptionOnEventName: boolean;
  enableTransferable: boolean;
  hostFees: PublicFeeDto[];
  name: string;
  platformFees: PublicFeeDto[];
  price: number;
  publicId: string;
  quantityAvailable: number;
  quantityLimitPerAttendee: number;
  quantitySold: number;
  stripePriceId: string;
  stripeProductId: string;
  totalPrice: number;
  totalPriceOfHostFees: number;
  totalPriceOfPlatformFees: number;
}
export interface QueryFilter {
  field: string;
  operator: string;
  value: any;
}
export interface QuerySort {
  direction: string;
  field: string;
}
export interface ResendQrCodeToAttendeesRequest {
  attendeeIds: number[];
}
export interface ScanContactCardDto {
  attendeeId: string;
  note: string;
}
export type ScanType = 0 | 1;
export interface ScannerInfoDto {
  scannerId: string;
  scannerName: string;
}
export interface SortingData {
  sorts: QuerySort[];
}
export interface Speaker {
  description: string;
  eventId: number;
  firstName: string;
  id: number;
  jobTitle: string;
  lastName: string;
  speakerLinks: SpeakerLink[];
}
export interface SpeakerLink {
  id: number;
  linkName: string;
  linkURL: string;
  speakerId: number;
}
export interface SpeakerLinkDto {
  id: number;
  linkName: string;
  linkURL: string;
  speakerId: number;
}
export interface StringStringIEnumerableKeyValuePair {
  key: string;
  value: string[];
}
export interface StripeResponse {
  content: string;
  date: string;
  headers: StringStringIEnumerableKeyValuePair[];
  idempotencyKey: string;
  requestId: string;
  statusCode: number;
}
export interface SubscriptionPlanModel {
  annualPricing: SubscriptionPlanPriceModel;
  costPerExtraRegistration: number;
  monthlyPricing: SubscriptionPlanPriceModel;
  name: string;
  numberOfAdminUsers: number;
  registrationsPerMonth: number;
  stripeProductId: string;
  usagePricing: SubscriptionPlanPriceModel;
}
export interface SubscriptionPlanPriceModel {
  isAnnualPricing: boolean;
  isUsage: boolean;
  monthlyPrice: number;
  price: number;
  stripePriceId: string;
  stripeProductId: string;
}
export interface SubscriptionProduct {
  id: number;
  isActive: boolean;
  isSubscriptionPlan: boolean;
  name: string;
  stripeProductId: string;
}
export interface SuperAdminDto {
  approvalsToday: number;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  rejectionsToday: number;
  statusId: number;
  totalApprovals: number;
  totalRejections: number;
}
export interface SuperAdminStatus {
  id: number;
  name: string;
}
export interface Teammate {
  createdByUser: number;
  createdDate: string;
  email: string;
  events: EventTeammate[];
  firstName: string;
  id: number;
  isDeleted: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  lastName: string;
  role: TeammateRole;
  roleId: number;
  status: TeammateStatus;
  statusId: number;
  tenantId: number;
  user: User;
  userId: number;
  xmin: number;
}
export interface TeammateDto {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  roleId: number;
  statusId: number;
}
export interface TeammateEventsDto {
  email: string;
  events: EventDto[];
  firstName: string;
  id: number;
  lastName: string;
  roleId: number;
  statusId: number;
}
export interface TeammateRole {
  id: number;
  name: string;
}
export interface TeammateStatus {
  id: number;
  name: string;
}
export interface Ticket {
  accessCode: string;
  attendee: Attendee;
  createdByUser: number;
  createdDate: string;
  id: number;
  isDeleted: boolean;
  isHostGift: boolean;
  isRefunded: boolean;
  isScanned: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  orderItem: OrderItem;
  orderItemId: number;
  ownedByAttendeeId: number;
  publicId: string;
  scannedDateTime: string;
  ticketScans: TicketScan[];
  transferredOut: boolean;
  xmin: number;
}
export interface TicketDto {
  accessCode: string;
  attendeeGroup: string;
  attendeeName: string;
  createdDate: string;
  eventLocation: string;
  eventName: string;
  eventTime: string;
  isHostGift: boolean;
  isScanned: boolean;
  ownedByAttendeeId: number;
  publicId: string;
  qrCodeUrl: string;
  scannedDateTime: string;
  ticketTypeCurrency: string;
  ticketTypeHostFees: PublicFeeDto[];
  ticketTypeName: string;
  ticketTypePlatformFees: PublicFeeDto[];
  ticketTypePriceWithFees: number;
  ticketTypePublicId: string;
  transferredOut: boolean;
}
export interface TicketOrder {
  attendeeId: number;
  cardBrand: string;
  cardLast4: string;
  createdByUser: number;
  createdDate: string;
  currency: string;
  id: number;
  isDeleted: boolean;
  isHostGift: boolean;
  isPaid: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  orderItems: OrderItem[];
  publicId: string;
  subtotalAmount: number;
  tenantId: number;
  totalAmount: number;
  xmin: number;
}
export interface TicketOrderDto {
  attendeeId: number;
  cardBrand: string;
  cardLast4: string;
  currency: string;
  event: PublicEventDto;
  isPaid: boolean;
  orderItems: OrderItemDto[];
  publicId: string;
  subtotalAmount: number;
  totalAmount: number;
}
export interface TicketScan {
  createdByUser: number;
  createdDate: string;
  eventAreaGate: EventAreaGate;
  eventAreaGateId: number;
  id: number;
  isDeleted: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  scannedByUser: User;
  scannedByUserId: number;
  scannerId: string;
  scannerName: string;
  scanType: ScanType;
  ticket: Ticket;
  ticketId: number;
  xmin: number;
}
export interface TicketType {
  attendeeGroup: AttendeeGroup;
  attendeeGroupPublicAccessCode: string;
  coupons: TicketTypeCoupon[];
  createdByUser: number;
  createdDate: string;
  currency: string;
  description: string;
  enableHostFees: boolean;
  enableIsOnSale: boolean;
  enableLimitQuantityPerAttendee: boolean;
  enableShowTicketDescriptionOnEventName: boolean;
  enableTransferable: boolean;
  eventTicketing: EventTicketing;
  eventTicketingId: number;
  hostFees: HostTicketTypeFees[];
  id: number;
  isDeleted: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  name: string;
  orderItems: OrderItem[];
  platformFees: TicketTypePlatformFees[];
  price: number;
  priceIncludesPlatformFees: boolean;
  publicId: string;
  quantityAvailable: number;
  quantityLimitPerAttendee: number;
  stripePriceId: string;
  stripeProductId: string;
  tenantId: number;
  totalPrice: number;
  totalPriceOfHostFees: number;
  totalPriceOfPlatformFees: number;
  xmin: number;
}
export interface TicketTypeCoupon {
  coupon: Coupon;
  couponId: number;
  ticketType: TicketType;
  ticketTypeId: number;
}
export interface TicketTypeDto {
  attendeeGroupPublicAccessCode: string;
  description: string;
  enableHostFees: boolean;
  enableIsOnSale: boolean;
  enableLimitQuantityPerAttendee: boolean;
  enableShowTicketDescriptionOnEventName: boolean;
  enableTransferable: boolean;
  hostFees: FeeDto[];
  id: number;
  name: string;
  platformFees: FeeDto[];
  price: number;
  publicId: string;
  quantityAvailable: number;
  quantityLimitPerAttendee: number;
  stripePriceId: string;
  stripeProductId: string;
  totalPrice: number;
  totalPriceOfHostFees: number;
  totalPriceOfPlatformFees: number;
}
export interface TicketTypePlatformFees {
  platformTicketTypeFee: PlatformTicketTypeFee;
  platformTicketTypeFeeId: number;
  ticketType: TicketType;
  ticketTypeId: number;
}
export interface TicketingLineItemsDto {
  priceId: string;
  quantity: number;
}
export interface TransferTicketDto {
  email: string;
  firstName: string;
  inviteToRegister: boolean;
  lastName: string;
  phoneNumber: string;
}
export interface UpdateAttendeeDto {
  address: DomainAddress;
  attendeeGroupId: number;
  attendeeGroupPublicAccessCode: string;
  company: string;
  contactCardFirstName: string;
  contactCardLastName: string;
  contactCardPhotoUrl: string;
  customRegistrationAnswers: CustomRegistrationAnswerDto[];
  customUrl: string;
  dateOfBirth: string;
  displayName: string;
  email: string;
  eventBrightAttendeeId: string;
  eventBrightBarcode: string;
  eventId: number;
  finishRegistration: boolean;
  firstName: string;
  healthScreening: AttendeeHealthScreeningDto;
  identificationCardPhotoBlobId: number;
  instagram: string;
  jobTitle: string;
  lastName: string;
  linkedin: string;
  phoneNumber: string;
  profilePhotoBlobId: number;
  publicEmail: string;
  source: string;
  statusId: number;
  twitter: string;
}
export interface UpdateCompanyDto {
  defaultLogoBlobId: number;
  defaultPageBackgroundBlobId: number;
  email: string;
  name: string;
  phoneNumber: string;
}
export interface UpdateEventAreaDto {
  attendeeGroups: AttendeeGroupDto[];
  eventAreaGates: EventAreaGateDto[];
  maxCheckInsPerAttendee: number;
  name: string;
}
export interface UpdateEventDto {
  about: string;
  address: DomainAddress;
  addressName: string;
  attendeeGroups: AttendeeGroupDto[];
  contactEmail: string;
  contactPhoneNumber: string;
  currentSetupStep: number;
  customRegistrationQuestions: CustomRegistrationQuestionDto[];
  endDate: string;
  eventHeaderTextColor: string;
  facebookURL: string;
  featureImageBlobId: number;
  healthScreening: EventHealthScreeningDto;
  hideDate: boolean;
  instagramURL: string;
  invitationFooter: string;
  invitationText: string;
  linkdinURL: string;
  logoBlobId: number;
  ogDescription: string;
  ogImageBlobId: number;
  ogTitle: string;
  pageBackgroundBlobId: number;
  registrationCapacity: number;
  registrationLink: string;
  registrationQuestionAddress: EventRegistrationQuestion;
  registrationQuestionDateOfBirth: EventRegistrationQuestion;
  registrationQuestionPhoneNumber: EventRegistrationQuestion;
  smartCredentials: UpdateEventSmartCredentialsDto;
  startDate: string;
  statusId: number;
  ticketing: UpdateEventTicketingDto;
  title: string;
  twitterURL: string;
  useLogoAndBackgroundInAllEvents: boolean;
  videoURL: string;
}
export interface UpdateEventSmartCredentialsDto {
  enableSmartCredentials: boolean;
  useEventBrightForCheckin: boolean;
}
export interface UpdateEventTicketingDto {
  enableTicketing: boolean;
}
export interface UpdateSpeakerDto {
  description: string;
  firstName: string;
  jobTitle: string;
  lastName: string;
  speakerLinkList: UpdateSpeakerLinkDto[];
}
export interface UpdateSpeakerLinkDto {
  id: number;
  linkName: string;
  linkURL: string;
}
export interface UpdateSuperAdminDto {
  email: string;
  firstName: string;
  lastName: string;
}
export interface UpdateTeammateDto {
  email: string;
  firstName: string;
  lastName: string;
}
export interface UpdateTeammateEventsDto {
  addedEvents: number[];
  removedEvents: number[];
}
export interface UpdateTicketTypeDto {
  attendeeGroupPublicAccessCode: string;
  description: string;
  enableHostFees: boolean;
  enableIsOnSale: boolean;
  enableLimitQuantityPerAttendee: boolean;
  enableShowTicketDescriptionOnEventName: boolean;
  enableTransferable: boolean;
  hostFeePublicIds: string[];
  name: string;
  price: number;
  priceIncludesPlatformFees: boolean;
  quantityAvailable: number;
  quantityLimitPerAttendee: number;
}
export interface UpdateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
export interface User {
  createdByUser: number;
  createdDate: string;
  email: string;
  emailVerificationCode: string;
  emailVerified: boolean;
  firstName: string;
  hasAcceptedWaiver: boolean;
  id: number;
  identityUserId: string;
  isDeleted: boolean;
  isEnterpriseUser: boolean;
  isSuperAdmin: boolean;
  lastModifiedByUser: number;
  lastModifiedDate: string;
  lastName: string;
  medicalDetails: UserMedicalDetails;
  phoneNumber: string;
  profileCompleted: boolean;
  submissionsHandled: Attendee[];
  tenantId: number;
  ticketScans: TicketScan[];
  userType: UserType;
  userTypeId: number;
  xmin: number;
}
export interface UserDto {
  email: string;
  emailVerified: boolean;
  firstName: string;
  id: number;
  isEnterpriseUser: boolean;
  isSuperAdmin: boolean;
  lastName: string;
  phoneNumber: string;
  profileCompleted: boolean;
}
export interface UserMedicalDetails {
  apiAccessRefreshToken: string;
  apiAccessToken: string;
  apiAccessTokenExpiresAt: string;
  apiSessionRefreshToken: string;
  apiSessionToken: string;
  apiSessionTokenExpiresAt: string;
  apiSyncJobId: string;
  apiSyncRetryAttempt: number;
  connectedOnDate: string;
  hasDataSources: boolean;
  hasNegativeTestResult: boolean;
  humanId: string;
  id: number;
  isSyncingWithApi: boolean;
  isVaccinated: boolean;
  lastApiSyncDate: string;
  lastConnectSessionDate: string;
  lastMedicalReSyncRequestDate: string;
  lastMedicalSyncDate: string;
  mostRecentApiSyncDate: string;
  negativeTestResultDate: string;
  testType: string;
  uniqueIdentifier: string;
  user: User;
  userId: number;
  vaccineDosesCount: number;
}
export interface UserType {
  id: number;
  name: string;
}

export interface PhotoboothSettingsDto {
  id?: number;
  enableNFC: boolean;
  enableBranding: boolean;
  enableEventLogo: boolean;
  enableDefaultOverlay: boolean;
  timer: Timer;
  transparentBackgroundOnLanding: boolean;
  overlayBlobId: number | null;
  photoboothLogoBlobId: number | null;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  securityCode: string;
}
