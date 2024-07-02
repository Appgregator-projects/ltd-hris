import Typesense from "typesense";
const API = import.meta.env.VITE_APP_TYPESENSE_API_KEY;

export let clientTypessense = new Typesense.Client({
     nodes: [
          {
               host: import.meta.env.VITE_APP_TYPESENSE_HOST,
               port: "443",
               protocol: "https",
          },
     ],
     apiKey: API,
     connectionTimeoutSeconds: 2,
});
