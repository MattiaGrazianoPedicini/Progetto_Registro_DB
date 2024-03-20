export const send = (t, url) => {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(t),
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => {
            console.error("Error:", error);
        });
};

export const load = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => response.json())
            .then((json) => {
                resolve(json);
            });
    });
};