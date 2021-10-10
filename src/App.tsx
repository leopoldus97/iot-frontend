import "./App.css";
// import NavbarComp from "./components/ui/NavbarComp";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import Routing from "./pages/Routing";

const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql",
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:3000/graphql",
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <div className="App">
      {/* <NavbarComp /> */}
      <ApolloProvider client={client}>
        <Routing />
      </ApolloProvider>
    </div>
  );
}

export default App;
