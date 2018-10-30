import gql from 'graphql-tag';

const isDashboardOpen = gql`
  {
    isDashboardOpen @client
  }
`;

export const resolvers = {
  Mutation: {
    changeCommune: (_, { zip }, { cache }) => {
      cache.writeData({ data: { zip, isDashboardOpen: true } });
      return zip;
    },

    toggleDashboard: (_, __, { cache }) => {
      const status = cache.readQuery({ query: isDashboardOpen });
      cache.writeData({ data: { isDashboardOpen: !status.isDashboardOpen } });
      return status;
    },

    selectedHouse: (_, { externalId }, { cache }) => {
      cache.writeData({ data: { selectedHouse: externalId } });
      return externalId;
    }
  }
};
