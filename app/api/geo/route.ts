import { geolocation } from '@vercel/functions';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getExchangeRates } from '@/actions/exchange/get-exchange-rates';
import {
  CURRENCY_BY_COUNTRY,
  DEFAULT_COUNTRY_CODE,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  DEFAULT_TIMEZONE,
} from '@/constants/locale';

export const GET = async (req: NextRequest) => {
  try {
    const { exchangeRates } = await getExchangeRates();
    const geo = geolocation(req);

    const currency =
      CURRENCY_BY_COUNTRY[
        (geo.country ?? DEFAULT_COUNTRY_CODE) as keyof typeof CURRENCY_BY_COUNTRY
      ] ?? DEFAULT_CURRENCY;

    const locale = { currency, locale: DEFAULT_LOCALE };
    const details = {
      city: geo.city,
      country: geo.country,
      countryCode: geo.country,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone: DEFAULT_TIMEZONE,
    };

    return NextResponse.json({
      details,
      exchangeRates,
      locale,
    });
  } catch (error) {
    console.error('[GET_GEO]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
