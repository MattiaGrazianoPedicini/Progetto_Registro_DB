import { load } from "../comune.js";

load("/classi").then((data) => {
  console.log(data);
});
