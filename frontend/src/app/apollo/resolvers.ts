export const resolvers = {
  Mutation: {
    changeCommune: (_, { zip }, { cache }) => {
      cache.writeData({ data: { zip } });
      return zip;
    }
  }
};
