import House from "../models/houses.model";
import { QueryResolvers } from "../generated/graphqlgen";

export const Query = {
  getRegions: async () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return House.aggregate([
      { $match: { createdAt: { $gte: date } } },
      { $group: { _id: "$zipCode", count: { $sum: 1 } } },
      { $project: { _id: 0, zipCode: "$_id", houses: "$count" } }
    ]).exec();
  },
  getHousesPerZipCode: async (_: any, args: any) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return House.aggregate([
      {
        $match: {
          createdAt: { $gte: date },
          zipCode: args.zipCode
        }
      }
    ]);
  },

  getHouseData: async (_: any, args: any) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const houseData: any = House.findOne({
      externalId: args.externalId,
      createdAt: { $gte: date }
    });
    const priceData: any = House.find(
      { externalId: args.externalId },
      { _id: 0, price: 1, createdAt: 1 }
    );
    const [house, prices] = await Promise.all([houseData, priceData]);
    console.log(house);
    house.prices = prices;
    return house;
  }
};
