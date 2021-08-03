export interface OPDSLinkProperties {
  /**
   * Provide a hint about the expected number of items returned
   */
  numberOfItems?: number;
  /**
   * The price of a publication is tied to its acquisition link
   */
  price?: {
    value: number;
    currency:
      | 'AED'
      | 'AFN'
      | 'ALL'
      | 'AMD'
      | 'ANG'
      | 'AOA'
      | 'ARS'
      | 'AUD'
      | 'AWG'
      | 'AZN'
      | 'BAM'
      | 'BBD'
      | 'BDT'
      | 'BGN'
      | 'BHD'
      | 'BIF'
      | 'BMD'
      | 'BND'
      | 'BOB'
      | 'BOV'
      | 'BRL'
      | 'BSD'
      | 'BTN'
      | 'BWP'
      | 'BYN'
      | 'BZD'
      | 'CAD'
      | 'CDF'
      | 'CHE'
      | 'CHF'
      | 'CHW'
      | 'CLF'
      | 'CLP'
      | 'CNY'
      | 'COP'
      | 'COU'
      | 'CRC'
      | 'CUC'
      | 'CUP'
      | 'CVE'
      | 'CZK'
      | 'DJF'
      | 'DKK'
      | 'DOP'
      | 'DZD'
      | 'EGP'
      | 'ERN'
      | 'ETB'
      | 'EUR'
      | 'FJD'
      | 'FKP'
      | 'GBP'
      | 'GEL'
      | 'GHS'
      | 'GIP'
      | 'GMD'
      | 'GNF'
      | 'GTQ'
      | 'GYD'
      | 'HKD'
      | 'HNL'
      | 'HRK'
      | 'HTG'
      | 'HUF'
      | 'IDR'
      | 'ILS'
      | 'INR'
      | 'IQD'
      | 'IRR'
      | 'ISK'
      | 'JMD'
      | 'JOD'
      | 'JPY'
      | 'KES'
      | 'KGS'
      | 'KHR'
      | 'KMF'
      | 'KPW'
      | 'KRW'
      | 'KWD'
      | 'KYD'
      | 'KZT'
      | 'LAK'
      | 'LBP'
      | 'LKR'
      | 'LRD'
      | 'LSL'
      | 'LYD'
      | 'MAD'
      | 'MDL'
      | 'MGA'
      | 'MKD'
      | 'MMK'
      | 'MNT'
      | 'MOP'
      | 'MRU'
      | 'MUR'
      | 'MVR'
      | 'MWK'
      | 'MXN'
      | 'MXV'
      | 'MYR'
      | 'MZN'
      | 'NAD'
      | 'NGN'
      | 'NIO'
      | 'NOK'
      | 'NPR'
      | 'NZD'
      | 'OMR'
      | 'PAB'
      | 'PEN'
      | 'PGK'
      | 'PHP'
      | 'PKR'
      | 'PLN'
      | 'PYG'
      | 'QAR'
      | 'RON'
      | 'RSD'
      | 'RUB'
      | 'RWF'
      | 'SAR'
      | 'SBD'
      | 'SCR'
      | 'SDG'
      | 'SEK'
      | 'SGD'
      | 'SHP'
      | 'SLL'
      | 'SOS'
      | 'SRD'
      | 'SSP'
      | 'STN'
      | 'SVC'
      | 'SYP'
      | 'SZL'
      | 'THB'
      | 'TJS'
      | 'TMT'
      | 'TND'
      | 'TOP'
      | 'TRY'
      | 'TTD'
      | 'TWD'
      | 'TZS'
      | 'UAH'
      | 'UGX'
      | 'USD'
      | 'USN'
      | 'UYI'
      | 'UYU'
      | 'UZS'
      | 'VEF'
      | 'VES'
      | 'VND'
      | 'VUV'
      | 'WST'
      | 'XAF'
      | 'XAG'
      | 'XAU'
      | 'XBA'
      | 'XBB'
      | 'XBC'
      | 'XBD'
      | 'XCD'
      | 'XDR'
      | 'XOF'
      | 'XPD'
      | 'XPF'
      | 'XPT'
      | 'XSU'
      | 'XTS'
      | 'XUA'
      | 'XXX'
      | 'YER'
      | 'ZAR'
      | 'ZMW'
      | 'ZWL';
    [k: string]: unknown;
  };
  /**
   * Indirect acquisition provides a hint for the expected media type that will be acquired after additional steps
   */
  indirectAcquisition?: OPDSAcquisitionObject[];
  /**
   * Library-specific feature for unavailable books that support a hold list
   */
  holds?: {
    total?: number;
    position?: number;
    [k: string]: unknown;
  };
  /**
   * Library-specific feature that contains information about the copies that a library has acquired
   */
  copies?: {
    total?: number;
    available?: number;
    [k: string]: unknown;
  };
  /**
   * Indicates the availability of a given resource
   */
  availability?: {
    state: 'available' | 'unavailable' | 'reserved' | 'ready';
    /**
     * Timestamp for the previous state change
     */
    since?: (
      | {
          [k: string]: unknown;
        }
      | {
          [k: string]: unknown;
        }
    ) &
      string;
    /**
     * Timestamp for the next state change
     */
    until?: (
      | {
          [k: string]: unknown;
        }
      | {
          [k: string]: unknown;
        }
    ) &
      string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export interface OPDSAcquisitionObject {
  type: string;
  child?: OPDSAcquisitionObject[];
  [k: string]: unknown;
}
