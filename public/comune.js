export const send = (t, url) => {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      username: sessionStorage.getItem("username"),
      password: sessionStorage.getItem("password"),
    },
    body: JSON.stringify({ cose: t }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const load = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        username: sessionStorage.getItem("username"),
        password: sessionStorage.getItem("password"),
      },
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      });
  });
};
