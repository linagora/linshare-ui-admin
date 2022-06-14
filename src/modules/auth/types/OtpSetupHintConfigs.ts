export default interface OtpSetupHintConfigs {
  secret: string;
  issuer: string;
  account: string;
  type: string;
  digits: number;
  algorithm: string;
  period: number;
}
