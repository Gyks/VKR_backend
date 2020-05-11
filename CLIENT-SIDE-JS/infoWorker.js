const _host = window.document.location.host;
const userStorage = window.localStorage;

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}

if (userStorage.userId) {
  const rs = fetch("http://megami.red:3333/user/get?id=" + userStorage.userId)
    .then((response) => response.json())
    .then((data) => console.log(data));
} else {
  const rs = postData("http://megami.red:3333/user/add", {
    domain: _host,
  }).then((response) => {
    userStorage.setItem("userId", response.rows[0].uid);
  });
}

function createUIID() {
  let id = 0;
  return function closure() {
    id++;
    return "UUID" + id;
  };
}

let addId = createUIID();
let fullDomObject = new Array();
document.addEventListener("DOMContentLoaded", function (event) {
  const elements = window.document.all;
  for (item of elements) {
    let id = addId();
    fullDomObject.push({
      element: item,
      id: id,
    });
  }
  document.addEventListener("click", (event) => {
    console.log(event.target);
    for (item of fullDomObject) {
      if (item.element === event.target) {
        // TODO брать время из клиента, а не сервера
        console.log(item.id);
        const rs = postData("http://megami.red:3333/click/add", {
          visitorId: userStorage.userId,
          href: window.document.location.href,
          elementId: item.id,
          elementHtml: item.element.outerHTML,
        }).then((response) => {
          console.log(response);
        });
      }
    }
  });
});

// TODO Скачивания всего DOM и анализ
