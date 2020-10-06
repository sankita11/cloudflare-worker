const corsHeaders = {
  "Access-Control-Allow-Origin": "https://sankita11.github.io",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Method": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers":
    "Access-Control-Allow-Headers, content-type, Access-Control-Allow-Origin,Access-Control-Allow-Method, Access-Control-Allow-Credentials",
  Allow: "GET, HEAD, POST, OPTIONS",
};

const noCookieScript = `
  fetch( 'https://sweeps-project-1.ankita-11.workers.dev/', {
    
    method: 'POST',
    body: JSON.stringify({'name': name, 'quote': quote}),
    credentials: 'include',
    origin : 'https://sankita11.github.io',
    headers : {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin':'https://sankita11.github.io' ,
    'Access-Control-Allow-Method': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Credentials': "true",
    'Access-Control-Allow-Headers': 
    'Access-Control-Allow-Headers, content-type, Access-Control-Allow-Origin,Access-Control-Allow-Method, Access-Control-Allow-Credentials'
    }
  }).then( res => {
      if( res.status == 200 ){
              fetch('https://api.ipify.org/?format=json')
              .then(response => response.json())
              .then(data => console.log("Visitor IP: " + data.ip))
              .catch(error => {
                  console.log('There has been a problem with your fetch operation:', error);
              });
      }
  });
`;

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Gets the cookie string
 * @param {string} cookieKey of the cookie
 * @param {string} cookieValue of the cookie
 * @param {string} expireDate of the cookie
 */
function getCookieStr(cookieKey, cookieValue, expireDate) {
  const str =
    cookieKey +
    "=" +
    cookieValue +
    "; Domain=.ankita-11.workers.dev; path=/;Expires=" +
    expireDate;
  return str;
}

async function readRequestBody(request) {
  const { headers } = request;

  const contentType = headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const requestJSON = await request.json();

    const currentDate = new Date();
    const expireDate = new Date(
      currentDate.setFullYear(currentDate.getFullYear() + 100)
    ).toUTCString();

    const response = new Response(
      JSON.stringify({
        successMsg: "Request processed successfully",
      }),
      {
        headers: corsHeaders,
      }
    );
    response.headers.append("content-type", "application/json");

    response.headers.append(
      "Set-Cookie",
      getCookieStr("name", requestJSON["name"], expireDate)
    );
    response.headers.append(
      "Set-Cookie",
      getCookieStr("quote", requestJSON["quote"], expireDate)
    );

    return response;
  } else {
    const response = new Response(
      JSON.stringify({
        errorMsg: "Error processing request.",
      }),
      {
        headers: corsHeaders,
        status: 500,
      }
    );
    response.headers.append("content-type", "application/json");
    return response;
  }
}

async function handleRequest(request) {
  if (request.method == "POST") {
    const response = await readRequestBody(request);
    return response;
  } else {
    const nameCookie = getCookie(request, "name");
    const quoteCookie = getCookie(request, "quote");

    const cookieExistScript = `
    console.log('cookies on worker domain :-');
    console.log('name=${nameCookie}');
    console.log('quote=${quoteCookie}');
    document.cookie = 'local_name=${nameCookie};path=/'
    document.cookie = 'local_quote=${quoteCookie};path=/'
  `;

    let scriptToReturn =
      !nameCookie && !quoteCookie ? noCookieScript : cookieExistScript;

    const response = new Response(scriptToReturn, {
      headers: corsHeaders,
    });
    response.headers.append("content-type", "text/javascript");
    return response;
  }
}

/**
 * Gets the cookie with the name from the request headers
 * @param {Request} request incoming Request
 * @param {string} name of the cookie to get
 */
function getCookie(request, name) {
  let result = "";
  const cookieString = request.headers.get("Cookie");

  if (cookieString) {
    const cookies = cookieString.split(";");
    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      if (cookieName === name) {
        const cookieVal = cookie.split("=")[1];
        result = cookieVal;
      }
    });
  }
  return result;
}
