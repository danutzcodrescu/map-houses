import House from "../models/houses.model";
import { QueryResolvers } from "../generated/graphqlgen";

export const Query: QueryResolvers.Type = {
  getRegions: async () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return House.aggregate([
      { $match: { createdAt: { $gte: date } } },
      { $group: { _id: "$zipCode", count: { $sum: 1 } } },
      { $project: { _id: 0, zipCode: "$_id", houses: "$count" } }
    ]).exec();
  },
  getHousesPerZipCode: async (_, args) => {
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
  }
};
