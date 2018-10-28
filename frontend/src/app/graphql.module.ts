import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { environment } from '../environments/environment';
import { withClientState } from 'apollo-link-state';
import { defaults } from './apollo/defaults';
import { resolvers } from './apollo/resolvers';

const uri = environment.graphql; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {
  const cache = new InMemoryCache();
  const local = withClientState({
    cache,
    defaults,
    resolvers
  });
  return { link: local.concat(httpLink.create({ uri })), cache };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule {}
