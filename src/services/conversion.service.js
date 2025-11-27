const Cache = require('../utils/cache');

class ConversionService {
  constructor() {
    this.apiKey = process.env.CMC_API_KEY;
    this.baseUrl = process.env.CMC_URL;

    // Add caching storage
    this.cache = new Cache(60);
  }

  async getPrice(cryptoSymbol, fiatCurrency) {
    // eslint-disable-next-line no-useless-catch
    try {
      const key = `${cryptoSymbol}_${fiatCurrency}`;

      // 1. Check cache
      const cached = this.cache.get(key);
      if (cached !== null) {
        return cached;
      }

      // 2. Fetch from CoinMarketCap
      const url = `${this.baseUrl}?symbol=${cryptoSymbol}&convert=${fiatCurrency}`;
      const resp = await fetch(url, {
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey,
          Accept: 'application/json',
        },
      });
      if (!resp.ok) {
        throw new Error(`CMC request failed: ${resp.status}`);
      }

      const json = await resp.json();
      const price = json?.data?.[cryptoSymbol]?.quote?.[fiatCurrency]?.price;
      if (!price) {
        throw new Error('Invalid price response structure');
      }

      // 3. Store in cache
      this.cache.set(key, price);

      return price;
    } catch (error) {
      throw error;
    }
  }

  async convertFiatToCrypto(amount, fiatCurrency, cryptoSymbol) {
    const price = await this.getPrice(cryptoSymbol, fiatCurrency);
    return {
      cryptoSymbol,
      fiatCurrency,
      fiatAmount: amount,
      pricePerUnit: price,
      cryptoAmount: amount / price,
    };
  }
}

module.exports = new ConversionService();
