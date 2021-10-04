import "./App.css";
import Temperature from "./pages/Temperature";
// import NavbarComp from "./components/ui/NavbarComp";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <div className="App">
      {/* <NavbarComp /> */}
      <ApolloProvider client={client}>
        <Temperature />
      </ApolloProvider>
    </div>
  );
}

export default App;
