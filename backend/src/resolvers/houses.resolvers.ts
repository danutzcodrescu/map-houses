import House from '../models/houses.model';

export const Query = {
  getRegions: async () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return House.aggregate([
      { $match: { createdAt: { $gte: date } } },
      { $group: { _id: '$zipCode', count: { $sum: 1 } } },
      { $project: { _id: 0, zipCode: '$_id', houses: '$count' } },
    ]).exec();
  },
  getHousesPerZipCode: async (_: any, args: any) => {
    const date = new Date();
    const min = args.min || 200_000;
    const max = args.max || 500_000;
    if (min > max) {
      throw new Error('check price limits');
    }
    date.setHours(0, 0, 0, 0);
    return House.aggregate([
      {
        $match: {
          createdAt: { $gte: date },
          zipCode: args.zipCode,
          price: { $gte: min, $lte: max },
        },
      },
    ]);
  },

  getHouseData: async (_: any, args: any) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const houseData: any = House.findOne({
      externalId: args.externalId,
      createdAt: { $gte: date },
    });
    const priceData: any = House.find(
      { externalId: args.externalId },
      { _id: 0, price: 1, createdAt: 1 },
    );
    const [house, prices] = await Promise.all([houseData, priceData]);
    house.prices = prices;
    return house;
  },

  getCommuneStatistics: async (_: any, args: any) => {
    const avgs: any = House.aggregate([
      {
        $match: {
          zipCode: args.zipCode,
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: '$createdAt',
            },
            day: {
              $dayOfMonth: '$createdAt',
            },
            year: {
              $year: '$createdAt',
            },
          },
          avg_price: {
            $avg: '$price',
          },
          avg_surface: {
            $avg: '$surface',
          },
          avg_nb_rooms: {
            $avg: '$rooms',
          },
        },
      },
    ]);
    const onMarket: any = House.aggregate([
      {
        $match: {
          zipCode: args.zipCode,
        },
      },
      {
        $group: {
          _id: '$externalId',
          first: { $first: '$createdAt' },
          last: { $last: '$createdAt' },
        },
      },
      {
        $addFields: {
          difference: { $subtract: ['$last', '$first'] },
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$difference' },
        },
      },
    ]);
    const [avgsResult, onMarketResult] = await Promise.all([avgs, onMarket]);
    return {
      dailyAverage: avgsResult.map((elem: any) => ({
        ...elem,
        date: new Date(elem._id.year, elem._id.month, elem._id.day),
      })),
      onMarketAvg: onMarketResult[0].avg,
    };
  },
};
